# PK graph update: evidence and scope

Prepared for the v2.1 staging series on 2026-09-14. Baseline: `7ed8635943a7602c3c9e8ca99274714e2fe1b8d4`.

The owner selected graph sample 2 (Soft area) and requested faithful graphs for the three reference-only items. Existing conversion ratios, safety reductions, renal/hepatic rules, calculation code and the approved-table fixture remain unchanged. The 18 existing profile curves retain their original points, timing markers and time scales; the fill follows the same polyline.

## New reference graphs

### Codeine IV: terminal elimination illustration

[Original study, PMID 3335120](https://pubmed.ncbi.nlm.nih.gov/3335120/), Table I, reports a healthy-volunteer IV elimination half-life of 4.04 hours (SD 0.60; six participants). The paper separately describes oral results. IV codeine phosphate was infused over 15 minutes; the terminal rate was fitted from the 10-, 12- and 24-hour samples. The original article was also checked through its [author-uploaded full text](https://www.researchgate.net/publication/232780866_Pharmacokinetics_and_pharmacodynamics_of_codeine_in_end-stage_renal_disease).

The graph uses the mean rounded to approximately 4 hours and the mathematical illustration `relative level = 2^(-time / half-life)`. Its origin is an arbitrary reference point **within the terminal phase**, not injection time, the measured peak or the start of distribution. It does not model morphine formation or analgesic effect. The study also describes substantially altered elimination in renal disease; the healthy-volunteer illustration is not an organ-adjusted prediction.

The [MHRA injection reference](https://mhraproducts4853.blob.core.windows.net/docs/0858170bda543fc8bb09f20876ba508aa199d95d) is IM-only. Its 30-minute peak is not used. The Codeine IV route caution remains visible on the card and in the clinical details.

### Tramadol IV: terminal elimination illustration

The manufacturer's [Tramadol injection/infusion SmPC](https://www.medicines.org.uk/emc/product/13177/smpc), section 5.2, describes a terminal half-life of approximately 6 hours irrespective of route. Section 4.2 permits slow IV injection and infusion. The 45-minute peak is IM absorption and is not used for the IV graph.

The same exponential illustration uses 6 hours. It excludes injection/infusion duration, initial distribution, active O-desmethyltramadol (M1), and analgesic effect. The chart explicitly begins within the terminal phase and is not a complete IV concentration profile.

### Morphine oral ER: study peak-timing plot

The current [MS Contin label](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c354b3bf-86c0-4bb8-8b1f-be2164942698) does not specify a universal representative peak. Its IV morphine half-life and its 8–12-hour dosing interval cannot supply an ER concentration curve.

A [formulation-matched primary study, PMID 2720576](https://pubmed.ncbi.nlm.nih.gov/2720576/), Table 3, reports mean peak time **3.6 hours, SD 2.3 hours**, in 18 cancer patients at steady state taking individually titrated MS Contin every 12 hours. The table explicitly identifies mean ± SD. Additional access: [author institution abstract](https://scholars.uky.edu/en/publications/pharmacokinetics-and-clinical-efficacy-of-oral-morphine-solution-/) and [original paper copy, Table 3](https://ptacts.uspto.gov/ptacts/public-informations/petitions/1458772/download-documents?artifactId=js-_OHcQPh3U6MtOBp_eggI7Ykpn4MzlDs9kjGhDefU3BXDOjkWkUpI).

The diagram places the mean at 3.6 hours, with whiskers at 1.3 and 5.9 hours (mean ± one SD) on a 12-hour axis. These are **not an observed range or confidence interval**. No concentration curve, ER elimination half-life, population-wide peak or analgesic-effect prediction is inferred.

## Traceability and release

Clinical-content manifest: `2026-09-14.3`; asset key: `20260914-pk-soft-area-1`. The manifest records the source identities and distinguishes statistical timing from a local elimination model. These graphs have no new committee approval and do not change the owner's scoped attestation for approved conversion ratios.

The cumulative footer note consolidates the PK changes into the existing reference-improvement item. Historical v1.0/v2.0/v2.1 tags and original release records remain immutable. This release is staging-only; the local experiment folders are excluded from the deployment.

Regression coverage checks half-life decay, study mean/SD geometry, exclusion of IM peaks from IV profiles, all 21 cards, fill/line alignment, unique gradient references and the frozen approved ratios. Release verification also includes the complete repository test suite, artifact preparation, desktop/mobile rendering, theme and keyboard behavior, and exact-commit staging deployment checks.
