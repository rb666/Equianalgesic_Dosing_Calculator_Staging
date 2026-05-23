# UDS Release Checklist

Use this checklist before promoting UDS changes from staging to production.

## Code

- `node --check uds-tool.js` passes.
- `node --check script.js` passes.
- Browser console has no UDS initialization or render errors.
- UDS opens from the top bar and closes back to the calculator without leaving `uds-screen-open` on the body.
- Interpret, Choose test, Lookup, and Panels workflows work on desktop and mobile widths.
- Copy buttons produce concise, note-ready output for chart summary, patient script, test recommendation, and lookup summary.

## Clinical Content

- High-risk analytes have clear interpretation notes, best-test guidance, and approximate detection windows.
- Parent/metabolite relationships distinguish supportive, shared, source-ambiguous, and context-dependent findings.
- Shared-byproduct and not-source-specific relationships are visibly reflected in workflow output.
- Immunoassay limitations are shown for relevant generic screens.
- Definitive testing output still reminds users that panels are targeted.
- Detection windows are concise but specific enough for clinical workflow.

## Workflow Review

- Interpret workflow supports expected, detected, and tested-but-absent findings without patient identifiers.
- Absent findings are non-actionable unless panel coverage is verified.
- Method and panel warnings appear when method/panel context is incomplete or mismatched.
- Specimen validity flags change output when results are dilute, invalid, adulterated, unknown, or interpretable.
- Choose test workflow recommends targeted testing based on the clinical question.
- Lookup workflow gives concise analyte reference information.
- Panels workflow allows only non-identifying local panel profile labels and persists them client-side.

## Manual Golden Scenarios

- Console: `window.runUdsGoldenCases()` returns all `passed: true`.
- Console: `window.copyFailedUdsGoldenCases()` copies `All UDS golden cases passed.` when no regression is present.
- Compatible definitive case: expected oxycodone, detected oxycodone, example broad definitive panel, normal validity returns `Consistent / expected` and `Routine documentation`.
- Expected opioid plus detected alcohol marker creates an opioid/alcohol safety flag.
- Unknown validity with a positive compatible finding does not automatically become specimen-limited.
- Unknown validity with an absent finding cautions that absent/negative interpretation is less secure.
- Generic opiate immunoassay with methadone, buprenorphine, tramadol, or tapentadol warns that targeted or definitive testing is needed when those drugs matter.
- Legal/employment/forensic context returns a hard stop because the tool is clinical reference only.
- Fentanyl expected with negative/absent finding on a generic opiate immunoassay warns that the screen does not exclude fentanyl.
- Oxycodone expected with oxymorphone and noroxycodone on definitive testing returns compatible or source-context language.
- Clonazepam expected with absent 7-aminoclonazepam on benzodiazepine immunoassay warns about method and panel coverage.
- Hydrocodone expected with hydromorphone detected returns source-ambiguous/context-dependent language.
- Morphine detected without 6-MAM does not label heroin exposure as proven.
- 6-MAM detected is treated as a specific recent heroin marker while still avoiding timing, dose, and impairment conclusions.
- THC-COOH detected does not infer current impairment or exact timing.
- EtG/EtS detected requires cutoff, timing, and exposure context.
- Expected medication absent with unknown panel coverage is panel-dependent.
- Unexpected immunoassay positive with high consequence recommends confirmation before action.
- Invalid or possibly adulterated specimen recommends repeat collection or lab consultation rather than interpretation.

## Safety And Privacy

- No user-entered UDS data leaves the browser.
- No analytics, remote logging, or external API calls are added for entered analytes.
- No workflow asks for patient names, DOBs, MRNs, accession numbers, order numbers, encounter numbers, addresses, or other identifiers.
- Local panel profiles use non-identifying labels only.
- The UI remains professional-use only and avoids standalone diagnosis or disciplinary conclusions.
