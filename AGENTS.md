# calc.med unified staging operating manual

## Release boundary (2026-09-13)

This folder is now the active staging development workspace. The project owner explicitly requested consolidation here and a calculator-only staging release. UDS is intended to be removed from production later, but production must remain unchanged for now.

- Active remote: staging = https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging.git
- Release branch on that remote: main
- Active local branch: codex/staging-audit-release (tracks staging/main)
- Staging URL: https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/
- Protected production remote: origin = https://github.com/rb666/calc-med.git
- Local main and origin/main preserve production commit 6fde4f914cafa7d21cd127c73a95f106c4e88524.
- Original/base repository rb666/Equianalgesic_Dosing_Calculator is outside this release and must not be modified.
- Do not push origin or run a Cloudflare deployment without a new explicit production release request.

The prior staging checkout, including its Git history and untracked UDS drafts, is preserved under ignored workspace-backups/previous-staging-checkout. The old production operating manual is workspace-backups/production-AGENTS.md. These backups are inactive and must never be committed or deployed. Do active work here, not in the backup.

## Historical version preservation

The owner designated production `6fde4f914cafa7d21cd127c73a95f106c4e88524` as **v1.0**, the historical clinically reviewed baseline, and staging `8d77242ae9382e016bd2260dcfca347585fd4167` as **v2.0**. Both annotated tags and their source history are preserved on the staging remote. Never move, delete, replace, or reuse these tags, including during a later production promotion. Preserve the approved-ratio scope of the owner's clinical-review attestation; version 2.0 has no newly attested committee review. See `RELEASES.md` and `releases/1.0.json` / `releases/2.0.json` for exact identities, verification evidence, and retrieval instructions. Keep these original records intact and add later evidence separately.

## Architecture and files

The application remains plain static HTML/CSS/JavaScript with no package manifest, dependencies, framework, backend, telemetry, or clinical-data transmission. Node 22+ runs dependency-free tests and prepares the GitHub Pages artifact; this is static file preparation, not bundling.

- public/opioidcalculator.html: calculator, visible disclaimer, tabs, reference tables and PK modal.
- public/script.js: existing clinical data, browser rendering and events.
- public/calculator-core.js: shared calculation functions and numeric validation.
- public/calculator-provenance.js: data digest, sources, scoped approval attestation and traceability.
- public/styles.css: shared responsive styling and light/dark themes.
- public/OpioidConversionSite.png: original logo, retained for historical continuity and social previews.
- public/calc-med-brand.png and public/opioid-conversion-logo.png: approved header brand and complete stacked tool logo, copied unchanged from the selected local designs.
- archive/uds/: retained UDS document, JS, CSS and workflow guide; excluded from deployment.
- tests/: calculator, approved-table, archive and deployment regression checks.
- scripts/prepare-github-pages.mjs: explicit calculator asset allowlist, clean Pages route, retired-route handling.
- scripts/preview-github-pages.mjs: localhost-only artifact preview.
- .github/workflows/pages.yml: verification before staging Pages deployment, limited to staging main.

UDS must have no active header link, page, script, stylesheet or sitemap entry. Do not replace it with a modal. Retired UDS URL variants reach the calculator through the Pages 404 handler; unknown URLs retain a useful 404. The source Cloudflare redirect file prepares temporary UDS redirects for a future authorized production release only.

Root-relative assets in public/ are adapted to the GitHub project prefix during artifact preparation. Never deploy the repository root or archive. Generated dist/ is ignored. Staging has noindex/nofollow and robots Disallow; source metadata retains production canonicals for later intentional promotion.

### Approved header and tool identity (2026-09-15)

The owner approved the separate local layout proposal for staging: Serif grid brand (brand shortlist #04, historical #12) in the original slate header, and Faithful original cleanup (tool study #10) with its complete lettering below the symbol. These are two different numbering catalogs. The full stacked tool logo uses an unframed, narrower desktop column; existing clinical wording and calculator workflows remain. Apply this presentation to the current public source, never replace it with the older local demo snapshot.

`staging/release.json` now disables the temporary logo switcher. `/opioidcalculator/` directly serves the current calculator; experiment selectors, galleries and wrapper files are excluded from the normal artifact. Retain `staging/logo-preview/` and its numbering/history for later review; see its README for the optional build override. Only the two selected new images join the explicit calculator asset allowlist. Do not deploy local experiment folders, generation prompts, or backups. Saved tool selection still uses a query parameter so fresh loads and refreshes do not scroll or focus a tab; explicit anchor and keyboard navigation keep their focus behavior. Production remains unchanged.

SEO changes must preserve the staging indexing exclusion and the production hold. The owner requested on 2026-09-13 that no reviewer names, committee identities, credentials, review dates, or contact details be publicly listed. Do not invent authorship or approval metadata. See `SEO.md` for the v2.1 changes and remaining production-only follow-up.

The footer version note is user-facing. Describe substantive improvements and tool availability; keep internal file retention, repository, and deployment details in project documentation. The owner's clarification on 2026-09-14 allows concise, broad design summaries such as "Improved keyboard access, mobile layout, readability, and typography." Avoid specific or verbose descriptions of individual styling tweaks such as spacing, colors, or borders; routine refinements do not require changing an existing broad summary. Substantial changes to page organization, workflow order, or how people use the tools warrant a concise note update. Functional fixes and other substantive changes still belong in the cumulative note.

The owner requested on 2026-09-14 that this note remain a cumulative **net comparison from frozen v1.0 to the current version**, not a deployment-by-deployment log. Its source of truth is the single `#version-notes` disclosure in `public/opioidcalculator.html`. For changes within the note's scope above, review the note against v1.0 (`6fde4f914cafa7d21cd127c73a95f106c4e88524`) and the resulting implementation, and include any necessary wording changes in the same commit as the implementation. Before every deployment, verify that the note is current; routine styling-only releases do not require note edits.

- Update an existing item for the same behavior/value instead of appending intermediate edits. If X changes from 2 to 5 to 7 to 11, report only **X: 2 → 11**.
- If a behavior/value returns to its v1.0 state, remove that difference from the note. If only part of an item is reverted, describe only the remaining differences. Restored original input defaults, for example, are not a new difference from v1.0.
- Consolidate overlapping items by user-visible outcome. Do not create extra footer notes for each commit or deployment, or invent an entry for changes with no user-visible effect.
- Preserve the unchanged-approved-ratios statement and its scoped attestation. Net-change wording must not rewrite Git history, immutable v1.0/v2.0 tags, or historical release/audit records; those retain the detailed sequence.

## Preserve approved ratios

The owner confirmed on 2026-09-13 that the existing conversion ratios were approved by clinical oversight committees. Preserve them. Do not replace them with different published ratios or label them unapproved because an approval document is not stored here. The scoped user attestation is recorded separately from the overall review status of other clinical content.

The frozen fixture tests/fixtures/approved-clinical-tables.json was extracted from production 6fde4f9 and compared exactly with staging c281351 before editing. It locks all 36 opioid rows, 13 benzodiazepine rows, six methadone bands, four methadone constants, seven hepatic rows and five buprenorphine schedules. Do not regenerate it to make a ratio change pass. Existing renal rules and safety reductions must also be preserved. Fix discrepancies and actual bugs; clinical data corrections require source evidence and focused checks. PK profile values do not drive conversion calculations.

## Verification and release

The owner's standing preference is that a request to "deploy" includes committing the intended changes, pushing, deploying, and verifying the published result. Unless production is explicitly requested, use the staging release boundary above.

Before editing inspect git status --short --branch, git remote -v, git log --oneline -10 and the owning files. Preserve unrelated changes and backup material. Never reset shared history or repoint origin. Routine bootstrap publishing is disabled.

Run node --check for public/calculator-core.js, public/calculator-provenance.js, public/script.js, archive/uds/uds-tool.js and archive/uds/uds-workflow-guide.js. Run node --test tests/*.test.cjs, node scripts/prepare-github-pages.mjs and git diff --check. Changed clinical tables/core require a new manifest version and digest; UI-only edits do not change the digest. Refresh calculator HTML asset keys whenever assets change.

Start node scripts/preview-github-pages.mjs and check the project-prefixed URL on localhost:8788. Check desktop and 390x844 mobile, all calculator tabs, live entry summaries, blank/invalid/overflow inputs, add/remove, safety controls, organ avoid hierarchy, examples, PK Escape/focus, theme persistence and console errors. Check root and retired UDS routes and confirm UDS payloads return 404. Archive logic changes require its golden and regression tests, but are not permission to restore UDS.

Review the final diff, preserve the approved-table fixture and confirm only intended source/docs/tests are staged. Commit intentionally. Push explicitly with git push staging HEAD:main (fast-forward only). Never use an ambiguous git push origin main. Confirm GitHub Actions verify and deploy jobs succeed for that exact commit, then verify the actual staging URL, asset cache keys, file content, removed UDS paths and calculator smoke tests. A successful push alone is not a verified deployment.

Future production promotion needs explicit authorization, then production route/cache/metadata verification and separate Cloudflare deployment. This release does not update calc.med, DNS, hosting settings or the base repository.
