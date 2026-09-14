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

const attributes = (tag) => Object.fromEntries(
  Array.from(tag.matchAll(/([\w:-]+)="([^"]*)"/g), ([, name, value]) => [name, value]),
);

const elements = (markup, tag, className) =>
  Array.from(markup.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g")), ([match]) => attributes(match))
    .filter((element) => !className || element.class?.split(/\s+/).includes(className));

const points = (element) => element.points.trim().split(/\s+/).map((point) => point.split(",").map(Number));

const closeTo = (actual, expected, context) => {
  assert.ok(Math.abs(actual - expected) < 1e-8, `${context}: expected ${expected}, received ${actual}`);
};

for (const { drug, imPeakMinutes, oralPeakHours, halfLifeHours } of [
  { drug: "Codeine", imPeakMinutes: 30, oralPeakHours: 1, halfLifeHours: 4 },
  { drug: "Tramadol", imPeakMinutes: 45, oralPeakHours: 2, halfLifeHours: 6 },
]) {
  test(`${drug} IV shows terminal elimination with correct half-decay and no borrowed IM peak`, () => {
    const rows = evaluateArray("pharmacokineticsRows");
    const intravenousName = `${drug} IV`;
    const oralName = `${drug} oral (IR)`;
    const intravenousRow = rows.find((row) => row.name === intravenousName);
    const { cards: [intravenousCard, oralCard], picker } = renderProfileCards(
      rows.filter((row) =>
        [intravenousName, oralName].includes(row.name),
      ),
    );

    assert.ok(intravenousCard.includes(intravenousName));
    assert.equal(intravenousRow.profile.available, false);
    assert.equal(intravenousRow.profile.peakHours, null);
    assert.equal(intravenousRow.profile.referenceGraph.halfLifeHours, halfLifeHours);
    assert.ok(intravenousRow.profile.unavailableReason.includes(
      `${imPeakMinutes}-minute peak applies to IM administration, not IV use`,
    ));
    assert.match(intravenousCard, /Terminal elimination only/);
    assert.match(intravenousCard, /Relative parent-drug level/);
    assert.match(intravenousCard, /100% = reference level within the terminal phase, not an injection peak/);
    assert.match(intravenousCard, /Excludes[\s\S]*distribution/);
    assert.ok(intravenousCard.includes(`Model half-life: ~${halfLifeHours} h`));
    assert.ok(intravenousCard.includes(`>${halfLifeHours * 4} h</text>`));
    assert.doesNotMatch(intravenousCard, /Peak:|Graph unavailable/);

    const curve = points(elements(intravenousCard, "polyline", "pk-profile-line")[0]);
    const axes = elements(intravenousCard, "line", "pk-axis");
    const horizontal = axes.find((axis) => axis.y1 === axis.y2);
    const vertical = axes.find((axis) => axis.x1 === axis.x2);
    const bottom = Number(horizontal.y1);
    const top = Number(vertical.y1);
    const left = Number(horizontal.x1);
    const right = Number(horizontal.x2);
    assert.equal(curve.length, 61);
    [1, 0.5, 0.25, 0.125, 0.0625].forEach((expectedFraction, halfLivesElapsed) => {
      const [x, y] = curve[halfLivesElapsed * 15];
      closeTo((x - left) / (right - left), halfLivesElapsed / 4, `${drug}: half-life time position`);
      closeTo((bottom - y) / (bottom - top), expectedFraction, `${drug}: remaining parent-drug fraction`);
    });
    curve.slice(1).forEach(([x, y], index) => {
      assert.ok(x > curve[index][0] && y > curve[index][1], `${drug}: terminal curve must fall without an absorption peak`);
    });
    const halfMarker = elements(intravenousCard, "line", "pk-marker")[0];
    closeTo(Number(halfMarker.y1), (top + bottom) / 2, `${drug}: 50% guide`);

    if (drug === "Codeine") {
      assert.match(intravenousCard, /healthy-volunteer IV study \(n=6\)/);
      assert.match(intravenousCard, /active morphine/);
      assert.match(intravenousCard, /IV codeine remains a caution row/);
      assert.match(intravenousRow.behavior, /Avoid routine IV use/);
    } else {
      assert.match(intravenousCard, /Parent tramadol[\s\S]*injection label half-life/);
      assert.match(intravenousCard, /active M1/);
      assert.match(intravenousRow.timing, /analgesic effect are not modeled/);
    }
    assert.ok(oralCard.includes(oralName));
    assert.match(oralCard, /<svg/);
    assert.ok(oralCard.includes(`Peak: ~${oralPeakHours} h`));
    assert.equal(picker.value, "0");
    assert.ok(picker.innerHTML.includes(`<option value="0">${intravenousName}</option>`));
    assert.ok(picker.innerHTML.includes(`<option value="1">${oralName}</option>`));
  });
}

test("Morphine ER plots study peak timing and one standard deviation without inventing a concentration curve", () => {
  const row = evaluateArray("pharmacokineticsRows").find((item) => item.name === "Morphine oral (ER)");
  const { cards: [card] } = renderProfileCards([row]);
  assert.equal(row.profile.available, false);
  assert.equal(row.profile.peakHours, null);
  assert.equal(row.profile.halfLifeHours, null);
  assert.equal(row.profile.referenceGraph.meanHours, 3.6);
  assert.equal(row.profile.referenceGraph.standardDeviationHours, 2.3);
  assert.equal(row.profile.referenceGraph.intervalHours, 12);
  assert.match(card, /Study peak timing/);
  assert.match(card, /18 cancer patients/);
  assert.match(card, /steady state/);
  assert.match(card, /every 12 h/);
  assert.match(card, /Whiskers: mean ± 1 SD, not the observed range/);
  assert.match(card, /not a concentration curve or a universal morphine ER peak/);
  assert.match(card, /Peak time: 3\.6 h ± 2\.3 h \(mean ± SD\)/);
  assert.doesNotMatch(card, /<polyline|<polygon|Relative parent-drug level|100%/);

  const axis = elements(card, "line", "pk-axis")[0];
  const hoursAt = (x) => (Number(x) - Number(axis.x1)) / (Number(axis.x2) - Number(axis.x1)) * 12;
  const marker = elements(card, "circle", "pk-reference-peak")[0];
  const spread = elements(card, "line", "pk-reference-spread");
  const whisker = spread.find((line) => line.y1 === line.y2);
  closeTo(hoursAt(marker.cx), 3.6, "Morphine ER mean peak time");
  closeTo(hoursAt(whisker.x1), 1.3, "Morphine ER mean minus SD");
  closeTo(hoursAt(whisker.x2), 5.9, "Morphine ER mean plus SD");
  assert.equal(spread.length, 3);
  assert.equal(spread.filter((line) => line.x1 === line.x2).length, 2);
  assert.match(row.halfLife, /effective morphine half-life of 2-4 hours/);
  assert.match(row.halfLife, /longer terminal phase of about 15 hours/);
  assert.match(row.halfLife, /8-12 hour dosing interval is not presented as a formulation half-life/);
});

test("all 21 PK cards retain useful plots, labels and selection without invalid output", () => {
  const rows = evaluateArray("pharmacokineticsRows");
  const { cards, picker } = renderProfileCards(rows);
  assert.equal(rows.length, 21);
  assert.equal(cards.length, rows.length);
  assert.equal(elements(picker.innerHTML, "option").length, 21);
  assert.equal(cards.filter((card) => card.includes('aria-pressed="true"')).length, 1);
  assert.deepEqual(
    Array.from(rows.filter((row) => row.profile.available === false), (row) => row.name),
    ["Codeine IV", "Morphine oral (ER)", "Tramadol IV"],
  );

  rows.forEach((row, index) => {
    const card = cards[index];
    assert.ok(card.includes(row.name), `Missing profile name: ${row.name}`);
    assert.match(card, new RegExp(`data-pk-index="${index}"`));
    assert.equal(elements(card, "svg").length, 1);
    assert.doesNotMatch(card, /Graph unavailable|Numeric profile not plotted|NaN|Infinity|undefined|\shidden(?:\s|=|>)/);

    if (row.profile.available === false) {
      const readableText = card.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      assert.ok(readableText.includes(row.profile.referenceGraph.sourceNote), `Missing study context: ${row.name}`);
      assert.ok(readableText.includes(row.profile.referenceGraph.limitation), `Missing evidence limitation: ${row.name}`);
      assert.match(card, /pk-reference-svg/);
    } else {
      assert.match(card, /<svg[\s\S]*<polyline/);
      assert.match(card, /(?:Steady\/peak|Peak): ~/);
      assert.doesNotMatch(card, /pk-reference-summary|Why no curve\?|NaN|Infinity|undefined/);
    }
  });
});

test("soft area fills follow the complete curve and use a unique matching gradient per card", () => {
  const { cards } = renderProfileCards(evaluateArray("pharmacokineticsRows"));
  const gradientIds = [];
  for (const card of cards) {
    const [curve] = elements(card, "polyline", "pk-profile-line");
    if (!curve) continue;
    const [area] = elements(card, "polygon", "pk-profile-area");
    const [gradient] = elements(card, "linearGradient", "pk-profile-gradient");
    const curvePoints = points(curve);
    const areaPoints = points(area);
    assert.deepEqual(areaPoints.slice(1, -1), curvePoints, "Area must reuse every existing curve point without smoothing or resampling");
    const axis = elements(card, "line", "pk-axis").find((line) => line.y1 === line.y2);
    assert.deepEqual(areaPoints[0], [Number(axis.x1), Number(axis.y1)]);
    assert.deepEqual(areaPoints.at(-1), [Number(axis.x2), Number(axis.y2)]);
    assert.equal(area.fill, `url(#${gradient.id})`);
    assert.ok(!gradientIds.includes(gradient.id), `Duplicate gradient reference: ${gradient.id}`);
    gradientIds.push(gradient.id);
  }
  assert.equal(gradientIds.length, 20, "18 existing profiles plus two terminal-elimination illustrations use an area fill");
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
