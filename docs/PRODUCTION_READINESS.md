# Production Readiness Checklist

Use this as the final launch checklist for the website and its optional enquiry-email Worker. The website is a static Next.js export (`out/`), so hosting/CDN settings are part of the production setup.

## Must complete before launch

- [ ] Create `.env.local` from `.env.example` and replace every sample value with the real business name, phone/WhatsApp number, email, address, hours, domain, and social links.
- [ ] Replace `https://example.com` in `app/sitemap.xml` and `app/robots.txt` with the final HTTPS domain.
- [ ] Confirm all product sizes, pack quantities, storage instructions, shelf life, allergens, delivery coverage, prices, and availability with the business owner.
- [ ] Replace or approve the current images and testimonials; obtain permission for all customer names, quotes, and photos used.
- [ ] Have the Privacy Policy and Terms reviewed for the real business, enquiry-email processing, WhatsApp, Resend, Google Maps, retention, delivery, returns, and applicable food/business rules.
- [ ] Choose the production host, connect the custom domain, enforce HTTPS, and configure the canonical `www` or non-`www` redirect.
- [ ] Configure the host to serve the `out/` directory and return the generated `404.html` for missing pages.
- [ ] Add security headers at the host/CDN: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a suitable `Permissions-Policy`.
- [ ] Run the release checks: `npm ci`, `npm run lint`, and `npm run build`.
- [ ] Test every page, navigation link, phone link, social link, map, WhatsApp button, product order, bulk enquiry, and contact form on mobile and desktop.

## Enquiry email Worker

Complete this section only if enquiries should also be emailed. Without `NEXT_PUBLIC_ENQUIRY_API_URL`, the site intentionally continues in WhatsApp-only mode.

- [ ] Verify the sending domain in Resend and create a restricted production API key.
- [ ] Replace `ALLOWED_ORIGIN`, `FROM_EMAIL`, and `TO_EMAIL` in `worker/wrangler.toml`.
- [ ] Store the key with `npx wrangler secret put RESEND_API_KEY`; never put it in source control or a `NEXT_PUBLIC_` variable.
- [ ] Deploy the Worker, set its URL as `NEXT_PUBLIC_ENQUIRY_API_URL`, then rebuild the website because public environment values are embedded at build time.
- [ ] Add abuse protection beyond the honeypot (Cloudflare rate limiting/Turnstile or equivalent) and set alerts for repeated failures or unusual traffic.
- [ ] Submit one real test for each enquiry type and confirm the email content, recipient, Resend delivery, CORS behavior, error message, and WhatsApp handoff.

## Quality and operations

- [ ] Add automated CI for locked install, TypeScript checking, and production build on every pull request/deployment.
- [ ] Add a small browser smoke-test suite for key pages and the three enquiry flows; no automated tests currently exist.
- [ ] Run Lighthouse and an accessibility check on mobile and desktop; fix serious accessibility, performance, SEO, and best-practice findings.
- [ ] Test Chrome, Safari, Firefox, Android, and iPhone at common screen sizes and on a slow connection.
- [ ] Optimize any oversized images and verify the social-share preview, page titles, descriptions, canonical URLs, sitemap, and robots file on the live domain.
- [ ] Connect browser and Worker logs to an error/uptime service, with alerts that do not capture customer-entered personal data.
- [ ] Add uptime checks for the homepage and Worker, and document who receives alerts and customer enquiries.
- [ ] Configure DNS, CDN caching/compression, deployment access, account MFA, secret rotation, and a recoverable rollback to the previous static build.
- [ ] Decide how long enquiry emails/logs are retained and how correction or deletion requests are handled.

## Final launch sign-off

- [ ] A business owner has approved content, product facts, contact details, and legal text.
- [ ] A successful production build has been deployed to a staging or preview URL and accepted.
- [ ] Production smoke tests pass after DNS/domain cutover.
- [ ] Search Console (or equivalent) is verified and `https://<domain>/sitemap.xml` is submitted.
- [ ] Record the launch date, deployed commit/version, rollback location, and responsible contact below.

| Item | Value |
| --- | --- |
| Launch date | |
| Production domain | |
| Deployed version/commit | |
| Rollback build/location | |
| Technical owner | |
| Business owner | |

## Current project notes

- Already present: static export configuration, responsive pages, metadata, sitemap/robots files, privacy/terms pages, client-side validation, honeypot handling, CORS restriction, request IDs, and structured logs.
- Still visible in source: sample domain/social values and Worker domain placeholders.
- Not currently present: CI configuration, automated tests, or a configured external monitoring destination.

