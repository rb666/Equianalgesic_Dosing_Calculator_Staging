const assert = require("node:assert/strict");
const test = require("node:test");

const core = require("../public/calculator-core.js");
const { evaluateArray } = require("./calculator-test-helpers.cjs");

const conversionOptions = evaluateArray("conversionOptions");
const benzoOptions = evaluateArray("benzoConversionOptions");
const methadoneRatioTable = evaluateArray("methadoneRatioTable");

const closeTo = (actual, expected, tolerance = 1e-10) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );

test("all configured conversion rows self-reference and round-trip", () => {
  assert.equal(conversionOptions.length, 36);
  assert.equal(new Set(conversionOptions.map((item) => item.id)).size, 36);

  for (const source of conversionOptions) {
    const entry = core.calculateRegimenEntry({
      option: source,
      dose: source.referenceDose,
      dosesPerDay: 1,
    });
    assert.equal(entry.valid, true, source.id);
    closeTo(entry.oralMorphineEquivalent, source.oralMorphineEquivalent);

    for (const target of conversionOptions.filter((item) => item.targetable)) {
      const converted = core.calculateConversion({
        oralMorphineEquivalent: entry.oralMorphineEquivalent,
        targetOption: target,
        reductionPercentage: 0,
      });
      assert.equal(converted.valid, true, `${source.id} -> ${target.id}`);
      closeTo(
        core.getCurrentOralMorphineEquivalent(target, converted.rawTargetDose),
        entry.oralMorphineEquivalent,
      );
    }
  }
});

test("mixed regimen and intentional reductions remain characterized", () => {
  const hydromorphone = conversionOptions.find((item) => item.id === "Hydromorphone_IV");
  const hydrocodone = conversionOptions.find((item) => item.id === "Hydrocodone_Oral");
  const oxycodone = conversionOptions.find((item) => item.id === "Oxycodone_Oral");
  const entries = [
    core.calculateRegimenEntry({ option: hydromorphone, dose: 1, dosesPerDay: 4 }),
    core.calculateRegimenEntry({ option: hydrocodone, dose: 10, dosesPerDay: 4 }),
  ];
  const totalOme = entries.reduce((sum, entry) => sum + entry.oralMorphineEquivalent, 0);
  const result = core.calculateConversion({
    oralMorphineEquivalent: totalOme,
    targetOption: oxycodone,
    reductionPercentage: 25,
  });

  closeTo(totalOme, 90);
  closeTo(result.rawTargetDose, 60);
  closeTo(result.adjustedTargetDose, 45);
  assert.equal(core.clampWholePercent(12.5, 100), 13);
  assert.equal(core.clampWholePercent(1000, 100), 100);
});

test("input policy distinguishes valid zero, blank, precision, and overflow", () => {
  const fentanylIv = conversionOptions.find((item) => item.id === "Fentanyl_IV");
  const patch = conversionOptions.find((item) => item.id === "Fentanyl_Patch_25");
  const hydromorphone = conversionOptions.find((item) => item.id === "Hydromorphone_IV");

  assert.equal(
    core.calculateRegimenEntry({ option: fentanylIv, dose: 0.15, dosesPerDay: 1 }).valid,
    true,
  );
  assert.equal(
    core.calculateRegimenEntry({ option: hydromorphone, dose: 0, dosesPerDay: 0 }).valid,
    true,
  );
  assert.equal(
    core.calculateRegimenEntry({ option: hydromorphone, dose: "", dosesPerDay: 1 }).valid,
    false,
  );
  assert.equal(
    core.calculateRegimenEntry({ option: hydromorphone, dose: 1, dosesPerDay: 1.5 })
      .valid,
    false,
  );
  assert.equal(
    core.calculateRegimenEntry({ option: patch, dose: 0.5, dosesPerDay: 1 }).valid,
    true,
  );
  assert.equal(
    core.calculateRegimenEntry({ option: patch, dose: 0.25, dosesPerDay: 1 }).valid,
    false,
  );
  const overflow = core.calculateRegimenEntry({
    option: hydromorphone,
    dose: 1e308,
    dosesPerDay: 2,
  });
  assert.equal(overflow.valid, false);
  assert.equal(overflow.inputsValid, true);
  assert.equal(overflow.calculationFinite, false);
  assert.equal(core.formatDose(Infinity), "—");
  assert.equal(core.formatDose(Number.NaN), "—");
  assert.equal(core.formatDose(0), "0");
});

test("specialty methadone enforces every intentional integer boundary", () => {
  const cases = [
    [0, 2], [30, 2], [31, 4], [99, 4], [100, 8], [299, 8],
    [300, 12], [499, 12], [500, 15], [999, 15], [1000, 20],
  ];

  for (const [ome, ratio] of cases) {
    const result = core.calculateMethadone({
      oralMorphineDaily: ome,
      ratioTable: methadoneRatioTable,
      reductionPercentage: 0,
      routeFactor: core.METHADONE_ROUTE_FACTORS.oral,
    });
    assert.equal(result.valid, true, String(ome));
    assert.equal(result.bracket.ratio, ratio, String(ome));
    closeTo(result.reducedMethadoneDaily, ome / ratio);
  }

  assert.equal(
    core.calculateMethadone({
      oralMorphineDaily: 99.5,
      ratioTable: methadoneRatioTable,
      reductionPercentage: 0,
      routeFactor: core.METHADONE_ROUTE_FACTORS.oral,
    }).valid,
    false,
  );
  const ivReduced = core.calculateMethadone({
    oralMorphineDaily: 100,
    ratioTable: methadoneRatioTable,
    reductionPercentage: 20,
    routeFactor: core.METHADONE_ROUTE_FACTORS.iv,
  });
  closeTo(ivReduced.rawOralMethadoneDaily, 12.5);
  closeTo(ivReduced.reducedMethadoneDaily, 5);
  closeTo(ivReduced.q8Dose, 5 / 3);
  closeTo(ivReduced.q12Dose, 2.5);
});

test("regimen totals, conservative methadone, and renal policy use pure versioned seams", () => {
  const methadone = conversionOptions.find((item) => item.id === "Methadone_Oral");
  const entries = [
    core.calculateRegimenEntry({ option: methadone, dose: 10, dosesPerDay: 1 }),
    core.calculateRegimenEntry({ option: methadone, dose: 5, dosesPerDay: 2 }),
  ];
  const total = core.sumRegimenOralMorphineEquivalent(entries);
  assert.equal(total.valid, true);
  closeTo(total.total, 94);

  const conservative = core.calculateConservativeOralMethadoneMme({
    entries,
    factor: 3,
  });
  assert.equal(conservative.valid, true);
  closeTo(conservative.total, 60);
  assert.equal(core.METHADONE_ROUTE_FACTORS.oral, 1);
  assert.equal(core.METHADONE_ROUTE_FACTORS.iv, 0.5);

  const bands = [
    ["", null],
    [-1, null],
    [0, "under30"],
    [29.9, "under30"],
    [30, "30to50"],
    [50, "30to50"],
    [50.1, "over50"],
  ];
  bands.forEach(([value, expected]) =>
    assert.equal(core.getEgfrBand(value)?.id || null, expected, String(value)),
  );
  assert.equal(core.getRenalReductionPercentage("uncontrolled"), 25);
  assert.equal(core.getRenalReductionPercentage("controlled"), 50);
  assert.equal(core.getRenalMedicationGroup("Morphine"), "restricted");
  assert.equal(core.getRenalMedicationGroup("Hydromorphone"), "cautiousAlternative");
  assert.equal(
    core.getRenalMedicationGroup("Buprenorphine"),
    "lowerKidneyEffectAlternative",
  );
  assert.equal(core.getRenalMedicationGroup("Tapentadol"), null);
});

test("all benzodiazepine pairs use one pure diazepam-base conversion", () => {
  assert.equal(benzoOptions.length, 13);
  for (const source of benzoOptions) {
    for (const target of benzoOptions) {
      const result = core.calculateBenzodiazepine({
        sourceDose: source.equiv,
        sourceEquivalent: source.equiv,
        targetEquivalent: target.equiv,
        reductionPercentage: 0,
      });
      assert.equal(result.valid, true, `${source.id} -> ${target.id}`);
      closeTo(result.rawDiazepamEquivalent, 10);
      closeTo(result.targetDose, target.equiv);
    }
  }

  const triazolam = benzoOptions.find((item) => item.id === "triazolam_po");
  const diazepam = benzoOptions.find((item) => item.id === "diazepam_po");
  closeTo(
    core.calculateBenzodiazepine({
      sourceDose: 0.25,
      sourceEquivalent: triazolam.equiv,
      targetEquivalent: diazepam.equiv,
      reductionPercentage: 0,
    }).targetDose,
    10,
  );
  assert.equal(
    core.calculateBenzodiazepine({
      sourceDose: 0,
      sourceEquivalent: 1,
      targetEquivalent: 10,
      reductionPercentage: 0,
    }).valid,
    false,
  );
});

test("organ guidance is independent, non-stacking, and avoid wins", () => {
  const range = core.calculateIndependentDoseRange({
    baseDose: 20,
    minimumReduction: 25,
    maximumReduction: 50,
  });
  assert.deepEqual(
    { minimumDose: range.minimumDose, maximumDose: range.maximumDose },
    { minimumDose: 10, maximumDose: 15 },
  );

  const ordinary = core.resolveOrganPresentation({
    renalAdvice: { resultLabel: "10 mg/day" },
    hepaticAdvice: { resultLabel: "8-12 mg/day" },
  });
  assert.equal(ordinary.avoidTarget, false);
  assert.equal(ordinary.combinedDose, null);

  const avoid = core.resolveOrganPresentation({
    renalAdvice: { avoidTarget: true },
    hepaticAdvice: { resultLabel: "8-12 mg/day" },
  });
  assert.equal(avoid.avoidTarget, true);
  assert.equal(avoid.combinedDose, null);
  assert.match(avoid.compositionPolicy, /independent/i);
});
