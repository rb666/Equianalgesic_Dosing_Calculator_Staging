# Cloudflare Deployment Notes

This repo is a static site. There is no build step.

## Current State

- GitHub repo: `https://github.com/rb666/calc-med`
- Production branch: `main`
- Target domain: `calc.med`
- Cloudflare zone is active.
- Cloudflare Pages project: `calc-med`
- Pages deployment URL: `https://calc-med.pages.dev`
- Custom domain `calc.med` is attached to the Pages project, but remains pending until DNS points to Pages.

## Deployed Setup

This site uses Cloudflare Pages on the free tier as a direct-upload static site.

The public deployment should contain only:

- `index.html`
- `styles.css`
- `script.js`
- `OpioidConversionSite.png`
- `.nojekyll`

Repo documentation files do not need to be uploaded to Pages.

## Current DNS Work Needed

Cloudflare imported Porkbun parking records. Replace the apex records before `https://calc.med` can serve the Pages site:

1. In Cloudflare DNS, delete the apex `A` records for `calc.med` that point to:
   - `44.227.65.245`
   - `44.227.76.166`
2. Add this DNS record:
   - Type: `CNAME`
   - Name: `calc.med` or `@`
   - Target: `calc-med.pages.dev`
   - Proxy status: Proxied

Optional: replace `www.calc.med` and `*.calc.med` Porkbun parking records if those hostnames should also route to this site.

## Direct Upload Deploy

To redeploy from this folder:

```powershell
npx wrangler login
npx wrangler pages deploy <public-assets-folder> --project-name calc-med --branch main
```

Use a temporary public-assets folder if you want to avoid uploading repo docs.
