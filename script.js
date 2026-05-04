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
    title: "Configured local staging rules",
    url: "",
    note:
      "This staging build preserves the local IV morphine baseline and legacy hydromorphone or meperidine values while adding the requested oral methadone 4.7 MME factor, 3.0 conservative oral methadone estimate, and hepatic advisory bands.",
  },
  {
    title: "Production methadone ratio table",
    url: "",
    note:
      "Cloned from the production methadone tool for the specialty morphine:methadone bands: 0-30 mg 2:1, 31-99 mg 4:1, 100-299 mg 8:1, 300-499 mg 12:1, 500-999 mg 15:1, and 1000 mg/day or more 20:1.",
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

const calculatorTabButtons = document.querySelectorAll("[data-calculator-tab]");
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

const getOptionDisplayLabel = (item) =>
  item.route === "Oral" ? `${item.medication} PO` : item.label;

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
            step="${patchOption ? "0.5" : "0.001"}"
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
            step="0.25"
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

  specialtyPanels.forEach((panel) => {
    panel.classList.toggle(
      "is-hidden",
      panel.dataset.specialtyPanel !== selectedTool,
    );
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
    activeMode === "methadone" || activeMode === "buprenorphine";

  calculatorTabButtons.forEach((button) => {
    const isActive = button.dataset.calculatorTab === activeMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  mainCalculatorSection.classList.toggle("is-hidden", isSpecialtyMode);
  specialtyCalculatorSection.classList.toggle("is-hidden", !isSpecialtyMode);
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

regimenEntriesContainer.addEventListener("input", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("change", handleRegimenEntryInput);
regimenEntriesContainer.addEventListener("click", handleRegimenEntryClick);

addRegimenEntryButton.addEventListener("click", () => {
  regimenEntriesState.push(createRegimenEntry());
  renderRegimenEntries();
  calculate();
});

calculatorTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculationModeSelect.value = button.dataset.calculatorTab;
    setModeVisibility();

    if (
      calculationModeSelect.value === "methadone" ||
      calculationModeSelect.value === "buprenorphine"
    ) {
      renderSpecialtyTool();
      calculateMethadone();
      renderBuprenorphineSchedule();
      return;
    }

    calculate();
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

renderReferenceTable();
renderHepaticGuidanceTable();
renderSourceTable();
renderBuprenorphineOptions();
setRegimenEntries([{}]);
renderSpecialtyTool();
renderBuprenorphineSchedule();
updateRenalBandNote();
calculate();
calculateMethadone();
