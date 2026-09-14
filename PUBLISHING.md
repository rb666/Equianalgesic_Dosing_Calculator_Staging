# Staging publishing

Release only to rb666/Equianalgesic_Dosing_Calculator_Staging. Production calc.med is paused at its existing release; pushing production origin or deploying Cloudflare is outside this release.

By the owner's standing instruction, "deploy" includes committing the intended changes, pushing, deploying, and verifying the published result. The default destination is staging; production still requires an explicit production release request.

1. Inspect git status and remotes. Complete the syntax checks and browser checks in AGENTS.md. Review the single `#version-notes` disclosure in `public/opioidcalculator.html` against frozen v1.0 and the final release state. Maintain cumulative net differences: rewrite/merge existing items, omit intermediate changes, and remove differences reverted to baseline (2 → 5 → 7 → 11 is recorded as 2 → 11). Include necessary note updates with the corresponding implementation commit, following AGENTS.md; keep historical records intact.
2. Run node --test tests/*.test.cjs and git diff --check. Tests lock the existing approved conversion tables and verify calculator-only artifact contents.
3. Commit intended files, then run git push staging HEAD:main. Use fast-forward pushes only.
4. Wait for both verify and deploy jobs in .github/workflows/pages.yml for the exact commit. Deployment is restricted to main in the staging repository.
5. Verify https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/ and confirm new asset keys, working calculations, no UDS navigation, retired UDS routes leading to the calculator and UDS scripts returning 404.

The artifact builder copies an explicit calculator asset list into dist/github-pages, creates the calculator directory route and redirects, and excludes archive/uds entirely. It rejects execution for another GITHUB_REPOSITORY. The former remote-rewriting bootstrap helper is disabled.

For rollback, revert the release with a new commit, assign fresh asset keys, run checks and push staging. Never reset shared history. A future UDS restoration or production promotion requires its own explicit request and verification.
