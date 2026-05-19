const METHADONE_ORAL_REFERENCE_DOSE = 10;
const METHADONE_ORAL_MORPHINE_FACTOR = 4.7;
const METHADONE_ORAL_REFERENCE_OME =
  METHADONE_ORAL_REFERENCE_DOSE * METHADONE_ORAL_MORPHINE_FACTOR;
const METHADONE_IV_REFERENCE_DOSE = METHADONE_ORAL_REFERENCE_DOSE / 2;
const METHADONE_CONSERVATIVE_ORAL_MORPHINE_FACTOR = 3;

const methadoneRatioTable = [
  { min: 0, max: 30, label: "0-30 mg/day", ratio: 2 },
  { min: 31, max: 99, label: "31-99 mg/day", ratio: 4 },
  { min: 100, max: 299, label: "100-299 mg/day", ratio: 8 },
  { min: 300, max: 499, label: "300-499 mg/day", ratio: 12 },
  { min: 500, max: 999, label: "500-999 mg/day", ratio: 15 },
  { min: 1000, max: Infinity, label: "1000 mg/day or more", ratio: 20 },
];

const benzoConversionOptions = [
  { id: "alprazolam", medication: "Alprazolam", diazepam10Equivalent: 0.5 },
  { id: "chlordiazepoxide", medication: "Chlordiazepoxide", diazepam10Equivalent: 25 },
  { id: "clonazepam", medication: "Clonazepam", diazepam10Equivalent: 0.5 },
  { id: "clorazepate", medication: "Clorazepate", diazepam10Equivalent: 15 },
  { id: "diazepam", medication: "Diazepam", diazepam10Equivalent: 10 },
  { id: "lorazepam", medication: "Lorazepam", diazepam10Equivalent: 1 },
  { id: "oxazepam", medication: "Oxazepam", diazepam10Equivalent: 20 },
  { id: "temazepam", medication: "Temazepam", diazepam10Equivalent: 20 },
  { id: "triazolam", medication: "Triazolam", diazepam10Equivalent: 0.5 },
];

const conversionOptions = [
  {
    id: "Morphine_IV",
    medication: "Morphine",
    route: "IV",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Morphine IV",
    targetable: true,
  },
  {
    id: "Morphine_Oral",
    medication: "Morphine",
    route: "Oral",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Morphine oral",
    targetable: true,
  },
  {
    id: "Morphine_Oral_ER",
    medication: "Morphine",
    route: "Oral ER",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Morphine oral ER",
    targetable: true,
  },
  {
    id: "Codeine_IV",
    medication: "Codeine",
    route: "IV",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 3,
    label: "Codeine IV",
    targetable: true,
  },
  {
    id: "Codeine_Oral",
    medication: "Codeine",
    route: "Oral",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 1.5,
    label: "Codeine oral",
    targetable: true,
  },
  {
    id: "Hydrocodone_Oral",
    medication: "Hydrocodone",
    route: "Oral",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydrocodone oral",
    targetable: true,
  },
  {
    id: "Hydrocodone_Oral_ER",
    medication: "Hydrocodone",
    route: "Oral ER",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydrocodone oral ER",
    targetable: true,
  },
  {
    id: "Oxycodone_Oral",
    medication: "Oxycodone",
    route: "Oral",
    referenceDose: 20,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxycodone oral",
    targetable: true,
  },
  {
    id: "Oxycodone_Oral_ER",
    medication: "Oxycodone",
    route: "Oral ER",
    referenceDose: 20,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxycodone oral ER",
    targetable: true,
  },
  {
    id: "Hydromorphone_IV",
    medication: "Hydromorphone",
    route: "IV",
    referenceDose: 2,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydromorphone IV",
    targetable: true,
  },
  {
    id: "Hydromorphone_Oral",
    medication: "Hydromorphone",
    route: "Oral",
    referenceDose: 5,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydromorphone oral",
    targetable: true,
  },
  {
    id: "Hydromorphone_Oral_ER",
    medication: "Hydromorphone",
    route: "Oral ER",
    referenceDose: 5,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydromorphone oral ER",
    targetable: true,
  },
  {
    id: "Methadone_Oral",
    medication: "Methadone",
    route: "Oral",
    referenceDose: METHADONE_ORAL_REFERENCE_DOSE,
    doseUnit: "mg",
    oralMorphineEquivalent: METHADONE_ORAL_REFERENCE_OME,
    label: "Methadone oral",
    targetable: true,
  },
  {
    id: "Methadone_IV",
    medication: "Methadone",
    route: "IV",
    referenceDose: METHADONE_IV_REFERENCE_DOSE,
    doseUnit: "mg",
    oralMorphineEquivalent: METHADONE_ORAL_REFERENCE_OME,
    label: "Methadone IV",
    targetable: true,
  },
  {
    id: "Meperidine_IV",
    medication: "Meperidine",
    route: "IV",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Meperidine IV",
    targetable: true,
  },
  {
    id: "Meperidine_Oral",
    medication: "Meperidine",
    route: "Oral",
    referenceDose: 300,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Meperidine oral",
    targetable: true,
  },
  {
    id: "Fentanyl_Patch_12",
    medication: "Fentanyl",
    route: "Patch 12 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 30,
    label: "Fentanyl patch 12 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_25",
    medication: "Fentanyl",
    route: "Patch 25 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 60,
    label: "Fentanyl patch 25 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_37",
    medication: "Fentanyl",
    route: "Patch 37 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 90,
    label: "Fentanyl patch 37 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_50",
    medication: "Fentanyl",
    route: "Patch 50 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 120,
    label: "Fentanyl patch 50 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_62",
    medication: "Fentanyl",
    route: "Patch 62 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 150,
    label: "Fentanyl patch 62 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_75",
    medication: "Fentanyl",
    route: "Patch 75 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 180,
    label: "Fentanyl patch 75 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_87",
    medication: "Fentanyl",
    route: "Patch 87 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 210,
    label: "Fentanyl patch 87 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_Patch_100",
    medication: "Fentanyl",
    route: "Patch 100 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 240,
    label: "Fentanyl patch 100 mcg/hr",
    targetable: false,
  },
  {
    id: "Fentanyl_IV",
    medication: "Fentanyl",
    route: "IV",
    referenceDose: 0.15,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Fentanyl IV",
    targetable: true,
  },
  {
    id: "Tramadol_IV",
    medication: "Tramadol",
    route: "IV",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tramadol IV",
    targetable: true,
  },
  {
    id: "Tramadol_Oral",
    medication: "Tramadol",
    route: "Oral",
    referenceDose: 120,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tramadol oral",
    targetable: true,
  },
  {
    id: "Tramadol_Oral_ER",
    medication: "Tramadol",
    route: "Oral ER",
    referenceDose: 120,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tramadol oral ER",
    targetable: true,
  },
  {
    id: "Tapentadol_Oral",
    medication: "Tapentadol",
    route: "Oral",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tapentadol oral",
    targetable: true,
  },
  {
    id: "Tapentadol_Oral_ER",
    medication: "Tapentadol",
    route: "Oral ER",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tapentadol oral ER",
    targetable: true,
  },
  {
    id: "Oxymorphone_IV",
    medication: "Oxymorphone",
    route: "IV",
    referenceDose: 1,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxymorphone IV",
    targetable: true,
  },
  {
    id: "Oxymorphone_Oral",
    medication: "Oxymorphone",
    route: "Oral",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxymorphone oral",
    targetable: true,
  },
  {
    id: "Oxymorphone_Oral_ER",
    medication: "Oxymorphone",
    route: "Oral ER",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxymorphone oral ER",
    targetable: true,
  },
  {
    id: "Buprenorphine_Patch_5",
    medication: "Buprenorphine",
    route: "Patch 5 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 15,
    label: "Buprenorphine patch 5 mcg/hr",
    targetable: false,
  },
  {
    id: "Buprenorphine_Patch_10",
    medication: "Buprenorphine",
    route: "Patch 10 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 30,
    label: "Buprenorphine patch 10 mcg/hr",
    targetable: false,
  },
  {
    id: "Buprenorphine_Patch_20",
    medication: "Buprenorphine",
    route: "Patch 20 mcg/hr",
    referenceDose: 1,
    doseUnit: "patch",
    oralMorphineEquivalent: 48,
    label: "Buprenorphine patch 20 mcg/hr",
    targetable: false,
  },
];

const hepaticGuidanceRows = [
  {
    medication: "Morphine",
    mild: {
      label: "Reduce 0-25%",
      minReduction: 0,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 50%",
      minReduction: 50,
      maxReduction: 50,
    },
    severe: {
      label: "Avoid",
      avoid: true,
    },
  },
  {
    medication: "Hydromorphone",
    mild: {
      label: "Reduce 0-25%",
      minReduction: 0,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 25-50%",
      minReduction: 25,
      maxReduction: 50,
    },
    severe: {
      label: "Reduce 50-75% or avoid if you are not a specialist",
      minReduction: 50,
      maxReduction: 75,
    },
  },
  {
    medication: "Oxycodone",
    mild: {
      label: "Reduce 25%",
      minReduction: 25,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 50%",
      minReduction: 50,
      maxReduction: 50,
    },
    severe: {
      label: "Reduce 50-75% or avoid if you are not a specialist",
      minReduction: 50,
      maxReduction: 75,
    },
  },
  {
    medication: "Tramadol",
    mild: {
      label: "Reduce 25%",
      minReduction: 25,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 50-75%",
      minReduction: 50,
      maxReduction: 75,
    },
    severe: {
      label: "Avoid",
      avoid: true,
    },
  },
  {
    medication: "Fentanyl",
    mild: {
      label: "Reduce 0-25%",
      minReduction: 0,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 25-50%",
      minReduction: 25,
      maxReduction: 50,
    },
    severe: {
      label: "Reduce 50%; may slowly titrate higher",
      minReduction: 50,
      maxReduction: 50,
    },
  },
  {
    medication: "Methadone",
    mild: {
      label: "Minimal change; experts only",
      infoOnly: true,
    },
    moderate: {
      label: "Reduce 25-50%; experts only",
      minReduction: 25,
      maxReduction: 50,
    },
    severe: {
      label: "Reduce 50% with very slow titration upward; experts only",
      minReduction: 50,
      maxReduction: 50,
    },
  },
  {
    medication: "Buprenorphine",
    mild: {
      label: "Reduce 0-25%",
      minReduction: 0,
      maxReduction: 25,
    },
    moderate: {
      label: "Reduce 25-50%",
      minReduction: 25,
      maxReduction: 50,
    },
    severe: {
      label: "Reduce 50% with cautious use; experts only",
      minReduction: 50,
      maxReduction: 50,
    },
  },
];

const sourceReferences = [
  {
    title:
      "CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022",
    url: "https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm",
    note:
      "Background source for hydrocodone, oral codeine, fentanyl transdermal, methadone, morphine, oxycodone, oxymorphone, tapentadol, and tramadol conversion factors.",
  },
  {
    title: "Calculation of Oral Morphine Equivalents (OME) | Pain Management Education at UCSF",
    url: "https://pain.ucsf.edu/opioid-analgesics/calculation-oral-morphine-equivalents-ome",
    note:
      "Background source for IV codeine and additional route-level OME cross-checks. This staging build still preserves selected local conversion relationships where requested.",
  },
  {
    title: "A synthesis of oral morphine equivalents (OME) for opioid utilisation studies",
    url: "https://pubmed.ncbi.nlm.nih.gov/26693665/",
    note:
      "Peer-reviewed OME synthesis referenced by UCSF and used here as background support for the OME framework.",
  },
  {
    title:
      "Approximate equivalent doses of transdermal opioids – West Midlands Palliative Care",
    url:
      "https://www.westmidspallcare.co.uk/wmpcp/guide/pain/transdermal-opioids/approximate-equivalent-doses-of-transdermal-opioids/",
    note:
      "Used for staged fentanyl patch strengths and buprenorphine patch background equivalents.",
  },
  {
    title: "Pain Management in Renal Failure – West Midlands Palliative Care",
    url:
      "https://www.westmidspallcare.co.uk/wmpcp/guide/renal-disease/renal-analgesia/",
    note:
      "Background source for renal cautions and alternative opioid groupings; the eGFR rules in this staging build follow the client-requested configuration.",
  },
  {
    title: "Use of the Child-Pugh Score in Liver Disease – StatPearls",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK542308/",
    note:
      "Background source for liver function markers. This staging build now leaves mild, moderate, or severe hepatic classification to clinical judgment rather than calculating a lab-derived score.",
  },
  {
    title: "Liver failure pain management – West Midlands Palliative Care",
    url:
      "https://www.westmidspallcare.co.uk/wmpcp/guide/liver-failure/liver-failure-pain-management/",
    note:
      "Background source for hepatic caution language; the mild/moderate/severe percentage ranges are the client-requested staging rules.",
  },
  {
    title: "Choosing equivalent doses of oral benzodiazepines – NHS Specialist Pharmacy Service",
    url:
      "https://www.sps.nhs.uk/articles/choosing-equivalent-doses-of-oral-benzodiazepines/",
    note:
      "Reference for approximate oral benzodiazepine diazepam-equivalent values used by the benzodiazepine calculator.",
  },
  {
    title: "Benzodiazepine equivalence table – Ashton Manual",
    url: "https://www.benzo.org.uk/bzequiv.htm",
    note:
      "Supplemental reference for benzodiazepine equivalence values and tapering context. Equivalence remains approximate and patient-specific.",
  },
  {
    title: "Configured local staging rules",
    url: "",
    note:
      "This staging build preserves the local IV morphine baseline and legacy hydromorphone or meperidine values while adding the requested oral methadone 4.7 MME factor, 3.0 conservative oral methadone estimate, hepatic advisory bands, ER opioid variants, and benzodiazepine equivalence calculator.",
  },
  {
    title: "Configured methadone ratio table",
    url: "",
    note:
      "Local staging configuration for specialty morphine:methadone bands: 0-30 mg 2:1, 31-99 mg 4:1, 100-299 mg 8:1, 300-499 mg 12:1, 500-999 mg 15:1, and 1000 mg/day or more 20:1.",
  },
];

const pharmacokineticsRows = [
  {
    name: "Buprenorphine patch",
    route: "Transdermal",
    profile: { type: "patch", peakHours: 72, wearHours: 168, halfLifeHours: 26 },
    timing:
      "Quantifiable concentrations at about 17 hours; steady state by day 3; system is worn for 7 days.",
    halfLife:
      "After removal, concentrations decrease about 50% within 10-24 hours, then decline with an apparent terminal half-life of about 26 hours.",
    metabolism:
      "Primary metabolism is CYP3A4 N-dealkylation to norbuprenorphine. Buprenorphine and norbuprenorphine then undergo glucuronidation, mainly through UGT1A1 and UGT2B7, to support elimination. Elimination is mostly biliary/fecal with a smaller urinary component.",
    mechanism:
      "Partial agonist at the mu-opioid receptor (MOR), antagonist at the kappa-opioid receptor (KOR), and weak or partial activity at DOR and ORL-1/NOP receptors. It has very high receptor affinity with slow dissociation.",
    behavior:
      "Blood levels rise gradually with transdermal delivery. Full therapeutic effect generally takes 2-3 days, patches are changed every 7 days, and the effective half-life after patch removal is relatively long.",
    interactions:
      "Strong CYP3A4 inhibitors such as ketoconazole, clarithromycin, some HIV medications, and grapefruit juice can increase levels. CYP3A4 inducers such as rifampin, carbamazepine, and phenytoin can reduce effectiveness. Liver impairment can significantly increase exposure.",
    sources: [
      {
        title: "DailyMed buprenorphine transdermal system",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c7d079fb-507f-436f-b794-2171b7d97067",
      },
    ],
  },
  {
    name: "Codeine IV",
    route: "Requested IV / injection caution",
    profile: { type: "absorptive", peakHours: 0.5, halfLifeHours: 3, scaleHours: 12 },
    timing:
      "No current IV label basis was identified in this pass. The accessible codeine injection product reference is for intramuscular use only; IM peak is about 30 minutes.",
    halfLife:
      "Injection reference lists about 3 hours after IM dosing; an IV PK study in healthy volunteers reported about 4 hours.",
    metabolism:
      "Glucuronidation to codeine-6-glucuronide, CYP2D6 conversion to morphine, and CYP3A4 conversion to norcodeine; primarily renal excretion.",
    mechanism:
      "Weak MOR activity as parent drug; clinically meaningful analgesia depends substantially on CYP2D6 conversion to morphine.",
    behavior:
      "Treat as a caution row. Do not infer routine IV suitability from the located injection reference; follow institutional policy and pharmacist review.",
    interactions:
      "CYP2D6 inhibitors can reduce conversion to morphine and reduce analgesia, while ultra-rapid metabolizers may have toxicity risk. CNS depressants increase sedation and respiratory risk.",
    sources: [
      {
        title: "MHRA codeine phosphate injection PAR",
        url:
          "https://mhraproducts4853.blob.core.windows.net/docs/0858170bda543fc8bb09f20876ba508aa199d95d",
      },
      {
        title: "PubMed IV codeine PK study",
        url: "https://pubmed.ncbi.nlm.nih.gov/3335120/",
      },
    ],
  },
  {
    name: "Codeine PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1, halfLifeHours: 3, scaleHours: 14 },
    timing:
      "Maximum plasma concentration occurs about 60 minutes after administration; steady state reported within 48 hours with q4h dosing.",
    halfLife: "Codeine and metabolite plasma half-lives are reported at about 3 hours.",
    metabolism:
      "About 70-80% glucuronidation to C6G, 5-10% CYP2D6 conversion to morphine, and about 10% CYP3A4 conversion to norcodeine.",
    mechanism:
      "Weak parent-drug MOR effect; functions clinically as a CYP2D6-dependent prodrug to morphine.",
    behavior:
      "Prodrug behavior creates high CYP2D6 variability; poor metabolizers may have reduced effect and ultra-rapid metabolizers may have toxicity risk.",
    interactions:
      "CYP2D6 inhibitors can reduce effect. Ultra-rapid CYP2D6 metabolism, CYP3A4 interactions, renal impairment, and CNS depressants increase risk.",
    sources: [
      {
        title: "DailyMed codeine sulfate tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f317cd06-2851-4a52-86d3-6efde3a4c243",
      },
    ],
  },
  {
    name: "Fentanyl IV",
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.08, halfLifeHours: 3.65, scaleHours: 12 },
    timing:
      "Onset is almost immediate IV; maximum analgesic effect may take several minutes; single-dose analgesic duration is usually 30-60 minutes.",
    halfLife:
      "Terminal elimination half-life is 219 minutes. Respiratory depressant effect can outlast analgesia.",
    metabolism:
      "The primary enzyme is CYP3A4. Fentanyl is converted mainly to norfentanyl, which is largely inactive. Additional minor inactive metabolites are formed hepatically, and elimination occurs primarily in urine as metabolites with little unchanged drug.",
    mechanism:
      "Full agonist at the mu-opioid receptor (MOR), with minimal clinically significant KOR or DOR activity.",
    behavior:
      "Highly lipophilic with rapid onset and short initial duration. Repeated dosing or continuous infusion can redistribute drug into fat and tissues, prolonging effects, especially in critically ill or obese patients.",
    interactions:
      "Strong CYP3A4 inhibitors such as clarithromycin, ketoconazole, or ritonavir can increase fentanyl levels and respiratory depression risk. CYP3A4 inducers can reduce analgesia. Hepatic impairment and concurrent CNS depressants increase sedation and respiratory risk.",
    sources: [
      {
        title: "DailyMed fentanyl citrate injection",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1ed25b2c-334e-4021-ada1-3396f07630dc",
      },
    ],
  },
  {
    name: "Fentanyl patch",
    route: "Transdermal",
    profile: { type: "patch", peakHours: 32, wearHours: 72, halfLifeHours: 24 },
    timing:
      "Time to maximal concentration after first 72-hour application is about 29-36 hours depending on patch strength.",
    halfLife:
      "After removal, serum concentration falls about 50% in approximately 20-27 hours because fentanyl continues absorbing from skin.",
    metabolism:
      "The primary enzyme is CYP3A4. Fentanyl is converted mainly to norfentanyl, which is largely inactive, with urinary elimination primarily as metabolites and only small unchanged-drug excretion.",
    mechanism:
      "Full agonist at the mu-opioid receptor (MOR), with minimal clinically significant KOR or DOR activity.",
    behavior:
      "Slow transdermal delivery produces a gradual serum rise, large skin depot effect, and continued absorption for many hours after patch removal.",
    interactions:
      "Strong CYP3A4 inhibitors can significantly increase fentanyl exposure and respiratory depression risk. CYP3A4 inducers can reduce analgesia. Hepatic impairment, heat exposure, and concurrent CNS depressants materially increase risk.",
    sources: [
      {
        title: "DailyMed fentanyl transdermal system",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=242759ef-cb6d-4e3e-9f8d-5e31efa1f289",
      },
    ],
  },
  {
    name: "Hydrocodone PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.3, halfLifeHours: 3.8, scaleHours: 16 },
    timing: "After a 10 mg oral dose, maximum serum levels occur at 1.3 +/- 0.3 hours.",
    halfLife: "Plasma half-life is 3.8 +/- 0.3 hours in the referenced label.",
    metabolism:
      "Primary enzymes are CYP3A4 and CYP2D6. CYP3A4 converts hydrocodone to less-active norhydrocodone, while CYP2D6 converts a portion to the more potent active metabolite hydromorphone. Additional glucuronidation occurs, with renal elimination of metabolites and some unchanged drug.",
    mechanism:
      "Primarily a full agonist at the mu-opioid receptor (MOR), with limited clinically relevant KOR or DOR activity.",
    behavior:
      "Oral hydrocodone undergoes first-pass hepatic metabolism. Immediate-release oral products are commonly combined with acetaminophen, so total daily acetaminophen exposure matters.",
    interactions:
      "CYP3A4 inhibitors can increase levels and respiratory depression risk, while CYP3A4 inducers can reduce effect. CYP2D6 inhibitors such as fluoxetine, paroxetine, or bupropion may reduce hydromorphone formation. Hepatic impairment and CNS depressants increase risk.",
    sources: [
      {
        title: "DailyMed hydrocodone/APAP tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=0cc8836b-f0af-42e0-bd77-53fd1dd1aca7&version=11",
      },
    ],
  },
  {
    name: "Hydrocodone PO ER",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 8, halfLifeHours: 12, scaleHours: 30 },
    timing:
      "Extended-release hydrocodone is designed for slow continuous absorption with delayed peak levels, typically over several hours depending on formulation.",
    halfLife:
      "Effective duration is prolonged compared with immediate-release hydrocodone, supporting chronic scheduled dosing rather than breakthrough use.",
    metabolism:
      "Primary pathways remain CYP3A4 to norhydrocodone and CYP2D6 to hydromorphone, with renal elimination of metabolites.",
    mechanism:
      "Primarily a full mu-opioid receptor agonist.",
    behavior:
      "Provides steadier baseline exposure and reduced peak-trough fluctuation compared with immediate-release products. ER products are not appropriate for acute or breakthrough pain.",
    interactions:
      "Same high-risk interaction pattern as hydrocodone IR: CYP3A4 inhibitors or inducers, CYP2D6 inhibitors, hepatic impairment, and concurrent CNS depressants require caution.",
    sources: [
      {
        title: "DailyMed hydrocodone extended-release search",
        url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=hydrocodone%20extended%20release",
      },
    ],
  },
  {
    name: "Hydromorphone IV",
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.08, halfLifeHours: 2.3, scaleHours: 10 },
    timing:
      "Direct systemic delivery with rapid opioid effect; IV PK is described with large volume of distribution.",
    halfLife: "Terminal elimination half-life after an IV dose is about 2.3 hours.",
    metabolism:
      "Primary metabolism is hepatic glucuronidation, mainly via UGT2B7, to hydromorphone-3-glucuronide (H3G). H3G is not analgesic and may accumulate in renal impairment with neuroexcitatory effects. CYP450 metabolism is minimal.",
    mechanism:
      "Full mu-opioid receptor agonist with minimal significant KOR or DOR activity.",
    behavior:
      "IV hydromorphone is rapidly delivered with quick CNS effect. Repeated dosing or infusions can lead to metabolite accumulation, especially with renal or hepatic dysfunction.",
    interactions:
      "CYP-mediated interactions are limited. Renal impairment can substantially increase H3G accumulation and adverse effects. Hepatic impairment may reduce clearance. CNS depressants increase respiratory depression risk.",
    sources: [
      {
        title: "DailyMed hydromorphone injection",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c729424e-e483-4bf8-b86c-ce56636dcffa",
      },
    ],
  },
  {
    name: "Hydromorphone PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 0.75, halfLifeHours: 2.7, scaleHours: 12 },
    timing:
      "Rapid oral absorption; peak plasma concentrations generally occur within 0.5-1 hour. Oral bioavailability is about 24%.",
    halfLife:
      "Immediate-release tablet and liquid half-life is about 2.6-2.8 hours in the referenced label.",
    metabolism:
      "Primary metabolism is hepatic glucuronidation, mainly via UGT2B7, to hydromorphone-3-glucuronide (H3G). H3G is not analgesic and can accumulate in renal impairment with agitation, myoclonus, or confusion.",
    mechanism:
      "Full mu-opioid receptor agonist with minimal significant KOR or DOR activity.",
    behavior:
      "Oral hydromorphone undergoes substantial first-pass metabolism and has rapid immediate-release onset with relatively short duration.",
    interactions:
      "CYP-mediated drug interactions are limited. Renal impairment can substantially increase H3G accumulation and adverse effects. Hepatic impairment may reduce clearance. CNS depressants increase overdose risk.",
    sources: [
      {
        title: "DailyMed hydromorphone tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2427814c-f32b-8ac5-99b8-5e886fd2d001",
      },
    ],
  },
  {
    name: "Hydromorphone PO ER",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 12, halfLifeHours: 15, scaleHours: 48 },
    timing:
      "Extended-release hydromorphone provides slow continuous absorption with delayed peak levels that vary by formulation.",
    halfLife:
      "Apparent half-life is prolonged compared with immediate-release hydromorphone because absorption continues over many hours.",
    metabolism:
      "Metabolism remains primarily UGT2B7 glucuronidation to H3G, with renal excretion of metabolites.",
    mechanism:
      "Full mu-opioid receptor agonist.",
    behavior:
      "Designed for continuous opioid-tolerant chronic pain treatment. Crushing or chewing ER products can cause dangerous dose dumping.",
    interactions:
      "Renal impairment, hepatic impairment, alcohol exposure for some ER formulations, and concurrent CNS depressants increase risk.",
    sources: [
      {
        title: "DailyMed hydromorphone extended-release search",
        url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=hydromorphone%20extended%20release",
      },
    ],
  },
  {
    name: "Morphine IV",
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.08, halfLifeHours: 2, scaleHours: 10 },
    timing:
      "Direct systemic route; apparent volume of distribution after IV dosing ranges from 1.0-4.7 L/kg.",
    halfLife:
      "Terminal half-life commonly ranges 1.5-4.5 hours; accepted elimination half-life in normal subjects is 1.5-2 hours.",
    metabolism:
      "Morphine is primarily metabolized in the liver by phase II glucuronidation, mainly UGT2B7 and to a lesser extent UGT1A1. It forms active morphine-6-glucuronide (M6G) and non-analgesic morphine-3-glucuronide (M3G), with primarily renal elimination.",
    mechanism:
      "Full agonist at the mu-opioid receptor (MOR), with KOR activity contributing to spinal analgesia and dysphoria and weak DOR activity.",
    behavior:
      "IV administration produces high initial plasma concentrations followed by redistribution into tissues. Renal dysfunction can lead to M6G and M3G accumulation with prolonged sedation, respiratory depression, or neuroexcitation.",
    interactions:
      "Additive CNS and respiratory depression occurs with benzodiazepines, alcohol, sedative-hypnotics, and other opioids. MAO inhibitors can cause unpredictable severe reactions. Anticholinergics increase constipation and urinary retention risk.",
    sources: [
      {
        title: "DailyMed morphine sulfate injection",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=1f53de80-efc8-4930-b3e3-fba0d026af05&version=7",
      },
    ],
  },
  {
    name: "Morphine IR PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1, halfLifeHours: 2, scaleHours: 10 },
    timing:
      "About two-thirds absorbed from the GI tract; maximum analgesic effect occurs about 60 minutes after administration.",
    halfLife:
      "Effective terminal half-life after IV administration is about 2 hours; some longer-sampling studies report longer terminal values.",
    metabolism:
      "Morphine is primarily metabolized by hepatic glucuronidation through UGT2B7 and UGT1A1 to M6G and M3G. Elimination is primarily renal, so renal impairment increases metabolite accumulation risk.",
    mechanism:
      "Full MOR agonist with KOR activity and weak DOR activity.",
    behavior:
      "Immediate-release oral morphine has onset around 20-60 minutes, peak effect around 60-90 minutes, and short duration of about 3-4 hours. Food may slightly delay absorption without meaningfully changing exposure.",
    interactions:
      "Additive respiratory depression with benzodiazepines, alcohol, sedative-hypnotics, and other opioids. MAO inhibitors, anticholinergics, mixed agonist/antagonist opioids, and renal dysfunction require caution.",
    sources: [
      {
        title: "DailyMed morphine sulfate tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=67b3273e-af71-4dac-8e49-8bc134d4c591",
      },
    ],
  },
  {
    name: "Morphine ER PO",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 4, halfLifeHours: 8, scaleHours: 24 },
    timing:
      "Extended-release oral morphine is designed for slow continuous release over an extended period with delayed peak effect.",
    halfLife:
      "Clinical duration is typically 8-12 hours or longer, though some patients may require three-times-daily dosing if effect lasts closer to 8 hours.",
    metabolism:
      "Metabolism remains primarily phase II glucuronidation to active M6G and non-analgesic M3G, with renal elimination.",
    mechanism:
      "Full MOR agonist with KOR activity and weak DOR activity.",
    behavior:
      "Produces more stable plasma concentrations and less peak-trough fluctuation than IR morphine. It takes time to reach steady state and is not appropriate for acute or breakthrough pain.",
    interactions:
      "Renal dysfunction remains a major risk because M6G and M3G accumulate. MAO inhibitors, anticholinergics, mixed agonist/antagonist opioids, and CNS depressants require caution.",
    sources: [
      {
        title: "DailyMed morphine sulfate extended-release search",
        url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=morphine%20sulfate%20extended%20release",
      },
    ],
  },
  {
    name: "Oxycodone IR PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.5, halfLifeHours: 3.7, scaleHours: 16 },
    timing:
      "Immediate-release products commonly reach Tmax around 1.4-1.9 hours; steady-state occurs in about 18-24 hours.",
    halfLife: "Apparent elimination half-life is about 3.5-4 hours.",
    metabolism:
      "Oxycodone is primarily metabolized by CYP3A4 to noroxycodone and by CYP2D6 to oxymorphone. The parent drug contributes most clinical effect, with renal elimination of metabolites and some unchanged drug.",
    mechanism:
      "Primarily a full agonist at the mu-opioid receptor (MOR), with weak KOR activity and minimal clinically relevant DOR activity.",
    behavior:
      "Immediate-release oral oxycodone has onset around 10-30 minutes, peak effect around 1-2 hours, and duration around 3-6 hours. It produces a faster rise than ER formulations.",
    interactions:
      "CYP3A4 inhibitors can substantially increase levels and respiratory depression risk; CYP3A4 inducers can reduce analgesia. CYP2D6 inhibitors may reduce oxymorphone formation. Hepatic impairment and CNS depressants increase risk.",
    sources: [
      {
        title: "DailyMed oxycodone hydrochloride tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=92614a3a-331d-16ad-e053-2a95a90a47cc",
      },
    ],
  },
  {
    name: "Oxycodone ER PO",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 5, halfLifeHours: 8, scaleHours: 24 },
    timing:
      "Extended-release oral oxycodone has delayed peak effect, often around 4-6 hours depending on product.",
    halfLife:
      "Effective duration is typically about 10-12 hours, with repeated dosing needed to reach steady state.",
    metabolism:
      "Metabolism remains CYP3A4 to noroxycodone and CYP2D6 to oxymorphone, with the parent drug providing most effect.",
    mechanism:
      "Primarily a full MOR agonist.",
    behavior:
      "Provides a flatter peak-trough profile and baseline analgesia. It is not appropriate for breakthrough pain because onset is delayed.",
    interactions:
      "CYP3A4 inhibitors or inducers, CYP2D6 inhibitors, hepatic impairment, alcohol, and CNS depressants can materially change risk.",
    sources: [
      {
        title: "DailyMed OxyContin extended-release tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=bfdfe235-d717-4855-a3c8-a13d26dadede",
      },
    ],
  },
  {
    name: "Tapentadol IR PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.25, halfLifeHours: 4, scaleHours: 16 },
    timing:
      "Maximum serum concentrations are typically observed around 1.25 hours after dosing.",
    halfLife: "Terminal half-life averages about 4 hours after oral administration.",
    metabolism:
      "Tapentadol undergoes mostly phase II glucuronidation, mainly UGT1A9 and UGT2B7, with minimal CYP involvement. It has no clinically significant active analgesic metabolites and is primarily renally eliminated as inactive conjugates.",
    mechanism:
      "Dual mechanism: mu-opioid receptor agonism plus norepinephrine reuptake inhibition.",
    behavior:
      "Oral tapentadol has relatively rapid onset around 30-60 minutes, peak around 1.5-3 hours, and IR duration around 4-6 hours.",
    interactions:
      "CNS depressants increase sedation and respiratory risk. MAO inhibitors and other norepinephrine-enhancing drugs require caution. CYP-mediated interactions are fewer than with oxycodone or tramadol, but renal and hepatic impairment still matter.",
    sources: [
      {
        title: "DailyMed Nucynta tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7997e6da-7e98-4520-9d1b-0b8341bac64a",
      },
    ],
  },
  {
    name: "Tapentadol ER PO",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 5, halfLifeHours: 8, scaleHours: 24 },
    timing:
      "Extended-release tapentadol produces slower absorption with peak effect generally later than IR products.",
    halfLife:
      "ER dosing is generally designed for about 12-hour coverage depending on formulation and patient context.",
    metabolism:
      "Metabolism remains primarily UGT-mediated glucuronidation with minimal CYP involvement and inactive metabolites.",
    mechanism:
      "Dual mechanism: MOR agonism and norepinephrine reuptake inhibition.",
    behavior:
      "Produces smoother baseline analgesia than IR tapentadol and is used for scheduled chronic pain rather than breakthrough pain.",
    interactions:
      "CNS depressants, MAO inhibitors, norepinephrine-enhancing drugs, renal impairment, and hepatic impairment require caution.",
    sources: [
      {
        title: "DailyMed tapentadol extended-release search",
        url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tapentadol%20extended%20release",
      },
    ],
  },
  {
    name: "Tramadol IV",
    route: "IV / injection",
    profile: { type: "absorptive", peakHours: 0.75, halfLifeHours: 6, scaleHours: 24 },
    timing:
      "Injection product may be given slow IV, IM, SC, or infusion; the referenced SmPC reports rapid and complete IM absorption with Cmax at about 45 minutes.",
    halfLife:
      "Elimination half-life is about 6 hours regardless of route; active O-desmethyltramadol half-life is about 7.9 hours.",
    metabolism:
      "CYP2D6 and CYP3A4 metabolism plus conjugation; active O-desmethyltramadol formation is CYP2D6 dependent; renal excretion predominates.",
    behavior:
      "Serotonin/norepinephrine effects and seizure risk matter. Renal or hepatic dysfunction can prolong parent drug and active metabolite.",
    sources: [
      {
        title: "eMC tramadol injection SmPC",
        url: "https://www.medicines.org.uk/emc/product/13177/smpc",
      },
    ],
  },
  {
    name: "Tramadol IR PO",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 2, halfLifeHours: 6.3, scaleHours: 24 },
    timing:
      "Mean oral bioavailability is about 75%; peak tramadol and M1 concentrations occur at about 2 and 3 hours.",
    halfLife:
      "Mean terminal half-lives are 6.3 +/- 1.4 hours for racemic tramadol and 7.4 +/- 1.4 hours for M1.",
    metabolism:
      "Tramadol is metabolized through CYP2D6 to active O-desmethyltramadol (M1), through CYP3A4 and CYP2B6 to weaker N-desmethyltramadol (M2), and through phase II conjugation. Renal elimination predominates.",
    mechanism:
      "Weak MOR activity from parent drug, stronger MOR activity from M1, and serotonin/norepinephrine reuptake inhibition.",
    behavior:
      "Oral tramadol effect varies substantially with CYP2D6 status. It combines opioid and monoaminergic analgesic mechanisms and has seizure and serotonin-syndrome considerations.",
    interactions:
      "SSRIs, SNRIs, MAOIs, TCAs, linezolid, and triptans increase serotonin-syndrome risk. CYP2D6 inhibitors reduce M1 formation. CYP3A4 modulators, seizure-threshold-lowering drugs, alcohol, benzodiazepines, and other CNS depressants require caution.",
    sources: [
      {
        title: "DailyMed tramadol hydrochloride tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=58b802cb-2443-4f5b-9718-7d54c6d50cb4",
      },
    ],
  },
  {
    name: "Tramadol ER PO",
    route: "Oral ER",
    profile: { type: "absorptive", peakHours: 6, halfLifeHours: 12, scaleHours: 36 },
    timing:
      "Extended-release tramadol has slower absorption and delayed peak concentration compared with IR tramadol.",
    halfLife:
      "Effective coverage is prolonged for scheduled dosing, while active M1 metabolite exposure still depends on CYP2D6.",
    metabolism:
      "Metabolism remains CYP2D6-dependent for M1 formation, with CYP3A4/CYP2B6 and conjugation pathways also involved.",
    mechanism:
      "Weak MOR activity from parent drug, stronger MOR activity from M1, and serotonin/norepinephrine reuptake inhibition.",
    behavior:
      "Provides steadier exposure for chronic scheduled dosing but retains CYP2D6 variability, serotonergic risk, and seizure risk.",
    interactions:
      "Same interaction concerns as IR tramadol, with additional caution not to crush or chew ER formulations.",
    sources: [
      {
        title: "DailyMed tramadol extended-release search",
        url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tramadol%20extended%20release",
      },
    ],
  },
];

const buprenorphineSchedules = [
  {
    id: "30_59",
    label: "30-59 mg MEDD",
    title: "30-59 mg MEDD",
    product: "Belbuca (buprenorphine buccal film)",
    fullAgonistSummary:
      "Continue full agonist opioids during days 1-4 while Belbuca is increased.",
    stopSummary: "Stop full agonist opioids on day 5+.",
    days: [
      { day: "1", fullAgonist: "Continue", buprenorphine: "150 mcg BID (300 mcg TDD)" },
      { day: "2", fullAgonist: "Continue", buprenorphine: "300 mcg BID (600 mcg TDD)" },
      { day: "3", fullAgonist: "Continue", buprenorphine: "450 mcg BID (900 mcg TDD)" },
      { day: "4", fullAgonist: "Continue", buprenorphine: "450 mcg BID (900 mcg TDD)" },
      { day: "5+", fullAgonist: "STOP", buprenorphine: "450 mcg BID (900 mcg TDD)" },
    ],
  },
  {
    id: "60_89",
    label: "60-89 mg MEDD",
    title: "60-89 mg MEDD",
    product: "Belbuca (buprenorphine buccal film)",
    fullAgonistSummary:
      "Continue full agonist opioids during days 1-4 while Belbuca is increased.",
    stopSummary: "Stop full agonist opioids on day 5+.",
    days: [
      { day: "1", fullAgonist: "Continue", buprenorphine: "150 mcg BID (300 mcg TDD)" },
      { day: "2", fullAgonist: "Continue", buprenorphine: "300 mcg BID (600 mcg TDD)" },
      { day: "3", fullAgonist: "Continue", buprenorphine: "450 mcg BID (900 mcg TDD)" },
      { day: "4", fullAgonist: "Continue", buprenorphine: "600 mcg BID (1200 mcg TDD)" },
      { day: "5+", fullAgonist: "STOP", buprenorphine: "600 mcg BID (1200 mcg TDD)" },
    ],
  },
  {
    id: "90_120",
    label: "90-120 mg MEDD",
    title: "90-120 mg MEDD",
    product: "Belbuca (buprenorphine buccal film)",
    fullAgonistSummary:
      "Continue full agonist opioids during days 1-4 while Belbuca is increased.",
    stopSummary: "Stop full agonist opioids on day 5+.",
    days: [
      { day: "1", fullAgonist: "Continue", buprenorphine: "300 mcg BID (600 mcg TDD)" },
      {
        day: "2",
        fullAgonist: "Continue",
        buprenorphine: "300 mcg QAM + 600 mcg QPM (900 mcg TDD)",
      },
      { day: "3", fullAgonist: "Continue", buprenorphine: "600 mcg BID (1200 mcg TDD)" },
      {
        day: "4",
        fullAgonist: "Continue",
        buprenorphine: "600 mcg QAM + 900 mcg QPM (1500 mcg TDD)",
      },
      {
        day: "5+",
        fullAgonist: "STOP",
        buprenorphine: "600 mcg QAM + 900 mcg QPM (1500 mcg TDD)",
      },
    ],
  },
  {
    id: "121_160",
    label: "121-160 mg MEDD",
    title: "121-160 mg MEDD",
    product: "Belbuca (buprenorphine buccal film)",
    fullAgonistSummary:
      "Continue full agonist opioids during days 1-4 while Belbuca is increased.",
    stopSummary: "Stop full agonist opioids on day 5+.",
    days: [
      { day: "1", fullAgonist: "Continue", buprenorphine: "300 mcg BID (600 mcg TDD)" },
      {
        day: "2",
        fullAgonist: "Continue",
        buprenorphine: "300 mcg QAM + 600 mcg QPM (900 mcg TDD)",
      },
      { day: "3", fullAgonist: "Continue", buprenorphine: "600 mcg BID (1200 mcg TDD)" },
      {
        day: "4",
        fullAgonist: "Continue",
        buprenorphine: "600 mcg QAM + 900 mcg QPM (1500 mcg TDD)",
      },
      { day: "5+", fullAgonist: "STOP", buprenorphine: "900 mcg BID (1800 mcg TDD)" },
    ],
  },
  {
    id: "161_300",
    label: "161-300 mg MEDD",
    title: "161-300 mg MEDD",
    product: "Suboxone (buprenorphine/naloxone 2 mg/0.5 mg film)",
    fullAgonistSummary:
      "Continue the full agonist full dose on days 1-3, reduce to 2/3 dose on day 4, then none or minimal usage with slow titration on day 5.",
    stopSummary: "Day 5: none or minimal usage with slow titration.",
    days: [
      { day: "1", fullAgonist: "Full dose", buprenorphine: "0.5 mg twice a day (1/4 film)" },
      { day: "2", fullAgonist: "Full dose", buprenorphine: "1 mg twice a day (1/2 film)" },
      { day: "3", fullAgonist: "Full dose", buprenorphine: "1 mg three times a day (1/2 film)" },
      { day: "4", fullAgonist: "2/3 dose", buprenorphine: "1 film (2 mg) three times a day" },
      {
        day: "5",
        fullAgonist: "None OR minimal usage with slow titration",
        buprenorphine: "1 film (2 mg) three times per day",
      },
    ],
  },
];

const hepaticGuidanceByMedication = Object.fromEntries(
  hepaticGuidanceRows.map((item) => [item.medication, item]),
);

const hepaticSeverityLabels = {
  none: "No class selected",
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

const renalRestrictedMedications = new Set(["Morphine", "Codeine", "Meperidine"]);
const renalModerateAlternativeMedications = new Set([
  "Oxycodone",
  "Hydromorphone",
]);
const renalMinimalAlternativeMedications = new Set([
  "Methadone",
  "Fentanyl",
  "Buprenorphine",
]);

let regimenEntryId = 0;
let regimenEntriesState = [];
let selectedPharmacokineticsIndex = 0;

const calculatorTabButtons = document.querySelectorAll("[data-calculator-tab]");
const calculatorTabs = Array.from(calculatorTabButtons);
const themeToggle = document.querySelector("#themeToggle");
const themeToggleLabel = document.querySelector("#themeToggleLabel");
const termsModal = document.querySelector("#termsModal");
const termsModalEyebrow = document.querySelector("#termsModalEyebrow");
const termsAcceptanceForm = document.querySelector("#termsAcceptanceForm");
const termsAcceptInput = document.querySelector("#termsAcceptInput");
const termsAcceptButton = document.querySelector("#termsAcceptButton");
const termsCloseButton = document.querySelector("#termsCloseButton");
const termsReviewButton = document.querySelector("#termsReviewButton");
const pharmacokineticsOpenButton = document.querySelector("#pharmacokineticsOpenButton");
const pharmacokineticsModal = document.querySelector("#pharmacokineticsModal");
const pharmacokineticsCloseButton = document.querySelector(
  "#pharmacokineticsCloseButton",
);
const mainCalculatorSection = document.querySelector("#mainCalculatorSection");
const specialtyCalculatorSection = document.querySelector("#specialtyCalculatorSection");
const mainCalculatorHeading = document.querySelector("#mainCalculatorHeading");
const regimenBuilderHeading = document.querySelector("#regimenBuilderHeading");
const organContext = document.querySelector(".organ-context");
const form = document.querySelector("#calculatorForm");
const calculationModeSelect = document.querySelector("#calculationMode");
const targetDrugSelect = document.querySelector("#targetDrug");
const targetField = document.querySelector("#targetField");
const regimenEntriesContainer = document.querySelector("#regimenEntries");
const addRegimenEntryButton = document.querySelector("#addRegimenEntryButton");
const reductionField = document.querySelector("#reductionField");
const reductionRange = document.querySelector("#reductionRange");
const reductionNumber = document.querySelector("#reductionNumber");
const egfrInput = document.querySelector("#egfrInput");
const painControlSelect = document.querySelector("#painControl");
const renalBandNote = document.querySelector("#renalBandNote");
const hepaticSeveritySelect = document.querySelector("#hepaticSeverity");
const exampleButton = document.querySelector("#exampleButton");
const mmeExampleButton = document.querySelector("#mmeExampleButton");
const referenceTable = document.querySelector("#referenceTable");
const hepaticGuidanceTableBody = document.querySelector("#hepaticGuidanceTable");
const sourceTable = document.querySelector("#sourceTable");
const pharmacokineticsTable = document.querySelector("#pharmacokineticsTable");
const pharmacokineticsGraphGrid = document.querySelector("#pharmacokineticsGraphGrid");
const pharmacokineticsSelectedDetail = document.querySelector(
  "#pharmacokineticsSelectedDetail",
);
const regimenSummaryTable = document.querySelector("#regimenSummaryTable");

const resultTitle = document.querySelector("#resultTitle");
const finalDose = document.querySelector("#finalDose");
const finalUnit = document.querySelector("#finalUnit");
const methadoneConservativeMme = document.querySelector("#methadoneConservativeMme");
const methadoneConservativeMmeDose = document.querySelector(
  "#methadoneConservativeMmeDose",
);
const targetStepLabel = document.querySelector("#targetStepLabel");
const rawTargetDoseOutput = document.querySelector("#rawTargetDose");
const reductionStep = document.querySelector("#reductionStep");
const reductionAppliedOutput = document.querySelector("#reductionApplied");
const renalAdjustmentStep = document.querySelector("#renalAdjustmentStep");
const renalAdjustedDoseOutput = document.querySelector("#renalAdjustedDose");
const hepaticAdjustmentStep = document.querySelector("#hepaticAdjustmentStep");
const hepaticAdjustedDoseOutput = document.querySelector("#hepaticAdjustedDose");
const organGuidanceSummaryOutput = document.querySelector("#organGuidanceSummary");
const renalAdviceTitle = document.querySelector("#renalAdviceTitle");
const renalAdviceBody = document.querySelector("#renalAdviceBody");
const renalAdviceCard = document.querySelector("#renalAdviceCard");
const hepaticAdviceTitle = document.querySelector("#hepaticAdviceTitle");
const hepaticAdviceBody = document.querySelector("#hepaticAdviceBody");
const hepaticAdviceCard = document.querySelector("#hepaticAdviceCard");
const organGuidanceStep = document.querySelector("#organGuidanceStep");
const organAdviceGrid = document.querySelector("[data-organ-advice]");
const conversionOutputDetails = document.querySelectorAll("[data-conversion-output]");

const specialtyPanels = document.querySelectorAll("[data-specialty-panel]");
const methadoneForm = document.querySelector("#methadoneForm");
const methadoneMorphineDoseInput = document.querySelector("#methadoneMorphineDose");
const methadoneRouteSelect = document.querySelector("#methadoneRoute");
const methadoneReductionRange = document.querySelector("#methadoneReductionRange");
const methadoneReductionNumber = document.querySelector("#methadoneReductionNumber");
const methadoneFinalDose = document.querySelector("#methadoneFinalDose");
const methadoneFinalUnit = document.querySelector("#methadoneFinalUnit");
const methadoneRatioOutput = document.querySelector("#methadoneRatio");
const methadoneRawDoseOutput = document.querySelector("#methadoneRawDose");
const methadoneRouteAdjustmentOutput = document.querySelector(
  "#methadoneRouteAdjustment",
);
const methadoneReductionAppliedOutput = document.querySelector(
  "#methadoneReductionApplied",
);
const methadoneQ8DoseOutput = document.querySelector("#methadoneQ8Dose");
const methadoneQ12DoseOutput = document.querySelector("#methadoneQ12Dose");

const buprenorphineForm = document.querySelector("#buprenorphineForm");
const buprenorphineMeddRangeSelect = document.querySelector(
  "#buprenorphineMeddRange",
);
const buprenorphineResultTitle = document.querySelector("#buprenorphineResultTitle");
const buprenorphineProduct = document.querySelector("#buprenorphineProduct");
const buprenorphineContinueSummary = document.querySelector(
  "#buprenorphineContinueSummary",
);
const buprenorphineStopSummary = document.querySelector("#buprenorphineStopSummary");
const buprenorphineEndpoint = document.querySelector("#buprenorphineEndpoint");
const buprenorphineScheduleTableBody = document.querySelector(
  "#buprenorphineScheduleTable",
);
const benzoForm = document.querySelector("#benzoForm");
const benzoSourceDrugSelect = document.querySelector("#benzoSourceDrug");
const benzoSourceDoseInput = document.querySelector("#benzoSourceDose");
const benzoTargetDrugSelect = document.querySelector("#benzoTargetDrug");
const benzoReductionRange = document.querySelector("#benzoReductionRange");
const benzoReductionNumber = document.querySelector("#benzoReductionNumber");
const benzoFinalDose = document.querySelector("#benzoFinalDose");
const benzoFinalUnit = document.querySelector("#benzoFinalUnit");
const benzoRawDiazepamEquiv = document.querySelector("#benzoRawDiazepamEquiv");
const benzoReducedDiazepamEquiv = document.querySelector(
  "#benzoReducedDiazepamEquiv",
);
const benzoReductionApplied = document.querySelector("#benzoReductionApplied");

const THEME_STORAGE_KEY = "opioid-conversion-theme";
const TERMS_ACCEPTANCE_STORAGE_KEY = "calc-med-terms-accepted-v1";

const setTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalizedTheme;

  if (themeToggle) {
    const darkModeActive = normalizedTheme === "dark";
    themeToggle.setAttribute("aria-pressed", String(darkModeActive));
    if (themeToggleLabel) {
      themeToggleLabel.textContent = darkModeActive ? "Theme: Dark" : "Theme: Light";
    }
  }
};

const persistTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Dark mode still works for the current page if storage is unavailable.
  }

  setTheme(theme);
};

const getStoredTermsAcceptance = () => {
  try {
    return localStorage.getItem(TERMS_ACCEPTANCE_STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
};

const storeTermsAcceptance = () => {
  try {
    localStorage.setItem(TERMS_ACCEPTANCE_STORAGE_KEY, "accepted");
  } catch {
    // The acknowledgement still dismisses the modal for the current session.
  }
};

const isModalVisible = (modalElement) =>
  Boolean(modalElement && !modalElement.classList.contains("is-hidden"));

const updateModalOpenState = () => {
  document.body.classList.toggle(
    "modal-open",
    isModalVisible(termsModal) || isModalVisible(pharmacokineticsModal),
  );
};

const setTermsModalVisible = (visible, options = {}) => {
  if (!termsModal) {
    return;
  }

  const reviewMode = Boolean(options.reviewMode);
  termsModal.classList.toggle("is-hidden", !visible);
  updateModalOpenState();

  if (termsModalEyebrow) {
    termsModalEyebrow.textContent = reviewMode
      ? "Terms review"
      : "Required acknowledgement";
  }

  if (termsCloseButton) {
    termsCloseButton.classList.toggle("is-hidden", !visible || !reviewMode);
  }

  if (termsAcceptanceForm) {
    termsAcceptanceForm.classList.toggle("is-review-mode", visible && reviewMode);
  }

  if (visible && termsAcceptInput && termsAcceptButton) {
    termsAcceptInput.value = "";
    termsAcceptButton.disabled = true;
    window.setTimeout(() => termsAcceptInput.focus(), 0);
  }
};

const setPharmacokineticsModalVisible = (visible) => {
  if (!pharmacokineticsModal) {
    return;
  }

  pharmacokineticsModal.classList.toggle("is-hidden", !visible);
  pharmacokineticsOpenButton?.setAttribute("aria-expanded", String(visible));
  updateModalOpenState();

  if (visible && pharmacokineticsCloseButton) {
    window.setTimeout(() => pharmacokineticsCloseButton.focus(), 0);
  }
};

const updateTermsAcceptanceState = () => {
  if (!termsAcceptInput || !termsAcceptButton) {
    return;
  }

  termsAcceptButton.disabled = termsAcceptInput.value.trim() !== "ACCEPT";
};

const getCalculatorTabButton = (mode) =>
  calculatorTabs.find((button) => button.dataset.calculatorTab === mode);

const setHiddenState = (element, shouldHide) => {
  if (!element) {
    return;
  }

  element.classList.toggle("is-hidden", shouldHide);
  element.hidden = shouldHide;
};

const formatDose = (value) => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value >= 100) {
    return value.toFixed(0);
  }

  if (value >= 10) {
    return value.toFixed(1).replace(/\.0$/, "");
  }

  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
};

const formatDoseWithUnit = (value, unitLabel) => `${formatDose(value)} ${unitLabel}`;

const formatDoseRange = (minimum, maximum, unitLabel) => {
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
    return `0 ${unitLabel}`;
  }

  if (Math.abs(minimum - maximum) < 0.0001) {
    return formatDoseWithUnit(minimum, unitLabel);
  }

  return `${formatDose(minimum)}-${formatDose(maximum)} ${unitLabel}`;
};

const formatList = (items) => {
  const uniqueItems = [...new Set(items.filter(Boolean))];

  if (!uniqueItems.length) {
    return "";
  }

  if (uniqueItems.length === 1) {
    return uniqueItems[0];
  }

  if (uniqueItems.length === 2) {
    return `${uniqueItems[0]} and ${uniqueItems[1]}`;
  }

  return `${uniqueItems.slice(0, -1).join(", ")}, and ${uniqueItems.at(-1)}`;
};

const findOption = (id) => conversionOptions.find((item) => item.id === id);

const getOptionDisplayLabel = (item) => {
  if (item.route === "Oral") {
    return `${item.medication} PO`;
  }

  if (item.route === "Oral ER") {
    return `${item.medication} PO ER`;
  }

  return item.label;
};

const sortOptionsForSelect = (options) =>
  [...options].sort((first, second) =>
    getOptionDisplayLabel(first).localeCompare(getOptionDisplayLabel(second), undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

const optionMarkup = (item) =>
  `<option value="${item.id}">${getOptionDisplayLabel(item)}</option>`;

const isMethadoneOption = (option) => option?.medication === "Methadone";
const isPatchOption = (option) => option?.doseUnit === "patch";

const getUseDescription = (option) => {
  if (!option.targetable) {
    return "Current/MME only";
  }

  if (isMethadoneOption(option)) {
    return "Current/MME or methadone route target";
  }

  return "Current or target";
};

const getReferenceDoseDescription = (option) => {
  if (isPatchOption(option)) {
    return "1 patch";
  }

  return `${formatDose(option.referenceDose)} ${option.doseUnit}`;
};

const getDailyUnitLabel = (option) => {
  if (!option) {
    return "mg/day";
  }

  if (option.doseUnit === "patch") {
    return "patches";
  }

  return `${option.doseUnit}/day`;
};

const getEntryDoseLabel = (option) =>
  isPatchOption(option) ? "Patch quantity" : "Dose per administration";

const getEntryDoseHint = (option) =>
  isPatchOption(option)
    ? "Number of active patches at the selected strength"
    : option?.doseUnit || "mg";

const getEntryFrequencyLabel = (option) =>
  isPatchOption(option) ? "Standing 24-hour factor" : "Doses per day";

const getEntryFrequencyHint = (option) =>
  isPatchOption(option)
    ? "Patch rows are treated as continuous 24-hour exposure"
    : "Example: q6h = 4 doses/day";

const clampReduction = (value) => Math.min(100, Math.max(0, Number(value) || 0));
const clampMethadoneReduction = (value) =>
  Math.min(90, Math.max(0, Number(value) || 0));

const syncReduction = (source) => {
  const value = clampReduction(source.value);
  reductionRange.value = value;
  reductionNumber.value = value;
};

const syncMethadoneReduction = (source) => {
  const value = clampMethadoneReduction(source.value);
  methadoneReductionRange.value = value;
  methadoneReductionNumber.value = value;
};

const createRegimenEntry = (overrides = {}) => {
  regimenEntryId += 1;

  return {
    key: regimenEntryId,
    drugId: overrides.drugId || "Hydromorphone_IV",
    dose: overrides.dose || "2",
    dosesPerDay: overrides.dosesPerDay || "1",
  };
};

const getCurrentOralMorphineEquivalent = (option, currentDose) =>
  (currentDose / option.referenceDose) * option.oralMorphineEquivalent;

const getTargetDose = (targetOption, oralMorphineEquivalent) =>
  (oralMorphineEquivalent / targetOption.oralMorphineEquivalent) *
  targetOption.referenceDose;

const isOralMethadoneOnlyRegimen = (parsedEntries) =>
  parsedEntries.length > 0 &&
  parsedEntries.every((entry) => entry.valid && entry.option?.id === "Methadone_Oral");

const getConservativeOralMethadoneMme = (parsedEntries) =>
  parsedEntries.reduce(
    (sum, entry) =>
      sum + entry.dailyDose * METHADONE_CONSERVATIVE_ORAL_MORPHINE_FACTOR,
    0,
  );

const parseRegimenEntries = () =>
  regimenEntriesState.map((entry) => {
    const option = findOption(entry.drugId);
    const patchOption = isPatchOption(option);
    const doseValue = Number(entry.dose);
    const frequencyValue = patchOption ? 1 : Number(entry.dosesPerDay);
    const doseMissing = String(entry.dose).trim() === "";
    const frequencyMissing =
      !patchOption && String(entry.dosesPerDay).trim() === "";
    const valid =
      Boolean(option) &&
      !doseMissing &&
      !frequencyMissing &&
      Number.isFinite(doseValue) &&
      Number.isFinite(frequencyValue) &&
      doseValue >= 0 &&
      frequencyValue >= 0;
    const dailyDose = valid ? (patchOption ? doseValue : doseValue * frequencyValue) : 0;
    const oralMorphineEquivalent = valid
      ? getCurrentOralMorphineEquivalent(option, dailyDose)
      : 0;

    return {
      ...entry,
      option,
      patchOption,
      doseValue,
      frequencyValue,
      valid,
      dailyDose,
      oralMorphineEquivalent,
    };
  });

const getEntrySummaryText = (entry) => {
  const option = findOption(entry.drugId);

  if (!option) {
    return "Select a drug and route for this drug.";
  }

  const patchOption = isPatchOption(option);
  const doseValue = Number(entry.dose);
  const frequencyValue = patchOption ? 1 : Number(entry.dosesPerDay);
  const valid =
    String(entry.dose).trim() !== "" &&
    (patchOption || String(entry.dosesPerDay).trim() !== "") &&
    Number.isFinite(doseValue) &&
    Number.isFinite(frequencyValue) &&
    doseValue >= 0 &&
    frequencyValue >= 0;

  if (!valid) {
    return patchOption
      ? "Enter the number of active patches for this row."
      : "Enter both dose per administration and doses per day.";
  }

  const dailyDose = patchOption ? doseValue : doseValue * frequencyValue;
  const oralMorphineEquivalent = getCurrentOralMorphineEquivalent(
    option,
    dailyDose,
  );

  if (patchOption) {
    const patchNoun = doseValue === 1 ? "patch" : "patches";

    return `${option.label}: ${formatDose(doseValue)} active ${patchNoun}; contributes ${formatDose(
      oralMorphineEquivalent,
    )} mg/day oral morphine equivalent.`;
  }

  return `${option.label}: ${formatDose(doseValue)} ${option.doseUnit} per dose x ${formatDose(
    frequencyValue,
  )}/day = ${formatDose(dailyDose)} ${option.doseUnit}/day; contributes ${formatDose(
    oralMorphineEquivalent,
  )} mg/day oral morphine equivalent.`;
};

const buildRegimenEntryMarkup = (entry, index) => {
  const option = findOption(entry.drugId);
  const patchOption = isPatchOption(option);
  const canRemove = regimenEntriesState.length > 1;
  const doseValue = patchOption
    ? entry.dose || "1"
    : entry.dose || String(option?.referenceDose || "");
  const frequencyValue = patchOption ? "1" : entry.dosesPerDay || "1";

  return `
    <section class="regimen-entry" data-entry-key="${entry.key}">
      <div class="entry-head">
        <div>
          <h3>Drug ${index + 1}</h3>
        </div>
        <button
          class="secondary-button entry-remove-button"
          data-action="remove-entry"
          type="button"
          ${canRemove ? "" : "disabled"}
        >
          Remove
        </button>
      </div>

      <div class="regimen-entry-grid">
        <label>
          Drug and route
          <select data-field="drugId">
            ${sortOptionsForSelect(conversionOptions).map(optionMarkup).join("")}
          </select>
        </label>

        <label>
          ${getEntryDoseLabel(option)}
          <input
            data-field="dose"
            inputmode="decimal"
            min="0"
            step="${patchOption ? "0.5" : "1"}"
            type="number"
            value="${doseValue}"
          />
          <span class="field-hint">${getEntryDoseHint(option)}</span>
        </label>

        <label>
          ${getEntryFrequencyLabel(option)}
          <input
            data-field="dosesPerDay"
            inputmode="decimal"
            min="0"
            step="1"
            type="number"
            value="${frequencyValue}"
            ${patchOption ? "disabled" : ""}
          />
          <span class="field-hint">${getEntryFrequencyHint(option)}</span>
        </label>
      </div>

      <p class="entry-summary">${getEntrySummaryText(entry)}</p>
    </section>
  `;
};

const renderTargetOptions = (preferredValue = targetDrugSelect.value) => {
  const currentOptions = regimenEntriesState
    .map((entry) => findOption(entry.drugId))
    .filter(Boolean);
  const allowMethadoneTarget =
    currentOptions.length > 0 && currentOptions.every(isMethadoneOption);
  const targetOptions = sortOptionsForSelect(
    conversionOptions.filter((item) => {
      if (!item.targetable) {
        return false;
      }

      return allowMethadoneTarget || !isMethadoneOption(item);
    }),
  );

  targetDrugSelect.innerHTML = targetOptions.map(optionMarkup).join("");

  if (targetOptions.some((item) => item.id === preferredValue)) {
    targetDrugSelect.value = preferredValue;
    return;
  }

  if (targetOptions.some((item) => item.id === "Oxycodone_Oral")) {
    targetDrugSelect.value = "Oxycodone_Oral";
    return;
  }

  targetDrugSelect.value = targetOptions[0]?.id || "";
};

const renderRegimenEntries = () => {
  regimenEntriesContainer.innerHTML = regimenEntriesState
    .map((entry, index) => buildRegimenEntryMarkup(entry, index))
    .join("");

  regimenEntriesContainer
    .querySelectorAll('[data-field="drugId"]')
    .forEach((selectElement, index) => {
      selectElement.value = regimenEntriesState[index].drugId;
    });

  renderTargetOptions();
};

const renderReferenceTable = () => {
  referenceTable.innerHTML = conversionOptions
    .map(
      (item) => `
        <tr>
          <td>${item.medication}</td>
          <td>${item.route}</td>
          <td>${getReferenceDoseDescription(item)}</td>
          <td>${formatDose(item.oralMorphineEquivalent)} mg</td>
          <td>${getUseDescription(item)}</td>
        </tr>
      `,
    )
    .join("");
};

const renderHepaticGuidanceTable = () => {
  hepaticGuidanceTableBody.innerHTML = hepaticGuidanceRows
    .map(
      (item) => `
        <tr>
          <td>${item.medication}</td>
          <td>${item.mild.label}</td>
          <td>${item.moderate.label}</td>
          <td>${item.severe.label}</td>
        </tr>
      `,
    )
    .join("");
};

const renderSourceTable = () => {
  sourceTable.innerHTML = sourceReferences
    .map((item) => {
      const linkMarkup = item.url
        ? `<a href="${item.url}" rel="noreferrer" target="_blank">Open source</a>`
        : "Local configuration";

      return `
        <tr>
          <td>${item.title}</td>
          <td>${item.note}</td>
          <td>${linkMarkup}</td>
        </tr>
      `;
    })
    .join("");
};

const formatGraphTime = (hours) => {
  if (hours >= 48) {
    return `${formatDose(hours / 24)} d`;
  }

  if (hours < 1) {
    return `${formatDose(hours * 60)} min`;
  }

  return `${formatDose(hours)} h`;
};

const getGraphValue = (profile, hour) => {
  if (profile.type === "patch") {
    if (hour <= profile.peakHours) {
      return Math.min(1, hour / profile.peakHours);
    }

    if (hour <= profile.wearHours) {
      return 1;
    }

    return Math.exp((-Math.LN2 * (hour - profile.wearHours)) / profile.halfLifeHours);
  }

  if (hour <= profile.peakHours) {
    return Math.pow(hour / profile.peakHours, 0.72);
  }

  return Math.exp((-Math.LN2 * (hour - profile.peakHours)) / profile.halfLifeHours);
};

const getGraphScaleHours = (profile) => {
  if (profile.type === "patch") {
    return profile.wearHours + profile.halfLifeHours * 2;
  }

  return profile.scaleHours || profile.peakHours + profile.halfLifeHours * 4;
};

const buildPharmacokineticsGraphSvg = (profile) => {
  const width = 270;
  const height = 96;
  const xInset = 12;
  const yTop = 10;
  const yBottom = 76;
  const xMax = getGraphScaleHours(profile);
  const xPosition = (hour) => xInset + (hour / xMax) * (width - xInset - 8);
  const yPosition = (value) => yTop + (1 - value) * (yBottom - yTop);
  const graphHours = Array.from({ length: 61 }, (_, index) => (xMax * index) / 60);

  graphHours.push(profile.peakHours);

  if (profile.type === "patch") {
    graphHours.push(profile.wearHours);
  }

  const points = [...new Set(graphHours)]
    .sort((left, right) => left - right)
    .map((hour) => {
      const value = Math.max(0, Math.min(1, getGraphValue(profile, hour)));
      return `${formatDose(xPosition(hour))},${formatDose(yPosition(value))}`;
    });

  const peakX = xPosition(profile.peakHours);
  const offsetX = profile.type === "patch" ? xPosition(profile.wearHours) : null;

  return `
    <svg
      aria-hidden="true"
      class="pk-profile-svg"
      focusable="false"
      viewBox="0 0 ${width} ${height}"
    >
      <line class="pk-axis" x1="${xInset}" y1="${yBottom}" x2="${width - 8}" y2="${yBottom}" />
      <line class="pk-axis" x1="${xInset}" y1="${yTop}" x2="${xInset}" y2="${yBottom}" />
      <line class="pk-marker" x1="${formatDose(peakX)}" y1="${yTop}" x2="${formatDose(peakX)}" y2="${yBottom}" />
      ${
        offsetX
          ? `<line class="pk-marker pk-marker-offset" x1="${formatDose(offsetX)}" y1="${yTop}" x2="${formatDose(offsetX)}" y2="${yBottom}" />`
          : ""
      }
      <polyline class="pk-profile-line" points="${points.join(" ")}" />
      <text class="pk-axis-label" x="${xInset}" y="91">0</text>
      <text class="pk-axis-label" x="${width - 54}" y="91">${formatGraphTime(xMax)}</text>
    </svg>
  `;
};

const getPharmacokineticsSourceMarkup = (item) =>
  item.sources
    .map(
      (source) =>
        `<a href="${source.url}" rel="noreferrer" target="_blank">${source.title}</a>`,
    )
    .join("");

const getSelectedPharmacokineticsRow = () =>
  pharmacokineticsRows[selectedPharmacokineticsIndex] || pharmacokineticsRows[0];

const renderPharmacokineticsGraphs = () => {
  if (!pharmacokineticsGraphGrid) {
    return;
  }

  pharmacokineticsGraphGrid.innerHTML = pharmacokineticsRows
    .map((item, index) => {
      const profile = item.profile;
      const isSelected = index === selectedPharmacokineticsIndex;
      const peakLabel =
        profile.type === "patch"
          ? `Steady/peak: ~${formatGraphTime(profile.peakHours)}`
          : `Peak: ~${formatGraphTime(profile.peakHours)}`;
      const offsetLabel =
        profile.type === "patch"
          ? `Patch wear: ${formatGraphTime(profile.wearHours)}`
          : `Half-life: ~${formatGraphTime(profile.halfLifeHours)}`;

      return `
        <button
          aria-pressed="${isSelected}"
          class="pk-graph-card${isSelected ? " is-selected" : ""}"
          data-pk-index="${index}"
          type="button"
        >
          <div class="pk-graph-card-head">
            <strong>${item.name}</strong>
            <span>${item.route}</span>
          </div>
          ${buildPharmacokineticsGraphSvg(profile)}
          <div class="pk-graph-meta">
            <span>${peakLabel}</span>
            <span>${offsetLabel}</span>
          </div>
        </button>
      `;
    })
    .join("");
};

const renderSelectedPharmacokineticsDetail = () => {
  if (!pharmacokineticsSelectedDetail) {
    return;
  }

  const selectedItem = getSelectedPharmacokineticsRow();

  pharmacokineticsSelectedDetail.innerHTML = `
    <div class="pk-selected-detail-head">
      <span class="eyebrow">Selected profile</span>
      <h4>${selectedItem.name}</h4>
      <span>${selectedItem.route}</span>
    </div>
    <dl class="pk-selected-detail-grid">
      <div>
        <dt>Timing</dt>
        <dd>${selectedItem.timing}</dd>
      </div>
      <div>
        <dt>Half-life / offset</dt>
        <dd>${selectedItem.halfLife}</dd>
      </div>
      <div>
        <dt>Metabolism / elimination</dt>
        <dd>${selectedItem.metabolism}</dd>
      </div>
      <div>
        <dt>Mechanism of action</dt>
        <dd>${selectedItem.mechanism || "Not separately specified in the current client notes for this profile."}</dd>
      </div>
      <div>
        <dt>Important interactions</dt>
        <dd>${selectedItem.interactions || "Review additive CNS depressants, organ function, formulation constraints, and institutional policy before use."}</dd>
      </div>
      <div>
        <dt>Behavior notes</dt>
        <dd>${selectedItem.behavior}</dd>
      </div>
      <div>
        <dt>Source</dt>
        <dd class="source-link-stack">${getPharmacokineticsSourceMarkup(selectedItem)}</dd>
      </div>
    </dl>
  `;
};

const renderPharmacokineticsTable = () => {
  if (!pharmacokineticsTable) {
    return;
  }

  pharmacokineticsTable.innerHTML = pharmacokineticsRows
    .map((item, index) => {
      const sourceMarkup = getPharmacokineticsSourceMarkup(item);
      const isSelected = index === selectedPharmacokineticsIndex;

      return `
        <tr class="${isSelected ? "is-selected-reference-row" : ""}">
          <td>
            <strong>${item.name}</strong>
            <span class="table-subtext">${item.route}</span>
          </td>
          <td>${item.timing}</td>
          <td>${item.halfLife}</td>
          <td>${item.metabolism}</td>
          <td>${item.behavior}</td>
          <td><div class="source-link-stack">${sourceMarkup}</div></td>
        </tr>
      `;
    })
    .join("");
};

const renderPharmacokineticsReference = () => {
  renderPharmacokineticsGraphs();
  renderSelectedPharmacokineticsDetail();
  renderPharmacokineticsTable();
};

const renderBuprenorphineOptions = () => {
  buprenorphineMeddRangeSelect.innerHTML = buprenorphineSchedules
    .map((item) => `<option value="${item.id}">${item.label}</option>`)
    .join("");
};

const getBuprenorphineSchedule = () =>
  buprenorphineSchedules.find(
    (item) => item.id === buprenorphineMeddRangeSelect.value,
  ) || buprenorphineSchedules[0];

const renderBuprenorphineSchedule = () => {
  const schedule = getBuprenorphineSchedule();
  const endpoint = schedule.days[schedule.days.length - 1];

  buprenorphineResultTitle.textContent = schedule.title;
  buprenorphineProduct.textContent = schedule.product;
  buprenorphineContinueSummary.textContent = schedule.fullAgonistSummary;
  buprenorphineStopSummary.textContent = schedule.stopSummary;
  buprenorphineEndpoint.textContent = endpoint.buprenorphine;
  buprenorphineScheduleTableBody.innerHTML = schedule.days
    .map((item) => {
      let actionClass = "continue-action";

      if (item.fullAgonist === "STOP" || item.fullAgonist.includes("None")) {
        actionClass = "stop-action";
      } else if (item.fullAgonist.includes("2/3")) {
        actionClass = "taper-action";
      }

      return `
        <tr>
          <td>${item.day}</td>
          <td class="${actionClass}">${item.fullAgonist}</td>
          <td>${item.buprenorphine}</td>
        </tr>
      `;
    })
    .join("");
};

const renderSpecialtyTool = () => {
  const selectedTool = calculationModeSelect.value;
  const selectedTab = getCalculatorTabButton(selectedTool);

  specialtyPanels.forEach((panel) => {
    const shouldHide = panel.dataset.specialtyPanel !== selectedTool;
    setHiddenState(panel, shouldHide);

    if (!shouldHide && selectedTab?.id) {
      panel.setAttribute("aria-labelledby", selectedTab.id);
    }
  });
};

const updateConversionOutputVisibility = () => {
  const isConversionMode = calculationModeSelect.value === "convert";
  const hasRenalSelection = Boolean(getEgfrBand(egfrInput.value));
  const hasHepaticSelection = getActiveHepaticSeverity().severity !== "none";
  const hasOrganSelection = hasRenalSelection || hasHepaticSelection;

  conversionOutputDetails.forEach((section) => {
    section.classList.toggle("is-hidden", !isConversionMode);
  });

  renalAdjustmentStep.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasRenalSelection,
  );
  hepaticAdjustmentStep.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasHepaticSelection,
  );
  organGuidanceStep.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasOrganSelection,
  );
  organAdviceGrid.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasOrganSelection,
  );
  renalAdviceCard.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasRenalSelection,
  );
  hepaticAdviceCard.classList.toggle(
    "is-hidden",
    !isConversionMode || !hasHepaticSelection,
  );
};

const setModeVisibility = () => {
  const activeMode = calculationModeSelect.value;
  const isMMeMode = activeMode === "mme";
  const isSpecialtyMode =
    activeMode === "methadone" ||
    activeMode === "buprenorphine" ||
    activeMode === "benzo";

  calculatorTabs.forEach((button) => {
    const isActive = button.dataset.calculatorTab === activeMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  const activeTab = getCalculatorTabButton(activeMode);

  if (!isSpecialtyMode && activeTab?.id) {
    mainCalculatorSection.setAttribute("aria-labelledby", activeTab.id);
  }

  setHiddenState(mainCalculatorSection, isSpecialtyMode);
  setHiddenState(specialtyCalculatorSection, !isSpecialtyMode);
  targetField.classList.toggle("is-hidden", isMMeMode || isSpecialtyMode);
  reductionField.classList.toggle("is-hidden", isMMeMode || isSpecialtyMode);
  organContext.classList.toggle("is-hidden", isMMeMode || isSpecialtyMode);

  if (isMMeMode) {
    mainCalculatorHeading.textContent = "Total MME";
    regimenBuilderHeading.textContent = "Current regimen";
  } else {
    mainCalculatorHeading.textContent = "Conversion calculator";
    regimenBuilderHeading.textContent = "Converting from";
  }

  updateConversionOutputVisibility();
};

const getEgfrBand = (rawValue) => {
  const value = Number(rawValue);

  if (String(rawValue).trim() === "" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  if (value > 50) {
    return {
      id: "over50",
      label: "eGFR >50 mL/min",
    };
  }

  if (value >= 30) {
    return {
      id: "30to50",
      label: "eGFR 30-50 mL/min",
    };
  }

  return {
    id: "under30",
    label: "eGFR <30 mL/min",
  };
};

const getActiveHepaticSeverity = () => {
  if (hepaticSeveritySelect.value !== "none") {
    return {
      severity: hepaticSeveritySelect.value,
      source: "clinical",
    };
  }

  return {
    severity: "none",
    source: "none",
  };
};

const updateRenalBandNote = () => {
  const band = getEgfrBand(egfrInput.value);

  if (!band) {
    renalBandNote.textContent =
      "Enter eGFR to apply the staging renal guidance bands.";
    return;
  }

  if (band.id === "over50") {
    renalBandNote.textContent =
      "eGFR above 50 mL/min: this staging build applies no automatic renal reduction.";
    return;
  }

  if (band.id === "30to50") {
    renalBandNote.textContent =
      "eGFR 30-50 mL/min: this staging build applies a 25% reduction for uncontrolled pain or a 50% reduction for well controlled pain to morphine, codeine, and meperidine.";
    return;
  }

  renalBandNote.textContent =
    "eGFR below 30 mL/min: this staging build marks morphine, codeine, and meperidine as avoid and highlights alternative opioid groups.";
};

const renderRegimenSummaryTable = (parsedEntries) => {
  regimenSummaryTable.innerHTML = parsedEntries
    .map((entry) => {
      const option = entry.option;

      if (!option) {
        return `
          <tr>
            <td>Unconfigured entry</td>
            <td>--</td>
            <td>--</td>
          </tr>
        `;
      }

      const patchOption = entry.patchOption;
      const doseText = patchOption
        ? `${formatDose(entry.doseValue)} patch${entry.doseValue === 1 ? "" : "es"}`
        : `${formatDose(entry.doseValue)} ${option.doseUnit}`;
      const frequencyText = patchOption
        ? "Standing 24-hour exposure"
        : `${formatDose(entry.frequencyValue)}/day`;
      const dailyDoseText = entry.valid
        ? patchOption
          ? `${formatDose(entry.doseValue)} active patch${entry.doseValue === 1 ? "" : "es"}`
          : `${formatDose(entry.dailyDose)} ${option.doseUnit}/day`
        : "Incomplete entry";
      const oralMorphineEquivalentText = entry.valid
        ? `${formatDose(entry.oralMorphineEquivalent)} mg/day`
        : "--";
      const regimenText = `
        <span class="output-stack">
          <span>${doseText}</span>
          <span class="output-detail">${frequencyText}</span>
        </span>
      `;
      const dailyTotalsText = entry.valid
        ? `
          <span class="output-stack">
            <span>${dailyDoseText}</span>
            <span class="output-detail">OME: ${oralMorphineEquivalentText}</span>
          </span>
        `
        : "Incomplete entry";

      return `
        <tr>
          <td>${option.label}</td>
          <td>${regimenText}</td>
          <td>${dailyTotalsText}</td>
        </tr>
      `;
    })
    .join("");
};

const getRenalAdvice = ({
  parsedEntries,
  targetOption,
  isMMeMode,
  adjustedTargetDose,
}) => {
  const band = getEgfrBand(egfrInput.value);
  const painControlValue = painControlSelect.value;
  const restrictedCurrent = parsedEntries
    .filter(
      (entry) =>
        entry.option &&
        entry.valid &&
        renalRestrictedMedications.has(entry.option.medication),
    )
    .map((entry) => entry.option.label);
  const currentNote = restrictedCurrent.length
    ? ` Current regimen includes ${formatList(restrictedCurrent)}.`
    : "";

  if (!band) {
    return {
      summary: "Renal guidance off",
      title: "No renal band selected",
      body: "Enter eGFR to turn on the staging renal adjustment guidance.",
      resultLabel: "Not applied",
    };
  }

  if (band.id === "over50") {
    return {
      summary: "Renal: eGFR >50 mL/min",
      title: "eGFR >50 mL/min",
      body:
        "No automatic renal dose reduction is configured in this staging build above 50 mL/min." +
        currentNote,
      resultLabel: "No renal reduction",
    };
  }

  if (band.id === "30to50") {
    const reductionPercentage = painControlValue === "controlled" ? 50 : 25;
    const reductionLabel =
      painControlValue === "controlled"
        ? "50% reduction for well controlled pain"
        : "25% reduction for uncontrolled pain";

    if (!isMMeMode && targetOption) {
      if (renalRestrictedMedications.has(targetOption.medication)) {
        const renalAdjustedDose =
          adjustedTargetDose * (1 - reductionPercentage / 100);

        return {
          summary: `Renal: ${band.label}; ${reductionLabel}`,
          title: `${targetOption.label} is in the renal-restriction group`,
          body:
            `${reductionLabel} is configured here for morphine, codeine, and meperidine when eGFR is 30-50 mL/min. ` +
            `Applied after the selected safety reduction, ${formatDoseWithUnit(
              adjustedTargetDose,
              getDailyUnitLabel(targetOption),
            )} becomes about ${formatDoseWithUnit(
              renalAdjustedDose,
              getDailyUnitLabel(targetOption),
            )}.` +
            currentNote,
          resultLabel: formatDoseWithUnit(
            renalAdjustedDose,
            getDailyUnitLabel(targetOption),
          ),
        };
      }

      if (renalModerateAlternativeMedications.has(targetOption.medication)) {
        return {
          summary: `Renal: ${band.label}; moderate-kidney-effect alternative`,
          title: `${targetOption.label} is a moderate-kidney-effect alternative`,
          body:
            "No explicit percentage reduction is auto-applied for oxycodone or hydromorphone in this staging build. Use lower starting doses and cautious titration in renal dysfunction." +
            currentNote,
          resultLabel: "Use caution",
        };
      }

      if (renalMinimalAlternativeMedications.has(targetOption.medication)) {
        return {
          summary: `Renal: ${band.label}; minimal-kidney-effect alternative`,
          title: `${targetOption.label} is a lower-kidney-effect alternative`,
          body:
            "Methadone, fentanyl, and buprenorphine are listed here as lower-kidney-effect alternatives. No automatic percentage reduction is applied in this staging build, but monitoring and formulation review remain necessary." +
            currentNote,
          resultLabel: "Preferred class",
        };
      }
    }

    return {
      summary: `Renal: ${band.label}; ${reductionLabel}`,
      title: "Renal staging rule for eGFR 30-50 mL/min",
      body:
        `This staging build applies ${reductionLabel} to morphine, codeine, and meperidine in the 30-50 mL/min band.` +
        currentNote,
      resultLabel: "Guidance only",
    };
  }

  if (!isMMeMode && targetOption) {
    if (renalRestrictedMedications.has(targetOption.medication)) {
      return {
        summary: "Renal: eGFR <30 mL/min; avoid selected target agent",
        title: `Avoid ${targetOption.label} at eGFR <30 mL/min`,
        body:
          "Morphine, codeine, and meperidine are marked as avoid in this staging build below 30 mL/min. Suggested alternatives: oxycodone or hydromorphone with caution, or methadone, fentanyl, or buprenorphine with specialist review and monitoring." +
          currentNote,
        resultLabel: "Avoid selected target agent",
      };
    }

    if (renalModerateAlternativeMedications.has(targetOption.medication)) {
      return {
        summary: "Renal: eGFR <30 mL/min; cautious alternative",
        title: `${targetOption.label} is a cautious alternative`,
        body:
          "Oxycodone and hydromorphone are listed here as moderate-kidney-effect alternatives. Start carefully, titrate slowly, and monitor for accumulation." +
          currentNote,
        resultLabel: "Use cautious low start",
      };
    }

    if (renalMinimalAlternativeMedications.has(targetOption.medication)) {
      return {
        summary: "Renal: eGFR <30 mL/min; lower-kidney-effect alternative",
        title: `${targetOption.label} is a lower-kidney-effect alternative`,
        body:
          "Methadone, fentanyl, and buprenorphine are highlighted here as lower-kidney-effect alternatives. No automatic percentage reduction is added in this staging build, but specialist review and close monitoring remain important." +
          currentNote,
        resultLabel: "Preferred class",
      };
    }
  }

  return {
    summary: "Renal: eGFR <30 mL/min; avoid morphine, codeine, and meperidine",
    title: "Renal staging rule for eGFR <30 mL/min",
    body:
      "Morphine, codeine, and meperidine are marked as avoid below 30 mL/min in this staging build. Suggested alternatives: oxycodone or hydromorphone with caution, or methadone, fentanyl, or buprenorphine with specialist review and monitoring." +
      currentNote,
    resultLabel: "Guidance only",
  };
};

const getHepaticAdvice = ({
  parsedEntries,
  targetOption,
  isMMeMode,
  adjustedTargetDose,
}) => {
  const activeSeverity = getActiveHepaticSeverity();
  const severity = activeSeverity.severity;
  const severityLabel = hepaticSeverityLabels[severity] || "No class selected";
  const sourcePrefix =
    activeSeverity.source === "clinical"
      ? "Clinical liver class selected"
      : "No liver class selected";

  if (severity === "none") {
    return {
      summary: "Hepatic guidance off",
      title: "No hepatic class selected",
      body:
        "Select mild, moderate, or severe hepatic impairment to show the configured liver dosing guidance for the target opioid.",
      resultLabel: "Not applied",
    };
  }

  if (isMMeMode || !targetOption) {
    const currentMedicationsWithGuidance = parsedEntries
      .filter((entry) => entry.option && hepaticGuidanceByMedication[entry.option.medication])
      .map((entry) => entry.option.label);

    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment)`,
      title: `${severityLabel} hepatic impairment active`,
      body: currentMedicationsWithGuidance.length
        ? `${sourcePrefix}. Review the configured hepatic table below for ${formatList(
            currentMedicationsWithGuidance,
          )}. Numeric hepatic reductions are only shown here for a selected target opioid.`
        : `${sourcePrefix}. Numeric hepatic reductions are only shown here for a selected target opioid. Use the hepatic reference table below and bedside assessment when reviewing the current regimen.`,
      resultLabel: "Guidance only",
    };
  }

  const guidanceRow = hepaticGuidanceByMedication[targetOption.medication];

  if (!guidanceRow) {
    if (targetOption.medication === "Codeine") {
      return {
        summary: `Hepatic: ${severityLabel} (clinical judgment); no local percent table for codeine`,
        title: `Codeine requires extra caution in ${severityLabel.toLowerCase()} hepatic impairment`,
        body:
          `${sourcePrefix}. No local percentage reduction table is configured here for codeine. Because codeine relies on hepatic conversion to morphine, use caution and consider avoidance in significant liver dysfunction.`,
        resultLabel: "Use extra caution",
      };
    }

    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment); no target-specific staging rule`,
      title: `No configured hepatic percentage rule for ${targetOption.label}`,
      body:
        `${sourcePrefix}. This staging build does not apply a medication-specific hepatic percentage rule to the selected target. Use bedside assessment and the reference sources below.`,
      resultLabel: "Guidance only",
    };
  }

  const rule = guidanceRow[severity];

  if (rule.avoid) {
    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment); avoid ${targetOption.medication}`,
      title: `${severityLabel} hepatic impairment: avoid ${targetOption.label}`,
      body: `${sourcePrefix}. The configured hepatic guide for this staging build marks ${targetOption.label} as avoid in ${severityLabel.toLowerCase()} hepatic impairment.`,
      resultLabel: "Avoid target",
    };
  }

  if (rule.infoOnly) {
    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment); ${rule.label}`,
      title: `${severityLabel} hepatic impairment: ${targetOption.label}`,
      body:
        `${sourcePrefix}. ${rule.label}. No numeric hepatic percentage adjustment is auto-applied here for the selected target dose of ${formatDoseWithUnit(
          adjustedTargetDose,
          getDailyUnitLabel(targetOption),
        )}.`,
      resultLabel: rule.label,
    };
  }

  const minimumDose = adjustedTargetDose * (1 - rule.maxReduction / 100);
  const maximumDose = adjustedTargetDose * (1 - rule.minReduction / 100);
  const targetRangeLabel = formatDoseRange(
    minimumDose,
    maximumDose,
    getDailyUnitLabel(targetOption),
  );

  return {
    summary: `Hepatic: ${severityLabel} (clinical judgment); ${rule.label}`,
    title: `${severityLabel} hepatic impairment: ${targetOption.label}`,
    body:
      `${sourcePrefix}. ${rule.label}. Applied after the selected safety reduction, ${formatDoseWithUnit(
        adjustedTargetDose,
        getDailyUnitLabel(targetOption),
      )} corresponds to about ${targetRangeLabel}.`,
    resultLabel: targetRangeLabel,
  };
};

const showInvalidRegimen = (parsedEntries) => {
  renderRegimenSummaryTable(parsedEntries);
  finalDose.textContent = "0";
  finalUnit.textContent = "mg/day";
  methadoneConservativeMme.classList.add("is-hidden");
  resultTitle.textContent = "Enter a valid regimen";
  rawTargetDoseOutput.textContent = "0 mg/day";
  reductionAppliedOutput.textContent = `${clampReduction(reductionNumber.value)}% reduction`;
  renalAdjustedDoseOutput.textContent = "Not applied";
  hepaticAdjustedDoseOutput.textContent = "Not applied";
  organGuidanceSummaryOutput.textContent = "Complete the regimen before conversion";
  renalAdviceTitle.textContent = "Regimen incomplete";
  renalAdviceBody.textContent =
    "Renal advice appears after the regimen entries are complete.";
  hepaticAdviceTitle.textContent = "Regimen incomplete";
  hepaticAdviceBody.textContent =
    "Hepatic advice appears after the regimen entries are complete.";
};

const calculate = () => {
  setModeVisibility();
  updateRenalBandNote();

  const parsedEntries = parseRegimenEntries();
  const targetOption = findOption(targetDrugSelect.value);
  const reductionPercentage = clampReduction(reductionNumber.value);
  const isMMeMode = calculationModeSelect.value === "mme";

  renderRegimenSummaryTable(parsedEntries);
  methadoneConservativeMme.classList.add("is-hidden");

  if (!parsedEntries.length || parsedEntries.some((entry) => !entry.valid)) {
    showInvalidRegimen(parsedEntries);
    return;
  }

  const oralMorphineEquivalent = parsedEntries.reduce(
    (sum, entry) => sum + entry.oralMorphineEquivalent,
    0,
  );

  if (isMMeMode) {
    const renalAdvice = getRenalAdvice({
      parsedEntries,
      targetOption: null,
      isMMeMode: true,
      adjustedTargetDose: 0,
    });
    const hepaticAdvice = getHepaticAdvice({
      parsedEntries,
      targetOption: null,
      isMMeMode: true,
      adjustedTargetDose: 0,
    });

    resultTitle.textContent = "Total MME estimate";
    finalDose.textContent = formatDose(oralMorphineEquivalent);
    finalUnit.textContent = "mg MME/day";
    if (isOralMethadoneOnlyRegimen(parsedEntries)) {
      const conservativeMme = getConservativeOralMethadoneMme(parsedEntries);

      methadoneConservativeMmeDose.textContent = formatDose(conservativeMme);
      methadoneConservativeMme.classList.remove("is-hidden");
    }
    targetStepLabel.textContent = "Target calculation";
    rawTargetDoseOutput.textContent = "Not applied";
    reductionStep.classList.add("is-hidden");
    renalAdjustedDoseOutput.textContent = renalAdvice.resultLabel || "Guidance only";
    hepaticAdjustedDoseOutput.textContent = hepaticAdvice.resultLabel || "Guidance only";
    organGuidanceSummaryOutput.textContent = `${renalAdvice.summary}; ${hepaticAdvice.summary}`;
    renalAdviceTitle.textContent = renalAdvice.title;
    renalAdviceBody.textContent = renalAdvice.body;
    hepaticAdviceTitle.textContent = hepaticAdvice.title;
    hepaticAdviceBody.textContent = hepaticAdvice.body;
    return;
  }

  if (!targetOption) {
    showInvalidRegimen(parsedEntries);
    return;
  }

  const rawTargetDose = getTargetDose(targetOption, oralMorphineEquivalent);
  const adjustedTargetDose = rawTargetDose * (1 - reductionPercentage / 100);
  const renalAdvice = getRenalAdvice({
    parsedEntries,
    targetOption,
    isMMeMode: false,
    adjustedTargetDose,
  });
  const hepaticAdvice = getHepaticAdvice({
    parsedEntries,
    targetOption,
    isMMeMode: false,
    adjustedTargetDose,
  });

  resultTitle.textContent = `${targetOption.label} estimate`;
  finalDose.textContent = formatDose(adjustedTargetDose);
  finalUnit.textContent = getDailyUnitLabel(targetOption);
  targetStepLabel.textContent = `Raw ${targetOption.label.toLowerCase()} dose`;
  rawTargetDoseOutput.textContent = `${formatDose(rawTargetDose)} ${getDailyUnitLabel(
    targetOption,
  )}`;
  reductionAppliedOutput.textContent = `${reductionPercentage}% reduction`;
  reductionStep.classList.remove("is-hidden");
  renalAdjustedDoseOutput.textContent = renalAdvice.resultLabel || "Guidance only";
  hepaticAdjustedDoseOutput.textContent = hepaticAdvice.resultLabel || "Guidance only";
  organGuidanceSummaryOutput.textContent = `${renalAdvice.summary}; ${hepaticAdvice.summary}`;
  renalAdviceTitle.textContent = renalAdvice.title;
  renalAdviceBody.textContent = renalAdvice.body;
  hepaticAdviceTitle.textContent = hepaticAdvice.title;
  hepaticAdviceBody.textContent = hepaticAdvice.body;
};

const getMethadoneBracket = (oralMorphineDaily) =>
  methadoneRatioTable.find((item) => oralMorphineDaily <= item.max) ||
  methadoneRatioTable[methadoneRatioTable.length - 1];

const getMethadoneRoute = () => {
  if (methadoneRouteSelect.value === "iv") {
    return {
      label: "IV methadone",
      unitLabel: "mg/day IV",
      factor: 0.5,
      adjustmentLabel: "IV route: 50% of oral estimate",
    };
  }

  return {
    label: "oral methadone",
    unitLabel: "mg/day oral",
    factor: 1,
    adjustmentLabel: "Oral route: no adjustment",
  };
};

const calculateMethadone = () => {
  const oralMorphineDaily = Number(methadoneMorphineDoseInput.value);
  const reductionPercentage = clampMethadoneReduction(
    methadoneReductionNumber.value,
  );

  if (
    methadoneMorphineDoseInput.value.trim() === "" ||
    !Number.isFinite(oralMorphineDaily) ||
    oralMorphineDaily < 0
  ) {
    methadoneFinalDose.textContent = "0";
    methadoneFinalUnit.textContent = getMethadoneRoute().unitLabel;
    methadoneRatioOutput.textContent = "Not applied";
    methadoneRawDoseOutput.textContent = "0 mg/day";
    methadoneRouteAdjustmentOutput.textContent = "Not applied";
    methadoneReductionAppliedOutput.textContent = `${reductionPercentage}% reduction`;
    methadoneQ8DoseOutput.textContent = "0 mg/dose";
    methadoneQ12DoseOutput.textContent = "0 mg/dose";
    return;
  }

  const bracket = getMethadoneBracket(oralMorphineDaily);
  const route = getMethadoneRoute();
  const rawOralMethadoneDaily = oralMorphineDaily / bracket.ratio;
  const reducedOralMethadoneDaily =
    rawOralMethadoneDaily * (1 - reductionPercentage / 100);
  const reducedMethadoneDaily = reducedOralMethadoneDaily * route.factor;
  const q8Dose = reducedMethadoneDaily / 3;
  const q12Dose = reducedMethadoneDaily / 2;

  methadoneFinalDose.textContent = formatDose(reducedMethadoneDaily);
  methadoneFinalUnit.textContent = route.unitLabel;
  methadoneRatioOutput.textContent = `${bracket.ratio}:1`;
  methadoneRawDoseOutput.textContent =
    `${formatDose(rawOralMethadoneDaily)} mg/day`;
  methadoneRouteAdjustmentOutput.textContent = route.adjustmentLabel;
  methadoneReductionAppliedOutput.textContent = `${reductionPercentage}% reduction`;
  methadoneQ8DoseOutput.textContent = `${formatDose(q8Dose)} mg/dose`;
  methadoneQ12DoseOutput.textContent = `${formatDose(q12Dose)} mg/dose`;
};

const getBenzoOption = (id) =>
  benzoConversionOptions.find((item) => item.id === id);

const populateBenzoSelects = () => {
  if (!benzoSourceDrugSelect || !benzoTargetDrugSelect) {
    return;
  }

  const markup = benzoConversionOptions
    .map((item) => `<option value="${item.id}">${item.medication}</option>`)
    .join("");

  benzoSourceDrugSelect.innerHTML = markup;
  benzoTargetDrugSelect.innerHTML = markup;
  benzoSourceDrugSelect.value = "alprazolam";
  benzoTargetDrugSelect.value = "diazepam";
};

const syncBenzoReduction = (sourceControl) => {
  const reduction = Math.min(50, Math.max(0, Number(sourceControl.value) || 0));
  benzoReductionRange.value = String(reduction);
  benzoReductionNumber.value = String(reduction);
};

const calculateBenzo = () => {
  if (!benzoSourceDrugSelect || !benzoTargetDrugSelect) {
    return;
  }

  const sourceBenzo = getBenzoOption(benzoSourceDrugSelect.value);
  const targetBenzo = getBenzoOption(benzoTargetDrugSelect.value);
  const sourceDose = Number(benzoSourceDoseInput.value);
  const reductionPercentage = Math.min(
    50,
    Math.max(0, Number(benzoReductionNumber.value) || 0),
  );

  if (!sourceBenzo || !targetBenzo || !Number.isFinite(sourceDose) || sourceDose < 0) {
    benzoFinalDose.textContent = "0";
    benzoFinalUnit.textContent = "mg/day";
    benzoRawDiazepamEquiv.textContent = "0 mg/day";
    benzoReducedDiazepamEquiv.textContent = "0 mg/day";
    benzoReductionApplied.textContent = `${reductionPercentage}% reduction`;
    return;
  }

  const rawDiazepamEquivalent =
    (sourceDose / sourceBenzo.diazepam10Equivalent) * 10;
  const reducedDiazepamEquivalent =
    rawDiazepamEquivalent * (1 - reductionPercentage / 100);
  const targetDose =
    (reducedDiazepamEquivalent / 10) * targetBenzo.diazepam10Equivalent;

  benzoFinalDose.textContent = formatDose(targetDose);
  benzoFinalUnit.textContent = "mg/day";
  benzoRawDiazepamEquiv.textContent =
    `${formatDose(rawDiazepamEquivalent)} mg/day`;
  benzoReducedDiazepamEquiv.textContent =
    `${formatDose(reducedDiazepamEquivalent)} mg/day`;
  benzoReductionApplied.textContent = `${reductionPercentage}% reduction`;
};

const handleRegimenEntryInput = (event) => {
  const entryElement = event.target.closest(".regimen-entry");

  if (!entryElement) {
    return;
  }

  const entryKey = Number(entryElement.dataset.entryKey);
  const entry = regimenEntriesState.find((item) => item.key === entryKey);

  if (!entry) {
    return;
  }

  const field = event.target.dataset.field;

  if (!field) {
    return;
  }

  entry[field] = event.target.value;

  if (field === "drugId") {
    const option = findOption(entry.drugId);

    if (option) {
      entry.dose = isPatchOption(option) ? "1" : String(option.referenceDose);
      entry.dosesPerDay = isPatchOption(option) ? "1" : "1";
    }

    renderRegimenEntries();
  }

  calculate();
};

const handleRegimenEntryClick = (event) => {
  const removeButton = event.target.closest('[data-action="remove-entry"]');

  if (!removeButton) {
    return;
  }

  const entryElement = event.target.closest(".regimen-entry");

  if (!entryElement || regimenEntriesState.length === 1) {
    return;
  }

  const entryKey = Number(entryElement.dataset.entryKey);
  regimenEntriesState = regimenEntriesState.filter((item) => item.key !== entryKey);
  renderRegimenEntries();
  calculate();
};

const setRegimenEntries = (entries) => {
  regimenEntriesState = entries.map((entry) => createRegimenEntry(entry));
  renderRegimenEntries();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculate();
});

methadoneForm.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateMethadone();
});

buprenorphineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderBuprenorphineSchedule();
});

if (benzoForm) {
  benzoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateBenzo();
  });
}

regimenEntriesContainer.addEventListener("input", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("change", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("click", handleRegimenEntryClick);

addRegimenEntryButton.addEventListener("click", () => {
  regimenEntriesState.push(createRegimenEntry());
  renderRegimenEntries();
  calculate();
});

const activateCalculatorMode = (mode) => {
  calculationModeSelect.value = mode;
  setModeVisibility();

  if (mode === "methadone" || mode === "buprenorphine" || mode === "benzo") {
    renderSpecialtyTool();
    calculateMethadone();
    renderBuprenorphineSchedule();
    calculateBenzo();
    return;
  }

  calculate();
};

calculatorTabs.forEach((button, index) => {
  button.addEventListener("click", () => {
    activateCalculatorMode(button.dataset.calculatorTab);
  });

  button.addEventListener("keydown", (event) => {
    const lastIndex = calculatorTabs.length - 1;
    let nextIndex = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    const nextButton = calculatorTabs[nextIndex];
    nextButton.focus();
    activateCalculatorMode(nextButton.dataset.calculatorTab);
  });
});

targetDrugSelect.addEventListener("input", () => {
  calculate();
});

[reductionRange, reductionNumber].forEach((control) => {
  control.addEventListener("input", () => {
    syncReduction(control);
    calculate();
  });
});

document.querySelectorAll("[data-reduction-quickset]").forEach((button) => {
  button.addEventListener("click", () => {
    reductionRange.value = button.dataset.reductionQuickset;
    reductionNumber.value = button.dataset.reductionQuickset;
    calculate();
  });
});

[
  egfrInput,
  painControlSelect,
  hepaticSeveritySelect,
].forEach((control) => {
  control.addEventListener("input", () => {
    updateRenalBandNote();
    calculate();
  });
});

[
  methadoneMorphineDoseInput,
  methadoneRouteSelect,
  methadoneReductionRange,
  methadoneReductionNumber,
].forEach((control) => {
  control.addEventListener("input", () => {
    if (
      control === methadoneReductionRange ||
      control === methadoneReductionNumber
    ) {
      syncMethadoneReduction(control);
    }

    calculateMethadone();
  });
});

buprenorphineMeddRangeSelect.addEventListener("input", () => {
  renderBuprenorphineSchedule();
});

[
  benzoSourceDrugSelect,
  benzoSourceDoseInput,
  benzoTargetDrugSelect,
  benzoReductionRange,
  benzoReductionNumber,
].forEach((control) => {
  if (!control) {
    return;
  }

  control.addEventListener("input", () => {
    if (control === benzoReductionRange || control === benzoReductionNumber) {
      syncBenzoReduction(control);
    }

    calculateBenzo();
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    persistTheme(nextTheme);
  });
}

if (termsAcceptInput) {
  termsAcceptInput.addEventListener("input", updateTermsAcceptanceState);
}

if (termsAcceptanceForm) {
  termsAcceptanceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!termsAcceptInput || termsAcceptInput.value.trim() !== "ACCEPT") {
      return;
    }

    storeTermsAcceptance();
    setTermsModalVisible(false);
  });
}

if (termsCloseButton) {
  termsCloseButton.addEventListener("click", () => {
    setTermsModalVisible(false);
  });
}

if (termsReviewButton) {
  termsReviewButton.addEventListener("click", () => {
    setTermsModalVisible(true, { reviewMode: true });
  });
}

if (pharmacokineticsOpenButton) {
  pharmacokineticsOpenButton.addEventListener("click", () => {
    setPharmacokineticsModalVisible(true);
  });
}

if (pharmacokineticsCloseButton) {
  pharmacokineticsCloseButton.addEventListener("click", () => {
    setPharmacokineticsModalVisible(false);
  });
}

if (pharmacokineticsModal) {
  pharmacokineticsModal.addEventListener("click", (event) => {
    if (event.target === pharmacokineticsModal) {
      setPharmacokineticsModalVisible(false);
    }
  });
}

if (pharmacokineticsGraphGrid) {
  pharmacokineticsGraphGrid.addEventListener("click", (event) => {
    const selectedCard = event.target.closest("[data-pk-index]");

    if (!selectedCard) {
      return;
    }

    selectedPharmacokineticsIndex = Number(selectedCard.dataset.pkIndex);
    renderPharmacokineticsReference();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (isModalVisible(pharmacokineticsModal)) {
    setPharmacokineticsModalVisible(false);
    return;
  }

  if (isModalVisible(termsModal)) {
    setTermsModalVisible(false);
  }
});

exampleButton.addEventListener("click", () => {
  calculationModeSelect.value = "convert";
  setRegimenEntries([
    {
      drugId: "Hydromorphone_IV",
      dose: "1",
      dosesPerDay: "4",
    },
    {
      drugId: "Hydrocodone_Oral",
      dose: "10",
      dosesPerDay: "4",
    },
  ]);
  renderTargetOptions("Oxycodone_Oral");
  targetDrugSelect.value = "Oxycodone_Oral";
  reductionRange.value = "25";
  reductionNumber.value = "25";
  egfrInput.value = "";
  painControlSelect.value = "uncontrolled";
  hepaticSeveritySelect.value = "none";
  calculate();
});

mmeExampleButton.addEventListener("click", () => {
  calculationModeSelect.value = "mme";
  setRegimenEntries([
    {
      drugId: "Fentanyl_Patch_25",
      dose: "1",
      dosesPerDay: "1",
    },
  ]);
  reductionRange.value = "25";
  reductionNumber.value = "25";
  egfrInput.value = "";
  painControlSelect.value = "uncontrolled";
  hepaticSeveritySelect.value = "none";
  calculate();
});

setTheme(document.documentElement.dataset.theme);
setTermsModalVisible(false);
renderReferenceTable();
renderHepaticGuidanceTable();
renderSourceTable();
renderPharmacokineticsReference();
renderBuprenorphineOptions();
populateBenzoSelects();
setRegimenEntries([{}]);
renderSpecialtyTool();
renderBuprenorphineSchedule();
updateRenalBandNote();
calculate();
calculateMethadone();
calculateBenzo();
