# calc.med: site review and local improvement preview

Date: 2026-09-13. Baseline: staging release `bf07e909d1d6567460c03e53f29908e14628d27b`.

## Assessment

Keep the static architecture. The site has a useful calculator structure and now has meaningful arithmetic, data-preservation and deployment checks. Its main remaining weakness is the difference between an approved conversion table and an approved clinical workflow. The owner's confirmation covers the existing conversion ratios; it does not establish approval of transition schedules, organ-adjustment policies, default inputs, formulation handling or illustrative PK models.

I would not promote the complete current feature set as clinically reviewed. My first recommendation is to withhold the unreviewed transition schedules and numeric organ-adjustment guidance from a clinical release until those exact protocols receive scoped review. That is a release recommendation; this preview preserves those features and their existing values for review. No committee-approved ratio has been replaced.

The model that originally generated the site is not evidence of correctness or error. Findings below are based on code, reproduced behavior and the cited sources.

This is a broad engineering/product audit with targeted clinical-source checks, not an independent medical approval of every claim. All configured rows are covered by inventory and preservation checks; every PK statement and clinical instruction has not been independently adjudicated by a clinician.

## Changes made in this local preview

This records the preview reviewed for the staging release. Publication status is recorded by the staging repository's GitHub Actions deployment for the corresponding commit. Production `calc.med`, the production remote and the original/base repository remain outside this change.

| Change | Initial behavior | Local result and evidence |
| --- | --- | --- |
| Selector subtitle contrast | Muted lower text was difficult to scan. | Uses the primary ink color: near-black in light theme, light text in dark theme. Active-tab measured contrast is 13.06:1 light and 11.46:1 dark. |
| Standard typography | Mixed font fallbacks and intermediate/heavy weights could render inconsistently. | Following owner review, uses the system-font styling of the production PK headings and standard 700-weight bold. Restores emphasis in the 11 rules previously reduced to regular weight. No downloaded font dependency. |
| Cleared regimen fields | Clear Drug 1 dose, then add Drug 2: the first field displayed `2` again while its state remained empty and its error remained active. | Blank dose/frequency stays blank when rows are rebuilt. Explicit zero is preserved. Reproduced in the browser; renderer regression added. |
| Clearing safety reduction | Starting at 50%, deleting the percentage immediately selected 0% and increased the displayed estimate. Same coercion existed in all three dose calculators. | Empty editing state stays empty; affected output becomes unavailable until a percentage is entered. Explicit 0 remains supported. Existing nonempty clamping, ranges and defaults are unchanged. |
| Invalid eGFR | `-1` failed the native minimum constraint but silently turned kidney guidance off while the main dose remained visible. | Field-specific error and `aria-invalid`; main output unavailable until corrected or deliberately cleared. Blank eGFR remains optional. |
| Positive values displayed as zero | `0.00001` mg input could produce a summary and result displayed as `0`. | Positive quantities below display precision read `<0.001`. Underlying arithmetic is unchanged. Range formatting also preserves a nonzero bound. This is not a dispensable-dose recommendation. |
| Result wording | Methadone was labeled a conservative starting estimate even at 0% reduction. Benzodiazepine output also implied a starting dose. | Neutral calculated-estimate/equivalent headings. No change to factors, reductions or arithmetic. |
| Narrow-screen overflow | At a 320 px viewport with a classic scrollbar, `body` required 320 px while 305 px was available. | Removed the fixed body minimum. Rechecked document width: 305 px content and 305 px scroll width. Wide tables remain in their own scroll containers. |
| Logo | A smaller SVG alternative was previewed. | Following owner review, the original 976,467-byte PNG is restored as the visible logo and remains the social image. The unused SVG draft is excluded from deployment. |
| Approval documentation | One paragraph incorrectly coupled disagreement with an external reference to lack of local approval. | Separates evidence agreement from the owner's scoped attestation of committee approval. |

The subtitle contrasts exceed the 4.5:1 normal-text threshold described by [W3C WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). These measured states are not a claim that the entire interface passes every WCAG criterion.

Affected files: `public/styles.css`, `public/opioidcalculator.html`, `public/script.js`, `public/calculator-core.js`, `public/calculator-provenance.js`, the Pages asset allowlist, focused tests and `CLINICAL_DATA.md`.

The content manifest advances to `2026-09-13.2` because its digest includes the core file and the display formatter changed. The approved clinical-table fixture was not regenerated. No clinical array changed in this preview.

## Highest-priority remaining findings

### R1. Transition schedules need their own protocol review — high priority

Location: `public/script.js`, `buprenorphineSchedules`; `public/opioidcalculator.html`, buprenorphine panel.

The Belbuca schedules contain daily increases while continuing the full agonist. For example, the 30–59 MEDD schedule progresses from 150 mcg twice daily to 300 mcg twice daily the next day. Current labeling describes tapering the prior opioid to no more than 30 mg oral morphine equivalents before initiation and a minimum four-day titration interval. See [BELBUCA prescribing information, sections 2.3–2.4](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bc2b7a3d-72cf-497c-95b0-ba2b71f63c64).

The Suboxone schedule specifically describes quarter and half films. The cited label directs administration of whole films and prohibits cutting. See [SUBOXONE prescribing information, section 2.5](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8a5edcf9-828c-4f97-b671-268ab13a8ecd).

These differences do not by themselves prove that every off-label overlap protocol is inappropriate. They do establish that a product-label citation does not validate these exact instructions. The interface already discloses that the schedules are off-label; that disclosure is useful but does not replace protocol review.

Recommendation: temporarily withhold the schedule output from clinical use. Have pain/addiction/palliative clinicians and pharmacy review indication, inclusion/exclusion criteria, overlap doses, exact formulation preparation, monitoring, missed steps, withdrawal management and stop criteria. Retain the source data. Do not invent a replacement regimen during UI cleanup.

### R2. Numeric kidney/liver guidance exceeds the ratio approval — high priority

Locations: `public/calculator-core.js`, `RENAL_POLICY`; `public/script.js`, `hepaticGuidanceRows`, `getRenalAdvice`, `getHepaticAdvice`; HTML organ-context fields.

The software correctly reproduces its configured rules, including 25%/50% renal reductions based on pain-control context and independent hepatic ranges. That proves implementation consistency, not clinical validity of the percentages. The owner has not attested approval of these rules.

The eGFR field is labeled mL/min without identifying whether the input is indexed or unindexed. Common laboratory estimates may be indexed to 1.73 m²; method and body-size context can matter for drug dosing. This needs an explicit input contract, not a guessed unit change. [NIDDK discusses equation selection, body surface area and drug-label differences](https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/ckd-drug-dosing-providers).

The hepatic categories are mild/moderate/severe based on clinical judgment, not a validated score. A generic category must not be assumed equivalent to a formulation's label-specific definition of hepatic impairment.

Recommendation: review each drug, route, formulation, severity definition, renal metric and percentage. Until then, prefer reviewed qualitative cautions over numeric adjusted-dose recommendations. Preserve the existing avoid precedence and do not automatically stack renal and hepatic adjustments.

### R3. Half-patch input needs a formulation policy — high priority

Locations: `public/calculator-core.js`, patch validation; `public/script.js`, regimen input markup and patch hints.

The calculator accepts 0.5-patch increments and describes them as active patches. It does not tell users to cut patches, but that quantity model can imply that a fraction of a patch is an ordinary administration unit. The cited [fentanyl transdermal label](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=242759ef-cb6d-4e3e-9f8d-5e31efa1f289) and [buprenorphine transdermal label](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c7d079fb-507f-436f-b794-2171b7d97067) prohibit cutting their patches.

Recommendation: distinguish documenting an observed exposure from prescribing intact marketed products. Review whether fractional quantities should be accepted at all, and add product-specific handling warnings. This concerns units and administration policy, not the committee-approved exposure equivalences. No patch factor or quantity policy was silently changed here.

### R4. Default medication/dose values can look like entered patient data — high priority

Locations: `public/script.js`, `createRegimenEntry`, `handleRegimenEntryInput`, Add another drug handler, initialization.

A fresh page contains hydromorphone IV 2 mg once daily and a calculated target result. Adding another row immediately adds another populated hydromorphone entry. Changing the drug also replaces its dose with a reference value. These are real numerical inputs, not placeholders, and the result changes before the user supplies a regimen for that row.

Recommendation: use blank new rows and an explicit empty state; populate synthetic regimens only through the existing Load example actions. On a drug/route change, require a deliberate dose entry or acknowledgement of a preserved value rather than silently inserting a reference dose. Preserve all approved conversion values. This behavior remains unchanged pending review of the workflow.

### R5. Define the clinical scope and the meaning of each output — high priority

Locations: calculator instructions, reduction presets, methadone/benzodiazepine panels, reference tables.

The visible clinician warning, explicit units, methadone cautions and before-ordering checklist are useful. However, intended populations and indications are not consistently stated for every tool. The application does not encode product-specific eligibility, dosage-form availability, titration intervals, or all relevant contraindications. A daily mathematical equivalent is not automatically an administrable regimen.

Recommendation: obtain scoped decisions about population, indication, permitted settings, formulation restrictions, reduction presets and rounding/display policy. Keep calculated equivalence distinct from a prescribing instruction. Avoid substituting a different external MME scheme for the approved tables. CDC itself cautions against using its calculated MME directly as a rotation dose; that supports clarifying the workflow, not overwriting the local ratios. See [CDC 2022 guideline, conversion-factor cautions](https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm).

## Product, accessibility and performance findings

### R6. Mobile prioritization — medium priority

At the checked 390 × 844 viewport, the first dose input was approximately 1,902 px below the document top. Header copy, disclaimer, a separate logo card and five stacked selector buttons all precede the inputs.

Recommendation: reduce duplicated header language after appropriate copy review, make mobile branding compact, and compare a two-column selector against the current stack. Add a keyboard-accessible skip-to-calculator link. Keep the warning available and do not turn it into an acceptance gate. Do not replace native controls with a custom selector solely for appearance.

The contrast, typography and narrow-width fixes are included locally. The broader mobile restructuring is a recommendation, not an implemented redesign.

### R7. PK graphics imply more modeling than the sources establish — medium priority

Locations: `public/script.js`, `getGraphValue`, `buildPharmacokineticsGraphSvg`, PK renderers.

Twenty plotted profiles use simplified normalized curves; one profile is intentionally unavailable. The pre-peak power of 0.72 and patch ramp/plateau shape are implementation choices, not demonstrated fitted concentration models. Cards use different time horizons. The existing normalized-visual-aid disclaimer mitigates misunderstanding, but readers can still compare shapes as if they were measured curves.

Recommendation: make sourced timing ranges and formulation details primary. If curves remain, call them schematic, expose time-scale differences clearly, and review whether each curve adds useful information. A graph is not a better reference merely because it is interactive. Render the substantial PK content when opened rather than at initial calculator startup if a measured performance trace shows a benefit.

### R8. Accessibility needs an assistive-technology pass — medium priority

Verified: native labels, selected-tab semantics, keyboard Home/End/arrow handling, live result statuses, PK Escape and focus restoration, light/dark theme persistence, and document reflow after the narrow-width repair. Result suppression remains visibly explicit.

Remaining checks: real screen-reader announcements during rapid editing; repeated Drug/Remove controls in multi-entry forms; grouped field context; focus movement after row removal; text zoom and forced colors; all hover/focus/error contrast combinations; and mobile screen-reader operation. Input boundaries use subtle borders and deserve a non-text contrast review. This is not a WCAG conformance certification.

Recommendation: conduct a short task-based session with keyboard-only and screen-reader users before a clinical release. Preserve native controls and current focus behavior. Add print/export only if clinicians need it, and include the regimen, units, reductions and relevant limitations in any such output.

### R9. Maintainability is concentrated, not dependency-heavy — lower priority

The application has no framework, package manifest, backend or application dependency tree. The approximately 3,650-line browser script mixes clinical data, reference content, rendering and event handling. That concentration increases review effort, but does not justify replacing the stack.

Recommendation: retain the pure calculation core and frozen ratio fixture. In small future changes, separate clinical/reference data from DOM rendering while verifying unchanged behavior. Remove leftover inactive UDS CSS only after a usage check; the archived UDS tool must remain restorable. Do not add a bundler, framework or broad test dependency just to shorten a file.

The original logo was restored at the owner's request, so the proposed logo transfer-size improvement is no longer part of this preview. No Lighthouse score, Core Web Vitals measurement, CPU throttle profile or actual patient-network benchmark was collected in this pass.

## Operational and security review

| Area | Assessment |
| --- | --- |
| Staging/production boundary | Active branch tracks `staging/main`; production `origin` and original/base repo remain protected. No push or deployment in this preview pass. |
| Release artifact | Explicit asset allowlist; UDS, archives, backup checkout and repository docs excluded. Tests verify generated routes and asset existence. |
| Routing and indexing | Project-prefixed calculator URL; known retired UDS paths handled; unknown paths have a useful 404. Generated staging HTML is noindex/nofollow with robots Disallow. Source production metadata remains distinct. |
| Failure behavior | No-JavaScript/load failure states are present. Numeric blank/nonfinite/overflow checks, avoid precedence and focused editing regressions are covered. |
| Persistence/privacy | Active calculator code persists the theme. No application API calls, analytics, cookie use or clinical-entry persistence found in the reviewed active code. Hosting and browser behavior are outside that claim. |
| DOM insertion | Templates use repository data and numeric state. No exploitable injection path was demonstrated. Static hosting does not remove the need to review future free-text inputs. |
| CI | Verification precedes staging deployment; repository/branch checks restrict the deploy job. Frozen fixtures and a content digest catch unintentional clinical changes. |
| Assurance limitations | Tests characterize configured rules; they do not certify their clinical appropriateness. Browser checks were manual, not a permanent automated full-browser suite. External account permissions, hosting headers and repository branch-protection settings were not audited in this pass. |

## Verification and preservation record

- 29 dependency-free Node tests passed, including the frozen-table comparison and three new regression cases.
- JavaScript syntax checks passed for the three active scripts, two archived UDS scripts and both preparation/preview scripts.
- The Pages preparation step and patch-integrity check passed.
- Browser checks: cleared dose followed by adding another row; mixed-regimen result 45 and MME 90; cleared and restored reduction in conversion, methadone and benzodiazepine calculators; invalid/cleared eGFR; renal avoid precedence; positive values below display precision; five-tab access; schedule selection/rendering; keyboard End; PK graph validity, Escape and focus return; light/dark theme and persistence; desktop, 390 px and 320 px layouts. These are synthetic software checks, not patient recommendations.
- Checked browser console contained no error/warning entries at verification time.
- Approved data remains identical: 36 opioid rows, 13 benzodiazepine rows, six methadone bands and four methadone constants. The seven hepatic rows and five buprenorphine schedules are also preserved, without implying approval of that other guidance.
- Core changes in this preview concern display formatting only. No conversion arithmetic, clinical array, organ percentage, methadone route factor or reduction default changed.
- Original PNG and archived UDS files remain intact. The preexisting `CODEBASE_REVIEW_AND_AUDIT_2026-08-08.md` was not edited.

## Recommended order of work

1. Review this local preview for typography, contrast, logo and repaired input behavior.
2. Before a clinical release, resolve R1–R5 with explicit scope: retain the approved ratios, temporarily withhold unreviewed protocols where necessary, and have qualified clinical owners review the exact remaining policies.
3. Make new-regimen entry deliberate and streamline the mobile path to the calculator.
4. Complete focused accessibility testing and simplify PK presentation where useful.
5. Continue maintenance in the existing static stack; push only to staging after the owner's preview review. Production requires separate authorization.

Local preview: http://127.0.0.1:8788/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/
