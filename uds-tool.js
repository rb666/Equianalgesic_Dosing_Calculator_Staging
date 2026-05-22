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
    caveat("immunoassay", ["Opioids"], "Fentanyl screen limitation", "Routine opiate immunoassays do not detect fentanyl; use fentanyl-specific or definitive testing.", ["arupDrugTesting", "aafp"], ["fentanyl", "norfentanyl"], "critical"),
    caveat("immunoassay", ["Opioids"], "Oxycodone screen limitation", "Routine opiate immunoassays may be negative despite oxycodone use unless an oxycodone-specific assay is ordered.", ["mayoOpiates", "mayoOxycodone", "aafp"], ["oxycodone", "noroxycodone", "oxymorphone", "noroxymorphone"], "critical"),
    caveat("immunoassay", ["Opioids"], "Synthetic opioid screen limitation", "Methadone, buprenorphine, tramadol, and tapentadol require specific or definitive testing; a negative generic opiate screen does not exclude exposure.", ["arupDrugTesting", "aafp"], ["methadone", "eddp", "buprenorphine", "norbuprenorphine", "tramadol", "odesmethyltramadol", "tapentadol", "ndesmethyltapentadol"], "critical"),
    caveat("any", ["Opioids"], "Hydromorphone source ambiguity", "Hydromorphone is not source-specific by itself; it may reflect hydromorphone use, hydrocodone metabolism, or minor morphine metabolism.", ["mayoOpiates", "mayoOpiateInterpretation"], ["hydromorphone"], "critical"),
    caveat("immunoassay", ["Benzodiazepines"], "Benzodiazepine immunoassay", "Some benzodiazepine screens under-detect clonazepam, lorazepam, and glucuronidated metabolites depending on assay design.", ["arupBenzodiazepines", "uic"]),
    caveat("immunoassay", ["Benzodiazepines"], "Clonazepam / lorazepam screen limitation", "Many benzodiazepine screens may miss clonazepam, 7-aminoclonazepam, lorazepam, or glucuronidated metabolites depending on assay design.", ["arupBenzodiazepines", "uic"], ["clonazepam", "aminoclonazepam7", "lorazepam", "lorazepam_glucuronide"], "critical"),
    caveat("immunoassay", ["Stimulants"], "Amphetamine screen", "Amphetamine immunoassay false positives and source ambiguity can occur; unexpected results need definitive confirmation.", ["uic", "aafp"]),
    caveat("immunoassay", ["Stimulants"], "Amphetamine confirmation", "Amphetamine-class immunoassays have clinically important false positives and source ambiguity; unexpected positives need definitive confirmation.", ["uic", "aafp"], ["amphetamine", "methamphetamine"], "critical"),
    caveat("immunoassay", ["Cocaine"], "Cocaine screen", "Benzoylecgonine is the primary urine marker; unexpected positives should still be interpreted with cutoff and confirmation context.", ["aafp"]),
    caveat("immunoassay", ["Cannabinoids"], "Cannabinoid screen", "THC immunoassays do not reliably determine timing, dose, impairment, or delta-8 vs delta-9 specificity.", ["arupDrugTesting"]),
    caveat("any", ["Cannabinoids"], "THC overinterpretation warning", "THC-COOH supports cannabinoid exposure but does not establish impairment, exact timing, dose, or new use versus residual excretion.", ["arupDetectionWindows", "uic"], ["thc_cooh", "thc_cooh_glucuronide", "delta9_thc"], "critical"),
    caveat("any", ["Alcohol markers"], "Alcohol marker context", "EtG and EtS require cutoff, timing, incidental exposure, and panel context before clinical conclusions are made.", ["arupDrugTesting", "arupDetectionWindows"], ["etg", "ets"], "critical"),
    caveat("definitive", ["Opioids", "Benzodiazepines", "Stimulants", "Cocaine", "Cannabinoids", "Alcohol markers", "Sedative-hypnotics"], "Definitive testing", "LC-MS/MS or GC-MS is preferred for unexpected results, adherence/diversion concerns, and parent/metabolite pattern interpretation.", ["arupDrugTesting", "aafp"]),
  ];

  const commonGroups = ["Opioids", "Benzodiazepines", "Stimulants", "Cannabinoids", "Cocaine"];
  const commonFindings = ["hydromorphone", "oxymorphone", "noroxycodone", "norhydrocodone", "eddp", "norbuprenorphine", "aminoclonazepam7", "alpha_hydroxyalprazolam", "benzoylecgonine", "thc_cooh"];
  const commonDrugs = ["oxycodone", "hydrocodone", "morphine", "codeine", "fentanyl", "buprenorphine", "methadone", "alprazolam", "clonazepam", "lorazepam", "diazepam"];
  const highYieldSearches = ["oxycodone", "fentanyl", "norfentanyl", "eddp", "aminoclonazepam7", "hydromorphone", "oxymorphone", "benzoylecgonine", "thc_cooh", "etg"];
  const intentAliases = [
    { terms: ["negative opiate", "oxycodone"], focusId: "oxycodone" },
    { terms: ["negative opiate", "fentanyl"], focusId: "fentanyl" },
    { terms: ["negative benzo", "clonazepam"], focusId: "aminoclonazepam7" },
    { terms: ["benzo screen negative", "clonazepam"], focusId: "aminoclonazepam7" },
    { terms: ["benzo screen negative", "lorazepam"], focusId: "lorazepam" },
    { terms: ["methadone metabolite"], focusId: "eddp" },
    { terms: ["cocaine metabolite"], focusId: "benzoylecgonine" },
    { terms: ["hydromorphone", "hydrocodone"], focusId: "hydromorphone" },
    { terms: ["thc", "timing"], focusId: "thc_cooh" },
    { terms: ["thc", "impairment"], focusId: "thc_cooh" },
    { terms: ["etg", "incidental"], focusId: "etg" },
    { terms: ["etg", "cutoff"], focusId: "etg" },
  ];
  const curatedAnswers = {
    morphine: answer("Morphine in urine may reflect morphine use, codeine metabolism, or heroin exposure when paired with 6-MAM.", "Interpret morphine with codeine, 6-MAM, hydromorphone, timing, and the medication list.", "Morphine alone is not specific for heroin exposure.", "Compare the full opiate pattern and use definitive testing when source matters.", "Do not conclude exact source, dose, timing, impairment, or adherence from morphine alone."),
    codeine: answer("Codeine exposure may produce codeine, morphine, and sometimes small hydrocodone depending on timing and metabolism.", "Codeine with morphine can be compatible with codeine use; codeine-specific metabolites add support when included.", "Morphine can appear after codeine and should not automatically be treated as separate morphine exposure.", "Interpret relative concentrations, timing, medication list, and definitive analytes if source matters.", "Do not conclude non-prescribed morphine solely from morphine in a codeine-compatible pattern."),
    hydrocodone: answer("Hydrocodone exposure is commonly supported by norhydrocodone and may also produce hydromorphone.", "Hydrocodone, norhydrocodone, hydromorphone, and dihydrocodeine can form a compatible hydrocodone pattern.", "Hydromorphone may be a metabolite rather than a separate hydromorphone exposure.", "Review the full parent/metabolite pattern and quantitative context when available.", "Do not conclude hydromorphone misuse from hydromorphone alone."),
    hydromorphone: answer("Hydromorphone can reflect prescribed hydromorphone, hydrocodone metabolism, or minor morphine metabolism.", "Hydromorphone is not source-specific without the rest of the opiate pattern.", "Hydromorphone alone cannot identify the parent opioid.", "Compare hydrocodone, norhydrocodone, morphine, timing, and quantitative context.", "Do not conclude source from hydromorphone alone; it may reflect hydromorphone use, hydrocodone metabolism, or minor morphine metabolism."),
    oxycodone: answer("Oxycodone exposure may be supported by oxycodone, noroxycodone, oxymorphone, and/or noroxymorphone depending on timing and panel design.", "Noroxycodone supports oxycodone; oxymorphone can be an oxycodone metabolite or a separate prescribed drug.", "A routine opiate screen may be negative despite oxycodone use.", "Use oxycodone-specific testing or definitive LC/GC-MS when oxycodone exposure or adherence matters.", "Do not assume a negative generic opiate screen excludes oxycodone.", { immunoassay: { bottomLine: "A routine opiate immunoassay may be negative despite oxycodone use unless an oxycodone-specific assay is ordered.", commonPitfall: "Do not interpret a negative generic opiate screen as excluding oxycodone exposure.", nextStep: "Order oxycodone-specific testing or definitive LC/GC-MS when oxycodone exposure or adherence matters." }, definitive: { bottomLine: "Oxycodone exposure may be supported by oxycodone, noroxycodone, oxymorphone, and/or noroxymorphone depending on timing and panel design.", commonPitfall: "Oxymorphone may reflect prescribed oxymorphone or oxycodone metabolism.", nextStep: "Interpret with the prescribed medication list and the full metabolite pattern." } }, ["negative opiate screen oxycodone", "opiate screen negative oxycodone"]),
    oxymorphone: answer("Oxymorphone may reflect prescribed oxymorphone or oxycodone metabolism.", "Noroxymorphone, oxycodone, and noroxycodone help distinguish likely pathways when included.", "Oxymorphone is not automatically evidence of separate oxymorphone use.", "Compare prescribed medications and the full oxycodone/oxymorphone pathway.", "Do not assume oxymorphone misuse; it may be prescribed directly or appear as an oxycodone metabolite."),
    noroxycodone: answer("Noroxycodone is a supportive oxycodone metabolite when included in the ordered panel.", "Noroxycodone with oxycodone and/or oxymorphone supports oxycodone exposure.", "Absence may reflect timing, cutoff, or panel design rather than nonadherence.", "Confirm whether noroxycodone was included in the definitive panel.", "Do not use noroxycodone alone to determine dose, timing, or adherence certainty."),
    noroxymorphone: answer("Noroxymorphone supports the oxycodone/oxymorphone pathway when included.", "It may appear with oxycodone or oxymorphone exposure depending on panel design and timing.", "It is not source-specific without parent drugs and clinical context.", "Interpret with oxycodone, oxymorphone, noroxycodone, and medication history.", "Do not conclude exact source or timing from noroxymorphone alone."),
    fentanyl: answer("Fentanyl exposure is usually supported by norfentanyl, but fentanyl is not detected by a routine opiate immunoassay.", "Fentanyl and/or norfentanyl supports fentanyl exposure when included in the ordered panel.", "A negative routine opiate screen does not rule out fentanyl exposure.", "Use fentanyl-specific immunoassay or definitive LC/GC-MS when fentanyl exposure or adherence matters.", "Urine detection does not establish dose, timing, impairment, or adherence certainty.", { immunoassay: { bottomLine: "Routine opiate immunoassays do not detect fentanyl.", commonPitfall: "A negative generic opiate screen does not rule out fentanyl exposure.", nextStep: "Order fentanyl-specific testing or definitive LC/GC-MS when fentanyl exposure or adherence matters." }, definitive: { bottomLine: "Fentanyl exposure is usually supported by fentanyl and/or norfentanyl on definitive testing.", commonPitfall: "Timing and chronic exposure can affect parent/metabolite pattern.", nextStep: "Interpret fentanyl and norfentanyl together with timing and medication history." } }, ["negative opiate screen fentanyl", "opiate screen negative fentanyl"]),
    norfentanyl: answer("Norfentanyl is a supportive fentanyl metabolite when included in the ordered panel.", "Norfentanyl with or without parent fentanyl can support fentanyl exposure depending on timing.", "A routine opiate screen may still be negative.", "Use fentanyl-specific or definitive testing and interpret timing carefully.", "Do not infer dose, timing, or impairment from norfentanyl alone."),
    buprenorphine: answer("Buprenorphine exposure is supported by buprenorphine and/or norbuprenorphine when included in a specific panel.", "Norbuprenorphine supports metabolism/exposure; naloxone may appear with combination products.", "Routine opiate screens usually do not answer buprenorphine questions.", "Use buprenorphine-specific testing or definitive LC/GC-MS when adherence matters.", "Do not conclude adherence or diversion solely from one qualitative buprenorphine result.", { immunoassay: { bottomLine: "A routine opiate immunoassay does not reliably answer buprenorphine exposure or adherence questions.", commonPitfall: "A negative generic opiate screen does not exclude buprenorphine exposure.", nextStep: "Order buprenorphine-specific testing or definitive LC/GC-MS when buprenorphine matters." } }),
    norbuprenorphine: answer("Norbuprenorphine supports buprenorphine metabolism/exposure when included.", "It is usually interpreted with parent buprenorphine and product history.", "Panel design and timing affect whether parent or metabolite appears.", "Review buprenorphine, norbuprenorphine, naloxone, timing, and assay method.", "Do not infer exact dosing or adherence certainty from norbuprenorphine alone."),
    methadone: answer("Methadone exposure is best supported by methadone plus EDDP when included.", "EDDP supports methadone ingestion/metabolism and helps distinguish ingestion from direct specimen contamination.", "Routine opiate screens do not reliably detect methadone unless methadone-specific testing is ordered.", "Use methadone-specific or definitive testing when methadone exposure or adherence matters.", "Do not conclude dose, timing, or adherence certainty from methadone alone.", { immunoassay: { bottomLine: "Methadone is not reliably detected by a generic opiate immunoassay unless methadone-specific testing is ordered.", commonPitfall: "A negative generic opiate screen does not exclude methadone exposure.", nextStep: "Order methadone-specific testing or definitive LC/GC-MS and interpret with EDDP when adherence matters." } }),
    eddp: answer("EDDP supports methadone ingestion and metabolism.", "EDDP is the major methadone metabolite and is useful when assessing whether methadone was metabolized.", "Methadone without EDDP may require timing, cutoff, renal, or specimen-integrity context.", "Interpret EDDP with parent methadone, timing, and the ordered panel.", "Do not use EDDP alone to determine dose, timing, or impairment.", {}, ["ed dp", "methadone metabolite", "EDDP", "eddp"]),
    tramadol: answer("Tramadol exposure may require a specific or definitive panel and is not reliably answered by a routine opiate screen.", "O-desmethyltramadol supports tramadol exposure when included.", "Routine opiate immunoassay results may be misleading for tramadol.", "Use specific/definitive testing when tramadol exposure or adherence matters.", "Do not conclude absence of tramadol from a negative generic opiate screen.", { immunoassay: { bottomLine: "A generic opiate immunoassay may be negative despite tramadol exposure.", commonPitfall: "Do not use a negative generic opiate screen to exclude tramadol.", nextStep: "Confirm that tramadol-specific or definitive testing was ordered." } }),
    tapentadol: answer("Tapentadol is not a routine opiate screen finding and usually requires specific or definitive testing.", "Tapentadol and/or N-desmethyltapentadol may support exposure depending on panel design.", "A negative generic opiate screen does not exclude tapentadol exposure.", "Confirm that tapentadol was included in the ordered panel.", "Do not infer absence, timing, or dose from a generic opiate screen.", { immunoassay: { bottomLine: "A generic opiate immunoassay does not reliably detect tapentadol.", commonPitfall: "Do not interpret a negative generic opiate screen as excluding tapentadol exposure.", nextStep: "Confirm that tapentadol-specific or definitive testing was ordered." } }),
    "6mam": answer("6-MAM is a specific marker of recent heroin exposure when detected.", "6-MAM has a short detection window; morphine may persist longer after heroin exposure.", "Absence of 6-MAM does not exclude prior heroin exposure if timing is delayed.", "Interpret with timing, morphine/codeine pattern, and definitive testing.", "Do not use absence of 6-MAM alone to exclude heroin exposure outside the short detection window.", {}, ["6 acetylmorphine", "heroin metabolite", "6 monoacetylmorphine"]),
    benzoylecgonine: answer("Benzoylecgonine is the primary urine metabolite supporting cocaine exposure.", "Cocaine parent may be short-lived; benzoylecgonine is the common urine target.", "A positive result does not establish impairment, exact timing, or route.", "Interpret with cutoff, confirmation status, timing, and clinical context.", "Do not use benzoylecgonine alone to determine impairment or exact timing.", {}, ["cocaine metabolite", "coke metabolite", "BE", "benzoyl ecgonine"]),
    amphetamine: answer("Amphetamine may be a prescribed drug, metabolite, or immunoassay finding requiring context.", "It can reflect amphetamine salts, lisdexamfetamine, methamphetamine metabolism, or other pathways.", "Amphetamine immunoassays can have false positives and source ambiguity.", "Confirm unexpected results with definitive testing and review medication/source context.", "Do not conclude illicit stimulant use from an amphetamine screen alone.", { immunoassay: { bottomLine: "Amphetamine immunoassay positives are not source-specific and can have false positives.", commonPitfall: "Do not conclude illicit stimulant use from an amphetamine screen alone.", nextStep: "Confirm unexpected positives with definitive testing and review prescribed/OTC medication context." } }),
    methamphetamine: answer("Methamphetamine may produce amphetamine and may require isomer testing to clarify source.", "d/l isomer testing can help distinguish some prescription, OTC, and illicit sources.", "Methamphetamine/amphetamine patterns are source-dependent and can be overinterpreted.", "Use definitive testing and isomer information when source matters.", "Do not conclude source or route from methamphetamine alone."),
    thc_cooh: answer("THC-COOH supports cannabinoid exposure but does not establish impairment, exact timing, or new use.", "Detection can persist for days to much longer depending on frequency of use and patient factors.", "Single urine THC metabolite results are poor tools for impairment or exact timing.", "Use clinical context and serial creatinine-normalized values only when reuse versus residual excretion is the question.", "Do not use a single urine THC metabolite result to determine impairment, exact timing, or new use versus residual excretion.", { immunoassay: { bottomLine: "A cannabinoid screen can support cannabinoid exposure but cannot determine impairment, exact timing, dose, or delta-8 versus delta-9 specificity.", commonPitfall: "Do not use a urine cannabinoid screen to determine current impairment.", nextStep: "Use clinical context, cutoff, confirmation, and serial normalized results only when clinically appropriate." }, definitive: { bottomLine: "Definitive THC-COOH testing supports cannabinoid exposure but still does not establish impairment, exact timing, or new use by itself.", commonPitfall: "Definitive identification improves specificity but does not solve timing or impairment questions.", nextStep: "Interpret with timing, cutoff, frequency of use, and serial creatinine-normalized values if reuse versus residual excretion is the question." } }, ["carboxy THC", "THC metabolite", "cannabis metabolite", "THC timing", "THC impairment"]),
    etg: answer("EtG supports recent ethanol exposure but must be interpreted with cutoff, timing, and incidental exposure context.", "EtG is a sensitive alcohol metabolite and is often paired with EtS.", "Low-level positives can be context-dependent and should not be overinterpreted.", "Review cutoff, collection timing, EtS, exposure history, and lab guidance.", "Do not interpret EtG without cutoff, timing, and incidental exposure context."),
    ets: answer("EtS supports recent ethanol exposure and is commonly interpreted alongside EtG.", "EtS can support ethanol exposure and may help contextualize EtG results.", "Cutoff and incidental exposure context are essential.", "Review EtG/EtS together with cutoff, timing, and exposure history.", "Do not interpret EtS without cutoff, timing, and incidental exposure context."),
    peth: answer("PEth supports longer-window alcohol exposure compared with urine EtG/EtS.", "PEth reflects phosphatidylethanol formation in blood and is not a same-window urine alcohol marker.", "PEth does not define exact timing of last drink.", "Interpret with the testing matrix, cutoff, and clinical context.", "Do not use PEth alone to determine exact timing, impairment, or a precise drinking amount."),
    clonazepam: answer("Clonazepam exposure is often best supported by 7-aminoclonazepam, and some benzodiazepine screens may miss it.", "7-aminoclonazepam is the key metabolite when included.", "A negative benzodiazepine immunoassay does not exclude clonazepam exposure.", "Use definitive testing when clonazepam exposure or adherence matters.", "Do not conclude absence of clonazepam from a negative benzodiazepine screen alone.", { immunoassay: { bottomLine: "Many benzodiazepine screens may miss clonazepam or 7-aminoclonazepam.", commonPitfall: "A negative benzodiazepine screen does not exclude clonazepam exposure.", nextStep: "Order definitive testing that includes 7-aminoclonazepam when clonazepam matters." } }, ["negative benzo screen clonazepam", "benzo screen negative clonazepam"]),
    aminoclonazepam7: answer("7-aminoclonazepam supports clonazepam exposure when included in the ordered panel.", "This metabolite is usually more useful than parent clonazepam in urine.", "It may be missed by some immunoassay screens.", "Use definitive benzodiazepine testing when clonazepam exposure or adherence matters.", "Do not infer dose, timing, or adherence certainty from 7-aminoclonazepam alone.", { immunoassay: { bottomLine: "A benzodiazepine immunoassay may be negative despite clonazepam exposure.", commonPitfall: "Do not treat a negative screen as excluding clonazepam.", nextStep: "Use definitive testing that includes 7-aminoclonazepam." } }, ["clonazepam metabolite", "klonopin metabolite", "7 amino clonazepam", "7-amino"]),
    lorazepam: answer("Lorazepam may be under-detected by some benzodiazepine immunoassays, especially when glucuronidated metabolites are not well detected.", "Lorazepam and lorazepam-glucuronide support exposure when included.", "A negative benzodiazepine screen does not always exclude lorazepam.", "Use definitive testing when lorazepam exposure or adherence matters.", "Do not conclude absence of lorazepam from a negative benzodiazepine screen alone."),
    oxazepam: answer("Oxazepam may be prescribed directly or appear as a shared terminal metabolite of several benzodiazepines.", "Diazepam-type benzodiazepines can produce nordiazepam, temazepam, and oxazepam.", "Oxazepam is not source-specific.", "Interpret with nordiazepam, temazepam, diazepam-type medications, and medication history.", "Do not conclude a single parent benzodiazepine from oxazepam alone."),
    temazepam: answer("Temazepam may be prescribed directly or appear in diazepam-type metabolism.", "Temazepam with nordiazepam and/or oxazepam can fit a diazepam-type pathway.", "Temazepam is not always a separate exposure.", "Interpret with the full benzodiazepine metabolite pattern.", "Do not conclude separate temazepam use without medication history and pattern context."),
    nordiazepam: answer("Nordiazepam is a shared diazepam-type benzodiazepine metabolite.", "Diazepam, chlordiazepoxide, clorazepate, and related pathways may produce nordiazepam.", "Nordiazepam is not source-specific.", "Interpret with oxazepam, temazepam, medication list, and timing.", "Do not identify a single parent benzodiazepine from nordiazepam alone."),
    alprazolam: answer("Alprazolam exposure is supported by alpha-hydroxyalprazolam when included.", "Parent alprazolam and alpha-hydroxyalprazolam together support exposure.", "Some benzodiazepine screens vary in sensitivity by assay.", "Use definitive testing when alprazolam exposure or adherence matters.", "Do not infer exact dose or timing from alprazolam urine detection alone."),
    alpha_hydroxyalprazolam: answer("Alpha-hydroxyalprazolam supports alprazolam exposure.", "It is a key alprazolam metabolite when included in definitive benzodiazepine testing.", "Absence may reflect panel design, timing, or cutoff.", "Interpret with parent alprazolam, timing, and ordered panel contents.", "Do not use this metabolite alone to determine dose, timing, or impairment.", {}, ["alprazolam metabolite", "xanax metabolite", "alpha hydroxy alprazolam"]),
    zolpidem: answer("Zolpidem usually requires specific testing; routine drug screens may not include it.", "Parent zolpidem and/or zolpidem metabolite may support exposure depending on timing and panel.", "Absence from a routine screen may simply mean it was not tested.", "Confirm whether zolpidem or its metabolite was included in the ordered panel.", "Do not infer absence of zolpidem from a nonspecific drug screen."),
    carisoprodol: answer("Carisoprodol exposure may be supported by meprobamate, but meprobamate can also be direct exposure.", "Carisoprodol metabolizes to meprobamate.", "Meprobamate is not fully source-specific.", "Interpret carisoprodol and meprobamate together with medication history.", "Do not conclude carisoprodol use from meprobamate alone."),
    meprobamate: answer("Meprobamate may reflect meprobamate exposure or carisoprodol metabolism.", "Carisoprodol can metabolize to meprobamate, but direct meprobamate exposure is also possible.", "Meprobamate is not source-specific.", "Review medication history and whether carisoprodol was detected or included.", "Do not conclude carisoprodol exposure from meprobamate alone."),
  };

  items.forEach((entry) => {
    const curated = curatedAnswers[entry.id];
    if (curated) {
      const extraAliases = curated.extraAliases || [];
      Object.assign(entry, curated);
      entry.aliases = [...new Set([...(entry.aliases || []), ...extraAliases])];
      delete entry.extraAliases;
    } else {
      entry.curationStatus = "partial";
    }
  });

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
    return { id, name, group, type, aliases, window, note, sourceIds, curationStatus: "partial" };
  }

  function rel(from, to, label, strength, clue, sourceIds) {
    return { from, to, label, strength, clinicalTag: getDefaultClinicalTag(from, to, label, strength), clue, sourceIds };
  }

  function caveat(method, groups, title, text, sourceIds, itemIds = [], severity = "routine") {
    return { method, groups, title, text, sourceIds, itemIds, severity };
  }

  function answer(bottomLine, likelyExplanation, commonPitfall, nextStep, doNotConclude = "", methodAnswers = {}, extraAliases = []) {
    return {
      curationStatus: "complete",
      bottomLine,
      likelyExplanation,
      commonPitfall,
      nextStep,
      doNotConclude,
      methodAnswers,
      extraAliases,
    };
  }

  function getDefaultClinicalTag(from, to, label, strength) {
    const normalizedLabel = normalize(label);
    const notSourceSpecificPairs = new Set([
      "hydrocodone:hydromorphone",
      "morphine:hydromorphone",
      "oxycodone:oxymorphone",
      "diazepam:oxazepam",
      "diazepam:temazepam",
      "diazepam:nordiazepam",
      "temazepam:oxazepam",
      "nordiazepam:oxazepam",
      "chlordiazepoxide:oxazepam",
      "carisoprodol:meprobamate",
    ]);

    if (notSourceSpecificPairs.has(`${from}:${to}`)) {
      return "Not source-specific";
    }
    if (strength === "context" || normalizedLabel.includes("context") || normalizedLabel.includes("impurity")) {
      return "Requires context";
    }
    if (normalizedLabel.includes("minor")) {
      return "Possible minor metabolite";
    }
    if (normalizedLabel.includes("supportive") || normalizedLabel.includes("specific") || normalizedLabel.includes("marker")) {
      return "Supportive finding";
    }
    if (normalizedLabel.includes("metabolite")) {
      return "Expected metabolite";
    }
    return "Associated finding";
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

    const searchable = [entry.name, entry.group, entry.type, entry.note, entry.bottomLine, ...(entry.aliases || [])].map(normalize);
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
    const intentMatch = matchIntentAlias(query);
    const ranked = items
      .map((entry) => ({ entry, score: getSearchScore(entry, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
      .slice(0, limit)
      .map(({ entry }) => entry);
    if (!intentMatch) {
      return ranked;
    }

    const intentEntry = getItem(intentMatch);
    if (!intentEntry) {
      return ranked;
    }

    return [intentEntry, ...ranked.filter((entry) => entry.id !== intentEntry.id)].slice(0, limit);
  }

  function matchIntentAlias(query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      return null;
    }

    return intentAliases.find((intent) =>
      intent.terms.every((term) => normalizedQuery.includes(normalize(term)))
    )?.focusId || null;
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
    const ids = new Set(itemIds);
    return assayCaveats
      .filter((entry) => {
        const methodMatches = state.method === "any" || entry.method === state.method || entry.method === "any";
        const hasItemScope = Boolean(entry.itemIds?.length);
        const groupMatches = entry.groups?.some((group) => groups.has(group));
        const itemMatches = entry.itemIds?.some((id) => ids.has(id));
        return methodMatches && (hasItemScope ? itemMatches : groupMatches);
      })
      .sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  }

  function severityRank(severity) {
    return { critical: 3, important: 2, routine: 1 }[severity] || 0;
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
    elements.lookupTitle.textContent = "Search-first clinical lookup";
    elements.copyLookupButton.disabled = true;
    state.lastLookupSummary = "";

    elements.lookupContent.innerHTML = `
      <section class="uds-section uds-search-first">
        <h4>Search any drug, metabolite, screen, or finding</h4>
        <p class="uds-muted">Examples: oxycodone, norfentanyl, EDDP, 7-aminoclonazepam, negative opiate screen fentanyl, EtG.</p>
      </section>
      <section class="uds-section">
        <h4>High-yield quick searches</h4>
        <div class="uds-common-list">
          ${highYieldSearches.map((id) => renderItemChip(id)).join("")}
        </div>
      </section>
      <details class="uds-details">
        <summary>Browse by drug class</summary>
        <div class="uds-details-body">
          ${renderCommonGroups()}
          ${renderCommonList("Common findings", commonFindings)}
          ${renderCommonList("Common drugs", commonDrugs)}
        </div>
      </details>
    `;

    elements.relationsContent.innerHTML = `
      <div class="uds-empty">
        Search or select a high-yield item. Related parent drugs, metabolites, assay caveats, and reference links will appear here.
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

    elements.lookupTitle.textContent = entry.name;
    elements.copyLookupButton.disabled = false;
    state.lastLookupSummary = buildLookupSummary(entry, primaryRows, secondaryRows, caveats, sourcesForEntry);

    elements.lookupContent.innerHTML = `
      <article>
        ${renderClinicalAnswerCard(entry, primaryRows, secondaryRows, caveats)}
        ${renderCollapsedLookupDetails(entry, primaryRows, secondaryRows, caveats, sourcesForEntry)}
      </article>
    `;

    renderRelationsPane(entry, outgoing, incoming, caveats);
  }

  function renderClinicalAnswerCard(entry, primaryRows, secondaryRows, caveats) {
    const criticalCaveat = caveats.find((caveatEntry) => caveatEntry.severity === "critical");
    const bottomLine = getMethodAnswer(entry, "bottomLine") || entry.bottomLine || buildBottomLine(entry, primaryRows, secondaryRows, caveats);
    const likelyExplanation = entry.likelyExplanation || buildLikelyExplanation(entry, primaryRows, secondaryRows);
    const commonPitfall = getMethodAnswer(entry, "commonPitfall") || entry.commonPitfall || buildCommonPitfall(entry, caveats);
    const nextStep = getMethodAnswer(entry, "nextStep") || entry.nextStep || buildNextStep(entry, caveats);

    return `
      <section class="uds-answer-card" aria-label="Clinical answer">
        <div class="uds-answer-header">
          <div>
            <p class="eyebrow">Clinical answer</p>
            <h3>${escapeHtml(entry.name)}</h3>
          </div>
          <div class="uds-badge-row">
            <span class="uds-badge">${escapeHtml(entry.group)}</span>
            <span class="uds-badge">${escapeHtml(formatType(entry.type))}</span>
            <span class="uds-badge">${escapeHtml(entry.window)}</span>
          </div>
        </div>
        ${renderCurationStatus(entry)}
        ${criticalCaveat ? `<div class="uds-critical-warning">${escapeHtml(criticalCaveat.text)}</div>` : ""}
        ${renderAnswerLine("Bottom line", bottomLine)}
        ${renderAnswerLine("Likely explanation(s)", likelyExplanation)}
        ${renderAnswerLine("Common pitfall", commonPitfall)}
        ${renderAnswerLine("What to do next", nextStep)}
        ${shouldShowDoNotConclude(entry) ? renderAnswerLine("Do not conclude", entry.doNotConclude || buildDoNotConclude(entry)) : ""}
      </section>
    `;
  }

  function renderAnswerLine(label, text) {
    if (!text) {
      return "";
    }

    return `
      <div class="uds-answer-line">
        <div class="uds-answer-label">${escapeHtml(label)}</div>
        <div class="uds-answer-text">${escapeHtml(text)}</div>
      </div>
    `;
  }

  function renderCollapsedLookupDetails(entry, primaryRows, secondaryRows, caveats, sourcesForEntry) {
    return `
      ${renderDetailsSection("Expected / possible related findings", renderRelationshipList(primaryRows, secondaryRows, entry.id))}
      ${renderDetailsSection("Detection window details", renderDetectionWindow(entry))}
      ${renderDetailsSection("Assay limitations", renderAssayCaveats(caveats))}
      ${renderDetailsSection("False positives / false negatives", renderFalsePositiveNegative(entry, caveats))}
      ${renderDetailsSection("Do not overinterpret", renderDoNotConclude(entry))}
      ${renderDetailsSection("References", renderSources(sourcesForEntry))}
    `;
  }

  function renderDetailsSection(title, bodyHtml) {
    if (!bodyHtml) {
      return "";
    }

    return `
      <details class="uds-details">
        <summary>${escapeHtml(title)}</summary>
        <div class="uds-details-body">
          ${bodyHtml}
        </div>
      </details>
    `;
  }

  function renderRelationshipList(primaryRows, secondaryRows, focusId) {
    const lookupIsDrug = getItem(focusId)?.type.includes("drug");
    const primaryTitle = lookupIsDrug ? "Expected urine findings" : "Possible parent drug(s) / explanations";
    const secondaryTitle = lookupIsDrug ? "Other possible related findings" : "Also associated with";
    const sections = [];

    sections.push(`
      <section class="uds-section">
        <h4>${primaryTitle}</h4>
        <div class="uds-relation-list">
          ${primaryRows.length ? primaryRows.map((relationship) => renderRelationshipRow(relationship, focusId)).join("") : renderEmpty("No primary relationships configured.")}
        </div>
      </section>
    `);

    if (secondaryRows.length) {
      sections.push(`
        <section class="uds-section">
          <h4>${secondaryTitle}</h4>
          <div class="uds-relation-list">
            ${secondaryRows.map((relationship) => renderRelationshipRow(relationship, focusId)).join("")}
          </div>
        </section>
      `);
    }

    return `<div class="uds-grid">${sections.join("")}</div>`;
  }

  function renderDetectionWindow(entry) {
    return `<div class="uds-note"><strong>${escapeHtml(entry.name)}:</strong> ${escapeHtml(entry.window || "Panel and timing dependent.")}</div>`;
  }

  function renderAssayCaveats(caveats) {
    if (!caveats.length) {
      return renderEmpty("No method-specific assay limitation is configured for this item.");
    }

    return caveats
      .map((caveatEntry) => `<div class="uds-note"><strong>${escapeHtml(caveatEntry.title)}:</strong> ${escapeHtml(caveatEntry.text)}</div>`)
      .join("");
  }

  function renderFalsePositiveNegative(entry, caveats) {
    const caveatText = caveats.length
      ? caveats.map((caveatEntry) => caveatEntry.text).join(" ")
      : "False-positive and false-negative interpretation depends on assay design, cutoff, cross-reactivity, timing, and panel contents.";
    return `<div class="uds-note">${escapeHtml(caveatText)}</div>`;
  }

  function renderDoNotConclude(entry) {
    return `<div class="uds-note">${escapeHtml(entry.doNotConclude || buildDoNotConclude(entry))}</div>`;
  }

  function renderCurationStatus(entry) {
    if (entry.curationStatus === "complete" && hasCuratedAnswer(entry)) {
      return "";
    }

    const message = entry.curationStatus === "partial"
      ? "Partial curated interpretation: verify details with assay method, panel contents, and references."
      : "Limited curated interpretation: this entry is present for search/relationship mapping but needs content review.";

    return `<div class="uds-caution">${escapeHtml(message)}</div>`;
  }

  function hasCuratedAnswer(entry) {
    return Boolean(entry.bottomLine && entry.commonPitfall && entry.nextStep);
  }

  function shouldShowDoNotConclude(entry) {
    const highRiskIds = new Set([
      "hydromorphone",
      "oxymorphone",
      "thc_cooh",
      "etg",
      "ets",
      "amphetamine",
      "methamphetamine",
      "aminoclonazepam7",
    ]);
    return highRiskIds.has(entry.id);
  }

  function getMethodAnswer(entry, field) {
    if (!entry.methodAnswers) {
      return "";
    }
    if (state.method === "immunoassay") {
      return entry.methodAnswers.immunoassay?.[field] || "";
    }
    if (state.method === "definitive") {
      return entry.methodAnswers.definitive?.[field] || "";
    }
    return "";
  }

  function buildBottomLine(entry, primaryRows, secondaryRows, caveats) {
    const critical = caveats.find((caveatEntry) => caveatEntry.severity === "critical");
    if (critical) {
      return critical.text;
    }
    if (entry.note) {
      return entry.note;
    }
    return `${entry.name} interpretation depends on assay method, timing, panel contents, and medication history.`;
  }

  function buildLikelyExplanation(entry, primaryRows, secondaryRows) {
    if (primaryRows.length) {
      const names = primaryRows.slice(0, 4).map((row) => labelFor(row.to === entry.id ? row.from : row.to)).join(", ");
      return `${entry.name} is associated with ${names}. Interpret the pattern rather than a single analyte.`;
    }
    if (secondaryRows.length) {
      const names = secondaryRows.slice(0, 4).map((row) => labelFor(row.to === entry.id ? row.from : row.to)).join(", ");
      return `${entry.name} may be related to ${names}, depending on timing and panel design.`;
    }
    return entry.note || "No configured parent/metabolite relationship is available for this item.";
  }

  function buildCommonPitfall(entry, caveats) {
    const critical = caveats.find((caveatEntry) => caveatEntry.severity === "critical");
    if (critical) {
      return critical.text;
    }
    return "Do not overinterpret a urine result without the ordered panel, cutoff, timing, assay method, and medication list.";
  }

  function buildNextStep(entry, caveats) {
    if (caveats.some((caveatEntry) => caveatEntry.method === "immunoassay")) {
      return "Use definitive testing or a targeted assay when the result conflicts with the medication list or clinical question.";
    }
    return "Interpret with medication history, timing, panel contents, and references; consult the lab for unexpected results.";
  }

  function buildDoNotConclude(entry) {
    return `Do not conclude exact dose, timing, impairment, diversion, or adherence certainty from ${entry.name} urine detection alone.`;
  }

  function renderRelationsPane(entry, outgoing, incoming, caveats) {
    const lookupIsDrug = entry.type.includes("drug");
    const relationshipGroups = [
      ["Possible parent drug(s) / explanations", incoming],
      [lookupIsDrug ? "Expected urine findings" : "Also associated with", outgoing],
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
        <span class="uds-relation-tag">${escapeHtml(relationship.clinicalTag || formatStrength(relationship.strength))}</span>
      </button>
    `;
  }

  function renderNavRow(relationship, focusId) {
    const otherId = relationship.from === focusId ? relationship.to : relationship.from;
    return `
      <button class="uds-nav-row" data-uds-focus="${escapeAttribute(otherId)}" type="button">
        <span class="uds-nav-main">${escapeHtml(labelFor(otherId))}</span>
        <span class="uds-nav-sub">${escapeHtml(relationship.clue)}</span>
        <span class="uds-relation-tag">${escapeHtml(relationship.clinicalTag || formatStrength(relationship.strength))}</span>
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
        ${renderResultSection("Recommended next step", [result.nextStep], "uds-result-next-step")}
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
        nextStep: "Add detected findings to compare against the selected expected drug(s).",
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
    const nextStep = buildPatternNextStep(explained, needsContext, notExplained, missingSupportive, methodNotes);
    const summary = buildPatternSummary(assessment, nextStep, explained, needsContext, notExplained, methodNotes);

    return {
      assessment,
      nextStep,
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
      return "At least one finding is not explained by the selected expected drug(s) in the current rule set. Confirm medication list, assay method, panel contents, timing, and consider definitive testing or lab consultation.";
    }
    if (needsContext.length) {
      return "Findings are mostly compatible, but one or more results require timing, quantitative, cutoff, panel, or assay-method context.";
    }
    if (explained.length) {
      return "Findings are compatible with the selected expected drug(s), based on configured parent/metabolite relationships. This does not confirm dose, timing, adherence, or absence of other exposure.";
    }
    return "Add detected findings to compare against the selected expected drug(s).";
  }

  function buildPatternNextStep(explained, needsContext, notExplained, missingSupportive, methodNotes) {
    if (notExplained.length) {
      return "Confirm the medication list and assay method; consider definitive testing or lab consultation for unexplained findings.";
    }
    if (needsContext.length) {
      return "Interpret with timing, quantitative values, cutoff, and panel contents before making adherence or misuse conclusions.";
    }
    if (missingSupportive.length) {
      return "Verify whether supportive metabolites were included in the ordered panel before treating their absence as meaningful.";
    }
    if (methodNotes.length) {
      return "Review method limitations before acting on the result.";
    }
    return "Use clinical context, timing, and the ordered panel details to confirm interpretation.";
  }

  function buildLookupSummary(entry, primaryRows, secondaryRows, caveats, sourcesForEntry) {
    const lines = [
      `UDS lookup: ${entry.name}`,
      `Bottom line: ${getMethodAnswer(entry, "bottomLine") || entry.bottomLine || buildBottomLine(entry, primaryRows, secondaryRows, caveats)}`,
      `Likely explanation(s): ${entry.likelyExplanation || buildLikelyExplanation(entry, primaryRows, secondaryRows)}`,
      `Common pitfall: ${getMethodAnswer(entry, "commonPitfall") || entry.commonPitfall || buildCommonPitfall(entry, caveats)}`,
      `What to do next: ${getMethodAnswer(entry, "nextStep") || entry.nextStep || buildNextStep(entry, caveats)}`,
    ];

    if (entry.doNotConclude) {
      lines.push(`Do not overinterpret: ${entry.doNotConclude}`);
    }
    if (sourcesForEntry?.length) {
      lines.push(`References: ${sourcesForEntry.map((source) => source.title).join("; ")}`);
    }

    return lines.filter(Boolean).join("\n");
  }

  function buildPatternSummary(assessment, nextStep, explained, needsContext, notExplained, methodNotes) {
    const parts = [`Assessment: ${assessment}`, `Recommended next step: ${nextStep}`];
    if (explained.length) {
      parts.push(`Explained: ${explained.slice(0, 4).join(" ")}`);
    }
    if (needsContext.length) {
      parts.push(`Needs context: ${needsContext.slice(0, 3).join(" ")}`);
    }
    if (notExplained.length) {
      parts.push(`Not explained: ${notExplained.slice(0, 3).join(" ")}`);
    }
    if (methodNotes.length) {
      parts.push(`Method notes: ${methodNotes.slice(0, 3).join(" ")}`);
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

  function formatStrength(strength) {
    return strength ? strength.replaceAll("_", " ") : "relationship";
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
        .map((entry) => renderSearchResult(entry))
        .join("")
      : renderEmpty("No match. Try a brand, metabolite, class, or common finding.");
    elements.searchResults.classList.remove("is-hidden");
  }

  function renderSearchResult(entry) {
    return `
      <button class="uds-search-result" data-uds-focus="${escapeAttribute(entry.id)}" type="button">
        <div class="uds-search-result-main">
          <span class="uds-search-result-name">${escapeHtml(entry.name)}</span>
          <span class="uds-search-result-meta">${escapeHtml(entry.group)} - ${escapeHtml(formatType(entry.type))}</span>
        </div>
        <div class="uds-search-result-summary">
          ${escapeHtml(entry.bottomLine || entry.note || "")}
        </div>
      </button>
    `;
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
