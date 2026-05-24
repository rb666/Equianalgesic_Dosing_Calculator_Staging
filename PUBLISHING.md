# Publishing and Staging

This repository is a private staging/source repository. It is not intended to be
served by GitHub Pages.

## Deployment Model

The website is deployed from the `public/` directory through Cloudflare Pages.
This matches the production `calc.med` deployment model and keeps clean routes
such as `/opioidcalculator` and `/UDS` working through Cloudflare `_redirects`.

## Staging Deploy

From this folder:

```powershell
npx wrangler login
npx wrangler pages deploy public --project-name calc-med-staging --branch main
```

Current staging URL:

<https://calc-med-staging.pages.dev>

## Production Deploy

Production should be deployed from the production repo, not this staging repo:

```powershell
npx wrangler pages deploy public --project-name calc-med --branch main
```

Production URL:

<https://calc.med/opioidcalculator>

## GitHub Settings

GitHub Pages should stay disabled for this repository. The repo can be private
because Cloudflare Pages deploys from the uploaded `public/` directory, not from
GitHub Pages.
