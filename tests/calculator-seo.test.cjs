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

test("the usage guide remains complete in initial HTML inside a closed disclosure after references", () => {
  const guide = html.match(/<details\b([^>]*\bid="calculatorGuide"[^>]*)>([\s\S]*?)<\/details>/);
  const references = html.match(/<details\b[^>]*\bid="conversionReference"[^>]*>[\s\S]*?<\/details>/);
  assert.ok(guide, "guide must be a native details disclosure");
  assert.ok(references, "conversion references must remain available");
  assert.ok(guide.index > references.index + references[0].length, "references precede the guide");
  assert.ok(guide.index < html.indexOf("</main>"), "guide remains in the main page content");
  assert.doesNotMatch(guide[1], /(?:^|\s)(?:open|hidden)(?=\s|=|$)/);

  const summary = guide[2].match(/^\s*<summary\b([^>]*)>([^<]+)<\/summary>/);
  assert.ok(summary, "native summary is the first disclosure child");
  assert.equal(summary[2].trim(), "How to use this calculator");
  const titleId = guide[1].match(/aria-labelledby="([^"]+)"/)?.[1];
  assert.ok(titleId);
  assert.ok(summary[1].includes(`id="${titleId}"`), "accessible title points to the summary");
  assert.doesNotMatch(summary[1], /tabindex="-1"|\srole=/);

  for (const content of [
    "Using the opioid conversion and MME calculator",
    "Choose the calculation you need",
    "Enter a regimen and review the result",
    "References and clinical use",
    "JavaScript is required to use the tools.",
    "patient-specific assessment, institutional policy, or pharmacist review.",
  ]) assert.ok(guide[2].includes(content), content);

  const guideLinks = [...guide[2].matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(guideLinks, [
    "calculatorTabMme", "calculatorTabConvert", "calculatorTabMethadone",
    "calculatorTabBuprenorphine", "calculatorTabBenzo", "conversionReference",
  ]);
  assert.ok(guide[2].includes('href="https://pain.ucsf.edu/opioid-analgesics/calculation-oral-morphine-equivalents-ome"'));
  assert.ok(guide[2].includes('href="https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm"'));
  assert.doesNotMatch(guide[2], /<script\b|<template\b|aria-hidden="true"/);
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
  const disclosures = Object.fromEntries(["conversionReference", "calculatorGuide"].map(id => [id, {
    open: false,
    querySelector(selector) {
      assert.equal(selector, "summary");
      return {focus() { calls.push(`${id}-focus`); }};
    },
    scrollIntoView() { calls.push(`${id}-scroll`); },
  }]));
  const activate = vm.runInNewContext(scriptText.slice(start, end) + ";activateLinkedCalculator;", {
    calculatorTabs: tabs, window: {location}, activateCalculatorMode: mode => calls.push(mode),
    document: {querySelector: selector => {
      assert.ok(disclosures[selector.slice(1)], selector);
      return disclosures[selector.slice(1)];
    }},
  });
  for (const tab of tabs) {
    calls.length = 0; location.hash = `#${tab.id}`; activate();
    assert.deepEqual(calls, [tab.dataset.calculatorTab, "focus", "scroll"]);
  }
  for (const hash of ["", "#unknown", "#calculatorTabs", "#calculatorTabMme?dose=100", "#<script>"]) {
    calls.length = 0; location.hash = hash; activate(); assert.deepEqual(calls, []);
  }
  for (const [id, disclosure] of Object.entries(disclosures)) {
    calls.length = 0; location.hash = `#${id}`; activate();
    assert.equal(disclosure.open, true);
    assert.deepEqual(calls, [`${id}-focus`, `${id}-scroll`]);
  }
});

test("tool selection replaces stale fragments while preserving the URL context and history entry", () => {
  const start = scriptText.indexOf("const updateCalculatorLink = ");
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start);
  const tabs = [
    ["mme", "calculatorTabMme"], ["convert", "calculatorTabConvert"],
    ["methadone", "calculatorTabMethadone"], ["buprenorphine", "calculatorTabBuprenorphine"],
    ["benzo", "calculatorTabBenzo"],
  ].map(([mode, id]) => ({ id, dataset: { calculatorTab: mode } }));
  const pathname = "/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/";
  const search = "?view=compact&source=review%20link";
  const location = { pathname, search, hash: "#conversionReference" };
  const state = Object.freeze({ scrollPosition: 420, entryId: "existing-entry" });
  const replacements = [];
  const history = {
    state,
    length: 7,
    replaceState(nextState, title, url) {
      replacements.push({ nextState, title, url });
      location.hash = url.slice(url.indexOf("#"));
    },
    pushState() { assert.fail("switching tools must not add a history entry"); },
  };
  const update = vm.runInNewContext(scriptText.slice(start, end) + ";updateCalculatorLink;", {
    calculatorTabs: tabs, window: { location, history },
  });

  for (const tab of tabs) {
    location.hash = "#conversionReference";
    replacements.length = 0;
    update(tab.dataset.calculatorTab);
    assert.equal(replacements.length, 1);
    assert.equal(replacements[0].nextState, state, "existing history state is passed through");
    assert.equal(replacements[0].title, "");
    assert.equal(replacements[0].url, `${pathname}${search}#${tab.id}`);
    assert.equal(location.pathname, pathname);
    assert.equal(location.search, search);
    assert.equal(location.hash, `#${tab.id}`);
    assert.equal(history.state, state);
    assert.equal(history.length, 7);

    update(tab.dataset.calculatorTab);
    assert.equal(replacements.length, 1, "an already-correct fragment is left alone");
  }

  for (const mode of ["", undefined, "unknown", "convert?dose=100"]) {
    replacements.length = 0;
    location.hash = "#calculatorGuide";
    update(mode);
    assert.equal(replacements.length, 0);
    assert.equal(location.hash, "#calculatorGuide");
    assert.equal(history.state, state);
    assert.equal(history.length, 7);
  }
});
