const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const test = require("node:test");
const { scriptText } = require("./calculator-test-helpers.cjs");
const html = fs.readFileSync(require("node:path").join(__dirname, "../public/opioidcalculator.html"), "utf8");

test("search metadata uses one canonical identity and truthful linked entities", () => {
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonical.length, 1);
  const url = canonical[0][1];
  assert.equal(url, "https://calc.med/opioidcalculator");
  assert.ok(html.includes(`property="og:url" content="${url}"`));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1);
  const graph = JSON.parse(schemas[0][1])["@graph"];
  const ids = new Set(graph.map(entity => entity["@id"]));
  assert.equal(ids.size, graph.length);
  for (const entity of graph) {
    for (const value of Object.values(entity)) {
      if (value && typeof value === "object" && value["@id"]) assert.ok(ids.has(value["@id"]));
    }
    for (const unverified of ["author", "reviewedBy", "lastReviewed", "aggregateRating", "review", "award"]) {
      assert.equal(entity[unverified], undefined);
    }
  }
  const app = graph.find(entity => entity["@type"] === "WebApplication");
  const page = graph.find(entity => entity["@type"] === "MedicalWebPage");
  assert.equal(page.mainEntity["@id"], app["@id"]);
  assert.equal(app.mainEntityOfPage["@id"], page["@id"]);
  assert.equal(app.url, url);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const sitemap = fs.readFileSync(require("node:path").join(__dirname, "../public/sitemap.xml"), "utf8");
  assert.ok(sitemap.includes(`<loc>${url}</loc>`));
});

test("search snippets exclude calculation outputs and static guide links resolve", () => {
  assert.equal((html.match(/<section class="result-panel" data-nosnippet/g) || []).length, 4);
  assert.match(html, /id="regimenEntries" data-nosnippet/);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), match[1]);
  assert.match(html, /id="calculatorGuide"[\s\S]*JavaScript is required/);
  assert.doesNotMatch(html, /name="keywords"|"@type":\s*"FAQPage"/);
});

test("direct tool links activate only existing tabs and leave arbitrary URL fragments alone", () => {
  const start = scriptText.indexOf("const activateLinkedCalculator = ");
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start);
  const calls = [];
  const tabs = ["Mme", "Convert", "Methadone", "Buprenorphine", "Benzo"].map((name, i) => ({
    id: `calculatorTab${name}`, dataset: {calculatorTab: ["mme", "convert", "methadone", "buprenorphine", "benzo"][i]},
    focus() { calls.push("focus"); }, scrollIntoView() { calls.push("scroll"); },
  }));
  const location = {hash: ""};
  const reference = {open: false, querySelector: () => ({focus() { calls.push("reference-focus"); }}), scrollIntoView() { calls.push("reference-scroll"); }};
  const activate = vm.runInNewContext(scriptText.slice(start, end) + ";activateLinkedCalculator;", {
    calculatorTabs: tabs, window: {location}, activateCalculatorMode: mode => calls.push(mode),
    document: {querySelector: selector => { assert.equal(selector, "#conversionReference"); return reference; }},
  });
  for (const tab of tabs) {
    calls.length = 0; location.hash = `#${tab.id}`; activate();
    assert.deepEqual(calls, [tab.dataset.calculatorTab, "focus", "scroll"]);
  }
  for (const hash of ["", "#unknown", "#calculatorTabs", "#calculatorTabMme?dose=100", "#<script>"]) {
    calls.length = 0; location.hash = hash; activate(); assert.deepEqual(calls, []);
  }
  location.hash = "#conversionReference"; activate();
  assert.equal(reference.open, true);
  assert.deepEqual(calls, ["reference-focus", "reference-scroll"]);
});
