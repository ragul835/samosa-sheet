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

Product orders, bulk enquiries and contact forms can email each submission to
`samosasheet@gmail.com` before opening the prepared WhatsApp message. The email
API is the small Cloudflare Worker in `worker/` and uses Resend.

1. Verify a sending domain in Resend and create an API key.
2. Replace `ALLOWED_ORIGIN` and `FROM_EMAIL` in `worker/wrangler.toml` with the
   public website origin and an address on the verified domain.
3. In the `worker` directory, run `npx wrangler secret put RESEND_API_KEY`, then
   `npx wrangler deploy`.
4. Set `NEXT_PUBLIC_ENQUIRY_API_URL` to the deployed Worker URL before building
   the website. Never expose the Resend key in a `NEXT_PUBLIC_` variable.

Without `NEXT_PUBLIC_ENQUIRY_API_URL`, the forms remain operational in
WhatsApp-only mode and label that behavior accurately.

### Production logs

The browser emits structured JSON logs for page views, navigation, runtime
errors, order-modal activity, validation failures and enquiry submissions.
Customer-entered names, phone numbers, addresses, email addresses and messages
are never included. Inspect these logs in the browser console or route console
output to your preferred browser observability provider.

The enquiry Worker emits correlated JSON logs for request validation and Resend
delivery. Each browser/Worker pair shares an `X-Request-ID`, making a submission
traceable end to end without logging its contents. Stream deployed Worker logs:

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

Business configuration in `.env.local` automatically updates WhatsApp, phone, email, map, social links and page metadata. Replace `https://example.com` in `app/sitemap.xml` and `app/robots.txt` with the live domain before launch.

## Scope
This V1 intentionally has no:
- Database
- Cart
- Customer login
- Payment gateway
- Admin panel

Primary conversion: email notification, WhatsApp and phone enquiry.
