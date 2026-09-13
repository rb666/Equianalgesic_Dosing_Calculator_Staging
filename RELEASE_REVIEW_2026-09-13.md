# Staging audit remediation — 2026-09-13

## Scope and baseline

Release destination: `rb666/Equianalgesic_Dosing_Calculator_Staging:main` only.
Production `rb666/calc-med:main` remains at `6fde4f914cafa7d21cd127c73a95f106c4e88524`.
The original/base repository remains at `f2de3ace363bf649707880e688dea2391920eeca`.
Work begins from staging `c28135133ad5831c1c6a70da8d94d6129275aa0e`, which already contains calculator assurance fixes beyond the production baseline.

Active development is consolidated in this folder. The old staging checkout and its untracked UDS drafts are preserved in the ignored `workspace-backups/previous-staging-checkout`. The earlier audit report is preserved unchanged locally. The original audit rated no issues critical; the high-priority implementation/control findings are addressed below.

## Approved ratios are preserved

The owner confirmed committee approval of the site's existing conversion ratios. All 36 opioid rows, 13 benzodiazepine equivalences, six methadone ratio bands and four methadone constants match production, staging baseline and this release exactly. Seven hepatic rows and all five buprenorphine schedules also match exactly. The frozen fixture `tests/fixtures/approved-clinical-tables.json` records both baseline commits and now blocks accidental changes. No substitute external conversion ratios were introduced.

The scoped approval is recorded in the manifest and on conversion-rule records. Overall review of unrelated guidance remains separate. No new clinical committee review is claimed.

## High-priority finding disposition

| Finding | Resolution and evidence |
| --- | --- |
| H-01 Organ guidance and prominent estimate disagree | Existing staging fix labels the estimate before organ guidance, shows independent guidance, and suppresses the prominent dose on an avoid rule. Core tests and browser checks with morphine/eGFR 20/severe hepatic context pass. |
| H-02 Unsupported startup fallback dose | Existing staging markup starts unavailable, with explicit loading/error handling. Browser fixture omitting the calculator script shows `Calculator unavailable`, a dash and reload instructions. |
| H-03 Stale per-entry summaries | Existing staging adapter updates summaries on input. Browser edits update entry and totals together. This release additionally prevents blank dose/frequency summaries from appearing as zero; a regression uses the actual summary renderer. |
| H-04 Fractional methadone bypass | Existing staging validation rejects values outside the intentional integer bands. All band boundaries and fractional rejection tests pass; ratios are unchanged. |
| H-05 Invalid/zero/constraint ambiguity | Existing pure core distinguishes actual zero from missing, invalid and non-finite inputs. Browser blank/overflow yields unavailable and genuine zero yields zero. Decimal benzodiazepine input works without altering equivalence ratios. |
| H-06 UDS expected-entry order dependence | Archived engine aggregates all matching expected origins deterministically and retains source ambiguity. Reversed-origin regression cases and built-in golden cases pass. |
| H-07 Panel-blind/mismatched OUD absence flag | Archived warnings now use analyte-level absence classification and the matching expected medication. Tests cover included, excluded, class, assay-dependent, unmapped, unknown and unverified coverage for both OUD drugs and metabolites. |
| H-08 Contradictory UDS source state | Archived entry controls reject opposing results. The engine defensively blocks interpretation/copy for conflicts even if controls are bypassed. Tests cover both entry directions, copy disabling and correction. |
| H-09 Clinical traceability gap | Existing staging manifest covers clinical rows/claims with versioning and content digest. Added version-pinned OxyContin evidence and the owner's scoped approval attestation. This is traceability, not a new clinical validation of every rule. |
| H-10 No isolated calculation seam/release gate | Existing dependency-free core and CI gate retained; expanded to approved-table preservation, archive regressions and explicit artifact checks. Deployment requires verification success. |
| H-11 Unsafe release documentation/helper | Authoritative manual is now tracked and describes this workspace. Bootstrap helper can no longer rewrite origin/rename branches. Workflow and builder restrict release to the staging repository. |

## Additional changes

- UDS navigation and source sitemap entry removed. All five UDS assets retained under `archive/uds`, outside the artifact allowlist. Retired UDS URLs lead to the calculator; unknown paths remain unavailable.
- OxyContin PK half-life/profile corrected from 8 hours (text 8–12) to 4.5 hours and steady-state text from 18–24 to 24–36 hours. Source: [DailyMed OxyContin, version 44, section 12.3](https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=bfdfe235-d717-4855-a3c8-a13d26dadede&version=44), retrieved 2026-09-13. This display data does not drive dose conversion.
- Archived workflow example no longer falsely attests verified coverage. Copied summaries no longer assert that no identifiers were entered.
- Active asset cache key: `20260913-calculator-only-1`.

## Verification and limits

26 Node tests pass, including the real archived engine's built-in golden cases; syntax and patch-integrity checks pass. Local browser checks cover desktop and 390×844 mobile, light/dark themes and persistence, dose/frequency editing, blank and overflow failures, valid zero, add/remove, mixed regimen and patch MME examples, reductions, organ avoid guidance, methadone boundaries, buprenorphine schedule selection, fractional benzodiazepine dosing, keyboard tabs, PK focus wrapping/Escape and retired UDS navigation. Normal calculator console has no relevant errors. The missing-script fixture intentionally produces a resource error and fails closed.

UDS is not being restored or deployed. Its remaining lower-priority storage, specimen parsing and accessibility follow-ups are listed in `archive/uds/README.md` for restoration work. Production UDS removal remains pending a separately authorized production release. Staging deployment success and live verification are reported with the final release result; local checks alone do not establish that deployment succeeded.
