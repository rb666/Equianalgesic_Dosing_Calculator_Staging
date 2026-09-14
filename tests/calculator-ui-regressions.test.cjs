const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const core = require("../public/calculator-core.js");
const {scriptText, evaluateArray} = require("./calculator-test-helpers.cjs");

test("clearing a reduction keeps an invalid draft instead of selecting zero", () => {
  const start = scriptText.indexOf("const hasValidReductionInput = ");
  const end = scriptText.indexOf("\nconst syncReduction = ", start);
  const {sync, valid} = vm.runInNewContext(scriptText.slice(start, end) +
    ";({sync: syncReductionControls, valid: hasValidReductionInput});", {calculatorCore: core});
  for (const maximum of [100, 90, 50]) {
    const range = {value: "25"};
    const number = {value: "", validity: {valid: false},
      setAttribute(name, value) { this[name] = value; }};
    sync(number, range, number, maximum);
    assert.equal(number.value, "");
    assert.equal(range.value, "25");
    assert.equal(valid(number), false);
    assert.equal(number["aria-invalid"], "true");
    number.value = "0";
    number.validity.valid = true;
    assert.equal(valid(number), true);
    sync(number, range, number, maximum);
    assert.equal(Number(range.value), 0);
    assert.equal(number["aria-invalid"], "false");
  }
});

test("rebuilding regimen fields preserves cleared inputs and actual zero", () => {
  const start = scriptText.indexOf("const buildRegimenEntryMarkup = ");
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start);
  const options = evaluateArray("conversionOptions");
  const findOption = id => options.find(option => option.id === id);
  const render = vm.runInNewContext(scriptText.slice(start, end) + ";buildRegimenEntryMarkup;", {
    findOption, isPatchOption: option => option.doseUnit === "patch",
    getRegimenEntryCalculation: entry => core.calculateRegimenEntry({
      option: findOption(entry.drugId), dose: entry.dose, dosesPerDay: entry.dosesPerDay,
    }),
    regimenEntriesState: [{key: 1}, {key: 2}], conversionOptions: options,
    sortOptionsForSelect: rows => rows, optionMarkup: () => "",
    getEntryDoseLabel: () => "Dose", getEntryDoseHint: () => "",
    getEntryFrequencyLabel: () => "Frequency", getEntryFrequencyHint: () => "",
    getEntrySummaryText: () => "",
  });
  const patch = options.find(option => option.doseUnit === "patch");
  for (const drugId of ["Hydromorphone_IV", patch.id]) {
    for (const dose of ["", "0", "2"]) {
      const markup = render({key: 1, drugId, dose, dosesPerDay: ""}, 0);
      const inputs = [...markup.matchAll(/<input\b[\s\S]*?\/>/g)].map(match => match[0]);
      assert.equal(inputs.length, 2);
      assert.match(inputs[0], new RegExp(`value="${dose}"`));
      assert.match(inputs[0], new RegExp(`aria-invalid="${dose === ""}"`));
      assert.match(inputs[1], new RegExp(`value="${drugId === patch.id ? "1" : ""}"`));
    }
  }
});

test("regimen summary distinguishes blank, invalid, and actual zero values", () => {
  const start = scriptText.indexOf("const renderRegimenSummaryTable = ");
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start);
  const target = {innerHTML: ""};
  const render = vm.runInNewContext(scriptText.slice(start, end) + ";renderRegimenSummaryTable;", {
    regimenSummaryTable: target, formatDose: core.formatDose,
  });
  const option = evaluateArray("conversionOptions").find(row => row.id === "Hydromorphone_IV");
  for (const [dose, frequency, expected] of [["", "4", "Dose unavailable"], ["2", "", "Frequency unavailable"], ["-1", "4", "Dose unavailable"], ["2", "1.5", "Frequency unavailable"]]) {
    render([core.calculateRegimenEntry({option, dose, dosesPerDay: frequency})]);
    assert.match(target.innerHTML, new RegExp(expected));
    assert.doesNotMatch(target.innerHTML, /OME: 0 mg/);
  }
  render([core.calculateRegimenEntry({option, dose: "0", dosesPerDay: "4"})]);
  assert.match(target.innerHTML, /OME: 0 mg/);
  assert.doesNotMatch(target.innerHTML, /unavailable/);
});
