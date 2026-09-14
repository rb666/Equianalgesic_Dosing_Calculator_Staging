(function initializeCalculatorProvenance(root) {
  "use strict";

  const deepFreeze = (value) => {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
      return value;
    }

    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  };

  const schemaVersion = "1.0.0";
  const manifestVersion = "2026-09-14.4";
  const effectiveDate = "2026-09-14";
  const retrievedAt = "2026-08-08";

  const sources = {
    "codeine-iv-study-3335120": {
      authority: "Original pharmacokinetic study / PubMed",
      type: "clinical-study",
      title: "Pharmacokinetics and pharmacodynamics of codeine in end-stage renal disease",
      displayUrl: "https://pubmed.ncbi.nlm.nih.gov/3335120/",
      evidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/3335120/",
      retrievedAt: "2026-09-14",
      lifecycle: "archival",
    },
    "ms-contin-study-2720576": {
      authority: "Original pharmacokinetic study / PubMed",
      type: "clinical-study",
      title: "Pharmacokinetics and clinical efficacy of oral morphine solution and controlled-release morphine tablets in cancer patients",
      displayUrl: "https://pubmed.ncbi.nlm.nih.gov/2720576/",
      evidenceUrl: "https://pubmed.ncbi.nlm.nih.gov/2720576/",
      retrievedAt: "2026-09-14",
      lifecycle: "archival",
    },
    "emc-tramadol-injection-13177": {
      authority: "AS Kalceks / electronic Medicines Compendium",
      type: "product-label",
      title: "Tramadol 50 mg/ml solution for injection/infusion SmPC",
      displayUrl: "https://www.medicines.org.uk/emc/product/13177/smpc",
      evidenceUrl: "https://www.medicines.org.uk/emc/product/13177/smpc",
      retrievedAt: "2026-09-14",
      lifecycle: "current",
    },
    "cdc-opioid-2022": {
      authority: "Centers for Disease Control and Prevention",
      type: "clinical-guideline",
      title:
        "CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022",
      displayUrl: "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm",
      evidenceUrl: "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm",
      publicationDate: "2022-11-04",
      retrievedAt,
      lifecycle: "current",
    },
    "ucsf-ome": {
      authority: "University of California, San Francisco",
      type: "clinical-reference",
      title: "Calculation of Oral Morphine Equivalents (OME)",
      displayUrl:
        "https://pain.ucsf.edu/opioid-analgesics/calculation-oral-morphine-equivalents-ome",
      evidenceUrl:
        "https://pain.ucsf.edu/opioid-analgesics/calculation-oral-morphine-equivalents-ome",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "west-midlands-transdermal": {
      authority: "West Midlands Palliative Care Physicians",
      type: "clinical-reference",
      title: "Approximate equivalent doses of transdermal opioids",
      displayUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/pain/transdermal-opioids/approximate-equivalent-doses-of-transdermal-opioids/",
      evidenceUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/pain/transdermal-opioids/approximate-equivalent-doses-of-transdermal-opioids/",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "west-midlands-renal": {
      authority: "West Midlands Palliative Care Physicians",
      type: "clinical-reference",
      title: "Pain management in renal failure",
      displayUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/renal-disease/renal-analgesia/",
      evidenceUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/renal-disease/renal-analgesia/",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "west-midlands-hepatic": {
      authority: "West Midlands Palliative Care Physicians",
      type: "clinical-reference",
      title: "Liver failure pain management",
      displayUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/liver-failure/liver-failure-pain-management/",
      evidenceUrl:
        "https://www.westmidspallcare.co.uk/wmpcp/guide/liver-failure/liver-failure-pain-management/",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "nhs-sps-benzodiazepines": {
      authority: "NHS Specialist Pharmacy Service",
      type: "clinical-reference",
      title: "Oral benzodiazepines and choosing equivalent doses",
      displayUrl:
        "https://www.sps.nhs.uk/articles/oral-benzodiazepines-and-choosing-equivalent-doses/",
      evidenceUrl:
        "https://www.sps.nhs.uk/articles/oral-benzodiazepines-and-choosing-equivalent-doses/",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-belbuca": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "BELBUCA (buprenorphine buccal film)",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bc2b7a3d-72cf-497c-95b0-ba2b71f63c64",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bc2b7a3d-72cf-497c-95b0-ba2b71f63c64",
      setId: "bc2b7a3d-72cf-497c-95b0-ba2b71f63c64",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-suboxone": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "SUBOXONE (buprenorphine/naloxone film)",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8a5edcf9-828c-4f97-b671-268ab13a8ecd",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8a5edcf9-828c-4f97-b671-268ab13a8ecd",
      setId: "8a5edcf9-828c-4f97-b671-268ab13a8ecd",
      publicationDate: null,
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-hysingla-v17": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "HYSINGLA ER (hydrocodone bitartrate extended-release tablets)",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b7d23ac2-e776-9f62-3290-c64c2d6eb353",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b7d23ac2-e776-9f62-3290-c64c2d6eb353&version=17",
      setId: "b7d23ac2-e776-9f62-3290-c64c2d6eb353",
      labelVersion: "17",
      publicationDate: "2026-06-18",
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-exalgo-v1": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "EXALGO (hydromorphone hydrochloride extended-release tablets)",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f26ababe-f6f0-443e-8d91-4d2a174675bc",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=f26ababe-f6f0-443e-8d91-4d2a174675bc&version=1",
      setId: "f26ababe-f6f0-443e-8d91-4d2a174675bc",
      labelVersion: "1",
      publicationDate: "2011-03-31",
      retrievedAt,
      lifecycle: "archival",
    },
    "dailymed-methadone-v47": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "Methadone hydrochloride tablets",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eddf7077-02fb-4771-9823-31984f4ff2bb",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=eddf7077-02fb-4771-9823-31984f4ff2bb&version=47",
      setId: "eddf7077-02fb-4771-9823-31984f4ff2bb",
      labelVersion: "47",
      publicationDate: "2026-05-01",
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-ms-contin-v17": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "MS CONTIN (morphine sulfate extended-release tablets)",
      displayUrl:
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c354b3bf-86c0-4bb8-8b1f-be2164942698",
      evidenceUrl:
        "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c354b3bf-86c0-4bb8-8b1f-be2164942698&version=17",
      setId: "c354b3bf-86c0-4bb8-8b1f-be2164942698",
      labelVersion: "17",
      publicationDate: "2026-04-13",
      retrievedAt,
      lifecycle: "current",
    },
    "dailymed-oxycontin-v44": {
      authority: "National Library of Medicine / FDA SPL",
      type: "product-label",
      title: "OXYCONTIN (oxycodone hydrochloride extended-release tablets)",
      displayUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bfdfe235-d717-4855-a3c8-a13d26dadede",
      evidenceUrl: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=bfdfe235-d717-4855-a3c8-a13d26dadede&version=44",
      setId: "bfdfe235-d717-4855-a3c8-a13d26dadede",
      labelVersion: "44",
      publicationDate: "2026-06-26",
      retrievedAt: "2026-09-13",
      lifecycle: "current",
    },
    "repository-local-configuration": {
      authority: "calc.med repository",
      type: "local-configuration",
      title: "Versioned calculator configuration",
      displayUrl: null,
      evidenceUrl: null,
      publicationDate: effectiveDate,
      retrievedAt,
      lifecycle: "current",
    },
  };

  const inventory = {
    conversions: [
      "Morphine_IV", "Morphine_Oral", "Morphine_Oral_ER", "Codeine_IV",
      "Codeine_Oral", "Hydrocodone_Oral", "Hydrocodone_Oral_ER",
      "Oxycodone_Oral", "Oxycodone_Oral_ER", "Hydromorphone_IV",
      "Hydromorphone_Oral", "Hydromorphone_Oral_ER", "Methadone_Oral",
      "Methadone_IV", "Meperidine_IV", "Meperidine_Oral", "Fentanyl_Patch_12",
      "Fentanyl_Patch_25", "Fentanyl_Patch_37", "Fentanyl_Patch_50",
      "Fentanyl_Patch_62", "Fentanyl_Patch_75", "Fentanyl_Patch_87",
      "Fentanyl_Patch_100", "Fentanyl_IV", "Tramadol_IV", "Tramadol_Oral",
      "Tramadol_Oral_ER", "Tapentadol_Oral", "Tapentadol_Oral_ER",
      "Oxymorphone_IV", "Oxymorphone_Oral", "Oxymorphone_Oral_ER",
      "Buprenorphine_Patch_5", "Buprenorphine_Patch_10",
      "Buprenorphine_Patch_20",
    ],
    benzodiazepines: [
      "alprazolam_po", "chlordiazepoxide_po", "clonazepam_po", "clorazepate_po",
      "diazepam_po", "diazepam_iv", "lorazepam_po", "lorazepam_iv",
      "midazolam_po", "midazolam_iv", "oxazepam_po", "temazepam_po",
      "triazolam_po",
    ],
    methadoneBands: ["0-30", "31-99", "100-299", "300-499", "500-999", "1000-plus"],
    hepaticMedications: [
      "Morphine", "Hydromorphone", "Oxycodone", "Tramadol", "Fentanyl",
      "Methadone", "Buprenorphine",
    ],
    buprenorphineSchedules: ["30_59", "60_89", "90_120", "121_160", "161_300"],
    pharmacokinetics: [
      "buprenorphine-patch", "codeine-iv", "codeine-oral-ir", "fentanyl-iv",
      "fentanyl-patch", "hydrocodone-oral-ir", "hydrocodone-oral-er",
      "hydromorphone-iv", "hydromorphone-oral-ir", "hydromorphone-oral-er",
      "methadone-oral", "morphine-iv", "morphine-oral-ir", "morphine-oral-er",
      "oxycodone-oral-ir", "oxycodone-oral-er", "tapentadol-oral-ir",
      "tapentadol-oral-er", "tramadol-iv", "tramadol-oral-ir", "tramadol-oral-er",
    ],
  };

  const localRule = (id, appliesTo, overrides = {}) => ({
    id,
    version: "1.0.0",
    appliesTo,
    basis: "local-policy",
    sourceRefs: [
      {
        sourceId: "repository-local-configuration",
        locator: appliesTo.join(", "),
      },
    ],
    evidenceMatch: "none",
    clinicalReviewStatus: "unreviewed",
    clinicalOwner: null,
    reviewedAt: null,
    limitations:
      "Traceable configuration only. No named clinical approver or approval record is present in the repository.",
    testIds: [],
    updatedAt: effectiveDate,
    ...overrides,
  });

  const rules = {};
  inventory.conversions.forEach((id) => {
    const ruleId = `conversion.${id}`;
    rules[ruleId] = localRule(ruleId, [`conversionOptions.${id}`], {
      sourceRefs: [
        { sourceId: "repository-local-configuration", locator: `conversionOptions.${id}` },
        { sourceId: "cdc-opioid-2022", locator: "MME conversion-factor table and cautions" },
      ],
      evidenceMatch: "partial",
      limitations:
        "The configured row is regression-tested. A cited MME factor does not validate use of that factor to determine an opioid-rotation dose; route and formulation relationships may be local.",
      testIds: ["conversion-self", "conversion-round-trip"],
    });
  });

  inventory.benzodiazepines.forEach((id) => {
    const ruleId = `benzodiazepine.${id}`;
    rules[ruleId] = localRule(ruleId, [`benzoConversionOptions.${id}`], {
      sourceRefs: [
        { sourceId: "repository-local-configuration", locator: `benzoConversionOptions.${id}` },
        { sourceId: "nhs-sps-benzodiazepines", locator: "approximate oral-equivalence table" },
      ],
      evidenceMatch: ["chlordiazepoxide_po", "diazepam_po"].includes(id)
        ? "exact"
        : "conflicts",
      limitations:
        "Some committee-approved ratios differ from, or are outside the route/scope of, the cited NHS oral-equivalence table. Preserve the approved local ratios; the external citation is not the approval authority.",
      testIds: ["benzodiazepine-self", "benzodiazepine-pair"],
    });
  });

  inventory.methadoneBands.forEach((id) => {
    const ruleId = `methadone.band.${id}`;
    rules[ruleId] = localRule(ruleId, [`methadoneRatioTable.${id}`], {
      limitations:
        "Committee-approved nonlinear band per project-owner attestation. Integer boundaries are intentionally preserved; original committee names and review dates were not supplied.",
      testIds: ["methadone-boundaries", "methadone-fraction-rejected"],
    });
  });

  [
    ["methadone.main-oral-mme-factor", "4.7"],
    ["methadone.conservative-oral-mme-factor", "3.0"],
    [
      "methadone.specialty-iv-route-factor",
      "CalculatorCore.METHADONE_ROUTE_FACTORS.iv",
    ],
    ["policy.general-safety-reduction", "0-100 percent in 0.1% increments"],
    ["policy.methadone-safety-reduction", "0-90 percent in 0.1% increments"],
    ["policy.benzodiazepine-safety-reduction", "0-50 percent in 0.1% increments"],
    ["policy.zero-inputs", "tool-specific zero contract"],
    ["policy.maximum-inputs", "no clinical maximum; finite arithmetic required"],
    ["policy.organ-composition", "independent; never automatically stacked"],
  ].forEach(([id, locator]) => {
    rules[id] = localRule(id, [locator], {
      testIds: [id],
    });
  });

  const renalRuleLocators = {
    "50-plus": "CalculatorCore.RENAL_POLICY.thresholds.standardMinimumExclusive",
    "30-50": "CalculatorCore.RENAL_POLICY.thresholds.moderateMinimumInclusive",
    "under-30": "CalculatorCore.RENAL_POLICY.thresholds.moderateMinimumInclusive",
    "restricted-medications": "CalculatorCore.RENAL_POLICY.medicationGroups.restricted",
    "cautious-alternatives":
      "CalculatorCore.RENAL_POLICY.medicationGroups.cautiousAlternative",
    "lower-kidney-effect-alternatives":
      "CalculatorCore.RENAL_POLICY.medicationGroups.lowerKidneyEffectAlternative",
    "controlled-pain": "CalculatorCore.RENAL_POLICY.reductions.controlled",
    "uncontrolled-pain": "CalculatorCore.RENAL_POLICY.reductions.uncontrolled",
  };
  Object.entries(renalRuleLocators).forEach(
    ([id, locator]) => {
      const ruleId = `renal.${id}`;
      rules[ruleId] = localRule(ruleId, [locator], {
        sourceRefs: [
          { sourceId: "repository-local-configuration", locator },
          { sourceId: "west-midlands-renal", locator: "opioid groupings in renal failure" },
        ],
        evidenceMatch: "background-only",
        limitations:
          "The source supports broad risk groupings, not the calculator's numeric 30-50 mL/min reductions or automatic composition.",
        testIds: ["renal-boundaries", "renal-avoid-precedence"],
      });
    },
  );

  inventory.hepaticMedications.forEach((medication) => {
    ["mild", "moderate", "severe"].forEach((severity) => {
      const ruleId = `hepatic.${medication.toLowerCase()}.${severity}`;
      rules[ruleId] = localRule(ruleId, [
        `hepaticGuidanceRows.${medication}.${severity}`,
      ], {
        sourceRefs: [
          { sourceId: "repository-local-configuration", locator: ruleId },
          { sourceId: "west-midlands-hepatic", locator: `${medication} guidance` },
        ],
        evidenceMatch: "background-only",
        limitations:
          "The cited reference supplies caution context, not this percentage table; some medication-level rules differ by formulation or from the reference.",
        testIds: ["hepatic-all-rules", "hepatic-avoid-precedence"],
      });
    });
  });

  inventory.buprenorphineSchedules.forEach((id) => {
    const belbuca = id !== "161_300";
    const ruleId = `buprenorphine.schedule.${id}`;
    rules[ruleId] = localRule(ruleId, [`buprenorphineSchedules.${id}`], {
      basis: "off-label-local-protocol",
      sourceRefs: [
        { sourceId: "repository-local-configuration", locator: ruleId },
        {
          sourceId: belbuca ? "dailymed-belbuca" : "dailymed-suboxone",
          locator: "Dosage and Administration",
        },
      ],
      evidenceMatch: "conflicts",
      limitations:
        "The overlap/titration schedule differs from the cited product label and has no protocol citation or named clinical attestation. It is displayed as an unreviewed off-label local protocol.",
      testIds: ["buprenorphine-schedule-characterization"],
    });

    ["1", "2", "3", "4", "5"].forEach((day) => {
      const stepRuleId = `${ruleId}.day-${day}`;
      rules[stepRuleId] = localRule(stepRuleId, [
        `buprenorphineSchedules.${id}.days.${day}`,
      ], {
        basis: "off-label-local-protocol",
        sourceRefs: rules[ruleId].sourceRefs,
        evidenceMatch: "conflicts",
        limitations: rules[ruleId].limitations,
        testIds: ["buprenorphine-schedule-characterization"],
      });
    });
  });

  const pkClaimTypes = [
    "profile",
    "timing",
    "half-life",
    "metabolism",
    "mechanism",
    "behavior",
    "interactions",
  ];
  const versionPinnedPkSources = {
    "hydrocodone-oral-er": "dailymed-hysingla-v17",
    "hydromorphone-oral-er": "dailymed-exalgo-v1",
    "methadone-oral": "dailymed-methadone-v47",
    "morphine-oral-er": "dailymed-ms-contin-v17",
    "oxycodone-oral-er": "dailymed-oxycontin-v44",
  };
  inventory.pharmacokinetics.forEach((id) => {
    pkClaimTypes.forEach((claimType) => {
      const ruleId = `pk.${id}.${claimType}`;
      rules[ruleId] = localRule(ruleId, [
        `pharmacokineticsRows.${id}.${claimType}`,
      ], {
        basis: "source-summary",
        sourceRefs: [
          {
            sourceId:
              versionPinnedPkSources[id] || `embedded-pk-source:${id}`,
            locator: `pharmacokineticsRows.${id}.sources`,
          },
        ],
        evidenceMatch: "representative",
        limitations:
          "Claim-level source identity is the stable source URL stored on the same PK row. Representative graph points are simplified and are not validated concentration curves.",
        testIds: ["pk-structured-profile", "pk-source-coverage"],
      });
    });
  });

  ["absorptive-shape", "patch-shape"].forEach((id) => {
    const ruleId = `pk.graph.${id}`;
    rules[ruleId] = localRule(ruleId, [`buildProfilePath.${id}`], {
      basis: "local-visual-model",
      limitations:
        "The normalized curve shape is an illustrative local model, not a clinically validated pharmacokinetic simulation.",
      testIds: ["pk-graph-model-disclaimer"],
    });
  });

  rules["pk.graph.terminal-elimination"] = localRule(
    "pk.graph.terminal-elimination",
    ["buildPharmacokineticsReferenceGraph.elimination"],
    {
      basis: "local-visual-model",
      sourceRefs: [
        { sourceId: "codeine-iv-study-3335120", locator: "Table I: healthy-volunteer IV elimination half-life, 4.04 h (SD 0.60); rounded to 4 h for the illustration" },
        { sourceId: "emc-tramadol-injection-13177", locator: "Section 5.2: terminal half-life about 6 h irrespective of administration route" },
      ],
      limitations: "The exponential 2^(-t/half-life) shows parent-drug decline from an arbitrary reference point within the terminal phase. It excludes administration, distribution, active metabolites and analgesic effect. The source half-lives do not validate a complete IV concentration curve. Codeine IV remains a caution row, not a route recommendation.",
      testIds: ["pk-terminal-elimination-reference", "pk-no-im-peak-as-iv"],
    },
  );
  rules["pk.graph.study-peak-timing"] = localRule(
    "pk.graph.study-peak-timing",
    ["pharmacokineticsRows.morphine-oral-er.profile.referenceGraph"],
    {
      basis: "source-summary",
      evidenceMatch: "representative",
      sourceRefs: [{ sourceId: "ms-contin-study-2720576", locator: "Table 3: steady-state MS Contin Tmax 3.6 +/- 2.3 h (mean +/- SD), 18 cancer patients taking individually titrated doses every 12 h" }],
      limitations: "The marker and whiskers show the study mean and one standard deviation, not a measured concentration curve, confidence interval or observed range. They are not a universal peak for morphine ER products. No ER half-life is inferred from its dosing interval or from IV morphine.",
      testIds: ["pk-ms-contin-study-timing"],
    },
  );

  // Committee approval is distinct from agreement with any one external reference.
  for (const rule of Object.values(rules)) {
    if (/^(conversion\.|benzodiazepine\.|methadone\.)/.test(rule.id)) {
      rule.clinicalReviewStatus = "approved-user-attested";
      rule.clinicalOwner = "Clinical oversight committees (project-owner attestation)";
      rule.approvalAttestedAt = "2026-09-13";
      if (rule.limitations.startsWith("Traceable configuration only.")) {
        rule.limitations = "Existing committee-approved conversion ratio per project-owner attestation; original committee names and review dates were not supplied.";
      }
    }
  }

  root.CALCULATOR_PROVENANCE = deepFreeze({
    schemaVersion,
    manifestVersion,
    effectiveDate,
    contentDigest:
      "sha256-7c83fec57004ee488eb752ffd6feb73c1e27f3bf7eb61c8e40bb7e6af3bce1e5",
    clinicalReview: {
      status: "unreviewed",
      reviewer: null,
      reviewedAt: null,
      scope: [],
      statement:
        "Overall ruleset review is separate from the user-confirmed committee approval of existing conversion ratios recorded in conversionRatioApproval.",
    },
    conversionRatioApproval: {
      status: "approved-user-attested",
      attestedAt: "2026-09-13",
      authority: "Clinical oversight committees, as confirmed by the project owner",
      scope: ["Existing opioid conversion ratios", "Existing benzodiazepine equivalences", "Existing methadone conversion ratios"],
      baselineProductionCommit: "6fde4f914cafa7d21cd127c73a95f106c4e88524",
      baselineFixture: "tests/fixtures/approved-clinical-tables.json",
      statement: "Preserve the existing approved ratios. Committee names and original review dates were not supplied; no new committee review or approval of other guidance is implied.",
    },
    inputPolicy: {
      maximum: null,
      maximumRationale:
        "No clinically meaningful maximum has been approved; finite-number and finite-arithmetic guards fail closed.",
      opioidDoseMinimum: 0,
      opioidFrequencyMinimum: 0,
      opioidFrequencyWholeNumber: true,
      patchQuantityStep: 0.5,
      methadoneOmeMinimum: 0,
      methadoneOmeWholeNumber: true,
      safetyReductionStep: 0.1,
      benzodiazepineDoseExclusiveMinimum: 0,
      organComposition: "independent-not-stacked",
    },
    sources,
    inventory,
    rules,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
