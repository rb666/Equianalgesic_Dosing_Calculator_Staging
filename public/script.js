const calculatorCore = globalThis.CalculatorCore;
const calculatorProvenance = globalThis.CALCULATOR_PROVENANCE;

if (!calculatorCore || !calculatorProvenance) {
  throw new Error("Calculator core or clinical-data manifest failed to load.");
}

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
  {
    id: "alprazolam_po",
    medication: "Alprazolam",
    brand: "Xanax",
    route: "PO",
    equiv: 1,
    doseUnit: "mg",
  },
  {
    id: "chlordiazepoxide_po",
    medication: "Chlordiazepoxide",
    brand: "Librium",
    route: "PO",
    equiv: 25,
    doseUnit: "mg",
  },
  {
    id: "clonazepam_po",
    medication: "Clonazepam",
    brand: "Klonopin",
    route: "PO",
    equiv: 1,
    doseUnit: "mg",
  },
  {
    id: "clorazepate_po",
    medication: "Clorazepate",
    brand: "Tranxene",
    route: "PO",
    equiv: 15,
    doseUnit: "mg",
  },
  {
    id: "diazepam_po",
    medication: "Diazepam",
    brand: "Valium",
    route: "PO",
    equiv: 10,
    doseUnit: "mg",
  },
  {
    id: "diazepam_iv",
    medication: "Diazepam",
    brand: "Valium",
    route: "IV",
    equiv: 10,
    doseUnit: "mg",
  },
  {
    id: "lorazepam_po",
    medication: "Lorazepam",
    brand: "Ativan",
    route: "PO",
    equiv: 2,
    doseUnit: "mg",
  },
  {
    id: "lorazepam_iv",
    medication: "Lorazepam",
    brand: "Ativan",
    route: "IV",
    equiv: 2,
    doseUnit: "mg",
  },
  {
    id: "midazolam_po",
    medication: "Midazolam",
    brand: "Versed",
    route: "PO",
    equiv: 12,
    doseUnit: "mg",
  },
  {
    id: "midazolam_iv",
    medication: "Midazolam",
    brand: "Versed",
    route: "IV",
    equiv: 4,
    doseUnit: "mg",
  },
  {
    id: "oxazepam_po",
    medication: "Oxazepam",
    brand: "Serax",
    route: "PO",
    equiv: 30,
    doseUnit: "mg",
  },
  {
    id: "temazepam_po",
    medication: "Temazepam",
    brand: "Restoril",
    route: "PO",
    equiv: 15,
    doseUnit: "mg",
  },
  {
    id: "triazolam_po",
    medication: "Triazolam",
    brand: "Halcion",
    route: "PO",
    equiv: 0.25,
    doseUnit: "mg",
  },
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
    route: "Oral (IR)",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Morphine oral (IR)",
    targetable: true,
  },
  {
    id: "Morphine_Oral_ER",
    medication: "Morphine",
    route: "Oral (ER)",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Morphine oral (ER)",
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
    route: "Oral (IR)",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 1.5,
    label: "Codeine oral (IR)",
    targetable: true,
  },
  {
    id: "Hydrocodone_Oral",
    medication: "Hydrocodone",
    route: "Oral (IR)",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydrocodone oral (IR)",
    targetable: true,
  },
  {
    id: "Hydrocodone_Oral_ER",
    medication: "Hydrocodone",
    route: "Oral (ER)",
    referenceDose: 25,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydrocodone oral (ER)",
    targetable: true,
  },
  {
    id: "Oxycodone_Oral",
    medication: "Oxycodone",
    route: "Oral (IR)",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 15,
    label: "Oxycodone oral (IR)",
    targetable: true,
  },
  {
    id: "Oxycodone_Oral_ER",
    medication: "Oxycodone",
    route: "Oral (ER)",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 15,
    label: "Oxycodone oral (ER)",
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
    route: "Oral (IR)",
    referenceDose: 5,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydromorphone oral (IR)",
    targetable: true,
  },
  {
    id: "Hydromorphone_Oral_ER",
    medication: "Hydromorphone",
    route: "Oral (ER)",
    referenceDose: 5,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Hydromorphone oral (ER)",
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
    route: "Oral (IR)",
    referenceDose: 300,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Meperidine oral (IR)",
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
    route: "Oral (IR)",
    referenceDose: 120,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tramadol oral (IR)",
    targetable: true,
  },
  {
    id: "Tramadol_Oral_ER",
    medication: "Tramadol",
    route: "Oral (ER)",
    referenceDose: 120,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tramadol oral (ER)",
    targetable: true,
  },
  {
    id: "Tapentadol_Oral",
    medication: "Tapentadol",
    route: "Oral (IR)",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tapentadol oral (IR)",
    targetable: true,
  },
  {
    id: "Tapentadol_Oral_ER",
    medication: "Tapentadol",
    route: "Oral (ER)",
    referenceDose: 100,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Tapentadol oral (ER)",
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
    route: "Oral (IR)",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxymorphone oral (IR)",
    targetable: true,
  },
  {
    id: "Oxymorphone_Oral_ER",
    medication: "Oxymorphone",
    route: "Oral (ER)",
    referenceDose: 10,
    doseUnit: "mg",
    oralMorphineEquivalent: 25,
    label: "Oxymorphone oral (ER)",
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
      "Background source for hydrocodone, oral codeine, fentanyl transdermal, methadone, morphine, oxycodone 1.5 MME factor, oxymorphone, tapentadol, and tramadol conversion factors.",
  },
  {
    title: "Calculation of Oral Morphine Equivalents (OME) | Pain Management Education at UCSF",
    url: "https://pain.ucsf.edu/opioid-analgesics/calculation-oral-morphine-equivalents-ome",
    note:
      "Background source for IV codeine and additional route-level OME comparisons. Product-specific formulation and route limitations still apply.",
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
      "Background source for renal cautions and alternative opioid groupings. Apply patient-specific renal assessment and institutional guidance.",
  },
  {
    title: "Use of the Child-Pugh Score in Liver Disease – StatPearls",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK542308/",
    note:
      "Background source for liver function markers. The calculator leaves mild, moderate, or severe classification to clinical judgment rather than calculating a lab-derived score.",
  },
  {
    title: "Liver failure pain management – West Midlands Palliative Care",
    url:
      "https://www.westmidspallcare.co.uk/wmpcp/guide/liver-failure/liver-failure-pain-management/",
    note:
      "Background source for hepatic cautions. Apply patient-specific liver assessment and institutional guidance.",
  },
  {
    title: "Choosing equivalent doses of oral benzodiazepines – NHS Specialist Pharmacy Service",
    url:
      "https://www.sps.nhs.uk/articles/oral-benzodiazepines-and-choosing-equivalent-doses/",
    note:
      "Reference for oral benzodiazepine equivalence values using diazepam as the comparison baseline.",
  },
  {
    title: "Benzodiazepine equivalence table – Ashton Manual",
    url: "https://www.benzo.org.uk/bzequiv.htm",
    note:
      "Supplemental reference for benzodiazepine equivalence values and tapering context. Equivalence estimates remain approximate and patient-specific.",
  },
  {
    title: "Urine Drug Tests: Ordering and Interpretation – American Family Physician",
    url: "https://www.aafp.org/pubs/afp/issues/2019/0101/p33.html",
    note:
      "Reference for UDS immunoassay limitations, unexpected results, opioid and benzodiazepine interpretation issues, and confirmation principles.",
  },
  {
    title: "Drug Testing – ARUP Consult",
    url: "https://www.arupconsult.com/content/drug-testing",
    note:
      "Reference for UDS test selection, confirmatory testing, and limitations of opiate, oxycodone, benzodiazepine, and synthetic opioid immunoassays.",
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
      "Primarily CYP3A4 N-dealkylation to norbuprenorphine. Both buprenorphine and norbuprenorphine then undergo phase II UGT glucuronidation (mainly via UGT1A1 and UGT2B7) for elimination. Mostly excreted in bile/feces, with a smaller amount in urine.",
    mechanism:
      "Partial agonist at the mu-opioid receptor (MOR) with very high affinity and slow dissociation; antagonist at the kappa-opioid receptor (KOR); weak/partial activity at delta-opioid (DOR) and ORL-1 (NOP) receptors.",
    behavior:
      "Slow dermal delivery leads to gradual rise in blood levels, taking 2-3 days to reach therapeutic effects. Patches are switched every 7 days. Long effective half-life after removal due to a persistent skin depot.",
    interactions:
      "Strong CYP3A4 inhibitors (e.g., ketoconazole, clarithromycin, grapefruit juice) can increase buprenorphine levels. Strong CYP3A4 inducers (e.g., rifampin, carbamazepine, phenytoin) can lower levels and reduce efficacy. Hepatic impairment significantly affects clearance and drug exposure.",
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
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.5, halfLifeHours: 3, scaleHours: 12 },
    timing:
      "No current IV label basis; accessible reference is for IM use (peak ~30 mins). IV onset is rapid.",
    halfLife:
      "Terminal half-life is approximately 3 to 4 hours.",
    metabolism:
      "Demethylation to active morphine via CYP2D6 (critical for analgesia) and norcodeine via CYP3A4, plus extensive phase II conjugation to codeine-6-glucuronide (C6G). Excreted renally.",
    mechanism:
      "Prodrug with very weak affinity for mu-opioid receptors (MOR) itself; analgesic effect is primarily mediated by its active metabolite, morphine.",
    behavior:
      "Extremely high clinical caution row. Codeine phosphate injection is typically IM/SC; IV injection is rarely used and has high risk of severe hypotension and histamine release. Avoid routine IV use.",
    interactions:
      "CYP2D6 inhibitors (e.g., paroxetine, fluoxetine) block conversion to morphine, rendering it ineffective. Ultra-rapid CYP2D6 metabolizers face life-threatening toxicity/respiratory depression. Additive CNS/respiratory depression with other depressants.",
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
    name: "Codeine oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1, halfLifeHours: 3, scaleHours: 14 },
    timing:
      "Maximum plasma concentration occurs about 60 minutes after administration; steady state reported within 48 hours with q4h dosing.",
    halfLife: "Codeine and metabolite plasma half-lives are reported at about 3 hours.",
    metabolism:
      "About 70-80% phase II glucuronidation to C6G, 5-10% CYP2D6 conversion to active morphine, and 10% CYP3A4 conversion to inactive norcodeine.",
    mechanism:
      "Weak MOR affinity; functions as a prodrug that must be converted by CYP2D6 to morphine to provide significant analgesia.",
    behavior:
      "Highly variable therapeutic response due to CYP2D6 genetic polymorphism. Poor metabolizers derive no benefit; ultra-rapid metabolizers are at risk of severe toxicity even with standard doses.",
    interactions:
      "CYP2D6 inhibitors (e.g., fluoxetine, paroxetine, bupropion) prevent analgesic conversion. Strong CYP3A4 inhibitors or inducers alter alternate pathways. Additive risk with concurrent CNS depressants.",
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
      "Onset is almost immediate; maximum analgesic effect takes several minutes; single-dose analgesic duration is usually 30-60 minutes.",
    halfLife:
      "Terminal elimination half-life is approximately 3-4 hours (219 minutes). Respiratory depressant effect can outlast analgesia.",
    metabolism:
      "Extensively metabolized by CYP3A4 to norfentanyl (which is largely inactive) and other minor inactive metabolites. Elimination occurs primarily through the urine as metabolites, with only a small amount (<10%) excreted unchanged.",
    mechanism:
      "Highly potent full agonist at the mu-opioid receptor (MOR); minimal clinically significant activity at KOR or DOR.",
    behavior:
      "Highly lipophilic with three-compartment kinetics. While onset is rapid, repeated dosing or continuous infusion leads to redistribution into fat and tissues, dramatically prolonging effects, especially in critically ill or obese patients.",
    interactions:
      "Strong CYP3A4 inhibitors (e.g., clarithromycin, ketoconazole, ritonavir) can significantly increase fentanyl levels and risk of profound respiratory depression. Strong CYP3A4 inducers (e.g., rifampin, carbamazepine, phenytoin) reduce efficacy. Hepatic impairment clearances prolong sedation. Concurrent CNS depressants (e.g., benzodiazepines, alcohol) substantially increase risks.",
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
      "Primarily metabolized by CYP3A4 in the liver to norfentanyl (inactive). Excreted primarily in urine as metabolites; less than 10% excreted unchanged.",
    mechanism:
      "Highly potent full agonist at the mu-opioid receptor (MOR); minimal clinically significant activity at KOR or DOR.",
    behavior:
      "Because of slow transdermal delivery and high lipophilicity, serum concentrations rise gradually over many hours, creating a large skin depot. Fentanyl continues to be absorbed for many hours even after patch removal.",
    interactions:
      "Strong CYP3A4 inhibitors (e.g., clarithromycin, ketoconazole, ritonavir) significantly increase fentanyl exposure and toxicity risk. CYP3A4 inducers reduce analgesic effect. Hepatic impairment impairs clearance. Concurrent CNS depressants (benzodiazepines, alcohol) substantially increase overdose risk. External heat sources on the patch can dangerously accelerate absorption.",
    sources: [
      {
        title: "DailyMed fentanyl transdermal system",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=242759ef-cb6d-4e3e-9f8d-5e31efa1f289",
      },
    ],
  },
  {
    name: "Hydrocodone oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.3, halfLifeHours: 3.8, scaleHours: 16 },
    timing: "After a 10 mg oral dose, maximum serum levels occur at 1.3 +/- 0.3 hours.",
    halfLife: "Plasma half-life is 3.8 +/- 0.3 hours in the referenced label.",
    metabolism:
      "Metabolized primarily by CYP3A4 to norhydrocodone (less active) and converted by CYP2D6 into hydromorphone (a highly potent active metabolite). Additional metabolism includes glucuronidation. Renally excreted as metabolites.",
    mechanism:
      "Primarily a full agonist at the mu-opioid receptor (MOR) with limited clinically relevant KOR/DOR activity.",
    behavior:
      "Taken orally, it undergoes first-pass hepatic metabolism. Immediate-release formulations are frequently combined with Acetaminophen, requiring strict monitoring of total daily acetaminophen dose to avoid hepatotoxicity.",
    interactions:
      "Strong CYP3A4 inhibitors (clarithromycin, azole antifungals, ritonavir, grapefruit juice) increase hydrocodone levels and respiratory depression risk. Strong CYP3A4 inducers reduce effectiveness. CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion) reduce conversion to active hydromorphone, altering response. Hepatic impairment prolongs effects. Concurrent CNS depressants (benzodiazepines, alcohol) significantly increase overdose risk.",
    sources: [
      {
        title: "DailyMed hydrocodone/APAP tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=0cc8836b-f0af-42e0-bd77-53fd1dd1aca7&version=11",
      },
    ],
  },
  {
    name: "Hydrocodone oral (ER)",
    route: "Oral",
    profile: {
      type: "absorptive",
      peakHours: 15,
      peakRangeHours: [14, 16],
      halfLifeHours: 8,
      halfLifeRangeHours: [7, 9],
      scaleHours: 36,
    },
    timing: "Hysingla ER source-specific example: median peak concentration occurs at 14-16 hours (observed range 6-30 hours).",
    halfLife: "Hysingla ER terminal elimination half-life is approximately 7-9 hours.",
    metabolism:
      "Primarily metabolized by CYP3A4 to norhydrocodone (less active) and converted by CYP2D6 to hydromorphone (potent). Renally excreted as metabolites.",
    mechanism:
      "Full agonist at the mu-opioid receptor (MOR) with limited KOR/DOR activity.",
    behavior:
      "Hysingla ER is a once-daily extended-release product for severe and persistent pain requiring continuous treatment; it is not an acute breakthrough-pain product.",
    interactions:
      "Identical to IR: Strong CYP3A4 inhibitors increase levels; CYP3A4 inducers decrease levels; CYP2D6 inhibitors block hydromorphone activation. Hepatic impairment clearance is reduced. Concurrent CNS depressants (benzodiazepines, alcohol) carry extreme risk of fatal overdose.",
    sources: [
      {
        title: "DailyMed Hysingla ER tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b7d23ac2-e776-9f62-3290-c64c2d6eb353",
      },
    ],
  },
  {
    name: "Hydromorphone IV",
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.08, halfLifeHours: 2.3, scaleHours: 10 },
    timing:
      "Direct systemic delivery with almost immediate onset; peak CNS effects occur rapidly (within 5-15 minutes).",
    halfLife: "Terminal elimination half-life after an IV dose is about 2.3 hours.",
    metabolism:
      "Extensive hepatic glucuronidation, primarily via UGT2B7, to hydromorphone-3-glucuronide (H3G), which is not analgesic but is neuroexcitatory. Minimized CYP450 involvement. Excreted renally.",
    mechanism:
      "Potent full agonist at the mu-opioid receptor (MOR) with minimal clinically significant activity at KOR or DOR.",
    behavior:
      "Water-soluble and rapidly delivered. Because clearance relies on renal excretion of the glucuronide metabolite, renal impairment leads to significant accumulation of H3G, which can cause neuroexcitatory adverse effects (agitation, myoclonus, confusion, seizures).",
    interactions:
      "CYP-mediated drug interactions are minimal compared to fentanyl or hydrocodone. Renal impairment represents a critical factor due to toxic H3G accumulation. Hepatic impairment reduces clearance. Additive CNS/respiratory depression with concurrent benzodiazepines, alcohol, or other sedatives.",
    sources: [
      {
        title: "DailyMed hydromorphone injection",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c729424e-e483-4bf8-b86c-ce56636dcffa",
      },
    ],
  },
  {
    name: "Hydromorphone oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 0.75, halfLifeHours: 2.7, scaleHours: 12 },
    timing:
      "Rapid oral absorption; peak plasma concentrations occur within 0.5-1 hour. Oral bioavailability is low (~24%).",
    halfLife:
      "Immediate-release oral formulation half-life is approximately 2.6-2.8 hours.",
    metabolism:
      "Extensive pre-systemic hepatic glucuronidation (mainly via UGT2B7) to the inactive but neurotoxic metabolite hydromorphone-3-glucuronide (H3G), excreted renally.",
    mechanism:
      "Potent full agonist at the mu-opioid receptor (MOR) with minimal clinically significant activity at KOR or DOR.",
    behavior:
      "Undergoes substantial first-pass hepatic metabolism. Provides rapid onset but short duration (~3-4 hours), requiring frequent dosing if used for continuous pain.",
    interactions:
      "Minimal CYP450 drug interactions. Renal impairment represents a major risk due to H3G metabolite accumulation (myoclonus, confusion). Hepatic impairment decreases clearance. Combining with benzodiazepines, alcohol, or other CNS depressants markedly increases respiratory depression risk.",
    sources: [
      {
        title: "DailyMed hydromorphone tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2427814c-f32b-8ac5-99b8-5e886fd2d001",
      },
    ],
  },
  {
    name: "Hydromorphone oral (ER)",
    route: "Oral",
    profile: {
      type: "absorptive",
      peakHours: 14,
      peakRangeHours: [12, 16],
      halfLifeHours: 11,
      halfLifeRangeHours: [8, 15],
      scaleHours: 48,
    },
    timing: "Archival Exalgo source-specific example: median peak concentration occurs at 12-16 hours.",
    halfLife: "The archival Exalgo label reports a mean terminal half-life of about 11 hours, with most individual values from 8-15 hours.",
    metabolism:
      "Extensive hepatic glucuronidation via UGT2B7 to hydromorphone-3-glucuronide (H3G). Excreted renally.",
    mechanism:
      "Potent full agonist at the mu-opioid receptor (MOR) with minimal clinically significant activity at KOR or DOR.",
    behavior:
      "Designed to provide stable, flat plasma concentrations over 24 hours. Indicated for opioid-tolerant patients requiring continuous analgesia; contraindicated for acute or breakthrough pain. Avoid crushing or chewing, which causes rapid, fatal dose-dumping.",
    interactions:
      "Minimal CYP-mediated drug interactions. Renal impairment increases H3G metabolite exposure, and hepatic impairment increases hydromorphone exposure. In the archival Exalgo label, alcohol changed exposure variably and increased peak concentration in some subjects. Concurrent CNS depressants pose severe respiratory-depression risk.",
    sources: [
      {
        title: "DailyMed Exalgo extended-release tablets (archival label)",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f26ababe-f6f0-443e-8d91-4d2a174675bc",
      },
    ],
  },
  {
    name: "Methadone oral",
    route: "Oral",
    profile: {
      type: "absorptive",
      peakHours: 4,
      peakRangeHours: [1, 7.5],
      halfLifeHours: 30,
      halfLifeRangeHours: [8, 59],
      scaleHours: 72,
    },
    timing: "Representative point only: the current tablet label reports peak plasma concentrations from 1-7.5 hours after oral dosing.",
    halfLife: "Representative point only: the current tablet label reports a highly variable terminal half-life of 8-59 hours.",
    metabolism:
      "Metabolized through multiple hepatic CYP450 pathways, primarily CYP3A4 and CYP2B6, and to a lesser extent CYP2D6, CYP2C19, and CYP2C9. Converted to inactive metabolites (EDDP and EMDP). Highly variable metabolism between patients. Excreted in feces and urine; renal clearance increases with urine acidification.",
    mechanism:
      "Methadone is a mu-opioid receptor agonist. The current label notes some evidence of NMDA-receptor antagonism, but states that its contribution to efficacy is unknown.",
    behavior:
      "Highly lipophilic with a very long, variable half-life. It acts as a short-acting analgesic (pain relief wears off in 4-8 hours) but has a long-acting presence in the body (remains in system for 24-36+ hours). This mismatch poses a high risk of dangerous accumulation and delayed respiratory depression during titration. Requires slow, careful dose adjustments.",
    interactions:
      "Methadone has complex, variable CYP-mediated interactions: inhibitors can increase exposure and inducers can decrease it, but direction and magnitude are drug-specific. It prolongs QT and carries added risk with other QT-prolonging drugs or CNS depressants. Hepatic impairment can reduce clearance.",
    sources: [
      {
        title: "DailyMed methadone hydrochloride tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eddf7077-02fb-4771-9823-31984f4ff2bb",
      },
    ],
  },
  {
    name: "Morphine IV",
    route: "IV",
    profile: { type: "absorptive", peakHours: 0.08, halfLifeHours: 2, scaleHours: 10 },
    timing:
      "Apparent rapid onset within 5-10 minutes after IV dosing; peak analgesic effects occur within 20 minutes.",
    halfLife:
      "Terminal half-life commonly ranges 1.5-2 hours. Apparent duration is short.",
    metabolism:
      "Primary clearance pathway is hepatic phase II glucuronidation, mainly via UGT2B7 (and UGT1A1). Converted to active metabolite morphine-6-glucuronide (M6G, highly potent analgesic) and inactive metabolite morphine-3-glucuronide (M3G, inactive for pain but neurotoxic). Primarily excreted renally.",
    mechanism:
      "Full agonist at the mu-opioid receptor (MOR) (primary driver of analgesia, respiratory depression, constipation); agonist at the kappa-opioid receptor (KOR) (spinal analgesia/dysphoria); weak activity at the delta-opioid receptor (DOR).",
    behavior:
      "Direct systemic delivery bypasses first-pass effect, producing high initial plasma concentrations followed by rapid tissue redistribution (brain to muscle/fat). Apparent volume of distribution ranges from 1.0-4.7 L/kg.",
    interactions:
      "Significant renal dysfunction leads to severe accumulation of active M6G and neurotoxic M3G, exponentially increasing sedation, respiratory depression, and neuroexcitatory effects (myoclonus, agitation). Unpredictable, severe reactions with MAO inhibitors (MAOIs). Increased risk of urinary retention and constipation with anticholinergics. Additive CNS/respiratory depression with benzodiazepines, alcohol, or other opioids.",
    sources: [
      {
        title: "DailyMed morphine sulfate injection",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=1f53de80-efc8-4930-b3e3-fba0d026af05&version=7",
      },
    ],
  },
  {
    name: "Morphine oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1, halfLifeHours: 2, scaleHours: 10 },
    timing:
      "Onset typically ~20-60 minutes; peak analgesic effect occurs at ~60-90 minutes. Short duration of about 3-4 hours.",
    halfLife:
      "Effective elimination half-life is about 2 hours, though terminal phase can be longer.",
    metabolism:
      "Low oral bioavailability (<40%) due to extensive first-pass hepatic metabolism. Conjugated by UGT2B7 to active morphine-6-glucuronide (M6G) and inactive, neurotoxic morphine-3-glucuronide (M3G). Renally excreted.",
    mechanism:
      "Full agonist at MOR (analgesia, sedation, constipation); agonist at KOR (dysphoria/spinal analgesia); weak DOR activity.",
    behavior:
      "Because this is immediate-release, it produces rapid absorption and quick onset, but requires dosing every 3 to 4 hours for sustained analgesia. Absorption is reliable; food may slightly delay peak concentration but does not change overall drug exposure.",
    interactions:
      "Renal dysfunction is a major clinical risk, leading to rapid accumulation of active M6G (toxicity, profound respiratory depression) and M3G. MAO inhibitors are contraindicated due to risk of severe hemodynamic instability. Anticholinergics worsen constipation/retention. Additive risks with concurrent CNS depressants (benzodiazepines, alcohol).",
    sources: [
      {
        title: "DailyMed morphine sulfate tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=67b3273e-af71-4dac-8e49-8bc134d4c591",
      },
    ],
  },
  {
    name: "Morphine oral (ER)",
    route: "Oral",
    profile: {
      available: false,
      type: "absorptive",
      peakHours: null,
      halfLifeHours: null,
      unavailableReason:
        "The current MS Contin label does not provide a representative peak suitable for this normalized graph.",
    },
    timing: "The current MS Contin label describes release as slower than immediate-release morphine, steady state at about one day, and q8h or q12h administration; it does not provide a representative peak suitable for this graph.",
    halfLife: "The current label describes an effective morphine half-life of 2-4 hours and a longer terminal phase of about 15 hours in some studies. The 8-12 hour dosing interval is not presented as a formulation half-life.",
    metabolism:
      "Extensive pre-systemic glucuronidation via UGT2B7 to active M6G and inactive M3G. Excreted primarily through the urine.",
    mechanism:
      "Full agonist at MOR (analgesia, sedation, constipation); agonist at KOR; weak DOR activity.",
    behavior:
      "Designed to provide slow, continuous release, producing stable plasma concentrations with reduced peak-trough fluctuations. Indicated for chronic pain; typical duration is 8-12 hours or longer. Dosing three times per day is sometimes required. Not appropriate for acute, breakthrough pain.",
    interactions:
      "Renal impairment leads to highly dangerous accumulation of active M6G and inactive M3G (neurotoxicity). Avoid MAOIs due to severe, unpredictable interactions. Worsened anticholinergic effects. Extreme risk of respiratory depression and death when combined with concurrent CNS depressants like benzodiazepines or alcohol.",
    sources: [
      {
        title: "DailyMed MS Contin tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c354b3bf-86c0-4bb8-8b1f-be2164942698",
      },
    ],
  },
  {
    name: "Oxycodone oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.5, halfLifeHours: 3.7, scaleHours: 16 },
    timing:
      "Rapid absorption; onset typically ~10-30 minutes, peak effect occurs at ~1-2 hours. Duration is ~3-6 hours.",
    halfLife: "Apparent elimination half-life is about 3.5-4 hours.",
    metabolism:
      "Metabolized primarily in the liver via the CYP450 system: CYP3A4 converts oxycodone to noroxycodone (weak activity), and CYP2D6 converts a small amount to oxymorphone (highly potent active metabolite). The parent drug contributes most of the clinical effect. Excreted renally.",
    mechanism:
      "Primarily a full agonist at the mu-opioid receptor (MOR) (mediates analgesia, euphoria, respiratory depression); weak activity at KOR; minimal clinically relevant DOR activity.",
    behavior:
      "High oral bioavailability (60-87%). IR formulation produces a faster rise in plasma concentration and a stronger perceived analgesic 'kick' compared to ER. Absorption is reliable; food may slightly delay peak but does not affect overall exposure.",
    interactions:
      "Strong CYP3A4 inhibitors (clarithromycin, ketoconazole, ritonavir, grapefruit juice) block clearance, significantly increasing oxycodone levels and respiratory depression risks. Strong CYP3A4 inducers (rifampin, carbamazepine, phenytoin) decrease levels, reducing analgesia. CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion) reduce conversion to oxymorphone, though clinical impact is variable. Caution in hepatic impairment. Additive CNS depression with benzodiazepines, alcohol, or other sedatives.",
    sources: [
      {
        title: "DailyMed oxycodone hydrochloride tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=92614a3a-331d-16ad-e053-2a95a90a47cc",
      },
    ],
  },
  {
    name: "Oxycodone oral (ER)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 5, halfLifeHours: 8, scaleHours: 24 },
    timing: "Delayed onset with slow continuous absorption; peak plasma concentrations occur around 4-6 hours.",
    halfLife: "Effective elimination half-life is prolonged, typically averaging 8-12 hours depending on formulation.",
    metabolism:
      "Metabolized primarily in the liver by CYP3A4 (noroxycodone) and CYP2D6 (oxymorphone). Parent drug mediates most effect. Excreted renally.",
    mechanism:
      "Primarily a full agonist at the mu-opioid receptor (MOR); weak activity at KOR; minimal clinically relevant DOR activity.",
    behavior:
      "Provides flat peak-trough profiles, improving baseline analgesia and reducing dosing frequency (typically dosed every 12 hours). Takes time to reach steady-state levels (18-24 hours). Indicated for chronic pain; not appropriate for acute breakthrough pain due to delayed onset.",
    interactions:
      "CYP3A4 inhibitors (clarithromycin, ketoconazole, ritonavir) can cause highly dangerous, delayed increases in drug levels and respiratory depression. CYP3A4 inducers reduce efficacy. CYP2D6 inhibitors reduce oxymorphone formation. Extreme caution in hepatic impairment. Concomitant use with alcohol or CNS depressants (benzodiazepines) carries a high risk of profound sedation, coma, and death.",
    sources: [
      {
        title: "DailyMed OxyContin tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=bfdfe235-d717-4855-a3c8-a13d26dadede",
      },
    ],
  },
  {
    name: "Tapentadol oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 1.25, halfLifeHours: 4, scaleHours: 16 },
    timing:
      "Rapid absorption; onset is relatively rapid (~30-60 minutes). Peak effect occurs around ~1.5-3 hours. Duration is ~4-6 hours.",
    halfLife: "Terminal elimination half-life averages about 4 hours.",
    metabolism:
      "Undergoes limited phase II hepatic metabolism, primarily via glucuronidation (UGT enzymes, mainly UGT1A9 and UGT2B7). Minimal CYP450 involvement. No active metabolites contribute to analgesia. Excreted primarily renally as inactive conjugates.",
    mechanism:
      "Dual mechanism of action: Mu-opioid receptor (MOR) agonist providing opioid-mediated analgesia, and Norepinephrine Reuptake Inhibitor (NRI) enhancing descending inhibitory pain pathways in the spinal cord. Compared to classic opioids, has less reliance on active metabolites and more contribution from non-opioid pain pathways.",
    behavior:
      "Taken orally, it provides predictable drug levels across patients due to non-CYP metabolism. Dosing is typically every 4 to 6 hours. Has fewer serotonergic side effects than tramadol, but still provides effective monoaminergic pain modulation.",
    interactions:
      "Avoid or use extreme caution with MAO inhibitors (MAOIs) due to risk of severe serotonergic/noradrenergic hypertensive or CNS crises. Caution with other norepinephrine-enhancing drugs (SNRIs, TCAs, stimulants) due to risk of hypertension and tachycardia. Fewer CYP-mediated drug interactions. Renal impairment raises inactive metabolite levels. Additive CNS/respiratory depression with benzodiazepines, alcohol, or other opioids.",
    sources: [
      {
        title: "DailyMed Nucynta tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7997e6da-7e98-4520-9d1b-0b8341bac64a",
      },
    ],
  },
  {
    name: "Tapentadol oral (ER)",
    route: "Oral",
    profile: {
      type: "absorptive",
      peakHours: 5,
      peakRangeHours: [3, 6],
      halfLifeHours: 5,
      halfLifeRangeHours: [5, 5],
      scaleHours: 24,
    },
    timing: "Slow release; peak plasma concentrations occur about 3-6 hours after administration.",
    halfLife: "Terminal elimination half-life averages about 5 hours, with dosing recommended every 12 hours.",
    metabolism:
      "Primarily metabolized via phase II glucuronidation (UGT1A9, UGT2B7) into inactive conjugates, with minimal CYP450 involvement. Excreted renally.",
    mechanism:
      "Dual mechanism: Mu-opioid receptor (MOR) agonist & Norepinephrine Reuptake Inhibitor (NRI).",
    behavior:
      "Provides smooth, continuous analgesia over 12 hours with reduced peak-trough fluctuations. Indicated for chronic pain, including neuropathic pain associated with diabetic peripheral neuropathy (DPN).",
    interactions:
      "Identical to IR: Contraindicated with MAOIs (hypertensive/serotonergic risk). Caution with SNRIs, TCAs, and stimulants. Low CYP-mediated interaction potential. Additive CNS depression with alcohol, benzodiazepines, or other opioids. Avoid crushing or chewing.",
    sources: [
      {
        title: "DailyMed Nucynta ER tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c3d04d70-0155-4147-9ce4-a3b1fad4b373",
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
      "Elimination half-life is about 6 hours regardless of route; active O-desmethyltramadol (M1) metabolite half-life is about 7.9 hours.",
    metabolism:
      "Metabolized in the liver: CYP2D6 converts tramadol to O-desmethyltramadol (M1, significantly more potent mu-opioid agonist than parent), and CYP3A4/CYP2B6 convert it to N-desmethyltramadol (M2, inactive/weak). Phase II metabolism via glucuronidation and sulfation. Primarily excreted renally.",
    mechanism:
      "Combined dual mechanism: Parent drug is a weak partial agonist at MOR, while the M1 metabolite is a much stronger MOR agonist; both parent and metabolite inhibit serotonin and norepinephrine reuptake, activating descending inhibitory pathways.",
    behavior:
      "Avoids first-pass metabolism for the parent drug, producing higher initial plasma concentrations which can increase early adverse effects (nausea, dizziness). However, formation of active M1 still depends on hepatic CYP2D6. Response varies heavily based on CYP2D6 phenotype: poor metabolizers experience little relief; ultra-rapid metabolizers face high toxicity risks.",
    interactions:
      "Serotonergic drugs (SSRIs, SNRIs, MAOIs, TCAs, triptans, linezolid) increase risk of life-threatening serotonin syndrome. CYP2D6 inhibitors (e.g., fluoxetine, paroxetine, bupropion) prevent active M1 formation, reducing analgesia. Strong CYP3A4 inhibitors/inducers alter pathways. Seizure risk is dose-dependent and increased with antipsychotics, TCAs, SSRIs, or alcohol withdrawal. Additive CNS depression with benzodiazepines, alcohol, or other opioids.",
    sources: [
      {
        title: "eMC tramadol injection SmPC",
        url: "https://www.medicines.org.uk/emc/product/13177/smpc",
      },
    ],
  },
  {
    name: "Tramadol oral (IR)",
    route: "Oral",
    profile: { type: "absorptive", peakHours: 2, halfLifeHours: 6.3, scaleHours: 24 },
    timing:
      "Mean oral bioavailability is about 75%; peak tramadol and M1 concentrations occur at about 2 and 3 hours.",
    halfLife:
      "Mean terminal half-lives are 6.3 +/- 1.4 hours for racemic tramadol and 7.4 +/- 1.4 hours for M1.",
    metabolism:
      "CYP2D6 and CYP3A4 metabolism plus conjugation; active M1 formation is CYP2D6 dependent; metabolites are primarily renally eliminated.",
    mechanism:
      "Dual mechanism: Weak MOR partial agonism (parent drug) & stronger MOR agonism (M1 metabolite), combined with serotonin and norepinephrine reuptake inhibition.",
    behavior:
      "Highly dependent on hepatic CYP2D6 status for clinical effect. Dosed every 4 to 6 hours for immediate release.",
    interactions:
      "Serotonin syndrome risk with serotonergic drugs (SSRIs, SNRIs, MAOIs). CYP2D6 inhibitors block analgesic conversion. CYP3A4 modulators alter exposure. Elevated seizure risk with TCAs, SSRIs, antipsychotics. Concurrent CNS depressants (benzodiazepines, alcohol) increase overdose risk.",
    sources: [
      {
        title: "DailyMed tramadol hydrochloride tablets",
        url:
          "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=58b802cb-2443-4f5b-9718-7d54c6d50cb4",
      },
    ],
  },
  {
    name: "Tramadol oral (ER)",
    route: "Oral",
    profile: {
      type: "absorptive",
      peakHours: 12,
      peakRangeHours: [12, 12],
      secondaryPeak: { name: "M1", hours: 15 },
      halfLifeHours: 7.9,
      halfLifeRangeHours: [7.9, 7.9],
      secondaryHalfLife: { name: "M1", hours: 8.8 },
      scaleHours: 36,
    },
    timing: "Slow release; peak concentrations occur at about 12 hours for tramadol and 15 hours for the active M1 metabolite.",
    halfLife: "Terminal elimination half-life averages about 7.9 hours for tramadol and 8.8 hours for M1, allowing for once-daily dosing.",
    metabolism:
      "Extensive pre-systemic metabolism. CYP2D6 forms the potent active M1 metabolite; CYP3A4 forms inactive M2. Excreted renally.",
    mechanism:
      "Dual mechanism: MOR agonism (M1) and monoaminergic reuptake inhibition (5-HT & NE).",
    behavior:
      "Provides stable, continuous drug exposure over 24 hours, reducing peak-trough fluctuations. Indicated for chronic pain requiring long-term treatment. Crushing or chewing the tablet destroys the release mechanism and can cause fatal dose-dumping.",
    interactions:
      "Same as IR: high risk of serotonin syndrome with SSRIs/SNRIs/MAOIs; CYP2D6 inhibitors block active M1 conversion; increased seizure risk. Avoid alcohol (dose-dumping hazard). High hazard with concurrent CNS depressants like benzodiazepines.",
    sources: [
      {
        title: "DailyMed Ultram ER tablets",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2fd193e2-7aa7-4119-b540-7e28e82fbd13",
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

const renalRestrictedMedications = new Set(
  calculatorCore.RENAL_POLICY.medicationGroups.restricted,
);
const renalModerateAlternativeMedications = new Set(
  calculatorCore.RENAL_POLICY.medicationGroups.cautiousAlternative,
);
const renalMinimalAlternativeMedications = new Set(
  calculatorCore.RENAL_POLICY.medicationGroups.lowerKidneyEffectAlternative,
);

const clinicalDataSlug = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

conversionOptions.forEach((item) => {
  item.provenanceRuleId = `conversion.${item.id}`;
});
benzoConversionOptions.forEach((item) => {
  item.provenanceRuleId = `benzodiazepine.${item.id}`;
});
const methadoneBandIds = [
  "0-30",
  "31-99",
  "100-299",
  "300-499",
  "500-999",
  "1000-plus",
];
methadoneRatioTable.forEach((item, index) => {
  item.provenanceRuleId = `methadone.band.${methadoneBandIds[index]}`;
});
hepaticGuidanceRows.forEach((item) => {
  item.provenanceRuleIds = Object.fromEntries(
    ["mild", "moderate", "severe"].map((severity) => [
      severity,
      `hepatic.${item.medication.toLowerCase()}.${severity}`,
    ]),
  );
});
buprenorphineSchedules.forEach((item) => {
  item.provenanceRuleId = `buprenorphine.schedule.${item.id}`;
  item.days.forEach((day, index) => {
    day.provenanceRuleId = `${item.provenanceRuleId}.day-${index + 1}`;
  });
});
pharmacokineticsRows.forEach((item) => {
  const prefix = `pk.${clinicalDataSlug(item.name)}`;
  item.provenanceRuleIds = Object.fromEntries(
    [
      "profile",
      "timing",
      "half-life",
      "metabolism",
      "mechanism",
      "behavior",
      "interactions",
    ].map((claimType) => [claimType, `${prefix}.${claimType}`]),
  );
});

const validateClinicalDataCoverage = () => {
  const requiredRuleIds = [
    ...conversionOptions.map((item) => item.provenanceRuleId),
    ...benzoConversionOptions.map((item) => item.provenanceRuleId),
    ...methadoneRatioTable.map((item) => item.provenanceRuleId),
    ...hepaticGuidanceRows.flatMap((item) => Object.values(item.provenanceRuleIds)),
    ...buprenorphineSchedules.flatMap((item) => [
      item.provenanceRuleId,
      ...item.days.map((day) => day.provenanceRuleId),
    ]),
    ...pharmacokineticsRows.flatMap((item) => Object.values(item.provenanceRuleIds)),
  ];
  const missingRules = requiredRuleIds.filter(
    (ruleId) => !calculatorProvenance.rules[ruleId],
  );
  const missingPkSources = pharmacokineticsRows.filter(
    (item) =>
      !Array.isArray(item.sources) ||
      !item.sources.length ||
      item.sources.some((source) => !source.title || !/^https:\/\//.test(source.url)),
  );
  const invalidRuleSources = Object.values(calculatorProvenance.rules).flatMap((rule) =>
    rule.sourceRefs
      .filter(
        ({ sourceId }) =>
          !sourceId.startsWith("embedded-pk-source:") &&
          !calculatorProvenance.sources[sourceId],
      )
      .map(({ sourceId }) => `${rule.id}:${sourceId}`),
  );

  if (missingRules.length || missingPkSources.length || invalidRuleSources.length) {
    throw new Error(
      `Clinical-data provenance coverage failed: ${[
        ...missingRules,
        ...missingPkSources.map((item) => `pk-source:${item.name}`),
        ...invalidRuleSources,
      ].join(", ")}`,
    );
  }
};

validateClinicalDataCoverage();

let regimenEntryId = 0;
let regimenEntriesState = [];
let selectedPharmacokineticsIndex = 0;
let pharmacokineticsReturnFocus = null;

const calculatorTabButtons = document.querySelectorAll("[data-calculator-tab]");
const calculatorTabs = Array.from(calculatorTabButtons);
const themeToggle = document.querySelector("#themeToggle");
const themeToggleLabel = document.querySelector("#themeToggleLabel");
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

const mainResultPanel = document.querySelector("#mainResultPanel");
const resultTitle = document.querySelector("#resultTitle");
const finalDose = document.querySelector("#finalDose");
const finalUnit = document.querySelector("#finalUnit");
const resultQualifier = document.querySelector("#resultQualifier");
const conversionResultStatus = document.querySelector("#conversionResultStatus");
const methadoneConservativeMme = document.querySelector("#methadoneConservativeMme");
const methadoneConservativeMmeDose = document.querySelector(
  "#methadoneConservativeMmeDose",
);
const targetStepLabel = document.querySelector("#targetStepLabel");
const rawTargetDoseOutput = document.querySelector("#rawTargetDose");
const reductionStep = document.querySelector("#reductionStep");
const reductionAppliedOutput = document.querySelector("#reductionApplied");
const safetyAdjustedStep = document.querySelector("#safetyAdjustedStep");
const safetyAdjustedDoseOutput = document.querySelector("#safetyAdjustedDose");
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
const methadoneDoseHint = document.querySelector("#methadoneDoseHint");
const methadoneRouteSelect = document.querySelector("#methadoneRoute");
const methadoneReductionRange = document.querySelector("#methadoneReductionRange");
const methadoneReductionNumber = document.querySelector("#methadoneReductionNumber");
const methadoneResultTitle = document.querySelector("#methadoneResultTitle");
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
const methadoneResultStatus = document.querySelector("#methadoneResultStatus");

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
const buprenorphineResultStatus = document.querySelector("#buprenorphineResultStatus");

const benzoForm = document.querySelector("#benzoForm");
const benzoSourceDrugSelect = document.querySelector("#benzoSourceDrug");
const benzoSourceDoseInput = document.querySelector("#benzoSourceDose");
const benzoDoseValidation = document.querySelector("#benzoDoseValidation");
const benzoTargetDrugSelect = document.querySelector("#benzoTargetDrug");
const benzoReductionRange = document.querySelector("#benzoReductionRange");
const benzoReductionNumber = document.querySelector("#benzoReductionNumber");
const benzoResultTitle = document.querySelector("#benzoResultTitle");
const benzoFinalDose = document.querySelector("#benzoFinalDose");
const benzoFinalUnit = document.querySelector("#benzoFinalUnit");
const benzoRawDiazepamEquiv = document.querySelector("#benzoRawDiazepamEquiv");
const benzoReducedDiazepamEquiv = document.querySelector("#benzoReducedDiazepamEquiv");
const benzoReductionApplied = document.querySelector("#benzoReductionApplied");
const benzoResultStatus = document.querySelector("#benzoResultStatus");
const pharmacokineticsSelectionStatus = document.querySelector(
  "#pharmacokineticsSelectionStatus",
);

const THEME_STORAGE_KEY = "opioid-conversion-theme";

const setTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalizedTheme;

  if (themeToggle) {
    const darkModeActive = normalizedTheme === "dark";
    themeToggle.setAttribute("aria-pressed", String(darkModeActive));
    themeToggle.setAttribute(
      "aria-label",
      darkModeActive ? "Theme: Dark" : "Theme: Light"
    );
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

const isModalVisible = (modalElement) =>
  Boolean(
    modalElement &&
      !modalElement.hidden &&
      !modalElement.classList.contains("is-hidden"),
  );

const modalBackgroundRoots = Array.from(document.body.children).filter(
  (element) =>
    element !== pharmacokineticsModal &&
    !["SCRIPT", "STYLE"].includes(element.tagName),
);

const getModalFocusableElements = () =>
  Array.from(
    pharmacokineticsModal?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    ) || [],
  ).filter((element) => {
    const closedDetails = element.closest("details:not([open])");
    const visibleInsideClosedDetails =
      closedDetails?.querySelector(":scope > summary")?.contains(element);

    return (
      !element.hidden &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0 &&
      (!closedDetails || visibleInsideClosedDetails)
    );
  });

const updateModalOpenState = () => {
  document.body.classList.toggle("modal-open", isModalVisible(pharmacokineticsModal));
};

const setPharmacokineticsModalVisible = (visible) => {
  if (!pharmacokineticsModal) {
    return;
  }

  if (visible) {
    pharmacokineticsReturnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : pharmacokineticsOpenButton;
    pharmacokineticsModal.hidden = false;
    pharmacokineticsModal.classList.remove("is-hidden");
    modalBackgroundRoots.forEach((element) => {
      element.inert = true;
    });
  } else {
    pharmacokineticsModal.classList.add("is-hidden");
    pharmacokineticsModal.hidden = true;
    modalBackgroundRoots.forEach((element) => {
      element.inert = false;
    });
  }

  pharmacokineticsOpenButton?.setAttribute("aria-expanded", String(visible));
  updateModalOpenState();

  if (visible && pharmacokineticsCloseButton) {
    window.setTimeout(() => pharmacokineticsCloseButton.focus(), 0);
  } else if (!visible) {
    const focusTarget =
      pharmacokineticsReturnFocus?.isConnected
        ? pharmacokineticsReturnFocus
        : pharmacokineticsOpenButton;
    pharmacokineticsReturnFocus = null;
    window.setTimeout(() => focusTarget?.focus(), 0);
  }
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

const { formatDose, formatDoseRange } = calculatorCore;

const formatDoseWithUnit = (value, unitLabel) => `${formatDose(value)} ${unitLabel}`;

const setLiveStatus = (element, message) => {
  if (element && element.textContent !== message) {
    element.textContent = message;
  }
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
  if (item.route === "Oral (IR)") return `${item.medication} PO (IR)`;
  if (item.route === "Oral (ER)") return `${item.medication} PO (ER)`;
  if (item.route === "Oral") return `${item.medication} PO`;
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

const clampReduction = (value) => calculatorCore.clampWholePercent(value, 100);
const clampMethadoneReduction = (value) =>
  calculatorCore.clampWholePercent(value, 90);

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

const isOralMethadoneOnlyRegimen = (parsedEntries) =>
  parsedEntries.length > 0 &&
  parsedEntries.every((entry) => entry.valid && entry.option?.id === "Methadone_Oral");

const getConservativeOralMethadoneMme = (parsedEntries) =>
  calculatorCore.calculateConservativeOralMethadoneMme({
    entries: parsedEntries,
    factor: METHADONE_CONSERVATIVE_ORAL_MORPHINE_FACTOR,
  });

const getRegimenEntryCalculation = (entry) => {
  const option = findOption(entry.drugId);
  return calculatorCore.calculateRegimenEntry({
    option,
    dose: entry.dose,
    dosesPerDay: entry.dosesPerDay,
  });
};

const parseRegimenEntries = () =>
  regimenEntriesState.map((entry) => ({
    ...entry,
    ...getRegimenEntryCalculation(entry),
  }));

const getEntrySummaryText = (entry) => {
  const calculation = getRegimenEntryCalculation(entry);
  const { option } = calculation;

  if (!option) {
    return "Select a drug and route for this drug.";
  }

  if (!calculation.inputsValid) {
    if (calculation.patchOption) {
      return "Enter the number of active patches in 0.5-patch increments.";
    }

    return calculation.frequencyInputValid
      ? "Enter a valid dose per administration."
      : "Enter a valid dose and a whole number of doses per day.";
  }

  if (!calculation.calculationFinite) {
    return "Entered values exceed the supported calculation range.";
  }

  const {
    patchOption,
    doseValue,
    frequencyValue,
    dailyDose,
    oralMorphineEquivalent,
  } = calculation;

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
  const calculation = getRegimenEntryCalculation(entry);
  const calculationOutOfRange =
    calculation.inputsValid && !calculation.calculationFinite;
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
            aria-describedby="entry-summary-${entry.key}"
            aria-invalid="${!calculation.doseInputValid || calculationOutOfRange}"
            data-field="dose"
            inputmode="decimal"
            min="0"
            required
            step="${patchOption ? "0.5" : "any"}"
            type="number"
            value="${doseValue}"
          />
          <span class="field-hint">${getEntryDoseHint(option)}</span>
        </label>

        <label>
          ${getEntryFrequencyLabel(option)}
          <input
            aria-describedby="entry-summary-${entry.key}"
            aria-invalid="${!calculation.frequencyInputValid || calculationOutOfRange}"
            data-field="dosesPerDay"
            inputmode="decimal"
            min="0"
            required
            step="1"
            type="number"
            value="${frequencyValue}"
            ${patchOption ? "disabled" : ""}
          />
          <span class="field-hint">${getEntryFrequencyHint(option)}</span>
        </label>
      </div>

      <p class="entry-summary" id="entry-summary-${entry.key}">${getEntrySummaryText(entry)}</p>
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

const renderRegimenEntries = ({ focusKey = null, focusField = null } = {}) => {
  regimenEntriesContainer.innerHTML = regimenEntriesState
    .map((entry, index) => buildRegimenEntryMarkup(entry, index))
    .join("");

  regimenEntriesContainer
    .querySelectorAll('[data-field="drugId"]')
    .forEach((selectElement, index) => {
      selectElement.value = regimenEntriesState[index].drugId;
    });

  renderTargetOptions();

  if (focusKey !== null && focusField) {
    window.setTimeout(() => {
      regimenEntriesContainer
        .querySelector(
          `.regimen-entry[data-entry-key="${focusKey}"] [data-field="${focusField}"]`,
        )
        ?.focus();
    }, 0);
  }
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
      return `
        <tr>
          <td>${item.title}</td>
          <td>${item.note}</td>
          <td><a href="${item.url}" rel="noreferrer" target="_blank">Open source</a></td>
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

const formatGraphRange = (range, fallback) => {
  if (!Array.isArray(range) || range.length !== 2) {
    return formatGraphTime(fallback);
  }

  return range[0] === range[1]
    ? formatGraphTime(range[0])
    : `${formatGraphTime(range[0])}-${formatGraphTime(range[1])}`;
};

const getPharmacokineticsTimingText = (item) => {
  if (item.profile.available === false) {
    return `Numeric profile not plotted. ${item.timing}`;
  }

  const label =
    item.profile.type === "patch" ? "Representative steady/peak" : "Representative graph peak";
  const secondary = item.profile.secondaryPeak
    ? ` Secondary ${item.profile.secondaryPeak.name} peak: ${formatGraphTime(
        item.profile.secondaryPeak.hours,
      )}.`
    : "";

  return `${label}: ${formatGraphRange(
    item.profile.peakRangeHours,
    item.profile.peakHours,
  )}.${secondary} ${item.timing}`;
};

const getPharmacokineticsHalfLifeText = (item) => {
  if (item.profile.available === false) {
    return item.halfLife;
  }

  const secondary = item.profile.secondaryHalfLife
    ? ` Secondary ${item.profile.secondaryHalfLife.name} half-life: ${formatGraphTime(
        item.profile.secondaryHalfLife.hours,
      )}.`
    : "";

  return `Representative graph half-life: ${formatGraphRange(
    item.profile.halfLifeRangeHours,
    item.profile.halfLifeHours,
  )}.${secondary} ${item.halfLife}`;
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
      const profileAvailable = profile.available !== false;
      const peakLabel =
        !profileAvailable
          ? "Numeric profile not plotted"
          : profile.type === "patch"
          ? `Steady/peak: ~${formatGraphTime(profile.peakHours)}`
          : `Peak: ~${formatGraphTime(profile.peakHours)}`;
      const offsetLabel =
        !profileAvailable
          ? profile.unavailableReason
          : profile.type === "patch"
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
          ${
            profileAvailable
              ? buildPharmacokineticsGraphSvg(profile)
              : '<div class="pk-profile-unavailable" aria-hidden="true">Graph unavailable</div>'
          }
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
      <span class="pk-selected-route">${selectedItem.route}</span>
      <p>
        Route behavior and monitoring details are shown here by default so the
        selected chart and clinical notes stay together.
      </p>
    </div>
    <dl class="pk-selected-detail-grid">
      <div>
        <dt>Timing</dt>
        <dd>${getPharmacokineticsTimingText(selectedItem)}</dd>
      </div>
      <div>
        <dt>Half-life / offset</dt>
        <dd>${getPharmacokineticsHalfLifeText(selectedItem)}</dd>
      </div>
      <div>
        <dt>Metabolism / elimination</dt>
        <dd>${selectedItem.metabolism}</dd>
      </div>
      <div>
        <dt>Mechanism of action</dt>
        <dd>${selectedItem.mechanism}</dd>
      </div>
      <div>
        <dt>Route behavior</dt>
        <dd>${selectedItem.behavior}</dd>
      </div>
      <div>
        <dt>Monitoring considerations</dt>
        <dd>${selectedItem.interactions}</dd>
      </div>
      <div>
        <dt>Source</dt>
        <dd class="source-link-stack">${getPharmacokineticsSourceMarkup(selectedItem)}</dd>
      </div>
    </dl>
  `;
  setLiveStatus(
    pharmacokineticsSelectionStatus,
    `Selected pharmacokinetics profile: ${selectedItem.name}, ${selectedItem.route}.`,
  );
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
          <td>${getPharmacokineticsTimingText(item)}</td>
          <td>${getPharmacokineticsHalfLifeText(item)}</td>
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

const updatePharmacokineticsSelection = () => {
  pharmacokineticsGraphGrid
    ?.querySelectorAll("[data-pk-index]")
    .forEach((card) => {
      const selected = Number(card.dataset.pkIndex) === selectedPharmacokineticsIndex;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
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
  setLiveStatus(
    buprenorphineResultStatus,
    `Buprenorphine transition schedule: ${schedule.title}; ${schedule.product}.`,
  );
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
    activeMode === "methadone" || activeMode === "buprenorphine" || activeMode === "benzo";

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

const getEgfrBand = calculatorCore.getEgfrBand;

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
      "Enter eGFR to apply the renal guidance bands.";
    return;
  }

  if (band.id === "over50") {
    renalBandNote.textContent =
      "eGFR above 50 mL/min: no automatic renal reduction is applied.";
    return;
  }

  if (band.id === "30to50") {
    renalBandNote.textContent =
      "eGFR 30-50 mL/min: this calculator applies a 25% reduction for uncontrolled pain or a 50% reduction for well controlled pain to morphine, codeine, and meperidine.";
    return;
  }

  renalBandNote.textContent =
    "eGFR below 30 mL/min: the renal guidance marks morphine, codeine, and meperidine as avoid and highlights alternative opioid groups.";
};

const renderRegimenSummaryTable = (parsedEntries) => {
  regimenSummaryTable.innerHTML = parsedEntries
    .map((entry) => {
      const option = entry.option;

      if (!option) {
        return `
          <tr>
            <td>Reference unavailable</td>
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
      const invalidEntryText =
        entry.inputsValid && !entry.calculationFinite
          ? "Outside supported range"
          : "Incomplete entry";
      const dailyDoseText = entry.valid
        ? patchOption
          ? `${formatDose(entry.doseValue)} active patch${entry.doseValue === 1 ? "" : "es"}`
          : `${formatDose(entry.dailyDose)} ${option.doseUnit}/day`
        : invalidEntryText;
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
        : invalidEntryText;

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
      body: "Enter eGFR to turn on the renal adjustment guidance.",
      resultLabel: "Not applied",
    };
  }

  if (band.id === "over50") {
    return {
      summary: "Renal: eGFR >50 mL/min",
      title: "eGFR >50 mL/min",
      body:
        "No automatic renal dose reduction is applied above 50 mL/min." +
        currentNote,
      resultLabel: "No renal reduction",
    };
  }

  if (band.id === "30to50") {
    const reductionPercentage =
      calculatorCore.getRenalReductionPercentage(painControlValue);
    const reductionLabel =
      painControlValue === "controlled"
        ? "50% reduction for well controlled pain"
        : "25% reduction for uncontrolled pain";

    if (!isMMeMode && targetOption) {
      if (renalRestrictedMedications.has(targetOption.medication)) {
        const renalAdjustedDose = calculatorCore.calculateIndependentDoseRange({
          baseDose: adjustedTargetDose,
          minimumReduction: reductionPercentage,
          maximumReduction: reductionPercentage,
        }).minimumDose;

        return {
          summary: `Renal: ${band.label}; ${reductionLabel}`,
          title: `${targetOption.label} is in the renal-restriction group`,
          body:
            `${reductionLabel} is applied here for morphine, codeine, and meperidine when eGFR is 30-50 mL/min. ` +
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
            "No explicit percentage reduction is auto-applied for oxycodone or hydromorphone. Use lower starting doses and cautious titration in renal dysfunction." +
            currentNote,
          resultLabel: "Use caution",
        };
      }

      if (renalMinimalAlternativeMedications.has(targetOption.medication)) {
        return {
          summary: `Renal: ${band.label}; minimal-kidney-effect alternative`,
          title: `${targetOption.label} is a lower-kidney-effect alternative`,
          body:
            "Methadone, fentanyl, and buprenorphine are listed here as lower-kidney-effect alternatives. No automatic percentage reduction is applied, but monitoring and formulation review remain necessary." +
            currentNote,
          resultLabel: "Preferred class",
        };
      }
    }

    return {
      summary: `Renal: ${band.label}; ${reductionLabel}`,
      title: "Renal guidance for eGFR 30-50 mL/min",
      body:
        `This calculator applies ${reductionLabel} to morphine, codeine, and meperidine in the 30-50 mL/min band.` +
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
          "The renal guidance marks morphine, codeine, and meperidine as avoid below 30 mL/min. Suggested alternatives: oxycodone or hydromorphone with caution, or methadone, fentanyl, or buprenorphine with specialist review and monitoring." +
          currentNote,
        resultLabel: "Avoid selected target agent",
        avoidTarget: true,
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
            "Methadone, fentanyl, and buprenorphine are highlighted here as lower-kidney-effect alternatives. No automatic percentage reduction is added, but specialist review and close monitoring remain important." +
          currentNote,
        resultLabel: "Preferred class",
      };
    }
  }

  return {
    summary: "Renal: eGFR <30 mL/min; avoid morphine, codeine, and meperidine",
    title: "Renal guidance for eGFR <30 mL/min",
    body:
      "The renal guidance marks morphine, codeine, and meperidine as avoid below 30 mL/min. Suggested alternatives: oxycodone or hydromorphone with caution, or methadone, fentanyl, or buprenorphine with specialist review and monitoring." +
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
        "Select mild, moderate, or severe hepatic impairment to show liver dosing guidance for the target opioid.",
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
        ? `${sourcePrefix}. Review the hepatic table below for ${formatList(
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
          `${sourcePrefix}. No percentage reduction is provided here for codeine. Because codeine relies on hepatic conversion to morphine, use caution and consider avoidance in significant liver dysfunction.`,
        resultLabel: "Use extra caution",
      };
    }

    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment); no target-specific percentage guidance`,
      title: `No hepatic percentage guidance for ${targetOption.label}`,
      body:
        `${sourcePrefix}. This calculator does not apply a medication-specific hepatic percentage rule to the selected target. Use bedside assessment and the reference sources below.`,
      resultLabel: "Guidance only",
    };
  }

  const rule = guidanceRow[severity];

  if (rule.avoid) {
    return {
      summary: `Hepatic: ${severityLabel} (clinical judgment); avoid ${targetOption.medication}`,
      title: `${severityLabel} hepatic impairment: avoid ${targetOption.label}`,
      body: `${sourcePrefix}. The hepatic guide marks ${targetOption.label} as avoid in ${severityLabel.toLowerCase()} hepatic impairment.`,
      resultLabel: "Avoid target",
      avoidTarget: true,
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

  const { minimumDose, maximumDose } = calculatorCore.calculateIndependentDoseRange({
    baseDose: adjustedTargetDose,
    minimumReduction: rule.minReduction,
    maximumReduction: rule.maxReduction,
  });
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

const showInvalidRegimen = (parsedEntries, title = "Enter a valid regimen") => {
  const calculationOutOfRange = title === "Result exceeds supported range";
  const unavailableReason = calculationOutOfRange
    ? "Reduce the entered values before calculating"
    : "Complete the regimen before conversion";
  renderRegimenSummaryTable(parsedEntries);
  finalDose.textContent = "—";
  finalUnit.textContent = "";
  methadoneConservativeMme.classList.add("is-hidden");
  mainResultPanel.classList.remove("is-avoid-result");
  resultTitle.textContent = title;
  resultQualifier.textContent = "No dose has been calculated.";
  targetStepLabel.textContent = "Target calculation";
  rawTargetDoseOutput.textContent = "Not available";
  reductionAppliedOutput.textContent = "Not applied";
  safetyAdjustedDoseOutput.textContent = "Not available";
  setHiddenState(safetyAdjustedStep, false);
  renalAdjustedDoseOutput.textContent = "Not applied";
  hepaticAdjustedDoseOutput.textContent = "Not applied";
  organGuidanceSummaryOutput.textContent = unavailableReason;
  renalAdviceTitle.textContent = calculationOutOfRange
    ? "Result unavailable"
    : "Regimen incomplete";
  renalAdviceBody.textContent = calculationOutOfRange
    ? "Renal advice is unavailable while the calculation is outside the supported numeric range."
    : "Renal advice appears after the regimen entries are complete.";
  hepaticAdviceTitle.textContent = calculationOutOfRange
    ? "Result unavailable"
    : "Regimen incomplete";
  hepaticAdviceBody.textContent = calculationOutOfRange
    ? "Hepatic advice is unavailable while the calculation is outside the supported numeric range."
    : "Hepatic advice appears after the regimen entries are complete.";
  setLiveStatus(conversionResultStatus, `${title}. No dose is available.`);
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
    const calculationOutOfRange = parsedEntries.some(
      (entry) => entry.inputsValid && !entry.calculationFinite,
    );
    showInvalidRegimen(
      parsedEntries,
      calculationOutOfRange
        ? "Result exceeds supported range"
        : "Enter a valid regimen",
    );
    return;
  }

  const regimenTotal =
    calculatorCore.sumRegimenOralMorphineEquivalent(parsedEntries);
  const oralMorphineEquivalent = regimenTotal.total;

  if (!regimenTotal.valid) {
    showInvalidRegimen(parsedEntries, "Result exceeds supported range");
    return;
  }

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
    mainResultPanel.classList.remove("is-avoid-result");
    finalDose.textContent = formatDose(oralMorphineEquivalent);
    finalUnit.textContent = "mg MME/day";
    resultQualifier.textContent =
      "Total MME only; kidney and liver target-dose guidance is not applied in this mode.";
    if (isOralMethadoneOnlyRegimen(parsedEntries)) {
      const conservativeMme = getConservativeOralMethadoneMme(parsedEntries);

      methadoneConservativeMmeDose.textContent = conservativeMme.valid
        ? formatDose(conservativeMme.total)
        : "—";
      methadoneConservativeMme.classList.remove("is-hidden");
    }
    targetStepLabel.textContent = "Target calculation";
    rawTargetDoseOutput.textContent = "Not applied";
    reductionStep.classList.add("is-hidden");
    safetyAdjustedDoseOutput.textContent = "Not applied";
    setHiddenState(safetyAdjustedStep, true);
    renalAdjustedDoseOutput.textContent = renalAdvice.resultLabel || "Guidance only";
    hepaticAdjustedDoseOutput.textContent = hepaticAdvice.resultLabel || "Guidance only";
    organGuidanceSummaryOutput.textContent = `${renalAdvice.summary}; ${hepaticAdvice.summary}`;
    renalAdviceTitle.textContent = renalAdvice.title;
    renalAdviceBody.textContent = renalAdvice.body;
    hepaticAdviceTitle.textContent = hepaticAdvice.title;
    hepaticAdviceBody.textContent = hepaticAdvice.body;
    setLiveStatus(
      conversionResultStatus,
      `Total MME estimate: ${formatDose(oralMorphineEquivalent)} mg MME per day.`,
    );
    return;
  }

  if (!targetOption) {
    showInvalidRegimen(parsedEntries);
    return;
  }

  const conversion = calculatorCore.calculateConversion({
    oralMorphineEquivalent,
    targetOption,
    reductionPercentage,
  });

  if (!conversion.valid) {
    showInvalidRegimen(parsedEntries, "Result exceeds supported range");
    return;
  }
  const { rawTargetDose, adjustedTargetDose } = conversion;

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
  const organPresentation = calculatorCore.resolveOrganPresentation({
    renalAdvice,
    hepaticAdvice,
  });
  const dailyUnit = getDailyUnitLabel(targetOption);

  mainResultPanel.classList.toggle("is-avoid-result", organPresentation.avoidTarget);
  resultTitle.textContent = organPresentation.avoidTarget
    ? `Avoid ${targetOption.label} with selected organ guidance`
    : `${targetOption.label} estimate before organ guidance`;
  finalDose.textContent = organPresentation.avoidTarget
    ? "—"
    : formatDose(adjustedTargetDose);
  finalUnit.textContent = organPresentation.avoidTarget ? "" : dailyUnit;
  resultQualifier.textContent = organPresentation.avoidTarget
    ? "No target dose is displayed. The pre-organ-guidance arithmetic below is shown only for calculation transparency."
    : "After safety reduction; before kidney and liver guidance.";

  targetStepLabel.textContent = `Raw ${targetOption.label.toLowerCase()} dose`;
  rawTargetDoseOutput.textContent = `${formatDose(rawTargetDose)} ${dailyUnit}`;
  reductionAppliedOutput.textContent = `${reductionPercentage}% reduction`;
  safetyAdjustedDoseOutput.textContent = `${formatDose(adjustedTargetDose)} ${dailyUnit}`;
  setHiddenState(safetyAdjustedStep, false);
  reductionStep.classList.remove("is-hidden");
  renalAdjustedDoseOutput.textContent = renalAdvice.resultLabel || "Guidance only";
  hepaticAdjustedDoseOutput.textContent = hepaticAdvice.resultLabel || "Guidance only";
  organGuidanceSummaryOutput.textContent = `${renalAdvice.summary}; ${hepaticAdvice.summary}. Renal and hepatic outputs are independent; no combined dose is calculated.`;
  renalAdviceTitle.textContent = renalAdvice.title;
  renalAdviceBody.textContent = renalAdvice.body;
  hepaticAdviceTitle.textContent = hepaticAdvice.title;
  hepaticAdviceBody.textContent = hepaticAdvice.body;
  setLiveStatus(
    conversionResultStatus,
    organPresentation.avoidTarget
      ? `${resultTitle.textContent}. No target dose is displayed.`
      : `${resultTitle.textContent}: ${formatDose(adjustedTargetDose)} ${dailyUnit}.`,
  );
};

const getMethadoneRoute = () => {
  if (methadoneRouteSelect.value === "iv") {
    return {
      label: "IV methadone",
      unitLabel: "mg/day IV",
      factor: calculatorCore.METHADONE_ROUTE_FACTORS.iv,
      adjustmentLabel: "IV route: 50% of oral estimate",
    };
  }

  return {
    label: "oral methadone",
    unitLabel: "mg/day oral",
    factor: calculatorCore.METHADONE_ROUTE_FACTORS.oral,
    adjustmentLabel: "Oral route: no adjustment",
  };
};

const showInvalidMethadoneResult = (
  title = "Enter a valid whole-number OME",
  message = "Enter a whole-number OME of 0 or greater.",
) => {
  methadoneMorphineDoseInput.setAttribute("aria-invalid", "true");
  methadoneDoseHint.textContent = message;
  methadoneResultTitle.textContent = title;
  methadoneFinalDose.textContent = "—";
  methadoneFinalUnit.textContent = "";
  methadoneRatioOutput.textContent = "Not applied";
  methadoneRawDoseOutput.textContent = "Not available";
  methadoneRouteAdjustmentOutput.textContent = "Not applied";
  methadoneReductionAppliedOutput.textContent = "Not applied";
  methadoneQ8DoseOutput.textContent = "Not available";
  methadoneQ12DoseOutput.textContent = "Not available";
  setLiveStatus(methadoneResultStatus, `${title}. No dose is available.`);
};

const calculateMethadone = () => {
  const oralMorphineDaily = Number(methadoneMorphineDoseInput.value);
  const reductionPercentage = clampMethadoneReduction(
    methadoneReductionNumber.value,
  );

  if (
    methadoneMorphineDoseInput.value.trim() === "" ||
    !Number.isFinite(oralMorphineDaily) ||
    oralMorphineDaily < 0 ||
    !Number.isInteger(oralMorphineDaily) ||
    !methadoneMorphineDoseInput.checkValidity()
  ) {
    showInvalidMethadoneResult();
    return;
  }

  const route = getMethadoneRoute();
  const result = calculatorCore.calculateMethadone({
    oralMorphineDaily,
    ratioTable: methadoneRatioTable,
    reductionPercentage,
    routeFactor: route.factor,
  });

  if (!result.valid) {
    showInvalidMethadoneResult(
      result.reason === "out-of-range"
        ? "Result exceeds supported range"
        : "Enter a valid whole-number OME",
      result.reason === "out-of-range"
        ? "The entered OME is too large to calculate safely."
        : "Enter a whole-number OME of 0 or greater.",
    );
    return;
  }
  const {
    bracket,
    rawOralMethadoneDaily,
    reducedMethadoneDaily,
    q8Dose,
    q12Dose,
  } = result;

  methadoneMorphineDoseInput.setAttribute("aria-invalid", "false");
  methadoneDoseHint.textContent = "mg/day OME (whole numbers)";
  methadoneResultTitle.textContent = "Conservative starting estimate";
  methadoneFinalDose.textContent = formatDose(reducedMethadoneDaily);
  methadoneFinalUnit.textContent = route.unitLabel;
  methadoneRatioOutput.textContent = `${bracket.ratio}:1`;
  methadoneRawDoseOutput.textContent =
    `${formatDose(rawOralMethadoneDaily)} mg/day`;
  methadoneRouteAdjustmentOutput.textContent = route.adjustmentLabel;
  methadoneReductionAppliedOutput.textContent = `${reductionPercentage}% reduction`;
  methadoneQ8DoseOutput.textContent = `${formatDose(q8Dose)} mg/dose`;
  methadoneQ12DoseOutput.textContent = `${formatDose(q12Dose)} mg/dose`;
  setLiveStatus(
    methadoneResultStatus,
    `Methadone estimate: ${formatDose(reducedMethadoneDaily)} ${route.unitLabel}.`,
  );
};

const populateBenzoSelects = () => {
  if (!benzoSourceDrugSelect || !benzoTargetDrugSelect) return;

  const markup = benzoConversionOptions
    .map(
      (item) =>
        `<option value="${item.id}">${item.medication} (${item.brand}) ${item.route}</option>`,
    )
    .join("");

  benzoSourceDrugSelect.innerHTML = markup;
  benzoTargetDrugSelect.innerHTML = markup;

  // Set default values
  benzoSourceDrugSelect.value = "alprazolam_po";
  benzoTargetDrugSelect.value = "diazepam_po";
};

const showInvalidBenzoResult = (
  title = "Enter a valid daily dose",
  message = "Enter a finite daily dose greater than 0.",
) => {
  benzoSourceDoseInput.setAttribute("aria-invalid", "true");
  benzoDoseValidation.textContent = message;
  benzoResultTitle.textContent = title;
  benzoFinalDose.textContent = "—";
  benzoFinalUnit.textContent = "";
  benzoRawDiazepamEquiv.textContent = "Not available";
  benzoReducedDiazepamEquiv.textContent = "Not available";
  benzoReductionApplied.textContent = "Not applied";
  setLiveStatus(benzoResultStatus, `${title}. No dose is available.`);
};

const calculateBenzo = () => {
  if (!benzoSourceDrugSelect || !benzoTargetDrugSelect) return;
  const sourceId = benzoSourceDrugSelect.value;
  const targetId = benzoTargetDrugSelect.value;
  const sourceDose = Number(benzoSourceDoseInput.value);
  const reductionPercentage = calculatorCore.clampWholePercent(
    benzoReductionNumber.value,
    50,
  );

  const sourceBenzo = benzoConversionOptions.find(b => b.id === sourceId);
  const targetBenzo = benzoConversionOptions.find(b => b.id === targetId);

  if (
    !sourceBenzo ||
    !targetBenzo ||
    !Number.isFinite(sourceDose) ||
    sourceDose <= 0 ||
    !benzoSourceDoseInput.checkValidity()
  ) {
    showInvalidBenzoResult();
    return;
  }

  const result = calculatorCore.calculateBenzodiazepine({
    sourceDose,
    sourceEquivalent: sourceBenzo.equiv,
    targetEquivalent: targetBenzo.equiv,
    reductionPercentage,
  });

  if (!result.valid) {
    showInvalidBenzoResult(
      result.reason === "out-of-range"
        ? "Result exceeds supported range"
        : "Enter a valid daily dose",
      result.reason === "out-of-range"
        ? "The entered daily dose is too large to calculate safely."
        : "Enter a finite daily dose greater than 0.",
    );
    return;
  }
  const {
    rawDiazepamEquivalent: rawDiazepamEquiv,
    reducedDiazepamEquivalent: reducedDiazepamEquiv,
    targetDose,
  } = result;

  benzoSourceDoseInput.setAttribute("aria-invalid", "false");
  benzoDoseValidation.textContent = "";
  benzoResultTitle.textContent = "Equivalent starting estimate";
  benzoFinalDose.textContent = formatDose(targetDose);
  benzoFinalUnit.textContent = `${targetBenzo.doseUnit}/day`;
  benzoRawDiazepamEquiv.textContent = `${formatDose(rawDiazepamEquiv)} mg Diazepam/day`;
  benzoReducedDiazepamEquiv.textContent = `${formatDose(reducedDiazepamEquiv)} mg Diazepam/day`;
  benzoReductionApplied.textContent = `${reductionPercentage}% reduction`;
  setLiveStatus(
    benzoResultStatus,
    `Benzodiazepine estimate: ${formatDose(targetDose)} ${targetBenzo.doseUnit} per day.`,
  );
};

const updateRegimenEntryFeedback = (entryElement, entry) => {
  const calculation = getRegimenEntryCalculation(entry);
  const calculationOutOfRange =
    calculation.inputsValid && !calculation.calculationFinite;
  const summary = entryElement.querySelector(".entry-summary");

  if (summary) {
    summary.textContent = getEntrySummaryText(entry);
  }

  entryElement
    .querySelectorAll('[data-field="dose"], [data-field="dosesPerDay"]')
    .forEach((input) => {
      const fieldValid =
        input.dataset.field === "dose"
          ? calculation.doseInputValid
          : calculation.frequencyInputValid;
      input.setAttribute(
        "aria-invalid",
        String(!fieldValid || calculationOutOfRange),
      );
    });
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

    renderRegimenEntries({ focusKey: entryKey, focusField: "drugId" });
  } else {
    updateRegimenEntryFeedback(entryElement, entry);
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
  const removedIndex = regimenEntriesState.findIndex((item) => item.key === entryKey);
  regimenEntriesState = regimenEntriesState.filter((item) => item.key !== entryKey);
  const focusEntry =
    regimenEntriesState[Math.min(removedIndex, regimenEntriesState.length - 1)];
  renderRegimenEntries({
    focusKey: focusEntry?.key ?? null,
    focusField: focusEntry ? "drugId" : null,
  });
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

regimenEntriesContainer.addEventListener("input", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("change", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("click", handleRegimenEntryClick);

addRegimenEntryButton.addEventListener("click", () => {
  const entry = createRegimenEntry();
  regimenEntriesState.push(entry);
  renderRegimenEntries({ focusKey: entry.key, focusField: "drugId" });
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

const syncBenzoReduction = (source) => {
  const val = Math.max(0, Math.min(50, Math.round(Number(source.value) || 0)));
  benzoReductionRange.value = val;
  benzoReductionNumber.value = val;
};

[
  benzoSourceDrugSelect,
  benzoSourceDoseInput,
  benzoTargetDrugSelect,
  benzoReductionRange,
  benzoReductionNumber,
].forEach((control) => {
  if (control) {
    control.addEventListener("input", () => {
      if (
        control === benzoReductionRange ||
        control === benzoReductionNumber
      ) {
        syncBenzoReduction(control);
      }
      calculateBenzo();
    });
    control.addEventListener("change", () => {
      calculateBenzo();
    });
  }
});

if (benzoForm) {
  benzoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    calculateBenzo();
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    persistTheme(nextTheme);
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

  pharmacokineticsModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setPharmacokineticsModalVisible(false);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getModalFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
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
    updatePharmacokineticsSelection();
  });
}

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
renderReferenceTable();
renderHepaticGuidanceTable();
renderSourceTable();
renderPharmacokineticsReference();
renderBuprenorphineOptions();
setRegimenEntries([{}]);
renderSpecialtyTool();
renderBuprenorphineSchedule();
updateRenalBandNote();
calculate();
calculateMethadone();
populateBenzoSelects();
calculateBenzo();
document.documentElement.dataset.calculatorReady = "true";
