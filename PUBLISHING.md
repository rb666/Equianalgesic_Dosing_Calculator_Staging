# Publishing

This repository is a public GitHub Pages repository.

## Deployment Model

The source website lives in `public/`. GitHub Pages deploys from an Actions
artifact, not directly from the repository root, so the source layout can stay
clean while the hosted site gets GitHub Pages-compatible routes.

The workflow is:

```text
.github/workflows/pages.yml
```

On each push to `main`, it runs:

```powershell
node scripts/prepare-github-pages.mjs
```

That script creates `dist/github-pages/` with:

- a root redirect page
- `/opioidcalculator/`
- `/UDS/`
- compatibility redirects for `opioidcalculator.html` and `UDS.html`
- project-page-safe asset links

`dist/` is generated and ignored by git.

## GitHub Settings

Repository visibility should be public.

GitHub Pages should be configured as:

- Source: GitHub Actions
- Branch publishing: disabled/not used
- Workflow: `Deploy GitHub Pages`

The expected default Pages URL is:

```text
https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/
```

If a custom root domain is later attached, set this workflow environment
variable before the prepare step:

```yaml
GITHUB_PAGES_BASE_PATH: /
```

Without that override, the generated site correctly targets the default
project-page path.

## Local Check

To inspect the generated GitHub Pages artifact locally:

```powershell
node scripts/prepare-github-pages.mjs
python -m http.server 4173 -d dist/github-pages
```

Then open:

```text
http://127.0.0.1:4173/
```
