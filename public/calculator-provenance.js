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
  const manifestVersion = "2026-08-08.1";
  const effectiveDate = "2026-08-08";
  const retrievedAt = "2026-08-08";

  const sources = {
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
        "Many configured ratios differ from, or are outside the route/scope of, the cited NHS oral-equivalence table. They remain unreviewed local configuration.",
      testIds: ["benzodiazepine-self", "benzodiazepine-pair"],
    });
  });

  inventory.methadoneBands.forEach((id) => {
    const ruleId = `methadone.band.${id}`;
    rules[ruleId] = localRule(ruleId, [`methadoneRatioTable.${id}`], {
      limitations:
        "Configured nonlinear band with no source or named clinical approval record. Integer boundaries are intentionally enforced.",
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
    ["policy.general-safety-reduction", "0-100 whole percent"],
    ["policy.methadone-safety-reduction", "0-90 whole percent"],
    ["policy.benzodiazepine-safety-reduction", "0-50 whole percent"],
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

  root.CALCULATOR_PROVENANCE = deepFreeze({
    schemaVersion,
    manifestVersion,
    effectiveDate,
    contentDigest:
      "sha256-2478a71540608254e1e7f0fd884c9a07404f38d629d51cb453fdc99c65bcc74f",
    clinicalReview: {
      status: "unreviewed",
      reviewer: null,
      reviewedAt: null,
      scope: [],
      statement:
        "Traceability and regression coverage do not constitute clinical approval. No named clinical approval record is present for this ruleset.",
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
      benzodiazepineDoseExclusiveMinimum: 0,
      organComposition: "independent-not-stacked",
    },
    sources,
    inventory,
    rules,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
