(() => {
  "use strict";

  const root = document.querySelector("#udsModal");
  if (!root) return;

  const STORAGE_KEY = "uds-clinical-reference-panels-v1";
  const APP_VERSION = "2026-05-23 workflow redesign";
  const COVERAGE_STATUSES = new Set([
    "included",
    "class_screen",
    "assay_dependent",
    "not_included",
  ]);
  const EXPECTED_PARENT_PROMPT_EXCLUSIONS = new Set([
    "heroin",
    "lisdexamfetamine",
    "methylphenidate",
    "ethanol",
    "delta9_thc",
    "cbd",
    "synthetic_cannabinoids",
  ]);
  const REVIEW_METADATA = {
    lastReviewed: "2026-05-23",
    status: "staging clinical-content review",
    note: "Verify against local laboratory method, cutoff, and panel contents before clinical use.",
  };
  const referenceCategories = [
    "Laboratory method references",
    "Clinical UDS interpretation reviews",
    "Detection-window references",
    "Local laboratory policy / panel validation",
  ];

  const items = [
    item("morphine", "Morphine", "Opioids", "drug", ["MS Contin", "Roxanol"], "1-3 days", "Morphine use, codeine metabolism, heroin pathway, or poppy exposure context; not heroin-specific without 6-MAM.", "Definitive opiate panel when source matters", ["opioid"]),
    item("codeine", "Codeine", "Opioids", "drug", ["Tylenol #3"], "1-3 days", "Can produce morphine and sometimes minor hydrocodone; interpret with full opiate pattern.", "Definitive opiate panel when source matters", ["opioid"]),
    item("heroin", "Heroin", "Opioids", "drug", ["diacetylmorphine"], "6-MAM usually <1 day", "Urine evidence is usually indirect; 6-MAM is the specific short-window heroin marker.", "6-MAM plus opiate definitive testing", ["opioid"]),
    item("6mam", "6-MAM", "Opioids", "finding", ["6-acetylmorphine", "6-monoacetylmorphine"], "Usually <1 day", "Specific marker of recent heroin exposure when detected; absence does not exclude heroin after the short window.", "Definitive heroin marker assay", ["opioid"]),
    item("hydrocodone", "Hydrocodone", "Opioids", "drug", ["Norco", "Vicodin", "Lortab"], "1-3 days", "May produce norhydrocodone and hydromorphone; hydromorphone alone is not source-specific.", "Hydrocodone/norhydrocodone definitive testing", ["opioid"]),
    item("norhydrocodone", "Norhydrocodone", "Opioids", "finding", [], "1-3 days", "Supportive hydrocodone metabolite when included on the panel.", "Definitive opiate panel", ["opioid"]),
    item("hydromorphone", "Hydromorphone", "Opioids", "drug_or_finding", ["Dilaudid"], "1-4 days", "May reflect hydromorphone exposure, hydrocodone metabolism, or minor morphine metabolism.", "Definitive opiate panel with parent/metabolites", ["opioid"]),
    item("oxycodone", "Oxycodone", "Opioids", "drug", ["OxyContin", "Percocet", "Roxicodone"], "1-3 days", "Generic opiate screens may miss oxycodone; oxymorphone can be a metabolite or separate drug.", "Oxycodone/oxymorphone-specific or definitive testing", ["opioid"]),
    item("noroxycodone", "Noroxycodone", "Opioids", "finding", [], "1-3 days", "Supportive oxycodone metabolite when included.", "Oxycodone definitive panel", ["opioid"]),
    item("oxymorphone", "Oxymorphone", "Opioids", "drug_or_finding", ["Opana"], "1-3 days", "Can be prescribed directly or appear as an oxycodone metabolite.", "Oxycodone/oxymorphone definitive testing", ["opioid"]),
    item("fentanyl", "Fentanyl", "Opioids", "drug", ["Duragesic", "Sublimaze"], "1-7 days", "Not detected by a routine opiate immunoassay; norfentanyl is often the more useful urine finding.", "Fentanyl/norfentanyl-specific or definitive testing", ["opioid", "high_risk"]),
    item("norfentanyl", "Norfentanyl", "Opioids", "finding", [], "1-7 days", "Supportive fentanyl metabolite; routine opiate screens do not exclude it.", "Fentanyl/norfentanyl-specific or definitive testing", ["opioid", "high_risk"]),
    item("buprenorphine", "Buprenorphine", "Opioids", "drug", ["Suboxone", "Subutex", "Belbuca", "Butrans"], "1-10 days", "Requires buprenorphine-specific testing; norbuprenorphine supports metabolism/exposure.", "Buprenorphine + norbuprenorphine with specimen validity", ["opioid", "oud"]),
    item("norbuprenorphine", "Norbuprenorphine", "Opioids", "finding", [], "1-10 days", "Supports buprenorphine metabolism/exposure; interpret with parent drug, timing, naloxone when relevant, and validity.", "Buprenorphine + norbuprenorphine definitive testing", ["opioid", "oud"]),
    item("naloxone", "Naloxone", "Opioids", "drug_or_finding", ["Narcan"], "1-2 days", "May appear with naloxone exposure or buprenorphine/naloxone products; does not prove route manipulation by itself.", "Targeted naloxone testing only when clinically relevant", ["opioid_context"]),
    item("methadone", "Methadone", "Opioids", "drug", ["Dolophine"], "1-14 days", "Generic opiate screens do not reliably detect methadone; EDDP supports ingestion/metabolism.", "Methadone + EDDP-specific or definitive testing", ["opioid"]),
    item("eddp", "EDDP", "Opioids", "finding", ["methadone metabolite"], "1-14 days", "Supports methadone ingestion/metabolism when included.", "Methadone + EDDP definitive testing", ["opioid"]),
    item("tramadol", "Tramadol", "Opioids", "drug", ["Ultram"], "1-4 days", "Not reliably detected by routine opiate immunoassay; requires targeted/definitive testing.", "Tramadol + O-desmethyltramadol", ["opioid"]),
    item("odesmethyltramadol", "O-desmethyltramadol", "Opioids", "finding", ["M1 tramadol metabolite"], "1-4 days", "Supportive tramadol metabolite when included.", "Tramadol definitive testing", ["opioid"]),
    item("tapentadol", "Tapentadol", "Opioids", "drug", ["Nucynta"], "1-3 days", "Not detected by routine opiate screens; requires targeted/definitive testing.", "Tapentadol-specific definitive testing", ["opioid"]),

    item("diazepam", "Diazepam", "Benzodiazepines", "drug", ["Valium"], "1-7 days; metabolites may persist longer", "Produces shared metabolites; source often requires full benzodiazepine pattern.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("nordiazepam", "Nordiazepam", "Benzodiazepines", "finding", ["desmethyldiazepam"], "1-20 days", "Shared diazepam-type metabolite; not source-specific alone.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("temazepam", "Temazepam", "Benzodiazepines", "drug_or_finding", ["Restoril"], "1-4 days", "May be prescribed directly or appear downstream from diazepam-type drugs.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("oxazepam", "Oxazepam", "Benzodiazepines", "drug_or_finding", ["Serax"], "1-7 days", "Common terminal benzodiazepine metabolite; not source-specific alone.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("clonazepam", "Clonazepam", "Benzodiazepines", "drug", ["Klonopin"], "1-12 days", "Some benzodiazepine immunoassays under-detect clonazepam; 7-aminoclonazepam is the key urine target.", "Definitive benzodiazepine panel including 7-aminoclonazepam", ["benzodiazepine", "sedative"]),
    item("aminoclonazepam7", "7-aminoclonazepam", "Benzodiazepines", "finding", ["7-amino-clonazepam"], "1-12 days", "Supportive clonazepam metabolite when included.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("lorazepam", "Lorazepam", "Benzodiazepines", "drug", ["Ativan"], "1-7 days", "May be missed by some benzodiazepine screens if glucuronide sensitivity is poor.", "Definitive benzodiazepine panel that detects lorazepam/glucuronides", ["benzodiazepine", "sedative"]),
    item("alprazolam", "Alprazolam", "Benzodiazepines", "drug", ["Xanax"], "1-5 days", "Alpha-hydroxyalprazolam supports alprazolam exposure.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),
    item("alpha_hydroxyalprazolam", "Alpha-hydroxyalprazolam", "Benzodiazepines", "finding", ["alprazolam metabolite"], "1-5 days", "Supportive alprazolam metabolite when included.", "Definitive benzodiazepine panel", ["benzodiazepine", "sedative"]),

    item("amphetamine", "Amphetamine", "Stimulants", "drug_or_finding", ["Adderall component", "amphetamine salts"], "1-7 days", "May reflect prescribed amphetamine, lisdexamfetamine, methamphetamine metabolism, or immunoassay ambiguity.", "Definitive amphetamine/methamphetamine confirmation when unexpected", ["stimulant"]),
    item("methamphetamine", "Methamphetamine", "Stimulants", "drug", ["Desoxyn"], "1-4 days", "Can produce amphetamine; d/l isomer testing may help source interpretation if available.", "Definitive amphetamine/methamphetamine +/- isomer testing", ["stimulant"]),
    item("lisdexamfetamine", "Lisdexamfetamine", "Stimulants", "drug", ["Vyvanse"], "Interpreted through amphetamine", "Explains amphetamine findings when medication history supports use.", "Amphetamine definitive testing when adherence/source matters", ["stimulant"]),
    item("methylphenidate", "Methylphenidate", "Stimulants", "drug", ["Ritalin", "Concerta"], "Usually <1 day for parent; metabolite varies", "Routine amphetamine screens do not answer methylphenidate adherence questions.", "Methylphenidate/ritalinic acid-specific testing", ["stimulant"]),
    item("ritalinic_acid", "Ritalinic acid", "Stimulants", "finding", ["methylphenidate metabolite"], "Panel-specific", "Supportive methylphenidate metabolite when included.", "Methylphenidate/ritalinic acid-specific testing", ["stimulant"]),
    item("bupropion", "Bupropion", "Assay caveats", "drug_or_context", ["Wellbutrin"], "Not a target UDS drug in most workflows", "Important medication context for unexpected amphetamine immunoassay positives.", "Definitive amphetamine confirmation if screen is unexpected", ["assay_context"]),
    item("pseudoephedrine", "Pseudoephedrine", "Assay caveats", "drug_or_context", ["Sudafed"], "Not usually a definitive target", "OTC context for unexpected amphetamine-class immunoassay results.", "Definitive amphetamine confirmation if screen is unexpected", ["assay_context"]),
    item("phentermine", "Phentermine", "Stimulants", "drug", ["Adipex-P"], "1-5 days", "Can complicate amphetamine-class screen interpretation depending on assay.", "Definitive stimulant testing when unexpected", ["stimulant", "assay_context"]),
    item("cocaine", "Cocaine", "Cocaine", "drug", [], "Parent is short-lived", "Usually interpreted through benzoylecgonine in urine; does not prove impairment/timing.", "Cocaine metabolite definitive confirmation if high consequence", ["stimulant"]),
    item("benzoylecgonine", "Benzoylecgonine", "Cocaine", "finding", ["cocaine metabolite", "BE"], "1-2 days typical", "Primary urine metabolite supporting cocaine exposure; does not establish impairment or exact timing.", "Cocaine metabolite confirmation when high consequence", ["stimulant"]),

    item("delta9_thc", "Delta-9 THC / Cannabis", "Cannabinoids", "drug_or_context", ["cannabis", "marijuana"], "Urine interpretation usually through THC-COOH", "Urine cannabinoid testing supports exposure but not impairment or exact timing.", "Cannabinoid confirmation when clinically consequential", ["cannabinoid"]),
    item("thc_cooh", "THC-COOH", "Cannabinoids", "finding", ["carboxy THC", "THC metabolite"], "1-45 days depending on use pattern", "Supports cannabinoid exposure; single urine value does not determine impairment, exact timing, or new vs residual use.", "Definitive cannabinoid testing; serial creatinine-normalized values only for specific reuse questions", ["cannabinoid"]),
    item("delta8_thc", "Delta-8 THC", "Cannabinoids", "drug_or_context", ["delta 8"], "Panel-specific", "Generic cannabinoid screens may not distinguish delta-8 from delta-9 metabolites.", "Definitive cannabinoid isomer-specific testing if distinction matters", ["cannabinoid"]),
    item("cbd", "CBD product", "Cannabinoids", "drug_or_context", ["cannabidiol"], "Product-dependent", "CBD products can complicate THC interpretation if THC contamination or product labeling problems are possible.", "Confirm THC metabolite and review product context", ["cannabinoid_context"]),
    item("synthetic_cannabinoids", "Synthetic cannabinoids", "Emerging / expanded", "drug_or_context", ["K2", "Spice"], "Panel-specific", "Routine THC screens generally do not exclude synthetic cannabinoids.", "Targeted synthetic cannabinoid testing if clinically relevant", ["emerging"]),

    item("ethanol", "Ethanol", "Alcohol markers", "drug_or_context", ["alcohol"], "Short for urine ethanol", "Urine ethanol is short-window; EtG/EtS are longer-window markers but require cutoff/context.", "EtG/EtS or other alcohol marker based on clinical question", ["alcohol"]),
    item("etg", "EtG", "Alcohol markers", "finding", ["ethyl glucuronide"], "1-4 days", "Sensitive alcohol exposure marker; cutoff, timing, and incidental exposure context matter.", "EtG with EtS when alcohol exposure matters", ["alcohol"]),
    item("ets", "EtS", "Alcohol markers", "finding", ["ethyl sulfate"], "1-4 days", "Alcohol exposure marker often interpreted with EtG; cutoff/context matter.", "EtG/EtS panel", ["alcohol"]),

    item("gabapentin", "Gabapentin", "Expanded / other", "drug", ["Neurontin"], "1-2 days", "Not included on many standard panels; order specifically if co-use affects safety.", "Gabapentin-specific or expanded definitive panel", ["gabapentinoid", "sedative"]),
    item("pregabalin", "Pregabalin", "Expanded / other", "drug", ["Lyrica"], "1-2 days", "Not included on many standard panels; order specifically if co-use affects safety.", "Pregabalin-specific or expanded definitive panel", ["gabapentinoid", "sedative"]),
    item("zolpidem", "Zolpidem", "Expanded / other", "drug", ["Ambien"], "1-3 days", "Often not included on standard panels; metabolite testing may be more useful than parent depending on timing.", "Zolpidem-specific definitive testing", ["sedative"]),
    item("pcp", "PCP", "Dissociatives", "drug_or_finding", ["phencyclidine"], "1-7 days", "PCP immunoassays can have false positives; confirm unexpected positives.", "Definitive PCP confirmation when unexpected", ["dissociative"]),
    item("xylazine", "Xylazine", "Emerging / expanded", "drug", ["tranq"], "Targeted testing only", "Routine UDS generally does not detect xylazine; clinical suspicion requires targeted testing and supportive care.", "Targeted xylazine testing if available", ["emerging", "sedative", "high_risk"]),
    item("mitragynine", "Mitragynine / kratom", "Emerging / expanded", "drug", ["kratom"], "Panel-specific", "Not included on many standard panels; order specifically if clinically relevant.", "Mitragynine/7-hydroxymitragynine targeted testing", ["emerging"]),
  ];

  const relationships = [
    rel("codeine", "morphine", "expected metabolite", "shared", "Morphine can be compatible with codeine metabolism, but morphine is not codeine-specific."),
    rel("codeine", "hydrocodone", "minor metabolite", "context", "Small hydrocodone may occur in some codeine contexts; quantitative context matters."),
    rel("heroin", "6mam", "specific marker", "strong", "6-MAM supports recent heroin exposure when detected."),
    rel("heroin", "morphine", "downstream metabolite", "shared", "Morphine can fit heroin pathway but is not heroin-specific without 6-MAM/timing context."),
    rel("hydrocodone", "norhydrocodone", "supportive metabolite", "strong", "Norhydrocodone supports hydrocodone exposure when included."),
    rel("hydrocodone", "hydromorphone", "expected metabolite", "shared", "Hydromorphone can be a hydrocodone metabolite but is not source-specific alone."),
    rel("morphine", "hydromorphone", "minor metabolite", "context", "Hydromorphone may occur as a minor morphine metabolite in some contexts."),
    rel("oxycodone", "noroxycodone", "supportive metabolite", "strong", "Noroxycodone supports oxycodone exposure when included."),
    rel("oxycodone", "oxymorphone", "expected metabolite", "shared", "Oxymorphone can be an oxycodone metabolite or prescribed separately."),
    rel("fentanyl", "norfentanyl", "supportive metabolite", "strong", "Norfentanyl supports fentanyl exposure when included."),
    rel("buprenorphine", "norbuprenorphine", "supportive metabolite", "strong", "Norbuprenorphine supports buprenorphine metabolism/exposure."),
    rel("buprenorphine", "naloxone", "combination product context", "context", "Naloxone may appear with buprenorphine/naloxone products; does not prove route manipulation alone."),
    rel("methadone", "eddp", "supportive metabolite", "strong", "EDDP supports methadone ingestion/metabolism."),
    rel("tramadol", "odesmethyltramadol", "supportive metabolite", "strong", "O-desmethyltramadol supports tramadol exposure."),
    rel("diazepam", "nordiazepam", "metabolite", "shared", "Nordiazepam supports diazepam-type exposure but is not source-specific alone."),
    rel("diazepam", "temazepam", "metabolite", "shared", "Temazepam may be prescribed directly or appear in a diazepam-type pathway."),
    rel("diazepam", "oxazepam", "terminal metabolite", "shared", "Oxazepam is a shared terminal benzodiazepine metabolite."),
    rel("temazepam", "oxazepam", "metabolite", "shared", "Oxazepam can follow temazepam exposure, but source requires the full pattern."),
    rel("clonazepam", "aminoclonazepam7", "supportive metabolite", "strong", "7-aminoclonazepam supports clonazepam exposure."),
    rel("alprazolam", "alpha_hydroxyalprazolam", "supportive metabolite", "strong", "Alpha-hydroxyalprazolam supports alprazolam exposure."),
    rel("methamphetamine", "amphetamine", "metabolite", "shared", "Amphetamine can be a methamphetamine metabolite or separate/prescribed exposure."),
    rel("lisdexamfetamine", "amphetamine", "expected finding", "strong", "Lisdexamfetamine explains amphetamine findings when medication history supports use."),
    rel("methylphenidate", "ritalinic_acid", "supportive metabolite", "strong", "Ritalinic acid supports methylphenidate exposure when included."),
    rel("cocaine", "benzoylecgonine", "supportive metabolite", "strong", "Benzoylecgonine supports cocaine exposure."),
    rel("delta9_thc", "thc_cooh", "supportive metabolite", "strong", "THC-COOH supports cannabinoid exposure but not impairment or exact timing."),
    rel("ethanol", "etg", "alcohol marker", "context", "EtG supports recent alcohol exposure but requires cutoff/timing context."),
    rel("ethanol", "ets", "alcohol marker", "context", "EtS supports recent alcohol exposure and is commonly interpreted with EtG."),
  ];

  const clinicalQuestions = [
    question("oxy_presence", "Is prescribed oxycodone present?", "Order oxycodone + oxymorphone, preferably definitive if the result affects care.", "Do not rely on a generic opiate screen.", "Oxycodone, noroxycodone, oxymorphone."),
    question("fentanyl_presence", "Could fentanyl exposure be present?", "Order fentanyl + norfentanyl-specific or definitive testing.", "A negative routine opiate screen does not exclude fentanyl.", "Fentanyl, norfentanyl."),
    question("bupe_adherence", "Is buprenorphine being taken?", "Order buprenorphine + norbuprenorphine with specimen validity.", "Do not use a generic opiate screen for buprenorphine adherence.", "Buprenorphine, norbuprenorphine, naloxone if product context matters."),
    question("methadone_adherence", "Is methadone being taken?", "Order methadone + EDDP.", "Do not assume generic opiate coverage includes methadone.", "Methadone, EDDP."),
    question("clonazepam_adherence", "Is clonazepam being taken?", "Order definitive benzodiazepine testing that includes 7-aminoclonazepam.", "A benzodiazepine immunoassay may miss clonazepam.", "7-aminoclonazepam."),
    question("lorazepam_adherence", "Is lorazepam being taken?", "Order definitive benzodiazepine testing with lorazepam/glucuronide sensitivity.", "Some screens under-detect lorazepam or glucuronidated metabolites.", "Lorazepam and/or lorazepam-glucuronide depending on method."),
    question("methylphenidate_adherence", "Is methylphenidate being taken?", "Order methylphenidate/ritalinic acid-specific testing.", "A routine amphetamine screen does not answer methylphenidate adherence.", "Ritalinic acid."),
    question("amphetamine_confirm", "Is an amphetamine screen real?", "Confirm with definitive amphetamine/methamphetamine testing before major action.", "Bupropion, pseudoephedrine, phentermine, and assay effects can complicate screens.", "Amphetamine, methamphetamine; consider isomer testing if source matters."),
    question("alcohol_exposure", "Is alcohol exposure relevant?", "Order EtG/EtS and interpret with cutoff, timing, and exposure history.", "Do not infer impairment or exact timing from EtG/EtS alone.", "EtG, EtS."),
    question("xylazine", "Could xylazine be involved?", "Order targeted xylazine testing if available and clinically relevant.", "Routine UDS generally does not detect xylazine.", "Xylazine requires targeted testing; clinical management is supportive."),
    question("gabapentin", "Is gabapentin/pregabalin co-use relevant?", "Order gabapentin or pregabalin specifically or use an expanded definitive panel.", "Most standard UDS panels do not include gabapentinoids.", "Gabapentin, pregabalin."),
  ];

  const builtInProfiles = [
    profile("unknown", "Unknown / report not reviewed", "unknown", "Use when the exact method, included analytes, and cutoffs are unknown.", false, []),
    profile("generic_opiate_screen", "Generic opiate immunoassay", "immunoassay", "Morphine-like class screen. Synthetic and many semisynthetic opioids require targeted testing.", false, [
      coverage("morphine", "class_screen"), coverage("codeine", "class_screen"), coverage("hydrocodone", "assay_dependent"), coverage("hydromorphone", "assay_dependent"), coverage("oxycodone", "assay_dependent"), coverage("oxymorphone", "assay_dependent"), coverage("fentanyl", "not_included"), coverage("norfentanyl", "not_included"), coverage("methadone", "not_included"), coverage("eddp", "not_included"), coverage("buprenorphine", "not_included"), coverage("norbuprenorphine", "not_included"), coverage("tramadol", "not_included"), coverage("tapentadol", "not_included"),
    ]),
    profile("benzodiazepine_screen", "Benzodiazepine immunoassay", "immunoassay", "Class screen. Detection varies; clonazepam and lorazepam are common blind spots.", false, [
      coverage("diazepam", "class_screen"), coverage("nordiazepam", "class_screen"), coverage("temazepam", "class_screen"), coverage("oxazepam", "class_screen"), coverage("alprazolam", "assay_dependent"), coverage("alpha_hydroxyalprazolam", "assay_dependent"), coverage("clonazepam", "assay_dependent"), coverage("aminoclonazepam7", "assay_dependent"), coverage("lorazepam", "assay_dependent"),
    ]),
    profile("targeted_definitive", "Unmapped targeted definitive panel", "definitive", "Use when the report says definitive testing was performed but the exact included analytes have not been mapped here. Absent findings still require verified report coverage.", true, []),
    profile("example_broad_definitive", "Demo only - broad definitive profile", "definitive", "Demonstration profile only. Create a local non-identifying panel profile before relying on absent or panel-coverage interpretation.", true, [
      "morphine", "codeine", "6mam", "hydrocodone", "norhydrocodone", "hydromorphone", "oxycodone", "noroxycodone", "oxymorphone", "fentanyl", "norfentanyl", "buprenorphine", "norbuprenorphine", "methadone", "eddp", "tramadol", "odesmethyltramadol", "diazepam", "nordiazepam", "temazepam", "oxazepam", "clonazepam", "aminoclonazepam7", "lorazepam", "alprazolam", "alpha_hydroxyalprazolam", "amphetamine", "methamphetamine", "methylphenidate", "ritalinic_acid", "benzoylecgonine", "thc_cooh", "etg", "ets", "gabapentin", "pregabalin", "zolpidem", "mitragynine", "xylazine"
    ].map((id) => coverage(id, "included"))),
  ];

  const byId = new Map(items.map((entry) => [entry.id, entry]));
  const relationshipsByFrom = groupBy(relationships, "from");
  const relationshipsByTo = groupBy(relationships, "to");

  const state = {
    mode: "interpret",
    context: "chronic_opioid",
    consequence: "moderate",
    resultSource: "unknown",
    method: "unknown",
    panelId: "unknown",
    expected: [],
    detected: [],
    absent: [],
    absentVerified: false,
    validityFlag: "unknown",
    validityDetails: blankValidityDetails(),
    validityDetailsOpen: false,
    localProfiles: loadProfiles(),
    lookupQuery: "",
    lookupId: "fentanyl",
    questionId: "oxy_presence",
    panelDraft: blankPanelDraft(),
    panelDraftCoverageStatus: "included",
    panelDraftError: "",
    lastSummary: "",
    lastShortSummary: "",
    lastPatientScript: "",
  };

  function item(id, name, group, type, aliases, window, note, bestTest, tags) {
    return { id, name, group, type, aliases, window, note, bestTest, tags };
  }

  function rel(from, to, label, strength, note) {
    return { from, to, label, strength, note };
  }

  function question(id, label, recommended, avoid, expected) {
    return { id, label, recommended, avoid, expected };
  }

  function profile(id, label, method, note, validityIncluded, analytes) {
    return { id, label, method, note, validityIncluded, analytes };
  }

  function coverage(id, status) {
    return { id, status };
  }

  function blankPanelDraft() {
    return {
      label: "",
      method: "definitive",
      validityIncluded: true,
      reviewDate: new Date().toISOString().slice(0, 10),
      note: "",
      analytes: [],
    };
  }

  function groupBy(rows, key) {
    return rows.reduce((map, row) => {
      if (!map.has(row[key])) map.set(row[key], []);
      map.get(row[key]).push(row);
      return map;
    }, new Map());
  }

  function loadProfiles() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) {
        return [];
      }

      const normalized = parsed
        .map(normalizeLocalProfile)
        .filter(Boolean);

      const normalizedJson = JSON.stringify(normalized);
      const parsedJson = JSON.stringify(parsed);

      if (normalizedJson !== parsedJson) {
        try {
          localStorage.setItem(STORAGE_KEY, normalizedJson);
        } catch {
          // Ignore cleanup persistence failure.
        }
      }

      return normalized;
    } catch {
      return [];
    }
  }

  function blankValidityDetails() {
    return {
      creatinine: "",
      specificGravity: "",
      ph: "",
      oxidants: "unknown",
    };
  }

  function normalizeCoverageEntry(row) {
    if (typeof row === "string") {
      return getItem(row) ? coverage(row, "included") : null;
    }

    if (!row || !row.id || !getItem(row.id)) {
      return null;
    }

    const status = COVERAGE_STATUSES.has(row.status) ? row.status : "included";
    return coverage(row.id, status);
  }

  function dedupeCoverageEntries(entries) {
    const byAnalyte = new Map();

    entries.forEach((entry) => {
      if (!entry || !entry.id) return;

      if (!byAnalyte.has(entry.id)) {
        byAnalyte.set(entry.id, new Set());
      }

      byAnalyte.get(entry.id).add(entry.status || "included");
    });

    return Array.from(byAnalyte.entries()).map(([id, statuses]) => {
      if (statuses.size === 1) {
        return coverage(id, Array.from(statuses)[0]);
      }

      return coverage(id, "assay_dependent");
    });
  }

  function normalizeLocalProfile(raw) {
    if (!raw || !raw.id || !raw.label) {
      return null;
    }

    const label = String(raw.label || "").slice(0, 80);
    const note = String(raw.note || "");

    if ([label, note].some(hasIdentifierLikeText)) {
      return null;
    }

    const method = ["immunoassay", "definitive", "mixed", "unknown"].includes(raw.method)
      ? raw.method
      : "unknown";
    const analytes = Array.isArray(raw.analytes)
      ? dedupeCoverageEntries(raw.analytes.map(normalizeCoverageEntry).filter(Boolean))
      : [];

    return {
      id: String(raw.id),
      label,
      method,
      note,
      validityIncluded: Boolean(raw.validityIncluded),
      analytes,
      reviewDate: raw.reviewDate || "",
    };
  }

  function saveProfiles() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.localProfiles));
    } catch {
      // Local storage may be unavailable; the tool remains usable for the current session.
    }
  }

  function allProfiles() {
    return [...builtInProfiles, ...state.localProfiles];
  }

  function selectedProfile() {
    return allProfiles().find((profile) => profile.id === state.panelId) || builtInProfiles[0];
  }

  function getItem(id) {
    return byId.get(id);
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function itemLabel(id) {
    return getItem(id)?.name || id;
  }

  function sortByLabel(rows, getLabel) {
    return [...rows].sort((a, b) =>
      getLabel(a).localeCompare(getLabel(b), undefined, { sensitivity: "base" }),
    );
  }

  function sortedProfiles() {
    return sortByLabel(allProfiles(), (profile) => profile.label);
  }

  function groupToneForItem(entry) {
    if (!entry) return "other";
    if (entry.tags.includes("high_risk") || entry.tags.includes("emerging")) return "risk";
    if (entry.tags.includes("opioid")) return "opioid";
    if (entry.tags.includes("benzodiazepine") || entry.tags.includes("sedative")) return "sedative";
    if (entry.tags.includes("stimulant")) return "stimulant";
    if (entry.tags.includes("cannabinoid")) return "cannabinoid";
    if (entry.tags.includes("alcohol")) return "alcohol";
    if (entry.tags.includes("assay_context")) return "method";
    return "other";
  }

  function findItem(value) {
    const query = normalize(value);
    if (!query) return null;
    return items.find((entry) => normalize(entry.name) === query)
      || items.find((entry) => entry.aliases.some((alias) => normalize(alias) === query))
      || items.find((entry) => normalize(entry.name).includes(query))
      || items.find((entry) => entry.aliases.some((alias) => normalize(alias).includes(query)))
      || null;
  }

  function findExactItem(value) {
    const query = normalize(value);
    if (!query) return null;
    return items.find((entry) => normalize(entry.name) === query)
      || items.find((entry) => entry.aliases.some((alias) => normalize(alias) === query))
      || null;
  }

  function findEnterPickerItem(value) {
    const exact = findExactItem(value);
    if (exact) return exact;
    const matches = searchItems(value, 3);
    return matches.length === 1 ? matches[0] : null;
  }

  function searchItems(query, limit = 20) {
    const q = normalize(query);
    if (!q) return sortByLabel(items, (entry) => entry.name).slice(0, limit);
    return items
      .map((entry) => {
        const fields = [entry.name, entry.group, entry.type, entry.note, entry.bestTest, ...entry.aliases].map(normalize);
        let score = 0;
        if (normalize(entry.name) === q) score = 100;
        else if (normalize(entry.name).startsWith(q)) score = 85;
        else if (fields.some((field) => field === q)) score = 75;
        else if (fields.some((field) => field.includes(q))) score = 55;
        else if (q.split(" ").every((token) => fields.join(" ").includes(token))) score = 35;
        return { entry, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
      .slice(0, limit)
      .map(({ entry }) => entry);
  }

  function setRootShell() {
    root.setAttribute("aria-labelledby", "udsModalTitle");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML = `
      <div class="uds-shell">
        <header class="uds-header">
          <button class="uds-text-button" id="udsCloseButton" type="button">Back</button>
          <div class="uds-title-block">
            <p class="uds-eyebrow">Clinical reference only</p>
            <h2 id="udsModalTitle">UDS workflow tool</h2>
            <p>Interpret results, choose tests, look up analytes, and manage non-identifying local panel profiles.</p>
          </div>
          <span class="uds-version">${escapeHtml(APP_VERSION)}</span>
        </header>
        <div class="uds-privacy-strip">Do not enter patient names, DOBs, MRNs, accession numbers, order numbers, addresses, or other identifiers.</div>
        <nav class="uds-nav" aria-label="UDS workflows">
          ${navButton("interpret", "Interpret", "Result workflow")}
          ${navButton("test", "Choose test", "Before ordering")}
          ${navButton("lookup", "Lookup", "Drug/analyte")}
          ${navButton("panels", "Panels", "Local profiles")}
        </nav>
        <main class="uds-main" id="udsMain"></main>
      </div>
    `;
  }

  function navButton(mode, label, sublabel) {
    return `<button class="uds-nav-button" data-mode="${mode}" type="button"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(sublabel)}</span></button>`;
  }

  function render() {
    root.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === state.mode);
    });
    const main = root.querySelector("#udsMain");
    if (!main) return;
    if (state.mode === "interpret") main.innerHTML = renderInterpret();
    if (state.mode === "test") main.innerHTML = renderChooseTest();
    if (state.mode === "lookup") main.innerHTML = renderLookup();
    if (state.mode === "panels") main.innerHTML = renderPanels();
  }

  function renderInterpret() {
    const result = analyzeInterpretation();
    state.lastSummary = result.chartNote;
    state.lastShortSummary = result.shortSummary;
    state.lastPatientScript = result.patientScript;
    return `
      <section class="uds-workflow-grid">
        <form class="uds-card" data-form="interpret" autocomplete="off">
          <div class="uds-card-head">
            <div>
              <p class="uds-eyebrow">Primary workflow</p>
              <h3>Interpret a result</h3>
            </div>
            <div class="uds-header-actions">
              <button class="uds-text-button" data-action="clear-interpret" type="button">Clear entries</button>
            </div>
          </div>
          ${renderContextControls()}
          ${renderChipEditor("expected", "Expected medications/substances", "Prescribed, reported, administered, or otherwise expected")}
          ${renderChipEditor("detected", "Detected / positive findings", "What the report lists as present")}
          ${renderAbsentEditor()}
          ${renderValidityControls()}
        </form>
        <section class="uds-card uds-output-card" aria-live="polite">
          <div class="uds-card-head">
            <div>
              <p class="uds-eyebrow">Output</p>
              <h3>${escapeHtml(result.label)}</h3>
            </div>
            <span class="uds-status uds-status--${escapeHtml(result.tone)}">${escapeHtml(result.confirmationLevel)}</span>
          </div>
          ${renderOutputBlock("Immediate safety flags", result.safetyFlags, safetyOutputTone(result.safetyFlags))}
          ${renderOutputBlock("Specimen validity", [...result.validityNotes, ...result.validityWarnings], validityOutputTone(result))}
          ${renderOutputBlock("What this can support", result.canSupport, result.explained.length ? "compatible" : "neutral")}
          ${renderOutputBlock("What this cannot support", result.cannotSupport, "neutral")}
          ${result.panelWarnings.length ? renderOutputBlock("Panel/profile limitations", result.panelWarnings, "method") : ""}
          ${renderOutputBlock("Recommended next step", [result.nextStep], nextStepOutputTone(result))}
          ${result.expectedNegatives.length ? renderDetails("Expected negative / absent findings", result.expectedNegatives) : ""}
          ${renderDetails("Reasoning details", [
            ...result.explained.map((line) => `Compatible: ${line}`),
            ...result.contextNeeded.map((line) => `Context: ${line}`),
            ...result.notExplained.map((line) => `Unexplained: ${line}`),
            ...result.absentConcerns.map((line) => `Absent review: ${line}`),
            ...result.expectedNegatives.map((line) => `Expected negative: ${line}`),
            ...result.validityWarnings.map((line) => `Specimen validity: ${line}`),
            ...result.panelWarnings.map((line) => `Panel/profile: ${line}`),
          ])}
          ${renderDetails("Method notes", result.methodNotes)}
          ${renderDetails("Optional supportive findings to check", result.supportiveNotEntered)}
          ${renderDetails("Expected parent findings to check", result.expectedParentNotEntered)}
          <div class="uds-copy-grid">
            <button class="uds-primary-button" data-action="copy-summary" type="button">Copy chart note</button>
            <button class="uds-secondary-button" data-action="copy-short-summary" type="button">Copy short summary</button>
            <button class="uds-secondary-button" data-action="copy-patient" type="button">Copy patient script</button>
          </div>
          <pre class="uds-note-preview">${escapeHtml(result.chartNote)}</pre>
        </section>
      </section>
    `;
  }

  function renderContextControls() {
    return `
      <div class="uds-field-grid">
        <label>Clinical setting
          <select data-field="context">
            ${option("chronic_opioid", "Chronic opioid therapy", state.context)}
            ${option("oud", "OUD treatment", state.context)}
            ${option("benzo", "Benzodiazepine prescribing", state.context)}
            ${option("stimulant", "Stimulant prescribing", state.context)}
            ${option("psychiatry", "Psychiatry", state.context)}
            ${option("ed", "ED / urgent care", state.context)}
            ${option("pregnancy", "Pregnancy / perinatal", state.context)}
            ${option("adolescent", "Adolescent", state.context)}
            ${option("other", "Other clinical context", state.context)}
            ${option("forensic_nonclinical", "Legal / employment / forensic - not supported", state.context)}
          </select>
        </label>
        <label>Decision impact
          <select data-field="consequence">
            ${option("low", "Low", state.consequence)}
            ${option("moderate", "Moderate", state.consequence)}
            ${option("high", "High / changes care", state.consequence)}
          </select>
        </label>
        <label>Method
          <select data-field="method">
            ${option("unknown", "Unknown", state.method)}
            ${option("immunoassay", "Immunoassay screen", state.method)}
            ${option("definitive", "Definitive LC/GC-MS", state.method)}
          </select>
        </label>
        <label>Result source
          <select data-field="resultSource">
            ${option("unknown", "Unknown", state.resultSource)}
            ${option("poc", "Point-of-care cup/card", state.resultSource)}
            ${option("lab_screen", "Laboratory immunoassay", state.resultSource)}
            ${option("lab_definitive", "Laboratory definitive LC/GC-MS", state.resultSource)}
          </select>
        </label>
        <label class="uds-field-wide">Panel profile
          <select data-field="panelId">
            ${sortedProfiles().map((profile) => option(profile.id, profile.label, state.panelId)).join("")}
          </select>
        </label>
      </div>
    `;
  }

  function renderChipEditor(key, title, hint) {
    return `
      <section class="uds-input-section">
        <div class="uds-section-label"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(hint)}</span></div>
        <div class="uds-add-line uds-add-line--picker">
          ${renderPickerInput(key, "Type drug, metabolite, brand, or finding...")}
        </div>
        <div class="uds-chip-list">${renderChips(key)}</div>
      </section>
    `;
  }

  function renderAbsentEditor() {
    return `
      <section class="uds-input-section">
        <div class="uds-section-label"><strong>Tested but absent</strong><span>Use only when the analyte was included and reported negative/absent.</span></div>
        <label class="uds-checkbox-line">
          <input data-field="absentVerified" type="checkbox" ${state.absentVerified ? "checked" : ""} />
          <span>I verified these absent analytes were included and reportable on the selected panel.</span>
        </label>
        <div class="uds-add-line uds-add-line--picker">
          ${renderPickerInput("absent", "Example: norfentanyl, 7-aminoclonazepam")}
        </div>
        <div class="uds-chip-list">${renderChips("absent")}</div>
      </section>
    `;
  }

  function renderPickerInput(key, placeholder) {
    const pickerId = `udsPicker-${key}`;
    return `
      <div class="uds-picker-shell">
        <input
          aria-controls="${escapeHtml(pickerId)}"
          aria-expanded="false"
          autocomplete="off"
          data-chip-input="${escapeHtml(key)}"
          placeholder="${escapeHtml(placeholder)}"
          type="search"
        />
        <span class="uds-picker-hint">Select a match or press Enter for an exact single match.</span>
        <div class="uds-picker-panel is-hidden" data-chip-picker="${escapeHtml(key)}" id="${escapeHtml(pickerId)}" role="listbox"></div>
      </div>
    `;
  }

  function renderPickerOptions(key, query = "") {
    const selected = selectedIdsForPicker(key);
    const matches = searchItems(query, query.trim() ? 12 : 10).filter((entry) => !selected.has(entry.id));
    if (!matches.length) {
      return `<div class="uds-picker-empty">No available matches. Try a drug, metabolite, brand, or finding.</div>`;
    }

    const ambiguityHint = query.trim() && matches.length > 1
      ? `<div class="uds-picker-empty">Multiple matches. Select one below instead of pressing Enter.</div>`
      : "";

    return `
      ${ambiguityHint}
      ${matches.map((entry) => `
        <button
          class="uds-picker-option"
          data-action="pick-chip"
          data-id="${escapeHtml(entry.id)}"
          data-key="${escapeHtml(key)}"
          role="option"
          type="button"
        >
          <span class="uds-picker-name">${escapeHtml(entry.name)}</span>
          <span class="uds-picker-meta">${escapeHtml(entry.group)} · ${escapeHtml(entry.type.replaceAll("_", " "))}</span>
        </button>
      `).join("")}
    `;
  }

  function selectedIdsForPicker(key) {
    if (key === "panelAnalyte") return new Set(state.panelDraft.analytes.map((row) => row.id));
    return new Set(state[key] || []);
  }

  function renderValidityControls() {
    return `
      <section class="uds-input-section">
        <div class="uds-section-label"><strong>Specimen validity</strong><span>No values required. Use the report's validity flag if available.</span></div>
        <select data-field="validityFlag">
          ${option("unknown", "Unknown / not reported", state.validityFlag)}
          ${option("normal", "Appears interpretable", state.validityFlag)}
          ${option("dilute", "Dilute - negatives less reliable", state.validityFlag)}
          ${option("invalid", "Invalid / do not interpret", state.validityFlag)}
          ${option("adulterated", "Possible adulteration / consult lab", state.validityFlag)}
        </select>
        ${renderValidityDetails()}
      </section>
    `;
  }

  function renderValidityDetails() {
    return `
      <details
        class="uds-details"
        data-validity-details
        ${state.validityDetailsOpen ? "open" : ""}
      >
        <summary>Optional validity details</summary>
        <div class="uds-field-grid uds-field-grid--compact">
          <label>Creatinine, mg/dL
            <input data-validity-detail="creatinine" inputmode="decimal" placeholder="Optional" value="${escapeHtml(state.validityDetails.creatinine)}" />
          </label>
          <label>Specific gravity
            <input data-validity-detail="specificGravity" inputmode="decimal" placeholder="Optional" value="${escapeHtml(state.validityDetails.specificGravity)}" />
          </label>
          <label>pH
            <input data-validity-detail="ph" inputmode="decimal" placeholder="Optional" value="${escapeHtml(state.validityDetails.ph)}" />
          </label>
          <label>Oxidants/adulterants
            <select data-validity-detail="oxidants">
              ${option("unknown", "Unknown / not reported", state.validityDetails.oxidants)}
              ${option("normal", "Normal / negative", state.validityDetails.oxidants)}
              ${option("abnormal", "Abnormal / positive", state.validityDetails.oxidants)}
            </select>
          </label>
        </div>
        <div class="uds-mini-action-row">
          <button class="uds-text-button" data-action="reset-validity-details" type="button">Clear validity details</button>
        </div>
      </details>
    `;
  }

  function chipToneForKey(key) {
    return {
      expected: "expected",
      detected: "detected",
      absent: "absent",
      panelAnalyte: "panel",
    }[key] || "neutral";
  }

  function renderChips(key) {
    const tone = chipToneForKey(key);
    return state[key].length
      ? state[key]
        .map(
          (id) => `
            <button
              class="uds-chip uds-chip--${escapeHtml(tone)}"
              data-action="remove-chip"
              data-key="${escapeHtml(key)}"
              data-id="${escapeHtml(id)}"
              type="button"
            >
              ${escapeHtml(itemLabel(id))}
              <span aria-hidden="true">x</span>
            </button>
          `,
        )
        .join("")
      : `<span class="uds-muted">None entered.</span>`;
  }

  function option(value, label, selectedValue) {
    return `<option value="${escapeHtml(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function tonePrefix(tone) {
    return {
      compatible: "Compatible",
      caution: "Caution",
      method: "Panel/method",
      warning: "Action needed",
      neutral: "Info",
    }[tone] || "Info";
  }

  function safetyOutputTone(rows) {
    if (!rows.length) return "neutral";

    return rows.some((line) => /xylazine|fentanyl|respiratory depression|overdose/i.test(line))
      ? "warning"
      : "caution";
  }

  function validityOutputTone(result) {
    if (
      ["invalid", "adulterated"].includes(state.validityFlag) ||
      hasCriticalValidityDetailProblem()
    ) {
      return "warning";
    }

    return result.validityWarnings.length ? "caution" : "neutral";
  }

  function nextStepOutputTone(result) {
    if (/Confirm before action|Repeat \/ consult lab|Do not use/i.test(result.confirmationLevel)) {
      return "warning";
    }

    if (/Verify panel|Clarify|Confirmation recommended|Interpret cautiously/i.test(result.confirmationLevel)) {
      return "caution";
    }

    if (/Routine documentation|High-consequence review/i.test(result.confirmationLevel)) {
      return result.tone || "neutral";
    }

    return "neutral";
  }

  function renderOutputBlock(title, rows, tone = "neutral") {
    const validRows = rows.filter(Boolean);
    return `
      <section class="uds-output-block uds-output-block--${escapeHtml(tone)}">
        <h4><span class="uds-output-tone-label">${escapeHtml(tonePrefix(tone))}</span> ${escapeHtml(title)}</h4>
        ${validRows.length ? `<ul>${validRows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>` : `<p class="uds-muted">No flag from current inputs.</p>`}
      </section>
    `;
  }

  function renderDetails(title, rows) {
    const validRows = rows.filter(Boolean);
    if (!validRows.length) return "";
    return `
      <details class="uds-details">
        <summary>${escapeHtml(title)}</summary>
        <ul>${validRows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>
      </details>
    `;
  }

  function renderChooseTest() {
    const selected = clinicalQuestions.find((entry) => entry.id === state.questionId) || clinicalQuestions[0];
    return `
      <section class="uds-simple-grid">
        <div class="uds-card">
          <div class="uds-card-head"><div><p class="uds-eyebrow">Before ordering</p><h3>Choose the right test</h3></div></div>
          <label>Clinical question
            <select data-field="questionId">
              ${sortByLabel(clinicalQuestions, (entry) => entry.label).map((entry) => option(entry.id, entry.label, state.questionId)).join("")}
            </select>
          </label>
          <p class="uds-muted">This module recommends a test type based on the question. It does not use order numbers, accession numbers, or subject identifiers.</p>
        </div>
        <div class="uds-card uds-output-card">
          <div class="uds-card-head"><div><p class="uds-eyebrow">Recommendation</p><h3>${escapeHtml(selected.label)}</h3></div></div>
          ${renderOutputBlock("Recommended order concept", [selected.recommended])}
          ${renderOutputBlock("Avoid this mistake", [selected.avoid])}
          ${renderOutputBlock("Expected target analytes", [selected.expected])}
          <button class="uds-primary-button" data-action="copy-test" type="button">Copy test recommendation</button>
        </div>
      </section>
    `;
  }

  function renderLookup() {
    const selected = getItem(state.lookupId) || items[0];
    return `
      <section class="uds-simple-grid uds-lookup-grid">
        <div class="uds-card">
          <div class="uds-card-head"><div><p class="uds-eyebrow">Reference</p><h3>Look up drug / metabolite</h3></div></div>
          <input
            autocomplete="off"
            data-field="lookupQuery"
            placeholder="Search fentanyl, 7-aminoclonazepam, EtG, methylphenidate..."
            spellcheck="false"
            type="search"
            value="${escapeHtml(state.lookupQuery)}"
          />
          <div class="uds-search-list" id="udsLookupResults">
            ${renderLookupResults()}
          </div>
        </div>
        <div class="uds-card uds-output-card" id="udsLookupOutput">
          ${renderLookupOutput(selected)}
        </div>
      </section>
    `;
  }

  function renderLookupOutput(selected = getItem(state.lookupId) || items[0]) {
    return `
      <div class="uds-card-head"><div><p class="uds-eyebrow">Lookup result</p><h3>${escapeHtml(selected.name)}</h3></div><span class="uds-tag uds-tag--${escapeHtml(groupToneForItem(selected))}">${escapeHtml(selected.group)}</span></div>
      ${renderOutputBlock("Bottom line", [selected.note])}
      ${renderOutputBlock("Best test concept", [selected.bestTest])}
      ${renderOutputBlock("Approximate urine window", [selected.window])}
      ${renderOutputBlock("Expected / related findings", getRelatedLines(selected.id))}
      ${renderOutputBlock("Do not conclude", [standardCannotConclude().join("; ")])}
      ${renderDetails("Reference / governance", [
        `Last reviewed: ${REVIEW_METADATA.lastReviewed}`,
        `Status: ${REVIEW_METADATA.status}`,
        REVIEW_METADATA.note,
        ...referenceCategories,
      ])}
      <button class="uds-secondary-button" data-action="copy-lookup" type="button">Copy lookup summary</button>
    `;
  }

  function renderLookupResults() {
    const results = searchItems(state.lookupQuery, 24);
    return results.length
      ? results
          .map(
            (entry) => `
              <button
                class="uds-list-item uds-row-button"
                data-action="select-lookup"
                data-id="${escapeHtml(entry.id)}"
                type="button"
              >
                <span class="uds-list-main">${escapeHtml(entry.name)}</span>
                <span class="uds-list-meta">${escapeHtml(entry.group)} · ${escapeHtml(entry.type.replaceAll("_", " "))}</span>
              </button>
            `,
          )
          .join("")
      : `<p class="uds-muted">No match. Try a drug, metabolite, brand, or finding.</p>`;
  }

  function getRelatedLines(id) {
    const outgoing = relationshipsByFrom.get(id) || [];
    const incoming = relationshipsByTo.get(id) || [];
    return [
      ...outgoing.map((row) => `${itemLabel(row.from)} -> ${itemLabel(row.to)}: ${row.note}`),
      ...incoming.map((row) => `${itemLabel(row.to)} may be explained by ${itemLabel(row.from)}: ${row.note}`),
    ];
  }

  function renderPanels() {
    const profiles = sortedProfiles();
    return `
      <section class="uds-simple-grid uds-panel-manager">
        <div class="uds-card">
          <div class="uds-card-head"><div><p class="uds-eyebrow">Local setup</p><h3>Panel profiles</h3></div></div>
          <p class="uds-muted">Create non-identifying profiles only. Use labels like “Clinic broad definitive profile.” Do not enter EHR order names, order numbers, accession numbers, lab account numbers, or patient identifiers.</p>
          <div class="uds-search-list">
            ${profiles.map((profile) => renderPanelSummary(profile)).join("")}
          </div>
        </div>
        <form class="uds-card" data-form="panel" autocomplete="off">
          <div class="uds-card-head"><div><p class="uds-eyebrow">Build profile</p><h3>Add local panel profile</h3></div><button class="uds-text-button" data-action="reset-panel-draft" type="button">Reset</button></div>
          <label>Profile label, no order numbers
            <input data-panel-field="label" placeholder="Example: Clinic definitive opioid profile" value="${escapeHtml(state.panelDraft.label)}" />
          </label>
          <div class="uds-field-grid">
            <label>Method
              <select data-panel-field="method">
                ${option("immunoassay", "Immunoassay", state.panelDraft.method)}
                ${option("definitive", "Definitive LC/GC-MS", state.panelDraft.method)}
                ${option("mixed", "Mixed screen + confirmation", state.panelDraft.method)}
                ${option("unknown", "Unknown", state.panelDraft.method)}
              </select>
            </label>
            <label>Reviewed date
              <input data-panel-field="reviewDate" type="date" value="${escapeHtml(state.panelDraft.reviewDate)}" />
            </label>
          </div>
          <label class="uds-checkbox-line"><input data-panel-field="validityIncluded" type="checkbox" ${state.panelDraft.validityIncluded ? "checked" : ""} /><span>Specimen validity is included or routinely reported.</span></label>
          <label>Non-identifying notes
            <textarea data-panel-field="note" placeholder="Example: Confirm actual analytes/cutoffs with lab before go-live.">${escapeHtml(state.panelDraft.note)}</textarea>
          </label>
          <section class="uds-input-section">
            <div class="uds-section-label"><strong>Included analytes</strong><span>Add only analyte names; no report/order identifiers.</span></div>
            <label>Coverage status
              <select data-panel-field="panelDraftCoverageStatus">
                ${option("included", "Included / reportable", state.panelDraftCoverageStatus)}
                ${option("class_screen", "Class screen only", state.panelDraftCoverageStatus)}
                ${option("assay_dependent", "Assay-dependent", state.panelDraftCoverageStatus)}
                ${option("not_included", "Known not included", state.panelDraftCoverageStatus)}
              </select>
            </label>
            <div class="uds-add-line uds-add-line--picker">
              ${renderPickerInput("panelAnalyte", "Example: fentanyl, norfentanyl, 7-aminoclonazepam")}
              <button class="uds-secondary-button" data-action="add-panel-analyte" type="button">Add</button>
            </div>
            <div class="uds-chip-list">
              ${state.panelDraft.analytes.length
                ? state.panelDraft.analytes.map((row) => `
                  <button
                    class="uds-chip uds-chip--coverage uds-chip--coverage-${escapeHtml(row.status)}"
                    data-action="remove-panel-analyte"
                    data-id="${escapeHtml(row.id)}"
                    type="button"
                  >
                    ${escapeHtml(itemLabel(row.id))}
                    <span>${escapeHtml(coverageText(row.status))}</span>
                    <span aria-hidden="true">x</span>
                  </button>
                `).join("")
                : `<span class="uds-muted">No analytes added.</span>`}
            </div>
          </section>
          ${state.panelDraftError ? `<div class="uds-warning-box">${escapeHtml(state.panelDraftError)}</div>` : ""}
          <button class="uds-primary-button" data-action="save-panel" type="button">Save local profile</button>
          <p class="uds-muted">Saved profiles stay in this browser only and should contain no patient or order identifiers.</p>
        </form>
      </section>
    `;
  }

  function renderPanelSummary(profile) {
    const isLocal = state.localProfiles.some((row) => row.id === profile.id);
    const mappedCount = profile.analytes?.length || 0;
    const knownGaps = profile.analytes?.filter((row) => row.status === "not_included").length || 0;
    return `
      <article class="uds-list-item uds-profile-row">
        <div class="uds-list-content">
          <strong class="uds-list-main">${escapeHtml(profile.label)}</strong>
          <span class="uds-list-meta">${escapeHtml(profile.method)} · ${mappedCount} mapped entries${knownGaps ? ` · ${knownGaps} known gaps` : ""} · validity ${profile.validityIncluded ? "included" : "not mapped"}</span>
          ${profile.note ? `<p class="uds-list-note">${escapeHtml(profile.note)}</p>` : ""}
          ${mappedCount === 0 && isLocal ? `<p class="uds-warning-text">No mapped analytes or known gaps.</p>` : ""}
        </div>
        ${isLocal ? `
          <div class="uds-profile-actions">
            <span class="uds-list-badge uds-list-badge--${escapeHtml(profileBadgeTone(profile, isLocal))}">Local</span>
            <button class="uds-text-button" data-action="copy-panel-json" data-id="${escapeHtml(profile.id)}" type="button">Copy JSON</button>
            <button class="uds-text-button" data-action="delete-panel" data-id="${escapeHtml(profile.id)}" type="button">Delete</button>
          </div>
        ` : `
          <span class="uds-list-badge uds-list-badge--${escapeHtml(profileBadgeTone(profile, isLocal))}">
            ${isDemoProfile(profile) ? "Demo" : "Built-in"}
          </span>
        `}
      </article>
    `;
  }

  function analyzeInterpretation() {
    const profile = selectedProfile();
    const explained = [];
    const contextNeeded = [];
    const notExplained = [];
    const methodNotes = buildMethodNotes();
    const panelWarnings = [...buildPanelWarnings(profile), ...buildResultSourceWarnings()];
    const safetyFlags = buildSafetyFlags();

    if (state.context === "forensic_nonclinical") {
      const label = "Nonclinical/forensic use not supported";
      const nextStep = "Use appropriate chain-of-custody, forensic/workplace protocols, certified laboratory processes, and qualified review. This clinical reference tool should not be used for legal, employment, custody, or forensic conclusions.";
      const chartNote = [
        "UDS clinical reference review, no patient identifiers entered.",
        "Selected context is legal/employment/forensic, which is outside this tool's intended use.",
        `Next step: ${nextStep}`,
      ].join("\n");

      return {
        label,
        tone: "warning",
        confirmationLevel: "Do not use for this purpose",
        explained: [],
        contextNeeded: [],
        notExplained: [],
        absentConcerns: [],
        absentReviews: [],
        expectedNegatives: [],
        supportiveNotEntered: [],
        expectedParentNotEntered: [],
        methodNotes: [],
        panelWarnings: [],
        validityNotes: [],
        validityWarnings: [],
        safetyFlags: [],
        canSupport: ["This tool supports clinical reference review only."],
        cannotSupport: ["Legal, employment, custody, forensic, or chain-of-custody conclusions."],
      nextStep,
      chartNote,
      shortSummary: [
        `UDS interpretation: ${label}.`,
        "Confirmation threshold: Do not use for this purpose.",
        `Next: ${nextStep}`,
      ].join("\n"),
      patientScript: "This clinical reference tool is not designed for legal, employment, custody, or forensic testing decisions.",
    };
    }

    state.detected.forEach((detectedId) => {
      if (state.expected.includes(detectedId)) {
        explained.push(`${itemLabel(detectedId)} is listed as expected and was detected.`);
        return;
      }
      const match = findExpectedRelationship(detectedId);
      if (match) {
        const line = `${itemLabel(detectedId)} can fit ${itemLabel(match.from)}: ${match.note}`;
        if (match.strength === "strong") {
          explained.push(line);
        } else {
          contextNeeded.push(`${line} This finding is not source-specific by itself. Quantitative values, cutoff, timing, and the full pattern may help interpretation but do not prove exact source, dose, timing, impairment, or intent.`);
        }
        return;
      }
      const entry = getItem(detectedId);
      notExplained.push(`${itemLabel(detectedId)} is not explained by the entered expected medications/substances.${entry?.note ? ` ${entry.note}` : ""}`);
    });

    const absentReviews = state.absent.map((id) => classifyAbsent(id, profile));

    const absentConcerns = absentReviews
      .filter((row) =>
        ["non_actionable", "panel_limited", "unexpected_negative", "supportive_absent"].includes(row.severity),
      )
      .map((row) => row.message);

    const expectedNegatives = absentReviews
      .filter((row) => row.severity === "expected_negative")
      .map((row) => row.message);

    const supportiveNotEntered = [];
    const expectedParentNotEntered = [];

    state.expected.forEach((expectedId) => {
      const supportive = (relationshipsByFrom.get(expectedId) || []).filter((row) => row.strength === "strong");
      supportive.forEach((row) => {
        if (!state.detected.includes(row.to) && !state.absent.includes(row.to)) {
          supportiveNotEntered.push(`${itemLabel(row.to)} may support ${itemLabel(expectedId)} if included and reported. Do not treat it as absent unless verified.`);
        }
      });

      if (
        shouldPromptExpectedParent(expectedId) &&
        !state.detected.includes(expectedId) &&
        !state.absent.includes(expectedId) &&
        !hasStrongSupportiveFindingDetected(expectedId)
      ) {
        expectedParentNotEntered.push(`${itemLabel(expectedId)} is expected but was not entered as detected or absent. Check whether the report includes the parent drug or only metabolites.`);
      }
    });

    const validity = classifyValidity();
    const validityNotes = validity.note ? [validity.note] : [];
    const validityWarnings = validity.warning ? [validity.warning] : [];
    const detailValidity = deriveValidityDetailWarnings();
    validityNotes.push(...detailValidity.notes);
    validityWarnings.push(...detailValidity.negativeLimitations);
    validityWarnings.push(...detailValidity.criticalWarnings);
    if (state.validityFlag === "unknown" && state.absent.length) {
      validityWarnings.push("Specimen validity is unknown; absent/negative findings are less secure than positive detected findings.");
    }

    const confirmationLevel = confirmationLevelFor({ notExplained, absentReviews, panelWarnings, validityWarnings });
    const { label, tone } = labelForResult({ explained, contextNeeded, notExplained, absentReviews, panelWarnings, validityWarnings });
    const nextStep = nextStepFor({ label, confirmationLevel, notExplained, contextNeeded, absentConcerns, panelWarnings, validityWarnings });
    const canSupport = buildCanSupport(explained, contextNeeded, notExplained);
    const cannotSupport = [...standardCannotConclude()];
    if (state.absent.length && absentReviews.some((row) => ["non_actionable", "panel_limited"].includes(row.severity))) cannotSupport.push("Absent findings cannot support non-exposure/nonadherence until panel coverage is verified.");
    if (profile.id === "unknown") cannotSupport.push("A negative or absent result cannot be relied on when the ordered panel is unknown.");
    if (["dilute", "invalid", "adulterated"].includes(state.validityFlag)) cannotSupport.push("Negative results are limited by specimen validity concerns.");

    const chartNote = buildChartNote({
      label,
      confirmationLevel,
      nextStep,
      safetyFlags,
      methodNotes,
      panelWarnings,
      validityWarnings,
      absentConcerns,
      expectedNegatives,
      expectedParentNotEntered,
    });
    const shortSummary = [
      `UDS interpretation: ${label}.`,
      `Method/panel: ${formatMethod(state.method)} / ${selectedProfile().label}.`,
      `Result source: ${formatResultSource(state.resultSource)}.`,
      `Confirmation threshold: ${confirmationLevel}.`,
      safetyFlags.length ? `Safety: ${safetyFlags.slice(0, 2).join("; ")}.` : "",
      panelWarnings.length ? `Panel/profile: ${panelWarnings.slice(0, 2).join("; ")}.` : "",
      validityWarnings.length ? `Validity: ${validityWarnings.slice(0, 2).join("; ")}.` : "",
      validityWarnings.length && buildValidityDetailSummary().length ? `Validity details: ${buildValidityDetailSummary().join("; ")}.` : "",
      `Next: ${nextStep}`,
    ].filter(Boolean).join("\n");
    const patientScript = buildPatientScript({ label, nextStep });

    return {
      label,
      tone,
      confirmationLevel,
      explained,
      contextNeeded,
      notExplained,
      absentConcerns: [...new Set(absentConcerns)].slice(0, 8),
      absentReviews,
      expectedNegatives: [...new Set(expectedNegatives)].slice(0, 8),
      supportiveNotEntered: [...new Set(supportiveNotEntered)].slice(0, 8),
      expectedParentNotEntered: [...new Set(expectedParentNotEntered)].slice(0, 8),
      methodNotes,
      panelWarnings: [...new Set(panelWarnings)].slice(0, 8),
      validityNotes,
      validityWarnings,
      safetyFlags,
      canSupport,
      cannotSupport,
      nextStep,
      chartNote,
      shortSummary,
      patientScript,
    };
  }

  function findExpectedRelationship(detectedId) {
    return state.expected
      .flatMap((expectedId) => (relationshipsByFrom.get(expectedId) || []).map((row) => ({ ...row })))
      .find((row) => row.to === detectedId) || null;
  }

  function shouldPromptExpectedParent(expectedId) {
    const entry = getItem(expectedId);
    if (!entry || !entry.type.includes("drug")) {
      return false;
    }

    return !EXPECTED_PARENT_PROMPT_EXCLUSIONS.has(expectedId);
  }

  function hasStrongSupportiveFindingDetected(expectedId) {
    return (relationshipsByFrom.get(expectedId) || [])
      .filter((row) => row.strength === "strong")
      .some((row) => state.detected.includes(row.to));
  }

  function getCoverage(profile, id) {
    return profile.analytes?.find((entry) => entry.id === id) || null;
  }

  function isDemoProfile(profile) {
    return profile?.id === "example_broad_definitive";
  }

  function profileBadgeTone(profile, isLocal) {
    if (isDemoProfile(profile)) return "warning";
    if (isLocal) return "compatible";
    if (profile.id === "unknown" || profile.id === "targeted_definitive") return "method";
    return "neutral";
  }

  function coverageText(status) {
    return {
      included: "included",
      class_screen: "class screen / not source-specific",
      assay_dependent: "assay-dependent",
      not_included: "not included",
    }[status] || "unknown";
  }

  function classifyAbsent(id, profile) {
    const name = itemLabel(id);
    const coverageEntry = getCoverage(profile, id);
    const isExpectedParent = state.expected.includes(id);
    const isSupportiveForExpected = state.expected.some((expectedId) =>
      (relationshipsByFrom.get(expectedId) || []).some((row) => row.to === id),
    );

    if (!state.absentVerified) {
      return {
        id,
        severity: "non_actionable",
        label: "Coverage not verified",
        message: `${name} was entered absent, but panel coverage has not been verified.`,
      };
    }

    if (profile.id === "unknown") {
      return {
        id,
        severity: "panel_limited",
        label: "Panel unknown",
        message: `${name} was entered absent, but the selected panel is unknown.`,
      };
    }

    if (!coverageEntry) {
      return {
        id,
        severity: "panel_limited",
        label: "Not mapped",
        message: `${name} is not mapped in the selected profile; verify inclusion and cutoff before interpreting absence.`,
      };
    }

    if (coverageEntry.status === "not_included") {
      return {
        id,
        severity: "panel_limited",
        label: "Not included",
        message: `${name} is not included in the selected profile; absence is not meaningful.`,
      };
    }

    if (coverageEntry.status === "assay_dependent") {
      return {
        id,
        severity: "panel_limited",
        label: "Assay-dependent",
        message: `${name} coverage is assay-dependent; verify the exact assay before interpreting absence.`,
      };
    }

    if (coverageEntry.status === "class_screen") {
      return {
        id,
        severity: "panel_limited",
        label: "Class screen only",
        message: `${name} is represented only by a class-level screen in the selected profile; do not treat it as specific analyte absence.`,
      };
    }

    if (isExpectedParent) {
      return {
        id,
        severity: "unexpected_negative",
        label: "Expected parent absent",
        message: `${name} was expected but reported absent on a verified panel; interpret with timing, cutoff, method, and specimen validity.`,
      };
    }

    if (isSupportiveForExpected) {
      return {
        id,
        severity: "supportive_absent",
        label: "Supportive finding absent",
        message: `${name} is a supportive finding for an expected medication and was reported absent; interpret with timing, cutoff, and specimen validity.`,
      };
    }

    return {
      id,
      severity: "expected_negative",
      label: "Not expected and absent",
      message: `${name} was reported absent on a verified panel and was not expected from the entered medication/substance list.`,
    };
  }

  function buildPanelWarnings(profile) {
    const warnings = [];
    if (profile.id === "unknown") warnings.push("Panel profile is unknown. Do not rely on absent findings until included analytes/cutoffs are verified.");
    if (isDemoProfile(profile)) {
      warnings.push("The selected broad definitive profile is a demonstration profile, not a verified local laboratory panel. Do not rely on it for clinical interpretation unless it has been replaced with a local non-identifying profile that matches the actual report.");
    }
    if (
      profile.id !== "unknown" &&
      profile.id !== "targeted_definitive" &&
      Array.isArray(profile.analytes) &&
      profile.analytes.length === 0
    ) {
      warnings.push("Selected panel profile has no mapped analytes or known gaps; update the profile before interpreting coverage.");
    }
    if (state.absent.length && profile.id !== "unknown" && !profile.validityIncluded) warnings.push("Selected panel profile does not map specimen validity; absent/negative findings should be interpreted cautiously.");
    if (profile.method !== "unknown" && state.method !== "unknown" && profile.method !== state.method && profile.method !== "mixed") warnings.push(`Selected profile method (${profile.method}) does not match selected result method (${state.method}).`);

    [...state.detected, ...state.absent].forEach((id) => {
      const cov = getCoverage(profile, id);

      if (!cov && profile.id === "unknown") {
        return;
      }

      if (!cov && profile.id === "targeted_definitive") {
        if (state.absent.includes(id)) {
          warnings.push(`${itemLabel(id)} is absent on an unmapped definitive profile; verify the reportable analyte list before interpreting absence.`);
        }
        return;
      }

      if (!cov) {
        warnings.push(`${itemLabel(id)} is not mapped in the selected panel profile. Update the profile or verify that the correct panel profile is selected.`);
        return;
      }

      if (cov.status === "not_included") warnings.push(`${itemLabel(id)} is marked not included in the selected panel profile.`);
      if (cov.status === "assay_dependent") warnings.push(`${itemLabel(id)} coverage is assay-dependent in the selected panel profile.`);
      if (cov.status === "class_screen") warnings.push(`${itemLabel(id)} may be represented only by a class screen; source-specific interpretation may require definitive testing.`);
    });

    if (
      (state.detected.length || state.absent.length) &&
      profile.id !== "unknown" &&
      profile.id !== "targeted_definitive"
    ) {
      state.expected.forEach((id) => {
        if (!getCoverage(profile, id)) {
          warnings.push(`${itemLabel(id)} is expected but not mapped in the selected panel profile; verify the selected profile answers the clinical question.`);
        }
      });
    }

    const hasFentanylQuestion = [...state.expected, ...state.detected, ...state.absent].some((id) => ["fentanyl", "norfentanyl"].includes(id));
    if (state.panelId === "generic_opiate_screen" && hasFentanylQuestion) warnings.push("Generic opiate screens do not exclude fentanyl/norfentanyl exposure.");
    const hasOxyQuestion = [...state.expected, ...state.absent].some((id) => ["oxycodone", "oxymorphone", "noroxycodone"].includes(id));
    if (state.panelId === "generic_opiate_screen" && hasOxyQuestion) warnings.push("A generic opiate screen may miss oxycodone/oxymorphone unless oxycodone-specific testing is included.");
    const genericOpiateBlindSpotIds = [
      "buprenorphine",
      "norbuprenorphine",
      "methadone",
      "eddp",
      "tramadol",
      "odesmethyltramadol",
      "tapentadol",
    ];
    const hasGenericOpiateBlindSpotQuestion = [...state.expected, ...state.detected, ...state.absent]
      .some((id) => genericOpiateBlindSpotIds.includes(id));
    if (state.panelId === "generic_opiate_screen" && hasGenericOpiateBlindSpotQuestion) warnings.push("Generic opiate screens do not reliably detect buprenorphine, methadone/EDDP, tramadol, or tapentadol; order targeted or definitive testing when those drugs matter.");
    const hasClonazepamQuestion = [...state.expected, ...state.absent].some((id) => ["clonazepam", "aminoclonazepam7"].includes(id));
    if (state.panelId === "benzodiazepine_screen" && hasClonazepamQuestion) warnings.push("Some benzodiazepine screens under-detect clonazepam/7-aminoclonazepam.");
    const hasLorazepamQuestion = [...state.expected, ...state.absent].some((id) => id === "lorazepam");
    if (state.panelId === "benzodiazepine_screen" && hasLorazepamQuestion) warnings.push("Some benzodiazepine screens under-detect lorazepam or glucuronidated metabolites.");
    return warnings;
  }

  function buildResultSourceWarnings() {
    const warnings = [];

    if (state.resultSource === "poc" && state.method === "definitive") {
      warnings.push("Result source is point-of-care, but method is set to definitive. Verify whether this was actually a lab confirmation.");
    }

    if (state.resultSource === "lab_screen" && state.method === "definitive") {
      warnings.push("Result source is laboratory immunoassay, but method is set to definitive. Verify the report method.");
    }

    if (state.resultSource === "lab_definitive" && state.method === "immunoassay") {
      warnings.push("Result source is laboratory definitive LC/GC-MS, but method is set to immunoassay. Verify the report method.");
    }

    return warnings;
  }

  function buildMethodNotes() {
    const notes = [];
    if (state.method === "immunoassay") {
      notes.push("Immunoassay results are presumptive and can have false positives, false negatives, and class-panel gaps.");
    }
    if (state.method === "definitive") {
      notes.push("Definitive testing is targeted; it only answers analytes included and reportable in that method.");
    }
    if (state.method === "unknown") {
      notes.push("Method is unknown. Select immunoassay versus definitive if available before acting on the result.");
    }
    return notes;
  }

  function classifyValidity() {
    if (state.validityFlag === "normal") {
      return {
        note: "Specimen validity appears interpretable based on the selected flag.",
        warning: "",
        severity: "normal",
      };
    }

    if (state.validityFlag === "dilute") {
      return {
        note: "",
        warning: "Specimen is dilute; negative or absent findings are less reliable.",
        severity: "caution",
      };
    }

    if (state.validityFlag === "invalid") {
      return {
        note: "",
        warning: "Specimen is invalid; do not interpret without repeat collection or lab input.",
        severity: "critical",
      };
    }

    if (state.validityFlag === "adulterated") {
      return {
        note: "",
        warning: "Possible adulteration; consult the lab and repeat per clinic policy before interpretation.",
        severity: "critical",
      };
    }

    return {
      note: "Specimen validity is not reported. Interpret negative or absent findings cautiously.",
      warning: "",
      severity: "unknown",
    };
  }

  function deriveValidityDetailWarnings() {
    const notes = [];
    const negativeLimitations = [];
    const criticalWarnings = [];
    const creatinine = Number.parseFloat(state.validityDetails.creatinine);
    const specificGravity = Number.parseFloat(state.validityDetails.specificGravity);
    const ph = Number.parseFloat(state.validityDetails.ph);
    const hasAbsentFindings = state.absent.length > 0;

    if (Number.isFinite(creatinine)) {
      if (creatinine < 20) {
        const message = "Creatinine is low; negative or absent findings may be less reliable.";
        if (hasAbsentFindings) {
          negativeLimitations.push(message);
        } else {
          notes.push("Creatinine is low; this mainly limits negative or absent interpretation.");
        }
      }
    }

    if (Number.isFinite(specificGravity) && (specificGravity < 1.003 || specificGravity > 1.035)) {
      const message = "Specific gravity is outside a typical expected urine range; interpret negative or absent findings with laboratory validity comments.";
      if (hasAbsentFindings) {
        negativeLimitations.push(message);
      } else {
        notes.push("Specific gravity is outside a typical expected range; this is most important when interpreting negative or absent findings.");
      }
    }

    if (Number.isFinite(ph) && (ph < 4.5 || ph > 9)) {
      criticalWarnings.push("Urine pH is outside a typical expected range; consider specimen validity or lab consultation.");
    }

    if (state.validityDetails.oxidants === "abnormal") {
      criticalWarnings.push("Oxidants/adulterants are reported abnormal; consult the lab and avoid relying on the result without repeat or confirmation.");
    }

    return { notes, negativeLimitations, criticalWarnings };
  }

  function hasCriticalValidityDetailProblem() {
    const ph = Number.parseFloat(state.validityDetails.ph);
    return state.validityDetails.oxidants === "abnormal" ||
      (Number.isFinite(ph) && (ph < 4.5 || ph > 9));
  }

  function buildSafetyFlags() {
    const detected = state.detected.map(getItem).filter(Boolean);
    const expected = state.expected.map(getItem).filter(Boolean);
    const absent = state.absent.map(getItem).filter(Boolean);
    const allKnown = [...detected, ...expected];
    const flags = [];
    const hasExpectedOrDetectedOpioid = allKnown.some((entry) => entry.tags.includes("opioid"));
    const hasDetectedOpioid = detected.some((entry) => entry.tags.includes("opioid"));
    const hasDetectedBenzo = detected.some((entry) => entry.tags.includes("benzodiazepine"));
    const hasExpectedBenzo = expected.some((entry) => entry.tags.includes("benzodiazepine"));
    const hasDetectedAlcohol = detected.some((entry) => entry.tags.includes("alcohol"));
    const hasDetectedSedative = detected.some((entry) => entry.tags.includes("sedative"));
    const fentanylDetected = detected.some((entry) => ["fentanyl", "norfentanyl"].includes(entry.id));
    const hasExpectedOudMedicationAbsent =
      state.context === "oud" &&
      state.absentVerified &&
      absent.some((entry) => ["buprenorphine", "methadone"].includes(entry.id)) &&
      state.expected.some((id) => ["buprenorphine", "methadone"].includes(id));
    const hasExpectedOudSupportiveMetaboliteAbsent =
      state.context === "oud" &&
      state.absentVerified &&
      (
        (state.expected.includes("buprenorphine") && state.absent.includes("norbuprenorphine")) ||
        (state.expected.includes("methadone") && state.absent.includes("eddp"))
      );

    if (hasExpectedOrDetectedOpioid && hasDetectedBenzo) flags.push("Opioid therapy/exposure + benzodiazepine detected: assess sedation/overdose risk and naloxone access.");
    if (hasDetectedOpioid && hasExpectedBenzo) flags.push("Opioid detected with expected benzodiazepine therapy: assess sedation/overdose risk and coordination of prescribing.");
    if (hasExpectedOrDetectedOpioid && hasDetectedAlcohol) flags.push("Opioid therapy/exposure + alcohol marker detected: assess respiratory depression and safety risk.");
    if (hasExpectedOrDetectedOpioid && hasDetectedSedative && !hasDetectedBenzo) flags.push("Opioid therapy/exposure + sedating co-exposure detected: assess sedation/overdose risk.");
    if (hasExpectedOudMedicationAbsent) flags.push("OUD treatment context with expected buprenorphine or methadone absent: assess adherence barriers, withdrawal/craving risk, recurrence risk, and whether repeat or definitive testing is needed.");
    if (hasExpectedOudSupportiveMetaboliteAbsent) flags.push("OUD treatment context with expected supportive metabolite absent: review timing, cutoff, specimen validity, panel coverage, adherence barriers, and whether repeat or definitive testing is needed.");
    if (fentanylDetected && state.context === "oud") {
      flags.push("OUD treatment context with fentanyl/norfentanyl detected: review buprenorphine/methadone adequacy, overdose prevention, naloxone, and follow-up intensity.");
    } else if (fentanylDetected && state.context === "chronic_opioid") {
      flags.push("Chronic opioid therapy context with fentanyl/norfentanyl detected: assess overdose risk, medication interactions, nonprescribed exposure, and confirm if the result affects prescribing.");
    } else if (fentanylDetected) {
      flags.push("Fentanyl/norfentanyl detected: review overdose prevention, naloxone, and treatment adequacy.");
    }
    if (detected.some((entry) => entry.id === "xylazine")) flags.push("Xylazine detected or suspected: routine UDS usually misses it; naloxone still treats opioid co-exposure, but xylazine effects require supportive care.");
    if (state.context === "pregnancy") flags.push("Pregnancy/perinatal context: confirm unexpected results before high-consequence action and follow local policy/law.");
    if (state.context === "adolescent") flags.push("Adolescent context: consider consent/confidentiality rules and avoid punitive use.");
    return [...new Set(flags)];
  }

  function confirmationLevelFor({ notExplained, absentReviews, panelWarnings, validityWarnings }) {
    const hasResultInput = state.detected.length > 0 || state.absent.length > 0;
    const hasUnexpectedAbsent = absentReviews.some((row) =>
      ["unexpected_negative", "supportive_absent"].includes(row.severity),
    );
    const hasPanelLimitedAbsent = absentReviews.some((row) =>
      ["panel_limited", "non_actionable"].includes(row.severity),
    );
    const hasHardValidityProblem =
      ["invalid", "adulterated"].includes(state.validityFlag) ||
      hasCriticalValidityDetailProblem();
    const hasActionableUncertainty =
      notExplained.length > 0 ||
      hasUnexpectedAbsent ||
      hasPanelLimitedAbsent ||
      panelWarnings.length > 0 ||
      validityWarnings.length > 0 ||
      state.method === "unknown";

    if (!hasResultInput) return "Needs result input";
    if (hasHardValidityProblem) return "Repeat / consult lab";
    if (state.consequence === "high" && hasActionableUncertainty) return "Confirm before action";
    if (state.consequence === "high") return "High-consequence review";
    if (state.method === "immunoassay" && (notExplained.length || hasUnexpectedAbsent)) return "Confirmation recommended";
    if (notExplained.length || hasUnexpectedAbsent) return "Clarify / confirm";
    if (hasPanelLimitedAbsent || panelWarnings.length) return "Verify panel";
    if (validityWarnings.length) return "Interpret cautiously";
    return "Routine documentation";
  }

  function labelForResult({ explained, contextNeeded, notExplained, absentReviews, panelWarnings, validityWarnings }) {
    const hasResultInput = state.detected.length > 0 || state.absent.length > 0;
    if (!hasResultInput) return { label: "Incomplete", tone: "neutral" };
    if (["invalid", "adulterated"].includes(state.validityFlag) || hasCriticalValidityDetailProblem()) return { label: "Specimen-limited", tone: "warning" };
    if (notExplained.length && !state.expected.length) return { label: "Detected finding without expected medication context", tone: "caution" };
    if (notExplained.length) return { label: "Unexpected positive", tone: "warning" };
    if (absentReviews.some((row) => row.severity === "unexpected_negative")) return { label: "Unexpected negative", tone: "caution" };
    if (absentReviews.some((row) => row.severity === "supportive_absent")) return { label: "Supportive finding absent / context-dependent", tone: "caution" };
    if (absentReviews.some((row) => ["panel_limited", "non_actionable"].includes(row.severity))) return { label: "Assay-limited / panel-dependent", tone: "method" };
    if (contextNeeded.length) return { label: "Source-ambiguous / context-dependent", tone: "caution" };
    if (panelWarnings.length) return { label: "Assay-limited / panel-dependent", tone: "method" };
    if (validityWarnings.length && state.absent.length) return { label: "Specimen-limited absent finding", tone: "caution" };
    if (explained.length) return { label: "Consistent / expected", tone: "compatible" };
    if (state.detected.length && !state.expected.length) return { label: "Detected finding without expected medication context", tone: "caution" };
    return { label: "Incomplete", tone: "neutral" };
  }

  function nextStepFor({ label, confirmationLevel, notExplained, contextNeeded, absentConcerns, panelWarnings, validityWarnings }) {
    if (confirmationLevel === "Confirm before action") return "Because the result may change care or has high consequence, obtain definitive confirmation or lab/toxicology input before major management changes.";
    if (!state.detected.length && !state.absent.length) return "Add detected positive/present findings or verified tested-but-absent findings to complete the reconciliation.";
    if (["invalid", "adulterated"].includes(state.validityFlag) || hasCriticalValidityDetailProblem()) return "Do not interpret this result as final. Repeat collection per policy or consult the laboratory.";
    if (notExplained.length && !state.expected.length) return "Add expected medications/substances, recent administered medications, or reported exposures if known; otherwise review as a detected finding requiring clinical context.";
    if (notExplained.length && state.method === "immunoassay") return "Discuss nonjudgmentally, review medication/OTC exposures, and confirm unexpected positives with definitive testing before changing care.";
    if (notExplained.length) return "Review medication/substance history, timing, and panel details; consult the lab or confirm if the result affects management.";
    if (absentConcerns.length && !state.absentVerified) return "Verify panel coverage and reportable analytes before interpreting any absent result.";
    if (absentConcerns.length) return "Review timing, cutoff, specimen validity, medication history, and whether repeat testing or lab input is needed before treating absent expected findings as clinically meaningful.";
    if (panelWarnings.length) return "Resolve panel/profile limitations before relying on absent or class-screen findings.";
    if (validityWarnings.length && state.absent.length) return "Interpret absent findings cautiously because specimen validity is incomplete or limited.";
    if (validityWarnings.length) return "Address specimen-validity limitations before relying on the result.";
    if (contextNeeded.length) return "Interpret with timing, cutoff, quantitative values if available, and the full parent/metabolite pattern.";
    if (label === "Consistent / expected") return "Document as compatible with the entered expected medication/substance list, assuming timing, cutoff, and specimen validity fit.";
    if (label === "Detected finding without expected medication context") return "Add expected medications/substances or review as an unexpected detected finding if no explanation is known.";
    return "Document expected negatives or compatible findings as appropriate, while avoiding dose, timing, impairment, diversion, or intent conclusions.";
  }

  function buildCanSupport(explained, contextNeeded, notExplained) {
    const rows = [];

    if (hasAbsentOnlyInput()) {
      rows.push("Absent-only interpretation can support limited conclusions only when panel coverage, timing, cutoff, and specimen validity are verified.");
    }

    if (explained.length) {
      rows.push(...explained.slice(0, 3));
    }

    if (contextNeeded.length) {
      rows.push("Some findings may be compatible but require source/timing/cutoff context.");
    }

    if (notExplained.length && !state.expected.length) {
      rows.push("Detected finding(s) can be documented as present, but clinical meaning requires medication, administration, exposure, panel, and timing context.");
    } else if (notExplained.length) {
      rows.push("The entered pattern identifies at least one unexpected finding that needs clarification.");
    }

    if (!rows.length) {
      rows.push("A structured review once expected medications, detected findings, method, panel, and validity are entered.");
    }

    return rows;
  }

  function hasAbsentOnlyInput() {
    return state.absent.length > 0 && state.detected.length === 0;
  }

  function standardCannotConclude() {
    return [
      "Exact dose taken",
      "Exact time of last use",
      "Current impairment",
      "Diversion, misuse, intent, or deception",
      "Legal, employment, custody, or forensic conclusions",
    ];
  }

  function buildValidityDetailSummary() {
    const details = [];
    const creatinine = state.validityDetails.creatinine.trim();
    const specificGravity = state.validityDetails.specificGravity.trim();
    const ph = state.validityDetails.ph.trim();
    const oxidants = state.validityDetails.oxidants;

    if (creatinine) {
      details.push(`creatinine ${creatinine} mg/dL`);
    }

    if (specificGravity) {
      details.push(`specific gravity ${specificGravity}`);
    }

    if (ph) {
      details.push(`pH ${ph}`);
    }

    if (oxidants && oxidants !== "unknown") {
      details.push(`oxidants/adulterants ${oxidants}`);
    }

    return details;
  }

  function buildChartNote({
    label,
    confirmationLevel,
    nextStep,
    safetyFlags,
    methodNotes,
    panelWarnings,
    validityWarnings,
    absentConcerns,
    expectedNegatives,
    expectedParentNotEntered,
  }) {
    const expected = state.expected.map(itemLabel).join(", ") || "none entered";
    const detected = state.detected.map(itemLabel).join(", ") || "none entered";
    const absent = state.absent.map(itemLabel).join(", ") || "none entered";
    const validityDetailSummary = buildValidityDetailSummary();
    return [
      "UDS clinical reference review, no patient identifiers entered.",
      `Context: ${formatContext(state.context)}. Decision impact: ${state.consequence}.`,
      `Result source: ${formatResultSource(state.resultSource)}. Method/panel: ${formatMethod(state.method)} / ${selectedProfile().label}. Specimen validity: ${formatValidity(state.validityFlag)}.`,
      validityDetailSummary.length ? `Optional validity details entered: ${validityDetailSummary.join("; ")}.` : "",
      `Expected: ${expected}. Detected: ${detected}. Tested-but-absent: ${absent}. Absent coverage verified: ${state.absentVerified ? "yes" : "no"}.`,
      absentConcerns.length ? `Absent-finding concerns: ${absentConcerns.slice(0, 3).join("; ")}.` : "Absent-finding concerns: none generated from entered findings.",
      expectedNegatives.length ? `Expected negative/absent findings: ${expectedNegatives.slice(0, 3).join("; ")}.` : "Expected negative/absent findings: none generated from entered findings.",
      expectedParentNotEntered.length ? `Expected parent findings to check: ${expectedParentNotEntered.slice(0, 3).join("; ")}.` : "",
      `Interpretation label: ${label}. Confirmation threshold: ${confirmationLevel}.`,
      safetyFlags.length ? `Safety flags: ${safetyFlags.join("; ")}.` : "Safety flags: none generated from entered findings.",
      validityWarnings.length ? `Specimen validity limitations: ${validityWarnings.join("; ")}.` : "Specimen validity limitations: none generated from selected flag.",
      methodNotes.length ? `Method notes: ${methodNotes.slice(0, 2).join("; ")}.` : "Method notes: none generated from selected method.",
      panelWarnings.length ? `Panel limitations: ${panelWarnings.slice(0, 3).join("; ")}.` : "Panel limitations: none generated from selected profile.",
      `Next step: ${nextStep}`,
      "Limits: urine testing alone does not prove dose, exact timing, impairment, diversion, intent, or legal/forensic conclusions.",
    ].filter(Boolean).join("\n");
  }

  function buildPatientScript({ label, nextStep }) {
    return [
      "This urine result is being reviewed as a safety tool, not as a punishment.",
      `The current interpretation is: ${label}.`,
      "Urine screens can be incomplete or sometimes misleading, depending on the exact panel and method.",
      `The safest next step is: ${nextStep}`,
      "Before making major decisions, unexpected or high-consequence results should be clarified or confirmed when appropriate.",
    ].join(" ");
  }

  function formatContext(value) {
    return {
      chronic_opioid: "chronic opioid therapy",
      oud: "OUD treatment",
      benzo: "benzodiazepine prescribing",
      stimulant: "stimulant prescribing",
      ed: "ED / urgent care",
      psychiatry: "psychiatry",
      pregnancy: "pregnancy / perinatal",
      adolescent: "adolescent",
      forensic_nonclinical: "legal / employment / forensic - not supported",
      other: "other clinical context",
    }[value] || value;
  }

  function formatMethod(value) {
    return {
      unknown: "unknown method",
      immunoassay: "immunoassay screen",
      definitive: "definitive LC/GC-MS",
      mixed: "mixed screen + confirmation",
    }[value] || value;
  }

  function formatValidity(value) {
    return {
      unknown: "unknown / not reported",
      normal: "appears interpretable",
      dilute: "dilute - negatives less reliable",
      invalid: "invalid / do not interpret",
      adulterated: "possible adulteration / consult lab",
    }[value] || value;
  }

  async function copyText(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  }

  function addChip(key, rawValue) {
    const entry = findEnterPickerItem(rawValue);
    return addChipById(key, entry?.id);
  }

  function formatResultSource(value) {
    return {
      unknown: "unknown source",
      poc: "point-of-care cup/card",
      lab_screen: "laboratory immunoassay",
      lab_definitive: "laboratory definitive LC/GC-MS",
    }[value] || value;
  }

  function addChipById(key, id) {
    const entry = getItem(id);
    if (!entry || state[key].includes(entry.id)) return false;
    state[key] = [...state[key], entry.id];
    render();
    return true;
  }

  function removeChip(key, id) {
    state[key] = state[key].filter((entryId) => entryId !== id);
    render();
  }

  function addPanelAnalyte(rawValue) {
    const entry = findEnterPickerItem(rawValue);
    return addPanelAnalyteById(entry?.id);
  }

  function addPanelAnalyteById(id) {
    const entry = getItem(id);
    if (!entry || state.panelDraft.analytes.some((row) => row.id === entry.id)) return false;
    state.panelDraft.analytes.push(coverage(entry.id, state.panelDraftCoverageStatus || "included"));
    render();
    return true;
  }

  function hasIdentifierLikeText(value) {
    const text = String(value || "");
    return /\b(MRN|DOB|patient|subject|accession|encounter|order\s*#?|account|acct|case\s*#?|medical record)\b/i.test(text)
      || /\b\d{5,}\b/.test(text)
      || /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(text);
  }

  function validatePanelDraft() {
    const label = state.panelDraft.label.trim();
    const note = state.panelDraft.note.trim();

    if (!label) return "Enter a non-identifying profile label.";
    if (label.length > 80) return "Profile label should be 80 characters or fewer.";
    if ([label, note].some(hasIdentifierLikeText)) {
      return "Remove identifiers. Do not enter patient names, DOBs, MRNs, accession numbers, order numbers, account numbers, or encounter numbers.";
    }
    if (!state.panelDraft.analytes.length) {
      return "Add at least one analyte or known panel gap before saving a local profile.";
    }

    return "";
  }

  function savePanelDraft() {
    const validationMessage = validatePanelDraft();
    if (validationMessage) {
      state.panelDraftError = validationMessage;
      render();
      return;
    }

    state.panelDraftError = "";
    const label = state.panelDraft.label.trim();
    const profileId = `local_${Date.now()}`;
    state.localProfiles.push({
      id: profileId,
      label,
      method: state.panelDraft.method,
      note: state.panelDraft.note || `Reviewed ${state.panelDraft.reviewDate || "date not set"}. Non-identifying local profile.`,
      validityIncluded: Boolean(state.panelDraft.validityIncluded),
      analytes: dedupeCoverageEntries([...state.panelDraft.analytes]),
      reviewDate: state.panelDraft.reviewDate,
    });
    state.panelDraft = blankPanelDraft();
    state.panelDraftCoverageStatus = "included";
    saveProfiles();
    render();
  }

  function deletePanel(id) {
    state.localProfiles = state.localProfiles.filter((profile) => profile.id !== id);
    if (state.panelId === id) state.panelId = "unknown";
    saveProfiles();
    render();
  }

  function refreshChipPicker(input) {
    const key = input?.dataset?.chipInput;
    if (!key) return;
    const picker = root.querySelector(`[data-chip-picker="${key}"]`);
    if (!picker) return;
    picker.innerHTML = renderPickerOptions(key, input.value || "");
    picker.classList.remove("is-hidden");
    input.setAttribute("aria-expanded", "true");
  }

  function hideChipPickers() {
    root.querySelectorAll("[data-chip-picker]").forEach((picker) => {
      picker.classList.add("is-hidden");
    });
    root.querySelectorAll("[data-chip-input]").forEach((input) => {
      input.setAttribute("aria-expanded", "false");
    });
  }

  function clearAndClosePickerInput(key) {
    window.setTimeout(() => {
      const nextInput = root.querySelector(`[data-chip-input="${key}"]`);
      if (!(nextInput instanceof HTMLInputElement)) return;
      nextInput.value = "";
      nextInput.focus();
      const picker = root.querySelector(`[data-chip-picker="${key}"]`);
      if (picker) {
        picker.innerHTML = "";
        picker.classList.add("is-hidden");
      }
      nextInput.setAttribute("aria-expanded", "false");
    }, 0);
  }

  function addFromPicker(key, id) {
    const added = key === "panelAnalyte" ? addPanelAnalyteById(id) : addChipById(key, id);
    clearAndClosePickerInput(key);
    return added;
  }

  function attachEvents() {
    root.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-mode]");
      if (modeButton) {
        state.mode = modeButton.dataset.mode;
        render();
        return;
      }

      const action = event.target.closest("[data-action]");
      if (!action) {
        const chipInput = event.target.closest("[data-chip-input]");
        if (chipInput instanceof HTMLInputElement) {
          refreshChipPicker(chipInput);
          return;
        }
        if (!event.target.closest("[data-chip-picker]")) hideChipPickers();
        return;
      }
      const actionName = action.dataset.action;
      if (actionName === "pick-chip") {
        addFromPicker(action.dataset.key, action.dataset.id);
        return;
      }
      if (actionName === "add-chip") {
        const key = action.dataset.key;
        const input = root.querySelector(`[data-chip-input="${key}"]`);
        const added = addChip(key, input?.value || "");
        if (added) clearAndClosePickerInput(key);
        return;
      }
      if (actionName === "remove-chip") {
        removeChip(action.dataset.key, action.dataset.id);
        return;
      }
      if (actionName === "clear-interpret") {
        state.expected = [];
        state.detected = [];
        state.absent = [];
        state.absentVerified = false;
        state.validityFlag = "unknown";
        state.validityDetails = blankValidityDetails();
        state.validityDetailsOpen = false;
        render();
        return;
      }
      if (actionName === "reset-validity-details") {
        state.validityDetails = blankValidityDetails();
        state.validityDetailsOpen = true;
        render();
        return;
      }
      if (actionName === "copy-summary") {
        copyText(state.lastSummary);
        return;
      }
      if (actionName === "copy-short-summary") {
        copyText(state.lastShortSummary);
        return;
      }
      if (actionName === "copy-patient") {
        copyText(state.lastPatientScript);
        return;
      }
      if (actionName === "copy-test") {
        const q = clinicalQuestions.find((entry) => entry.id === state.questionId) || clinicalQuestions[0];
        copyText(`UDS test selection: ${q.label}\nRecommended: ${q.recommended}\nAvoid: ${q.avoid}\nExpected target analytes: ${q.expected}`);
        return;
      }
      if (actionName === "select-lookup") {
        state.lookupId = action.dataset.id;
        const output = root.querySelector("#udsLookupOutput");
        if (output) {
          output.innerHTML = renderLookupOutput();
        } else {
          render();
        }
        return;
      }
      if (actionName === "copy-lookup") {
        const selected = getItem(state.lookupId) || items[0];
        copyText(`UDS lookup: ${selected.name}\nBottom line: ${selected.note}\nBest test: ${selected.bestTest}\nApproximate window: ${selected.window}\nLimits: ${standardCannotConclude().join("; ")}`);
        return;
      }
      if (actionName === "add-panel-analyte") {
        const input = root.querySelector(`[data-chip-input="panelAnalyte"]`);
        const added = addPanelAnalyte(input?.value || "");
        if (added) clearAndClosePickerInput("panelAnalyte");
        return;
      }
      if (actionName === "remove-panel-analyte") {
        state.panelDraft.analytes = state.panelDraft.analytes.filter((row) => row.id !== action.dataset.id);
        render();
        return;
      }
      if (actionName === "save-panel") {
        savePanelDraft();
        return;
      }
      if (actionName === "delete-panel") {
        deletePanel(action.dataset.id);
        return;
      }
      if (actionName === "copy-panel-json") {
        const profile = state.localProfiles.find((row) => row.id === action.dataset.id);
        if (profile) {
          copyText(JSON.stringify(profile, null, 2));
        }
        return;
      }
      if (actionName === "reset-panel-draft") {
        state.panelDraft = blankPanelDraft();
        state.panelDraftCoverageStatus = "included";
        state.panelDraftError = "";
        render();
      }
    });

    root.addEventListener(
      "toggle",
      (event) => {
        const details = event.target.closest?.("[data-validity-details]");
        if (details) {
          state.validityDetailsOpen = details.open;
        }
      },
      true,
    );

    root.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
      const validityDetail = target.dataset.validityDetail;
      if (validityDetail) {
        state.validityDetails[validityDetail] = target.value;
        state.validityDetailsOpen = true;
        render();
        return;
      }
      const field = target.dataset.field;
      if (field) {
        if (field === "absentVerified") state.absentVerified = target.checked;
        else if (field === "resultSource") {
          state.resultSource = target.value;
          if (target.value === "poc" || target.value === "lab_screen") state.method = "immunoassay";
          if (target.value === "lab_definitive") state.method = "definitive";
        }
        else state[field] = target.value;
        render();
        return;
      }
      const panelField = target.dataset.panelField;
      if (panelField) {
        state.panelDraftError = "";
        if (panelField === "validityIncluded") state.panelDraft.validityIncluded = target.checked;
        else if (panelField === "panelDraftCoverageStatus") state.panelDraftCoverageStatus = target.value;
        else state.panelDraft[panelField] = target.value;
        render();
      }
    });

    root.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      const validityDetail = target.dataset.validityDetail;
      if (validityDetail) {
        state.validityDetails[validityDetail] = target.value;
        return;
      }
      if (target.dataset.chipInput) {
        refreshChipPicker(target);
        return;
      }
      if (target.dataset.field === "lookupQuery") {
        state.lookupQuery = target.value;
        const results = root.querySelector("#udsLookupResults");
        if (results) {
          results.innerHTML = renderLookupResults();
        }
        return;
      }
      const panelField = target.dataset.panelField;
      if (panelField) state.panelDraftError = "";
      if (panelField === "panelDraftCoverageStatus") state.panelDraftCoverageStatus = target.value;
      else if (panelField) state.panelDraft[panelField] = target.value;
    });

    root.addEventListener("focusin", (event) => {
      const input = event.target.closest("[data-chip-input]");
      if (input instanceof HTMLInputElement) refreshChipPicker(input);
    });

    root.addEventListener("keydown", (event) => {
      const input = event.target.closest("[data-chip-input]");
      if (!input) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        hideChipPickers();
        return;
      }
      if (event.key !== "Enter") return;
      event.preventDefault();
      const key = input.dataset.chipInput;
      const added = key === "panelAnalyte" ? addPanelAnalyte(input.value) : addChip(key, input.value);
      if (added) clearAndClosePickerInput(key);
    });
  }

  function snapshotState() {
    return {
      context: state.context,
      consequence: state.consequence,
      resultSource: state.resultSource,
      method: state.method,
      panelId: state.panelId,
      expected: [...state.expected],
      detected: [...state.detected],
      absent: [...state.absent],
      absentVerified: state.absentVerified,
      validityFlag: state.validityFlag,
      validityDetails: { ...state.validityDetails },
      validityDetailsOpen: state.validityDetailsOpen,
    };
  }

  function restoreState(snapshot) {
    Object.assign(state, {
      ...snapshot,
      expected: [...snapshot.expected],
      detected: [...snapshot.detected],
      absent: [...snapshot.absent],
      validityDetails: { ...snapshot.validityDetails },
      validityDetailsOpen: snapshot.validityDetailsOpen,
    });
  }

  function runCase(name, patch, assertFn) {
    const previous = snapshotState();
    const previousLocalProfiles = [...state.localProfiles];
    const { localProfileForTest, ...casePatch } = patch;

    if (localProfileForTest) {
      state.localProfiles = [...state.localProfiles, localProfileForTest];
    }

    Object.assign(state, {
      expected: [],
      detected: [],
      absent: [],
      absentVerified: false,
      validityDetails: blankValidityDetails(),
      validityDetailsOpen: false,
      context: "chronic_opioid",
      consequence: "moderate",
      resultSource: "unknown",
      method: "unknown",
      panelId: "unknown",
      validityFlag: "unknown",
      ...casePatch,
    });

    let result;
    let passed = false;
    try {
      result = analyzeInterpretation();
      passed = Boolean(assertFn(result));
    } finally {
      restoreState(previous);
      state.localProfiles = previousLocalProfiles;
    }

    return {
      name,
      passed,
      label: result?.label || "Validation failed before result",
      confirmationLevel: result?.confirmationLevel || "Unavailable",
      nextStep: result?.nextStep || "Review validation case.",
    };
  }

  window.runUdsGoldenCases = function runUdsGoldenCases() {
    const testBroadDefinitiveProfile = {
      id: "test_broad_definitive",
      label: "Test broad definitive profile",
      method: "definitive",
      note: "Temporary test profile",
      validityIncluded: true,
      analytes: [
        "morphine", "codeine", "6mam", "hydrocodone", "norhydrocodone",
        "hydromorphone", "oxycodone", "noroxycodone", "oxymorphone",
        "fentanyl", "norfentanyl", "buprenorphine", "norbuprenorphine",
        "methadone", "eddp", "tramadol", "odesmethyltramadol",
        "diazepam", "nordiazepam", "temazepam", "oxazepam",
        "clonazepam", "aminoclonazepam7", "lorazepam", "alprazolam",
        "alpha_hydroxyalprazolam", "amphetamine", "methamphetamine",
        "methylphenidate", "ritalinic_acid", "benzoylecgonine",
        "thc_cooh", "etg", "ets", "gabapentin", "pregabalin",
        "zolpidem", "mitragynine", "xylazine",
      ].map((id) => coverage(id, "included")),
    };

    return [
      runCase(
        "Demo broad definitive profile warns before clinical reliance",
        {
          method: "definitive",
          panelId: "example_broad_definitive",
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "normal",
        },
        (result) =>
          /demonstration|demo|verified local/i.test(result.panelWarnings.join(" ")) &&
          /Verify panel|Confirm|High-consequence|panel/i.test(`${result.confirmationLevel} ${result.label}`),
      ),
      runCase(
        "Detected finding without expected context uses softer label",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: [],
          detected: ["thc_cooh"],
          validityFlag: "normal",
        },
        (result) => /without expected medication context/i.test(result.label),
      ),
      runCase(
        "Detected finding without expected context has non-accusatory support line",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: [],
          detected: ["benzoylecgonine"],
          validityFlag: "normal",
        },
        (result) =>
          /without expected medication context/i.test(result.label) &&
          result.canSupport.some((line) => /clinical meaning requires/i.test(line)),
      ),
      runCase(
        "Absent finding with profile missing validity mapping warns",
        {
          method: "definitive",
          panelId: "test_local_no_validity",
          expected: ["oxycodone"],
          absent: ["oxycodone"],
          absentVerified: true,
          validityFlag: "unknown",
          localProfileForTest: {
            id: "test_local_no_validity",
            label: "Test local profile without validity",
            method: "definitive",
            note: "Temporary test profile",
            validityIncluded: false,
            analytes: [coverage("oxycodone", "included")],
          },
        },
        (result) => /validity/i.test(result.panelWarnings.join(" ")),
      ),
      runCase(
        "Detected analyte not mapped in selected local profile warns",
        {
          method: "definitive",
          panelId: "test_local_missing_fentanyl",
          expected: ["fentanyl"],
          detected: ["norfentanyl"],
          validityFlag: "normal",
          localProfileForTest: {
            id: "test_local_missing_fentanyl",
            label: "Test local profile missing norfentanyl",
            method: "definitive",
            note: "Temporary test profile",
            validityIncluded: true,
            analytes: [coverage("fentanyl", "included")],
          },
        },
        (result) => /not mapped|selected panel profile/i.test(result.panelWarnings.join(" ")),
      ),
      runCase(
        "Expected analyte missing from local profile warns after result input",
        {
          method: "definitive",
          panelId: "test_local_missing_expected_parent",
          expected: ["oxycodone"],
          detected: ["oxymorphone"],
          validityFlag: "normal",
          localProfileForTest: {
            id: "test_local_missing_expected_parent",
            label: "Test local profile missing oxycodone",
            method: "definitive",
            note: "Temporary test profile",
            validityIncluded: true,
            analytes: [coverage("oxymorphone", "included")],
          },
        },
        (result) => /expected but not mapped/i.test(result.panelWarnings.join(" ")),
      ),
      runCase(
        "POC source with definitive method warns",
        {
          resultSource: "poc",
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "normal",
        },
        (result) => /point-of-care.*definitive|lab confirmation/i.test(result.panelWarnings.join(" ")),
      ),
      runCase(
        "Absent-only interpretation gives cautious support",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: [],
          absent: ["oxycodone"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) =>
          /Unexpected negative|absent/i.test(result.label) &&
          /timing|cutoff|validity|meaningful/i.test(result.nextStep) &&
          result.canSupport.some((line) => /Absent-only interpretation/i.test(line)),
      ),
      runCase(
        "Compatible definitive expected result should not require verify panel",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          absent: [],
          absentVerified: false,
          validityFlag: "normal",
          consequence: "moderate",
        },
        (result) =>
          /Consistent|expected/i.test(result.label) &&
          /Routine documentation/i.test(result.confirmationLevel),
      ),
      runCase(
        "Low creatinine with positive-only compatible result stays compatible",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "normal",
          validityDetails: { ...blankValidityDetails(), creatinine: "12" },
        },
        (result) =>
          /Consistent|expected/i.test(result.label) &&
          /Routine documentation/i.test(result.confirmationLevel),
      ),
      runCase(
        "Expected opioid plus detected alcohol marker creates safety flag",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["etg"],
          validityFlag: "normal",
        },
        (result) => result.safetyFlags.some((line) => /opioid.*alcohol|alcohol.*opioid/i.test(line)),
      ),
      runCase(
        "OUD expected medication absent creates workflow safety flag",
        {
          context: "oud",
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["buprenorphine"],
          absent: ["buprenorphine"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) => result.safetyFlags.some((line) => /adherence barriers|withdrawal|recurrence/i.test(line)),
      ),
      runCase(
        "OUD expected supportive metabolite absent creates workflow flag",
        {
          context: "oud",
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["buprenorphine"],
          absent: ["norbuprenorphine"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) => result.safetyFlags.some((line) => /supportive metabolite|timing|adherence/i.test(line)),
      ),
      runCase(
        "Strong supportive metabolite suppresses expected parent reminder",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["buprenorphine"],
          detected: ["norbuprenorphine"],
          validityFlag: "normal",
        },
        (result) =>
          !result.expectedParentNotEntered.some((line) => /Buprenorphine is expected/i.test(line)),
      ),
      runCase(
        "Absent supportive metabolite does not suppress expected parent reminder",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["buprenorphine"],
          absent: ["norbuprenorphine"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) =>
          result.expectedParentNotEntered.some((line) => /Buprenorphine is expected/i.test(line)),
      ),
      runCase(
        "Low creatinine validity detail cautions absent findings",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          absent: ["oxycodone"],
          absentVerified: true,
          validityFlag: "normal",
          validityDetails: { ...blankValidityDetails(), creatinine: "12" },
        },
        (result) => result.validityWarnings.some((line) => /Creatinine is low/i.test(line)),
      ),
      runCase(
        "Abnormal oxidants create specimen-limited result",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "normal",
          validityDetails: { ...blankValidityDetails(), oxidants: "abnormal" },
        },
        (result) =>
          /Specimen-limited/i.test(result.label) &&
          /Repeat|consult/i.test(result.nextStep),
      ),
      runCase(
        "Critical validity detail without result remains incomplete",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          detected: [],
          absent: [],
          validityFlag: "normal",
          validityDetails: { ...blankValidityDetails(), oxidants: "abnormal" },
        },
        (result) =>
          /Incomplete/i.test(result.label) &&
          /Needs result input/i.test(result.confirmationLevel),
      ),
      runCase(
        "OUD fentanyl finding creates context-specific safety flag",
        {
          context: "oud",
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          detected: ["norfentanyl"],
          validityFlag: "normal",
        },
        (result) => result.safetyFlags.some((line) => /OUD treatment context.*fentanyl/i.test(line)),
      ),
      runCase(
        "Unknown validity with compatible positive does not overpower compatibility",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "unknown",
        },
        (result) => /Consistent|expected/i.test(result.label),
      ),
      runCase(
        "Generic opiate screen with methadone is a panel blind spot",
        {
          method: "immunoassay",
          panelId: "generic_opiate_screen",
          expected: ["methadone"],
          absent: ["methadone"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) => /methadone|EDDP|targeted|definitive/i.test(
          [...result.panelWarnings, result.nextStep].join(" "),
        ),
      ),
      runCase(
        "Forensic context returns hard stop",
        {
          context: "forensic_nonclinical",
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          detected: ["oxycodone"],
          validityFlag: "normal",
        },
        (result) => /not supported/i.test(result.label) && /Do not use/i.test(result.confirmationLevel),
      ),
      runCase(
        "Fentanyl absent on generic opiate screen is panel-limited",
        {
          method: "immunoassay",
          panelId: "generic_opiate_screen",
          expected: ["fentanyl"],
          absent: ["norfentanyl"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) => /does not exclude fentanyl|generic opiate/i.test(
          [...result.panelWarnings, result.nextStep].join(" "),
        ),
      ),
      runCase(
        "Hydrocodone expected with hydromorphone detected is source-ambiguous",
        {
          method: "definitive",
          panelId: "targeted_definitive",
          expected: ["hydrocodone"],
          detected: ["hydromorphone"],
          validityFlag: "normal",
        },
        (result) => /source|context|compatible|hydrocodone/i.test(
          [...result.contextNeeded, ...result.canSupport, result.label].join(" "),
        ),
      ),
      runCase(
        "THC-COOH detected does not imply impairment",
        {
          method: "definitive",
          panelId: "targeted_definitive",
          detected: ["thc_cooh"],
          validityFlag: "normal",
        },
        (result) => result.cannotSupport.some((line) => /impairment/i.test(line)),
      ),
      runCase(
        "Expected medication absent with unknown panel is non-actionable",
        {
          method: "unknown",
          panelId: "unknown",
          expected: ["buprenorphine"],
          absent: ["buprenorphine"],
          absentVerified: false,
          validityFlag: "unknown",
        },
        (result) => /panel|coverage|unknown|verify/i.test(
          [...result.absentConcerns, ...result.panelWarnings, result.nextStep].join(" "),
        ),
      ),
      runCase(
        "Invalid specimen is specimen-limited",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          validityFlag: "invalid",
        },
        (result) => /Specimen-limited|Repeat|consult/i.test(
          `${result.label} ${result.confirmationLevel} ${result.nextStep}`,
        ),
      ),
      runCase(
        "Oxycodone detected and fentanyl absent should not become unexpected negative",
        {
          method: "definitive",
          panelId: "test_broad_definitive",
          localProfileForTest: testBroadDefinitiveProfile,
          expected: ["oxycodone"],
          detected: ["oxycodone"],
          absent: ["fentanyl"],
          absentVerified: true,
          validityFlag: "normal",
        },
        (result) => !/Unexpected negative/i.test(result.label),
      ),
    ];
  };

  window.copyFailedUdsGoldenCases = async function copyFailedUdsGoldenCases() {
    const results = window.runUdsGoldenCases();
    const failed = results.filter((row) => !row.passed);
    const text = failed.length
      ? failed.map((row) => [
        `FAILED: ${row.name}`,
        `Label: ${row.label}`,
        `Confirmation: ${row.confirmationLevel}`,
        `Next step: ${row.nextStep}`,
      ].join("\n")).join("\n\n")
      : "All UDS golden cases passed.";

    await copyText(text);
    return { failed: failed.length, results };
  };

  window.copyUdsDebugState = async function copyUdsDebugState() {
    const result = analyzeInterpretation();
    const payload = {
      appVersion: APP_VERSION,
      context: state.context,
      consequence: state.consequence,
      resultSource: state.resultSource,
      method: state.method,
      panelId: state.panelId,
      expected: [...state.expected],
      detected: [...state.detected],
      absent: [...state.absent],
      absentVerified: state.absentVerified,
      validityFlag: state.validityFlag,
      validityDetails: { ...state.validityDetails },
      validityDetailsOpen: state.validityDetailsOpen,
      label: result.label,
      confirmationLevel: result.confirmationLevel,
      nextStep: result.nextStep,
      shortSummary: result.shortSummary,
      panelWarnings: result.panelWarnings,
      methodNotes: result.methodNotes,
      validityWarnings: result.validityWarnings,
      absentConcerns: result.absentConcerns,
      expectedNegatives: result.expectedNegatives,
      expectedParentNotEntered: result.expectedParentNotEntered,
      safetyFlags: result.safetyFlags,
    };

    await copyText(JSON.stringify(payload, null, 2));
    return payload;
  };

  window.testUdsCoverageDedupe = function testUdsCoverageDedupe() {
    return dedupeCoverageEntries([
      coverage("fentanyl", "included"),
      coverage("fentanyl", "not_included"),
    ]);
  };

  setRootShell();
  attachEvents();
  render();
})();
