(function initializeCalculatorCore(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.CalculatorCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  "use strict";

  const deepFreeze = (value) => {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
      return value;
    }

    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  };

  const POLICY = deepFreeze({
    zeroDose:
      "Main opioid-regimen doses and frequencies may be zero; valid zero is distinct from unavailable output.",
    specialtyZero:
      "Methadone OME may be zero. Benzodiazepine source dose must be greater than zero.",
    maximumInput:
      "No clinically approved maximum is encoded. All inputs and arithmetic results must remain finite.",
    organComposition:
      "Renal and hepatic guidance are independent outputs and are never automatically stacked.",
  });

  const RENAL_POLICY = deepFreeze({
    thresholds: {
      standardMinimumExclusive: 50,
      moderateMinimumInclusive: 30,
    },
    reductions: {
      uncontrolled: 25,
      controlled: 50,
    },
    medicationGroups: {
      restricted: ["Morphine", "Codeine", "Meperidine"],
      cautiousAlternative: ["Oxycodone", "Hydromorphone"],
      lowerKidneyEffectAlternative: ["Methadone", "Fentanyl", "Buprenorphine"],
    },
  });

  const METHADONE_ROUTE_FACTORS = deepFreeze({
    oral: 1,
    iv: 0.5,
  });

  const formatDose = (value) => {
    if (!Number.isFinite(value)) {
      return "—";
    }

    if (value >= 100) {
      return value.toFixed(0);
    }

    if (value >= 10) {
      return value.toFixed(1).replace(/\.0$/, "");
    }

    return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  };

  const formatDoseRange = (minimum, maximum, unitLabel) => {
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
      return "Not available";
    }

    if (Math.abs(minimum - maximum) < 0.0001) {
      return `${formatDose(minimum)} ${unitLabel}`;
    }

    return `${formatDose(minimum)}-${formatDose(maximum)} ${unitLabel}`;
  };

  const clampWholePercent = (value, maximum) =>
    Math.min(maximum, Math.max(0, Math.round(Number(value) || 0)));

  const isStepAligned = (value, step) => {
    const scaledValue = value / step;

    return (
      Number.isFinite(scaledValue) &&
      Math.abs(scaledValue - Math.round(scaledValue)) <=
        Number.EPSILON * Math.max(1, Math.abs(scaledValue)) * 8
    );
  };

  const getCurrentOralMorphineEquivalent = (option, currentDose) =>
    (currentDose / option.referenceDose) * option.oralMorphineEquivalent;

  const getTargetDose = (targetOption, oralMorphineEquivalent) =>
    (oralMorphineEquivalent / targetOption.oralMorphineEquivalent) *
    targetOption.referenceDose;

  const getEgfrBand = (rawValue) => {
    const value = Number(rawValue);

    if (String(rawValue ?? "").trim() === "" || !Number.isFinite(value) || value < 0) {
      return null;
    }

    if (value > RENAL_POLICY.thresholds.standardMinimumExclusive) {
      return Object.freeze({ id: "over50", label: "eGFR >50 mL/min" });
    }

    if (value >= RENAL_POLICY.thresholds.moderateMinimumInclusive) {
      return Object.freeze({ id: "30to50", label: "eGFR 30-50 mL/min" });
    }

    return Object.freeze({ id: "under30", label: "eGFR <30 mL/min" });
  };

  const getRenalMedicationGroup = (medication) => {
    const match = Object.entries(RENAL_POLICY.medicationGroups).find(([, medications]) =>
      medications.includes(medication),
    );

    return match?.[0] || null;
  };

  const getRenalReductionPercentage = (painControl) =>
    RENAL_POLICY.reductions[painControl] ?? null;

  const calculateRegimenEntry = ({ option, dose, dosesPerDay }) => {
    const patchOption = option?.doseUnit === "patch";
    const doseText = String(dose ?? "");
    const frequencyText = String(dosesPerDay ?? "");
    const doseValue = Number(doseText);
    const frequencyValue = patchOption ? 1 : Number(frequencyText);
    const doseMissing = doseText.trim() === "";
    const frequencyMissing = !patchOption && frequencyText.trim() === "";
    const doseInputValid =
      Boolean(option) &&
      !doseMissing &&
      Number.isFinite(doseValue) &&
      doseValue >= 0 &&
      (!patchOption || isStepAligned(doseValue, 0.5));
    const frequencyInputValid =
      Boolean(option) &&
      (patchOption ||
        (!frequencyMissing &&
          Number.isFinite(frequencyValue) &&
          frequencyValue >= 0 &&
          Number.isInteger(frequencyValue)));
    const inputsValid = doseInputValid && frequencyInputValid;
    const dailyDose = inputsValid
      ? patchOption
        ? doseValue
        : doseValue * frequencyValue
      : Number.NaN;
    const oralMorphineEquivalent = inputsValid
      ? getCurrentOralMorphineEquivalent(option, dailyDose)
      : Number.NaN;
    const calculationFinite =
      Number.isFinite(dailyDose) && Number.isFinite(oralMorphineEquivalent);

    return Object.freeze({
      option,
      patchOption,
      doseValue,
      frequencyValue,
      doseInputValid,
      frequencyInputValid,
      inputsValid,
      calculationFinite,
      valid: inputsValid && calculationFinite,
      dailyDose,
      oralMorphineEquivalent,
    });
  };

  const calculateConversion = ({
    oralMorphineEquivalent,
    targetOption,
    reductionPercentage,
  }) => {
    if (
      !targetOption ||
      !Number.isFinite(oralMorphineEquivalent) ||
      oralMorphineEquivalent < 0
    ) {
      return Object.freeze({ valid: false, reason: "invalid-input" });
    }

    const normalizedReduction = clampWholePercent(reductionPercentage, 100);
    const rawTargetDose = getTargetDose(targetOption, oralMorphineEquivalent);
    const adjustedTargetDose = rawTargetDose * (1 - normalizedReduction / 100);

    if (!Number.isFinite(rawTargetDose) || !Number.isFinite(adjustedTargetDose)) {
      return Object.freeze({ valid: false, reason: "out-of-range" });
    }

    return Object.freeze({
      valid: true,
      reductionPercentage: normalizedReduction,
      rawTargetDose,
      adjustedTargetDose,
    });
  };

  const sumRegimenOralMorphineEquivalent = (entries) => {
    if (
      !Array.isArray(entries) ||
      !entries.length ||
      entries.some(
        (entry) => !entry?.valid || !Number.isFinite(entry.oralMorphineEquivalent),
      )
    ) {
      return Object.freeze({ valid: false, reason: "invalid-entry" });
    }

    const total = entries.reduce(
      (sum, entry) => sum + entry.oralMorphineEquivalent,
      0,
    );

    return Number.isFinite(total)
      ? Object.freeze({ valid: true, total })
      : Object.freeze({ valid: false, reason: "out-of-range" });
  };

  const calculateConservativeOralMethadoneMme = ({ entries, factor }) => {
    if (
      !Array.isArray(entries) ||
      !entries.length ||
      !Number.isFinite(factor) ||
      factor <= 0 ||
      entries.some(
        (entry) =>
          !entry?.valid ||
          entry.option?.id !== "Methadone_Oral" ||
          !Number.isFinite(entry.dailyDose),
      )
    ) {
      return Object.freeze({ valid: false, reason: "invalid-entry" });
    }

    const total = entries.reduce(
      (sum, entry) => sum + entry.dailyDose * factor,
      0,
    );

    return Number.isFinite(total)
      ? Object.freeze({ valid: true, total })
      : Object.freeze({ valid: false, reason: "out-of-range" });
  };

  const getMethadoneBracket = (oralMorphineDaily, ratioTable) =>
    ratioTable.find((item) => oralMorphineDaily <= item.max) ||
    ratioTable[ratioTable.length - 1];

  const calculateMethadone = ({
    oralMorphineDaily,
    ratioTable,
    reductionPercentage,
    routeFactor,
  }) => {
    if (
      !Number.isFinite(oralMorphineDaily) ||
      oralMorphineDaily < 0 ||
      !Number.isInteger(oralMorphineDaily) ||
      !Array.isArray(ratioTable) ||
      !ratioTable.length ||
      !Number.isFinite(routeFactor) ||
      routeFactor <= 0
    ) {
      return Object.freeze({ valid: false, reason: "invalid-input" });
    }

    const bracket = getMethadoneBracket(oralMorphineDaily, ratioTable);
    const normalizedReduction = clampWholePercent(reductionPercentage, 90);
    const rawOralMethadoneDaily = oralMorphineDaily / bracket.ratio;
    const reducedOralMethadoneDaily =
      rawOralMethadoneDaily * (1 - normalizedReduction / 100);
    const reducedMethadoneDaily = reducedOralMethadoneDaily * routeFactor;
    const q8Dose = reducedMethadoneDaily / 3;
    const q12Dose = reducedMethadoneDaily / 2;
    const values = [
      rawOralMethadoneDaily,
      reducedOralMethadoneDaily,
      reducedMethadoneDaily,
      q8Dose,
      q12Dose,
    ];

    if (!values.every(Number.isFinite)) {
      return Object.freeze({ valid: false, reason: "out-of-range" });
    }

    return Object.freeze({
      valid: true,
      bracket,
      reductionPercentage: normalizedReduction,
      rawOralMethadoneDaily,
      reducedOralMethadoneDaily,
      reducedMethadoneDaily,
      q8Dose,
      q12Dose,
    });
  };

  const calculateBenzodiazepine = ({
    sourceDose,
    sourceEquivalent,
    targetEquivalent,
    reductionPercentage,
  }) => {
    if (
      !Number.isFinite(sourceDose) ||
      sourceDose <= 0 ||
      !Number.isFinite(sourceEquivalent) ||
      sourceEquivalent <= 0 ||
      !Number.isFinite(targetEquivalent) ||
      targetEquivalent <= 0
    ) {
      return Object.freeze({ valid: false, reason: "invalid-input" });
    }

    const normalizedReduction = clampWholePercent(reductionPercentage, 50);
    const rawDiazepamEquivalent = (sourceDose / sourceEquivalent) * 10;
    const reducedDiazepamEquivalent =
      rawDiazepamEquivalent * (1 - normalizedReduction / 100);
    const targetDose = (reducedDiazepamEquivalent / 10) * targetEquivalent;

    if (
      ![rawDiazepamEquivalent, reducedDiazepamEquivalent, targetDose].every(
        Number.isFinite,
      )
    ) {
      return Object.freeze({ valid: false, reason: "out-of-range" });
    }

    return Object.freeze({
      valid: true,
      reductionPercentage: normalizedReduction,
      rawDiazepamEquivalent,
      reducedDiazepamEquivalent,
      targetDose,
    });
  };

  const calculateIndependentDoseRange = ({
    baseDose,
    minimumReduction,
    maximumReduction,
  }) => {
    const minimumDose = baseDose * (1 - maximumReduction / 100);
    const maximumDose = baseDose * (1 - minimumReduction / 100);

    return Object.freeze({
      valid: Number.isFinite(minimumDose) && Number.isFinite(maximumDose),
      minimumDose,
      maximumDose,
    });
  };

  const resolveOrganPresentation = ({ renalAdvice, hepaticAdvice }) => {
    const avoidTarget = Boolean(renalAdvice?.avoidTarget || hepaticAdvice?.avoidTarget);

    return Object.freeze({
      avoidTarget,
      combinedDose: null,
      compositionPolicy: POLICY.organComposition,
    });
  };

  return Object.freeze({
    METHADONE_ROUTE_FACTORS,
    POLICY,
    RENAL_POLICY,
    calculateBenzodiazepine,
    calculateConservativeOralMethadoneMme,
    calculateConversion,
    calculateIndependentDoseRange,
    calculateMethadone,
    calculateRegimenEntry,
    clampWholePercent,
    formatDose,
    formatDoseRange,
    getCurrentOralMorphineEquivalent,
    getEgfrBand,
    getMethadoneBracket,
    getRenalMedicationGroup,
    getRenalReductionPercentage,
    getTargetDose,
    isStepAligned,
    resolveOrganPresentation,
    sumRegimenOralMorphineEquivalent,
  });
});
