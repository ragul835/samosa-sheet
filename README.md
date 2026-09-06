# Samosa Sheet Website

Production-ready static lead-generation website for a ready-made samosa sheet business.

## Stack
- Next.js 16
- TypeScript
- Tailwind CSS
- Lucide React
- Static export

## Local development

From the project directory, open the interactive service manager:

```bash
./manage-service.sh
```

Choose `1` to start the built production website, `10` to start a persistent
development server, or `6` for a complete deployment
(locked install, type-check, build, and restart). The same operations are available
as direct commands for automation; run `./manage-service.sh --help` for the list.

Alternatively, run the app directly:

```bash
npm install
npm run dev
```

The service manager keeps production on port `3000` and development on port
`3001`, so both can run at the same time. Menu option `10` runs development in
the background; use options `12` and `13` to stop it or check its health.
Override the ports with `PORT` and `DEV_PORT` when needed.
Development uses `.next-dev/`, keeping it isolated from production builds in
`.next/`. Option `14` follows the development log when troubleshooting startup.

## Production build
```bash
npm run build
```
Static output is generated in `out/`.

## Deployment
### Cloudflare Workers static assets
Connect the GitHub repository to a Cloudflare Worker and use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

The root `wrangler.jsonc` publishes the generated `out/` directory as static
assets. Do not use the OpenNext adapter for this project; it is already a fully
static Next.js export. Cloudflare automatically deploys new commits from the
configured production branch.

### Any static hosting
Run `npm run build` and upload the `out/` folder.

### Free enquiry email notifications

Product orders, bulk enquiries and contact forms queue an email notification to
`orders@samosasheet.com`, then open the prepared WhatsApp message immediately.
The Cloudflare Worker in `worker/` sends queued notifications through Resend with
automatic retries and duplicate-send protection.

1. Create the mailbox or forwarding address `orders@samosasheet.com` with your email provider.
2. Verify the sending subdomain `mail.samosasheet.com` in Resend and create a
   sending-only API key. Resend's DNS records must remain DNS-only in Cloudflare.
3. Review `ALLOWED_ORIGINS`, `FROM_EMAIL`, and `TO_EMAIL` in
   `worker/wrangler.toml`. Production is configured to send from
   `website@mail.samosasheet.com` to `orders@samosasheet.com`.
4. Change to the `worker` directory, then create the queues with
   `npx wrangler queues create samosa-sheet-enquiries` and
   `npx wrangler queues create samosa-sheet-enquiries-dlq`.
5. From that directory, run `npx wrangler secret put RESEND_API_KEY`, then
   `npx wrangler deploy`.
6. Set `NEXT_PUBLIC_ENQUIRY_API_URL=https://api.samosasheet.com/` in the website
   build environment, then redeploy the website. Never expose the Resend key in
   a `NEXT_PUBLIC_` variable.

Without `NEXT_PUBLIC_ENQUIRY_API_URL`, the forms remain operational in
WhatsApp-only mode and label that behavior accurately.

### Production logs

The browser emits structured JSON logs for page views, navigation, runtime
errors, order-modal activity, validation failures and enquiry submissions.
Customer-entered names, phone numbers, addresses, email addresses and messages
are never included. Inspect these logs in the browser console or route console
output to your preferred browser observability provider.

The enquiry Worker emits correlated JSON logs for request validation, queueing,
retry requests and Resend acceptance. Each browser/Worker pair shares an
`X-Request-ID`, making a submission traceable end to end without logging its
contents. Stream deployed Worker logs:

```bash
npx wrangler tail samosa-sheet-enquiries
```

## Update before launch
Copy `.env.example` to `.env.local` and replace:
- Business name
- WhatsApp number
- Phone number
- Email
- Address
- Business hours
- Domain

Also confirm before launch:
- Product sizes / pack quantities
- Actual storage / shelf-life information
- Testimonials
- Privacy Policy and Terms & Conditions with your legal adviser

Business configuration in `.env.local` automatically updates WhatsApp, phone, email, map, social links and page metadata. The sitemap and robots files are configured for `https://samosasheet.com`.

## Scope
This V1 intentionally has no:
- Database
- Cart
- Customer login
- Payment gateway
- Admin panel

Primary conversion: email notification, WhatsApp and phone enquiry.
