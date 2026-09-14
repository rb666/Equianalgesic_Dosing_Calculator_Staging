const assert = require("node:assert/strict");
const test = require("node:test");
const vm = require("node:vm");
const { evaluateArray, scriptText } = require("./calculator-test-helpers.cjs");
require("../public/calculator-provenance.js");
const manifest = global.CALCULATOR_PROVENANCE;

const renderProfileCards = (rows) => {
  const grid = { innerHTML: "" };
  const picker = { innerHTML: "", value: "" };
  const renderer = scriptText.slice(
    scriptText.indexOf("const formatGraphTime ="),
    scriptText.indexOf("const renderSelectedPharmacokineticsDetail ="),
  );

  vm.runInNewContext(`${renderer}\nrenderPharmacokineticsGraphs();`, {
    pharmacokineticsRows: rows,
    pharmacokineticsGraphGrid: grid,
    pharmacokineticsProfileSelect: picker,
    selectedPharmacokineticsIndex: 0,
    formatDose: String,
  });

  return { cards: grid.innerHTML.match(/<button[\s\S]*?<\/button>/g), picker };
};

for (const { drug, imPeakMinutes, oralPeakHours } of [
  { drug: "Codeine", imPeakMinutes: 30, oralPeakHours: 1 },
  { drug: "Tramadol", imPeakMinutes: 45, oralPeakHours: 2 },
]) {
  test(`PK cards do not present the IM ${drug.toLowerCase()} peak as an IV concentration curve`, () => {
    const rows = evaluateArray("pharmacokineticsRows");
    const intravenousName = `${drug} IV`;
    const oralName = `${drug} oral (IR)`;
    const { cards: [intravenousCard, oralCard], picker } = renderProfileCards(
      rows.filter((row) =>
        [intravenousName, oralName].includes(row.name),
      ),
    );

    assert.ok(intravenousCard.includes(intravenousName));
    assert.match(intravenousCard, /Half-life reference/);
    assert.ok(intravenousCard.includes(rows.find((row) => row.name === intravenousName).halfLife));
    assert.match(intravenousCard, /Why no curve\?/);
    assert.ok(intravenousCard.includes(
      `${imPeakMinutes}-minute peak applies to IM administration, not IV use`,
    ));
    assert.doesNotMatch(intravenousCard, /<svg|Peak:|Graph unavailable|aria-hidden="true"/);
    assert.ok(oralCard.includes(oralName));
    assert.match(oralCard, /<svg/);
    assert.ok(oralCard.includes(`Peak: ~${oralPeakHours} h`));
    assert.equal(picker.value, "0");
    assert.ok(picker.innerHTML.includes(`<option value="0">${intravenousName}</option>`));
    assert.ok(picker.innerHTML.includes(`<option value="1">${oralName}</option>`));
  });
}

test("every unplotted PK profile provides complete reference text while supported profiles keep their graphs", () => {
  const rows = evaluateArray("pharmacokineticsRows");
  const { cards } = renderProfileCards(rows);
  assert.equal(cards.length, rows.length);
  assert.deepEqual(
    Array.from(rows.filter((row) => row.profile.available === false), (row) => row.name),
    ["Codeine IV", "Morphine oral (ER)", "Tramadol IV"],
  );

  rows.forEach((row, index) => {
    const card = cards[index];
    assert.ok(card.includes(row.name), `Missing profile name: ${row.name}`);
    assert.match(card, new RegExp(`data-pk-index="${index}"`));

    if (row.profile.available === false) {
      const readableText = card.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      assert.ok(readableText.includes(row.halfLife), `Incomplete half-life reference: ${row.name}`);
      assert.ok(readableText.includes(row.profile.unavailableReason), `Missing evidence limitation: ${row.name}`);
      assert.doesNotMatch(card, /<svg|pk-profile-unavailable|Graph unavailable|Numeric profile not plotted/);
      assert.doesNotMatch(card, /aria-hidden="true"|\bhidden(?:\s|=|>)/);
    } else {
      assert.match(card, /<svg[\s\S]*<polyline/);
      assert.match(card, /(?:Steady\/peak|Peak): ~/);
      assert.doesNotMatch(card, /pk-reference-summary|Why no curve\?|NaN|Infinity|undefined/);
    }
  });

  const morphineCard = cards[rows.findIndex((row) => row.name === "Morphine oral (ER)")];
  assert.match(morphineCard, /effective morphine half-life of 2-4 hours/);
  assert.match(morphineCard, /longer terminal phase of about 15 hours/);
  assert.match(morphineCard, /8-12 hour dosing interval is not presented as a formulation half-life/);
});

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
