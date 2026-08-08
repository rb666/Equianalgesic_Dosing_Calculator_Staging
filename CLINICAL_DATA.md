# Calculator clinical-data contract

This document describes what the repository can and cannot establish about the
calculator's clinical content. It is a release and review contract, not a clinical
approval record.

## Current version and status

- Manifest: `public/calculator-provenance.js`
- Manifest version: `2026-08-08.1`
- Effective date: `2026-08-08`
- Clinical review status: **unreviewed**
- Named reviewer, credentials, scope, date, and attestation: **not present**

Every configured opioid conversion row, methadone band/constant, benzodiazepine
row, renal rule, hepatic medication/severity rule, buprenorphine schedule and day,
PK claim field, and input/adjustment policy maps to a versioned rule record. Each
record distinguishes external evidence from local policy and records limitations.
Traceability and passing tests do not turn a local rule into an approved rule.

## Explicit input and composition policies

- Main opioid-regimen dose and frequency may be zero. A calculated zero remains
  numeric `0`; invalid, blank, or non-finite results are unavailable (`—`).
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

The four corrected DailyMed PK records (Hysingla, Exalgo, methadone, and MS Contin)
keep both a current display URL and a version-pinned evidence URL in the manifest.
Other row-level links remain identified as current, mutable references rather than
immutable evidence. The PK interface identifies Exalgo as archival. MS Contin is
not plotted with a numeric normalized profile because its current cited label does
not provide a representative peak suitable for that graph.

The manifest uses `evidenceMatch` values such as `exact`, `representative`,
`partial`, `background-only`, `conflicts`, and `none`. A source citation must never
be rendered as an approval badge. Rules marked `conflicts` or `none` must remain
unreviewed and show a limitation.

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
node --test tests/calculator-*.test.cjs
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
