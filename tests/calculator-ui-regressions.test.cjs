const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const core = require("../public/calculator-core.js");
const {scriptText, evaluateArray} = require("./calculator-test-helpers.cjs");

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
