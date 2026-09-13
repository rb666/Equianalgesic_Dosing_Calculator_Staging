const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

function loadArchive() {
  const source = fs.readFileSync(path.join(__dirname, "../archive/uds/uds-tool.js"), "utf8");
  const startup = /  setRootShell\(\);\r?\n  attachEvents\(\);\r?\n  render\(\);/;
  assert.match(source, startup, "instrument only the browser startup, preserving the real interpretation engine");
  const window = {};
  vm.runInNewContext(source.replace(startup, `
    render = () => {};
    window.audit = {state, relationships, analyzeInterpretation, renderInterpret, addChipById, removeChip, buildSafetyFlags};
  `), {window, document: {querySelector: () => ({})}, localStorage: {getItem: () => null}, console});
  return {...window.audit, golden: window.runUdsGoldenCases};
}
const plain = value => JSON.parse(JSON.stringify(value));

test("all archived built-in UDS golden cases pass", () => {
  const results = loadArchive().golden();
  assert.ok(results.length >= 28);
  assert.deepEqual(plain(results.filter(row => !row.passed)), []);
});

test("multiple expected origins produce the same interpretation regardless of entry order", () => {
  const tool = loadArchive();
  const targets = [...new Set(tool.relationships.map(row => row.to))];
  let cases = 0;
  for (const id of targets) {
    const origins = [...new Set(tool.relationships.filter(row => row.to === id).map(row => row.from))];
    if (origins.length < 2) continue;
    Object.assign(tool.state, {expected: origins, detected: [id], absent: []});
    const forward = tool.analyzeInterpretation();
    tool.state.expected = [...origins].reverse();
    const reverse = tool.analyzeInterpretation();
    for (const field of ["label", "tone", "confirmationLevel", "explained", "contextNeeded", "nextStep"]) {
      assert.deepEqual(plain(forward[field]), plain(reverse[field]), `${id}:${field}`);
    }
    assert.ok(forward.contextNeeded.some(line => /multiple possible relationships/.test(line)), id);
    cases++;
  }
  assert.ok(cases >= 3);
});

test("contradictory results are rejected in both directions and can be corrected", () => {
  for (const [first, second] of [["detected", "absent"], ["absent", "detected"]]) {
    const tool = loadArchive();
    assert.equal(tool.addChipById(first, "fentanyl"), true);
    assert.equal(tool.addChipById(second, "fentanyl"), false);
    assert.deepEqual(plain(tool.state[second]), []);
    assert.match(tool.state.entryError, /already entered/);
    assert.equal(tool.addChipById("expected", "fentanyl"), true);
    tool.removeChip(first, "fentanyl");
    assert.equal(tool.addChipById(second, "fentanyl"), true);
    assert.equal(tool.state.entryError, "");
  }
});

test("engine conflicts fail closed even when state bypasses the entry controls", () => {
  const tool = loadArchive();
  Object.assign(tool.state, {expected: ["fentanyl"], detected: ["fentanyl"], absent: ["fentanyl"], absentVerified: true});
  const result = tool.analyzeInterpretation();
  assert.equal(result.copyBlocked, true);
  assert.deepEqual(plain(result.explained), []);
  const html = tool.renderInterpret();
  assert.equal((html.match(/data-action="copy-[^"]+"[^>]*disabled/g) || []).length, 3);
  for (const field of ["lastSummary", "lastShortSummary", "lastPatientScript"]) assert.equal(tool.state[field], "");
  tool.removeChip("absent", "fentanyl");
  assert.notEqual(tool.analyzeInterpretation().copyBlocked, true);
});

test("OUD absence warnings require verified analyte coverage and the matching expected medication", () => {
  for (const [parent, metabolite] of [["buprenorphine", "norbuprenorphine"], ["methadone", "eddp"]]) {
    for (const id of [parent, metabolite]) {
      for (const coverage of [null, "not_included", "assay_dependent", "class_screen", "included"]) {
        const tool = loadArchive();
        Object.assign(tool.state, {context: "oud", expected: [parent], absent: [id], absentVerified: true,
          panelId: "test-panel", localProfiles: [{id: "test-panel", label: "Test panel", method: "definitive",
            analytes: coverage ? [{id, status: coverage}] : []}]});
        const warnings = () => tool.buildSafetyFlags().filter(line => /expected .*absent/.test(line));
        assert.equal(warnings().length, coverage === "included" ? 1 : 0, `${parent}:${id}:${coverage}`);
        tool.state.absentVerified = false;
        assert.equal(warnings().length, 0);
        tool.state.absentVerified = true;
        tool.state.panelId = "unknown";
        assert.equal(warnings().length, 0);
        tool.state.panelId = "test-panel";
        tool.state.expected = [parent === "methadone" ? "buprenorphine" : "methadone"];
        assert.equal(warnings().length, 0, "absence of the other OUD medication is not an adherence finding");
      }
    }
  }
});
