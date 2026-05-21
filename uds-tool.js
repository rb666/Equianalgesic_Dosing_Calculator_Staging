(() => {
  const root = document.querySelector("#udsModal");

  if (!root) {
    return;
  }

  const sources = {
    mayoOpiates: {
      title: "Mayo Clinic Laboratories - Opiates confirmation",
      url: "https://www.mayocliniclabs.com/test-catalog/drug-book/specific-drug-groups/opiates",
      type: "lab reference",
    },
    mayoOxycodone: {
      title: "Mayo Clinic Laboratories - Oxycodone with metabolite confirmation",
      url: "https://www.mayocliniclabs.com/test-catalog/overview/62616",
      type: "lab reference",
    },
    mayoOpiateInterpretation: {
      title: "Mayo Clinic Labs Insights - Opiate test interpretation",
      url: "https://news.mayocliniclabs.com/2021/05/03/interpretation-of-qualitative-and-quantitative-urine-opiate-tests-for-pain-management-patients/",
      type: "clinical lab guidance",
    },
    arupDrugTesting: {
      title: "ARUP Consult - Drug Testing",
      url: "https://arupconsult.com/content/drug-testing",
      type: "clinical lab guidance",
    },
    arupBenzodiazepines: {
      title: "ARUP Consult - Benzodiazepine Metabolism",
      url: "https://arupconsult.com/algorithm/benzodiazepine-metabolism-diagram",
      type: "metabolism diagram",
    },
    arupDetectionWindows: {
      title: "ARUP Consult - Drug Half-Lives and Urine Detection Windows",
      url: "https://arupconsult.com/content/drug-half-lives-and-urine-detection-windows",
      type: "clinical lab guidance",
    },
    aafp: {
      title: "American Family Physician - Urine Drug Tests: Ordering and Interpretation",
      url: "https://www.aafp.org/pubs/afp/issues/2019/0101/p33.html",
      type: "clinical review",
    },
    uic: {
      title: "UIC Drug Information Group - Urine Drug Screen Interferences",
      url: "https://dig.pharmacy.uic.edu/faqs/2021-2/may-2021-faqs/what-drugs-are-likely-to-interfere-with-urine-drug-screens/",
      type: "drug information review",
    },
  };

  const items = [
    item("morphine", "Morphine", "Opioids", "drug", ["MS Contin", "Roxanol"], "Often 1-3 days", "Morphine-like opiate; also a metabolite of codeine and heroin.", ["mayoOpiates", "arupDetectionWindows"]),
    item("codeine", "Codeine", "Opioids", "drug", ["Tylenol #3"], "Often 1-3 days", "Can produce morphine and small hydrocodone in some contexts.", ["mayoOpiates"]),
    item("norcodeine", "Norcodeine", "Opioids", "finding", [], "Panel dependent", "Supportive codeine metabolite when included.", ["arupDrugTesting"]),
    item("heroin", "Heroin", "Opioids", "drug", ["diacetylmorphine"], "6-MAM is short window; morphine may persist longer", "6-MAM is the specific heroin marker when present.", ["mayoOpiates"]),
    item("6mam", "6-MAM", "Opioids", "finding", ["6-acetylmorphine", "6-monoacetylmorphine"], "Usually less than 1 day", "Specific marker of recent heroin exposure when detected.", ["mayoOpiates"]),
    item("hydrocodone", "Hydrocodone", "Opioids", "drug", ["Norco", "Vicodin", "Lortab"], "Often 1-3 days", "Parent opioid that can produce norhydrocodone, hydromorphone, and dihydrocodeine.", ["mayoOpiates"]),
    item("norhydrocodone", "Norhydrocodone", "Opioids", "finding", [], "Often 1-3 days", "Supportive hydrocodone metabolite.", ["mayoOpiates"]),
    item("hydromorphone", "Hydromorphone", "Opioids", "drug_or_finding", ["Dilaudid"], "Often 1-3 days", "May reflect hydromorphone exposure, hydrocodone metabolism, or minor morphine metabolism.", ["mayoOpiates", "mayoOpiateInterpretation"]),
    item("dihydrocodeine", "Dihydrocodeine", "Opioids", "finding", [], "Often 1-3 days", "Minor/supportive hydrocodone pathway finding.", ["mayoOpiates"]),
    item("oxycodone", "Oxycodone", "Opioids", "drug", ["OxyContin", "Percocet", "Roxicodone"], "Often 1-3 days", "Requires oxycodone-specific assay or definitive testing if routine opiate screen is negative.", ["mayoOpiates", "mayoOxycodone"]),
    item("noroxycodone", "Noroxycodone", "Opioids", "finding", [], "Often 1-3 days", "Supportive oxycodone metabolite.", ["mayoOxycodone"]),
    item("oxymorphone", "Oxymorphone", "Opioids", "drug_or_finding", ["Opana"], "Often 1-3 days", "Can be prescribed directly or appear as oxycodone metabolite.", ["mayoOpiates", "mayoOxycodone"]),
    item("noroxymorphone", "Noroxymorphone", "Opioids", "finding", [], "Often 1-3 days", "Supports oxycodone/oxymorphone pathway when included.", ["mayoOxycodone"]),
    item("fentanyl", "Fentanyl", "Opioids", "drug", ["Duragesic", "Sublimaze"], "Often 1-3 days; longer with chronic exposure", "Not detected by routine opiate immunoassay.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("norfentanyl", "Norfentanyl", "Opioids", "finding", [], "Often 1-3 days; longer with chronic exposure", "Supportive fentanyl metabolite.", ["arupDrugTesting"]),
    item("buprenorphine", "Buprenorphine", "Opioids", "drug", ["Suboxone", "Subutex", "Belbuca", "Butrans"], "Often 2-7 days", "Requires buprenorphine-specific testing or definitive testing.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("norbuprenorphine", "Norbuprenorphine", "Opioids", "finding", [], "Often 2-7 days", "Supports buprenorphine metabolism/exposure.", ["arupDrugTesting"]),
    item("methadone", "Methadone", "Opioids", "drug", ["Dolophine"], "Often 3-10 days", "Requires methadone-specific testing or definitive testing.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("eddp", "EDDP", "Opioids", "finding", ["methadone metabolite"], "Often several days", "Supports methadone ingestion/metabolism.", ["arupDrugTesting"]),
    item("tramadol", "Tramadol", "Opioids", "drug", ["Ultram"], "Often 2-4 days", "Not reliably detected by routine opiate immunoassay.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("odesmethyltramadol", "O-desmethyltramadol", "Opioids", "finding", ["M1 tramadol metabolite"], "Often 2-4 days", "Supportive tramadol metabolite.", ["arupDrugTesting"]),
    item("tapentadol", "Tapentadol", "Opioids", "drug", ["Nucynta"], "Panel dependent", "Requires specific/definitive panel; not a routine opiate screen finding.", ["arupDrugTesting"]),
    item("ndesmethyltapentadol", "N-desmethyltapentadol", "Opioids", "finding", ["tapentadol metabolite"], "Panel dependent", "Supportive tapentadol metabolite when included.", ["arupDrugTesting"]),
    item("naloxone", "Naloxone", "Opioids", "drug_or_finding", ["Narcan"], "Panel dependent", "May appear with naloxone exposure or buprenorphine/naloxone combination products.", ["mayoOpiates", "arupDrugTesting"]),
    item("naltrexone", "Naltrexone", "Opioids", "drug", ["Vivitrol", "ReVia"], "Panel dependent", "Expected antagonist parent drug when tested.", ["arupDrugTesting"]),
    item("6beta_naltrexol", "6-beta-naltrexol", "Opioids", "finding", ["naltrexone metabolite"], "Panel dependent", "Supportive naltrexone metabolite.", ["arupDrugTesting"]),
    item("meperidine", "Meperidine", "Opioids", "drug", ["Demerol"], "Panel dependent", "Optional pain/addiction coverage; requires specific testing.", ["arupDrugTesting"]),
    item("normeperidine", "Normeperidine", "Opioids", "finding", [], "Panel dependent", "Supportive meperidine metabolite.", ["arupDrugTesting"]),

    item("diazepam", "Diazepam", "Benzodiazepines", "drug", ["Valium"], "Long-acting; days to weeks possible", "Shares nordiazepam/temazepam/oxazepam pathway.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("nordiazepam", "Nordiazepam", "Benzodiazepines", "finding", ["desmethyldiazepam"], "Long-acting metabolite", "Shared metabolite from diazepam-type benzodiazepines.", ["arupBenzodiazepines"]),
    item("temazepam", "Temazepam", "Benzodiazepines", "drug_or_finding", ["Restoril"], "Several days; longer with chronic use", "Can be prescribed directly or appear in diazepam-type pathway.", ["arupBenzodiazepines"]),
    item("oxazepam", "Oxazepam", "Benzodiazepines", "drug_or_finding", ["Serax"], "Several days; common terminal metabolite", "Shared terminal benzodiazepine metabolite.", ["arupBenzodiazepines"]),
    item("chlordiazepoxide", "Chlordiazepoxide", "Benzodiazepines", "drug", ["Librium"], "Long-acting; days to weeks possible", "Can produce nordiazepam and oxazepam.", ["arupBenzodiazepines"]),
    item("clorazepate", "Clorazepate", "Benzodiazepines", "drug", ["Tranxene"], "Long-acting; days to weeks possible", "Rapidly converts into nordiazepam pathway.", ["arupBenzodiazepines"]),
    item("alprazolam", "Alprazolam", "Benzodiazepines", "drug", ["Xanax"], "Often 1-3 days", "Alpha-hydroxyalprazolam supports alprazolam exposure.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("alpha_hydroxyalprazolam", "Alpha-hydroxyalprazolam", "Benzodiazepines", "finding", ["alprazolam metabolite"], "Often 1-3 days", "Supportive alprazolam metabolite.", ["arupBenzodiazepines"]),
    item("clonazepam", "Clonazepam", "Benzodiazepines", "drug", ["Klonopin"], "Variable; metabolite often preferred", "7-aminoclonazepam is usually more useful in urine.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("aminoclonazepam7", "7-aminoclonazepam", "Benzodiazepines", "finding", ["7-amino-clonazepam"], "Variable; metabolite target", "Supportive clonazepam metabolite.", ["arupBenzodiazepines"]),
    item("lorazepam", "Lorazepam", "Benzodiazepines", "drug", ["Ativan"], "Often 1-3 days", "May be missed by assays without glucuronide sensitivity.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("lorazepam_glucuronide", "Lorazepam-glucuronide", "Benzodiazepines", "finding", ["lorazepam glucuronide"], "Method dependent", "Supportive lorazepam metabolite; assay sensitivity varies.", ["arupBenzodiazepines"]),
    item("midazolam", "Midazolam", "Benzodiazepines", "drug", ["Versed"], "Short acting", "Alpha-hydroxymidazolam supports recent midazolam exposure.", ["arupBenzodiazepines"]),
    item("alpha_hydroxymidazolam", "Alpha-hydroxymidazolam", "Benzodiazepines", "finding", ["midazolam metabolite"], "Short acting", "Supportive midazolam metabolite.", ["arupBenzodiazepines"]),
    item("triazolam", "Triazolam", "Benzodiazepines", "drug", ["Halcion"], "Short acting", "Alpha-hydroxytriazolam supports triazolam exposure.", ["arupBenzodiazepines"]),
    item("alpha_hydroxytriazolam", "Alpha-hydroxytriazolam", "Benzodiazepines", "finding", ["triazolam metabolite"], "Short acting", "Supportive triazolam metabolite.", ["arupBenzodiazepines"]),
    item("flurazepam", "Flurazepam", "Benzodiazepines", "drug", ["Dalmane"], "Long-acting", "Hydroxyethylflurazepam supports flurazepam exposure.", ["arupBenzodiazepines"]),
    item("hydroxyethylflurazepam", "Hydroxyethylflurazepam", "Benzodiazepines", "finding", [], "Long-acting metabolite", "Supportive flurazepam metabolite.", ["arupBenzodiazepines"]),
    item("estazolam", "Estazolam", "Benzodiazepines", "drug", ["Prosom"], "Intermediate acting", "Usually interpreted as parent/specific analyte when included.", ["arupBenzodiazepines"]),
    item("flunitrazepam", "Flunitrazepam", "Benzodiazepines", "drug", ["Rohypnol"], "Panel dependent", "7-aminoflunitrazepam supports flunitrazepam exposure.", ["arupBenzodiazepines"]),
    item("aminoflunitrazepam7", "7-aminoflunitrazepam", "Benzodiazepines", "finding", [], "Panel dependent", "Supportive flunitrazepam metabolite.", ["arupBenzodiazepines"]),

    item("amphetamine", "Amphetamine", "Stimulants", "drug_or_finding", ["Adderall component", "amphetamine salts"], "Often 1-3 days", "Can be parent drug or metabolite.", ["arupDetectionWindows", "uic"]),
    item("methamphetamine", "Methamphetamine", "Stimulants", "drug", ["Desoxyn"], "Often 1-4 days", "Can produce amphetamine; source may require d/l isomer testing.", ["arupDetectionWindows"]),
    item("d_methamphetamine", "d-methamphetamine", "Stimulants", "finding", ["dextromethamphetamine"], "Method dependent", "Isomer testing may support prescription/illicit source assessment.", ["arupDrugTesting"]),
    item("l_methamphetamine", "l-methamphetamine", "Stimulants", "finding", ["levomethamphetamine"], "Method dependent", "Can be consistent with selegiline or some OTC inhaler exposure depending on context.", ["arupDrugTesting"]),
    item("mdma", "MDMA", "Stimulants", "drug", ["Ecstasy", "Molly"], "Often 1-3 days", "Can produce MDA.", ["arupDetectionWindows"]),
    item("mda", "MDA", "Stimulants", "drug_or_finding", [], "Often 1-3 days", "Can be metabolite of MDMA/MDEA or a primary exposure.", ["arupDetectionWindows"]),
    item("mdea", "MDEA", "Stimulants", "drug", ["Eve"], "Often 1-3 days", "Can produce MDA.", ["arupDrugTesting"]),
    item("lisdexamfetamine", "Lisdexamfetamine", "Stimulants", "drug", ["Vyvanse"], "Often 1-3 days", "Explains amphetamine findings.", ["arupDrugTesting"]),
    item("selegiline", "Selegiline", "Stimulants", "drug", ["Emsam", "Zelapar"], "Method dependent", "Can explain l-methamphetamine/l-amphetamine pattern.", ["arupDrugTesting"]),
    item("phentermine", "Phentermine", "Stimulants", "drug", ["Adipex-P"], "Often several days", "May be relevant to stimulant testing and immunoassay context.", ["arupDetectionWindows"]),
    item("benzphetamine", "Benzphetamine", "Stimulants", "drug", ["Didrex"], "Method dependent", "Can metabolize to methamphetamine and amphetamine.", ["arupDrugTesting"]),
    item("methylphenidate", "Methylphenidate", "Stimulants", "drug", ["Ritalin", "Concerta"], "Panel dependent", "Ritalinic acid supports methylphenidate exposure.", ["arupDrugTesting"]),
    item("ritalinic_acid", "Ritalinic acid", "Stimulants", "finding", [], "Panel dependent", "Supportive methylphenidate metabolite.", ["arupDrugTesting"]),
    item("pseudoephedrine", "Pseudoephedrine", "Stimulants", "drug_or_context", ["Sudafed"], "Context dependent", "More relevant to assay/source context than definitive amphetamine confirmation.", ["uic"]),
    item("ephedrine", "Ephedrine", "Stimulants", "drug_or_context", [], "Context dependent", "More relevant to assay/source context than definitive amphetamine confirmation.", ["uic"]),

    item("cocaine", "Cocaine", "Cocaine", "drug", [], "Parent is short window; metabolites longer", "Benzoylecgonine is the common primary urine metabolite.", ["arupDetectionWindows"]),
    item("benzoylecgonine", "Benzoylecgonine", "Cocaine", "finding", ["BE"], "Often 2-4 days; longer with heavy use", "Supports cocaine exposure.", ["arupDetectionWindows"]),
    item("ecgonine_methyl_ester", "Ecgonine methyl ester", "Cocaine", "finding", [], "Panel dependent", "Supportive cocaine metabolite when included.", ["arupDrugTesting"]),
    item("cocaethylene", "Cocaethylene", "Cocaine", "finding", [], "Panel dependent", "Suggests cocaine plus ethanol exposure.", ["arupDrugTesting"]),
    item("norcocaine", "Norcocaine", "Cocaine", "finding", [], "Panel dependent", "Minor cocaine metabolite when included.", ["arupDrugTesting"]),

    item("delta9_thc", "Delta-9-THC", "Cannabinoids", "drug", ["THC", "cannabis", "marijuana"], "Highly variable", "Parent cannabinoid; urine interpretation usually relies on metabolites.", ["arupDetectionWindows"]),
    item("hydroxy11_thc", "11-hydroxy-THC", "Cannabinoids", "finding", [], "Panel dependent", "Intermediate active metabolite.", ["arupDrugTesting"]),
    item("thc_cooh", "THC-COOH", "Cannabinoids", "finding", ["11-nor-9-carboxy-THC", "carboxy-THC"], "Single use often days; chronic use can be much longer", "Supports cannabinoid exposure.", ["arupDetectionWindows", "uic"]),
    item("thc_cooh_glucuronide", "THC-COOH-glucuronide", "Cannabinoids", "finding", [], "Panel dependent", "Conjugated THC-COOH metabolite.", ["arupDrugTesting"]),
    item("delta8_thc", "Delta-8-THC", "Cannabinoids", "drug", [], "Method dependent", "Delta-8 interpretation depends on assay specificity.", ["arupDrugTesting"]),
    item("delta8_thc_cooh", "Delta-8-THC-COOH", "Cannabinoids", "finding", [], "Method dependent", "Supports delta-8 cannabinoid exposure when assay is specific.", ["arupDrugTesting"]),
    item("cbd", "CBD", "Cannabinoids", "drug_or_context", ["cannabidiol"], "Context dependent", "CBD products may complicate THC interpretation if contamination is possible.", ["arupDrugTesting"]),
    item("creatinine_normalized_thc_cooh", "Creatinine-normalized THC-COOH", "Cannabinoids", "context", [], "Serial interpretation", "Serial normalized values are more useful than a single raw value for reuse vs residual excretion.", ["arupDrugTesting"]),

    item("ethanol", "Ethanol", "Alcohol markers", "drug", ["alcohol"], "Short parent window", "EtG/EtS support recent ethanol exposure; PEth supports longer-window exposure.", ["arupDetectionWindows"]),
    item("etg", "EtG", "Alcohol markers", "finding", ["ethyl glucuronide"], "Recent ethanol marker", "Supports recent ethanol exposure; interpret cutoff/context.", ["arupDrugTesting"]),
    item("ets", "EtS", "Alcohol markers", "finding", ["ethyl sulfate"], "Recent ethanol marker", "Supports recent ethanol exposure; interpret cutoff/context.", ["arupDrugTesting"]),
    item("peth", "PEth", "Alcohol markers", "finding", ["phosphatidylethanol"], "Longer-window alcohol marker", "Supports longer-window alcohol exposure.", ["arupDrugTesting"]),

    item("zolpidem", "Zolpidem", "Sedative-hypnotics", "drug", ["Ambien"], "Short acting; metabolite may be more useful", "Specific testing may target parent and/or metabolite.", ["arupDrugTesting"]),
    item("zolpidem_carboxylic_acid", "Zolpidem phenyl-4-carboxylic acid", "Sedative-hypnotics", "finding", ["zolpidem metabolite"], "Panel dependent", "Supportive zolpidem metabolite.", ["arupDrugTesting"]),
    item("carisoprodol", "Carisoprodol", "Sedative-hypnotics", "drug", ["Soma"], "Panel dependent", "Meprobamate supports carisoprodol exposure.", ["arupDrugTesting"]),
    item("meprobamate", "Meprobamate", "Sedative-hypnotics", "drug_or_finding", [], "Panel dependent", "May reflect meprobamate exposure or carisoprodol metabolism.", ["arupDrugTesting"]),
  ];

  const relationships = [
    rel("codeine", "morphine", "metabolite", "primary", "Codeine can produce morphine; both may appear.", ["mayoOpiates"]),
    rel("codeine", "norcodeine", "metabolite", "secondary", "Norcodeine supports codeine exposure when included in a panel.", ["arupDrugTesting"]),
    rel("codeine", "hydrocodone", "minor metabolite", "context", "Small hydrocodone can occur with codeine in some contexts.", ["mayoOpiateInterpretation"]),
    rel("morphine", "hydromorphone", "minor metabolite", "context", "Morphine can produce low hydromorphone; interpret relative to morphine.", ["mayoOpiateInterpretation"]),
    rel("heroin", "6mam", "specific metabolite", "primary", "6-MAM supports recent heroin exposure when present.", ["mayoOpiates"]),
    rel("heroin", "morphine", "metabolite", "primary", "Heroin ultimately appears as morphine, but morphine alone is not heroin-specific.", ["mayoOpiates"]),
    rel("hydrocodone", "hydromorphone", "metabolite", "primary", "Hydromorphone can be from hydrocodone metabolism.", ["mayoOpiates"]),
    rel("hydrocodone", "norhydrocodone", "supportive metabolite", "primary", "Norhydrocodone supports hydrocodone exposure.", ["mayoOpiates"]),
    rel("hydrocodone", "dihydrocodeine", "minor metabolite", "secondary", "Dihydrocodeine can support a hydrocodone pattern when present.", ["mayoOpiates"]),
    rel("oxycodone", "noroxycodone", "supportive metabolite", "primary", "Noroxycodone supports oxycodone exposure.", ["mayoOxycodone", "mayoOpiates"]),
    rel("oxycodone", "oxymorphone", "metabolite", "primary", "Oxymorphone can fit oxycodone exposure.", ["mayoOxycodone", "mayoOpiates"]),
    rel("oxycodone", "noroxymorphone", "metabolite", "secondary", "Noroxymorphone supports oxycodone/oxymorphone pathway when included.", ["mayoOxycodone"]),
    rel("oxycodone", "hydrocodone", "possible impurity/context", "context", "Trace hydrocodone with high oxycodone may require quantitative context.", ["mayoOpiateInterpretation"]),
    rel("oxymorphone", "noroxymorphone", "metabolite", "primary", "Noroxymorphone supports oxymorphone pathway.", ["mayoOxycodone"]),
    rel("fentanyl", "norfentanyl", "supportive metabolite", "primary", "Norfentanyl supports fentanyl exposure.", ["arupDrugTesting"]),
    rel("buprenorphine", "norbuprenorphine", "supportive metabolite", "primary", "Norbuprenorphine supports buprenorphine exposure/metabolism.", ["arupDrugTesting"]),
    rel("buprenorphine", "naloxone", "combination product marker", "secondary", "Naloxone may appear with buprenorphine/naloxone products; interpret with product history.", ["arupDrugTesting"]),
    rel("methadone", "eddp", "supportive metabolite", "primary", "EDDP supports methadone ingestion/metabolism.", ["arupDrugTesting"]),
    rel("tramadol", "odesmethyltramadol", "supportive metabolite", "primary", "O-desmethyltramadol supports tramadol exposure.", ["arupDrugTesting"]),
    rel("tapentadol", "ndesmethyltapentadol", "supportive metabolite", "primary", "N-desmethyltapentadol supports tapentadol exposure when included.", ["arupDrugTesting"]),
    rel("naltrexone", "6beta_naltrexol", "supportive metabolite", "primary", "6-beta-naltrexol supports naltrexone exposure.", ["arupDrugTesting"]),
    rel("meperidine", "normeperidine", "supportive metabolite", "primary", "Normeperidine supports meperidine exposure.", ["arupDrugTesting"]),

    rel("diazepam", "nordiazepam", "metabolite", "primary", "Nordiazepam supports diazepam-type exposure but is not source-specific.", ["arupBenzodiazepines"]),
    rel("diazepam", "temazepam", "metabolite", "primary", "Temazepam can be part of diazepam pathway or prescribed directly.", ["arupBenzodiazepines"]),
    rel("diazepam", "oxazepam", "terminal metabolite", "primary", "Oxazepam is a shared terminal metabolite.", ["arupBenzodiazepines"]),
    rel("nordiazepam", "oxazepam", "metabolite", "secondary", "Nordiazepam can continue to oxazepam.", ["arupBenzodiazepines"]),
    rel("temazepam", "oxazepam", "metabolite", "secondary", "Temazepam can continue to oxazepam.", ["arupBenzodiazepines"]),
    rel("chlordiazepoxide", "nordiazepam", "metabolite", "primary", "Chlordiazepoxide can produce nordiazepam.", ["arupBenzodiazepines"]),
    rel("chlordiazepoxide", "oxazepam", "terminal metabolite", "primary", "Chlordiazepoxide can contribute to oxazepam patterns.", ["arupBenzodiazepines"]),
    rel("clorazepate", "nordiazepam", "metabolite", "primary", "Clorazepate rapidly enters nordiazepam pathway.", ["arupBenzodiazepines"]),
    rel("alprazolam", "alpha_hydroxyalprazolam", "supportive metabolite", "primary", "Alpha-hydroxyalprazolam supports alprazolam exposure.", ["arupBenzodiazepines"]),
    rel("clonazepam", "aminoclonazepam7", "supportive metabolite", "primary", "7-aminoclonazepam supports clonazepam exposure.", ["arupBenzodiazepines"]),
    rel("lorazepam", "lorazepam_glucuronide", "supportive metabolite", "primary", "Lorazepam-glucuronide supports lorazepam exposure; assay sensitivity varies.", ["arupBenzodiazepines"]),
    rel("midazolam", "alpha_hydroxymidazolam", "supportive metabolite", "primary", "Alpha-hydroxymidazolam supports recent midazolam exposure.", ["arupBenzodiazepines"]),
    rel("triazolam", "alpha_hydroxytriazolam", "supportive metabolite", "primary", "Alpha-hydroxytriazolam supports triazolam exposure.", ["arupBenzodiazepines"]),
    rel("flurazepam", "hydroxyethylflurazepam", "supportive metabolite", "primary", "Hydroxyethylflurazepam supports flurazepam exposure.", ["arupBenzodiazepines"]),
    rel("flunitrazepam", "aminoflunitrazepam7", "supportive metabolite", "primary", "7-aminoflunitrazepam supports flunitrazepam exposure.", ["arupBenzodiazepines"]),

    rel("methamphetamine", "amphetamine", "metabolite", "primary", "Methamphetamine with amphetamine may support methamphetamine exposure.", ["arupDrugTesting"]),
    rel("methamphetamine", "d_methamphetamine", "isomer", "context", "d/l isomer testing may help distinguish source.", ["arupDrugTesting"]),
    rel("selegiline", "l_methamphetamine", "metabolite/source clue", "primary", "Selegiline can explain l-methamphetamine.", ["arupDrugTesting"]),
    rel("selegiline", "amphetamine", "metabolite/source clue", "secondary", "Selegiline can contribute to l-amphetamine patterns.", ["arupDrugTesting"]),
    rel("benzphetamine", "methamphetamine", "metabolite", "primary", "Benzphetamine can metabolize to methamphetamine.", ["arupDrugTesting"]),
    rel("benzphetamine", "amphetamine", "metabolite", "secondary", "Benzphetamine can contribute to amphetamine.", ["arupDrugTesting"]),
    rel("mdma", "mda", "metabolite", "primary", "MDA can support MDMA pathway.", ["arupDrugTesting"]),
    rel("mdea", "mda", "metabolite", "primary", "MDEA can produce MDA.", ["arupDrugTesting"]),
    rel("lisdexamfetamine", "amphetamine", "expected finding", "primary", "Lisdexamfetamine explains amphetamine.", ["arupDrugTesting"]),
    rel("methylphenidate", "ritalinic_acid", "supportive metabolite", "primary", "Ritalinic acid supports methylphenidate exposure when included.", ["arupDrugTesting"]),

    rel("cocaine", "benzoylecgonine", "supportive metabolite", "primary", "Benzoylecgonine supports cocaine exposure.", ["arupDetectionWindows"]),
    rel("cocaine", "ecgonine_methyl_ester", "metabolite", "secondary", "Ecgonine methyl ester supports cocaine exposure when included.", ["arupDrugTesting"]),
    rel("cocaine", "cocaethylene", "ethanol co-exposure marker", "primary", "Cocaethylene suggests cocaine plus ethanol exposure.", ["arupDrugTesting"]),
    rel("cocaine", "norcocaine", "minor metabolite", "secondary", "Norcocaine is a cocaine metabolite when included.", ["arupDrugTesting"]),

    rel("delta9_thc", "hydroxy11_thc", "metabolite", "secondary", "11-hydroxy-THC is an intermediate THC metabolite.", ["arupDrugTesting"]),
    rel("hydroxy11_thc", "thc_cooh", "metabolite", "primary", "THC-COOH supports cannabinoid exposure.", ["arupDrugTesting"]),
    rel("thc_cooh", "thc_cooh_glucuronide", "conjugated metabolite", "secondary", "THC-COOH-glucuronide is a conjugated cannabinoid metabolite.", ["arupDrugTesting"]),
    rel("delta8_thc", "delta8_thc_cooh", "supportive metabolite", "primary", "Delta-8 THC-COOH supports delta-8 exposure when assay is specific.", ["arupDrugTesting"]),
    rel("cbd", "thc_cooh", "contamination/context", "context", "CBD products can complicate THC interpretation if THC contamination is possible.", ["arupDrugTesting"]),
    rel("thc_cooh", "creatinine_normalized_thc_cooh", "serial interpretation", "context", "Serial creatinine-normalized THC-COOH is more useful than a single raw value for reuse vs residual excretion.", ["arupDrugTesting"]),

    rel("ethanol", "etg", "metabolite", "primary", "EtG supports recent ethanol exposure; cutoff/context matter.", ["arupDrugTesting"]),
    rel("ethanol", "ets", "metabolite", "primary", "EtS supports recent ethanol exposure; cutoff/context matter.", ["arupDrugTesting"]),
    rel("ethanol", "peth", "longer-window marker", "primary", "PEth supports longer-window alcohol exposure.", ["arupDrugTesting"]),

    rel("zolpidem", "zolpidem_carboxylic_acid", "supportive metabolite", "primary", "Zolpidem metabolite may be more useful than parent depending on timing/panel.", ["arupDrugTesting"]),
    rel("carisoprodol", "meprobamate", "supportive metabolite", "primary", "Meprobamate supports carisoprodol exposure but can also be direct exposure.", ["arupDrugTesting"]),
  ];

  const assayCaveats = [
    caveat("immunoassay", ["Opioids"], "Opiate immunoassay", "A generic opiate immunoassay is morphine-like and may miss oxycodone, fentanyl, methadone, buprenorphine, tramadol, tapentadol, and other synthetic or semisynthetic opioids.", ["arupDrugTesting", "aafp"]),
    caveat("immunoassay", ["Benzodiazepines"], "Benzodiazepine immunoassay", "Some benzodiazepine screens under-detect clonazepam, lorazepam, and glucuronidated metabolites depending on assay design.", ["arupBenzodiazepines", "uic"]),
    caveat("immunoassay", ["Stimulants"], "Amphetamine screen", "Amphetamine immunoassay false positives and source ambiguity can occur; unexpected results need definitive confirmation.", ["uic", "aafp"]),
    caveat("immunoassay", ["Cocaine"], "Cocaine screen", "Benzoylecgonine is the primary urine marker; unexpected positives should still be interpreted with cutoff and confirmation context.", ["aafp"]),
    caveat("immunoassay", ["Cannabinoids"], "Cannabinoid screen", "THC immunoassays do not reliably determine timing, dose, impairment, or delta-8 vs delta-9 specificity.", ["arupDrugTesting"]),
    caveat("definitive", ["Opioids", "Benzodiazepines", "Stimulants", "Cocaine", "Cannabinoids", "Alcohol markers", "Sedative-hypnotics"], "Definitive testing", "LC-MS/MS or GC-MS is preferred for unexpected results, adherence/diversion concerns, and parent/metabolite pattern interpretation.", ["arupDrugTesting", "aafp"]),
  ];

  const commonGroups = ["Opioids", "Benzodiazepines", "Stimulants", "Cannabinoids", "Cocaine"];
  const commonFindings = ["hydromorphone", "oxymorphone", "noroxycodone", "norhydrocodone", "eddp", "norbuprenorphine", "aminoclonazepam7", "alpha_hydroxyalprazolam", "benzoylecgonine", "thc_cooh"];
  const commonDrugs = ["oxycodone", "hydrocodone", "morphine", "codeine", "fentanyl", "buprenorphine", "methadone", "alprazolam", "clonazepam", "lorazepam", "diazepam"];

  const byId = new Map(items.map((entry) => [entry.id, entry]));
  const relationshipsByFrom = groupBy(relationships, "from");
  const relationshipsByTo = groupBy(relationships, "to");
  const state = {
    mode: "lookup",
    method: "any",
    focusId: null,
    relationFilter: "all",
    expected: [],
    detected: [],
    absent: [],
    lastLookupSummary: "",
    lastPatternSummary: "",
  };

  const elements = {
    searchInput: root.querySelector("#udsSearchInput"),
    searchClear: root.querySelector("#udsSearchClear"),
    searchResults: root.querySelector("#udsSearchResults"),
    methodSelect: root.querySelector("#udsMethodSelect"),
    startButton: root.querySelector("#udsStartButton"),
    modeButtons: [...root.querySelectorAll("[data-uds-mode]")],
    lookupView: root.querySelector("#udsLookupView"),
    patternView: root.querySelector("#udsPatternView"),
    lookupTitle: root.querySelector("#udsLookupTitle"),
    lookupContent: root.querySelector("#udsLookupContent"),
    relationsContent: root.querySelector("#udsRelationsContent"),
    copyLookupButton: root.querySelector("#udsCopyLookupButton"),
    itemOptions: root.querySelector("#udsItemOptions"),
    expectedInput: root.querySelector("#udsExpectedInput"),
    detectedInput: root.querySelector("#udsDetectedInput"),
    absentInput: root.querySelector("#udsAbsentInput"),
    expectedChips: root.querySelector("#udsExpectedChips"),
    detectedChips: root.querySelector("#udsDetectedChips"),
    absentChips: root.querySelector("#udsAbsentChips"),
    addButtons: [...root.querySelectorAll("[data-uds-add]")],
    analyzeButton: root.querySelector("#udsAnalyzeButton"),
    clearPatternButton: root.querySelector("#udsClearPatternButton"),
    copyPatternButton: root.querySelector("#udsCopyPatternButton"),
    patternOutput: root.querySelector("#udsPatternOutput"),
  };

  function item(id, name, group, type, aliases, window, note, sourceIds) {
    return { id, name, group, type, aliases, window, note, sourceIds };
  }

  function rel(from, to, label, strength, clue, sourceIds) {
    return { from, to, label, strength, clue, sourceIds };
  }

  function caveat(method, groups, title, text, sourceIds) {
    return { method, groups, title, text, sourceIds };
  }

  function groupBy(list, key) {
    return list.reduce((acc, row) => {
      const groupKey = row[key];
      if (!acc.has(groupKey)) {
        acc.set(groupKey, []);
      }
      acc.get(groupKey).push(row);
      return acc;
    }, new Map());
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function getSearchScore(entry, query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return 0;
    }

    const searchable = [entry.name, entry.group, entry.type, ...entry.aliases].map(normalize);
    const name = normalize(entry.name);

    if (name === normalizedQuery) {
      return 100;
    }
    if (name.startsWith(normalizedQuery)) {
      return 90;
    }
    if (searchable.some((value) => value === normalizedQuery)) {
      return 86;
    }
    if (searchable.some((value) => value.startsWith(normalizedQuery))) {
      return 76;
    }
    if (searchable.some((value) => value.includes(normalizedQuery))) {
      return 58;
    }

    const haystack = searchable.join(" ");
    const tokens = normalizedQuery.split(" ");
    return tokens.every((token) => haystack.includes(token)) ? 44 : 0;
  }

  function searchItems(query, limit = 12) {
    return items
      .map((entry) => ({ entry, score: getSearchScore(entry, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
      .slice(0, limit)
      .map(({ entry }) => entry);
  }

  function getItem(id) {
    return byId.get(id);
  }

  function getOutgoing(id) {
    return relationshipsByFrom.get(id) || [];
  }

  function getIncoming(id) {
    return relationshipsByTo.get(id) || [];
  }

  function getRelevantCaveats(itemIds) {
    const groups = new Set(itemIds.map((id) => getItem(id)?.group).filter(Boolean));
    return assayCaveats.filter((entry) => {
      const methodMatches = state.method === "any" || entry.method === state.method;
      const groupMatches = entry.groups.some((group) => groups.has(group));
      return methodMatches && groupMatches;
    });
  }

  function getSourcesForItem(id) {
    const entry = getItem(id);
    const sourceIds = new Set(entry?.sourceIds || []);
    [...getOutgoing(id), ...getIncoming(id)].forEach((relationship) => {
      relationship.sourceIds.forEach((sourceId) => sourceIds.add(sourceId));
    });
    getRelevantCaveats([id]).forEach((caveatEntry) => {
      caveatEntry.sourceIds.forEach((sourceId) => sourceIds.add(sourceId));
    });
    return [...sourceIds].map((sourceId) => sources[sourceId]).filter(Boolean);
  }

  function labelFor(id) {
    return getItem(id)?.name || id;
  }

  function render() {
    elements.modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.udsMode === state.mode);
    });

    elements.lookupView.classList.toggle("is-hidden", state.mode !== "lookup");
    elements.patternView.classList.toggle("is-hidden", state.mode !== "pattern");

    renderDatalist();

    if (state.mode === "lookup") {
      if (state.focusId) {
        renderLookupItem(state.focusId);
      } else {
        renderLookupStart();
      }
    } else {
      renderPatternChips();
      renderPatternOutput();
    }
  }

  function renderDatalist() {
    elements.itemOptions.innerHTML = items
      .map((entry) => `<option value="${escapeHtml(entry.name)}"></option>`)
      .join("");
  }

  function renderLookupStart() {
    elements.lookupTitle.textContent = "Start with a common item or search";
    elements.copyLookupButton.disabled = true;
    state.lastLookupSummary = "";

    elements.lookupContent.innerHTML = `
      <div class="uds-grid">
        ${renderCommonGroups()}
        ${renderCommonList("Common findings", commonFindings)}
        ${renderCommonList("Common drugs", commonDrugs)}
        ${renderCommonList("High-impact assay caveats", ["oxycodone", "fentanyl", "buprenorphine", "methadone", "clonazepam", "lorazepam"])}
      </div>
    `;

    elements.relationsContent.innerHTML = `
      <div class="uds-empty">
        Search or select a common item. Related parent drugs, metabolites, assay caveats, and source links will appear here.
      </div>
    `;
  }

  function renderCommonGroups() {
    return `
      <section class="uds-section">
        <h4>Common groups</h4>
        <div class="uds-common-list">
          ${commonGroups
            .map(
              (group) => `
                <button class="uds-chip" data-uds-group="${escapeAttribute(group)}" type="button">
                  ${escapeHtml(group)} (${items.filter((entry) => entry.group === group).length})
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderCommonList(title, ids) {
    return `
      <section class="uds-section">
        <h4>${escapeHtml(title)}</h4>
        <div class="uds-common-list">
          ${ids.map((id) => renderItemChip(id)).join("")}
        </div>
      </section>
    `;
  }

  function renderItemChip(id) {
    return `
      <button class="uds-chip" data-uds-focus="${escapeAttribute(id)}" type="button">
        ${escapeHtml(labelFor(id))}
      </button>
    `;
  }

  function renderLookupGroup(group) {
    state.focusId = null;
    state.lastLookupSummary = "";
    elements.copyLookupButton.disabled = true;
    elements.lookupTitle.textContent = group;

    const groupItems = items
      .filter((entry) => entry.group === group)
      .sort((a, b) => a.name.localeCompare(b.name));

    elements.lookupContent.innerHTML = `
      <section class="uds-section">
        <h4>${escapeHtml(group)}</h4>
        <div class="uds-common-list">
          ${groupItems.map((entry) => renderItemChip(entry.id)).join("")}
        </div>
      </section>
    `;

    elements.relationsContent.innerHTML = `
      <div class="uds-empty">Select any ${escapeHtml(group.toLowerCase())} item to view relationships.</div>
    `;
  }

  function renderLookupItem(id) {
    const entry = getItem(id);
    if (!entry) {
      return;
    }

    const outgoing = sortRelationships(getOutgoing(id));
    const incoming = sortRelationships(getIncoming(id));
    const caveats = getRelevantCaveats([id]);
    const sourcesForEntry = getSourcesForItem(id);
    const lookupIsDrug = entry.type.includes("drug");
    const primaryRows = lookupIsDrug ? outgoing : incoming;
    const secondaryRows = lookupIsDrug ? incoming : outgoing;
    const primaryTitle = lookupIsDrug ? "Expected" : "Sources";
    const secondaryTitle = lookupIsDrug ? "Can also explain this item" : "Also expected from this source";
    const clues = [...primaryRows, ...secondaryRows].slice(0, 4).map((relationship) => relationship.clue);

    elements.lookupTitle.textContent = entry.name;
    elements.copyLookupButton.disabled = false;
    state.lastLookupSummary = buildLookupSummary(entry, primaryRows, clues);

    elements.lookupContent.innerHTML = `
      <article>
        <h3 class="uds-card-title">${escapeHtml(entry.name)}</h3>
        <p class="uds-muted">
          ${escapeHtml(entry.group)} - ${escapeHtml(formatType(entry.type))}
          ${entry.aliases.length ? ` - Also: ${escapeHtml(entry.aliases.join(", "))}` : ""}
        </p>
        <div class="uds-badge-row">
          <span class="uds-badge">${escapeHtml(entry.group)}</span>
          <span class="uds-badge">${escapeHtml(formatType(entry.type))}</span>
          <span class="uds-badge">${escapeHtml(entry.window)}</span>
        </div>
        <div class="uds-grid">
          <section class="uds-section">
            <h4>${primaryTitle}</h4>
            <div class="uds-relation-list">
              ${primaryRows.length ? primaryRows.map((relationship) => renderRelationshipRow(relationship, id)).join("") : renderEmpty("No primary relationships configured.")}
            </div>
          </section>
          <section class="uds-section">
            <h4>Clues</h4>
            <div class="uds-note-list">
              ${clues.length ? clues.map((clue) => `<div class="uds-note">${escapeHtml(clue)}</div>`).join("") : renderEmpty(entry.note)}
            </div>
          </section>
        </div>
        ${
          secondaryRows.length
            ? `
              <details class="uds-details">
                <summary>${escapeHtml(secondaryTitle)}</summary>
                <div class="uds-details-body">
                  <div class="uds-relation-list">${secondaryRows.map((relationship) => renderRelationshipRow(relationship, id)).join("")}</div>
                </div>
              </details>
            `
            : ""
        }
        <details class="uds-details">
          <summary>Details</summary>
          <div class="uds-details-body">
            <div class="uds-note">${escapeHtml(entry.note)}</div>
            ${caveats.map((caveatEntry) => `<div class="uds-note"><strong>${escapeHtml(caveatEntry.title)}:</strong> ${escapeHtml(caveatEntry.text)}</div>`).join("")}
          </div>
        </details>
        <details class="uds-details">
          <summary>Sources</summary>
          <div class="uds-details-body">
            ${renderSources(sourcesForEntry)}
          </div>
        </details>
      </article>
    `;

    renderRelationsPane(entry, outgoing, incoming, caveats);
  }

  function renderRelationsPane(entry, outgoing, incoming, caveats) {
    const relationshipGroups = [
      ["Sources", incoming],
      ["Expected", outgoing],
    ];

    elements.relationsContent.innerHTML = `
      <div class="uds-filter-row">
        ${["all", "primary", "secondary", "context", "assay"].map((filter) => `
          <button class="${state.relationFilter === filter ? "is-active" : ""}" data-uds-filter="${filter}" type="button">
            ${filter === "all" ? "All" : capitalize(filter)}
          </button>
        `).join("")}
      </div>
      ${relationshipGroups
        .map(([title, rows]) => renderNavGroup(title, filterRelationships(rows), entry.id))
        .join("")}
      ${
        shouldShowAssay()
          ? `
            <section class="uds-section">
              <h4>Assay / method</h4>
              <div class="uds-relation-list">
                ${caveats.length ? caveats.map((caveatEntry) => `<div class="uds-note"><strong>${escapeHtml(caveatEntry.title)}:</strong> ${escapeHtml(caveatEntry.text)}</div>`).join("") : renderEmpty("No method-specific caveats configured for this selection.")}
              </div>
            </section>
          `
          : ""
      }
    `;
  }

  function filterRelationships(rows) {
    if (state.relationFilter === "all") {
      return rows;
    }
    if (state.relationFilter === "assay") {
      return [];
    }
    return rows.filter((relationship) => relationship.strength === state.relationFilter);
  }

  function shouldShowAssay() {
    return state.relationFilter === "all" || state.relationFilter === "assay";
  }

  function renderNavGroup(title, rows, focusId) {
    if (!rows.length) {
      return "";
    }

    return `
      <section class="uds-section">
        <h4>${escapeHtml(title)}</h4>
        <div class="uds-relation-list">
          ${rows.map((relationship) => renderNavRow(relationship, focusId)).join("")}
        </div>
      </section>
    `;
  }

  function renderRelationshipRow(relationship, focusId) {
    const otherId = relationship.from === focusId ? relationship.to : relationship.from;
    const direction = relationship.from === focusId ? "->" : "<-";

    return `
      <button class="uds-relation-row" data-uds-focus="${escapeAttribute(otherId)}" type="button">
        <span class="uds-relation-main">
          ${escapeHtml(labelFor(focusId))} ${direction} ${escapeHtml(labelFor(otherId))}
        </span>
        <span class="uds-relation-sub">${escapeHtml(relationship.clue)}</span>
        <span class="uds-relation-tag">${escapeHtml(relationship.label)}</span>
      </button>
    `;
  }

  function renderNavRow(relationship, focusId) {
    const otherId = relationship.from === focusId ? relationship.to : relationship.from;
    return `
      <button class="uds-nav-row" data-uds-focus="${escapeAttribute(otherId)}" type="button">
        <span class="uds-nav-main">${escapeHtml(labelFor(otherId))}</span>
        <span class="uds-nav-sub">${escapeHtml(relationship.clue)}</span>
        <span class="uds-relation-tag">${escapeHtml(relationship.label)}</span>
      </button>
    `;
  }

  function renderSources(sourceList) {
    if (!sourceList.length) {
      return renderEmpty("No specific source configured.");
    }

    return `
      <ul class="uds-source-list">
        ${sourceList
          .map(
            (source) => `
              <li>
                <a href="${escapeAttribute(source.url)}" rel="noreferrer" target="_blank">
                  ${escapeHtml(source.title)}
                </a>
                <span> - ${escapeHtml(source.type)}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
    `;
  }

  function renderPatternChips() {
    renderChipList("expected", elements.expectedChips);
    renderChipList("detected", elements.detectedChips);
    renderChipList("absent", elements.absentChips);
  }

  function renderChipList(key, container) {
    const values = state[key];
    container.innerHTML = values.length
      ? values
        .map(
          (id) => `
            <button class="uds-chip" data-uds-remove="${key}" data-uds-id="${escapeAttribute(id)}" type="button">
              ${escapeHtml(labelFor(id))}
              <span class="uds-chip-remove" aria-hidden="true">x</span>
            </button>
          `,
        )
        .join("")
      : `<span class="uds-muted">No items added.</span>`;
  }

  function renderPatternOutput() {
    const result = analyzePattern();
    state.lastPatternSummary = result.summary;
    elements.copyPatternButton.disabled = !result.summary;

    elements.patternOutput.innerHTML = `
      <div class="uds-result-block">
        ${renderResultSection("Assessment", [result.assessment], "uds-result-assessment")}
        ${renderResultSection("Explained", result.explained)}
        ${renderResultSection("Needs context", result.needsContext)}
        ${renderResultSection("Not explained", result.notExplained)}
        ${renderResultSection("Missing supportive, if relevant", result.missingSupportive)}
        ${renderResultSection("Method notes", result.methodNotes)}
      </div>
    `;
  }

  function analyzePattern() {
    const explained = [];
    const needsContext = [];
    const notExplained = [];
    const missingSupportive = [];

    if (!state.expected.length && !state.detected.length) {
      return {
        assessment: "Add at least one prescribed/expected drug and one detected finding.",
        explained: [],
        needsContext: [],
        notExplained: [],
        missingSupportive: [],
        methodNotes: getRelevantCaveats([...state.expected, ...state.detected]).map((entry) => entry.text),
        summary: "",
      };
    }

    state.detected.forEach((detectedId) => {
      const directExpected = state.expected.includes(detectedId);
      if (directExpected) {
        explained.push(`${labelFor(detectedId)} is listed as prescribed/expected.`);
        return;
      }

      const relationship = state.expected
        .flatMap((expectedId) => getOutgoing(expectedId).map((row) => ({ expectedId, row })))
        .find(({ row }) => row.to === detectedId);

      if (!relationship) {
        notExplained.push(`${labelFor(detectedId)} is not explained by the selected expected drugs.`);
        return;
      }

      const message = `${labelFor(detectedId)} can fit ${labelFor(relationship.expectedId)}: ${relationship.row.clue}`;
      if (relationship.row.strength === "context") {
        needsContext.push(message);
      } else {
        explained.push(message);
      }
    });

    state.expected.forEach((expectedId) => {
      const supportive = getOutgoing(expectedId).filter((row) => row.strength === "primary");
      supportive.forEach((row) => {
        const hasFinding = state.detected.includes(row.to);
        const markedAbsent = state.absent.includes(row.to);
        if (!hasFinding && !markedAbsent) {
          missingSupportive.push(`${labelFor(row.to)} would support ${labelFor(expectedId)} if included in the ordered panel.`);
        }
        if (markedAbsent) {
          missingSupportive.push(`${labelFor(row.to)} is marked absent; consider panel inclusion, timing, cutoff, and method before treating this as discordant.`);
        }
      });
    });

    const methodNotes = getRelevantCaveats([...state.expected, ...state.detected]).map((entry) => entry.text);
    const assessment = buildAssessment(explained, needsContext, notExplained);
    const summary = buildPatternSummary(assessment, explained, needsContext, notExplained);

    return {
      assessment,
      explained,
      needsContext,
      notExplained,
      missingSupportive: missingSupportive.slice(0, 8),
      methodNotes: methodNotes.slice(0, 5),
      summary,
    };
  }

  function buildAssessment(explained, needsContext, notExplained) {
    if (notExplained.length) {
      return "Pattern is partially discordant; at least one detected finding is not explained by the selected expected drugs.";
    }
    if (needsContext.length) {
      return "Pattern mostly fits, with one or more findings requiring quantitative, timing, or assay context.";
    }
    if (explained.length) {
      return "Pattern fits the selected expected drug(s) based on configured parent/metabolite relationships.";
    }
    return "Insufficient pattern data to interpret.";
  }

  function buildLookupSummary(entry, rows, clues) {
    const relationText = rows.length
      ? rows.slice(0, 4).map((row) => `${labelFor(row.to === entry.id ? row.from : row.to)} (${row.label})`).join(", ")
      : "no primary relationships configured";
    const clueText = clues.length ? ` Key clue: ${clues[0]}` : "";
    return `${entry.name}: ${entry.note} Related findings/sources: ${relationText}.${clueText}`;
  }

  function buildPatternSummary(assessment, explained, needsContext, notExplained) {
    const parts = [assessment];
    if (explained.length) {
      parts.push(`Explained: ${explained.slice(0, 4).join(" ")}`);
    }
    if (needsContext.length) {
      parts.push(`Needs context: ${needsContext.slice(0, 3).join(" ")}`);
    }
    if (notExplained.length) {
      parts.push(`Not explained: ${notExplained.slice(0, 3).join(" ")}`);
    }
    return parts.join(" ");
  }

  function renderResultSection(title, rows, className = "") {
    return `
      <section class="uds-result-section ${className}">
        <h4>${escapeHtml(title)}</h4>
        ${
          rows.length
            ? `<ul>${rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>`
            : `<div class="uds-muted">None.</div>`
        }
      </section>
    `;
  }

  function renderEmpty(text) {
    return `<div class="uds-empty">${escapeHtml(text)}</div>`;
  }

  function sortRelationships(rows) {
    const priority = { primary: 0, secondary: 1, context: 2 };
    return [...rows].sort((a, b) => {
      const priorityDiff = (priority[a.strength] ?? 9) - (priority[b.strength] ?? 9);
      return priorityDiff || labelFor(a.to).localeCompare(labelFor(b.to));
    });
  }

  function formatType(type) {
    const labels = {
      context: "context",
      drug: "drug",
      drug_or_context: "drug / context",
      drug_or_finding: "drug / finding",
      finding: "finding",
    };

    return labels[type] || type.replaceAll("_", " ");
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function findItemFromInput(value) {
    const normalizedValue = normalize(value);
    if (!normalizedValue) {
      return null;
    }

    return (
      items.find((entry) => normalize(entry.name) === normalizedValue) ||
      items.find((entry) => entry.aliases.some((alias) => normalize(alias) === normalizedValue)) ||
      searchItems(value, 1)[0] ||
      null
    );
  }

  function addChip(key, rawValue) {
    const entry = findItemFromInput(rawValue);
    if (!entry || state[key].includes(entry.id)) {
      return;
    }

    state[key].push(entry.id);
    renderPatternChips();
    renderPatternOutput();
  }

  function removeChip(key, id) {
    state[key] = state[key].filter((entryId) => entryId !== id);
    renderPatternChips();
    renderPatternOutput();
  }

  function setFocus(id) {
    if (!getItem(id)) {
      return;
    }

    state.mode = "lookup";
    state.focusId = id;
    state.relationFilter = "all";
    elements.searchInput.value = "";
    elements.searchResults.classList.add("is-hidden");
    render();
  }

  function showSearchResults(query) {
    const results = searchItems(query);
    if (!query.trim()) {
      elements.searchResults.classList.add("is-hidden");
      elements.searchResults.innerHTML = "";
      return;
    }

    elements.searchResults.innerHTML = results.length
      ? results
        .map(
          (entry) => `
            <button class="uds-search-result" data-uds-focus="${escapeAttribute(entry.id)}" type="button">
              <span>
                <strong>${escapeHtml(entry.name)}</strong>
                <span class="uds-relation-sub">${escapeHtml(entry.group)} - ${escapeHtml(formatType(entry.type))}${entry.aliases.length ? ` - ${escapeHtml(entry.aliases.slice(0, 3).join(", "))}` : ""}</span>
              </span>
              <span class="uds-relation-tag">${getOutgoing(entry.id).length + getIncoming(entry.id).length} links</span>
            </button>
          `,
        )
        .join("")
      : renderEmpty("No match. Try a brand, metabolite, class, or common finding.");
    elements.searchResults.classList.remove("is-hidden");
  }

  async function copyText(text) {
    if (!text) {
      return;
    }

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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  root.addEventListener("click", (event) => {
    const focusButton = event.target.closest("[data-uds-focus]");
    if (focusButton) {
      setFocus(focusButton.dataset.udsFocus);
      return;
    }

    const groupButton = event.target.closest("[data-uds-group]");
    if (groupButton) {
      renderLookupGroup(groupButton.dataset.udsGroup);
      return;
    }

    const filterButton = event.target.closest("[data-uds-filter]");
    if (filterButton) {
      state.relationFilter = filterButton.dataset.udsFilter;
      renderLookupItem(state.focusId);
      return;
    }

    const removeButton = event.target.closest("[data-uds-remove]");
    if (removeButton) {
      removeChip(removeButton.dataset.udsRemove, removeButton.dataset.udsId);
    }
  });

  elements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.udsMode;
      render();
    });
  });

  elements.methodSelect.addEventListener("change", () => {
    state.method = elements.methodSelect.value;
    render();
  });

  elements.searchInput.addEventListener("input", () => {
    showSearchResults(elements.searchInput.value);
  });

  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    const first = searchItems(elements.searchInput.value, 1)[0];
    if (first) {
      setFocus(first.id);
    }
  });

  elements.searchClear.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.searchResults.classList.add("is-hidden");
    elements.searchInput.focus();
  });

  elements.startButton.addEventListener("click", () => {
    state.mode = "lookup";
    state.focusId = null;
    state.relationFilter = "all";
    render();
  });

  elements.copyLookupButton.addEventListener("click", () => {
    copyText(state.lastLookupSummary);
  });

  elements.addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.udsAdd;
      const input = elements[`${key}Input`];
      addChip(key, input.value);
      input.value = "";
      input.focus();
    });
  });

  [elements.expectedInput, elements.detectedInput, elements.absentInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      const key = input.id.replace("uds", "").replace("Input", "").toLowerCase();
      addChip(key, input.value);
      input.value = "";
    });
  });

  elements.analyzeButton.addEventListener("click", renderPatternOutput);

  elements.clearPatternButton.addEventListener("click", () => {
    state.expected = [];
    state.detected = [];
    state.absent = [];
    renderPatternChips();
    renderPatternOutput();
  });

  elements.copyPatternButton.addEventListener("click", () => {
    copyText(state.lastPatternSummary);
  });

  render();
})();
