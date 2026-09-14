# Temporary staging logo preview

Enabled at the owner's request on 2026-09-14. The normal staging calculator URL opens the logo switcher; `/logo-preview/` shows the eight-design gallery. Original **06 — Conversion grid** is the default. **02 — Conversion arrows** is labeled **New**; it was not implemented in production.

The switcher has no mobile-size toggle. It uses the available browser width and the calculator's responsive layout. Logo images retain their proportions and use measured artwork bounds, a borderless presentation, and light/dark blending. Fine taglines remain inside the safe bounds. Source image files are unchanged.

## Deployment boundary and restoration

- `staging/release.json` is the only activation setting. Set `logoPreview` to `false`, verify, commit and deploy to restore the normal calculator entry page and exclude every preview asset from the Pages artifact. No history reset is needed.
- `GITHUB_PAGES_LOGO_PREVIEW=0` or `1` is a local/test build override; the checked-in setting controls normal CI deployments.
- The Pages preparation script publishes only the explicit UI and eight-image allowlists. Local experiments, drafts, image-generation prompts, source scripts and backups are not deployed.
- The preview uses the shared source calculator in `public/`. Clinical tables, provenance digest, and approved fixtures are unchanged. Production calc.med and the original/base repository remain outside this release.

## Structure

`index.html`, `preview.js`, and `preview.css` provide the switcher at `/opioidcalculator/`. The working calculator is generated from the current public HTML into `/opioidcalculator/site/` and uses the original calculator JS/CSS. Only `logo-treatment.css` is added to that child page. `logos.json` provides the single metadata/geometry catalog used by both the switcher and gallery. `gallery.html`, `studio.js`, and `studio.css` provide the gallery.

The builder supplies project-prefixed asset URLs and the version from `staging/release.json`. All three HTML pages are `noindex, nofollow`; robots exclusion and retired-UDS routing remain in place. Switching logos leaves calculator inputs, results, selected tools, theme, and open dialogs intact. Tool selection uses `?tool=...` in both the iframe and outer URL. Legacy calculator-tab fragments are converted before loading the iframe so refresh does not scroll or focus a tab. Explicit guide and reference navigation still works. A native iframe source preserves the calculator's normal load/error handling if the switcher fails.

The v2.1 footer note remains the cumulative clinical-tool comparison with v1.0. This temporary design review adds no new calculator workflow or clinical behavior to that note. Its deployment is recorded separately in `RELEASES.md`.
