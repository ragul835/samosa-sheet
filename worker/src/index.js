const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const MAX_BODY_BYTES = 20_000;
const REQUEST_ID_PATTERN = /^[a-zA-Z0-9-]{1,64}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function response(body, status, origin, requestId) {
  const corsHeaders = origin ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Expose-Headers": "X-Request-ID",
    Vary: "Origin",
  } : {};
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...corsHeaders,
      "X-Request-ID": requestId,
    },
  });
}

function clean(value, maxLength = 1000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function log(level, event, data = {}) {
  console[level](JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "samosa-sheet-enquiries",
    event,
    ...data,
  }));
}

function allowedOrigins(env) {
  return new Set(clean(env.ALLOWED_ORIGINS, 1000)
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean));
}

async function deliverEmail(enquiry, env) {
  const { requestId, kind, fields } = enquiry || {};
  if (!REQUEST_ID_PATTERN.test(requestId) || !Array.isArray(fields) || !fields.length) {
    throw new Error("Invalid queued enquiry");
  }
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL) {
    throw new Error("Email service configuration is missing");
  }

  const text = fields.map(([key, value]) => `${key}: ${value}`).join("\n");
  const rows = fields.map(([key, value]) => `<tr><th style="padding:8px;text-align:left;vertical-align:top;background:#f7f7f7">${escapeHtml(key)}</th><td style="padding:8px">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const replyTo = kind === "Contact enquiry" ? fields.find(([key]) => key === "Email")?.[1] : "";
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `enquiry/${requestId}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      ...(replyTo && replyTo !== "Not provided" && EMAIL_PATTERN.test(replyTo) ? { reply_to: replyTo } : {}),
      subject: `${kind} from the website`,
      text: `${kind}\n\n${text}`,
      html: `<h2>${escapeHtml(kind)}</h2><table style="border-collapse:collapse;width:100%" border="1" cellpadding="0" cellspacing="0">${rows}</table>`,
    }),
  });

  if (!emailResponse.ok) {
    throw new Error(`Email provider returned status ${emailResponse.status}`);
  }
  return emailResponse.status;
}

export default {
  async fetch(request, env) {
    const startedAt = Date.now();
    const suppliedRequestId = request.headers.get("X-Request-ID") || "";
    const requestId = REQUEST_ID_PATTERN.test(suppliedRequestId) ? suppliedRequestId : crypto.randomUUID();
    const origin = request.headers.get("Origin") || "";
    const requestOrigin = origin.replace(/\/$/, "");
    const originAllowed = allowedOrigins(env).has(requestOrigin);
    const finish = (body, status, event, extra = {}) => {
      log(status >= 500 ? "error" : status >= 400 ? "warn" : "info", event, {
        requestId,
        method: request.method,
        status,
        durationMs: Date.now() - startedAt,
        ...extra,
      });
      return response(body, status, originAllowed ? requestOrigin : "", requestId);
    };

    log("info", "request_received", { requestId, method: request.method });
    if (!originAllowed) return finish({ error: "Origin not allowed" }, 403, "request_rejected", { reason: "origin" });

    if (request.method === "OPTIONS") {
      log("info", "cors_preflight_completed", { requestId, method: request.method, status: 204, durationMs: Date.now() - startedAt });
      return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": requestOrigin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-Request-ID", "Access-Control-Max-Age": "86400", "X-Request-ID": requestId, Vary: "Origin" } });
    }
    if (request.method !== "POST") return finish({ error: "Method not allowed" }, 405, "request_rejected", { reason: "method" });
    if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return finish({ error: "Content-Type must be application/json" }, 415, "request_rejected", { reason: "content_type" });
    if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return finish({ error: "Payload too large" }, 413, "request_rejected", { reason: "payload_size" });

    let payload;
    try {
      const body = await request.text();
      if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) return finish({ error: "Payload too large" }, 413, "request_rejected", { reason: "payload_size" });
      payload = JSON.parse(body);
    } catch { return finish({ error: "Invalid JSON" }, 400, "request_rejected", { reason: "invalid_json" }); }
    if (clean(payload.website, 200)) return finish({ ok: true }, 200, "honeypot_accepted");

    const allowedKinds = new Set(["Product order", "Bulk enquiry", "Contact enquiry"]);
    const kind = clean(payload.kind, 60);
    const entries = payload.fields && typeof payload.fields === "object" ? Object.entries(payload.fields).slice(0, 16) : [];
    if (!allowedKinds.has(kind) || !entries.length) return finish({ error: "Invalid enquiry" }, 400, "request_rejected", { reason: "invalid_enquiry" });

    const fieldSchemas = {
      "Product order": ["Product", "Sheet size", "Pack size", "Quantity", "Customer phone", "Delivery address"],
      "Bulk enquiry": ["Business name", "Location", "Product", "Sheet size", "Pack size", "Quantity", "Frequency"],
      "Contact enquiry": ["Name", "Phone", "Email", "Enquiry type", "Message"],
    };
    const allowedFields = new Set(fieldSchemas[kind] || []);
    const fields = entries.map(([key, value]) => [clean(key, 80), clean(value, 2000)]).filter(([key, value]) => allowedFields.has(key) && value);
    if (fields.length !== allowedFields.size) return finish({ error: "Missing details" }, 400, "request_rejected", { reason: "missing_details", enquiryKind: kind });
    if (!fields.length) return finish({ error: "Missing details" }, 400, "request_rejected", { reason: "missing_details", enquiryKind: kind });
    if (!env.ENQUIRY_QUEUE?.send) return finish({ error: "Enquiry service is unavailable" }, 503, "queue_configuration_missing", { enquiryKind: kind });
    try {
      await env.ENQUIRY_QUEUE.send({ requestId, kind, fields });
    } catch (error) {
      return finish({ error: "Enquiry could not be queued" }, 503, "enquiry_queue_failed", { enquiryKind: kind, errorType: error instanceof Error ? error.name : "UnknownError" });
    }
    return finish({ ok: true, queued: true, requestId }, 202, "enquiry_queued", { enquiryKind: kind });
  },

  async queue(batch, env) {
    for (const message of batch.messages) {
      const requestId = REQUEST_ID_PATTERN.test(message.body?.requestId) ? message.body.requestId : crypto.randomUUID();
      const startedAt = Date.now();
      try {
        const providerStatus = await deliverEmail({ ...message.body, requestId }, env);
        message.ack();
        log("info", "enquiry_email_accepted", {
          requestId,
          enquiryKind: message.body?.kind || "Unknown",
          providerStatus,
          durationMs: Date.now() - startedAt,
        });
      } catch (error) {
        message.retry();
        log("error", "enquiry_email_retry_requested", {
          requestId,
          enquiryKind: message.body?.kind || "Unknown",
          errorType: error instanceof Error ? error.name : "UnknownError",
          durationMs: Date.now() - startedAt,
        });
      }
    }
  },
};
