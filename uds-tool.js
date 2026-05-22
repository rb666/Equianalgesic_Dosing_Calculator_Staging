(() => {
  "use strict";

  const root = document.querySelector("#udsModal");

  if (!root) {
    return;
  }

  console.info("UDS tool loaded");

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
    arupExpandedPanel: {
      title: "ARUP Laboratories - Expanded Targeted LC-MS/MS Urine Drug Panel",
      url: "https://ltd.aruplab.com/Tests/Pub/3005060",
      type: "expanded lab panel",
    },
    mayoControlledPanel: {
      title: "Mayo Clinic Laboratories - Controlled Substance Monitoring Panel, Urine",
      url: "https://www.mayocliniclabs.com/test-catalog/overview/610271",
      type: "lab panel",
    },
    mayoAddictionPanel: {
      title: "Mayo Clinic Laboratories - Addiction Medicine Profile, Urine",
      url: "https://www.mayocliniclabs.com/test-catalog/overview/615908",
      type: "lab panel",
    },
    arupZolpidem: {
      title: "ARUP Laboratories - Zolpidem, Urine Quantitative",
      url: "https://ltd.aruplab.com/Tests/Pub/2012319",
      type: "lab reference",
    },
    arupGabapentin: {
      title: "ARUP Laboratories - Gabapentin, Urine",
      url: "https://ltd.aruplab.com/Tests/Pub/2012227",
      type: "lab reference",
    },
  };

  const items = [
    item("morphine", "Morphine", "Opioids", "drug", ["MS Contin", "Roxanol"], "Urine typically 1-3 days; source may be morphine use, codeine/heroin metabolism, or poppy exposure.", "Morphine-like opiate; also a metabolite of codeine and heroin.", ["mayoOpiates", "arupDetectionWindows"]),
    item("codeine", "Codeine", "Opioids", "drug", ["Tylenol #3"], "Urine typically 1-3 days; morphine and norcodeine may support codeine exposure when included.", "Can produce morphine and small hydrocodone in some contexts.", ["mayoOpiates", "arupDetectionWindows"]),
    item("norcodeine", "Norcodeine", "Opioids", "finding", [], "Usually interpreted within the codeine window (~1-3 days); only meaningful if included on a definitive panel.", "Supportive codeine metabolite when included.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("heroin", "Heroin", "Opioids", "drug", ["diacetylmorphine"], "Parent heroin is not detected in urine; use 6-MAM (<1 day) and downstream morphine pattern.", "6-MAM is the specific heroin marker when present.", ["mayoOpiates", "arupDetectionWindows"]),
    item("6mam", "6-MAM", "Opioids", "finding", ["6-acetylmorphine", "6-monoacetylmorphine"], "Urine usually <1 day; absence does not exclude heroin exposure after the short 6-MAM window.", "Specific marker of recent heroin exposure when detected.", ["mayoOpiates", "arupDetectionWindows"]),
    item("hydrocodone", "Hydrocodone", "Opioids", "drug", ["Norco", "Vicodin", "Lortab"], "Urine typically 1-3 days; norhydrocodone and hydromorphone can extend pattern interpretation.", "Parent opioid that can produce norhydrocodone, hydromorphone, and dihydrocodeine.", ["mayoOpiates", "arupDetectionWindows"]),
    item("norhydrocodone", "Norhydrocodone", "Opioids", "finding", [], "Usually interpreted within the hydrocodone window (~1-3 days); supportive when parent hydrocodone is absent or low.", "Supportive hydrocodone metabolite.", ["mayoOpiates", "arupDetectionWindows"]),
    item("hydromorphone", "Hydromorphone", "Opioids", "drug_or_finding", ["Dilaudid"], "Urine typically 1-4 days; may reflect hydromorphone use or hydrocodone/morphine metabolism.", "May reflect hydromorphone exposure, hydrocodone metabolism, or minor morphine metabolism.", ["mayoOpiates", "mayoOpiateInterpretation", "arupDetectionWindows"]),
    item("dihydrocodeine", "Dihydrocodeine", "Opioids", "finding", [], "Usually interpreted within the hydrocodone/codeine window (~1-3 days); supportive but not source-specific alone.", "Minor/supportive hydrocodone pathway finding.", ["mayoOpiates", "arupDetectionWindows"]),
    item("oxycodone", "Oxycodone", "Opioids", "drug", ["OxyContin", "Percocet", "Roxicodone"], "Urine typically 1-3 days; generic opiate screens may miss it without oxycodone-specific testing.", "Requires oxycodone-specific assay or definitive testing if routine opiate screen is negative.", ["mayoOpiates", "mayoOxycodone", "arupDetectionWindows"]),
    item("noroxycodone", "Noroxycodone", "Opioids", "finding", [], "Usually interpreted within the oxycodone window (~1-3 days); supportive of oxycodone exposure.", "Supportive oxycodone metabolite.", ["mayoOxycodone", "arupDetectionWindows"]),
    item("oxymorphone", "Oxymorphone", "Opioids", "drug_or_finding", ["Opana"], "Urine typically 1-3 days; can be prescribed directly or appear as an oxycodone metabolite.", "Can be prescribed directly or appear as oxycodone metabolite.", ["mayoOpiates", "mayoOxycodone", "arupDetectionWindows"]),
    item("noroxymorphone", "Noroxymorphone", "Opioids", "finding", [], "Usually interpreted within the oxycodone/oxymorphone window (~1-3 days); also chemically overlaps nornaloxone.", "Supports oxycodone/oxymorphone pathway when included.", ["mayoOxycodone", "arupDetectionWindows"]),
    item("fentanyl", "Fentanyl", "Opioids", "drug", ["Duragesic", "Sublimaze"], "Urine typically 1-7 days; chronic exposure or lipophilic tissue redistribution can prolong detectability.", "Not detected by routine opiate immunoassay.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("norfentanyl", "Norfentanyl", "Opioids", "finding", [], "Usually interpreted within the fentanyl window (~1-7 days); often more useful than parent fentanyl.", "Supportive fentanyl metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("buprenorphine", "Buprenorphine", "Opioids", "drug", ["Suboxone", "Subutex", "Belbuca", "Butrans"], "Urine typically 1-10 days; route/formulation and chronic dosing affect parent/metabolite pattern.", "Requires buprenorphine-specific testing or definitive testing.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("norbuprenorphine", "Norbuprenorphine", "Opioids", "finding", [], "Usually interpreted within the buprenorphine window (~1-10 days); supports metabolism rather than only contamination.", "Supports buprenorphine metabolism/exposure.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("methadone", "Methadone", "Opioids", "drug", ["Dolophine"], "Urine typically 1-14 days; long and variable half-life makes timing interpretation imprecise.", "Requires methadone-specific testing or definitive testing.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("eddp", "EDDP", "Opioids", "finding", ["methadone metabolite"], "Usually interpreted within the methadone window (~1-14 days); supports ingestion/metabolism.", "Supports methadone ingestion/metabolism.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("tramadol", "Tramadol", "Opioids", "drug", ["Ultram"], "Urine typically 1-4 days; routine opiate screens may miss it without targeted testing.", "Not reliably detected by routine opiate immunoassay.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("odesmethyltramadol", "O-desmethyltramadol", "Opioids", "finding", ["M1 tramadol metabolite"], "Urine typically 1-4 days; supportive metabolite and affected by CYP2D6 variability.", "Supportive tramadol metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("tapentadol", "Tapentadol", "Opioids", "drug", ["Nucynta"], "Urine typically 1-3 days when specifically tested; not detected by routine opiate immunoassay.", "Requires specific/definitive panel; not a routine opiate screen finding.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("ndesmethyltapentadol", "N-desmethyltapentadol", "Opioids", "finding", ["tapentadol metabolite"], "Usually interpreted within the tapentadol window (~1-3 days); definitive panel must include the metabolite.", "Supportive tapentadol metabolite when included.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("naloxone", "Naloxone", "Opioids", "drug_or_finding", ["Narcan"], "Urine typically 1-2 days when detected; low bioavailability can make absence difficult to interpret.", "May appear with naloxone exposure or buprenorphine/naloxone combination products.", ["mayoOpiates", "arupDrugTesting", "arupDetectionWindows"]),
    item("naltrexone", "Naltrexone", "Opioids", "drug", ["Vivitrol", "ReVia"], "Targeted panel only; window depends on oral vs depot formulation, cutoff, and 6-beta-naltrexol detection.", "Expected antagonist parent drug when tested.", ["arupDrugTesting"]),
    item("6beta_naltrexol", "6-beta-naltrexol", "Opioids", "finding", ["naltrexone metabolite"], "Targeted panel only; interpreted with naltrexone formulation, timing, and assay cutoff.", "Supportive naltrexone metabolite.", ["arupDrugTesting"]),
    item("meperidine", "Meperidine", "Opioids", "drug", ["Demerol"], "Urine typically 1-2 days; normeperidine supports exposure when included.", "Optional pain/addiction coverage; requires specific testing.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("normeperidine", "Normeperidine", "Opioids", "finding", [], "Usually interpreted within the meperidine window (~1-2 days); metabolite accumulation can matter clinically.", "Supportive meperidine metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("propoxyphene", "Propoxyphene", "Opioids", "drug", ["Darvon", "Darvocet"], "Expanded definitive panel; interpret with norpropoxyphene, timing, cutoff, and medication history.", "Expanded-panel opioid; interpret with norpropoxyphene when included.", ["arupExpandedPanel"]),
    item("norpropoxyphene", "Norpropoxyphene", "Opioids", "finding", [], "Expanded definitive panel; supportive propoxyphene metabolite, with window dependent on cutoff and timing.", "Supportive propoxyphene metabolite when included.", ["arupExpandedPanel"]),
    item("sufentanil", "Sufentanil", "Opioids", "drug", ["Sufenta"], "Specialized definitive panel; short parent window, so metabolite/panel coverage and timing are critical.", "Expanded-panel synthetic opioid; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("norsufentanil", "Norsufentanil", "Opioids", "finding", [], "Specialized definitive panel; supportive sufentanil metabolite when ordered and above cutoff.", "Supportive sufentanil metabolite when included.", ["arupExpandedPanel"]),
    item("alfentanil", "Alfentanil", "Opioids", "drug", ["Alfenta"], "Specialized definitive panel; short parent window, with interpretation dependent on timing and cutoff.", "Expanded-panel synthetic opioid; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("noralfentanil", "Noralfentanil", "Opioids", "finding", [], "Specialized definitive panel; supportive alfentanil metabolite when ordered and above cutoff.", "Supportive alfentanil metabolite when included.", ["arupExpandedPanel"]),
    item("remifentanil", "Remifentanil", "Opioids", "drug", ["Ultiva"], "Specialized definitive panel; parent drug is very short-lived, so routine urine interpretation is limited.", "Expanded-panel synthetic opioid; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("carfentanil", "Carfentanil", "Opioids", "drug", [], "Specialized fentanyl-analog panel; window depends on targeted analyte, cutoff, exposure size, and timing.", "Expanded-panel fentanyl analog; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("loperamide", "Loperamide", "Opioids", "drug", ["Imodium"], "Expanded definitive panel; interpret with desmethylloperamide and cutoff rather than routine opiate screen.", "Expanded-panel opioid agonist; interpret with desmethylloperamide when included.", ["arupExpandedPanel"]),
    item("desmethylloperamide", "Desmethylloperamide", "Opioids", "finding", [], "Expanded definitive panel; supportive loperamide metabolite with assay/cutoff-dependent window.", "Supportive loperamide metabolite when included.", ["arupExpandedPanel"]),
    item("levorphanol", "Levorphanol", "Opioids", "drug", [], "Targeted opioid panel; urine window depends on cutoff, chronicity, and whether levorphanol is specifically ordered.", "Expanded-panel opioid; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("tapentadol_glucuronide", "Tapentadol glucuronide", "Opioids", "finding", ["tapentadol conjugate"], "Usually interpreted within the tapentadol window (~1-3 days); glucuronide detection is panel-specific.", "Supportive tapentadol conjugate/metabolite when included.", ["arupExpandedPanel", "arupDetectionWindows"]),

    item("diazepam", "Diazepam", "Benzodiazepines", "drug", ["Valium"], "Urine typically 1-7 days; shared metabolites can persist longer and obscure the parent benzodiazepine source.", "Shares nordiazepam/temazepam/oxazepam pathway.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("nordiazepam", "Nordiazepam", "Benzodiazepines", "finding", ["desmethyldiazepam"], "Urine typically 1-20 days; shared long-acting metabolite from diazepam-type benzodiazepines.", "Shared metabolite from diazepam-type benzodiazepines.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("temazepam", "Temazepam", "Benzodiazepines", "drug_or_finding", ["Restoril"], "Urine typically 1-4 days; may be prescribed directly or appear downstream from diazepam-type drugs.", "Can be prescribed directly or appear in diazepam-type pathway.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("oxazepam", "Oxazepam", "Benzodiazepines", "drug_or_finding", ["Serax"], "Urine typically 1-7 days; common terminal metabolite, so source requires the full benzo pattern.", "Shared terminal benzodiazepine metabolite.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("chlordiazepoxide", "Chlordiazepoxide", "Benzodiazepines", "drug", ["Librium"], "Urine typically 1-10 days; downstream nordiazepam/oxazepam can outlast parent drug.", "Can produce nordiazepam and oxazepam.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("clorazepate", "Clorazepate", "Benzodiazepines", "drug", ["Tranxene"], "Usually interpreted through nordiazepam-type metabolites; urine window can extend days to weeks depending on pattern.", "Rapidly converts into nordiazepam pathway.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("alprazolam", "Alprazolam", "Benzodiazepines", "drug", ["Xanax"], "Urine typically 1-5 days; alpha-hydroxyalprazolam is the supportive metabolite.", "Alpha-hydroxyalprazolam supports alprazolam exposure.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("alpha_hydroxyalprazolam", "Alpha-hydroxyalprazolam", "Benzodiazepines", "finding", ["alprazolam metabolite"], "Usually interpreted within the alprazolam window (~1-5 days); supportive metabolite when included.", "Supportive alprazolam metabolite.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("clonazepam", "Clonazepam", "Benzodiazepines", "drug", ["Klonopin"], "Urine typically 1-12 days; 7-aminoclonazepam is usually the better urine target.", "7-aminoclonazepam is usually more useful in urine.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("aminoclonazepam7", "7-aminoclonazepam", "Benzodiazepines", "finding", ["7-amino-clonazepam"], "Usually interpreted within the clonazepam window (~1-12 days); preferred supportive urine metabolite.", "Supportive clonazepam metabolite.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("lorazepam", "Lorazepam", "Benzodiazepines", "drug", ["Ativan"], "Urine typically 1-7 days; glucuronide sensitivity affects immunoassay detection.", "May be missed by assays without glucuronide sensitivity.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("lorazepam_glucuronide", "Lorazepam-glucuronide", "Benzodiazepines", "finding", ["lorazepam glucuronide"], "Usually interpreted within the lorazepam window (~1-7 days); detection depends on glucuronide-sensitive methods.", "Supportive lorazepam metabolite; assay sensitivity varies.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("midazolam", "Midazolam", "Benzodiazepines", "drug", ["Versed"], "Urine typically 1-2 days; alpha-hydroxymidazolam supports recent exposure.", "Alpha-hydroxymidazolam supports recent midazolam exposure.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("alpha_hydroxymidazolam", "Alpha-hydroxymidazolam", "Benzodiazepines", "finding", ["midazolam metabolite"], "Usually interpreted within the midazolam window (~1-2 days); supportive recent-exposure metabolite.", "Supportive midazolam metabolite.", ["arupBenzodiazepines", "arupDetectionWindows"]),
    item("triazolam", "Triazolam", "Benzodiazepines", "drug", ["Halcion"], "Short-window benzodiazepine; usually requires definitive parent/metabolite testing and timing context.", "Alpha-hydroxytriazolam supports triazolam exposure.", ["arupBenzodiazepines"]),
    item("alpha_hydroxytriazolam", "Alpha-hydroxytriazolam", "Benzodiazepines", "finding", ["triazolam metabolite"], "Short-window supportive metabolite; interpret with triazolam timing, cutoff, and panel contents.", "Supportive triazolam metabolite.", ["arupBenzodiazepines"]),
    item("flurazepam", "Flurazepam", "Benzodiazepines", "drug", ["Dalmane"], "Long-acting benzodiazepine; hydroxyethylflurazepam may persist for days and is the key supportive finding.", "Hydroxyethylflurazepam supports flurazepam exposure.", ["arupBenzodiazepines"]),
    item("hydroxyethylflurazepam", "Hydroxyethylflurazepam", "Benzodiazepines", "finding", [], "Long-acting supportive metabolite; urine detection may persist for days depending on dose and cutoff.", "Supportive flurazepam metabolite.", ["arupBenzodiazepines"]),
    item("estazolam", "Estazolam", "Benzodiazepines", "drug", ["Prosom"], "Definitive benzodiazepine panel; usually several-day window, with interpretation dependent on timing and cutoff.", "Usually interpreted as parent/specific analyte when included.", ["arupBenzodiazepines"]),
    item("flunitrazepam", "Flunitrazepam", "Benzodiazepines", "drug", ["Rohypnol"], "Definitive panel; 7-aminoflunitrazepam is the supportive metabolite and timing/cutoff drive interpretation.", "7-aminoflunitrazepam supports flunitrazepam exposure.", ["arupBenzodiazepines"]),
    item("aminoflunitrazepam7", "7-aminoflunitrazepam", "Benzodiazepines", "finding", [], "Supportive flunitrazepam metabolite; window is timing/cutoff dependent on definitive panels.", "Supportive flunitrazepam metabolite.", ["arupBenzodiazepines"]),
    item("bromazepam", "Bromazepam", "Benzodiazepines", "drug", [], "Expanded definitive panel; interpret with 3-hydroxybromazepam, timing, and cutoff rather than class screen alone.", "Expanded-panel benzodiazepine; interpret with 3-hydroxybromazepam when included.", ["arupExpandedPanel", "arupBenzodiazepines"]),
    item("hydroxybromazepam3", "3-hydroxybromazepam", "Benzodiazepines", "finding", ["3-OH-bromazepam"], "Expanded definitive panel; supportive bromazepam metabolite with assay/cutoff-dependent window.", "Supportive bromazepam metabolite when included.", ["arupExpandedPanel", "arupBenzodiazepines"]),
    item("etizolam", "Etizolam", "Benzodiazepines", "drug", [], "Expanded definitive panel; window varies by thienodiazepine metabolite, dose, timing, and cutoff.", "Thienodiazepine/benzodiazepine-class exposure; interpret with alpha-hydroxyetizolam when included.", ["arupExpandedPanel"]),
    item("alpha_hydroxyetizolam", "Alpha-hydroxyetizolam", "Benzodiazepines", "finding", ["etizolam metabolite"], "Expanded definitive panel; supportive etizolam metabolite with timing/cutoff-dependent window.", "Supportive etizolam metabolite when included.", ["arupExpandedPanel"]),
    item("bromazolam", "Bromazolam", "Benzodiazepines", "drug", [], "Expanded definitive panel; novel benzodiazepine window varies by metabolite, cutoff, and exposure pattern.", "Novel benzodiazepine exposure; interpret with alpha-hydroxybromazolam when included.", ["arupExpandedPanel"]),
    item("alpha_hydroxybromazolam", "Alpha-hydroxybromazolam", "Benzodiazepines", "finding", ["bromazolam metabolite"], "Expanded definitive panel; supportive bromazolam metabolite with timing/cutoff-dependent window.", "Supportive bromazolam metabolite when included.", ["arupExpandedPanel"]),
    item("flualprazolam", "Flualprazolam", "Benzodiazepines", "drug", [], "Expanded definitive panel; novel benzodiazepine window varies by metabolite, cutoff, and exposure pattern.", "Novel benzodiazepine exposure; interpret with alpha-hydroxyflualprazolam when included.", ["arupExpandedPanel"]),
    item("alpha_hydroxyflualprazolam", "Alpha-hydroxyflualprazolam", "Benzodiazepines", "finding", ["flualprazolam metabolite"], "Expanded definitive panel; supportive flualprazolam metabolite with timing/cutoff-dependent window.", "Supportive flualprazolam metabolite when included.", ["arupExpandedPanel"]),
    item("clobazam", "Clobazam", "Benzodiazepines", "drug", ["Onfi"], "Expanded definitive panel; norclobazam can persist and is important for exposure interpretation.", "Benzodiazepine exposure; norclobazam supports clobazam when included.", ["arupExpandedPanel", "arupBenzodiazepines"]),
    item("norclobazam", "Norclobazam", "Benzodiazepines", "finding", [], "Expanded definitive panel; supportive clobazam metabolite, often longer-lived than parent drug.", "Supportive clobazam metabolite when included.", ["arupExpandedPanel", "arupBenzodiazepines"]),

    item("amphetamine", "Amphetamine", "Stimulants", "drug_or_finding", ["Adderall component", "amphetamine salts"], "Urine typically 1-7 days; may be parent drug or metabolite, and elimination is urine-pH dependent.", "Can be parent drug or metabolite.", ["arupDetectionWindows", "uic"]),
    item("methamphetamine", "Methamphetamine", "Stimulants", "drug", ["Desoxyn"], "Urine typically 1-4 days; amphetamine may appear as metabolite and isomer testing may clarify source.", "Can produce amphetamine; source may require d/l isomer testing.", ["arupDetectionWindows"]),
    item("d_methamphetamine", "d-methamphetamine", "Stimulants", "finding", ["dextromethamphetamine"], "Usually interpreted within the methamphetamine window (~1-4 days); d/l isomer result helps source assessment.", "Isomer testing may support prescription/illicit source assessment.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("l_methamphetamine", "l-methamphetamine", "Stimulants", "finding", ["levomethamphetamine"], "Usually interpreted within the methamphetamine window (~1-4 days); source depends on isomer and medication context.", "Can be consistent with selegiline or some OTC inhaler exposure depending on context.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("mdma", "MDMA", "Stimulants", "drug", ["Ecstasy", "Molly"], "Urine typically 1-3 days; MDA may appear as metabolite or separate exposure.", "Can produce MDA.", ["arupDetectionWindows"]),
    item("mda", "MDA", "Stimulants", "drug_or_finding", [], "Urine typically 1-3 days; may reflect MDA exposure or metabolism from MDMA/MDEA.", "Can be metabolite of MDMA/MDEA or a primary exposure.", ["arupDetectionWindows"]),
    item("mdea", "MDEA", "Stimulants", "drug", ["Eve"], "Urine typically 1-3 days; MDA may appear downstream and source requires the full stimulant pattern.", "Can produce MDA.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("lisdexamfetamine", "Lisdexamfetamine", "Stimulants", "drug", ["Vyvanse"], "Interpreted through amphetamine, typically 1-7 days; medication history is essential for source.", "Explains amphetamine findings.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("selegiline", "Selegiline", "Stimulants", "drug", ["Emsam", "Zelapar"], "Interpreted through l-methamphetamine/l-amphetamine patterns; timing and isomer testing determine usefulness.", "Can explain l-methamphetamine/l-amphetamine pattern.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("phentermine", "Phentermine", "Stimulants", "drug", ["Adipex-P"], "Urine typically 1-5 days; can be relevant to unexpected stimulant immunoassay results.", "May be relevant to stimulant testing and immunoassay context.", ["arupDetectionWindows"]),
    item("benzphetamine", "Benzphetamine", "Stimulants", "drug", ["Didrex"], "Interpreted through methamphetamine/amphetamine metabolites; source assessment requires medication history and isomer context.", "Can metabolize to methamphetamine and amphetamine.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("methylphenidate", "Methylphenidate", "Stimulants", "drug", ["Ritalin", "Concerta"], "Parent urine window is usually <1 day; ritalinic acid is the preferred supportive metabolite.", "Ritalinic acid supports methylphenidate exposure.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("ritalinic_acid", "Ritalinic acid", "Stimulants", "finding", [], "Usually interpreted with recent methylphenidate exposure; definitive panel cutoff/timing determine detectability.", "Supportive methylphenidate metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("pseudoephedrine", "Pseudoephedrine", "Stimulants", "drug_or_context", ["Sudafed"], "Context entry, not a definitive UDS window; review when explaining stimulant screen cross-reactivity/source ambiguity.", "More relevant to assay/source context than definitive amphetamine confirmation.", ["uic"]),
    item("ephedrine", "Ephedrine", "Stimulants", "drug_or_context", [], "Context entry, not a definitive UDS window; review when explaining stimulant screen cross-reactivity/source ambiguity.", "More relevant to assay/source context than definitive amphetamine confirmation.", ["uic"]),
    item("mephedrone", "Mephedrone", "Stimulants", "drug", ["4-MMC"], "Expanded definitive panel; synthetic cathinone windows are compound-, cutoff-, and timing-dependent.", "Expanded-panel stimulant/synthetic cathinone; requires specific/definitive testing.", ["arupExpandedPanel"]),
    item("methcathinone", "Methcathinone", "Stimulants", "drug_or_finding", [], "Expanded definitive panel; cathinone finding requires targeted analyte, cutoff, and timing context.", "Expanded-panel stimulant/cathinone finding; interpret with definitive panel context.", ["arupExpandedPanel"]),

    item("cocaine", "Cocaine", "Cocaine", "drug", [], "Parent cocaine is rarely observed and usually <1 day; benzoylecgonine is typically 1-2 days.", "Benzoylecgonine is the common primary urine metabolite.", ["arupDetectionWindows"]),
    item("benzoylecgonine", "Benzoylecgonine", "Cocaine", "finding", ["BE"], "Urine typically 1-2 days; heavy or repeated use may extend detection beyond the usual window.", "Supports cocaine exposure.", ["arupDetectionWindows"]),
    item("ecgonine_methyl_ester", "Ecgonine methyl ester", "Cocaine", "finding", [], "Definitive cocaine metabolite; usually interpreted within cocaine-metabolite window (~1-2 days) and cutoff.", "Supportive cocaine metabolite when included.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("cocaethylene", "Cocaethylene", "Cocaine", "finding", [], "Definitive metabolite suggesting cocaine plus ethanol; window depends on timing, cutoff, and co-exposure.", "Suggests cocaine plus ethanol exposure.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("norcocaine", "Norcocaine", "Cocaine", "finding", [], "Minor cocaine metabolite; interpret with benzoylecgonine, timing, cutoff, and panel contents.", "Minor cocaine metabolite when included.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("anhydroecgonine_methyl_ester", "Anhydroecgonine methyl ester", "Cocaine", "finding", ["AEME"], "Expanded definitive panel; smoking-marker interpretation depends on targeted assay, cutoff, and timing.", "May support smoked cocaine exposure when included.", ["arupExpandedPanel"]),

    item("delta9_thc", "Delta-9-THC", "Cannabinoids", "drug", ["THC", "cannabis", "marijuana"], "Urine usually relies on THC-COOH, not parent THC; overall cannabinoid window may range 1-45 days.", "Parent cannabinoid; urine interpretation usually relies on metabolites.", ["arupDetectionWindows"]),
    item("hydroxy11_thc", "11-hydroxy-THC", "Cannabinoids", "finding", [], "Specialized cannabinoid metabolite; interpret with THC-COOH, timing, cutoff, and assay specificity.", "Intermediate active metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("thc_cooh", "THC-COOH", "Cannabinoids", "finding", ["11-nor-9-carboxy-THC", "carboxy-THC"], "Urine may range 1-45 days; infrequent use is shorter, while frequent/chronic use can persist for weeks.", "Supports cannabinoid exposure.", ["arupDetectionWindows", "uic"]),
    item("thc_cooh_glucuronide", "THC-COOH-glucuronide", "Cannabinoids", "finding", [], "Conjugated THC-COOH finding; interpret with total/free THC-COOH method, cutoff, and serial trend if available.", "Conjugated THC-COOH metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("delta8_thc", "Delta-8-THC", "Cannabinoids", "drug", [], "Method-specific cannabinoid result; many routine tests do not distinguish delta-8 from delta-9 metabolites.", "Delta-8 interpretation depends on assay specificity.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("delta8_thc_cooh", "Delta-8-THC-COOH", "Cannabinoids", "finding", [], "Method-specific metabolite; interpret with cannabinoid assay specificity, cutoff, and delta-8 exposure history.", "Supports delta-8 cannabinoid exposure when assay is specific.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("synthetic_cannabinoids", "Synthetic cannabinoids", "Cannabinoids", "drug_or_context", ["K2", "Spice"], "Specialized panel only; routine THC windows do not apply and each compound/metabolite has its own window.", "Usually requires specialized testing; routine THC screens do not reliably detect synthetic cannabinoids.", ["arupExpandedPanel", "arupDrugTesting"]),
    item("cbd", "CBD", "Cannabinoids", "drug_or_context", ["cannabidiol"], "Context entry; routine UDS usually focuses on THC metabolites, while CBD products may affect interpretation through contamination.", "CBD products may complicate THC interpretation if contamination is possible.", ["arupDrugTesting"]),
    item("creatinine_normalized_thc_cooh", "Creatinine-normalized THC-COOH", "Cannabinoids", "context", [], "Serial interpretation field; compare normalized values over time rather than applying a single detection window.", "Serial normalized values are more useful than a single raw value for reuse vs residual excretion.", ["arupDrugTesting"]),

    item("ethanol", "Ethanol", "Alcohol markers", "drug", ["alcohol"], "Urine ethanol itself is short-lived; EtG/EtS are typically used for ~1-4 day alcohol exposure questions.", "EtG/EtS support recent ethanol exposure; PEth supports longer-window exposure.", ["arupDetectionWindows"]),
    item("etg", "EtG", "Alcohol markers", "finding", ["ethyl glucuronide"], "Urine typically 1-4 days; cutoff, incidental exposure, and timing can materially change interpretation.", "Supports recent ethanol exposure; interpret cutoff/context.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("ets", "EtS", "Alcohol markers", "finding", ["ethyl sulfate"], "Urine typically 1-4 days; often paired with EtG to support recent ethanol exposure.", "Supports recent ethanol exposure; interpret cutoff/context.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("peth", "PEth", "Alcohol markers", "finding", ["phosphatidylethanol"], "Blood alcohol marker, not urine; commonly supports longer-window exposure over weeks rather than same-day use.", "Supports longer-window alcohol exposure.", ["arupDrugTesting"]),

    item("zolpidem", "Zolpidem", "Sedative-hypnotics", "drug", ["Ambien"], "Urine typically 1-3 days; parent can be brief, so metabolite testing may be more useful.", "Specific testing may target parent and/or metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("zolpidem_carboxylic_acid", "Zolpidem phenyl-4-carboxylic acid", "Sedative-hypnotics", "finding", ["zolpidem metabolite"], "Usually interpreted within the zolpidem window (~1-3 days); supportive metabolite when included.", "Supportive zolpidem metabolite.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("carisoprodol", "Carisoprodol", "Sedative-hypnotics", "drug", ["Soma"], "Urine typically 1-4 days; meprobamate supports exposure and may be the key finding.", "Meprobamate supports carisoprodol exposure.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("meprobamate", "Meprobamate", "Sedative-hypnotics", "drug_or_finding", [], "Urine typically 1-4 days; may reflect meprobamate use or carisoprodol metabolism.", "May reflect meprobamate exposure or carisoprodol metabolism.", ["arupDrugTesting", "arupDetectionWindows"]),
    item("zaleplon", "Zaleplon", "Sedative-hypnotics", "drug", ["Sonata"], "Targeted panel; short parent window, so 5-oxo-zaleplon and collection timing are important.", "Non-benzodiazepine hypnotic; interpret with 5-oxo-zaleplon when included.", ["arupExpandedPanel"]),
    item("oxo_zaleplon_5", "5-oxo-zaleplon", "Sedative-hypnotics", "finding", ["zaleplon metabolite"], "Targeted panel; supportive zaleplon metabolite with cutoff- and timing-dependent window.", "Supportive zaleplon metabolite when included.", ["arupExpandedPanel"]),
    item("eszopiclone", "Eszopiclone", "Sedative-hypnotics", "drug", ["Lunesta"], "Targeted panel; short/intermediate hypnotic window depends on parent/metabolite coverage and cutoff.", "Non-benzodiazepine hypnotic; interpret with zopiclone N-oxide when included.", ["arupExpandedPanel"]),
    item("zopiclone_n_oxide", "Zopiclone N-oxide", "Sedative-hypnotics", "finding", ["eszopiclone metabolite", "zopiclone metabolite"], "Targeted panel; supportive eszopiclone/zopiclone metabolite with timing/cutoff-dependent window.", "Supportive zopiclone/eszopiclone metabolite when included.", ["arupExpandedPanel"]),

    item("amobarbital", "Amobarbital", "Barbiturates", "drug", [], "Barbiturate-specific/definitive panel; window depends on drug half-life, cutoff, and timing.", "Barbiturate exposure; interpret with barbiturate-specific or definitive testing.", ["arupExpandedPanel"]),
    item("butalbital", "Butalbital", "Barbiturates", "drug", ["Fioricet component", "Fiorinal component"], "Urine typically 1-18 days; long window makes medication history and timing important.", "Barbiturate exposure; interpret with medication history and panel specificity.", ["arupExpandedPanel", "arupDetectionWindows"]),
    item("pentobarbital", "Pentobarbital", "Barbiturates", "drug", ["Nembutal"], "Barbiturate-specific/definitive panel; usually shorter than phenobarbital but cutoff/timing dependent.", "Barbiturate exposure; interpret with barbiturate-specific or definitive testing.", ["arupExpandedPanel"]),
    item("phenobarbital", "Phenobarbital", "Barbiturates", "drug", [], "Urine typically 1-16 days; long half-life can make detection persist after clinical effects fade.", "Long-acting barbiturate; urine detection can persist longer than many sedatives.", ["arupExpandedPanel", "arupDetectionWindows"]),
    item("secobarbital", "Secobarbital", "Barbiturates", "drug", ["Seconal"], "Barbiturate-specific/definitive panel; window depends on dose, timing, and assay cutoff.", "Barbiturate exposure; interpret with barbiturate-specific or definitive testing.", ["arupExpandedPanel"]),

    item("gabapentin", "Gabapentin", "Gabapentinoids", "drug", ["Neurontin"], "Urine typically 1-2 days when specifically tested; not part of most routine drug screens.", "Usually requires specific/expanded-panel testing; not part of routine drug screens.", ["arupGabapentin", "arupExpandedPanel", "arupDetectionWindows"]),
    item("pregabalin", "Pregabalin", "Gabapentinoids", "drug", ["Lyrica"], "Urine typically 1-2 days when specifically tested; not part of most routine drug screens.", "Usually requires specific/expanded-panel testing; not part of routine drug screens.", ["arupExpandedPanel", "arupDetectionWindows"]),

    item("ketamine", "Ketamine", "Dissociatives", "drug", ["Ketalar"], "Targeted definitive panel; usually interpreted with norketamine and timing because routine screens may not include it.", "Dissociative anesthetic; norketamine supports exposure when included.", ["arupExpandedPanel"]),
    item("norketamine", "Norketamine", "Dissociatives", "finding", [], "Targeted definitive panel; supportive ketamine metabolite with timing/cutoff-dependent window.", "Supportive ketamine metabolite when included.", ["arupExpandedPanel"]),
    item("dehydronorketamine", "Dehydronorketamine", "Dissociatives", "finding", [], "Targeted definitive panel; ketamine-pathway metabolite interpreted with norketamine and cutoff.", "Ketamine-pathway metabolite when included.", ["arupExpandedPanel"]),
    item("pcp", "PCP", "Dissociatives", "drug_or_finding", ["phencyclidine"], "Urine typically 1-7 days; immunoassay false positives require confirmation when unexpected.", "PCP screen interpretation is assay-dependent and can have medication-related false-positive context.", ["uic", "arupExpandedPanel", "arupDetectionWindows"]),

    item("amitriptyline", "Amitriptyline", "Antidepressants / TCA", "drug", ["Elavil"], "Expanded TCA panel; interpret with nortriptyline, chronicity, cutoff, and medication history.", "TCA exposure; nortriptyline supports amitriptyline but can also be prescribed directly.", ["arupExpandedPanel"]),
    item("nortriptyline", "Nortriptyline", "Antidepressants / TCA", "drug_or_finding", ["Pamelor"], "Expanded TCA panel; may be parent drug or amitriptyline metabolite, so source depends on medication history.", "May reflect prescribed nortriptyline or amitriptyline metabolism.", ["arupExpandedPanel"]),
    item("imipramine", "Imipramine", "Antidepressants / TCA", "drug", ["Tofranil"], "Expanded TCA panel; interpret with desipramine, chronicity, cutoff, and medication history.", "TCA exposure; desipramine supports imipramine but can also be prescribed directly.", ["arupExpandedPanel"]),
    item("desipramine", "Desipramine", "Antidepressants / TCA", "drug_or_finding", ["Norpramin"], "Expanded TCA panel; may be parent drug or imipramine metabolite, so source depends on medication history.", "May reflect prescribed desipramine or imipramine metabolism.", ["arupExpandedPanel"]),
    item("doxepin", "Doxepin", "Antidepressants / TCA", "drug", ["Silenor"], "Expanded TCA panel; interpret with nordoxepin, dose timing, cutoff, and medication history.", "TCA exposure; nordoxepin supports doxepin when included.", ["arupExpandedPanel"]),
    item("nordoxepin", "Nordoxepin", "Antidepressants / TCA", "finding", [], "Expanded TCA panel; supportive doxepin metabolite with timing/cutoff-dependent window.", "Supportive doxepin metabolite when included.", ["arupExpandedPanel"]),

    item("bupropion", "Bupropion", "Assay caveats", "drug_or_context", ["Wellbutrin", "Zyban"], "Context entry, not a detection-window analyte; use to explain possible amphetamine immunoassay cross-reactivity.", "Medication context for unexpected amphetamine immunoassay positives depending on assay.", ["uic"]),
    item("sertraline", "Sertraline", "Assay caveats", "drug_or_context", ["Zoloft"], "Context entry, not a detection-window analyte; use to explain possible benzodiazepine immunoassay cross-reactivity.", "Medication context for unexpected benzodiazepine immunoassay positives depending on assay.", ["uic"]),
    item("venlafaxine", "Venlafaxine", "Assay caveats", "drug_or_context", ["Effexor"], "Context entry, not a detection-window analyte; use to explain possible PCP immunoassay cross-reactivity.", "Medication context for unexpected PCP immunoassay positives depending on assay.", ["uic"]),
    item("quetiapine", "Quetiapine", "Assay caveats", "drug_or_context", ["Seroquel"], "Context entry, not a detection-window analyte; use to explain possible TCA immunoassay cross-reactivity.", "Medication context for unexpected TCA immunoassay positives depending on assay.", ["uic"]),
    item("dextromethorphan", "Dextromethorphan", "Assay caveats", "drug_or_context", ["DXM"], "Context entry, not a detection-window analyte; use to explain possible PCP/opioid screen cross-reactivity.", "Medication context for unexpected PCP/opioid screen findings depending on assay.", ["uic"]),
    item("diphenhydramine", "Diphenhydramine", "Assay caveats", "drug_or_context", ["Benadryl"], "Context entry, not a detection-window analyte; use to explain possible PCP/TCA screen cross-reactivity.", "Medication context for unexpected PCP/TCA screen findings depending on assay.", ["uic"]),
    item("benzodiazepine_immunoassay", "Benzodiazepine immunoassay", "Assay caveats", "context", ["benzo screen", "benzodiazepine screen"], "Screen limitation entry; window depends on the specific benzodiazepine/metabolite and assay cross-reactivity.", "Class-level benzodiazepine screen limitation; sensitivity varies by drug/metabolite.", ["uic", "arupBenzodiazepines"]),
    item("opiate_immunoassay", "Opiate immunoassay", "Assay caveats", "context", ["opiate screen", "generic opiate screen"], "Screen limitation entry; morphine/codeine-type windows do not rule in or out synthetic opioids.", "Class-level opiate screen limitation; many semisynthetic/synthetic opioids may be missed.", ["aafp", "arupDrugTesting"]),
    item("amphetamine_immunoassay", "Amphetamine immunoassay", "Assay caveats", "context", ["amphetamine screen", "stimulant screen"], "Screen limitation entry; positive window depends on the confirmed stimulant and assay cross-reactivity.", "Class-level stimulant screen caveat; false positives and source ambiguity require confirmation.", ["uic", "aafp"]),

    item("nicotine", "Nicotine", "Nicotine markers", "drug_or_context", [], "Targeted nicotine panel; cotinine/hydroxycotinine are usually more informative than short-lived parent nicotine.", "Nicotine exposure; cotinine is often the more useful urine marker.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    item("cotinine", "Cotinine", "Nicotine markers", "finding", [], "Targeted nicotine panel; supportive metabolite for recent nicotine exposure, interpreted with cutoff and use history.", "Supportive nicotine metabolite when included.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    item("hydroxycotinine3", "trans-3-hydroxycotinine", "Nicotine markers", "finding", ["3-hydroxycotinine"], "Targeted nicotine panel; supportive downstream metabolite interpreted with cotinine and cutoff.", "Nicotine-pathway metabolite when included.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    item("anabasine", "Anabasine", "Nicotine markers", "finding", [], "Targeted tobacco-alkaloid marker; used for source context rather than simple nicotine exposure timing.", "Tobacco alkaloid marker that may support tobacco-source context when included.", ["mayoAddictionPanel", "arupExpandedPanel"]),

    item("mitragynine", "Mitragynine", "Kratom", "drug_or_finding", ["kratom"], "Expanded definitive panel; kratom interpretation depends on mitragynine/7-OH pattern, cutoff, and timing.", "Kratom alkaloid; 7-hydroxymitragynine supports pathway interpretation when included.", ["arupExpandedPanel"]),
    item("hydroxymitragynine7", "7-hydroxymitragynine", "Kratom", "finding", ["7-OH-mitragynine"], "Expanded definitive panel; supportive kratom-related finding with timing/cutoff-dependent window.", "Supportive mitragynine/kratom-related finding when included.", ["arupExpandedPanel"]),

    item("cyclobenzaprine", "Cyclobenzaprine", "Muscle relaxants", "drug_or_context", ["Flexeril"], "Context/expanded-panel entry; use mainly for TCA screen cross-reactivity or targeted medication review.", "Muscle relaxant structurally related to TCAs; may be relevant to TCA screen context.", ["uic", "arupExpandedPanel"]),
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
    rel("tapentadol", "tapentadol_glucuronide", "supportive metabolite", "secondary", "Tapentadol glucuronide can support tapentadol exposure when included.", ["arupExpandedPanel"]),
    rel("naltrexone", "6beta_naltrexol", "supportive metabolite", "primary", "6-beta-naltrexol supports naltrexone exposure.", ["arupDrugTesting"]),
    rel("meperidine", "normeperidine", "supportive metabolite", "primary", "Normeperidine supports meperidine exposure.", ["arupDrugTesting"]),
    rel("propoxyphene", "norpropoxyphene", "supportive metabolite", "primary", "Norpropoxyphene supports propoxyphene exposure when included.", ["arupExpandedPanel"]),
    rel("sufentanil", "norsufentanil", "supportive metabolite", "primary", "Norsufentanil supports sufentanil exposure when included.", ["arupExpandedPanel"]),
    rel("alfentanil", "noralfentanil", "supportive metabolite", "primary", "Noralfentanil supports alfentanil exposure when included.", ["arupExpandedPanel"]),
    rel("loperamide", "desmethylloperamide", "supportive metabolite", "primary", "Desmethylloperamide supports loperamide exposure when included.", ["arupExpandedPanel"]),

    rel("diazepam", "nordiazepam", "metabolite", "primary", "Nordiazepam supports diazepam-type exposure but is not source-specific.", ["arupBenzodiazepines"]),
    rel("diazepam", "temazepam", "metabolite", "primary", "Temazepam can be part of diazepam pathway or prescribed directly.", ["arupBenzodiazepines"]),
    rel("diazepam", "oxazepam", "terminal metabolite", "primary", "Oxazepam is a shared terminal metabolite.", ["arupBenzodiazepines"]),
    rel("nordiazepam", "oxazepam", "metabolite", "secondary", "Nordiazepam can continue to oxazepam.", ["arupBenzodiazepines"]),
    rel("temazepam", "oxazepam", "metabolite", "secondary", "Temazepam can continue to oxazepam.", ["arupBenzodiazepines"]),
    rel("chlordiazepoxide", "nordiazepam", "metabolite", "primary", "Chlordiazepoxide can produce nordiazepam.", ["arupBenzodiazepines"]),
    rel("chlordiazepoxide", "oxazepam", "terminal metabolite", "primary", "Chlordiazepoxide can contribute to oxazepam patterns.", ["arupBenzodiazepines"]),
    rel("clorazepate", "nordiazepam", "metabolite", "primary", "Clorazepate rapidly enters nordiazepam pathway.", ["arupBenzodiazepines"]),
    rel("clorazepate", "oxazepam", "terminal metabolite", "secondary", "Clorazepate can contribute to downstream oxazepam patterns through the diazepam-type pathway.", ["arupBenzodiazepines"]),
    rel("alprazolam", "alpha_hydroxyalprazolam", "supportive metabolite", "primary", "Alpha-hydroxyalprazolam supports alprazolam exposure.", ["arupBenzodiazepines"]),
    rel("clonazepam", "aminoclonazepam7", "supportive metabolite", "primary", "7-aminoclonazepam supports clonazepam exposure.", ["arupBenzodiazepines"]),
    rel("lorazepam", "lorazepam_glucuronide", "supportive metabolite", "primary", "Lorazepam-glucuronide supports lorazepam exposure; assay sensitivity varies.", ["arupBenzodiazepines"]),
    rel("midazolam", "alpha_hydroxymidazolam", "supportive metabolite", "primary", "Alpha-hydroxymidazolam supports recent midazolam exposure.", ["arupBenzodiazepines"]),
    rel("triazolam", "alpha_hydroxytriazolam", "supportive metabolite", "primary", "Alpha-hydroxytriazolam supports triazolam exposure.", ["arupBenzodiazepines"]),
    rel("flurazepam", "hydroxyethylflurazepam", "supportive metabolite", "primary", "Hydroxyethylflurazepam supports flurazepam exposure.", ["arupBenzodiazepines"]),
    rel("flurazepam", "nordiazepam", "metabolite", "secondary", "Nordiazepam can fit flurazepam exposure but is not source-specific.", ["arupBenzodiazepines"]),
    rel("flurazepam", "oxazepam", "metabolite", "secondary", "Oxazepam can fit flurazepam exposure but is not source-specific.", ["arupBenzodiazepines"]),
    rel("flunitrazepam", "aminoflunitrazepam7", "supportive metabolite", "primary", "7-aminoflunitrazepam supports flunitrazepam exposure.", ["arupBenzodiazepines"]),
    rel("bromazepam", "hydroxybromazepam3", "supportive metabolite", "primary", "3-hydroxybromazepam supports bromazepam exposure when included.", ["arupBenzodiazepines", "arupExpandedPanel"]),
    rel("etizolam", "alpha_hydroxyetizolam", "supportive metabolite", "primary", "Alpha-hydroxyetizolam supports etizolam exposure when included.", ["arupExpandedPanel"]),
    rel("bromazolam", "alpha_hydroxybromazolam", "supportive metabolite", "primary", "Alpha-hydroxybromazolam supports bromazolam exposure when included.", ["arupExpandedPanel"]),
    rel("flualprazolam", "alpha_hydroxyflualprazolam", "supportive metabolite", "primary", "Alpha-hydroxyflualprazolam supports flualprazolam exposure when included.", ["arupExpandedPanel"]),
    rel("clobazam", "norclobazam", "supportive metabolite", "primary", "Norclobazam supports clobazam exposure when included.", ["arupExpandedPanel", "arupBenzodiazepines"]),

    rel("methamphetamine", "amphetamine", "metabolite", "primary", "Methamphetamine with amphetamine may support methamphetamine exposure.", ["arupDrugTesting"]),
    rel("methamphetamine", "d_methamphetamine", "isomer", "context", "d/l isomer testing may help distinguish source.", ["arupDrugTesting"]),
    rel("selegiline", "methamphetamine", "source clue", "context", "Selegiline can explain l-methamphetamine patterns; source interpretation requires isomer and medication context.", ["arupDrugTesting"]),
    rel("selegiline", "l_methamphetamine", "metabolite/source clue", "primary", "Selegiline can explain l-methamphetamine.", ["arupDrugTesting"]),
    rel("selegiline", "amphetamine", "metabolite/source clue", "secondary", "Selegiline can contribute to l-amphetamine patterns.", ["arupDrugTesting"]),
    rel("benzphetamine", "methamphetamine", "metabolite", "primary", "Benzphetamine can metabolize to methamphetamine.", ["arupDrugTesting"]),
    rel("benzphetamine", "amphetamine", "metabolite", "secondary", "Benzphetamine can contribute to amphetamine.", ["arupDrugTesting"]),
    rel("phentermine", "amphetamine", "immunoassay context", "context", "Phentermine can contribute to amphetamine-class immunoassay false-positive or source-ambiguity questions.", ["arupDrugTesting", "uic"]),
    rel("pseudoephedrine", "amphetamine", "immunoassay context", "context", "Pseudoephedrine is an exposure to review when an amphetamine immunoassay result is unexpected.", ["uic"]),
    rel("ephedrine", "amphetamine", "immunoassay context", "context", "Ephedrine is an exposure to review when an amphetamine immunoassay result is unexpected.", ["uic"]),
    rel("bupropion", "amphetamine", "immunoassay caveat", "context", "Bupropion can be relevant to amphetamine immunoassay false-positive context.", ["uic", "arupDrugTesting"]),
    rel("mdma", "mda", "metabolite", "primary", "MDA can support MDMA pathway.", ["arupDrugTesting"]),
    rel("mdea", "mda", "metabolite", "primary", "MDEA can produce MDA.", ["arupDrugTesting"]),
    rel("lisdexamfetamine", "amphetamine", "expected finding", "primary", "Lisdexamfetamine explains amphetamine.", ["arupDrugTesting"]),
    rel("methylphenidate", "ritalinic_acid", "supportive metabolite", "primary", "Ritalinic acid supports methylphenidate exposure when included.", ["arupDrugTesting"]),

    rel("cocaine", "benzoylecgonine", "supportive metabolite", "primary", "Benzoylecgonine supports cocaine exposure.", ["arupDetectionWindows"]),
    rel("cocaine", "ecgonine_methyl_ester", "metabolite", "secondary", "Ecgonine methyl ester supports cocaine exposure when included.", ["arupDrugTesting"]),
    rel("cocaine", "cocaethylene", "ethanol co-exposure marker", "primary", "Cocaethylene suggests cocaine plus ethanol exposure.", ["arupDrugTesting"]),
    rel("cocaine", "norcocaine", "minor metabolite", "secondary", "Norcocaine is a cocaine metabolite when included.", ["arupDrugTesting"]),
    rel("cocaine", "anhydroecgonine_methyl_ester", "pyrolysis marker", "context", "Anhydroecgonine methyl ester may support smoked cocaine exposure when included.", ["arupExpandedPanel"]),

    rel("delta9_thc", "hydroxy11_thc", "metabolite", "secondary", "11-hydroxy-THC is an intermediate THC metabolite.", ["arupDrugTesting"]),
    rel("delta9_thc", "thc_cooh", "supportive metabolite", "primary", "THC-COOH is the common urine marker supporting cannabinoid exposure.", ["arupDetectionWindows", "arupDrugTesting"]),
    rel("delta9_thc", "delta8_thc_cooh", "assay specificity context", "context", "Delta-8 THC-COOH is a related cannabinoid analyte; confirm assay specificity when delta-8 versus delta-9 matters.", ["arupDrugTesting"]),
    rel("hydroxy11_thc", "thc_cooh", "metabolite", "primary", "THC-COOH supports cannabinoid exposure.", ["arupDrugTesting"]),
    rel("thc_cooh", "thc_cooh_glucuronide", "conjugated metabolite", "secondary", "THC-COOH-glucuronide is a conjugated cannabinoid metabolite.", ["arupDrugTesting"]),
    rel("delta8_thc", "delta8_thc_cooh", "supportive metabolite", "primary", "Delta-8 THC-COOH supports delta-8 exposure when assay is specific.", ["arupDrugTesting"]),
    rel("cbd", "thc_cooh", "contamination/context", "context", "CBD products can complicate THC interpretation if THC contamination is possible.", ["arupDrugTesting"]),
    rel("thc_cooh", "creatinine_normalized_thc_cooh", "serial interpretation", "context", "Serial creatinine-normalized THC-COOH is more useful than a single raw value for reuse vs residual excretion.", ["arupDrugTesting"]),
    rel("synthetic_cannabinoids", "delta9_thc", "assay limitation", "context", "Synthetic cannabinoids generally are not reliably detected by routine THC immunoassays.", ["arupDrugTesting", "arupExpandedPanel"]),

    rel("ethanol", "etg", "metabolite", "primary", "EtG supports recent ethanol exposure; cutoff/context matter.", ["arupDrugTesting"]),
    rel("ethanol", "ets", "metabolite", "primary", "EtS supports recent ethanol exposure; cutoff/context matter.", ["arupDrugTesting"]),
    rel("ethanol", "peth", "longer-window marker", "primary", "PEth supports longer-window alcohol exposure.", ["arupDrugTesting"]),

    rel("zolpidem", "zolpidem_carboxylic_acid", "supportive metabolite", "primary", "Zolpidem metabolite may be more useful than parent depending on timing/panel.", ["arupDrugTesting"]),
    rel("carisoprodol", "meprobamate", "supportive metabolite", "primary", "Meprobamate supports carisoprodol exposure but can also be direct exposure.", ["arupDrugTesting"]),
    rel("zaleplon", "oxo_zaleplon_5", "supportive metabolite", "primary", "5-oxo-zaleplon supports zaleplon exposure when included.", ["arupExpandedPanel"]),
    rel("eszopiclone", "zopiclone_n_oxide", "supportive metabolite", "primary", "Zopiclone N-oxide supports zopiclone/eszopiclone exposure when included.", ["arupExpandedPanel"]),
    rel("ketamine", "norketamine", "supportive metabolite", "primary", "Norketamine supports ketamine exposure when included.", ["arupExpandedPanel"]),
    rel("norketamine", "dehydronorketamine", "metabolite", "secondary", "Dehydronorketamine supports the ketamine metabolite pathway when included.", ["arupExpandedPanel"]),
    rel("amitriptyline", "nortriptyline", "supportive metabolite", "primary", "Nortriptyline supports amitriptyline exposure but may also be prescribed directly.", ["arupExpandedPanel"]),
    rel("imipramine", "desipramine", "supportive metabolite", "primary", "Desipramine supports imipramine exposure but may also be prescribed directly.", ["arupExpandedPanel"]),
    rel("doxepin", "nordoxepin", "supportive metabolite", "primary", "Nordoxepin supports doxepin exposure when included.", ["arupExpandedPanel"]),
    rel("nicotine", "cotinine", "supportive metabolite", "primary", "Cotinine supports nicotine exposure when included.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    rel("cotinine", "hydroxycotinine3", "metabolite", "secondary", "trans-3-hydroxycotinine supports nicotine pathway interpretation.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    rel("nicotine", "anabasine", "tobacco alkaloid marker", "context", "Anabasine may support tobacco exposure context when included.", ["mayoAddictionPanel", "arupExpandedPanel"]),
    rel("mitragynine", "hydroxymitragynine7", "supportive metabolite", "primary", "7-hydroxymitragynine supports kratom/mitragynine exposure when included.", ["arupExpandedPanel"]),
    rel("sertraline", "benzodiazepine_immunoassay", "immunoassay caveat", "context", "Sertraline can be relevant to benzodiazepine immunoassay false-positive context.", ["uic", "arupDrugTesting"]),
    rel("venlafaxine", "pcp", "immunoassay caveat", "context", "Venlafaxine can be relevant to PCP immunoassay false-positive context.", ["uic", "arupDrugTesting"]),
    rel("dextromethorphan", "pcp", "immunoassay caveat", "context", "Dextromethorphan can be relevant to PCP or opioid-screen caveat context.", ["uic", "arupDrugTesting"]),
    rel("diphenhydramine", "pcp", "immunoassay caveat", "context", "Diphenhydramine can be relevant to PCP or TCA screen caveat context.", ["uic", "arupDrugTesting"]),
    rel("quetiapine", "amitriptyline", "immunoassay caveat", "context", "Quetiapine can be relevant to TCA immunoassay caveat context.", ["uic", "arupDrugTesting"]),
    rel("cyclobenzaprine", "amitriptyline", "immunoassay caveat", "context", "Cyclobenzaprine can be relevant to TCA immunoassay caveat context.", ["uic", "arupDrugTesting"]),
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
    caveat("immunoassay", ["Stimulants", "Assay caveats"], "Medication-related amphetamine screen caveats", "Bupropion, pseudoephedrine, ephedrine, phentermine, and related medications can be relevant to amphetamine-screen false-positive context depending on assay.", ["uic", "arupDrugTesting"], ["bupropion", "pseudoephedrine", "ephedrine", "phentermine", "amphetamine", "amphetamine_immunoassay"], "important"),
    caveat("immunoassay", ["Cocaine"], "Cocaine screen", "Benzoylecgonine is the primary urine marker; unexpected positives should still be interpreted with cutoff and confirmation context.", ["aafp"]),
    caveat("immunoassay", ["Cannabinoids"], "Cannabinoid screen", "THC immunoassays do not reliably determine timing, dose, impairment, or delta-8 vs delta-9 specificity.", ["arupDrugTesting"]),
    caveat("any", ["Cannabinoids"], "THC overinterpretation warning", "THC-COOH supports cannabinoid exposure but does not establish impairment, exact timing, dose, or new use versus residual excretion.", ["arupDetectionWindows", "uic"], ["thc_cooh", "thc_cooh_glucuronide", "delta9_thc"], "critical"),
    caveat("any", ["Alcohol markers"], "Alcohol marker context", "EtG and EtS require cutoff, timing, incidental exposure, and panel context before clinical conclusions are made.", ["arupDrugTesting", "arupDetectionWindows"], ["etg", "ets"], "critical"),
    caveat("immunoassay", ["Dissociatives", "Assay caveats"], "PCP screen false positives", "PCP immunoassays can have false positives; venlafaxine, dextromethorphan, diphenhydramine, and other medications may be assay-dependent context clues.", ["uic", "arupDrugTesting"], ["pcp", "venlafaxine", "dextromethorphan", "diphenhydramine"], "important"),
    caveat("immunoassay", ["Antidepressants / TCA", "Muscle relaxants", "Assay caveats"], "TCA screen caveats", "TCA immunoassays can have medication-related false positives; interpret unexpected positives with definitive testing and medication review.", ["uic", "arupDrugTesting"], ["amitriptyline", "quetiapine", "diphenhydramine", "cyclobenzaprine"], "important"),
    caveat("immunoassay", ["Sedative-hypnotics", "Gabapentinoids", "Kratom", "Nicotine markers"], "Routine panel coverage", "Many expanded-panel substances are not included in routine immunoassay screens; absence is only meaningful if the analyte was ordered and reported.", ["arupDrugTesting", "arupExpandedPanel"], ["zolpidem", "zaleplon", "eszopiclone", "gabapentin", "pregabalin", "mitragynine", "nicotine"], "important"),
    caveat("definitive", ["Opioids", "Benzodiazepines", "Stimulants", "Cocaine", "Cannabinoids", "Alcohol markers", "Sedative-hypnotics", "Barbiturates", "Gabapentinoids", "Dissociatives", "Antidepressants / TCA", "Assay caveats", "Nicotine markers", "Kratom", "Muscle relaxants"], "Definitive testing", "LC-MS/MS or GC-MS is preferred for unexpected results, adherence/diversion concerns, and parent/metabolite pattern interpretation.", ["arupDrugTesting", "aafp"]),
  ];

  const commonGroups = [
    "Opioids",
    "Benzodiazepines",
    "Stimulants",
    "Cannabinoids",
    "Cocaine",
    "Alcohol markers",
    "Sedative-hypnotics",
    "Barbiturates",
    "Dissociatives",
    "Assay caveats",
  ];
  const highYieldSearches = ["fentanyl", "oxycodone", "hydromorphone", "aminoclonazepam7", "eddp", "thc_cooh", "etg"];
  const clinicalQuestionShortcuts = [
    {
      label: "Negative opiate screen with fentanyl",
      focusId: "fentanyl",
      method: "immunoassay",
      hint: "Check why a generic opiate screen can miss fentanyl.",
    },
    {
      label: "Oxycodone not on routine opiate screen",
      focusId: "oxycodone",
      method: "immunoassay",
      hint: "Review when oxycodone-specific testing is needed.",
    },
    {
      label: "Hydromorphone from hydrocodone?",
      focusId: "hydromorphone",
      method: "definitive",
      hint: "Separate source ambiguity from expected metabolism.",
    },
    {
      label: "Clonazepam with negative benzo screen",
      focusId: "aminoclonazepam7",
      method: "immunoassay",
      hint: "Review 7-aminoclonazepam and assay limitations.",
    },
    {
      label: "THC timing or impairment question",
      focusId: "thc_cooh",
      method: "definitive",
      hint: "Clarify what urine THC-COOH can and cannot answer.",
    },
    {
      label: "EtG incidental exposure question",
      focusId: "etg",
      method: "definitive",
      hint: "Review cutoff, timing, and context limits.",
    },
  ];
  const panels = [
    {
      id: "unknown_panel",
      name: "Unknown / report not reviewed",
      method: "any",
      description: "Use when the exact ordered panel, reportable analytes, and cutoffs are not known.",
      analytes: [],
    },
    {
      id: "generic_opiate_immunoassay",
      name: "Generic opiate immunoassay",
      method: "immunoassay",
      description: "Class screen behavior varies by manufacturer and lab; many synthetic and semisynthetic opioids need targeted testing.",
      analytes: [
        panelAnalyte("morphine", "class_screen_only", "opiate class screen"),
        panelAnalyte("codeine", "class_screen_only", "opiate class screen"),
        panelAnalyte("hydrocodone", "unknown", "assay-dependent cross-reactivity"),
        panelAnalyte("hydromorphone", "unknown", "assay-dependent cross-reactivity"),
        panelAnalyte("oxycodone", "unknown", "often needs oxycodone-specific assay"),
        panelAnalyte("oxymorphone", "unknown", "often needs oxycodone-specific assay"),
        panelAnalyte("fentanyl", "not_included", "requires fentanyl-specific or definitive testing"),
        panelAnalyte("norfentanyl", "not_included", "requires fentanyl-specific or definitive testing"),
        panelAnalyte("methadone", "not_included", "requires methadone-specific or definitive testing"),
        panelAnalyte("eddp", "not_included", "requires methadone-specific or definitive testing"),
        panelAnalyte("buprenorphine", "not_included", "requires buprenorphine-specific or definitive testing"),
        panelAnalyte("norbuprenorphine", "not_included", "requires buprenorphine-specific or definitive testing"),
        panelAnalyte("tramadol", "not_included", "requires targeted or definitive testing"),
        panelAnalyte("tapentadol", "not_included", "requires targeted or definitive testing"),
      ],
    },
    {
      id: "benzodiazepine_immunoassay_panel",
      name: "Benzodiazepine immunoassay screen",
      method: "immunoassay",
      description: "Class screen sensitivity depends on assay target; clonazepam, lorazepam, and glucuronides are commonly under-detected.",
      analytes: [
        panelAnalyte("diazepam", "class_screen_only", "benzodiazepine class screen"),
        panelAnalyte("nordiazepam", "class_screen_only", "benzodiazepine class screen"),
        panelAnalyte("oxazepam", "class_screen_only", "benzodiazepine class screen"),
        panelAnalyte("temazepam", "class_screen_only", "benzodiazepine class screen"),
        panelAnalyte("clonazepam", "unknown", "may be under-detected by some screens"),
        panelAnalyte("aminoclonazepam7", "unknown", "often needs definitive testing"),
        panelAnalyte("lorazepam", "unknown", "glucuronide sensitivity is assay-dependent"),
        panelAnalyte("lorazepam_glucuronide", "unknown", "often needs definitive testing"),
        panelAnalyte("alprazolam", "unknown", "assay-dependent"),
        panelAnalyte("alpha_hydroxyalprazolam", "unknown", "assay-dependent"),
      ],
    },
    {
      id: "targeted_definitive_panel",
      name: "Targeted definitive LC/GC-MS panel",
      method: "definitive",
      description: "Definitive testing is targeted; absent findings still require confirmation that the analyte was included and reportable.",
      analytes: [],
    },
  ];
  const patternScenarios = [
    {
      id: "oxycodone_oxymorphone",
      label: "Oxycodone -> oxymorphone",
      category: "Expected metabolism",
      description: "Oxycodone with supportive metabolite pattern.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["oxycodone"],
      detected: ["oxymorphone", "noroxycodone"],
      absent: [],
    },
    {
      id: "hydrocodone_hydromorphone",
      label: "Hydrocodone -> hydromorphone",
      category: "Shared byproduct ambiguity",
      description: "Hydromorphone can fit hydrocodone but is not source-specific.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["hydrocodone"],
      detected: ["hydromorphone", "norhydrocodone"],
      absent: [],
    },
    {
      id: "clonazepam_negative",
      label: "Clonazepam, 7-amino absent",
      category: "Unexpected negative",
      description: "Benzodiazepine screen limitations and panel coverage.",
      method: "immunoassay",
      panelId: "benzodiazepine_immunoassay_panel",
      expected: ["clonazepam"],
      detected: [],
      absent: ["aminoclonazepam7"],
    },
    {
      id: "fentanyl_negative",
      label: "Fentanyl, norfentanyl absent",
      category: "Unexpected negative",
      description: "Generic opiate screen does not answer fentanyl exposure.",
      method: "immunoassay",
      panelId: "generic_opiate_immunoassay",
      expected: ["fentanyl"],
      detected: [],
      absent: ["norfentanyl"],
    },
    {
      id: "codeine_morphine",
      label: "Codeine with morphine",
      category: "Shared byproduct ambiguity",
      description: "Morphine may fit codeine but is not source-specific alone.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["codeine"],
      detected: ["morphine"],
      absent: [],
    },
    {
      id: "buprenorphine_metabolite",
      label: "Buprenorphine + norbuprenorphine",
      category: "Adherence support",
      description: "Metabolite supports exposure/metabolism when included.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["buprenorphine"],
      detected: ["norbuprenorphine"],
      absent: [],
    },
    {
      id: "methadone_eddp",
      label: "Methadone + EDDP",
      category: "Adherence support",
      description: "EDDP helps support ingestion/metabolism.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["methadone"],
      detected: ["eddp"],
      absent: [],
    },
    {
      id: "heroin_6mam",
      label: "Heroin marker 6-MAM",
      category: "Specific marker",
      description: "6-MAM is a specific recent heroin marker when detected.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: [],
      detected: ["6mam", "morphine"],
      absent: [],
    },
    {
      id: "alprazolam_metabolite",
      label: "Alprazolam + alpha-hydroxy",
      category: "Adherence support",
      description: "Specific metabolite supports alprazolam exposure.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: ["alprazolam"],
      detected: ["alpha_hydroxyalprazolam"],
      absent: [],
    },
    {
      id: "lorazepam_negative",
      label: "Lorazepam, screen negative",
      category: "Unexpected negative",
      description: "Some assays under-detect glucuronidated benzodiazepines.",
      method: "immunoassay",
      panelId: "benzodiazepine_immunoassay_panel",
      expected: ["lorazepam"],
      detected: [],
      absent: ["lorazepam_glucuronide"],
    },
    {
      id: "amphetamine_phentermine_context",
      label: "Amphetamine + phentermine context",
      category: "Unexpected positive",
      description: "Medication context can matter for stimulant screens.",
      method: "immunoassay",
      panelId: "unknown_panel",
      expected: ["phentermine"],
      detected: ["amphetamine"],
      absent: [],
    },
    {
      id: "thc_timing",
      label: "THC-COOH timing question",
      category: "Timing / impairment limits",
      description: "Urine THC metabolite does not establish impairment or exact timing.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: [],
      detected: ["thc_cooh"],
      absent: [],
    },
    {
      id: "etg_context",
      label: "EtG / EtS context",
      category: "Timing / impairment limits",
      description: "Alcohol markers require cutoff, timing, and exposure context.",
      method: "definitive",
      panelId: "targeted_definitive_panel",
      expected: [],
      detected: ["etg", "ets"],
      absent: [],
    },
  ];
  const intentAliases = [
    { terms: ["negative", "opiate", "fentanyl"], focusId: "fentanyl", method: "immunoassay" },
    { terms: ["negative", "opiate", "oxycodone"], focusId: "oxycodone", method: "immunoassay" },
    { terms: ["negative", "benzo", "clonazepam"], focusId: "aminoclonazepam7", method: "immunoassay" },
    { terms: ["benzo", "screen", "negative", "clonazepam"], focusId: "aminoclonazepam7", method: "immunoassay" },
    { terms: ["benzo", "screen", "negative", "lorazepam"], focusId: "lorazepam", method: "immunoassay" },
    { terms: ["methadone metabolite"], focusId: "eddp" },
    { terms: ["cocaine metabolite"], focusId: "benzoylecgonine" },
    { terms: ["hydromorphone", "hydrocodone"], focusId: "hydromorphone", method: "definitive" },
    { terms: ["thc", "timing"], focusId: "thc_cooh" },
    { terms: ["thc", "impairment"], focusId: "thc_cooh" },
    { terms: ["etg", "incidental"], focusId: "etg" },
    { terms: ["etg", "cutoff"], focusId: "etg" },
  ];
  const likelyExplanationIds = new Set([
    "morphine",
    "hydromorphone",
    "oxymorphone",
    "oxazepam",
    "temazepam",
    "nordiazepam",
    "amphetamine",
    "methamphetamine",
    "thc_cooh",
    "etg",
    "ets",
    "aminoclonazepam7",
    "nortriptyline",
    "desipramine",
    "meprobamate",
    "pcp",
    "benzodiazepine_immunoassay",
    "opiate_immunoassay",
    "amphetamine_immunoassay",
  ]);
  const allowedClinicalTags = new Set([
    "Expected metabolite",
    "Supportive metabolite",
    "Specific marker",
    "Possible minor metabolite",
    "Possible parent drug",
    "Shared metabolite",
    "Not source-specific",
    "Assay limitation",
    "Exposure marker",
    "Requires quantitative context",
    "Requires timing context",
    "Requires panel context",
  ]);
  const curatedAnswers = {
    morphine: answer("Morphine in urine may reflect morphine use, codeine metabolism, or heroin exposure when paired with 6-MAM.", "Interpret morphine with codeine, 6-MAM, hydromorphone, timing, and the medication list.", "Morphine alone is not specific for heroin exposure.", "Compare the full opiate pattern and use definitive testing when source matters.", "Do not conclude exact source, dose, timing, impairment, or adherence from morphine alone."),
    codeine: answer("Codeine exposure may produce codeine, morphine, and sometimes small hydrocodone depending on timing and metabolism.", "Codeine with morphine can be compatible with codeine use; codeine-specific metabolites add support when included.", "Morphine can appear after codeine and should not automatically be treated as separate morphine exposure.", "Interpret relative concentrations, timing, medication list, and definitive analytes if source matters.", "Do not conclude non-prescribed morphine solely from morphine in a codeine-compatible pattern."),
    norcodeine: answer("Norcodeine supports codeine exposure when it is included in the ordered panel.", "Norcodeine is most useful as a supportive codeine-pathway finding alongside codeine and morphine.", "Absence of norcodeine is not meaningful unless it was included and reported by the panel.", "Interpret with codeine, morphine, timing, cutoff, and medication history.", "Do not use norcodeine alone to determine dose, timing, or adherence certainty."),
    heroin: answer("Heroin exposure is best supported by 6-MAM when detected; morphine alone is not heroin-specific.", "Heroin rapidly converts through 6-MAM to morphine, so timing strongly affects which analytes are present.", "A negative 6-MAM does not exclude heroin exposure outside its short detection window.", "Interpret with 6-MAM, morphine/codeine pattern, timing, and definitive testing.", "Do not label morphine alone as heroin exposure without 6-MAM or other supporting context."),
    hydrocodone: answer("Hydrocodone exposure is commonly supported by norhydrocodone and may also produce hydromorphone.", "Hydrocodone, norhydrocodone, hydromorphone, and dihydrocodeine can form a compatible hydrocodone pattern.", "Hydromorphone may be a metabolite rather than a separate hydromorphone exposure.", "Review the full parent/metabolite pattern and quantitative context when available.", "Do not conclude hydromorphone misuse from hydromorphone alone."),
    norhydrocodone: answer("Norhydrocodone supports hydrocodone exposure when included in the ordered panel.", "Norhydrocodone is a supportive hydrocodone metabolite and is useful with parent hydrocodone and hydromorphone.", "Absence may reflect panel design, timing, cutoff, or urine dilution.", "Compare with hydrocodone, hydromorphone, dihydrocodeine, timing, and panel contents.", "Do not use norhydrocodone alone to infer dose or exact timing."),
    hydromorphone: answer("Hydromorphone can reflect prescribed hydromorphone, hydrocodone metabolism, or minor morphine metabolism.", "Hydromorphone is not source-specific without the rest of the opiate pattern.", "Hydromorphone alone cannot identify the parent opioid.", "Compare hydrocodone, norhydrocodone, morphine, timing, and quantitative context.", "Do not conclude source from hydromorphone alone; it may reflect hydromorphone use, hydrocodone metabolism, or minor morphine metabolism."),
    dihydrocodeine: answer("Dihydrocodeine can be a supportive hydrocodone-pathway finding when included.", "It is most useful when interpreted with hydrocodone, norhydrocodone, and hydromorphone.", "Dihydrocodeine is not usually a standalone source determination.", "Review the full opioid pattern and medication history.", "Do not infer separate dihydrocodeine exposure from a minor supportive finding without context."),
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
    odesmethyltramadol: answer("O-desmethyltramadol supports tramadol exposure when included in the ordered panel.", "This metabolite is useful with parent tramadol when assessing exposure or adherence.", "Panel design and CYP2D6 variability can affect tramadol metabolite patterns.", "Interpret with parent tramadol, timing, assay method, and medication history.", "Do not infer dose or adherence certainty from O-desmethyltramadol alone."),
    tapentadol: answer("Tapentadol is not a routine opiate screen finding and usually requires specific or definitive testing.", "Tapentadol and/or N-desmethyltapentadol may support exposure depending on panel design.", "A negative generic opiate screen does not exclude tapentadol exposure.", "Confirm that tapentadol was included in the ordered panel.", "Do not infer absence, timing, or dose from a generic opiate screen.", { immunoassay: { bottomLine: "A generic opiate immunoassay does not reliably detect tapentadol.", commonPitfall: "Do not interpret a negative generic opiate screen as excluding tapentadol exposure.", nextStep: "Confirm that tapentadol-specific or definitive testing was ordered." } }),
    ndesmethyltapentadol: answer("N-desmethyltapentadol supports tapentadol exposure when included in the ordered panel.", "It is most useful with parent tapentadol and a panel designed to include tapentadol analytes.", "A routine opiate screen does not reliably answer tapentadol questions.", "Confirm tapentadol-specific or definitive testing was ordered.", "Do not infer absence or dose from a generic opiate screen."),
    naloxone: answer("Naloxone may reflect naloxone exposure or buprenorphine/naloxone combination product use when included.", "Naloxone is best interpreted with buprenorphine, norbuprenorphine, formulation history, timing, and route context.", "Naloxone presence alone does not prove misuse or route manipulation.", "Review prescribed product, timing, buprenorphine metabolites, and quantitative pattern if available.", "Do not conclude diversion or nonadherence from naloxone alone."),
    naltrexone: answer("Naltrexone exposure is supported by naltrexone and/or 6-beta-naltrexol when included.", "6-beta-naltrexol is a supportive naltrexone metabolite.", "Routine opioid screens may not answer naltrexone adherence questions unless the panel includes it.", "Confirm that naltrexone and metabolite testing were included when adherence matters.", "Do not infer adherence certainty from a nonspecific opioid screen."),
    "6beta_naltrexol": answer("6-beta-naltrexol supports naltrexone exposure when included in the ordered panel.", "It is most useful with parent naltrexone and medication history.", "Absence is only meaningful if the analyte was tested and reported absent.", "Interpret with naltrexone, timing, cutoff, and panel contents.", "Do not infer dose or adherence certainty from 6-beta-naltrexol alone."),
    meperidine: answer("Meperidine exposure usually requires specific or definitive testing and is not reliably answered by a generic opiate screen.", "Normeperidine supports meperidine exposure when included.", "Routine opiate immunoassays may miss meperidine depending on assay design.", "Confirm that meperidine/normeperidine were included when exposure or adherence matters.", "Do not conclude absence of meperidine from a negative generic opiate screen.", { immunoassay: { bottomLine: "A generic opiate immunoassay may be negative despite meperidine exposure.", commonPitfall: "Do not use a negative generic opiate screen to exclude meperidine.", nextStep: "Use meperidine-specific or definitive testing when clinically needed." } }),
    normeperidine: answer("Normeperidine supports meperidine exposure when included in the ordered panel.", "It is a useful supportive metabolite with parent meperidine.", "Absence may reflect panel design, timing, cutoff, or renal/metabolic factors.", "Interpret with meperidine, timing, and the ordered panel.", "Do not use normeperidine alone to infer dose or timing."),
    "6mam": answer("6-MAM is a specific marker of recent heroin exposure when detected.", "6-MAM has a short detection window; morphine may persist longer after heroin exposure.", "Absence of 6-MAM does not exclude prior heroin exposure if timing is delayed.", "Interpret with timing, morphine/codeine pattern, and definitive testing.", "Do not use absence of 6-MAM alone to exclude heroin exposure outside the short detection window.", {}, ["6 acetylmorphine", "heroin metabolite", "6 monoacetylmorphine"]),
    benzoylecgonine: answer("Benzoylecgonine is the primary urine metabolite supporting cocaine exposure.", "Cocaine parent may be short-lived; benzoylecgonine is the common urine target.", "A positive result does not establish impairment, exact timing, or route.", "Interpret with cutoff, confirmation status, timing, and clinical context.", "Do not use benzoylecgonine alone to determine impairment or exact timing.", {}, ["cocaine metabolite", "coke metabolite", "BE", "benzoyl ecgonine"]),
    amphetamine: answer("Amphetamine may be a prescribed drug, metabolite, or immunoassay finding requiring context.", "It can reflect amphetamine salts, lisdexamfetamine, methamphetamine metabolism, or other pathways.", "Amphetamine immunoassays can have false positives and source ambiguity.", "Confirm unexpected results with definitive testing and review medication/source context.", "Do not conclude illicit stimulant use from an amphetamine screen alone.", { immunoassay: { bottomLine: "Amphetamine immunoassay positives are not source-specific and can have false positives.", commonPitfall: "Do not conclude illicit stimulant use from an amphetamine screen alone.", nextStep: "Confirm unexpected positives with definitive testing and review prescribed/OTC medication context." } }),
    methamphetamine: answer("Methamphetamine may produce amphetamine and may require isomer testing to clarify source.", "d/l isomer testing can help distinguish some prescription, OTC, and illicit sources.", "Methamphetamine/amphetamine patterns are source-dependent and can be overinterpreted.", "Use definitive testing and isomer information when source matters.", "Do not conclude source or route from methamphetamine alone."),
    d_methamphetamine: answer("d-methamphetamine supports a dextromethamphetamine source when isomer testing is performed.", "Isomer results can help distinguish some prescription, illicit, and OTC-related explanations.", "Isomer interpretation still requires medication and exposure history.", "Interpret with l-methamphetamine, amphetamine, prescribed medications, and lab method.", "Do not conclude route, intent, or exact source from d-methamphetamine alone."),
    l_methamphetamine: answer("l-methamphetamine can support levomethamphetamine exposure or specific medication/OTC source context.", "It may be relevant with selegiline or some nonprescription exposure histories depending on the assay and pattern.", "Methamphetamine without isomer context can be overinterpreted.", "Review d/l isomer results, amphetamine, medication list, and exposure history.", "Do not conclude illicit methamphetamine use from l-methamphetamine context alone."),
    mdma: answer("MDMA exposure may be supported by MDMA and/or MDA when included.", "MDA can be a metabolite of MDMA or a separate exposure depending on the panel and pattern.", "A stimulant immunoassay screen is not source-specific.", "Use definitive testing when MDMA/MDA source matters.", "Do not infer exact timing, dose, or source from a class-level stimulant screen."),
    mda: answer("MDA may reflect MDA exposure or metabolism from MDMA/MDEA depending on the pattern.", "It is not source-specific without parent drugs and clinical context.", "MDA alone should not be assumed to identify a single parent compound.", "Compare MDMA, MDEA, timing, panel contents, and medication/exposure history.", "Do not infer source, dose, or timing from MDA alone."),
    mdea: answer("MDEA exposure may produce MDA when included in the panel.", "MDEA with MDA can support an MDEA/MDMA-type pattern depending on the ordered analytes.", "A class-level stimulant screen cannot identify MDEA specifically.", "Use definitive testing when MDEA source matters.", "Do not infer MDEA absence or source from a generic stimulant screen."),
    lisdexamfetamine: answer("Lisdexamfetamine explains amphetamine findings when medication history supports prescribed use.", "Amphetamine is expected after lisdexamfetamine exposure.", "Amphetamine findings are not source-specific without the medication list and assay context.", "Document compatibility when lisdexamfetamine is prescribed and the pattern fits.", "Do not conclude nonprescribed stimulant use from amphetamine alone when lisdexamfetamine is expected."),
    selegiline: answer("Selegiline can explain l-methamphetamine and related amphetamine-pattern questions when isomer testing supports it.", "l-methamphetamine/l-amphetamine context can help distinguish selegiline-associated findings.", "Without isomer testing, methamphetamine/amphetamine source remains ambiguous.", "Review isomer testing, medication history, and definitive results.", "Do not conclude illicit methamphetamine exposure without source-context review."),
    phentermine: answer("Phentermine is important context for unexpected amphetamine-class immunoassay results.", "It may contribute to assay/source-ambiguity questions and should be reviewed in the medication list.", "A positive amphetamine screen is not source-specific and may need confirmation.", "Confirm unexpected stimulant screens with definitive testing and review phentermine exposure.", "Do not conclude amphetamine misuse from an immunoassay result without confirmation.", { immunoassay: { bottomLine: "Phentermine can be relevant to unexpected amphetamine-class immunoassay positives.", commonPitfall: "A positive amphetamine immunoassay is not source-specific.", nextStep: "Use definitive testing before acting on an unexpected stimulant screen." } }),
    benzphetamine: answer("Benzphetamine can metabolize to methamphetamine and amphetamine.", "It can explain methamphetamine/amphetamine findings when medication history supports exposure.", "Source interpretation may require definitive testing and sometimes isomer context.", "Review benzphetamine use, methamphetamine, amphetamine, and isomer data if available.", "Do not infer illicit stimulant use from methamphetamine/amphetamine findings without medication review."),
    methylphenidate: answer("Methylphenidate exposure is supported by ritalinic acid when included in the ordered panel.", "Routine amphetamine screens do not reliably answer methylphenidate adherence questions.", "Absence on a generic stimulant screen may simply mean methylphenidate was not tested.", "Confirm that methylphenidate/ritalinic acid were included when adherence matters.", "Do not infer methylphenidate absence from a generic amphetamine screen."),
    ritalinic_acid: answer("Ritalinic acid supports methylphenidate exposure when included.", "It is the key supportive methylphenidate metabolite in many definitive panels.", "Absence is only meaningful if it was included and reported absent.", "Interpret with methylphenidate, timing, cutoff, and ordered panel contents.", "Do not infer dose or adherence certainty from ritalinic acid alone."),
    pseudoephedrine: answer("Pseudoephedrine is medication/exposure context for unexpected amphetamine-class immunoassay results.", "It is more relevant to screening interference/source context than definitive amphetamine confirmation.", "A positive amphetamine immunoassay should not be treated as source-specific.", "Confirm unexpected results with definitive testing and review OTC exposure history.", "Do not conclude illicit stimulant use from immunoassay screening alone."),
    ephedrine: answer("Ephedrine is medication/exposure context for unexpected amphetamine-class immunoassay results.", "It should be reviewed when stimulant screen results conflict with expectations.", "A class-level amphetamine screen cannot identify source by itself.", "Use definitive testing and medication/exposure review for unexpected positives.", "Do not conclude stimulant misuse from an immunoassay result alone."),
    cocaine: answer("Cocaine exposure is most commonly supported by benzoylecgonine and related cocaine metabolites when included.", "Parent cocaine may have a shorter window than benzoylecgonine.", "A cocaine-class result does not establish route, exact timing, or impairment.", "Interpret with benzoylecgonine, cutoff, confirmation status, and clinical context.", "Do not infer impairment or exact timing from a urine cocaine metabolite result alone."),
    ecgonine_methyl_ester: answer("Ecgonine methyl ester supports cocaine exposure when included in the ordered panel.", "It is a cocaine metabolite that is most useful alongside benzoylecgonine and other cocaine analytes.", "It does not define route, dose, or impairment by itself.", "Interpret with benzoylecgonine, cocaine, cutoff, timing, and clinical context.", "Do not use ecgonine methyl ester alone to determine exact timing or impairment."),
    cocaethylene: answer("Cocaethylene suggests cocaine plus ethanol co-exposure when included.", "It forms in the setting of cocaine and alcohol exposure and should be interpreted with ethanol markers and cocaine metabolites.", "Presence does not establish exact timing, amount, or impairment.", "Review benzoylecgonine, EtG/EtS/PEth if ordered, timing, and clinical context.", "Do not infer impairment or exact timing from cocaethylene alone."),
    norcocaine: answer("Norcocaine is a minor cocaine metabolite when included in the ordered panel.", "It can support cocaine exposure but is usually interpreted with benzoylecgonine and other cocaine analytes.", "Norcocaine alone is not usually the primary cocaine exposure marker.", "Interpret with benzoylecgonine, parent cocaine, cutoff, and timing.", "Do not use norcocaine alone to determine route, dose, or impairment."),
    delta9_thc: answer("Delta-9-THC exposure is usually interpreted in urine through THC metabolites rather than parent THC alone.", "THC-COOH is the common urine marker supporting cannabinoid exposure.", "Urine cannabinoid testing does not establish current impairment or exact timing.", "Interpret with THC-COOH, assay specificity, cutoff, and clinical context.", "Do not use urine delta-9-THC context alone to determine impairment."),
    hydroxy11_thc: answer("11-hydroxy-THC is an intermediate THC metabolite when included in the ordered panel.", "It is most useful as part of a cannabinoid metabolite pattern with THC-COOH.", "Cannabinoid metabolite presence does not determine impairment or exact timing.", "Interpret with THC-COOH, assay method, cutoff, and use history.", "Do not infer current impairment from 11-hydroxy-THC alone."),
    thc_cooh: answer("THC-COOH supports cannabinoid exposure but does not establish impairment, exact timing, or new use.", "Detection can persist for days to much longer depending on frequency of use and patient factors.", "Single urine THC metabolite results are poor tools for impairment or exact timing.", "Use clinical context and serial creatinine-normalized values only when reuse versus residual excretion is the question.", "Do not use a single urine THC metabolite result to determine impairment, exact timing, or new use versus residual excretion.", { immunoassay: { bottomLine: "A cannabinoid screen can support cannabinoid exposure but cannot determine impairment, exact timing, dose, or delta-8 versus delta-9 specificity.", commonPitfall: "Do not use a urine cannabinoid screen to determine current impairment.", nextStep: "Use clinical context, cutoff, confirmation, and serial normalized results only when clinically appropriate." }, definitive: { bottomLine: "Definitive THC-COOH testing supports cannabinoid exposure but still does not establish impairment, exact timing, or new use by itself.", commonPitfall: "Definitive identification improves specificity but does not solve timing or impairment questions.", nextStep: "Interpret with timing, cutoff, frequency of use, and serial creatinine-normalized values if reuse versus residual excretion is the question." } }, ["carboxy THC", "THC metabolite", "cannabis metabolite", "THC timing", "THC impairment"]),
    thc_cooh_glucuronide: answer("THC-COOH-glucuronide supports cannabinoid exposure when included.", "It is a conjugated THC metabolite and should be interpreted with THC-COOH and assay design.", "It does not determine impairment, dose, or exact timing.", "Interpret with THC-COOH, cutoff, timing, and clinical context.", "Do not infer new use or impairment from THC-COOH-glucuronide alone."),
    delta8_thc: answer("Delta-8-THC interpretation depends on whether the assay can distinguish delta-8 from delta-9 cannabinoids.", "Specific definitive testing may identify delta-8-related analytes when included.", "Many cannabinoid screens do not reliably distinguish cannabinoid isomers.", "Confirm assay specificity when delta-8 versus delta-9 distinction matters.", "Do not infer cannabinoid isomer source from a nonspecific cannabinoid screen."),
    delta8_thc_cooh: answer("Delta-8-THC-COOH supports delta-8 cannabinoid exposure when the assay is specific.", "It is useful only if the ordered definitive method distinguishes delta-8 from delta-9 metabolites.", "Generic cannabinoid screens may not provide this distinction.", "Review assay specificity, cutoff, timing, and product history.", "Do not infer delta-8 source from a nonspecific cannabinoid screen."),
    cbd: answer("CBD product use can complicate THC interpretation if the product contains THC or causes assay interference.", "Unregulated CBD products may contain more THC than expected and can create unexpected cannabinoid findings.", "CBD use alone does not reliably explain every THC-positive result without product and assay context.", "Review product history, assay specificity, cutoff, and THC metabolite confirmation.", "Do not conclude cannabis misuse or CBD-only exposure without confirmation and context."),
    creatinine_normalized_thc_cooh: answer("Creatinine-normalized THC-COOH is useful for serial interpretation of residual excretion versus possible new cannabinoid use.", "Serial normalized values are more informative than a single raw THC-COOH value.", "A single normalized value still cannot determine impairment or exact timing.", "Use consistent methods and appropriate collection intervals when trending values.", "Do not infer impairment or exact timing from a single normalized THC-COOH result."),
    ethanol: answer("Urine ethanol itself has a short detection window; EtG, EtS, and PEth are often used for longer-window alcohol questions.", "EtG/EtS support recent ethanol exposure and PEth supports longer-window exposure depending on matrix and panel.", "Alcohol markers require cutoff, timing, incidental exposure, and clinical context.", "Interpret with the ordered analytes, cutoff, collection timing, and exposure history.", "Do not infer impairment, exact timing, or amount from alcohol markers alone."),
    etg: answer("EtG supports recent ethanol exposure but must be interpreted with cutoff, timing, and incidental exposure context.", "EtG is a sensitive alcohol metabolite and is often paired with EtS.", "Low-level positives can be context-dependent and should not be overinterpreted.", "Review cutoff, collection timing, EtS, exposure history, and lab guidance.", "Do not interpret EtG without cutoff, timing, and incidental exposure context."),
    ets: answer("EtS supports recent ethanol exposure and is commonly interpreted alongside EtG.", "EtS can support ethanol exposure and may help contextualize EtG results.", "Cutoff and incidental exposure context are essential.", "Review EtG/EtS together with cutoff, timing, and exposure history.", "Do not interpret EtS without cutoff, timing, and incidental exposure context."),
    peth: answer("PEth supports longer-window alcohol exposure compared with urine EtG/EtS.", "PEth reflects phosphatidylethanol formation in blood and is not a same-window urine alcohol marker.", "PEth does not define exact timing of last drink.", "Interpret with the testing matrix, cutoff, and clinical context.", "Do not use PEth alone to determine exact timing, impairment, or a precise drinking amount."),
    diazepam: answer("Diazepam exposure may produce nordiazepam, temazepam, and oxazepam depending on timing.", "A diazepam-type pattern is best interpreted from parent diazepam plus shared downstream metabolites.", "Nordiazepam, temazepam, or oxazepam are not source-specific by themselves.", "Compare the full benzodiazepine metabolite pattern and medication list.", "Do not identify a single parent benzodiazepine from a shared metabolite alone."),
    chlordiazepoxide: answer("Chlordiazepoxide can produce nordiazepam and oxazepam in diazepam-type benzodiazepine pathways.", "It may explain shared benzodiazepine metabolites when medication history supports exposure.", "Oxazepam or nordiazepam alone is not source-specific.", "Interpret with medication list, parent drug if included, and the full benzodiazepine pathway.", "Do not conclude separate diazepam or oxazepam use from shared metabolites alone."),
    clorazepate: answer("Clorazepate rapidly enters the nordiazepam pathway and can produce diazepam-type metabolite patterns.", "Nordiazepam with downstream oxazepam can be compatible with clorazepate exposure.", "Shared benzodiazepine metabolites cannot identify clorazepate by themselves.", "Review medication list and definitive benzodiazepine analytes.", "Do not infer a single benzodiazepine source from nordiazepam or oxazepam alone."),
    clonazepam: answer("Clonazepam exposure is often best supported by 7-aminoclonazepam, and some benzodiazepine screens may miss it.", "7-aminoclonazepam is the key metabolite when included.", "A negative benzodiazepine immunoassay does not exclude clonazepam exposure.", "Use definitive testing when clonazepam exposure or adherence matters.", "Do not conclude absence of clonazepam from a negative benzodiazepine screen alone.", { immunoassay: { bottomLine: "Many benzodiazepine screens may miss clonazepam or 7-aminoclonazepam.", commonPitfall: "A negative benzodiazepine screen does not exclude clonazepam exposure.", nextStep: "Order definitive testing that includes 7-aminoclonazepam when clonazepam matters." } }, ["negative benzo screen clonazepam", "benzo screen negative clonazepam"]),
    aminoclonazepam7: answer("7-aminoclonazepam supports clonazepam exposure when included in the ordered panel.", "This metabolite is usually more useful than parent clonazepam in urine.", "It may be missed by some immunoassay screens.", "Use definitive benzodiazepine testing when clonazepam exposure or adherence matters.", "Do not infer dose, timing, or adherence certainty from 7-aminoclonazepam alone.", { immunoassay: { bottomLine: "A benzodiazepine immunoassay may be negative despite clonazepam exposure.", commonPitfall: "Do not treat a negative screen as excluding clonazepam.", nextStep: "Use definitive testing that includes 7-aminoclonazepam." } }, ["clonazepam metabolite", "klonopin metabolite", "7 amino clonazepam", "7-amino"]),
    lorazepam: answer("Lorazepam may be under-detected by some benzodiazepine immunoassays, especially when glucuronidated metabolites are not well detected.", "Lorazepam and lorazepam-glucuronide support exposure when included.", "A negative benzodiazepine screen does not always exclude lorazepam.", "Use definitive testing when lorazepam exposure or adherence matters.", "Do not conclude absence of lorazepam from a negative benzodiazepine screen alone."),
    lorazepam_glucuronide: answer("Lorazepam-glucuronide supports lorazepam exposure when included in definitive testing.", "It is important because some benzodiazepine immunoassays vary in sensitivity to glucuronidated metabolites.", "A negative benzodiazepine screen may miss lorazepam depending on assay design.", "Use definitive benzodiazepine testing when lorazepam exposure or adherence matters.", "Do not treat a negative generic benzodiazepine screen as excluding lorazepam exposure."),
    oxazepam: answer("Oxazepam may be prescribed directly or appear as a shared terminal metabolite of several benzodiazepines.", "Diazepam-type benzodiazepines can produce nordiazepam, temazepam, and oxazepam.", "Oxazepam is not source-specific.", "Interpret with nordiazepam, temazepam, diazepam-type medications, and medication history.", "Do not conclude a single parent benzodiazepine from oxazepam alone."),
    temazepam: answer("Temazepam may be prescribed directly or appear in diazepam-type metabolism.", "Temazepam with nordiazepam and/or oxazepam can fit a diazepam-type pathway.", "Temazepam is not always a separate exposure.", "Interpret with the full benzodiazepine metabolite pattern.", "Do not conclude separate temazepam use without medication history and pattern context."),
    nordiazepam: answer("Nordiazepam is a shared diazepam-type benzodiazepine metabolite.", "Diazepam, chlordiazepoxide, clorazepate, and related pathways may produce nordiazepam.", "Nordiazepam is not source-specific.", "Interpret with oxazepam, temazepam, medication list, and timing.", "Do not identify a single parent benzodiazepine from nordiazepam alone."),
    alprazolam: answer("Alprazolam exposure is supported by alpha-hydroxyalprazolam when included.", "Parent alprazolam and alpha-hydroxyalprazolam together support exposure.", "Some benzodiazepine screens vary in sensitivity by assay.", "Use definitive testing when alprazolam exposure or adherence matters.", "Do not infer exact dose or timing from alprazolam urine detection alone."),
    alpha_hydroxyalprazolam: answer("Alpha-hydroxyalprazolam supports alprazolam exposure.", "It is a key alprazolam metabolite when included in definitive benzodiazepine testing.", "Absence may reflect panel design, timing, or cutoff.", "Interpret with parent alprazolam, timing, and ordered panel contents.", "Do not use this metabolite alone to determine dose, timing, or impairment.", {}, ["alprazolam metabolite", "xanax metabolite", "alpha hydroxy alprazolam"]),
    midazolam: answer("Midazolam exposure is supported by midazolam and/or alpha-hydroxymidazolam when included.", "Alpha-hydroxymidazolam supports recent midazolam exposure and timing may be short.", "Routine benzodiazepine screens may vary in midazolam sensitivity and panel inclusion.", "Use definitive testing when ICU/procedural midazolam exposure matters.", "Do not infer dose or sedation level from urine midazolam findings alone."),
    alpha_hydroxymidazolam: answer("Alpha-hydroxymidazolam supports midazolam exposure when included.", "It is a useful supportive metabolite for recent midazolam exposure.", "Absence is only meaningful if the metabolite was tested and reported absent.", "Interpret with parent midazolam, timing, and panel contents.", "Do not infer dose or sedation level from alpha-hydroxymidazolam alone."),
    triazolam: answer("Triazolam exposure is supported by alpha-hydroxytriazolam when included.", "Parent triazolam and its metabolite may have short detection windows depending on timing and panel.", "A routine benzodiazepine screen may not reliably answer triazolam exposure questions.", "Use definitive benzodiazepine testing when triazolam exposure matters.", "Do not infer absence from a nonspecific benzodiazepine screen."),
    alpha_hydroxytriazolam: answer("Alpha-hydroxytriazolam supports triazolam exposure when included.", "It is the key supportive triazolam metabolite in definitive benzodiazepine testing.", "Absence may reflect timing, cutoff, or panel design.", "Interpret with parent triazolam, timing, and ordered panel contents.", "Do not infer dose or exact timing from alpha-hydroxytriazolam alone."),
    flurazepam: answer("Flurazepam exposure is supported by hydroxyethylflurazepam when included.", "The metabolite pattern can help distinguish flurazepam from other benzodiazepines.", "Routine benzodiazepine screens may not identify the specific benzodiazepine source.", "Use definitive testing when flurazepam source or adherence matters.", "Do not infer source from a class-level benzodiazepine screen alone."),
    hydroxyethylflurazepam: answer("Hydroxyethylflurazepam supports flurazepam exposure when included.", "It is most useful with parent flurazepam and medication history.", "Absence is only meaningful if the metabolite was included in the ordered panel.", "Interpret with timing, cutoff, and definitive benzodiazepine analytes.", "Do not infer dose or timing from hydroxyethylflurazepam alone."),
    estazolam: answer("Estazolam is usually interpreted as a specific parent analyte when included in a definitive panel.", "It does not share the common diazepam-to-oxazepam pathway in the same way as diazepam-type benzodiazepines.", "A class-level benzodiazepine screen cannot reliably identify estazolam specifically.", "Confirm whether estazolam was included in the ordered panel when exposure matters.", "Do not infer estazolam absence from a nonspecific benzodiazepine screen."),
    flunitrazepam: answer("Flunitrazepam exposure is supported by 7-aminoflunitrazepam when included.", "The metabolite is often more useful than parent flunitrazepam depending on timing.", "Panel inclusion is critical because many routine panels do not target it.", "Use definitive testing that includes flunitrazepam metabolites when exposure matters.", "Do not infer absence from a generic benzodiazepine screen."),
    aminoflunitrazepam7: answer("7-aminoflunitrazepam supports flunitrazepam exposure when included.", "It is a supportive metabolite and should be interpreted with timing and panel contents.", "Absence is only meaningful if the analyte was included and reported absent.", "Review the definitive benzodiazepine panel and clinical context.", "Do not infer dose, timing, or impairment from 7-aminoflunitrazepam alone."),
    zolpidem: answer("Zolpidem usually requires specific testing; routine drug screens may not include it.", "Parent zolpidem and/or zolpidem metabolite may support exposure depending on timing and panel.", "Absence from a routine screen may simply mean it was not tested.", "Confirm whether zolpidem or its metabolite was included in the ordered panel.", "Do not infer absence of zolpidem from a nonspecific drug screen."),
    zolpidem_carboxylic_acid: answer("Zolpidem phenyl-4-carboxylic acid supports zolpidem exposure when included.", "The metabolite may be more useful than parent zolpidem depending on timing and panel design.", "Routine drug screens may not include zolpidem or its metabolite.", "Confirm whether zolpidem-specific definitive testing was ordered when exposure matters.", "Do not infer zolpidem absence from a nonspecific drug screen."),
    carisoprodol: answer("Carisoprodol exposure may be supported by meprobamate, but meprobamate can also be direct exposure.", "Carisoprodol metabolizes to meprobamate.", "Meprobamate is not fully source-specific.", "Interpret carisoprodol and meprobamate together with medication history.", "Do not conclude carisoprodol use from meprobamate alone."),
    meprobamate: answer("Meprobamate may reflect meprobamate exposure or carisoprodol metabolism.", "Carisoprodol can metabolize to meprobamate, but direct meprobamate exposure is also possible.", "Meprobamate is not source-specific.", "Review medication history and whether carisoprodol was detected or included.", "Do not conclude carisoprodol exposure from meprobamate alone."),
    opiate_immunoassay: answer("An opiate immunoassay is a morphine-like screen, not a full opioid panel.", "A report may show a separate opiate row plus separate rows for oxycodone, methadone, fentanyl, and other opioids.", "Do not treat a positive or negative opiate screen as covering oxycodone, fentanyl, methadone, buprenorphine, tramadol, or tapentadol.", "Check the specific ordered panel rows and use targeted or definitive testing when the clinical question involves a semisynthetic or synthetic opioid.", "", {}, ["opiate positive", "opiate negative", "positive opiate screen", "negative opiate screen", "opiate row", "generic opiate row"]),
  };

  const interpretationFlags = {
    morphine: [{ label: "Not heroin-specific", tone: "ambiguity" }],
    hydromorphone: [{ label: "Not source-specific", tone: "ambiguity" }],
    oxymorphone: [{ label: "Not source-specific", tone: "ambiguity" }],
    "6mam": [{ label: "Specific heroin marker", tone: "specific" }],
    fentanyl: [{ label: "Not on routine opiate screen", tone: "assay" }],
    norfentanyl: [{ label: "Fentanyl-specific finding", tone: "specific" }],
    norhydrocodone: [{ label: "Supports hydrocodone", tone: "support" }],
    noroxycodone: [{ label: "Supports oxycodone", tone: "support" }],
    opiate_immunoassay: [{ label: "Screen category only", tone: "assay" }],
  };

  function labelForIdFromItems(id) {
    const found = items.find((candidate) => candidate.id === id);
    return found ? found.name : id;
  }

  function formatShortList(names) {
    const uniqueNames = [...new Set(names.filter(Boolean))].slice(0, 3);
    if (!uniqueNames.length) {
      return "";
    }
    if (uniqueNames.length === 1) {
      return uniqueNames[0];
    }
    if (uniqueNames.length === 2) {
      return `${uniqueNames[0]} and ${uniqueNames[1]}`;
    }
    return `${uniqueNames.slice(0, -1).join(", ")}, and ${uniqueNames[uniqueNames.length - 1]}`;
  }

  function buildAutoCuratedAnswer(entry) {
    const outgoing = relationships.filter((row) => row.from === entry.id);
    const incoming = relationships.filter((row) => row.to === entry.id);
    const expectedFindings = formatShortList(outgoing.map((row) => labelForIdFromItems(row.to)));
    const possibleSources = formatShortList(incoming.map((row) => labelForIdFromItems(row.from)));
    const type = entry.type || "";
    const isDrugLike = type.includes("drug");
    const isContext = type.includes("context") || entry.group === "Assay caveats";

    let bottomLine = entry.note || `${entry.name} interpretation depends on assay method, timing, panel contents, and medication history.`;
    let likelyExplanation = "";
    let commonPitfall = "Do not overinterpret a urine result without the ordered panel, cutoff, timing, assay method, and medication list.";
    let nextStep = "Interpret with medication history, timing, panel contents, and references; consult the lab for unexpected results.";

    if (isContext) {
      bottomLine = `${entry.name} is included as assay or exposure context rather than a standalone source determination.`;
      likelyExplanation = entry.note || "It helps explain possible screening limitations, false-positive patterns, or panel-coverage gaps.";
      commonPitfall = "Do not treat context items as proof of the source of a result without definitive testing and clinical review.";
      nextStep = "Review medication/exposure history and use definitive testing when a screening result conflicts with expectations.";
    } else if (isDrugLike && expectedFindings) {
      bottomLine = `${entry.name} exposure may be supported by ${expectedFindings} when included in the ordered panel.`;
      likelyExplanation = `${expectedFindings} should be interpreted with parent drug, timing, cutoff, and the medication list.`;
      commonPitfall = `Absence of ${expectedFindings} is only meaningful if the analyte was included and reported absent.`;
      nextStep = `Confirm whether ${entry.name} and related findings were included in the ordered panel when exposure or adherence matters.`;
    } else if (possibleSources) {
      bottomLine = `${entry.name} may be explained by ${possibleSources} depending on timing, panel design, and clinical context.`;
      likelyExplanation = `${entry.name} is most useful when interpreted with possible parent/source findings and medication history.`;
      commonPitfall = `${entry.name} may not be source-specific by itself.`;
      nextStep = `Compare ${entry.name} with ${possibleSources}, timing, cutoff, and the ordered panel.`;
    } else if (isDrugLike) {
      bottomLine = `${entry.name} is included for expanded-panel lookup and generally requires specific or definitive testing when clinically relevant.`;
      likelyExplanation = entry.note || "Routine screens may not include this substance unless it was specifically ordered.";
      commonPitfall = "A negative routine screen may simply mean this analyte was not included.";
      nextStep = `Confirm whether ${entry.name} was included in the ordered panel and use definitive testing for unexpected results.`;
    }

    return answer(bottomLine, likelyExplanation, commonPitfall, nextStep);
  }

  items.forEach((entry) => {
    const curated = curatedAnswers[entry.id] || buildAutoCuratedAnswer(entry);
    if (curated) {
      const extraAliases = curated.extraAliases || [];
      Object.assign(entry, curated);
      entry.aliases = [...new Set([...(entry.aliases || []), ...extraAliases])];
      delete entry.extraAliases;
    }
    entry.showLikelyExplanation = likelyExplanationIds.has(entry.id);
    entry.interpretationFlags = interpretationFlags[entry.id] || [];
  });

  const byId = new Map(items.map((entry) => [entry.id, entry]));
  const relationshipsByFrom = groupBy(relationships, "from");
  const relationshipsByTo = groupBy(relationships, "to");
  const state = {
    mode: "lookup",
    method: "any",
    panelId: "unknown_panel",
    focusId: null,
    relationFilter: "all",
    expected: [],
    detected: [],
    absent: [],
    absentMeta: {},
    absentStatus: "unknown",
    panelCoverageConfirmed: false,
    lookupBackStack: [],
    lastLookupSummary: "",
    lastPatternSummary: "",
  };

  const elements = {
    searchInput: root.querySelector("#udsSearchInput"),
    searchClear: root.querySelector("#udsSearchClear"),
    searchResults: root.querySelector("#udsSearchResults"),
    methodSelect: root.querySelector("#udsMethodSelect"),
    panelSelect: root.querySelector("#udsPanelSelect"),
    absentStatusSelect: root.querySelector("#udsAbsentStatus"),
    panelCoverageConfirmed: root.querySelector("#udsPanelCoverageConfirmed"),
    startButton: root.querySelector("#udsStartButton"),
    modeButtons: [...root.querySelectorAll("[data-uds-mode]")],
    lookupView: root.querySelector("#udsLookupView"),
    patternView: root.querySelector("#udsPatternView"),
    lookupTitle: root.querySelector("#udsLookupTitle"),
    lookupContent: root.querySelector("#udsLookupContent"),
    relationsContent: root.querySelector("#udsRelationsContent"),
    copyLookupButton: root.querySelector("#udsCopyLookupButton"),
    patternGuide: root.querySelector("#udsPatternGuide"),
    patternGuideButton: root.querySelector("#udsPatternGuideButton"),
    expectedInput: root.querySelector("#udsExpectedInput"),
    detectedInput: root.querySelector("#udsDetectedInput"),
    absentInput: root.querySelector("#udsAbsentInput"),
    expectedPicker: root.querySelector("#udsExpectedPicker"),
    detectedPicker: root.querySelector("#udsDetectedPicker"),
    absentPicker: root.querySelector("#udsAbsentPicker"),
    expectedSelected: root.querySelector("#udsExpectedSelected"),
    detectedSelected: root.querySelector("#udsDetectedSelected"),
    absentSelected: root.querySelector("#udsAbsentSelected"),
    expectedFeedback: root.querySelector("#udsExpectedFeedback"),
    detectedFeedback: root.querySelector("#udsDetectedFeedback"),
    absentFeedback: root.querySelector("#udsAbsentFeedback"),
    expectedChips: root.querySelector("#udsExpectedChips"),
    detectedChips: root.querySelector("#udsDetectedChips"),
    absentChips: root.querySelector("#udsAbsentChips"),
    addButtons: [...root.querySelectorAll("[data-uds-add]")],
    clearPatternButton: root.querySelector("#udsClearPatternButton"),
    copyPatternButton: root.querySelector("#udsCopyPatternButton"),
    patternScenarios: root.querySelector("#udsPatternScenarios"),
    patternOutput: root.querySelector("#udsPatternOutput"),
  };

  const patternInputKeys = ["expected", "detected", "absent"];
  const patternDraft = patternInputKeys.reduce((accumulator, key) => {
    accumulator[key] = "";
    return accumulator;
  }, {});
  const patternPickerDefaults = {
    expected: ["oxycodone", "hydrocodone", "fentanyl", "clonazepam", "methadone", "buprenorphine"],
    detected: ["oxymorphone", "hydromorphone", "norfentanyl", "aminoclonazepam7", "eddp", "thc_cooh"],
    absent: ["norfentanyl", "aminoclonazepam7", "oxycodone", "norbuprenorphine", "eddp", "lorazepam_glucuronide"],
  };

  function item(id, name, group, type, aliases, window, note, sourceIds) {
    return { id, name, group, type, aliases, displayAliases: aliases, window, note, sourceIds, curationStatus: "partial" };
  }

  function rel(from, to, label, strength, clue, sourceIds) {
    return { id: `rel:${from}:${to}:${normalize(label)}`, from, to, label, strength, clinicalTag: getDefaultClinicalTag(from, to, label, strength), clue, sourceIds };
  }

  function caveat(method, groups, title, text, sourceIds, itemIds = [], severity = "routine") {
    return { method, groups, title, text, sourceIds, itemIds, severity };
  }

  function panelAnalyte(itemId, status, reportableAs = "", cutoffNote = "") {
    return { itemId, status, reportableAs, cutoffNote };
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
      "codeine:morphine",
      "heroin:morphine",
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
    const specificMarkerPairs = new Set([
      "heroin:6mam",
    ]);

    if (specificMarkerPairs.has(`${from}:${to}`)) {
      return "Specific marker";
    }
    if (notSourceSpecificPairs.has(`${from}:${to}`)) {
      return "Not source-specific";
    }
    if (normalizedLabel.includes("immunoassay") || normalizedLabel.includes("assay")) {
      return "Assay limitation";
    }
    if (normalizedLabel.includes("isomer") || normalizedLabel.includes("ratio") || normalizedLabel.includes("serial")) {
      return "Requires quantitative context";
    }
    if (strength === "context" || normalizedLabel.includes("context") || normalizedLabel.includes("impurity")) {
      return "Requires panel context";
    }
    if (normalizedLabel.includes("minor")) {
      return "Possible minor metabolite";
    }
    if (normalizedLabel.includes("marker") || normalizedLabel.includes("exposure")) {
      return "Exposure marker";
    }
    if (normalizedLabel.includes("supportive") || normalizedLabel.includes("specific")) {
      return "Supportive metabolite";
    }
    if (normalizedLabel.includes("metabolite")) {
      return "Expected metabolite";
    }
    return "Requires panel context";
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

    const intentEntry = getItem(intentMatch.focusId);
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
    ) || null;
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
      const isActive = button.dataset.udsMode === state.mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    elements.lookupView.classList.toggle("is-hidden", state.mode !== "lookup");
    elements.patternView.classList.toggle("is-hidden", state.mode !== "pattern");

    if (state.mode === "lookup") {
      if (state.focusId) {
        renderLookupItem(state.focusId);
      } else {
        renderLookupStart();
      }
    } else {
      renderPatternPickers();
      renderPatternChips();
      renderPatternScenarios();
      renderPatternOutput();
    }
  }

  function renderPatternPickers() {
    patternInputKeys.forEach((key) => renderPatternPicker(key));
  }

  function renderPatternPicker(key) {
    const input = elements[`${key}Input`];
    const picker = elements[`${key}Picker`];
    const selected = elements[`${key}Selected`];
    if (!input || !picker || !selected) {
      return;
    }

    const results = getPatternPickerResults(key);
    picker.innerHTML = results.length
      ? results.map((entry) => renderPatternPickerOption(key, entry)).join("")
      : `<p class="uds-muted">No matches available.</p>`;

    const selectedEntry = patternDraft[key] ? getItem(patternDraft[key]) : null;
    selected.innerHTML = selectedEntry
      ? `
        <div class="uds-selected-preview">
          <span>Selected: <strong>${escapeHtml(selectedEntry.name)}</strong></span>
          <button class="ghost-button" data-uds-clear-draft="${escapeAttribute(key)}" type="button">Change</button>
        </div>
      `
      : `<span class="uds-muted">Choose a result below, then press Add.</span>`;
  }

  function getPatternPickerResults(key) {
    const input = elements[`${key}Input`];
    const query = input?.value.trim() || "";
    const candidates = query
      ? searchItems(query, 8)
      : (patternPickerDefaults[key] || []).map((id) => getItem(id)).filter(Boolean);

    return candidates.filter((entry) => !state[key].includes(entry.id));
  }

  function renderPatternPickerOption(key, entry) {
    const isSelected = patternDraft[key] === entry.id;
    const preview = entry.bottomLine || entry.commonPitfall || entry.note || "";

    return `
      <button class="uds-picker-option${isSelected ? " is-selected" : ""}" data-uds-pick="${escapeAttribute(key)}" data-uds-id="${escapeAttribute(entry.id)}" type="button" role="option" aria-selected="${isSelected ? "true" : "false"}">
        <span>
          <strong>${escapeHtml(entry.name)}</strong>
          <small>${escapeHtml(entry.group)} &middot; ${escapeHtml(formatType(entry.type))}</small>
        </span>
        ${preview ? `<em>${escapeHtml(preview)}</em>` : ""}
      </button>
    `;
  }

  function selectPatternDraft(key, id) {
    const entry = getItem(id);
    const input = elements[`${key}Input`];
    if (!entry || !input) {
      return;
    }

    patternDraft[key] = entry.id;
    input.value = entry.name;
    setPatternFeedback(key, `Selected ${entry.name}. Press Add to commit.`, "success");
    renderPatternPicker(key);
    input.focus();
    input.select();
  }

  function clearPatternDraft(key, options = {}) {
    patternDraft[key] = "";
    if (options.clearInput && elements[`${key}Input`]) {
      elements[`${key}Input`].value = "";
    }
    renderPatternPicker(key);
  }

  function renderLookupStart() {
    elements.lookupTitle.textContent = "Search-first clinical lookup";
    elements.copyLookupButton.disabled = true;
    state.lastLookupSummary = "";

    elements.lookupContent.innerHTML = `
      <section class="uds-section uds-search-first">
        <h4>Search any drug, metabolite, screen, or finding</h4>
        <p class="uds-muted">Examples: oxycodone, negative opiate screen fentanyl, 7-aminoclonazepam, EDDP, EtG.</p>
      </section>
      <section class="uds-section">
        <h4>High-yield quick searches</h4>
        <div class="uds-common-list">
          ${highYieldSearches.map((id) => renderItemChip(id)).join("")}
        </div>
      </section>
      <section class="uds-section uds-question-section">
        <h4>Common clinical questions</h4>
        <div class="uds-question-list">
          ${clinicalQuestionShortcuts.map((shortcut) => renderClinicalQuestionShortcut(shortcut)).join("")}
        </div>
      </section>
      <details class="uds-details">
        <summary>Browse by drug class</summary>
        <div class="uds-details-body">
          ${renderCommonGroups()}
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

  function renderItemChip(id) {
    return `
      <button class="uds-chip" data-uds-focus="${escapeAttribute(id)}" type="button">
        ${escapeHtml(labelFor(id))}
      </button>
    `;
  }

  function renderClinicalQuestionShortcut(shortcut) {
    return `
      <button
        class="uds-question-button"
        data-uds-focus="${escapeAttribute(shortcut.focusId)}"
        data-uds-method="${escapeAttribute(shortcut.method)}"
        type="button"
      >
        <span>${escapeHtml(shortcut.label)}</span>
        <small>${escapeHtml(shortcut.hint)}</small>
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
      ${renderLookupBackNav()}
      ${renderLookupNameList(entry)}
      ${renderClinicalAnswerCard(entry, primaryRows, secondaryRows, caveats)}
      ${renderDetailsSection("References", renderSources(sourcesForEntry))}
    `;

    renderLookupDetailsRail(entry, primaryRows, secondaryRows, caveats);
  }

  function renderClinicalAnswerCard(entry, primaryRows, secondaryRows, caveats) {
    const bottomLine = getMethodAnswer(entry, "bottomLine") || entry.bottomLine || buildBottomLine(entry, primaryRows, secondaryRows, caveats);
    const likelyExplanation = shouldShowLikelyExplanation(entry)
      ? entry.likelyExplanation || buildLikelyExplanation(entry, primaryRows, secondaryRows)
      : "";
    const pitfall = getMethodAnswer(entry, "commonPitfall") || entry.commonPitfall || buildCommonPitfall(entry, caveats);
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
          </div>
        </div>
        ${renderMethodContext()}
        ${renderInterpretationFlags(entry)}
        ${renderCurationStatus(entry)}
        ${renderAnswerLine("Bottom line", bottomLine)}
        ${likelyExplanation ? renderAnswerLine("Likely explanation", likelyExplanation) : ""}
        ${renderAnswerLine("Pitfall", pitfall)}
        ${renderAnswerLine("Next step", nextStep)}
      </section>
    `;
  }

  function renderLookupBackNav() {
    const previousId = state.lookupBackStack[state.lookupBackStack.length - 1];
    if (!previousId || !getItem(previousId)) {
      return "";
    }

    return `
      <div class="uds-lookup-nav">
        <button class="secondary-button uds-lookup-back" data-uds-lookup-back type="button">
          Back to ${escapeHtml(labelFor(previousId))}
        </button>
      </div>
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

  function renderMethodContext() {
    if (state.method === "any") {
      return "";
    }

    const label = state.method === "immunoassay" ? "Immunoassay screen" : "Definitive LC/GC-MS";
    return `<div class="uds-method-context">Interpreting for: ${escapeHtml(label)}</div>`;
  }

  function renderLookupNameList(entry) {
    const names = [entry.name, ...(entry.displayAliases || [])]
      .map((name) => name.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length <= 1) {
      return "";
    }

    return `
      <div class="uds-name-list">
        <span class="uds-name-list-label">Generic / brand</span>
        <span class="uds-name-list-value">${uniqueNames.map(escapeHtml).join(", ")}</span>
      </div>
    `;
  }

  function renderInterpretationFlags(entry) {
    if (!entry.interpretationFlags?.length) {
      return "";
    }

    return `
      <div class="uds-interpretation-flags" aria-label="High-yield interpretation flags">
        ${entry.interpretationFlags.map((flag) => `
          <span class="uds-interpretation-flag uds-interpretation-flag--${escapeAttribute(flag.tone)}">
            ${escapeHtml(flag.label)}
          </span>
        `).join("")}
      </div>
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

  function renderRelatedFindingsInline(entry, primaryRows, secondaryRows) {
    const relationshipHtml = renderRelationshipList(primaryRows, secondaryRows, entry.id);
    if (!relationshipHtml) {
      return "";
    }

    return `
      <section class="uds-inline-section uds-related-findings">
        <h4>Related findings</h4>
        ${relationshipHtml}
      </section>
    `;
  }

  function renderAssayDetailsInline(caveats) {
    if (!caveats.length) {
      return "";
    }

    return `
      <section class="uds-inline-section uds-assay-details">
        <h4>Assay details</h4>
        <div class="uds-note-list">
          ${caveats.slice(0, 2).map((caveatEntry) => `
            <div class="uds-assay-note">
              <strong>${escapeHtml(caveatEntry.title)}</strong>
              <div>${escapeHtml(caveatEntry.text)}</div>
            </div>
          `).join("")}
        </div>
      </section>
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

  function renderDetectionWindowInline(entry) {
    if (!entry.window) {
      return "";
    }

    return `
      <div class="uds-compact-row uds-detection-window">
        <span class="uds-compact-label">Detection window</span>
        <span class="uds-compact-value">${escapeHtml(entry.window)}</span>
      </div>
    `;
  }

  function renderAssayCaveats(caveats) {
    if (!caveats.length) {
      return renderEmpty("No method-specific assay limitation is configured for this item.");
    }

    return caveats
      .map((caveatEntry) => `<div class="uds-note"><strong>${escapeHtml(caveatEntry.title)}:</strong> ${escapeHtml(caveatEntry.text)}</div>`)
      .join("");
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

  function shouldShowLikelyExplanation(entry) {
    return entry.showLikelyExplanation === true;
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

    const relatedNames = primaryRows
      .slice(0, 3)
      .map((row) => labelFor(row.to === entry.id ? row.from : row.to))
      .filter(Boolean);

    if (relatedNames.length && entry.type.includes("drug")) {
      return `${entry.name} may be associated with ${relatedNames.join(", ")}. Interpret with assay method, timing, and panel contents.`;
    }

    if (relatedNames.length) {
      return `${entry.name} may be explained by ${relatedNames.join(", ")}. Interpret with the full medication list and metabolite pattern.`;
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
    if (entry.commonPitfall) {
      return entry.commonPitfall;
    }
    return "Do not overinterpret a urine result without the ordered panel, cutoff, timing, assay method, and medication list.";
  }

  function buildNextStep(entry, caveats) {
    if (entry.nextStep) {
      return entry.nextStep;
    }
    if (caveats.some((caveatEntry) => caveatEntry.method === "immunoassay")) {
      return "Use definitive testing or a targeted assay when the result conflicts with the medication list or clinical question.";
    }
    return "Interpret with medication history, timing, panel contents, and references; consult the lab for unexpected results.";
  }

  function renderLookupDetailsRail(entry, primaryRows, secondaryRows, caveats) {
    elements.relationsContent.innerHTML = `
      <aside class="uds-detail-rail" aria-label="Clinical lookup details">
        ${renderDetectionWindowInline(entry)}
        ${renderRelatedFindingsInline(entry, primaryRows, secondaryRows)}
        ${renderAssayDetailsInline(caveats)}
        ${caveats.length > 2 ? renderDetailsSection("Additional assay caveats", renderAssayCaveats(caveats.slice(2))) : ""}
      </aside>
    `;
  }

  function renderRelationshipRow(relationship, focusId) {
    const otherId = relationship.from === focusId ? relationship.to : relationship.from;
    const direction = relationship.from === focusId ? "->" : "<-";

    return `
      <button class="uds-relation-row" data-uds-focus="${escapeAttribute(otherId)}" data-uds-history="true" type="button">
        <span class="uds-relation-main">
          ${escapeHtml(labelFor(focusId))} ${direction} ${escapeHtml(labelFor(otherId))}
        </span>
        <span class="uds-relation-sub">${escapeHtml(relationship.clue)}</span>
        ${renderRelationshipTag(relationship)}
      </button>
    `;
  }

  function renderRelationshipTag(relationship) {
    const tag = relationship.clinicalTag || formatStrength(relationship.strength);
    const tagClass = getRelationshipTagClass(tag);
    return `<span class="uds-relation-tag ${escapeAttribute(tagClass)}">${escapeHtml(tag)}</span>`;
  }

  function getRelationshipTagClass(tag) {
    const tagClassMap = {
      "Expected metabolite": "uds-relation-tag--expected",
      "Supportive metabolite": "uds-relation-tag--supportive",
      "Specific marker": "uds-relation-tag--specific",
      "Possible minor metabolite": "uds-relation-tag--minor",
      "Possible parent drug": "uds-relation-tag--parent",
      "Shared metabolite": "uds-relation-tag--shared",
      "Not source-specific": "uds-relation-tag--shared",
      "Assay limitation": "uds-relation-tag--assay",
      "Exposure marker": "uds-relation-tag--exposure",
      "Requires quantitative context": "uds-relation-tag--context",
      "Requires timing context": "uds-relation-tag--context",
      "Requires panel context": "uds-relation-tag--context",
    };

    return tagClassMap[tag] || "uds-relation-tag--context";
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
    renderPatternPickers();
  }

  function renderChipList(key, container) {
    const values = state[key];
    container.innerHTML = values.length
      ? values
        .map((id) => {
          const meta = key === "absent" ? getAbsentMeta(id) : null;
          const metaText = meta
            ? `${formatAbsentStatus(meta.status)}; coverage ${meta.panelCoverageConfirmed ? "verified" : "not verified"}; ${getSelectedPanel(meta.panelId).name}`
            : "";

          return `
            <button class="uds-chip${metaText ? " uds-chip--with-meta" : ""}" data-uds-remove="${key}" data-uds-id="${escapeAttribute(id)}" type="button">
              <span>${escapeHtml(labelFor(id))}</span>
              ${metaText ? `<small class="uds-chip-meta">${escapeHtml(metaText)}</small>` : ""}
              <span class="uds-chip-remove" aria-hidden="true">x</span>
            </button>
          `;
        })
        .join("")
      : `<span class="uds-muted">No items added.</span>`;
  }

  function renderPatternScenarios() {
    const groupedScenarios = patternScenarios.reduce((groups, scenario) => {
      const category = scenario.category || "Common patterns";
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category).push(scenario);
      return groups;
    }, new Map());

    elements.patternScenarios.innerHTML = `
      <details class="uds-scenario-details">
        <summary class="uds-scenario-summary">
          <div class="uds-scenario-header">
            <h4>Clinical workflow templates</h4>
            <p>Optional starting points for common UDS reconciliation patterns.</p>
          </div>
          <span class="uds-scenario-toggle-text" aria-hidden="true"></span>
        </summary>
        <div class="uds-scenario-body">
          ${[...groupedScenarios.entries()].map(([category, scenarios]) => `
            <section class="uds-scenario-group">
              <h5>${escapeHtml(category)}</h5>
              <div class="uds-scenario-list">
                ${scenarios.map((scenario) => renderPatternScenarioButton(scenario)).join("")}
              </div>
            </section>
          `).join("")}
        </div>
      </details>
    `;
  }

  function renderPatternScenarioButton(scenario) {
    return `
      <button class="uds-scenario-button" data-uds-scenario="${escapeAttribute(scenario.id)}" type="button">
        <span>${escapeHtml(scenario.label)}</span>
        <small>${escapeHtml(formatScenarioMethod(scenario.method))}</small>
        ${scenario.description ? `<em>${escapeHtml(scenario.description)}</em>` : ""}
      </button>
    `;
  }

  function formatScenarioMethod(method) {
    if (method === "immunoassay") {
      return "Immunoassay";
    }
    if (method === "definitive") {
      return "Definitive";
    }
    return "Any method";
  }

  function renderPatternOutput() {
    const result = analyzePattern();
    state.lastPatternSummary = result.summary;
    elements.copyPatternButton.disabled = !result.summary;

    elements.patternOutput.innerHTML = `
      <div class="uds-result-block">
        ${renderEvidenceLine(result)}
        ${renderWorkflowChecklist(result.workflowChecks)}
        ${renderResultSection("Can this be explained?", [result.assessment], "uds-result-assessment")}
        ${result.detectedSummaries.length ? renderResultSection("Detected finding summary", result.detectedSummaries.slice(0, 3), "uds-result-detected-summary") : ""}
        ${result.sourceAmbiguities.length ? renderResultSection("Source ambiguity", result.sourceAmbiguities.slice(0, 2), "uds-result-source-ambiguity") : ""}
        ${renderResultSection("Recommended next step", [result.nextStep], "uds-result-next-step")}
        ${result.panelWarnings.length ? renderResultSection("Panel and method warnings", result.panelWarnings.slice(0, 3), "uds-result-panel-warning") : ""}
        ${result.sourceAmbiguities.length > 2 ? renderPatternDetailsSection("Additional source ambiguity", result.sourceAmbiguities.slice(2)) : ""}
        ${renderPatternDetailsSection("Absent finding review", result.absentReviews)}
        ${renderPatternDetailsSection("Explained findings", result.explained)}
        ${renderPatternDetailsSection("Needs context", result.needsContext)}
        ${renderPatternDetailsSection("Not explained", result.notExplained)}
        ${renderPatternDetailsSection("Missing supportive findings", result.missingSupportive)}
        ${result.panelWarnings.length > 3 ? renderPatternDetailsSection("Additional panel and method warnings", result.panelWarnings.slice(3)) : ""}
        ${renderPatternDetailsSection("Method notes", result.methodNotes)}
        ${renderPatternDetailsSection("Rule/source trace", result.ruleTrace)}
      </div>
    `;
  }

  function renderWorkflowChecklist(checks) {
    if (!checks?.length) {
      return "";
    }

    return `
      <section class="uds-workflow-checks" aria-label="UDS review workflow checks">
        <div class="uds-workflow-checks-head">
          <h4>Review workflow</h4>
          <p>Use these checks before acting on the result.</p>
        </div>
        <div class="uds-workflow-check-grid">
          ${checks.map((check) => `
            <article class="uds-workflow-check uds-workflow-check--${escapeAttribute(check.tone)}">
              <span>${escapeHtml(check.status)}</span>
              <strong>${escapeHtml(check.title)}</strong>
              <p>${escapeHtml(check.text)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderEvidenceLine(result) {
    if (!result.evidenceLabel) {
      return "";
    }

    return `
      <section class="uds-evidence-line uds-evidence-${escapeAttribute(result.evidenceTone)}">
        <div>
          <h4>Evidence level</h4>
          <p>${escapeHtml(result.evidenceDescription)}</p>
        </div>
        <span class="uds-evidence-badge">${escapeHtml(result.evidenceLabel)}</span>
      </section>
    `;
  }

  function getSelectedPanel(panelId = state.panelId) {
    return panels.find((panel) => panel.id === panelId) || panels[0];
  }

  function getPanelCoverage(itemId, panelId = state.panelId) {
    const panel = getSelectedPanel(panelId);
    return panel?.analytes.find((analyte) => analyte.itemId === itemId) || null;
  }

  function getPanelLabel() {
    return getSelectedPanel()?.name || "Unknown / report not reviewed";
  }

  function updatePanelControl(panelId) {
    if (!panelId) {
      return;
    }

    state.panelId = panelId;
    if (elements.panelSelect) {
      elements.panelSelect.value = panelId;
    }
  }

  function updateAbsentControls() {
    if (elements.absentStatusSelect) {
      elements.absentStatusSelect.value = state.absentStatus;
    }
    if (elements.panelCoverageConfirmed) {
      elements.panelCoverageConfirmed.checked = state.panelCoverageConfirmed;
    }
  }

  function inferPanelForScenario(scenario) {
    if (scenario.panelId) {
      return scenario.panelId;
    }

    const allIds = [
      ...(scenario.expected || []),
      ...(scenario.detected || []),
      ...(scenario.absent || []),
    ];

    if (scenario.method === "definitive") {
      return "targeted_definitive_panel";
    }

    if (scenario.method === "immunoassay") {
      if (allIds.some((id) => ["clonazepam", "aminoclonazepam7", "lorazepam", "lorazepam_glucuronide"].includes(id))) {
        return "benzodiazepine_immunoassay_panel";
      }

      if (allIds.some((id) => ["fentanyl", "norfentanyl", "oxycodone", "oxymorphone", "methadone", "eddp", "buprenorphine", "norbuprenorphine"].includes(id))) {
        return "generic_opiate_immunoassay";
      }
    }

    return "unknown_panel";
  }

  function getAbsentMeta(itemId) {
    return state.absentMeta[itemId] || {
      status: state.absentStatus,
      panelId: state.panelId,
      panelCoverageConfirmed: state.panelCoverageConfirmed,
    };
  }

  function methodMatchesPanel() {
    const panel = getSelectedPanel();
    return !panel || panel.method === "any" || state.method === "any" || panel.method === state.method;
  }

  function buildPanelWarnings() {
    const warnings = [];
    const panel = getSelectedPanel();

    if (state.method === "any") {
      warnings.push("Method is set to Any; select immunoassay or definitive testing when known for more specific interpretation.");
    } else if (state.method === "immunoassay") {
      warnings.push("Immunoassay results are presumptive and can miss drugs outside the screen target or cross-react with unrelated medications.");
    } else if (state.method === "definitive") {
      warnings.push("Definitive testing identifies targeted analytes only; verify the exact panel and reportable metabolites.");
    }

    if (panel?.id === "unknown_panel") {
      warnings.push("Panel is unknown. Verify the ordered test, included analytes, cutoffs, and reportable findings before acting on absent results.");
    } else if (!methodMatchesPanel()) {
      warnings.push(`${panel.name} is configured as ${formatScenarioMethod(panel.method)}, while the selected method is ${formatScenarioMethod(state.method)}.`);
    }

    if (state.absent.length) {
      if (state.absent.some((id) => getAbsentMeta(id).status !== "reported_absent")) {
        warnings.push("Absent entries are not marked as reported absent/negative, so they should be treated as non-actionable context.");
      }
      if (state.absent.some((id) => !getAbsentMeta(id).panelCoverageConfirmed)) {
        warnings.push("Absent findings are non-actionable until the analyte was verified as included and reportable on the ordered panel.");
      }

      state.absent.forEach((id) => {
        const assessment = classifyAbsentFinding(id);
        if (assessment.panelWarning) {
          warnings.push(assessment.panelWarning);
        }
      });
    }

    return [...new Set(warnings)];
  }

  function buildAbsentReviews() {
    return state.absent
      .map((id) => classifyAbsentFinding(id).message)
      .filter(Boolean);
  }

  function classifyAbsentFinding(itemId) {
    const meta = getAbsentMeta(itemId);
    const panel = getSelectedPanel(meta.panelId);
    const coverage = getPanelCoverage(itemId, meta.panelId);
    const name = labelFor(itemId);

    if (meta.status !== "reported_absent") {
      return {
        actionable: false,
        message: `${name} was entered as absent, but the status is ${formatAbsentStatus(meta.status)}. Treat this as non-actionable until the report specifically lists it as absent/negative.`,
        panelWarning: `${name}: absent status is ${formatAbsentStatus(meta.status)}.`,
      };
    }

    if (!meta.panelCoverageConfirmed) {
      return {
        actionable: false,
        message: `${name} was entered as reported absent, but panel coverage was not verified. Treat this as non-actionable until the analyte was confirmed included and reportable.`,
        panelWarning: `${name}: verify that the analyte was included, tested, and reportable before interpreting absence.`,
      };
    }

    if (!panel || panel.id === "unknown_panel") {
      return {
        actionable: false,
        message: `${name} was entered as reported absent, but the selected panel is unknown.`,
        panelWarning: `${name}: panel unknown, so absence cannot support non-exposure or nonadherence.`,
      };
    }

    if (!coverage) {
      if (panel.id === "targeted_definitive_panel") {
        return {
          actionable: true,
          message: `${name} is treated as reported absent only because the user verified it was included and reportable on the targeted definitive panel. Interpret with timing, cutoff, specimen validity, and medication history.`,
          panelWarning: `${name}: user-verified coverage, but this analyte is not explicitly mapped in the tool's selected panel definition.`,
        };
      }

      return {
        actionable: false,
        message: `${name} is not mapped in ${panel.name}; confirm the reportable analyte list and cutoff before interpreting absence.`,
        panelWarning: `${name}: selected panel lacks configured coverage for this analyte.`,
      };
    }

    if (coverage.status === "not_included") {
      return {
        actionable: false,
        message: `${name} is not included in ${panel.name}; absence is not clinically meaningful for that panel.`,
        panelWarning: `${name}: ${coverage.cutoffNote || "not included in selected panel"}.`,
      };
    }

    if (coverage.status === "unknown") {
      return {
        actionable: false,
        message: `${name} coverage is assay-dependent or unknown in ${panel.name}; confirm the specific reportable analyte before interpreting absence.`,
        panelWarning: `${name}: panel coverage is assay-dependent or unknown.`,
      };
    }

    if (coverage.status === "class_screen_only") {
      return {
        actionable: false,
        message: `${name} is represented only by a class-level screen in ${panel.name}; do not treat this as a specific analyte-negative result.`,
        panelWarning: `${name}: class-level screen only, not specific analyte absence.`,
      };
    }

    return {
      actionable: true,
      message: `${name} is treated as reported absent because the analyte was verified as included and reportable. Interpret with timing, cutoff, specimen validity, and medication history.`,
      panelWarning: "",
    };
  }

  function hasNonActionableAbsentFinding() {
    return state.absent.some((id) => !classifyAbsentFinding(id).actionable);
  }

  function hasPanelDependentConcern(panelWarnings, absentReviews) {
    return (
      panelWarnings.length > 0 ||
      hasNonActionableAbsentFinding() ||
      absentReviews.some((message) =>
        /non-actionable|not verified|unknown|not included|class-level|assay-dependent|not mapped/i.test(message)
      )
    );
  }

  function formatAbsentStatus(status) {
    if (status === "reported_absent") {
      return "reported absent / negative";
    }
    if (status === "not_reported") {
      return "not reported / not shown";
    }
    return "unknown whether tested";
  }

  function buildRuleTraceEntry(row, reason) {
    const sourceLabels = getSourceLabels(row.sourceIds);
    return `${reason}: ${labelFor(row.from)} -> ${labelFor(row.to)} (${row.clinicalTag || row.label}). ${row.clue}${sourceLabels ? ` Sources: ${sourceLabels}.` : ""}`;
  }

  function getSourceLabels(sourceIds = []) {
    return sourceIds
      .map((id) => sources[id]?.title || id)
      .filter(Boolean)
      .join("; ");
  }

  function analyzePattern() {
    const explained = [];
    const needsContext = [];
    const notExplained = [];
    const missingSupportive = [];
    const ruleTrace = [];
    const selectedIds = [...state.expected, ...state.detected, ...state.absent];
    const methodNotes = getRelevantCaveats(selectedIds).map((entry) => entry.text);
    const hasInputs = Boolean(selectedIds.length);
    const panelWarnings = hasInputs ? buildPanelWarnings() : [];
    const absentReviews = buildAbsentReviews();

    if (!state.expected.length && !state.detected.length && !state.absent.length) {
      const evidence = buildEvidenceLevel(explained, needsContext, notExplained, missingSupportive, [], [], []);
      return {
        assessment: "Add at least one prescribed/expected drug and one detected finding.",
        evidenceLabel: evidence.label,
        evidenceTone: evidence.tone,
        evidenceDescription: evidence.description,
        workflowChecks: buildWorkflowChecks(explained, needsContext, notExplained, missingSupportive, [], [], []),
        detectedSummaries: [],
        sourceAmbiguities: [],
        explained: [],
        needsContext: [],
        notExplained: [],
        missingSupportive: [],
        nextStep: "Add detected findings to compare against the selected expected drug(s).",
        panelWarnings: [],
        absentReviews: [],
        methodNotes,
        ruleTrace: [],
        summary: "",
      };
    }

    if (!state.expected.length) {
      state.detected.forEach((detectedId) => {
        const entry = getItem(detectedId);
        const detectedSummary = entry
          ? getMethodAnswer(entry, "bottomLine") || entry.bottomLine || entry.note
          : "";
        notExplained.push(
          `${labelFor(detectedId)} is detected without an entered expected medication or exposure.${detectedSummary ? ` ${detectedSummary}` : ""}`,
        );
      });
    } else {
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
        ruleTrace.push(buildRuleTraceEntry(relationship.row, "Detected finding explained"));
        if (relationship.row.strength === "context" || relationship.row.clinicalTag === "Not source-specific" || relationship.row.clinicalTag === "Shared metabolite") {
          needsContext.push(message);
        } else {
          explained.push(message);
        }
      });
    }

    state.expected.forEach((expectedId) => {
      const supportive = getOutgoing(expectedId).filter((row) => row.strength === "primary");
      supportive.forEach((row) => {
        const hasFinding = state.detected.includes(row.to);
        const markedAbsent = state.absent.includes(row.to);
        if (!hasFinding && !markedAbsent) {
          missingSupportive.push(`${labelFor(row.to)} would support ${labelFor(expectedId)} if included in the ordered panel.`);
          ruleTrace.push(buildRuleTraceEntry(row, "Supportive finding not entered"));
        }
        if (markedAbsent) {
          const absentAssessment = classifyAbsentFinding(row.to);
          const absentMessage = absentAssessment.actionable
            ? `${labelFor(row.to)} is reported absent on a verified panel; interpret with timing, cutoff, and method before treating this as discordant.`
            : absentAssessment.message;
          missingSupportive.push(absentMessage);
          ruleTrace.push(buildRuleTraceEntry(row, "Supportive finding entered as absent"));
        }
      });
    });

    const assessment = buildAssessment(explained, needsContext, notExplained, missingSupportive, panelWarnings, absentReviews);
    const nextStep = buildPatternNextStep(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, absentReviews);
    const evidence = buildEvidenceLevel(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, absentReviews);
    const sourceAmbiguities = buildSourceAmbiguities();
    const detectedSummaries = buildDetectedSummaries(!state.expected.length || Boolean(notExplained.length));
    const workflowChecks = buildWorkflowChecks(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, sourceAmbiguities);
    const summary = buildPatternSummary({
      assessment,
      nextStep,
      evidence,
      workflowChecks,
      detectedSummaries,
      panelWarnings,
      absentReviews,
      sourceAmbiguities,
      explained,
      needsContext,
      notExplained,
      ruleTrace,
    });

    return {
      assessment,
      evidenceLabel: evidence.label,
      evidenceTone: evidence.tone,
      evidenceDescription: evidence.description,
      workflowChecks,
      nextStep,
      detectedSummaries,
      sourceAmbiguities,
      explained,
      needsContext,
      notExplained,
      missingSupportive: missingSupportive.slice(0, 8),
      panelWarnings,
      absentReviews,
      methodNotes: methodNotes.slice(0, 5),
      ruleTrace: [...new Set(ruleTrace)].slice(0, 8),
      summary,
    };
  }

  function buildAssessment(explained, needsContext, notExplained, missingSupportive = [], panelWarnings = [], absentReviews = []) {
    if (notExplained.length) {
      if (!state.expected.length && state.detected.length) {
        return "Unexpected finding(s) present. No expected medication or exposure was entered, so review as an unexpected positive unless history or panel context explains it.";
      }
      return "No. At least one finding is not explained by the selected expected medication(s) in the current rule set.";
    }
    if (state.absent.length && hasPanelDependentConcern(panelWarnings, absentReviews)) {
      return "Panel-dependent. Absent findings cannot be fully interpreted until the exact panel, reportable analytes, cutoffs, and coverage status are verified.";
    }
    if (needsContext.length) {
      return "Possibly. Findings are mostly compatible, but one or more results require timing, quantitative, cutoff, panel, or assay-method context.";
    }
    if (explained.length) {
      return "Yes. Detected findings are compatible with the selected expected medication(s), based on configured parent/metabolite relationships.";
    }
    if (state.absent.length) {
      return "Panel-dependent. No detected finding was entered, and absent findings require panel coverage, timing, cutoff, and report context before interpretation.";
    }
    return "Not enough information. Add detected findings to compare against the selected expected medication(s).";
  }

  function buildPatternNextStep(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, absentReviews = []) {
    if (notExplained.length) {
      return "Confirm medication list, assay method, panel contents, cutoff, specimen validity, and timing; consider definitive testing or lab consultation.";
    }
    if (state.absent.length && hasPanelDependentConcern(panelWarnings, absentReviews)) {
      return "Verify the exact ordered panel, included analytes, reportable metabolites, cutoff, and specimen validity before treating absent findings as clinically meaningful.";
    }
    if (needsContext.length) {
      return "Interpret with timing, quantitative values, cutoff, and panel contents before making adherence or misuse conclusions.";
    }
    if (missingSupportive.length) {
      return "Verify whether supportive metabolites were included in the ordered panel before treating absence as meaningful.";
    }
    if (state.method === "immunoassay" && methodNotes.length) {
      return "Review method limitations before acting on the result; use targeted or definitive testing when the result is unexpected or clinically consequential.";
    }
    if (explained.length) {
      return "Document the pattern as compatible only if the medication list, assay method, timing, cutoff, specimen validity, and panel contents fit.";
    }
    return "Use this as a reconciliation aid; dose, timing, adherence, impairment, or absence of other exposure require supporting context.";
  }

  function buildEvidenceLevel(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, absentReviews = []) {
    const hasCriticalMethodNote = state.method === "immunoassay" && methodNotes.some((note) => /not detect|may miss|false positive|false negative|specific/i.test(note));
    const hasAbsentPanelConcern = state.absent.length && hasPanelDependentConcern(panelWarnings, absentReviews);
    const hasSupportiveConcern = missingSupportive.some((note) =>
      /absent|panel|cutoff|included|reportable|not entered/i.test(note)
    );

    if (notExplained.length) {
      return {
        label: "Unexpected / unresolved",
        tone: "warning",
        description: "At least one detected finding is not explained by the selected expected medication(s).",
      };
    }
    if (hasAbsentPanelConcern) {
      return {
        label: "Panel-dependent",
        tone: "caution",
        description: "Interpretation depends on the exact ordered panel, reportable analytes, cutoffs, and whether absent findings were truly tested and reportable.",
      };
    }
    if (needsContext.length || hasSupportiveConcern) {
      return {
        label: "Context-dependent",
        tone: "caution",
        description: "The pattern may fit, but timing, cutoff, quantitative values, or panel coverage materially affect interpretation.",
      };
    }
    if (hasCriticalMethodNote) {
      return {
        label: "Assay-dependent",
        tone: "method",
        description: "The interpretation depends heavily on whether the ordered method includes and detects the relevant analytes.",
      };
    }
    if (explained.length) {
      return {
        label: "Compatible / expected",
        tone: "compatible",
        description: "Detected findings are explained by configured parent/metabolite relationships.",
      };
    }
    return {
      label: "Incomplete",
      tone: "neutral",
      description: "Add expected medications and detected findings to generate an interpretation.",
    };
  }

  function buildDetectedSummaries(shouldSummarize) {
    if (!shouldSummarize) {
      return [];
    }

    return state.detected
      .map((id) => {
        const entry = getItem(id);
        if (!entry) {
          return "";
        }
        const summary = getMethodAnswer(entry, "bottomLine") || entry.bottomLine || entry.note;
        return summary ? `${entry.name}: ${summary}` : "";
      })
      .filter(Boolean)
      .slice(0, 5);
  }

  function buildWorkflowChecks(explained, needsContext, notExplained, missingSupportive, methodNotes, panelWarnings, sourceAmbiguities = []) {
    const checks = [];
    const hasInputs = state.expected.length || state.detected.length || state.absent.length;
    const methodTone = state.method === "any" ? "neutral" : state.method === "immunoassay" ? "method" : "compatible";
    const methodStatus = state.method === "any" ? "Choose if known" : formatScenarioMethod(state.method);
    const panel = getSelectedPanel();
    const methodText = state.method === "any"
      ? "If the report is a screen or definitive panel, select the method before relying on the interpretation."
      : state.method === "immunoassay"
        ? "Treat screen results as presumptive and watch for false negatives, false positives, and class-panel gaps."
        : "Use parent/metabolite pattern, timing, cutoff, and medication history to interpret source and compatibility.";

    checks.push({
      title: "Method and panel",
      status: methodStatus,
      tone: methodTone,
      text: `${methodText} Panel: ${panel?.name || "Unknown"}.`,
    });

    if (!hasInputs) {
      checks.push({
        title: "Medication match",
        status: "Waiting for inputs",
        tone: "neutral",
        text: "Add expected medications and detected findings to determine whether the result can be explained.",
      });
    } else if (notExplained.length) {
      checks.push({
        title: "Medication match",
        status: "Unresolved",
        tone: "warning",
        text: "At least one detected finding is not explained by the selected expected medication list.",
      });
    } else if (needsContext.length) {
      checks.push({
        title: "Medication match",
        status: "Context-dependent",
        tone: "caution",
        text: "The pattern may fit, but timing, cutoff, quantitative values, or assay design still matter.",
      });
    } else if (explained.length) {
      checks.push({
        title: "Medication match",
        status: "Compatible",
        tone: "compatible",
        text: "Detected findings are explained by configured parent/metabolite relationships.",
      });
    } else {
      checks.push({
        title: "Medication match",
        status: "Incomplete",
        tone: "neutral",
        text: "Add detected findings from the report to compare against the expected medication list.",
      });
    }

    checks.push({
      title: "Source ambiguity",
      status: sourceAmbiguities.length ? "Review closely" : "No major flag",
      tone: sourceAmbiguities.length ? "caution" : "compatible",
      text: sourceAmbiguities.length
        ? "One or more findings can come from multiple sources; avoid source conclusions from the analyte alone."
        : "No high-yield shared-byproduct ambiguity is flagged from the current selections.",
    });

    const nonActionableAbsent = state.absent.length && hasNonActionableAbsentFinding();

    checks.push({
      title: "Absent findings",
      status: state.absent.length
        ? nonActionableAbsent
          ? "Non-actionable until verified"
          : "Coverage verified"
        : missingSupportive.length
          ? "Check panel"
          : "None entered",
      tone: state.absent.length
        ? nonActionableAbsent
          ? "caution"
          : "compatible"
        : missingSupportive.length
          ? "caution"
          : "neutral",
      text: state.absent.length
        ? nonActionableAbsent
          ? "One or more absent findings cannot be interpreted until status, panel coverage, reportability, and cutoff are verified."
          : "Absent findings are entered as reported absent with coverage verified; still interpret with timing, cutoff, specimen validity, and medication history."
        : missingSupportive.length
          ? "Supportive metabolites are not entered; verify whether they were included before treating this as discordant."
          : "No absent analytes were entered for this reconciliation.",
    });

    if (state.method === "immunoassay" && methodNotes.length) {
      checks.push({
        title: "Confirmation threshold",
        status: "Consider definitive",
        tone: "method",
        text: "If the result is unexpected or clinically consequential, use targeted or definitive testing before changing care.",
      });
    } else if (state.absent.length && panelWarnings.length) {
      checks.push({
        title: "Confirmation threshold",
        status: "Verify panel",
        tone: "caution",
        text: "Panel contents should be verified before acting on absent findings.",
      });
    }

    return checks;
  }

  function buildSourceAmbiguities() {
    const candidateIds = [...new Set([...state.detected, ...state.absent])];
    if (!candidateIds.length) {
      return [];
    }

    const expectedIds = new Set(state.expected);
    const selectedIds = new Set([...state.expected, ...state.detected, ...state.absent]);
    const ambiguousMessages = candidateIds.flatMap((id) => {
      const entry = getItem(id);
      if (!entry) {
        return [];
      }
      const ambiguityCaveats = getRelevantCaveats([id])
        .filter((caveatEntry) => /ambiguity|not source-specific|source-specific/i.test(`${caveatEntry.title} ${caveatEntry.text}`))
        .map((caveatEntry) => caveatEntry.text);
      const ambiguousRelationships = [...getIncoming(id), ...getOutgoing(id)]
        .filter((row) => row.clinicalTag === "Not source-specific" || row.clinicalTag === "Shared metabolite")
        .sort((a, b) => scoreAmbiguityRelationship(b, expectedIds, selectedIds) - scoreAmbiguityRelationship(a, expectedIds, selectedIds))
        .map((row) => `${entry.name}: ${row.clue}`);
      return [...ambiguityCaveats, ...ambiguousRelationships];
    });

    return [...new Set(ambiguousMessages)].slice(0, 6);
  }

  function scoreAmbiguityRelationship(row, expectedIds, selectedIds) {
    let score = 0;
    if (expectedIds.has(row.from) || expectedIds.has(row.to)) {
      score += 10;
    }
    if (selectedIds.has(row.from) && selectedIds.has(row.to)) {
      score += 6;
    }
    if (row.from === "heroin" && selectedIds.has("6mam")) {
      score += 5;
    }
    if (row.from === "codeine" && selectedIds.has("codeine")) {
      score += 4;
    }
    return score;
  }

  function buildLookupSummary(entry, primaryRows, secondaryRows, caveats, sourcesForEntry) {
    const bottomLine = getMethodAnswer(entry, "bottomLine") || entry.bottomLine || buildBottomLine(entry, primaryRows, secondaryRows, caveats);
    const pitfall = getMethodAnswer(entry, "commonPitfall") || entry.commonPitfall || buildCommonPitfall(entry, caveats);
    const nextStep = getMethodAnswer(entry, "nextStep") || entry.nextStep || buildNextStep(entry, caveats);
    const lines = [
      `UDS lookup: ${entry.name}`,
      `Bottom line: ${bottomLine}`,
      `Pitfall: ${pitfall}`,
      `Next step: ${nextStep}`,
    ];

    if (sourcesForEntry?.length) {
      lines.push(`References: ${sourcesForEntry.map((source) => source.title).join("; ")}`);
    }

    return lines.filter(Boolean).join("\n");
  }

  function buildPatternSummary(result) {
    const parts = [
      "UDS pattern check",
      `Method: ${formatScenarioMethod(state.method)}`,
      `Panel: ${getPanelLabel()}`,
      `Absent coverage confirmed: ${state.panelCoverageConfirmed ? "yes" : "no"}`,
      `Can this be explained: ${result.assessment}`,
      `Evidence level: ${result.evidence.label}`,
      `Recommended next step: ${result.nextStep}`,
    ];
    if (result.panelWarnings?.length) {
      parts.push(`Panel/method warnings: ${result.panelWarnings.slice(0, 3).join("; ")}`);
    }
    if (result.absentReviews?.length) {
      parts.push(`Absent finding review: ${result.absentReviews.slice(0, 3).join("; ")}`);
    }
    if (result.workflowChecks?.length) {
      const unresolvedChecks = result.workflowChecks
        .filter((check) => ["warning", "caution", "method"].includes(check.tone))
        .slice(0, 3)
        .map((check) => `${check.title}: ${check.status}`);
      if (unresolvedChecks.length) {
        parts.push(`Workflow checks: ${unresolvedChecks.join("; ")}`);
      }
    }
    if (result.detectedSummaries?.length) {
      parts.push(`Detected finding summary: ${result.detectedSummaries.slice(0, 2).join("; ")}`);
    }
    if (result.sourceAmbiguities?.length) {
      parts.push(`Source ambiguity: ${result.sourceAmbiguities.slice(0, 2).join("; ")}`);
    }
    if (result.needsContext.length) {
      parts.push(`Needs context: ${result.needsContext.slice(0, 3).join("; ")}`);
    }
    if (result.notExplained.length) {
      parts.push(`Not explained: ${result.notExplained.slice(0, 3).join("; ")}`);
    }
    if (result.ruleTrace?.length) {
      parts.push(`Rule/source trace: ${result.ruleTrace.slice(0, 2).join("; ")}`);
    }
    parts.push(
      "Safety limitation: UDS alone cannot determine dose, exact timing, impairment, diversion, misuse, or adherence certainty."
    );
    return parts.join("\n");
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

  function renderList(rows) {
    return rows.length
      ? `<ul>${rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>`
      : `<div class="uds-muted">None.</div>`;
  }

  function renderPatternDetailsSection(title, rows) {
    if (!rows.length) {
      return "";
    }

    return renderDetailsSection(title, renderList(rows));
  }

  function validateClinicalTags() {
    relationships.forEach((row) => {
      if (row.clinicalTag && !allowedClinicalTags.has(row.clinicalTag)) {
        console.warn("Unexpected clinicalTag:", row.clinicalTag, row);
      }
    });
  }

  function validateUdsContent() {
    items.forEach((entry) => {
      if (entry.curationStatus === "complete") {
        ["bottomLine", "commonPitfall", "nextStep"].forEach((field) => {
          if (!entry[field]) {
            console.warn(`Complete item missing ${field}:`, entry.id);
          }
        });
      }

      if (entry.bottomLine && entry.bottomLine.length > 220) {
        console.warn("Bottom line may be too long:", entry.id, entry.bottomLine);
      }
      if (entry.commonPitfall && entry.commonPitfall.length > 180) {
        console.warn("Pitfall may be too long:", entry.id, entry.commonPitfall);
      }
      if (entry.nextStep && entry.nextStep.length > 180) {
        console.warn("Next step may be too long:", entry.id, entry.nextStep);
      }
    });

    validateClinicalTags();
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

  function findItemFromInput(value) {
    const normalizedValue = normalize(value);
    if (!normalizedValue) {
      return null;
    }

    return (
      items.find((entry) => normalize(entry.name) === normalizedValue) ||
      items.find((entry) => entry.aliases.some((alias) => normalize(alias) === normalizedValue)) ||
      null
    );
  }

  function getPatternInputKey(input) {
    return input.id.replace("uds", "").replace("Input", "").toLowerCase();
  }

  function setPatternFeedback(key, message, tone = "neutral") {
    const feedback = elements[`${key}Feedback`];
    if (!feedback) {
      return;
    }

    feedback.textContent = message || "";
    feedback.dataset.tone = tone;
    feedback.classList.toggle("is-hidden", !message);
  }

  function addChipById(key, id) {
    const entry = getItem(id);
    if (!entry) {
      setPatternFeedback(key, "No matching drug, metabolite, or finding.", "warning");
      return false;
    }

    if (state[key].includes(entry.id)) {
      setPatternFeedback(key, `${entry.name} is already added.`, "warning");
      return false;
    }

    state[key].push(entry.id);

    if (key === "absent") {
      state.absentMeta[entry.id] = {
        status: state.absentStatus,
        panelId: state.panelId,
        panelCoverageConfirmed: state.panelCoverageConfirmed,
      };
    }

    renderPatternChips();
    renderPatternOutput();
    clearPatternDraft(key, { clearInput: true });
    setPatternFeedback(key, `Added ${entry.name}.`, "success");
    return true;
  }

  function addChip(key) {
    const rawValue = elements[`${key}Input`]?.value || "";
    const selectedEntry = patternDraft[key] ? getItem(patternDraft[key]) : null;
    const hasText = Boolean(rawValue.trim());

    if (!selectedEntry && !hasText) {
      setPatternFeedback(key, "Choose a result before adding.", "warning");
      return false;
    }

    const exactMatch = findItemFromInput(rawValue);
    const entry = selectedEntry || exactMatch || null;

    if (!entry) {
      setPatternFeedback(
        key,
        "Choose a specific result below, then press Add.",
        "warning",
      );
      renderPatternPicker(key);
      return false;
    }

    return addChipById(key, entry.id);
  }

  function removeChip(key, id) {
    state[key] = state[key].filter((entryId) => entryId !== id);

    if (key === "absent") {
      delete state.absentMeta[id];
    }

    renderPatternChips();
    renderPatternOutput();
    setPatternFeedback(key, "");
  }

  function loadPatternScenario(id) {
    const scenario = patternScenarios.find((entry) => entry.id === id);
    if (!scenario) {
      return;
    }

    state.expected = [...scenario.expected];
    state.detected = [...scenario.detected];
    state.absent = [...scenario.absent];
    state.absentMeta = {};
    updateMethodControl(scenario.method);
    updatePanelControl(inferPanelForScenario(scenario));
    state.absentStatus = scenario.absent.length ? "reported_absent" : "unknown";
    state.panelCoverageConfirmed = false;
    state.absent.forEach((absentId) => {
      state.absentMeta[absentId] = {
        status: state.absentStatus,
        panelId: state.panelId,
        panelCoverageConfirmed: state.panelCoverageConfirmed,
      };
    });
    patternInputKeys.forEach((key) => {
      clearPatternDraft(key, { clearInput: true });
    });
    ["expected", "detected", "absent"].forEach((key) => setPatternFeedback(key, ""));
    updateAbsentControls();
    renderPatternChips();
    renderPatternOutput();
  }

  function setFocus(id, options = {}) {
    if (!getItem(id)) {
      return;
    }

    if (options.fromRelated && state.focusId && state.focusId !== id) {
      state.lookupBackStack.push(state.focusId);
    } else if (!options.keepHistory) {
      state.lookupBackStack = [];
    }

    state.mode = "lookup";
    state.focusId = id;
    state.relationFilter = "all";
    elements.searchInput.value = "";
    elements.searchResults.classList.add("is-hidden");
    render();
  }

  function updateMethodControl(method) {
    if (!method) {
      return;
    }

    state.method = method;
    elements.methodSelect.value = method;
  }

  function handleLookupSearch(query) {
    const intentMatch = matchIntentAlias(query);
    if (intentMatch) {
      updateMethodControl(intentMatch.method);
      setFocus(intentMatch.focusId);
      return;
    }

    const first = searchItems(query, 1)[0];
    if (first) {
      setFocus(first.id);
    }
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
    const intentMatch = matchIntentAlias(elements.searchInput.value);
    const methodAttribute = intentMatch?.focusId === entry.id && intentMatch.method
      ? ` data-uds-method="${escapeAttribute(intentMatch.method)}"`
      : "";
    const preview = entry.bottomLine || entry.commonPitfall || entry.note || "";

    return `
      <button class="uds-search-result" data-uds-focus="${escapeAttribute(entry.id)}"${methodAttribute} type="button">
        <div class="uds-search-result-main">
          <span class="uds-search-result-name">${escapeHtml(entry.name)}</span>
          <span class="uds-search-result-meta">${escapeHtml(entry.group)} &middot; ${escapeHtml(formatType(entry.type))}</span>
        </div>
        ${preview ? `<div class="uds-search-result-summary">${escapeHtml(preview)}</div>` : ""}
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
    const pickButton = event.target.closest("[data-uds-pick]");
    if (pickButton) {
      selectPatternDraft(pickButton.dataset.udsPick, pickButton.dataset.udsId);
      return;
    }

    const clearDraftButton = event.target.closest("[data-uds-clear-draft]");
    if (clearDraftButton) {
      clearPatternDraft(clearDraftButton.dataset.udsClearDraft, { clearInput: true });
      setPatternFeedback(clearDraftButton.dataset.udsClearDraft, "");
      return;
    }

    const backButton = event.target.closest("[data-uds-lookup-back]");
    if (backButton) {
      const previousId = state.lookupBackStack.pop();
      if (previousId) {
        setFocus(previousId, { keepHistory: true });
      }
      return;
    }

    const focusButton = event.target.closest("[data-uds-focus]");
    if (focusButton) {
      updateMethodControl(focusButton.dataset.udsMethod);
      setFocus(focusButton.dataset.udsFocus, { fromRelated: focusButton.dataset.udsHistory === "true" });
      return;
    }

    const groupButton = event.target.closest("[data-uds-group]");
    if (groupButton) {
      state.lookupBackStack = [];
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
      return;
    }

    const scenarioButton = event.target.closest("[data-uds-scenario]");
    if (scenarioButton) {
      loadPatternScenario(scenarioButton.dataset.udsScenario);
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

  elements.panelSelect?.addEventListener("change", () => {
    updatePanelControl(elements.panelSelect.value);
    renderPatternOutput();
  });

  elements.absentStatusSelect?.addEventListener("change", () => {
    state.absentStatus = elements.absentStatusSelect.value;
    renderPatternOutput();
  });

  elements.panelCoverageConfirmed?.addEventListener("change", () => {
    state.panelCoverageConfirmed = elements.panelCoverageConfirmed.checked;
    renderPatternOutput();
  });

  elements.searchInput.addEventListener("input", () => {
    showSearchResults(elements.searchInput.value);
  });

  elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    handleLookupSearch(elements.searchInput.value);
  });

  elements.searchClear.addEventListener("click", () => {
    elements.searchInput.value = "";
    elements.searchResults.classList.add("is-hidden");
    elements.searchInput.focus();
  });

  elements.startButton.addEventListener("click", () => {
    state.mode = "lookup";
    state.focusId = null;
    state.lookupBackStack = [];
    state.relationFilter = "all";
    render();
  });

  elements.copyLookupButton.addEventListener("click", () => {
    copyText(state.lastLookupSummary);
  });

  elements.patternGuideButton.addEventListener("click", () => {
    const isHidden = elements.patternGuide.classList.toggle("is-hidden");
    elements.patternGuideButton.setAttribute("aria-expanded", String(!isHidden));
    elements.patternGuideButton.textContent = isHidden ? "Quick guide" : "Hide guide";
  });

  elements.addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.udsAdd;
      const input = elements[`${key}Input`];
      if (addChip(key)) {
        input.value = "";
      }
      input.focus();
    });
  });

  [elements.expectedInput, elements.detectedInput, elements.absentInput].forEach((input) => {
    input.addEventListener("input", () => {
      const key = getPatternInputKey(input);
      patternDraft[key] = "";
      setPatternFeedback(key, "");
      renderPatternPicker(key);
    });

    input.addEventListener("focus", () => {
      if (patternDraft[getPatternInputKey(input)]) {
        input.select();
      }
    });

    input.addEventListener("click", () => {
      if (patternDraft[getPatternInputKey(input)]) {
        input.select();
      }
    });

    input.addEventListener("keydown", (event) => {
      const key = getPatternInputKey(input);

      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      const results = getPatternPickerResults(key);
      if (!patternDraft[key] && results.length) {
        selectPatternDraft(key, results[0].id);
        return;
      }

      if (addChip(key)) {
        input.value = "";
      }
    });
  });

  elements.clearPatternButton.addEventListener("click", () => {
    state.expected = [];
    state.detected = [];
    state.absent = [];
    state.absentMeta = {};
    state.absentStatus = "unknown";
    state.panelCoverageConfirmed = false;
    updatePanelControl("unknown_panel");
    updateAbsentControls();
    patternInputKeys.forEach((key) => {
      clearPatternDraft(key, { clearInput: true });
    });
    ["expected", "detected", "absent"].forEach((key) => setPatternFeedback(key, ""));
    renderPatternChips();
    renderPatternOutput();
  });

  elements.copyPatternButton.addEventListener("click", () => {
    copyText(state.lastPatternSummary);
  });

  function getPatternResultForValidation(testCase) {
    const previousState = {
      method: state.method,
      panelId: state.panelId,
      absentStatus: state.absentStatus,
      panelCoverageConfirmed: state.panelCoverageConfirmed,
      expected: [...state.expected],
      detected: [...state.detected],
      absent: [...state.absent],
      absentMeta: { ...state.absentMeta },
    };

    state.method = testCase.method || "any";
    state.panelId = testCase.panelId || "unknown_panel";
    state.absentStatus = testCase.absentStatus || "unknown";
    state.panelCoverageConfirmed = Boolean(testCase.panelCoverageConfirmed);
    state.expected = [...(testCase.expected || [])];
    state.detected = [...(testCase.detected || [])];
    state.absent = [...(testCase.absent || [])];
    state.absentMeta = { ...(testCase.absentMeta || {}) };

    state.absent.forEach((id) => {
      if (!state.absentMeta[id]) {
        state.absentMeta[id] = {
          status: state.absentStatus,
          panelId: state.panelId,
          panelCoverageConfirmed: state.panelCoverageConfirmed,
        };
      }
    });

    const result = analyzePattern();

    state.method = previousState.method;
    state.panelId = previousState.panelId;
    state.absentStatus = previousState.absentStatus;
    state.panelCoverageConfirmed = previousState.panelCoverageConfirmed;
    state.expected = previousState.expected;
    state.detected = previousState.detected;
    state.absent = previousState.absent;
    state.absentMeta = previousState.absentMeta;

    return result;
  }

  function resultContains(result, patterns) {
    const text = JSON.stringify(result).toLowerCase();
    return patterns.every((pattern) => text.includes(pattern.toLowerCase()));
  }

  function runUdsGoldenCases() {
    const cases = [
      {
        id: "fentanyl_negative_generic_opiate_unverified",
        method: "immunoassay",
        panelId: "generic_opiate_immunoassay",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: false,
        expected: ["fentanyl"],
        detected: [],
        absent: ["norfentanyl"],
        mustContain: ["panel-dependent", "not verified", "fentanyl"],
      },
      {
        id: "fentanyl_not_included_even_if_checked",
        method: "immunoassay",
        panelId: "generic_opiate_immunoassay",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: true,
        expected: ["fentanyl"],
        detected: [],
        absent: ["norfentanyl"],
        mustContain: ["not included", "not clinically meaningful"],
      },
      {
        id: "oxycodone_generic_opiate_screen",
        method: "immunoassay",
        panelId: "generic_opiate_immunoassay",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: true,
        expected: ["oxycodone"],
        detected: [],
        absent: ["oxycodone"],
        mustContain: ["assay-dependent", "oxycodone"],
      },
      {
        id: "clonazepam_benzo_screen",
        method: "immunoassay",
        panelId: "benzodiazepine_immunoassay_panel",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: true,
        expected: ["clonazepam"],
        detected: [],
        absent: ["aminoclonazepam7"],
        mustContain: ["assay-dependent", "7-aminoclonazepam"],
      },
      {
        id: "hydrocodone_hydromorphone_ambiguity",
        method: "definitive",
        panelId: "targeted_definitive_panel",
        absentStatus: "unknown",
        panelCoverageConfirmed: false,
        expected: ["hydrocodone"],
        detected: ["hydromorphone"],
        absent: [],
        mustContain: ["not source-specific", "hydromorphone"],
      },
      {
        id: "thc_cooh_no_impairment",
        method: "definitive",
        panelId: "targeted_definitive_panel",
        absentStatus: "unknown",
        panelCoverageConfirmed: false,
        expected: [],
        detected: ["thc_cooh"],
        absent: [],
        mustContain: ["does not establish", "impairment"],
      },
      {
        id: "definitive_absent_user_verified",
        method: "definitive",
        panelId: "targeted_definitive_panel",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: true,
        expected: ["fentanyl"],
        detected: [],
        absent: ["norfentanyl"],
        mustContain: ["user verified", "timing", "cutoff"],
      },
      {
        id: "mixed_absent_metadata_preserved",
        method: "immunoassay",
        panelId: "generic_opiate_immunoassay",
        absentStatus: "reported_absent",
        panelCoverageConfirmed: true,
        expected: ["fentanyl", "oxycodone"],
        detected: [],
        absent: ["norfentanyl", "oxycodone"],
        absentMeta: {
          norfentanyl: {
            status: "unknown",
            panelId: "generic_opiate_immunoassay",
            panelCoverageConfirmed: false,
          },
          oxycodone: {
            status: "reported_absent",
            panelId: "generic_opiate_immunoassay",
            panelCoverageConfirmed: true,
          },
        },
        mustContain: ["norfentanyl: absent status is unknown whether tested", "oxycodone: panel coverage is assay-dependent"],
      },
    ];

    const results = cases.map((testCase) => {
      const result = getPatternResultForValidation(testCase);
      const passed = resultContains(result, testCase.mustContain);

      return {
        id: testCase.id,
        passed,
        evidence: result.evidenceLabel,
        assessment: result.assessment,
        nextStep: result.nextStep,
      };
    });

    console.table(results);

    const failed = results.filter((row) => !row.passed);
    if (failed.length) {
      console.warn("UDS golden-case validation failures:", failed);
    } else {
      console.info("All UDS golden cases passed.");
    }

    return results;
  }

  if (new URLSearchParams(window.location.search).has("udsValidation")) {
    window.runUdsGoldenCases = runUdsGoldenCases;
    const validationResults = runUdsGoldenCases();
    document.documentElement.dataset.udsGoldenCases = validationResults.every((row) => row.passed) ? "passed" : "failed";
    document.documentElement.dataset.udsGoldenCaseResults = JSON.stringify(validationResults);
    console.info("UDS validation harness loaded. Run window.runUdsGoldenCases() to repeat.");
  }

  validateUdsContent();
  render();
})();
