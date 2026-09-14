const assert = require("node:assert/strict");
const vm = require("node:vm");
const test = require("node:test");
const core = require("../public/calculator-core.js");
const { scriptText, evaluateArray } = require("./calculator-test-helpers.cjs");

function extractBetween(startMarker, endMarker) {
  const start = scriptText.indexOf(startMarker);
  const end = scriptText.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `missing source block: ${startMarker}`);
  return scriptText.slice(start, end);
}

function createHarness() {
  const control = (value) => ({
    value,
    validity: { valid: true },
    checkValidity() { return this.validity.valid; },
    setAttribute(name, value) { this[name] = value; },
  });
  const controls = {
    benzoSourceDrugSelect: control("alprazolam_po"),
    benzoSourceDoseInput: control("1"),
    benzoTargetDrugSelect: control("diazepam_po"),
    benzoReductionNumber: control("0"),
  };
  const outputs = Object.fromEntries([
    "benzoDoseValidation", "benzoResultTitle", "benzoFinalDose", "benzoFinalUnit",
    "benzoRawDiazepamEquiv", "benzoReducedDiazepamEquiv", "benzoReductionApplied",
    "benzoResultStatus",
  ].map(name => [name, { textContent: "" }]));
  const reductionValidation = extractBetween(
    "const hasValidReductionInput = ", "\nconst syncReductionControls = ",
  );
  const benzoAdapter = extractBetween(
    "const showInvalidBenzoResult = ", "\nconst updateRegimenEntryFeedback = ",
  );
  const calculate = vm.runInNewContext(
    `${reductionValidation}\n${benzoAdapter}\ncalculateBenzo;`,
    {
      ...controls,
      ...outputs,
      calculatorCore: core,
      benzoConversionOptions: evaluateArray("benzoConversionOptions"),
      formatDose: core.formatDose,
      setLiveStatus(element, message) { element.textContent = message; },
    },
  );
  return { controls, outputs, calculate };
}

function assertResult(outputs, targetLabel, dose) {
  assert.equal(outputs.benzoResultTitle.textContent, `${targetLabel} equivalent`);
  assert.equal(outputs.benzoFinalDose.textContent, dose);
  assert.equal(outputs.benzoFinalUnit.textContent, "mg/day");
  assert.equal(
    outputs.benzoResultStatus.textContent,
    `${targetLabel} estimate: ${dose} mg per day.`,
  );
}

test("benzodiazepine target swaps update visible and spoken drug/route without changing reduction", () => {
  const { controls, outputs, calculate } = createHarness();
  controls.benzoSourceDoseInput.value = "2";
  controls.benzoReductionNumber.value = "25";

  for (const [targetId, targetLabel, dose] of [
    ["diazepam_po", "Diazepam (PO)", "15"],
    ["diazepam_iv", "Diazepam (IV)", "15"],
    ["lorazepam_iv", "Lorazepam (IV)", "3"],
    ["lorazepam_po", "Lorazepam (PO)", "3"],
    ["midazolam_iv", "Midazolam (IV)", "6"],
    ["midazolam_po", "Midazolam (PO)", "18"],
  ]) {
    controls.benzoTargetDrugSelect.value = targetId;
    calculate();
    assertResult(outputs, targetLabel, dose);
    assert.equal(controls.benzoReductionNumber.value, "25");
    assert.equal(outputs.benzoReductionApplied.textContent, "25% reduction");
    assert.equal(outputs.benzoRawDiazepamEquiv.textContent, "20 mg Diazepam/day");
    assert.equal(outputs.benzoReducedDiazepamEquiv.textContent, "15 mg Diazepam/day");
  }
});

test("benzodiazepine invalid-dose recovery uses the current target without stale dose or identity", () => {
  const { controls, outputs, calculate } = createHarness();
  for (const [invalidDose, nativeValid] of [["", false], ["-1", false], ["1e308", true]]) {
    controls.benzoSourceDoseInput.value = "1";
    controls.benzoSourceDoseInput.validity.valid = true;
    controls.benzoTargetDrugSelect.value = "diazepam_po";
    calculate();
    assertResult(outputs, "Diazepam (PO)", "10");

    controls.benzoSourceDoseInput.value = invalidDose;
    controls.benzoSourceDoseInput.validity.valid = nativeValid;
    controls.benzoTargetDrugSelect.value = "midazolam_iv";
    calculate();
    assert.equal(outputs.benzoFinalDose.textContent, "—");
    assert.equal(outputs.benzoFinalUnit.textContent, "");
    assert.equal(outputs.benzoRawDiazepamEquiv.textContent, "Not available");
    assert.match(outputs.benzoResultStatus.textContent, /No dose is available/);
    assert.doesNotMatch(outputs.benzoResultStatus.textContent, /Diazepam \(PO\)/);
    assert.equal(controls.benzoSourceDoseInput["aria-invalid"], "true");

    controls.benzoSourceDoseInput.value = "0.5";
    controls.benzoSourceDoseInput.validity.valid = true;
    calculate();
    assertResult(outputs, "Midazolam (IV)", "2");
    assert.equal(controls.benzoSourceDoseInput["aria-invalid"], "false");
    assert.equal(outputs.benzoDoseValidation.textContent, "");
    assert.equal(outputs.benzoReductionApplied.textContent, "0% reduction");
  }
});

test("benzodiazepine blank-reduction recovery restores the selected route and chosen reduction", () => {
  const { controls, outputs, calculate } = createHarness();
  calculate();
  assertResult(outputs, "Diazepam (PO)", "10");

  controls.benzoReductionNumber.value = "";
  controls.benzoReductionNumber.validity.valid = false;
  controls.benzoTargetDrugSelect.value = "lorazepam_iv";
  calculate();
  assert.equal(outputs.benzoFinalDose.textContent, "—");
  assert.equal(outputs.benzoReductionApplied.textContent, "Not applied");
  assert.equal(controls.benzoReductionNumber["aria-invalid"], "true");

  controls.benzoReductionNumber.value = "50";
  controls.benzoReductionNumber.validity.valid = true;
  calculate();
  assertResult(outputs, "Lorazepam (IV)", "1");
  assert.equal(controls.benzoReductionNumber.value, "50");
  assert.equal(controls.benzoReductionNumber["aria-invalid"], "false");
  assert.equal(outputs.benzoReductionApplied.textContent, "50% reduction");
  assert.equal(outputs.benzoRawDiazepamEquiv.textContent, "10 mg Diazepam/day");
  assert.equal(outputs.benzoReducedDiazepamEquiv.textContent, "5 mg Diazepam/day");
});
