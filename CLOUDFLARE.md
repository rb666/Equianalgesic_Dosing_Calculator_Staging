# Cloudflare Deployment Notes

This repo is a static site. There is no build step.

## Current State

- GitHub repo: `https://github.com/rb666/calc-med`
- Production branch: `main`
- Target domain: `calc.med`
- Cloudflare zone is active.
- Cloudflare Pages project: `calc-med`
- Pages deployment URL: `https://calc-med.pages.dev`
- Production URL: `https://calc.med/opioidcalculator`
- Root URL redirect: `https://calc.med/` -> `https://calc.med/opioidcalculator`
- Custom domain `calc.med` is attached to the Pages project. Cloudflare may continue showing the validation status as pending for a short period after the DNS change, even while the site is already reachable.

## Deployed Setup

This site uses Cloudflare Pages on the free tier as a direct-upload static site.

The public deployment should contain only:

- `_redirects`
- `opioidcalculator.html`
- `styles.css`
- `script.js`
- `OpioidConversionSite.png`
- `.nojekyll`

Repo documentation files do not need to be uploaded to Pages.

## DNS State

The apex domain should point to Pages:

- Type: `CNAME`
- Name: `calc.med` or `@`
- Target: `calc-med.pages.dev`
- Proxy status: Proxied

Optional: remove the wildcard `*.calc.med` record unless wildcard subdomains should route to this site.

## Direct Upload Deploy

To redeploy from this folder:

```powershell
npx wrangler login
npx wrangler pages deploy public --project-name calc-med --branch main
```
