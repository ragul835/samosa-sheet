import { errorName, logEvent } from "@/lib/logger";

export type EnquiryPayload = {
  kind: "Product order" | "Bulk enquiry" | "Contact enquiry";
  fields: Record<string, string | number>;
  website?: string;
};

export const enquiryEmailEnabled = Boolean(process.env.NEXT_PUBLIC_ENQUIRY_API_URL?.trim());

function createRequestId() {
  // randomUUID is restricted to secure browser contexts. Keep WhatsApp-only
  // submissions working during an HTTP-to-HTTPS migration or on older browsers;
  // this value is for log correlation, not authentication or authorization.
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function emailThenOpenWhatsApp(payload: EnquiryPayload, whatsappUrl: string) {
  const requestId = createRequestId();
  const startedAt = performance.now();
  const popup = window.open("about:blank", "_blank");
  const endpoint = process.env.NEXT_PUBLIC_ENQUIRY_API_URL?.trim();
  if (popup) popup.opener = null;

  logEvent("info", "enquiry_submission_started", {
    requestId,
    enquiryKind: payload.kind,
    emailEnabled: Boolean(endpoint),
  });

  try {
    if (endpoint && !payload.website) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Request-ID": requestId },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = new Error("The email notification could not be sent.");
        logEvent("error", "enquiry_api_failed", {
          requestId,
          enquiryKind: payload.kind,
          status: response.status,
          durationMs: Math.round(performance.now() - startedAt),
        });
        throw error;
      }
    }

    if (popup) popup.location.href = whatsappUrl;
    else window.location.assign(whatsappUrl);
    logEvent("info", "enquiry_whatsapp_opened", {
      requestId,
      enquiryKind: payload.kind,
      emailed: Boolean(endpoint),
      durationMs: Math.round(performance.now() - startedAt),
    });
    return { emailed: Boolean(endpoint) };
  } catch (error) {
    popup?.close();
    logEvent("error", "enquiry_submission_failed", {
      requestId,
      enquiryKind: payload.kind,
      errorType: errorName(error),
      durationMs: Math.round(performance.now() - startedAt),
    });
    throw error;
  }
}
