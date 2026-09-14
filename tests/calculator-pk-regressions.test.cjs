const assert = require("node:assert/strict");
const test = require("node:test");
const vm = require("node:vm");
const { evaluateArray, scriptText } = require("./calculator-test-helpers.cjs");
require("../public/calculator-provenance.js");
const manifest = global.CALCULATOR_PROVENANCE;

for (const { drug, imPeakMinutes, oralPeakHours } of [
  { drug: "Codeine", imPeakMinutes: 30, oralPeakHours: 1 },
  { drug: "Tramadol", imPeakMinutes: 45, oralPeakHours: 2 },
]) {
  test(`PK cards do not present the IM ${drug.toLowerCase()} peak as an IV concentration curve`, () => {
    const rows = evaluateArray("pharmacokineticsRows");
    const intravenousName = `${drug} IV`;
    const oralName = `${drug} oral (IR)`;
    const grid = { innerHTML: "" };
    const picker = { innerHTML: "", value: "" };
    const renderer = scriptText.slice(
      scriptText.indexOf("const formatGraphTime ="),
      scriptText.indexOf("const renderSelectedPharmacokineticsDetail ="),
    );

    vm.runInNewContext(`${renderer}\nrenderPharmacokineticsGraphs();`, {
      pharmacokineticsRows: rows.filter((row) =>
        [intravenousName, oralName].includes(row.name),
      ),
      pharmacokineticsGraphGrid: grid,
      pharmacokineticsProfileSelect: picker,
      selectedPharmacokineticsIndex: 0,
      formatDose: String,
    });

    const [intravenousCard, oralCard] = grid.innerHTML.match(/<button[\s\S]*?<\/button>/g);
    assert.ok(intravenousCard.includes(intravenousName));
    assert.match(intravenousCard, /Numeric profile not plotted/);
    assert.ok(intravenousCard.includes(
      `${imPeakMinutes}-minute peak applies to IM administration, not IV use`,
    ));
    assert.doesNotMatch(intravenousCard, /<svg|Peak:/);
    assert.ok(oralCard.includes(oralName));
    assert.match(oralCard, /<svg/);
    assert.ok(oralCard.includes(`Peak: ~${oralPeakHours} h`));
    assert.equal(picker.value, "0");
    assert.ok(picker.innerHTML.includes(`<option value="0">${intravenousName}</option>`));
    assert.ok(picker.innerHTML.includes(`<option value="1">${oralName}</option>`));
  });
}

test("tapentadol IR interaction guidance preserves the MAOI exclusion and serotonin warning", () => {
  const row = evaluateArray("pharmacokineticsRows").find(
    (item) => item.name === "Tapentadol oral (IR)",
  );
  assert.match(row.interactions, /Contraindicated[\s\S]*MAOI[\s\S]*14 days/i);
  assert.match(row.interactions, /SSRIs[\s\S]*serotonin syndrome/i);
  assert.doesNotMatch(row.interactions, /or use extreme caution with MAO/i);
});

test("visible source references include both transition products and exclude retired drug-testing tools", () => {
  const sources = evaluateArray("sourceReferences");
  for (const id of ["dailymed-belbuca", "dailymed-suboxone"]) {
    const source = sources.find((item) => item.url === manifest.sources[id].displayUrl);
    assert.ok(source, `Missing visible ${id} product-label source`);
    assert.match(source.note, /differ[\s\S]*label's initiation instructions/);
  }
  assert.doesNotMatch(JSON.stringify(sources), /\bUDS\b|Urine Drug Tests|ARUP Consult/);
});
