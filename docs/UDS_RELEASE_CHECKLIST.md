# UDS Release Checklist

Use this checklist before promoting UDS changes from staging to production.

## Code

- `node --check uds-tool.js` passes.
- `node --check script.js` passes.
- Browser console has no UDS initialization or render errors.
- Lookup and Pattern Check work on desktop and mobile widths.
- Copy-summary buttons produce concise, note-ready output.

## Clinical Content

- High-risk lookup entries have clear bottom line, pitfall, and next step.
- Parent/metabolite relationships are source-backed and use consistent clinical tags.
- Shared-byproduct and not-source-specific relationships are visibly flagged.
- Immunoassay limitations are shown for relevant generic screens.
- Definitive testing output still reminds users that panels are targeted.
- Detection windows are concise but specific enough for clinical workflow.

## Pattern Check

- Expected, detected, and absent workflows are understandable without training.
- Absent findings are non-actionable unless panel coverage is verified.
- Method and panel warnings appear when method/panel context is incomplete or mismatched.
- Source ambiguity appears for hydromorphone, oxymorphone, morphine/codeine/heroin, benzodiazepine shared metabolites, THC markers, and alcohol markers.
- Rule/source trace is available for audit without dominating default output.

## Golden Scenarios

- Open staging with `?udsValidation=1`, confirm the automatic harness result is `passed`, then optionally run `window.runUdsGoldenCases()` in the browser console and confirm every row returns `passed: true`.
- Fentanyl expected with negative generic opiate screen.
- Oxycodone expected with negative generic opiate screen.
- Clonazepam expected with negative benzodiazepine screen.
- Hydrocodone expected with hydromorphone detected.
- Morphine detected without 6-MAM.
- 6-MAM detected.
- THC-COOH detected.
- EtG/EtS detected.
- Expected medication absent with unknown panel coverage.
- Unexpected detected finding with no expected medication entered.

## Safety And Privacy

- No user-entered UDS data leaves the browser.
- No analytics, remote logging, or external API calls are added for entered analytes.
- The UI remains professional-use only and avoids standalone diagnosis or disciplinary conclusions.
