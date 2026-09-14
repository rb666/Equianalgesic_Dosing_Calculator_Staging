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
    calls.length = 0; activate({ moveFocus: false });
    assert.deepEqual(calls, [tab.dataset.calculatorTab, "scroll"]);
  }
  for (const hash of ["", "#unknown", "#calculatorTabs", "#calculatorTabMme?dose=100", "#<script>"]) {
    calls.length = 0; location.hash = hash; activate(); assert.deepEqual(calls, []);
  }
  for (const [id, disclosure] of Object.entries(disclosures)) {
    calls.length = 0; location.hash = `#${id}`; activate();
    assert.equal(disclosure.open, true);
    assert.deepEqual(calls, [`${id}-focus`, `${id}-scroll`]);
    calls.length = 0; disclosure.open = false; activate({ moveFocus: false });
    assert.equal(disclosure.open, true);
    assert.deepEqual(calls, [`${id}-scroll`]);
  }
});

test("startup normalizes legacy tool links before controls parse and prevents refresh scroll restoration", () => {
  const bootstrap = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .find(match => match[1].includes("scrollRestoration"));
  assert.ok(bootstrap, "startup behavior is available before deferred application code");
  assert.ok(bootstrap.index < html.indexOf("</head>"), "legacy fragments are handled before the matching controls parse");
  const origin = "https://example.test";
  const pathname = "/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/";
  const state = Object.freeze({ entryId: "existing-entry" });
  const cases = [
    ["#calculatorTabMme", "mme"], ["#calculatorTabConvert", "convert"],
    ["#calculatorTabMethadone", "methadone"], ["#calculatorTabBuprenorphine", "buprenorphine"],
    ["#calculatorTabBenzo", "benzo"],
    ["", null], ["#conversionReference", null], ["#calculatorGuide", null],
    ["#calculatorTabs", null], ["#unknown", null], ["#calculatorTabMme?dose=100", null],
  ];
  for (const navigationType of ["navigate", "reload", "back_forward"]) {
    for (const [hash, mode] of cases) {
      const location = new URL(`${origin}${pathname}?source=review%20link&tool=convert${hash}`);
      const history = {
        state, scrollRestoration: "auto", length: 4,
        replaceState(nextState, _title, url) {
          assert.equal(nextState, state, "normalizing a legacy link keeps the current history state");
          location.href = new URL(url, location).href;
        },
        pushState() { assert.fail("startup must not add history entries"); },
      };
      const context = {
        location, history, URL, URLSearchParams,
        performance: { getEntriesByType(type) {
          assert.equal(type, "navigation");
          return [{type: navigationType}];
        }},
        document: {documentElement: {dataset: {}}},
        localStorage: {getItem() {return null;}},
        addEventListener(name, callback) {
          assert.equal(name, "pageshow");
          this.onPageShow = callback;
        },
      };
      context.window = context;
      vm.runInNewContext(bootstrap[1], context);
      assert.equal(location.pathname, pathname);
      assert.equal(location.searchParams.get("source"), "review link");
      assert.equal(location.searchParams.get("tool"), mode || "convert", `${navigationType} ${hash}`);
      assert.equal(location.hash, mode ? "" : hash, "only exact legacy tool fragments are converted");
      assert.equal(history.length, 4);
      assert.equal(history.state, state);
      assert.equal(history.scrollRestoration, navigationType === "back_forward" ? "auto" : "manual");
      context.onPageShow({persisted: false});
      assert.equal(history.scrollRestoration, navigationType === "back_forward" ? "auto" : "manual");
      context.onPageShow({persisted: true});
      assert.equal(history.scrollRestoration, "auto", "restoring a cached history page retains ordinary scroll restoration");
    }
  }
});

test("restoring a saved tool selects it without moving focus or scrolling", () => {
  const start = scriptText.indexOf("const restoreCalculatorSelection = ");
  const end = scriptText.indexOf("\n};", start) + 3;
  assert.ok(start >= 0 && end > start);
  const modes = ["mme", "convert", "methadone", "buprenorphine", "benzo"];
  const calls = [];
  const tabs = modes.map(mode => ({
    dataset: {calculatorTab: mode},
    focus() { assert.fail("restored tool must not acquire keyboard focus"); },
    scrollIntoView() { assert.fail("restored tool must not scroll the page"); },
  }));
  const location = new URL("https://example.test/opioidcalculator/");
  const restore = vm.runInNewContext(scriptText.slice(start, end) + ";restoreCalculatorSelection;", {
    calculatorTabs: tabs, window: {location}, URLSearchParams,
    activateCalculatorMode: mode => calls.push(mode),
  });
  for (const mode of modes) {
    calls.length = 0;
    location.search = `?source=review&tool=${mode}`;
    restore();
    assert.deepEqual(calls, [mode]);
  }
  for (const search of ["", "?tool=", "?tool=unknown", "?tool=Methadone", "?tool=mme%3Fdose%3D100", "?dose=100"]) {
    calls.length = 0;
    location.search = search;
    restore();
    assert.deepEqual(calls, [], search);
  }
  assert.match(scriptText, /restoreCalculatorSelection\(\);\s*activateLinkedCalculator\(\{ moveFocus: false \}\);/,
    "startup restores selection separately from intentional section links");
});

test("Back from an explicit guide link restores query selection without retaining anchor focus", () => {
  const functionText = name => {
    const start = scriptText.indexOf(`const ${name} = `);
    const end = scriptText.indexOf("\n};", start) + 3;
    assert.ok(start >= 0 && end > start);
    return scriptText.slice(start, end);
  };
  const listenerStart = scriptText.indexOf('window.addEventListener("hashchange", ');
  const listenerEnd = scriptText.indexOf("\n});", listenerStart) + 4;
  assert.ok(listenerStart >= 0 && listenerEnd > listenerStart);
  const calls = [];
  const location = new URL("https://example.test/opioidcalculator/?tool=convert");
  let onHashChange;
  const tabs = [["convert", "calculatorTabConvert"], ["methadone", "calculatorTabMethadone"]]
    .map(([mode, id]) => ({
      id, dataset: {calculatorTab: mode},
      focus() {calls.push("focus");},
      scrollIntoView() {calls.push("scroll");},
    }));
  vm.runInNewContext([
    functionText("restoreCalculatorSelection"),
    functionText("activateLinkedCalculator"),
    scriptText.slice(listenerStart, listenerEnd),
  ].join("\n"), {
    calculatorTabs: tabs, URLSearchParams,
    window: {location, addEventListener(name, callback) {
      assert.equal(name, "hashchange");
      onHashChange = callback;
    }},
    activateCalculatorMode: mode => calls.push(mode),
  });
  location.hash = "#calculatorTabMethadone";
  onHashChange();
  assert.deepEqual(calls, ["methadone", "focus", "scroll"], "following a guide link remains intentional navigation");
  calls.length = 0;
  location.hash = "";
  onHashChange();
  assert.deepEqual(calls, ["convert"], "returning to the query-state entry restores its tool without another focus or scroll action");
});

test("tool selection is input-free URL state without a fragment target or extra history entry", () => {
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
  const location = new URL(`https://example.test${pathname}${search}#conversionReference`);
  const state = Object.freeze({ scrollPosition: 420, entryId: "existing-entry" });
  const replacements = [];
  const history = {
    state,
    length: 7,
    replaceState(nextState, title, url) {
      replacements.push({ nextState, title, url });
      location.href = new URL(url, location).href;
    },
    pushState() { assert.fail("switching tools must not add a history entry"); },
  };
  const update = vm.runInNewContext(scriptText.slice(start, end) + ";updateCalculatorLink;", {
    calculatorTabs: tabs, window: { location, history }, URL, URLSearchParams,
  });

  for (const tab of tabs) {
    location.hash = "#conversionReference";
    replacements.length = 0;
    update(tab.dataset.calculatorTab);
    assert.equal(replacements.length, 1);
    assert.equal(replacements[0].nextState, state, "existing history state is passed through");
    assert.equal(replacements[0].title, "");
    const changed = new URL(replacements[0].url, location);
    assert.equal(changed.pathname, pathname);
    assert.deepEqual([...changed.searchParams], [
      ["view", "compact"], ["source", "review link"], ["tool", tab.dataset.calculatorTab],
    ]);
    assert.equal(changed.hash, "");
    assert.equal(location.pathname, pathname);
    assert.equal(location.searchParams.get("tool"), tab.dataset.calculatorTab);
    assert.equal(location.hash, "");
    assert.equal(history.state, state);
    assert.equal(history.length, 7);

    update(tab.dataset.calculatorTab);
    assert.equal(replacements.length, 1, "an already-correct tool URL is left alone");
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
