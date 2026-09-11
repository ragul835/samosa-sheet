# Enquiry Email and WhatsApp Deployment Runbook

This document is the end-to-end setup, deployment, testing, and recovery guide
for the Samosa Sheet website enquiry system.

## 1. What the system does

The production flow is:

1. A customer submits a product order, wholesale enquiry, or contact enquiry.
2. The browser sends the enquiry to `https://api.samosasheet.com/`.
3. The Cloudflare Worker validates and adds it to a durable Queue.
4. WhatsApp opens immediately with the prepared message.
5. The queue consumer sends an email through Resend.
6. Cloudflare retries a failed email up to five times, with 60 seconds between
   attempts.
7. A message that exhausts all retries moves to
   `samosa-sheet-enquiries-dlq` for investigation.

Email success is deliberately not allowed to block WhatsApp. The website can
open a prepared WhatsApp message, but the customer must press **Send** inside
WhatsApp. A website cannot guarantee WhatsApp delivery.

## 2. Production names and addresses

| Purpose | Production value |
| --- | --- |
| Website | `https://samosasheet.com` |
| Enquiry API | `https://api.samosasheet.com/` |
| Public receiving address | `orders@samosasheet.com` |
| Forwarding destination | `samosasheet@gmail.com` |
| Resend sending domain | `mail.samosasheet.com` |
| Automated sender | `Samosa Sheet Website <website@mail.samosasheet.com>` |
| Website Worker | `samosa-sheet` |
| Email Worker | `samosa-sheet-enquiries` |
| Main queue | `samosa-sheet-enquiries` |
| Dead-letter queue | `samosa-sheet-enquiries-dlq` |

`website@mail.samosasheet.com` is a sending identity and does not require a
mailbox. `orders@samosasheet.com` is the public receiving address.

## 3. Prerequisites

- `samosasheet.com` is active in the correct Cloudflare account.
- The GitHub repository is connected to the `samosa-sheet` Worker.
- Node.js and npm are installed locally.
- Wrangler can authenticate to the correct Cloudflare account.
- A Resend account is available.

Never paste API keys into chat, source code, GitHub, screenshots, `.env.example`,
or a `NEXT_PUBLIC_` variable.

## 4. Configure the receiving address

Use Cloudflare Email Routing to forward the domain address to Gmail:

1. Open Cloudflare and select `samosasheet.com`.
2. Open **Email Service > Email Routing** and enable it.
3. Open **Destination Addresses**.
4. Add `samosasheet@gmail.com`.
5. Open the verification message in Gmail and approve the destination.
6. Open **Routing rules** and create a rule.
7. Enter `orders` as the email pattern.
8. Choose **Send to an email**.
9. Select `samosasheet@gmail.com` as the destination and save.
10. Wait until Email Routing reports **Enabled**.

Test from a different email account by sending a message to
`orders@samosasheet.com`. Check the Gmail Inbox and Spam folder.

Do not delete the locked Cloudflare Email Routing MX and DKIM records.
Subaddressing and catch-all routing are not required.

## 5. Configure the Resend sending domain

1. Sign in to Resend.
2. Open **Domains > Add Domain**.
3. Enter `mail.samosasheet.com`.
4. Leave receiving disabled because Cloudflare Email Routing receives mail.
5. Use Resend's automatic Cloudflare configuration when available.
6. If records are added manually, copy every value exactly and keep applicable
   CNAME records DNS-only.
7. Wait for Resend to report the domain as **Verified**.
8. Leave sending enabled.

Using the `mail` subdomain separates automated-email reputation from the main
domain and avoids interfering with the root domain's receiving configuration.

## 6. Create the Resend API key

1. In Resend, open **API Keys > Create API Key**.
2. Name it `Samosa Sheet Production`.
3. Choose sending access.
4. Restrict it to `mail.samosasheet.com` when Resend offers that option.
5. Copy the key, which begins with `re_`, into a password manager.

Resend displays the complete key only when it is created. Rotate it immediately
if it is ever exposed.

## 7. Authenticate Wrangler

Open a terminal:

```bash
cd /home/dell/SS/samosa-sheet-website/worker
npx wrangler login
```

Sign in to the Cloudflare account that owns `samosasheet.com` and approve
Wrangler.

## 8. Create the queues

Run these from the `worker` directory:

```bash
npx wrangler queues create samosa-sheet-enquiries
npx wrangler queues create samosa-sheet-enquiries-dlq
```

If Wrangler says a queue already exists, keep it and continue. Do not create
alternate names because `worker/wrangler.toml` binds these exact names.

## 9. Store the Resend key on the correct Worker

Always provide the Worker configuration explicitly:

```bash
cd /home/dell/SS/samosa-sheet-website/worker
npx wrangler secret put RESEND_API_KEY --config ./wrangler.toml
```

Paste the `re_...` value when prompted. Terminal input may be invisible; that is
normal.

The explicit `--config` is essential. Without it, Wrangler may discover the root
`wrangler.jsonc` and attach the secret to `samosa-sheet` instead of
`samosa-sheet-enquiries`.

## 10. Deploy the email Worker

From the `worker` directory, run:

```bash
npx wrangler deploy --config ./wrangler.toml
```

A correct deployment identifies all of the following:

- `Uploaded samosa-sheet-enquiries`
- `env.ENQUIRY_QUEUE (samosa-sheet-enquiries)`
- Producer for `samosa-sheet-enquiries`
- Consumer for `samosa-sheet-enquiries`
- `api.samosasheet.com (custom domain)`
- `env.TO_EMAIL ("orders@samosasheet.com")`

If Wrangler says it is reading files from `out/`, uploads `samosa-sheet`, or
shows the website's `workers.dev` URL, it selected the root website config. Run
the command again with `--config ./wrangler.toml`.

Opening `https://api.samosasheet.com/` directly may return `Origin not allowed`
or `Method not allowed`. That is expected: the endpoint accepts cross-origin
POST requests from the approved website, not normal page visits.

## 11. Configure the website build variable

The API URL must be present while Next.js builds the static website:

1. Open **Cloudflare > Workers & Pages > samosa-sheet**.
2. Open **Settings > Build**.
3. Find **Build Variables and Secrets**.
4. Add a plaintext build variable:

```text
NEXT_PUBLIC_ENQUIRY_API_URL=https://api.samosasheet.com/
```

5. Apply it to Production and save.

Do not add this only under runtime bindings. A `NEXT_PUBLIC_` value is embedded
during `npm run build`, so a runtime-only value will not activate the browser
code.

Never put `RESEND_API_KEY` in the website build variables.

## 12. Build, verify, and deploy the website

Before pushing a release, run from the repository root:

```bash
npm run test:worker
npm run lint
npm run build
git diff --check
```

Commit and push to `main`. Cloudflare should automatically build and deploy the
`samosa-sheet` website Worker. Confirm the new commit appears as the active
deployment before testing.

The website build settings are:

```text
Build command: npm run build
Deploy command: npx wrangler deploy
Root directory: /
```

The root `wrangler.jsonc` publishes `out/`. Do not use the OpenNext adapter for
this static-export website.

## 13. End-to-end production test

Use an Incognito window to avoid stale JavaScript:

1. Open `https://samosasheet.com/products/`.
2. Select a product and enter clearly labeled test details.
3. Press **Send order & open WhatsApp**.
4. Confirm WhatsApp opens immediately with every order field.
5. Press **Send** inside WhatsApp if testing actual WhatsApp delivery.
6. Wait up to two minutes.
7. Check `samosasheet@gmail.com`, including Spam.
8. Confirm the email arrived through `orders@samosasheet.com`.
9. Repeat the test for the wholesale and contact forms.

For the contact form, confirm replies target the customer's submitted email via
the email `Reply-To` header.

## 14. Troubleshooting

### WhatsApp opens but Resend and Cloudflare show no activity

The browser likely did not call the API.

- Confirm the active website deployment was built after adding
  `NEXT_PUBLIC_ENQUIRY_API_URL`.
- Confirm the variable is under **Settings > Build > Build Variables and
  Secrets**.
- Confirm its exact spelling and value.
- Redeploy the website and test in Incognito.
- Open the browser developer console and look for `enquiry_api_failed` or
  `enquiry_api_unavailable`.

### The API queues successfully but Resend has no log

The queue consumer may not have the Resend secret. This happened during the
initial setup because Wrangler selected the root website configuration.

Run:

```bash
cd /home/dell/SS/samosa-sheet-website/worker
npx wrangler secret put RESEND_API_KEY --config ./wrangler.toml
```

Wait for the queued message to retry. Do not expose the key while checking it.

### Deployment uploads static files from `out/`

That is the website deployment, not the enquiry Worker. Deploy again with:

```bash
cd /home/dell/SS/samosa-sheet-website/worker
npx wrangler deploy --config ./wrangler.toml
```

### Email is accepted by Resend but does not appear in Gmail

- Check Resend Logs for the provider status.
- Check Gmail Spam, Promotions, and All Mail.
- Confirm Cloudflare Email Routing is Enabled.
- Confirm the `orders@samosasheet.com` rule is Active.
- Review Cloudflare Email Routing's Activity Log.
- Confirm the destination address is still verified.

### Messages reach the dead-letter queue

Investigate the Resend key, verified domain status, provider response, and
Worker logs before replaying messages. Do not discard DLQ messages until their
request IDs and failure reason have been recorded.

### CORS or `Origin not allowed`

`worker/wrangler.toml` currently allows:

```text
https://samosasheet.com
https://www.samosasheet.com
```

If the production hostname changes, update `ALLOWED_ORIGINS` and redeploy the
email Worker with its explicit configuration.

## 15. Monitoring and maintenance

Useful areas:

- Cloudflare **Workers & Pages > samosa-sheet-enquiries > Observability**
- Cloudflare **Queues > samosa-sheet-enquiries**
- Cloudflare **Queues > samosa-sheet-enquiries-dlq**
- Resend **Logs**
- Cloudflare **Email Service > Email Routing > Activity Log**

Stream Worker logs locally with:

```bash
cd /home/dell/SS/samosa-sheet-website/worker
npx wrangler tail samosa-sheet-enquiries --config ./wrangler.toml
```

Operational checks:

- Test all three forms after every related deployment.
- Monitor the dead-letter queue.
- Rotate the Resend key periodically and immediately after suspected exposure.
- Keep Cloudflare and Resend account MFA enabled.
- Do not log customer names, phone numbers, addresses, email addresses, or
  enquiry text.
- Keep `orders@samosasheet.com` routing and its Gmail destination verified.

## 16. Recovery checklist

If email notifications stop working while WhatsApp still opens:

1. Check the active website deployment and build variable.
2. Check `api.samosasheet.com` availability.
3. Check the main queue backlog and consumer status.
4. Check Worker logs for `enquiry_email_retry_requested`.
5. Check that `RESEND_API_KEY` exists on `samosa-sheet-enquiries`.
6. Check the Resend domain and API logs.
7. Check the dead-letter queue.
8. Check Cloudflare Email Routing and Gmail Spam.
9. Submit a clearly labeled test enquiry after fixing the cause.

Throughout an email outage, WhatsApp remains the customer fallback and should
continue opening independently.
