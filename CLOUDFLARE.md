# Cloudflare Deployment Notes

This repo is a static site. There is no build step.

## Current State

- GitHub repo: `https://github.com/rb666/calc-med`
- Production branch: `main`
- Target domain: `calc.med`
- Cloudflare zone observed as active on May 5, 2026.
- Local Wrangler was not authenticated in this shell.
- Cloudflare API reads worked, but Pages/KV write calls returned authentication errors, so final Pages wiring was deferred.

## Preferred Cloudflare Setup

Use Cloudflare Pages on the free tier.

### Option A: Git Integration

Use this if Cloudflare can authorize GitHub access to `rb666/calc-med`.

1. Cloudflare dashboard: Workers & Pages -> Create application -> Pages -> Connect to Git.
2. Select `rb666/calc-med`.
3. Use:
   - Project name: `calc-med`
   - Production branch: `main`
   - Framework preset: None
   - Build command: leave blank
   - Build output directory: `/`
4. Add custom domain: `calc.med`.

### Option B: Direct Upload

Use this if Git integration is not available.

1. Run:

   ```powershell
   npx wrangler login
   npx wrangler pages project create calc-med --production-branch main
   npx wrangler pages deploy . --project-name calc-med --branch main
   ```

2. In Cloudflare Pages, add custom domain `calc.med`.

Cloudflare Direct Upload projects can continue to deploy with Wrangler from this folder.
