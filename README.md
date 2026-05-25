# Equianalgesic Dose Calculator

Static clinical decision support website for converting between opioid
equianalgesic doses, calculating oral morphine equivalents, and opening
specialty methadone, Suboxone, and UDS workflow tools. The site is published
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
- `public/script.js` contains the conversion table and calculator logic.
- `scripts/prepare-github-pages.mjs` prepares GitHub Pages-compatible clean
  routes from the `public/` folder.

## GitHub Pages

GitHub Pages deploys from `.github/workflows/pages.yml` on every push to
`main`. The workflow prepares `dist/github-pages` and publishes it with the
official GitHub Pages Actions.

The source files stay in `public/`; do not edit generated files under `dist/`.
