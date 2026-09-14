# Equianalgesic Dose Calculator

Active staging development is consolidated in this workspace. The site remains a static clinical calculator. UDS is temporarily retired and its files are retained in archive/uds/ outside the deployment artifact.

[Staging calculator](https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/)

Historical releases are preserved as **v1.0** (the production clinical-history baseline) and **v2.0** (the staging successor). See [RELEASES.md](RELEASES.md) for fixed commits, review scope, integrity records, and source downloads that remain usable after future deployments.

See [AGENTS.md](AGENTS.md) for the authoritative workspace and release instructions, [PUBLISHING.md](PUBLISHING.md) for deployment, and [CLINICAL_DATA.md](CLINICAL_DATA.md) for clinical-data traceability.

The project owner confirmed committee approval of the existing conversion ratios. All original opioid and benzodiazepine ratios and methadone bands/constants are preserved and locked by regression tests. This attestation does not imply a new review of other clinical guidance.

## Local checks

Run Node 22+ commands from this folder:

    node --test tests/*.test.cjs
    node scripts/prepare-github-pages.mjs
    node scripts/preview-github-pages.mjs

Open http://127.0.0.1:8788/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/.

Only dist/github-pages is published. Do not edit generated files. Staging receives noindex/nofollow and excludes UDS, archives, tests and backups. Source assets remain in public/. No framework, package installation or backend is required.

The staging remote is the only release destination. The production origin and original/base repository remain unchanged. The previous staging folder and its untracked drafts are preserved as an inactive local backup in workspace-backups/previous-staging-checkout.
