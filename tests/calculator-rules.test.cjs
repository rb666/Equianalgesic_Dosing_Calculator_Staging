const assert = require("node:assert/strict");
const test = require("node:test");

const {
  clinicalDataSlug,
  evaluateArray,
  getClinicalContentDigest,
} = require("./calculator-test-helpers.cjs");

delete global.CALCULATOR_PROVENANCE;
require("../public/calculator-provenance.js");
const manifest = global.CALCULATOR_PROVENANCE;

const conversionOptions = evaluateArray("conversionOptions");
const benzoOptions = evaluateArray("benzoConversionOptions");
const methadoneBands = evaluateArray("methadoneRatioTable");
const hepaticRows = evaluateArray("hepaticGuidanceRows");
const schedules = evaluateArray("buprenorphineSchedules");
const pkRows = evaluateArray("pharmacokineticsRows");

test("manifest version and digest identify the exact clinical content", () => {
  assert.equal(manifest.schemaVersion, "1.0.0");
  assert.match(manifest.manifestVersion, /^\d{4}-\d{2}-\d{2}\.\d+$/);
  assert.equal(manifest.contentDigest, getClinicalContentDigest());
  assert.equal(manifest.clinicalReview.status, "unreviewed");
  assert.equal(manifest.clinicalReview.reviewer, null);
});

test("every clinical data row and claim has a rule-level manifest record", () => {
  assert.equal(
    JSON.stringify(manifest.inventory.conversions),
    JSON.stringify(Array.from(conversionOptions, (item) => item.id)),
  );
  assert.equal(
    JSON.stringify(manifest.inventory.benzodiazepines),
    JSON.stringify(Array.from(benzoOptions, (item) => item.id)),
  );
  assert.equal(methadoneBands.length, 6);
  assert.equal(hepaticRows.length * 3, 21);
  assert.equal(schedules.length, 5);
  assert.equal(schedules.reduce((sum, item) => sum + item.days.length, 0), 25);
  assert.equal(pkRows.length, 21);

  const requiredRuleIds = [
    ...conversionOptions.map((item) => `conversion.${item.id}`),
    ...benzoOptions.map((item) => `benzodiazepine.${item.id}`),
    ...manifest.inventory.methadoneBands.map((id) => `methadone.band.${id}`),
    ...hepaticRows.flatMap((item) =>
      ["mild", "moderate", "severe"].map(
        (severity) => `hepatic.${item.medication.toLowerCase()}.${severity}`,
      ),
    ),
    ...schedules.flatMap((schedule) => [
      `buprenorphine.schedule.${schedule.id}`,
      ...schedule.days.map(
        (_, index) => `buprenorphine.schedule.${schedule.id}.day-${index + 1}`,
      ),
    ]),
    ...pkRows.flatMap((item) =>
      [
        "profile",
        "timing",
        "half-life",
        "metabolism",
        "mechanism",
        "behavior",
        "interactions",
      ].map((claim) => `pk.${clinicalDataSlug(item.name)}.${claim}`),
    ),
  ];

  assert.equal(pkRows.length * 7, 147);
  for (const ruleId of requiredRuleIds) {
    assert.ok(manifest.rules[ruleId], `missing ${ruleId}`);
  }
});

test("source references resolve and uncertainty never becomes approval", () => {
  for (const rule of Object.values(manifest.rules)) {
    assert.equal(rule.clinicalReviewStatus, "unreviewed", rule.id);
    assert.ok(rule.limitations, rule.id);
    assert.ok(Array.isArray(rule.testIds), rule.id);

    for (const reference of rule.sourceRefs) {
      if (reference.sourceId.startsWith("embedded-pk-source:")) {
        const slug = reference.sourceId.slice("embedded-pk-source:".length);
        const row = pkRows.find((item) => clinicalDataSlug(item.name) === slug);
        assert.ok(row, reference.sourceId);
        assert.ok(row.sources.length, row.name);
        row.sources.forEach((source) => assert.match(source.url, /^https:\/\//));
      } else {
        assert.ok(manifest.sources[reference.sourceId], `${rule.id}:${reference.sourceId}`);
      }
    }

    if (["none", "conflicts"].includes(rule.evidenceMatch)) {
      assert.equal(rule.clinicalReviewStatus, "unreviewed", rule.id);
    }
  }
});

test("local/off-label policies are explicitly characterized, not source-washed", () => {
  for (const schedule of schedules) {
    const rule = manifest.rules[`buprenorphine.schedule.${schedule.id}`];
    assert.equal(rule.basis, "off-label-local-protocol");
    assert.equal(rule.evidenceMatch, "conflicts");
  }
  assert.equal(manifest.inputPolicy.maximum, null);
  assert.match(manifest.inputPolicy.maximumRationale, /No clinically meaningful maximum/i);
  assert.equal(manifest.inputPolicy.organComposition, "independent-not-stacked");
  assert.equal(manifest.rules["pk.graph.absorptive-shape"].evidenceMatch, "none");
  assert.equal(manifest.rules["pk.graph.patch-shape"].evidenceMatch, "none");
});

test("repaired DailyMed links and claim-specific PK profiles remain aligned", () => {
  const expected = {
    "Hydrocodone oral (ER)": {
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b7d23ac2-e776-9f62-3290-c64c2d6eb353",
      peak: 15,
      halfLife: 8,
      sourceId: "dailymed-hysingla-v17",
    },
    "Hydromorphone oral (ER)": {
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f26ababe-f6f0-443e-8d91-4d2a174675bc",
      peak: 14,
      halfLife: 11,
      sourceId: "dailymed-exalgo-v1",
    },
    "Methadone oral": {
      url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=eddf7077-02fb-4771-9823-31984f4ff2bb",
      peak: 4,
      halfLife: 30,
      sourceId: "dailymed-methadone-v47",
    },
  };

  for (const [name, expectation] of Object.entries(expected)) {
    const row = pkRows.find((item) => item.name === name);
    assert.equal(row.sources[0].url, expectation.url);
    assert.equal(row.profile.peakHours, expectation.peak);
    assert.equal(row.profile.halfLifeHours, expectation.halfLife);
    assert.equal(
      manifest.rules[`pk.${clinicalDataSlug(name)}.profile`].sourceRefs[0].sourceId,
      expectation.sourceId,
    );
    assert.ok(
      row.profile.peakHours >= row.profile.peakRangeHours[0] &&
        row.profile.peakHours <= row.profile.peakRangeHours[1],
      name,
    );
    assert.ok(
      row.profile.halfLifeHours >= row.profile.halfLifeRangeHours[0] &&
        row.profile.halfLifeHours <= row.profile.halfLifeRangeHours[1],
      name,
    );
  }

  const msContin = pkRows.find((item) => item.name === "Morphine oral (ER)");
  assert.equal(
    msContin.sources[0].url,
    "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c354b3bf-86c0-4bb8-8b1f-be2164942698",
  );
  assert.equal(msContin.profile.available, false);
  assert.equal(msContin.profile.peakHours, null);
  assert.equal(
    manifest.rules["pk.morphine-oral-er.profile"].sourceRefs[0].sourceId,
    "dailymed-ms-contin-v17",
  );
  assert.match(msContin.timing, /does not provide a representative peak/i);

  const tapentadol = pkRows.find((item) => item.name === "Tapentadol oral (ER)");
  assert.deepEqual([...tapentadol.profile.peakRangeHours], [3, 6]);
  assert.equal(tapentadol.profile.halfLifeHours, 5);
  const tramadol = pkRows.find((item) => item.name === "Tramadol oral (ER)");
  assert.equal(tramadol.profile.peakHours, 12);
  assert.equal(tramadol.profile.secondaryPeak.hours, 15);
  assert.equal(tramadol.profile.halfLifeHours, 7.9);
  assert.equal(tramadol.profile.secondaryHalfLife.hours, 8.8);
});
