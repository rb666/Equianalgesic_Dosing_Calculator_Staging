# Calculator clinical-data contract

This document describes what the repository can and cannot establish about the
calculator's clinical content. It is a release and review contract, not a clinical
approval record.

## Current version and status

- Manifest: `public/calculator-provenance.js`
- Manifest version: `2026-09-14.2`
- Effective date: `2026-09-14`
- Overall ruleset review status: **unreviewed**; existing conversion ratios have committee approval confirmed by the owner, as described below.
- Existing conversion-ratio approval: **owner attestation recorded on 2026-09-13**. Committee identities, credentials and original review dates were not supplied. No approval was attested for the other clinical guidance.

Every configured opioid conversion row, methadone band/constant, benzodiazepine
row, renal rule, hepatic medication/severity rule, buprenorphine schedule and day,
PK claim field, and input/adjustment policy maps to a versioned rule record. Each
record distinguishes external evidence from local policy and records limitations.
Traceability and passing tests do not turn a local rule into an approved rule.

## Explicit input and composition policies

- Main opioid-regimen dose and frequency may be zero. A calculated zero remains
  numeric `0`; invalid, blank, or non-finite results are unavailable (`—`).
- Initial and added source-drug rows use the existing example dose and frequency.
  Changing a drug or route fills its reference dose (one patch for patch rows) and
  one dose per day. The owner explicitly requested this populated presentation on
  2026-09-14 so the input/output structure is visible immediately. Deliberately
  cleared fields remain incomplete; an unavailable target requires a new selection
  rather than substituting another drug.
- A positive value below 0.001 is displayed as `<0.001`, not as zero. This is a
  display bound; full numeric precision remains in the calculation. It is not a
  recommendation about measurable or dispensable dose increments.
- Clearing a safety-reduction field leaves the result unavailable until a
  percentage is entered. Safety reductions use 0.1% increments as requested by
  the owner on 2026-09-14; existing ranges and defaults are unchanged.
  Invalid eGFR input blocks Conversion until corrected or cleared,
  but does not block Total MME where organ adjustments do not apply;
  an intentionally empty eGFR still means optional kidney guidance is omitted.
- Methadone OME may be zero and must be a whole number. Benzodiazepine source dose
  must be greater than zero.
- Non-patch opioid dose may be decimal. Doses/day must be a whole number. Patch
  quantity uses 0.5-patch increments and represents standing 24-hour exposure.
- No clinically meaningful maximum input is inferred. Inputs and every arithmetic
  result must remain finite; overflow fails closed. A qualified reviewer must
  approve any future drug-specific maximum before it is encoded.
- Renal and hepatic advice are calculated independently from the post-safety,
  pre-organ estimate. They are never automatically stacked. If either configured
  rule says to avoid the selected target, the prominent dose is suppressed while
  the pre-organ arithmetic remains visible only for calculation transparency.

## Local and off-label policy

The following are intentionally preserved configurations, not source-validated
recommendations:

- specialty methadone bands, IV factor, and conservative MME factor;
- safety-reduction ranges and defaults;
- numeric renal and hepatic percentage rules;
- many benzodiazepine equivalence ratios;
- the Belbuca and Suboxone overlap schedules;
- zero-input and no-maximum policies;
- independent/non-stacking organ guidance; and
- the normalized PK graph shapes.

The buprenorphine schedules are explicitly classified as **unreviewed off-label
local protocols** because their daily overlap/titration behavior differs from the
cited product-label initiation instructions. Their configured steps were not
changed as part of the assurance remediation.

## Source handling

The five corrected DailyMed PK records (Hysingla, Exalgo, methadone, MS Contin, and OxyContin)
keep both a current display URL and a version-pinned evidence URL in the manifest.
Other row-level links remain identified as current, mutable references rather than
immutable evidence. The PK interface identifies Exalgo as archival. MS Contin is
not plotted with a numeric normalized profile because its current cited label does
not provide a representative peak suitable for that graph.

The manifest uses `evidenceMatch` values such as `exact`, `representative`,
`partial`, `background-only`, `conflicts`, and `none`. A source citation must never
be rendered as an approval badge. Rules marked `conflicts` or `none` retain an
evidence limitation. Evidence match and local approval are separate facts:
the owner's attestation of committee approval for existing conversion ratios
remains valid even where an external reference uses a different ratio.

## Workflow review corrections (2026-09-14)

The v2.1 workflow follow-up preserves the frozen approved tables and calculation
core. Historical review confirmed intentional whole-number methadone inputs,
half-patch exposure increments, percentage rounding/clamping, existing
buprenorphine ranges and film fractions, and Codeine IV availability. These were
not replaced with new clinical policies. Patch and benzodiazepine copy clarifies
the exposure-estimate and equivalence-calculator scope without changing dosing.

The clinical-content manifest changes only for two reference corrections:

- Tramadol IV no longer plots an IM-derived 45-minute peak as an IV curve. The
  [cited SmPC, section 5.2](https://www.medicines.org.uk/emc/product/13177/smpc)
  assigns that absorption timing to IM administration. Its IV graph is unavailable
  rather than populated with an unsupported value.
- Tapentadol IR now states the MAOI contraindication, including the 14-day
  exclusion after discontinuation, and serotonin-syndrome risk from the current
  [NUCYNTA prescribing information](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=80938c30-9fe3-4c7d-9d9c-5476638cfb2d).

Both primary references were retrieved on 2026-09-14. Belbuca/Suboxone label links
are now visible with their existing off-label schedule caveat; stale UDS source
rows were removed. This work does not attest a new clinical committee review.

## Migration assessment follow-up (2026-09-14)

Manifest `2026-09-14.2` records the owner's requested change from whole-percent
rounding to 0.1% increments for opioid, methadone and benzodiazepine safety
reductions. Typed decimal drafts are retained while editing; committing an input
rounds to the nearest tenth (half up) within the existing 100%, 90% and 50%
limits. Empty drafts remain invalid rather than becoming zero. Dose/frequency
constraints, presets, populated defaults and approved conversion tables remain
unchanged.

Codeine IV no longer plots the cited injection label's IM absorption peak as an
IV curve. The [MHRA assessment, sections 4.2 and 5.2](https://mhraproducts4853.blob.core.windows.net/docs/0858170bda543fc8bb09f20876ba508aa199d95d)
describes IM administration and an approximately 30-minute IM peak. The IV
profile is explicitly unavailable; its source links and approved conversion row
are retained. This correction changes no conversion ratio or dose calculation.
The source was retrieved on 2026-09-14. No new clinical approval is implied.

## Consumer-facing copy boundary

The provenance manifest, rule versions, review/attestation state, rule counts,
repository details, environment labels, and release-gate status are internal audit
artifacts. They must never be rendered in the staging or production interface.
Staging is a client/consumer-facing product surface, not a developer dashboard.

Clinical limitations remain visible when they affect safe use, but they must be
written as actionable clinical guidance. For example, the buprenorphine overlap
schedule is labeled off-label and directs users to institutional protocol and
specialist review; the interface does not expose repository approval metadata.
Automated static-contract tests fail if internal governance or staging/QA copy is
reintroduced into either generated route.

## Automated gate

The dependency-free test suite runs under Node's built-in test runner:

```text
node --test tests/*.test.cjs
```

The gate covers:

- all 36 conversion rows and cross-target round trips;
- valid zero, blank, decimal, constraint, non-finite, and overflow behavior;
- every specialty methadone boundary and fractional rejection;
- every configured benzodiazepine pair;
- every renal boundary/group/reduction, organ-dose ranges, non-stacking, and
  avoid precedence;
- 13 benzodiazepine, 21 hepatic, 25 schedule-step, and 147 PK claim mappings;
- repaired PK source URLs and structured representative values;
- no-JavaScript failure state, accessible status/modal contracts, naming, cache
  keys, the consumer-facing copy boundary, generated-route indexing controls,
  and CI deployment ordering; and
- a SHA-256 digest over the clinical arrays/constants and the pure calculator core.
  A clinical-data or calculation-policy change requires a deliberate manifest
  version/digest update or CI fails.

The GitHub Pages workflow runs syntax and assurance tests before deployment. Pull
requests run verification but cannot deploy. A failed verification job blocks the
staging deploy job.

## Requirements for clinical approval

Changing `clinicalReview.status` requires an external approval record containing a
qualified reviewer's identity and credentials, exact manifest/rule versions,
review date, scope, limitations, and attestation. That evidence should be retained
in an appropriate controlled system and referenced immutably; it must not be
invented from repository history or generic source citations.

## Existing conversion ratio approval and preservation (2026-09-13)

The project owner confirmed that clinical oversight committees approved the conversion ratios already listed and used on the site. This user attestation is recorded in conversionRatioApproval in the manifest. Conversion rule clinicalReviewStatus fields record approved-user-attested. Other clinical content retains its existing review status. Committee identities and original dates were not supplied.

An exact comparison against production 6fde4f9 and staging c281351 found no changes to all 36 opioid rows, 13 benzodiazepine equivalences, six methadone bands, four methadone constants, seven hepatic rows or five buprenorphine schedules. A frozen baseline fixture now blocks accidental changes. No alternate published conversion ratios were substituted.

The OxyContin PK correction changes only the displayed half-life/profile from 8 hours (text 8-12) to the labeled 4.5 hours, and steady-state text from 18-24 to 24-36 hours. Evidence: DailyMed set bfdfe235-d717-4855-a3c8-a13d26dadede, version 44, section 12.3; published 2026-06-26, retrieved 2026-09-13. This PK profile does not feed dose conversion.
