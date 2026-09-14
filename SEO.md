# SEO implementation — version 2.1

Prepared on 2026-09-13 for staging. Production calc.med remains on historical v1.0 until a separately authorized production release. The v1.0 and v2.0 tags and integrity records remain unchanged. Reviewer names, committee identities, credentials, review dates, and contact details are omitted at the owner's request.

## Implemented

- Descriptive, consistent search and sharing title: `Opioid Conversion & MME Calculator | calc.med`. The description explains the actual tools and clinician audience instead of describing the implementation as “static.”
- Linked `MedicalWebPage`, `WebApplication`, publisher, and logo entities. Metadata matches visible content; no invented authors, clinical reviewers, ratings, awards, review dates, or approval claims are added. This schema does not guarantee a rich result.
- Original square logo dimensions and alternative text in social metadata; the Twitter summary card fits the existing square artwork.
- Static, visible guide explaining the tools, inputs, units, and references. Its content and source links are available in the initial HTML without executing JavaScript. It follows the calculator so it does not add steps before entering a dose.
- Accessible skip link and descriptive guide links to the five existing tabs and conversion references. Direct fragment links activate the matching tab and preserve entered values during navigation. URLs contain no clinical inputs.
- `data-nosnippet` on calculated result panels and live regimen entries requests exclusion of example/patient-specific calculations from supported search snippets. It does not hide the content from users or prevent indexing of the rest of the page.
- Lossless PNG stream recompression reduces the original logo from **976,467 to 907,295 bytes**, saving **69,172 bytes (7.1%)**. Decompressed filtered pixel bytes and every non-IDAT chunk are identical to v2.0. Pixel-stream SHA-256: `dd7b99f959804de60b385f48901d69da303f5169fe868d9008e60f7c8166a05b`.
- Staging preparation fails if its single robots meta tag cannot be converted to `noindex, nofollow`. The existing artifact allowlist and crawler controls remain. The production canonical and source sitemap stay aligned at `https://calc.med/opioidcalculator`.
- Regression checks cover metadata identity, schema relationships, omitted unverified identity/review fields, resolvable fragment links, result snippet exclusions, and safe activation of known calculator links.

## Existing controls verified

Production checks observed: `/` and `/opioidcalculator.html` redirect permanently to `/opioidcalculator`; the trailing slash redirects with HTTP 308; the canonical returns 200; a nonexistent page returns 404; robots.txt and sitemap.xml return 200. These controls were already working and were preserved.

The source sitemap contains the intended production calculator URL. Its 2026-09-13 modification date remains accurate for this source change; do not refresh it on unrelated builds. The production UDS entry remains part of the held production version and must be retired only during authorized production promotion.

GitHub project-site robots.txt is not a substitute for the origin-root robots.txt. Staging relies on its explicit noindex metadata; noindex can be read only when crawling is allowed by the host. Do not submit the staging URL or sitemap to search engines.

## Verification and remaining work

All 32 Node regression tests, JavaScript syntax checks, and artifact preparation pass. Browser checks cover guide readability, desktop/mobile layout, direct tool navigation, keyboard access, and retained calculator behavior. Approved clinical tables, core calculations, safety policies, and the clinical-data digest are unchanged.

No Search Console ownership, traffic data, or Chrome DevTools performance trace was available through the configured tools. No ranking, traffic, Core Web Vitals, Lighthouse score, or rich-result eligibility improvement is claimed. The measured file-size reduction is distinct from a measured loading-time improvement.

After authorized production promotion, the highest-value next step is to use the owner's Search Console property to inspect the production canonical, submit `https://calc.med/sitemap.xml`, request recrawling, and monitor real queries, impressions, clicks, indexing, and Core Web Vitals. No Search Console property, verification token, DNS setting, analytics service, tracking script, or external outreach was added. Further clinical content should be scoped and reviewed before publication.

## Primary guidance used

- [Google: descriptive title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: descriptions and snippet controls](https://developers.google.com/search/docs/appearance/snippet)
- [Google: JavaScript crawling and rendering](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: structured-data accuracy and visible content](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: helpful content and accurate authorship](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: canonical URL consistency](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
