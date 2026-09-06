const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

function response(body, status, origin, requestId) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Expose-Headers": "X-Request-ID",
      "X-Request-ID": requestId,
      Vary: "Origin",
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

export default {
  async fetch(request, env) {
    const startedAt = Date.now();
    const suppliedRequestId = request.headers.get("X-Request-ID") || "";
    const requestId = /^[a-zA-Z0-9-]{1,64}$/.test(suppliedRequestId) ? suppliedRequestId : crypto.randomUUID();
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = clean(env.ALLOWED_ORIGIN, 300).replace(/\/$/, "");
    const requestOrigin = origin.replace(/\/$/, "");
    const finish = (body, status, event, extra = {}) => {
      log(status >= 500 ? "error" : status >= 400 ? "warn" : "info", event, {
        requestId,
        method: request.method,
        status,
        durationMs: Date.now() - startedAt,
        ...extra,
      });
      return response(body, status, allowedOrigin || "null", requestId);
    };

    log("info", "request_received", { requestId, method: request.method });
    if (!allowedOrigin || requestOrigin !== allowedOrigin) return finish({ error: "Origin not allowed" }, 403, "request_rejected", { reason: "origin" });

    if (request.method === "OPTIONS") {
      log("info", "cors_preflight_completed", { requestId, method: request.method, status: 204, durationMs: Date.now() - startedAt });
      return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": allowedOrigin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-Request-ID", "Access-Control-Max-Age": "86400", "X-Request-ID": requestId, Vary: "Origin" } });
    }
    if (request.method !== "POST") return finish({ error: "Method not allowed" }, 405, "request_rejected", { reason: "method" });
    if (Number(request.headers.get("Content-Length") || 0) > 20000) return finish({ error: "Payload too large" }, 413, "request_rejected", { reason: "payload_size" });

    let payload;
    try { payload = await request.json(); } catch { return finish({ error: "Invalid JSON" }, 400, "request_rejected", { reason: "invalid_json" }); }
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
    const text = fields.map(([key, value]) => `${key}: ${value}`).join("\n");
    const rows = fields.map(([key, value]) => `<tr><th style="padding:8px;text-align:left;vertical-align:top;background:#f7f7f7">${escapeHtml(key)}</th><td style="padding:8px">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("");

    let emailResponse;
    try {
      emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: [env.TO_EMAIL || "samosasheet@gmail.com"],
          subject: `${kind} from the website`,
          text: `${kind}\n\n${text}`,
          html: `<h2>${escapeHtml(kind)}</h2><table style="border-collapse:collapse;width:100%" border="1" cellpadding="0" cellspacing="0">${rows}</table>`,
        }),
      });
    } catch (error) {
      return finish({ error: "Email delivery failed" }, 502, "email_delivery_failed", { enquiryKind: kind, errorType: error instanceof Error ? error.name : "UnknownError" });
    }
    if (!emailResponse.ok) {
      return finish({ error: "Email delivery failed" }, 502, "email_delivery_failed", { enquiryKind: kind, providerStatus: emailResponse.status });
    }
    return finish({ ok: true }, 200, "enquiry_completed", { enquiryKind: kind });
  },
};
