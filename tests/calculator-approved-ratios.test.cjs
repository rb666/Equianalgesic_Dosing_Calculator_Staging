const assert = require("node:assert/strict");
const test = require("node:test");
const baseline = require("./fixtures/approved-clinical-tables.json");
const { evaluateArray, scriptText } = require("./calculator-test-helpers.cjs");

test("committee-approved conversion ratios and existing dosing tables remain unchanged", () => {
  require("../public/calculator-provenance.js");
  assert.equal(global.CALCULATOR_PROVENANCE.conversionRatioApproval.status, "approved-user-attested");
  for (const [name, expected] of Object.entries(baseline.tables)) {
    const actual = JSON.parse(JSON.stringify(evaluateArray(name), (_, value) => value === Infinity ? "Infinity" : value));
    assert.deepEqual(actual, expected, `${name} differs from production ${baseline.productionCommit}`);
  }
  for (const [name, expected] of Object.entries(baseline.constants)) {
    assert.equal(scriptText.match(new RegExp(`const ${name} = [^;]+;`))?.[0], expected, name);
  }
});

test("OxyContin PK discrepancy is corrected independently of conversion ratios", () => {
  const row = evaluateArray("pharmacokineticsRows").find(row => row.name === "Oxycodone oral (ER)");
  assert.equal(row.profile.halfLifeHours, 4.5);
  assert.match(row.halfLife, /OxyContin.*4\.5 hours/);
  assert.match(row.behavior, /24-36 hours/);
});
