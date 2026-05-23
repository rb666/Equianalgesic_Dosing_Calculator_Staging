# Equianalgesic Dose Calculator

An academic-style clinical decision support prototype for opioid dose
conversion, morphine milligram equivalent (MME) estimation, methadone rotation,
buprenorphine transition guidance, benzodiazepine equivalence, pharmacokinetic
review, and urine drug screen (UDS) interpretation support.

This repository contains the static GitHub Pages staging build used for review
before production promotion.

## Purpose

Medication conversion and toxicology interpretation often require cross-checking
multiple tables, assay limitations, drug-specific pharmacology, organ-function
considerations, and patient-specific risk factors. This project consolidates
those reference workflows into an interactive browser-based tool intended to
support faster and more structured clinical review.

The application is designed for licensed healthcare professionals and clinical
review teams. It is not intended for patient self-directed dosing, automated
prescribing, or use as a substitute for clinical judgment, institutional policy,
pharmacist review, or specialist consultation.

## Clinical Modules

### Opioid Conversion and Total MME

- Multi-line regimen entry with dose-per-administration and doses-per-day.
- Total daily MME estimation across configured opioid and route combinations.
- Conversion workflow between selected source and target opioid regimens.
- Safety-reduction controls for equianalgesic dose adjustment.
- Renal and hepatic guidance sections for clinically relevant opioid classes.
- Fentanyl patch support, including additional patch strength selections.
- Methadone-specific handling, including conservative oral methadone MME output.

### Methadone Rotation

- Oral morphine to methadone calculator using a non-linear
  morphine:methadone ratio table.
- Oral and IV methadone target route output.
- Configurable methadone safety reduction.
- q8h and q12h dose breakdowns.
- Prominent warnings about accumulation, delayed toxicity, and specialist
  review.

### Buprenorphine Transition

- MEDD-stratified buprenorphine transition guidance.
- Product-specific outputs for buccal film and buprenorphine/naloxone pathways.
- Day-by-day transition schedule presentation.
- Clinical reminders about formulation differences and monitoring.

### Benzodiazepine Equivalence

- Diazepam-equivalent conversion using diazepam 10 mg as the base reference.
- Generic and brand-name support for common benzodiazepines.
- Route considerations for oral and IV formulations where clinically relevant.
- Warnings that opioid-to-benzodiazepine cross-class conversion is not supported.

### Pharmacokinetic Reference

- Selectable pharmacokinetic profiles with normalized graph visualization.
- Route behavior, metabolism, elimination, mechanism, and interaction notes.
- Extended-release and immediate-release distinctions where configured.
- Reference table for onset, peak, duration, half-life, metabolism, and source
  review.

### Urine Drug Screen Workflow Reference

- Four PHI-safe workflows: Interpret, Choose test, Lookup, and Panels.
- Interpret workflow comparing expected medications/substances, detected
  analytes, and known-tested absent findings with method, panel profile,
  consequence level, and specimen-validity context.
- Choose-test workflow for selecting an appropriate UDS method before ordering.
- Lookup workflow by drug, metabolite, brand name, finding, or class.
- Local panel profile builder for non-identifying panel labels and included
  analytes, stored client-side only.
- Output language emphasizes compatibility, panel dependence, specimen limits,
  source ambiguity, confirmation needs, and practical next steps.

## Clinical Safety Position

The calculator intentionally presents estimates and interpretive aids rather
than final prescribing recommendations. Equianalgesic conversions are
approximate and can be affected by incomplete cross-tolerance, opioid tolerance,
age, organ dysfunction, formulation constraints, pharmacogenomics, concomitant
CNS depressants, acute illness, and monitoring environment.

UDS interpretation is similarly context-dependent. Urine testing can support or
challenge a medication history, but it should not be used alone to determine
dose, exact timing, impairment, diversion, misuse, or adherence certainty.
Unexpected immunoassay findings should be interpreted against assay design,
cutoff, panel contents, specimen timing, medication list, and definitive testing
availability.

## Data and Reference Governance

The staging build uses configured conversion tables, pharmacokinetic summaries,
organ-function guidance, and UDS interpretation rules derived from clinical
reference materials and laboratory interpretation resources. Source references
are exposed within the application where relevant so reviewers can audit the
configured assumptions.

This repository should be treated as a curated clinical software prototype. Any
change to conversion ratios, dose recommendations, UDS relationship rules,
pharmacokinetic summaries, or organ-adjustment guidance should receive clinical
review before production release.

## Privacy and Deployment Model

This is a static client-side application. It has no server-side database, no
login system, and no backend data storage. Calculations and interface state are
performed in the browser.

Users should not enter patient names, medical record numbers, or other protected
health information (PHI). The tool is designed for de-identified calculation and
reference workflows.

## Repository Structure

```text
.
├── index.html          # Static page structure and modal markup
├── styles.css          # Core site layout, themes, and calculator styling
├── script.js           # Opioid, methadone, buprenorphine, benzo, and PK logic
├── uds-tool.js         # UDS lookup, pattern-check data, and interpretation logic
├── uds-tool.css        # UDS-specific layout, color system, and responsive styling
├── favicon.svg         # Site icon
├── PUBLISHING.md       # GitHub Pages publishing notes
└── .nojekyll           # GitHub Pages static file handling
```

## Local Review

Because the project is static, it can be opened directly from `index.html`.
For a local browser review that more closely matches GitHub Pages behavior, run:

```powershell
python -m http.server 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## GitHub Pages

The staging site is published from the `main` branch using GitHub Pages:

```text
https://rb666.github.io/Equianalgesic_Dosing_Calculator_Staging/
```

Publishing instructions are documented in `PUBLISHING.md`.

## Review Priorities

Before production promotion, reviewers should focus on:

- Accuracy of opioid conversion ratios and route assumptions.
- Methadone ratio logic, safety reduction behavior, and displayed warnings.
- Buprenorphine transition schedule appropriateness.
- Benzodiazepine equivalence values and route-specific assumptions.
- Pharmacokinetic text accuracy, graph behavior, and source labeling.
- UDS parent/metabolite relationships, shared-metabolite ambiguity, assay
  limitations, specimen-validity handling, local panel profiles, and workflow
  output wording.
- Accessibility, mobile responsiveness, and dark-mode readability.

## Disclaimer

This software is an educational and clinical decision support aid for qualified
professionals. It does not provide medical advice, does not replace professional
clinical judgment, and does not establish a clinician-patient relationship. Final
dosing decisions, interpretation of laboratory results, monitoring, and patient
safety remain the responsibility of the treating clinician and institution.

## Rights

All rights reserved unless a separate license is provided by the repository
owner.
