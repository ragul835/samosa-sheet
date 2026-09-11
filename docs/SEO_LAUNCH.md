# SEO implementation and launch handoff

## Implemented

- Unique titles, descriptions, self-referencing canonical URLs and matching Open Graph/Twitter metadata for all nine content pages.
- Seven indexable marketing pages in the sitemap. Privacy and terms keep their existing noindex policy and now have their own canonicals. Missing pages remain noindex with real HTTP 404 responses.
- LocalBusiness and WebSite structured data based on the existing business configuration; one breadcrumb graph per inner marketing page. Product identities link to real product cards. No invented prices, ratings, reviews, coordinates or certifications.
- Product image sitemap entries. Build-time timestamps removed: add `lastModified` only when an authoritative content revision date is available.
- Karpagam Foods identity and Chennai/Nerkundram context with natural samosa patti/wrapper terminology, useful product and wholesale links, and customer-facing FAQ answers replacing editorial placeholders.
- South India service-area signals for Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Puducherry, while retaining India-wide supply language. State-specific pages were not fabricated because there is no unique state-level content yet.
- Global English discovery through a generic `.com` canonical, `en-IN` plus `x-default` alternate signals, and internationally understandable product language. No unsupported worldwide delivery promise is added; confirm export or overseas delivery before publishing that claim.
- Native FAQ disclosure sections retain every answer in the initial HTML, matching the structured data and working without client JavaScript.
- Business environment variables now use direct Next.js public-variable access, keeping browser contact details consistent with server metadata. Site URL validation rejects paths, queries, credentials and unsupported schemes.
- Generic or placeholder social profiles are omitted from both the footer and structured data. An SVG favicon follows the existing SF brand mark.
- The Node static server permanently redirects existing slashless pages and `index.html` aliases, preserving queries. Cloudflare already uses `force-trailing-slash` and `404-page` in `wrangler.jsonc`.
- The website Worker declares both `samosasheet.com` and `www.samosasheet.com` as Cloudflare custom domains so the apex and www hostname are provisioned together.

## Page intent

| URL | Primary visitor intent |
| --- | --- |
| `/` | Ready-made samosa sheets / samosa patti supplier in Chennai |
| `/products/` | Compare sheet dimensions, pack quantities and uses |
| `/wholesale/` | Bulk samosa sheet pricing and recurring business supply |
| `/how-to-use/` | Fold, fill and seal ready-made samosa wrappers |
| `/about/` | Understand the Chennai business and product offering |
| `/faq/` | Storage, shelf life, sizes, ordering and delivery questions |
| `/contact/` | Contact the Nerkundram supplier and confirm availability |

These targets are based on the existing business and content, not a measured keyword-volume or competitor study. Avoid creating near-identical city pages unless the business can provide distinct, useful local information.

## Release checks

Run from the repository root:

```bash
npm run lint
npm run build
npm run test:seo
```

`test:seo` checks the actual `out/` HTML for unique metadata, canonical/social URL agreement, headings, indexing directives, schema parsing, visible FAQ agreement, breadcrumbs, local image and link destinations, sitemap membership and favicon output. It also starts an isolated ephemeral local server to test page statuses, redirects, HEAD requests and missing-page responses. It does not contact customers or change a running server.

Build all `NEXT_PUBLIC_*` values into the release; changing environment variables after deployment does not change a static export. `NEXT_PUBLIC_SITE_URL` should be `https://samosasheet.com` unless the chosen canonical domain changes. The checks require HTTPS canonical URLs.

## Remaining production and owner actions

1. Confirm the configured Karpagam Foods name, address, +91 90953 33944 phone, opening hours, actual sheet dimensions and pack sizes. Verify existing claims such as “5+ years” and “100+ business customers” before publishing; this change does not independently substantiate them. Use confirmed shelf-life and allergen information from product packaging.
2. Publish the tested `out/` release through the existing hosting workflow. Configure HTTPS and a permanent www-to-non-www redirect at the domain/CDN layer, preserving paths and query strings. The Node server's page redirects do not replace domain-level redirects.
3. Protect staging/preview deployments using host access controls or a host-specific `X-Robots-Tag: noindex`. Do not copy a preview noindex header onto the production host. Robots.txt is not an access-control mechanism.
4. Verify domain ownership in [Google Search Console](https://search.google.com/search-console). DNS verification avoids a rebuild; alternatively set the existing `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` token and rebuild. Submit `https://samosasheet.com/sitemap.xml` and inspect the homepage, products, wholesale and contact URLs after deployment.
5. Check rendered markup using [Google's Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/). The quote-based product list has no confirmed public prices, so it does not claim merchant-listing eligibility. Existing FAQ and HowTo markup describes the content; do not promise special Google search appearances for it.
6. Create or update the owner's [Google Business Profile](https://www.google.com/business/) if eligible, using the same business details and actual business category/service area. Add authentic business/product photographs and request honest customer reviews through the owner's normal workflow.
7. Measure mobile performance on the live domain with [PageSpeed Insights](https://pagespeed.web.dev/). The supplied WebP photos now replace the large hero and About PNGs: approximately 157 KB each. All four supplied images total approximately 610 KB. The hero loads eagerly with high fetch priority; the gallery and About images load lazily with reserved dimensions. The poster retains its full aspect ratio and opens at full size. Original PNG files remain available for recovery but are no longer referenced by the pages or metadata. No live Core Web Vitals score was established in this pass.
8. Monitor Search Console indexing, selected canonicals, impressions, clicks and enquiries after launch. Record a baseline, then review changes over the following weeks. Search visibility and rankings are not guaranteed by metadata or structured data.

The public domain could not be inspected through the browser tool during this implementation. Deployment, live redirects, live indexing, Search Console ownership and Business Profile status remain unverified.

## Guidance used

- [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Search documentation updates](https://developers.google.com/search/updates): FAQ rich results were retired in May 2026.
- The installed Next.js documentation for metadata, JSON-LD, icons, public environment variables and static exports.
