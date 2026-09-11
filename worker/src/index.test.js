import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import worker from "./index.js";

const originalFetch = globalThis.fetch;
const queued = [];
const baseEnv = {
  ALLOWED_ORIGINS: "https://samosasheet.com,https://www.samosasheet.com",
  FROM_EMAIL: "Samosa Sheet Website <website@mail.samosasheet.com>",
  TO_EMAIL: "orders@samosasheet.com",
  RESEND_API_KEY: "test-key",
};

const productPayload = {
  kind: "Product order",
  fields: {
    Product: "Small Samosa Sheet",
    "Sheet size": "5 × 5 inch",
    "Pack size": "100 sheets",
    Quantity: "2 packs",
    "Customer phone": "919876543210",
    "Delivery address": "12 Test Street, Chennai 600001",
  },
};

const wholesalePayload = {
  kind: "Bulk enquiry",
  fields: {
    "Business name": "Test Restaurant",
    Location: "Chennai",
    Product: "Large Samosa Sheet",
    "Sheet size": "8 × 8 inch",
    "Pack size": "100 sheets",
    Quantity: "20 packs",
    Frequency: "Weekly",
  },
};

const contactPayload = {
  kind: "Contact enquiry",
  fields: {
    Name: "Test Customer",
    Phone: "919876543210",
    Email: "customer@example.com",
    "Enquiry type": "Product information",
    Message: "Please share the current product details.",
  },
};

function env(overrides = {}) {
  return {
    ...baseEnv,
    ENQUIRY_QUEUE: { send: async (message) => queued.push(message) },
    ...overrides,
  };
}

function request(body = productPayload, origin = "https://samosasheet.com") {
  return new Request("https://api.samosasheet.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, "X-Request-ID": "test-request-1" },
    body: JSON.stringify(body),
  });
}

function queueMessage(body) {
  const state = { acked: false, retried: false };
  return {
    state,
    message: {
      body,
      ack: () => { state.acked = true; },
      retry: () => { state.retried = true; },
    },
  };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  queued.length = 0;
});

for (const [name, payload] of [["product", productPayload], ["wholesale", wholesalePayload], ["contact", contactPayload]]) {
  test(`validates and queues a ${name} enquiry`, async () => {
    const response = await worker.fetch(request(payload), env());
    const result = await response.json();

    assert.equal(response.status, 202);
    assert.equal(result.queued, true);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://samosasheet.com");
    assert.equal(queued.length, 1);
    assert.equal(queued[0].kind, payload.kind);
    assert.equal(queued[0].requestId, "test-request-1");
  });
}

test("queue consumer emails once and acknowledges a successful message", async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({ id: "email-id" });
  };
  const { message, state } = queueMessage({ requestId: "test-request-1", kind: productPayload.kind, fields: Object.entries(productPayload.fields) });

  await worker.queue({ messages: [message] }, env());
  const email = JSON.parse(sent.init.body);

  assert.equal(state.acked, true);
  assert.equal(state.retried, false);
  assert.equal(sent.url, "https://api.resend.com/emails");
  assert.equal(sent.init.headers["Idempotency-Key"], "enquiry/test-request-1");
  assert.equal(email.from, baseEnv.FROM_EMAIL);
  assert.deepEqual(email.to, [baseEnv.TO_EMAIL]);
});

test("queue consumer uses a valid contact email as Reply-To", async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({ id: "email-id" });
  };
  const { message } = queueMessage({ requestId: "contact-request-1", kind: contactPayload.kind, fields: Object.entries(contactPayload.fields) });

  await worker.queue({ messages: [message] }, env());

  assert.equal(JSON.parse(sent.init.body).reply_to, "customer@example.com");
});

test("queue consumer retries when the email provider fails", async () => {
  globalThis.fetch = async () => new Response("failed", { status: 503 });
  const { message, state } = queueMessage({ requestId: "test-request-1", kind: productPayload.kind, fields: Object.entries(productPayload.fields) });

  await worker.queue({ messages: [message] }, env());

  assert.equal(state.acked, false);
  assert.equal(state.retried, true);
});

test("rejects unapproved origins without queueing", async () => {
  const response = await worker.fetch(request(productPayload, "https://example.com"), env());

  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(queued.length, 0);
});

test("fails closed when the queue binding is missing", async () => {
  const response = await worker.fetch(request(), env({ ENQUIRY_QUEUE: undefined }));

  assert.equal(response.status, 503);
  assert.equal(queued.length, 0);
});

test("rejects unsupported content types", async () => {
  const response = await worker.fetch(new Request("https://api.samosasheet.com/", {
    method: "POST",
    headers: { "Content-Type": "text/plain", Origin: "https://samosasheet.com" },
    body: "not-json",
  }), env());

  assert.equal(response.status, 415);
});
