# Historical releases

Recorded on **2026-09-13, America/Denver** (2026-09-14 UTC), at the project owner's request. These version numbers identify fixed historical releases, independently of the clinical-data manifest version and asset cache keys. This is the date the versions were designated, not the original clinical-review date.

| Version | Historical role | Fixed source commit | Archived source |
| --- | --- | --- | --- |
| **1.0** | Production at calc.med when designated; the owner's historically clinically reviewed baseline | `6fde4f914cafa7d21cd127c73a95f106c4e88524` | [v1.0](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/tree/v1.0) |
| **2.0** | Staging release after audit fixes, UDS retirement, typography work, and the reviewed visual polish | `8d77242ae9382e016bd2260dcfca347585fd4167` | [v2.0](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/tree/v2.0) |

Both annotated tags are preserved in the staging repository, including the production commit and its history behind v1.0. No production branch, deployment, hosting setting, or original/base repository is changed by this historical registration. The record commit contains documentation only; its staging artifact is identical to v2.0.

## Version 1.0: historical clinical baseline

The owner identified the version currently published at [calc.med](https://calc.med/opioidcalculator) as the historically clinically reviewed version that must remain available for later reference. Its source is the production commit titled `Promote staging build 7ab1235`, committed on 2026-05-24 at 21:12:22 -06:00. That source-commit date is not presented as a clinical-review or deployment date.

The confirmed committee approval concerns the existing opioid conversion ratios, benzodiazepine equivalences, and methadone conversion ratios, as previously attested by the owner. The owner previously distinguished these from other site content that had not been reviewed. Preserve that scope when citing version 1.0: its historical designation does not extend approval to UDS, PK profiles, other clinical guidance, or every implementation detail. Committee identities and the original review dates were not supplied. The attestation is retained as the owner's account of the review history.

Version 1.0 retains its original calculator, UDS files, logo, styles, content, and behavior. Later fixes must be released under a new version; do not edit this historical snapshot to make it resemble a later release.

[Version 1.0 integrity and observation record](releases/1.0.json) includes the full source commit and tree, SHA-256 hashes of every tracked public source file, and verification against the live calculator and UDS HTML, scripts, styles, and image assets. The production HTML matched the source after excluding two identified Cloudflare additions: a hidden `/cdn-cgi/content` link and its JavaScript detection script. Those hosting additions vary independently of the application source; their treatment is recorded explicitly.

## Version 2.0: staging successor

Version 2.0 was verified at the [staging calculator](https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/). Its source commit is `Apply reviewed visual polish to calculator`, with asset cache key `20260913-subtle-polish-release-1` and clinical-data manifest version `2026-09-13.2`.

The original approved conversion ratios remain preserved by the frozen [approved-table fixture](tests/fixtures/approved-clinical-tables.json). UDS is archived outside the deployment artifact. The original logo and 700-weight emphasis remain. The prior audit and release records describe the intervening engineering fixes.

All 29 regression tests passed, and the [verification and deployment jobs](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/actions/runs/34806888255) succeeded for this exact commit. Published assets matched the prepared artifact, and desktop/mobile browser checks passed. These checks are engineering verification; no new committee clinical review of version 2.0 is attested.

[Version 2.0 integrity and observation record](releases/2.0.json) records source hashes, the approved-table fixture hash, deployment evidence, and live asset comparisons. GitHub Pages transforms source routes and indexing metadata, so its published calculator HTML is compared against the artifact prepared from this pinned source commit.

## Referencing and retrieving the historical versions

For a clinical-history reference, cite **calc.med version 1.0, source commit `6fde4f914cafa7d21cd127c73a95f106c4e88524`**, and state the applicable review scope. A live URL or a moving `main` branch alone does not identify the historical version after future deployments.

- [Version 1.0 source pinned by commit](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/tree/6fde4f914cafa7d21cd127c73a95f106c4e88524)
- [Download version 1.0 source ZIP](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/archive/6fde4f914cafa7d21cd127c73a95f106c4e88524.zip)
- [Version 2.0 source pinned by commit](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/tree/8d77242ae9382e016bd2260dcfca347585fd4167)
- [Download version 2.0 source ZIP](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/archive/8d77242ae9382e016bd2260dcfca347585fd4167.zip)

Retrieve or export without changing the active checkout:

```powershell
git fetch staging tag v1.0 tag v2.0
git show v1.0:public/opioidcalculator.html
git archive --format=zip --prefix=calc-med-1.0/ --output=calc-med-1.0-source.zip v1.0
```

Git tags preserve the complete tracked source tree, including files outside `public/`. The per-file SHA-256 records use exact Git blob bytes; working-directory line-ending conversion can change a file's local byte hash. Hosting configuration outside Git, response headers, browser state, and the changing contents of external clinical references are not captured by these source archives.

## Version 2.1 series (2026-09-14)

The immutable `v2.1` tag identifies the initial SEO release at
`b533417716545664674df8d464ea57796a84b7d9`. Later staging deployments retain the
visible v2.1 designation and its cumulative **v1.0 to current** user-facing note.
They are identified by their exact Git commit and successful GitHub Actions run,
not by moving that tag. For example, `40b4bbcf4f529fad22976f72f5f59d078718e71d`
was the compact-selector revision, verified and deployed by
[run 34816181336](https://github.com/rb666/Equianalgesic_Dosing_Calculator_Staging/actions/runs/34816181336).

The migration follow-up in this commit adds 0.1% reduction precision, a compact
optional usage guide below the references, synchronized calculator URL fragments
and a correction to the Codeine IV reference graph. Its clinical-content manifest
is `2026-09-14.2`; its shared asset key is `20260914-migration-refinements-1`.
The deployment workflow links its verification and deployment to this exact source
commit. The approved fixture and v1.0/v2.0 historical records remain unchanged.

## Temporary staging logo review (2026-09-14)

At the owner's request, staging temporarily opens the eight-logo switcher and its comparison gallery. Original #06 remains the default; #02 is labeled New because it was never implemented in production. The preview uses balanced, borderless logo presentation without a mobile-size toggle. Its single activation setting is `staging/release.json`; disabling it and deploying restores the normal calculator-only artifact.

This is a staging presentation experiment within the v2.1 series, not a new clinical version. The public calculator HTML, JS, CSS, clinical tables, approved-table fixture, and cumulative v1.0-to-v2.1 footer note remain unchanged. The exact release commit and GitHub Actions run identify the deployment. No historical tag, production deployment, or original/base repository changes.

The staging refresh correction on 2026-09-14 separates saved tool selection from anchor navigation in the shared calculator and logo preview. Existing calculator-tab links become `?tool=...` selections; fresh loads and refreshes start at the top without focusing a selector button. Explicit guide links and keyboard navigation retain their focus behavior. The cumulative v2.1 note records the resulting direct-link behavior, and all approved clinical data remain unchanged.

## Preservation policy

- Never move, replace, delete, or reuse `v1.0`, `v2.0` or `v2.1`. They refer permanently to their recorded commits, even if production or staging moves forward.
- Keep the original integrity records intact. Record later corrections or additional review evidence as dated additions that identify the relevant historical commit.
- Use a new version tag when assigning a new public version. Deployments within a version series use exact commits and their successful workflow runs; update the cumulative user note to describe net changes from v1.0. Advancing `main` does not change historical identities.
- Do not equate a higher software version, passing tests, or unchanged ratios with a new clinical approval. Record any future committee review and its scope separately.
