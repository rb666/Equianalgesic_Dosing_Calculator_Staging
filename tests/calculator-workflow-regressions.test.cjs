const assert = require("node:assert/strict");
const vm = require("node:vm");
const test = require("node:test");
const core = require("../public/calculator-core.js");
const { scriptText, evaluateArray } = require("./calculator-test-helpers.cjs");

const options = evaluateArray("conversionOptions");
const findOption = (id) => options.find((option) => option.id === id);
const parseEntry = (entry) => core.calculateRegimenEntry({
  option: findOption(entry.drugId), dose: entry.dose, dosesPerDay: entry.dosesPerDay,
});

function definition(name) {
  const start = scriptText.indexOf(`const ${name} = `);
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start, `missing ${name}`);
  return scriptText.slice(start, end);
}

function load(name, context) {
  return vm.runInNewContext(`${definition(name)}; ${name};`, context);
}

test("new regimen rows remain incomplete until patient doses are entered", () => {
  const create = load("createRegimenEntry", { regimenEntryId: 0 });
  const existing = create({ drugId: "Morphine_Oral", dose: "10", dosesPerDay: "3" });
  const added = create();
  assert.equal(added.dose, "");
  assert.equal(added.dosesPerDay, "");
  assert.equal(parseEntry(added).valid, false);
  assert.equal(core.sumRegimenOralMorphineEquivalent([parseEntry(existing), parseEntry(added)]).valid, false);

  // Explicit patient values and load-example values still calculate normally.
  const zero = create({ dose: "0", dosesPerDay: "1" });
  assert.equal(parseEntry(zero).oralMorphineEquivalent, 0);
  assert.equal(parseEntry(existing).oralMorphineEquivalent, 30);
  added.dose = "1";
  added.dosesPerDay = "4";
  assert.equal(core.sumRegimenOralMorphineEquivalent([parseEntry(existing), parseEntry(added)]).total, 80);
});

test("changing source drug or route clears patient dose instead of substituting reference doses", () => {
  for (const selectedId of ["Morphine_Oral_ER", "Fentanyl_Patch_25"]) {
    const entry = { key: 7, drugId: "Morphine_Oral", dose: "15", dosesPerDay: "4" };
    let recalculated = false;
    const change = load("handleRegimenEntryInput", {
      regimenEntriesState: [entry], findOption,
      isPatchOption: (option) => option.doseUnit === "patch",
      renderRegimenEntries() {},
      calculate() { recalculated = true; },
    });
    change({ target: {
      value: selectedId, dataset: { field: "drugId" },
      closest: () => ({ dataset: { entryKey: "7" } }),
    } });
    assert.equal(entry.drugId, selectedId);
    assert.equal(entry.dose, "");
    assert.equal(entry.dosesPerDay, selectedId === "Fentanyl_Patch_25" ? "1" : "");
    assert.equal(parseEntry(entry).valid, false);
    assert.equal(recalculated, true);
  }
});

test("an invalidated methadone target stays unselected until the clinician chooses again", () => {
  const target = { value: "Methadone_IV", innerHTML: "" };
  const entries = [{ drugId: "Methadone_Oral" }];
  const render = load("renderTargetOptions", {
    targetDrugSelect: target, regimenEntriesState: entries,
    conversionOptions: options, findOption,
    isMethadoneOption: (option) => option?.medication === "Methadone",
    sortOptionsForSelect: (rows) => rows,
    optionMarkup: (option) => `<option value="${option.id}">${option.label}</option>`,
  });
  render();
  assert.equal(target.value, "Methadone_IV");
  entries.push({ drugId: "Hydromorphone_IV" });
  render();
  assert.equal(target.value, "");
  assert.match(target.innerHTML, /<option value="">Select target drug and route<\/option>/);
  entries.pop();
  render();
  assert.equal(target.value, "");
  render("Methadone_IV");
  assert.equal(target.value, "Methadone_IV");
  render("Oxycodone_Oral");
  assert.equal(target.value, "Oxycodone_Oral");
});

function mainCalculatorContext() {
  const element = () => ({
    textContent: "", value: "", classList: { add() {}, remove() {} },
    setAttribute(name, value) { this[name] = value; },
  });
  const context = {
    calculatorCore: core, findOption, clampReduction: (value) => core.clampWholePercent(value, 100),
    formatDose: core.formatDose, setModeVisibility() {}, updateRenalBandNote() {},
    hasValidReductionInput: () => true,
    parseRegimenEntries: () => [parseEntry({ drugId: "Morphine_Oral", dose: "10", dosesPerDay: "3" })],
    renderRegimenSummaryTable() {}, setHiddenState() {}, setLiveStatus() {},
    getRenalAdvice: () => ({ summary: "Renal guidance off" }),
    getHepaticAdvice: () => ({ summary: "Hepatic guidance off" }),
    isOralMethadoneOnlyRegimen: () => false,
    egfrInput: { validity: { valid: false } },
    calculationModeSelect: { value: "mme" }, reductionNumber: { value: "0" },
  };
  for (const name of [
    "targetDrugSelect", "renalBandNote", "finalDose", "finalUnit", "resultTitle", "resultQualifier",
    "mainResultPanel", "methadoneConservativeMme", "targetStepLabel", "rawTargetDoseOutput",
    "reductionAppliedOutput", "reductionStep", "safetyAdjustedDoseOutput", "safetyAdjustedStep",
    "renalAdjustedDoseOutput", "hepaticAdjustedDoseOutput", "organGuidanceSummaryOutput",
    "renalAdviceTitle", "renalAdviceBody", "hepaticAdviceTitle", "hepaticAdviceBody", "conversionResultStatus",
  ]) context[name] = element();
  context.targetDrugSelect.value = "Oxycodone_Oral";
  context.renalBandNote.textContent = "Enter a valid eGFR.";
  return context;
}

test("Total MME ignores hidden invalid kidney input; Conversion still requires correction", () => {
  const context = mainCalculatorContext();
  const calculate = vm.runInNewContext(
    `${definition("showInvalidRegimen")}\n${definition("calculate")}; calculate;`, context,
  );
  calculate();
  assert.equal(context.finalDose.textContent, "30");
  assert.equal(context.finalUnit.textContent, "mg MME/day");
  context.calculationModeSelect.value = "convert";
  calculate();
  assert.equal(context.finalDose.textContent, "—");
  assert.equal(context.resultTitle.textContent, "Check kidney function input");
});

test("a valid regimen with no selected target cannot produce a conversion", () => {
  const context = mainCalculatorContext();
  context.calculationModeSelect.value = "convert";
  context.egfrInput.validity.valid = true;
  context.targetDrugSelect.value = "";
  const calculate = vm.runInNewContext(
    `${definition("showInvalidRegimen")}\n${definition("calculate")}; calculate;`, context,
  );
  calculate();
  assert.equal(context.finalDose.textContent, "—");
  assert.equal(context.resultTitle.textContent, "Choose a target drug and route");
  assert.equal(context.targetDrugSelect["aria-invalid"], "true");
});
