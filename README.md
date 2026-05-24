# Equianalgesic Dose Calculator

Static clinical decision support website for converting between opioid
equianalgesic doses, calculating oral morphine equivalents, and opening
specialty methadone or Suboxone tools. The site is deployed on Cloudflare Pages
and has no build step.

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
- `public/styles.css` contains responsive styling.
- `public/script.js` contains the conversion table and calculator logic.
- `public/_redirects` redirects `/` to `/opioidcalculator`.

## Cloudflare Pages

See `CLOUDFLARE.md` for deployment notes.

The production page is `https://calc.med/opioidcalculator`.
