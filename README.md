# Equianalgesic Dose Calculator Staging

Static clinical decision support website for converting between opioid
equianalgesic doses, calculating oral morphine equivalents, and opening
specialty methadone or Suboxone tools. The site is designed for GitHub Pages
and has no build step.

This repository is the staging GitHub Pages site for the production project in
`../Equianalgesic_Dosing_Calculator`. It is intended for review and testing
before changes are promoted to the live site.

The main converter includes methadone source and route-switching entries:
10 mg oral methadone is configured as 47 mg oral morphine equivalent, and
5 mg IV methadone is configured as equivalent to 10 mg oral methadone. When
Total MME contains only oral methadone, the calculator also shows a conservative
3.0 multiplier estimate. The specialty methadone calculator mirrors the
production morphine:methadone workflow with oral/IV route output and a 0-90%
methadone safety reduction.

## Files

- `index.html` contains the calculator interface, safety warning, and reference
  tables.
- `styles.css` contains responsive styling.
- `script.js` contains the conversion table and calculator logic.

## GitHub Pages

See `PUBLISHING.md` for the exact GitHub repository creation, push, and Pages
settings steps.

The site can also be opened directly from `index.html` in a browser.
