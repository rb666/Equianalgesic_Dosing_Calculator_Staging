# Temporary staging logo preview

**Inactive for the approved header release (2026-09-15).** The owner selected fixed calc.med header branding and the complete stacked tool logo from the later independent layout study. `staging/release.json` now sets `logoPreview` to `false`; the normal staging entry serves the calculator directly. The source below is preserved for optional future design review and is excluded from the normal artifact. The selected header is brand shortlist #04 (Serif grid); the selected tool is #10 (Faithful original cleanup) from a separate tool-logo catalog.

Enabled at the owner's request on 2026-09-14. The normal staging calculator URL opens the logo switcher; `/logo-preview/` shows the eleven-design gallery. **03 — Conversion grid** is the default, retaining the same design role as former #06. The current grouped numbering is shared by the switcher, gallery, comparison selectors and individual download names. [The numbering record](numbering-map.md) preserves the previous ids.

The switcher has no mobile-size toggle. It uses the available browser width and the calculator's responsive layout. Logo images retain their proportions and use measured artwork bounds and wordmark heights, a borderless presentation, and light/dark blending. The stacked #11 uses the same per-line wordmark sizing as the other concepts in the site header; the separate gallery retains its comparison sizing. Original #01 bypasses color filters and blending; transparent artwork bypasses canvas blending. Assets are copied exactly from the selected local shortlist.

## Deployment boundary and restoration

- `staging/release.json` is the only activation setting. Set `logoPreview` to `false`, verify, commit and deploy to restore the normal calculator entry page and exclude every preview asset from the Pages artifact. No history reset is needed.
- `GITHUB_PAGES_LOGO_PREVIEW=0` or `1` is a local/test build override; the checked-in setting controls normal CI deployments.
- The Pages preparation script publishes only the explicit UI and eleven-image allowlists. Retired artwork remaining in source is excluded. Local experiments, historical sheets, drafts, image-generation prompts, source scripts and backups are not deployed.
- The preview uses the shared source calculator in `public/`. Clinical tables, provenance digest, and approved fixtures are unchanged. Production calc.med and the original/base repository remain outside this release.

## Structure

When enabled, `index.html`, `preview.js`, and `preview.css` provide the switcher at `/opioidcalculator/`. The working calculator is generated from the current public HTML into `/opioidcalculator/site/` and uses the calculator JS/CSS. `logo-treatment.css` is added to that child page. `logos.json` provides the single metadata/geometry catalog used by both the switcher and gallery. `gallery.html`, `studio.js`, and `studio.css` provide the gallery.

Current groups: #01 original; #02–05 symbols with names; #06–07 wordmarks; #08–11 brackets. The user's six winners are #03, #04, #06, #07, #08 and #10. Historical arrow and monogram options, plus former #11/#11B, remain retired; new numbers do not restore those designs. The gallery has all/winners/two-logo views, generous and small renditions, and links to try each design on the calculator.

The builder supplies project-prefixed asset URLs and the version from `staging/release.json`. All three HTML pages are `noindex, nofollow`; robots exclusion and retired-UDS routing remain in place. Switching logos leaves calculator inputs, results, selected tools, theme, and open dialogs intact. Tool selection uses `?tool=...` in both the iframe and outer URL. Legacy calculator-tab fragments are converted before loading the iframe so refresh does not scroll or focus a tab. Explicit guide and reference navigation still works. A native iframe source preserves the calculator's normal load/error handling if the switcher fails.

The v2.1 footer note remains the cumulative clinical-tool comparison with v1.0. This temporary design review adds no new calculator workflow or clinical behavior to that note. Its deployment is recorded separately in `RELEASES.md`.
