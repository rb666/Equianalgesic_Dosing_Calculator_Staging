# Equianalgesic Dose Calculator

Static clinical decision support website for converting between opioid
equianalgesic doses, calculating oral morphine equivalents, and opening
specialty methadone, buprenorphine-transition, and UDS workflow tools. The site is published
with GitHub Pages from the static files in `public/`.

The main converter includes methadone source and route-switching entries:
10 mg oral methadone is configured as 47 mg oral morphine equivalent, and
5 mg IV methadone is configured as equivalent to 10 mg oral methadone. When
Total MME contains only oral methadone, the calculator also shows a conservative
3.0 multiplier estimate. The specialty methadone calculator mirrors the
production morphine:methadone workflow with oral/IV route output and a 0-90%
methadone safety reduction.

## Files

- `public/opioidcalculator.html` contains the calculator interface, safety
  warning, and reference tables.
- `public/UDS.html`, `public/uds-tool.js`, and related UDS assets contain the
  urine drug screen workflow tool.
- `public/styles.css` contains responsive styling.
- `public/calculator-core.js` contains browser/Node-compatible pure calculator logic.
- `public/calculator-provenance.js` contains the versioned rule-level manifest.
- `public/script.js` contains clinical tables and the browser adapter.
- `scripts/prepare-github-pages.mjs` prepares GitHub Pages-compatible clean
  routes from the `public/` folder.
- `CLINICAL_DATA.md` documents input, composition, provenance, and approval status.

## GitHub Pages

GitHub Pages deploys from `.github/workflows/pages.yml` on every push to
`main`. The workflow prepares `dist/github-pages` and publishes it with the
official GitHub Pages Actions.

The source files stay in `public/`; do not edit generated files under `dist/`.

## Calculator assurance

The manifest is intentionally marked unreviewed because this repository contains
no named clinical attestation. Traceability and regression coverage do not imply
clinical approval.

Run the release gate locally with:

```powershell
node --check public\calculator-core.js
node --check public\calculator-provenance.js
node --check public\script.js
node --test tests\calculator-*.test.cjs
node scripts\prepare-github-pages.mjs
```

The generated GitHub Pages artifact receives `noindex, nofollow`; shared
`public/` source remains environment-neutral for a deliberate production
promotion.

## Consumer-facing interface boundary

Staging is a client/consumer-facing product surface. Never render developer or
release metadata in either route, including environment/QA banners, build labels,
manifest versions, provenance counts, repository state, attestation status, or CI
status. Those records belong only in repository documentation, machine-readable
manifests, tests, and controlled review systems.

Clinically important limitations must still be shown, but as plain, actionable
clinical safety guidance rather than internal governance language. The static
contract tests enforce this boundary for both source and generated pages.
