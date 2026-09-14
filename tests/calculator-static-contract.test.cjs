const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const {
  evaluateArray,
  repositoryRoot,
  scriptText,
} = require("./calculator-test-helpers.cjs");
const publicHtml = fs.readFileSync(
  path.join(repositoryRoot, "public", "opioidcalculator.html"),
  "utf8",
);
const udsHtml = fs.readFileSync(
  path.join(repositoryRoot, "archive", "uds", "UDS.html"),
  "utf8",
);
const udsToolText = fs.readFileSync(
  path.join(repositoryRoot, "archive", "uds", "uds-tool.js"),
  "utf8",
);
const stylesText = fs.readFileSync(
  path.join(repositoryRoot, "public", "styles.css"),
  "utf8",
);

test("calculator HTML fails closed and loads assurance assets before the adapter", () => {
  assert.match(publicHtml, /<noscript>[\s\S]*Calculator unavailable[\s\S]*<\/noscript>/i);
  assert.doesNotMatch(
    publicHtml.match(/<span id="finalDose">([\s\S]*?)<\/span>/)?.[1] || "",
    /\d/,
  );
  assert.match(publicHtml, /showCalculatorLoadFailure/);
  assert.match(publicHtml, /Reload the page before entering or using clinical information/);
  assert.match(scriptText, /dataset\.calculatorReady = "true"/);

  const coreIndex = publicHtml.indexOf('src="/calculator-core.js');
  const provenanceIndex = publicHtml.indexOf('src="/calculator-provenance.js');
  const adapterIndex = publicHtml.indexOf('src="/script.js');
  assert.ok(coreIndex > 0 && coreIndex < provenanceIndex && provenanceIndex < adapterIndex);

  const assetKeys = [...publicHtml.matchAll(/(?:styles\.css|calculator-core\.js|calculator-provenance\.js|script\.js)\?v=([^"']+)/g)].map(
    (match) => match[1],
  );
  assert.equal(assetKeys.length, 4);
  assert.equal(new Set(assetKeys).size, 1);

  const udsAssetKeys = [
    ...udsHtml.matchAll(
      /(?:styles\.css|uds-tool\.css|uds-workflow-guide\.css|uds-tool\.js|uds-workflow-guide\.js)\?v=([^"']+)/g,
    ),
  ].map((match) => match[1]);
  assert.equal(udsAssetKeys.length, 5);
  assert.equal(new Set(udsAssetKeys).size, 1);
});

test("accessible result and modal contracts are explicit", () => {
  assert.equal((publicHtml.match(/class="result-panel"/g) || []).length, 4);
  assert.doesNotMatch(publicHtml, /class="result-panel"[^>]*aria-live/i);
  assert.doesNotMatch(publicHtml, /id="pharmacokineticsSelectedDetail"[^>]*aria-live/i);
  for (const id of [
    "conversionResultStatus",
    "methadoneResultStatus",
    "buprenorphineResultStatus",
    "benzoResultStatus",
    "pharmacokineticsSelectionStatus",
  ]) {
    assert.match(publicHtml, new RegExp(`id="${id}"[\\s\\S]{0,120}aria-live="polite"`));
  }
  for (const name of [
    "Safety reduction percentage value",
    "Methadone safety reduction percentage value",
    "Benzodiazepine safety reduction percentage value",
    "Safety reduction percentage slider",
    "Methadone safety reduction percentage slider",
    "Benzodiazepine safety reduction percentage slider",
  ]) {
    assert.ok(publicHtml.includes(`aria-label="${name}"`), name);
  }
  assert.match(
    publicHtml,
    /id="pharmacokineticsModal"[\s\S]*?role="dialog"/,
  );
  assert.match(publicHtml, /class="reference-modal is-hidden"[\s\S]*?hidden/);
  assert.match(scriptText, /element\.inert = true/);
  assert.match(scriptText, /event\.shiftKey/);
  assert.match(scriptText, /pharmacokineticsReturnFocus/);
  assert.match(scriptText, /details:not\(\[open\]\)/);
  assert.match(stylesText, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(stylesText, /transition-duration:\s*0\.01ms\s*!important/);
  assert.match(stylesText, /button:hover,[\s\S]*?transform:\s*none/);
});

test("organ safety hierarchy and environment-neutral product naming are locked", () => {
  assert.match(scriptText, /After safety reduction; before kidney and liver guidance/);
  assert.match(publicHtml, /id="safetyAdjustedDose"/);
  assert.match(scriptText, /resolveOrganPresentation/);
  assert.match(scriptText, /No target dose is displayed/);
  assert.match(scriptText, /no combined dose is calculated/i);
  assert.match(publicHtml, /<span>Buprenorphine<\/span>/);
  assert.doesNotMatch(publicHtml, /<span>Suboxone<\/span>/);
  assert.doesNotMatch(publicHtml, /Suboxone\s*\/\s*buprenorphine/i);
  assert.doesNotMatch(publicHtml, /staging build|staging rule|staging table|staging guidance/i);
  assert.doesNotMatch(scriptText, /staging build|staging rule|staging table|staging guidance/i);
  assert.match(publicHtml, /Off-label transition schedule/);
  assert.match(publicHtml, /institutional protocol and[\s\S]*specialist review/);
});

test("consumer-facing routes exclude developer, provenance, and environment notes", () => {
  const forbiddenVisibleCopy =
    /clinical data\s+v|rule traceability|named clinical approval record|rule-level provenance|mapped rules|review status|staging environment|for verification only|workflow redesign|reference\s*\/\s*governance|staging clinical-content review|unreviewed off-label local protocol|open when you need to audit|automated release gate|audit table|provided for audit only|unconfigured entry/i;

  assert.doesNotMatch(publicHtml, forbiddenVisibleCopy);
  assert.doesNotMatch(udsHtml, forbiddenVisibleCopy);
  assert.doesNotMatch(udsToolText, forbiddenVisibleCopy);
  assert.doesNotMatch(
    publicHtml,
    /clinicalDataVersion|clinicalDataReviewStatus|provenanceSummary|data-staging-environment/,
  );
  assert.doesNotMatch(
    scriptText,
    /renderProvenanceSummary|clinicalDataVersion|clinicalDataReviewStatus|provenanceSummary/,
  );
  assert.doesNotMatch(udsToolText, /class="uds-version"|Reference \/ governance/);

  for (const source of evaluateArray("sourceReferences")) {
    assert.match(source.url, /^https:\/\//, source.title);
    assert.doesNotMatch(
      source.note,
      /repository|manifest|unreviewed|approval record|local configuration|policy metadata|release gate/i,
      source.title,
    );
  }
});

test("shared core is the calculation seam and CI blocks deployment on tests", () => {
  for (const method of [
    "calculateRegimenEntry",
    "sumRegimenOralMorphineEquivalent",
    "calculateConservativeOralMethadoneMme",
    "calculateConversion",
    "calculateMethadone",
    "calculateBenzodiazepine",
    "calculateIndependentDoseRange",
    "resolveOrganPresentation",
    "getEgfrBand",
    "getRenalReductionPercentage",
  ]) {
    assert.ok(scriptText.includes(`calculatorCore.${method}`), method);
  }
  const workflow = fs.readFileSync(
    path.join(repositoryRoot, ".github", "workflows", "pages.yml"),
    "utf8",
  );
  assert.match(workflow, /node --test tests\/\*\.test\.cjs/);
  assert.match(workflow, /needs: verify/);
  assert.match(workflow, /if: github\.event_name != 'pull_request'/);
  assert.doesNotMatch(workflow.slice(0, workflow.indexOf("jobs:")), /pages:\s*write|id-token:\s*write/);
  assert.match(workflow, /deploy:[\s\S]*?permissions:[\s\S]*?pages:\s*write[\s\S]*?id-token:\s*write/);
});

test("GitHub Pages preview is allowlisted, preserves the calculator, and can be removed completely", () => {
  const artifact = path.join(repositoryRoot, "dist", "github-pages");
  const base = "/Equianalgesic_Dosing_Calculator_Staging/";
  const normalFiles = [".nojekyll", "404.html", "OpioidConversionSite.png", "calculator-core.js",
    "calculator-provenance.js", "favicon.svg", "index.html", "opioidcalculator.html",
    path.join("opioidcalculator", "index.html"), "robots.txt", "script.js", "styles.css"];
  // Keep the owner's selected order independent of the generated/source catalog.
  // The source filenames retain their historical identities after renumbering.
  const selectedDesigns = [
    ["01", "01", "Current identity", "01-current.png", [153, 95, 957, 1052]],
    ["02", "04", "Transfer loop", "04-transfer-loop.png", [159, 368, 1218, 265]],
    ["03", "06", "Conversion grid", "06-conversion-grid.png", [160, 369, 1233, 251]],
    ["04", "12", "Serif grid", "12-serif-grid.png", [141, 363, 1270, 254]],
    ["05", "15", "Equals tile", "15-equals-tile.png", [189, 363, 1174, 238]],
    ["06", "07", "Typographic precision", "07-typographic-precision.png", [166, 363, 1217, 258]],
    ["07", "07B", "Typographic precision — equals", "07b-equals-badge.png", [166, 363, 1217, 259]],
    ["08", "09", "Open interval", "09-open-interval.png", [213, 346, 1113, 295]],
    ["09", "14B", "Matched brackets", "14b-matched-brackets.png", [122, 335, 1293, 303]],
    ["10", "14C", "Inline interval", "14c-inline-interval.png", [126, 348, 1285, 282]],
    ["11", "16", "Bracketed masthead", "16-bracketed-masthead.png", [358, 197, 821, 615]],
  ];
  const logoFiles = selectedDesigns.map(design => design[3]);
  const previewFiles = ["index.html", "logos.js", "preview.js", "preview.css",
    "logo-treatment.css", "studio.js", "studio.css"].map(file => path.join("logo-preview", file));
  const listFiles = () => fs.readdirSync(artifact, {recursive: true}).map(String)
    .filter(name => fs.statSync(path.join(artifact, name)).isFile()).sort();
  const readArtifact = file => fs.readFileSync(path.join(artifact, file), "utf8");
  const build = spawnSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    env: {...process.env, GITHUB_PAGES_LOGO_PREVIEW: "1"},
  });
  assert.equal(build.status, 0, build.stderr || build.stdout);

  const routes = ["opioidcalculator", "opioidcalculator/site", "logo-preview"];
  for (const route of routes) {
    const generated = readArtifact(path.join(route, "index.html"));
    assert.equal((generated.match(/data-staging-environment/g) || []).length, 0, route);
    assert.doesNotMatch(generated, /Staging environment|For verification only/i);
    assert.match(generated, /<meta name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(generated, /UDS|uds-tool|uds-workflow-guide|__BASE_PATH__|__PREVIEW_/);
    const routeUrl = new URL(`${base}${route}/`, "https://example.test");
    for (const match of generated.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
      const url = new URL(match[1], routeUrl);
      if (url.origin !== routeUrl.origin) continue;
      assert.ok(url.pathname.startsWith(base), `asset escaped project prefix: ${url.pathname}`);
      const relative = url.pathname.slice(base.length);
      assert.ok(fs.existsSync(path.join(artifact, relative)), `missing asset ${relative}`);
    }
  }

  const wrapper = readArtifact("opioidcalculator/index.html");
  assert.match(wrapper, /<iframe[^>]*id="siteFrame"[^>]*src="\.\/site\/"[^>]*title="[^"]+"/);
  assert.match(wrapper, /<noscript>[\s\S]*JavaScript[\s\S]*<\/noscript>/);
  assert.doesNotMatch(wrapper, /data-size=|Site preview width|>Mobile<|>Full width</);
  assert.doesNotMatch(wrapper, /\beight\b/i);
  assert.match(wrapper, /href="\/Equianalgesic_Dosing_Calculator_Staging\/logo-preview\/"/);
  const generatedCalculator = readArtifact("opioidcalculator/site/index.html");
  assert.match(generatedCalculator, /src="\/Equianalgesic_Dosing_Calculator_Staging\/calculator-core\.js\?v=/);
  assert.match(generatedCalculator, /src="\/Equianalgesic_Dosing_Calculator_Staging\/calculator-provenance\.js\?v=/);
  const treatmentLink = generatedCalculator.match(/^[ \t]*<link rel="stylesheet" href="[^"\n]*\/logo-treatment\.css\?v=[^"]+">\r?\n/m);
  assert.ok(treatmentLink, "the iframe adds the separate preview logo treatment");
  const release = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "release.json"), "utf8"));
  for (const file of ["logos.js", "preview.js", "preview.css"]) {
    assert.ok(wrapper.includes(`${file}?v=${release.logoPreviewVersion}`), `${file} cache key`);
  }
  assert.ok(treatmentLink[0].includes(`?v=${release.logoPreviewVersion}`));
  assert.match(publicHtml, /<meta name="robots" content="index, follow"/);
  assert.doesNotMatch(publicHtml, /data-staging-environment|logo-preview|logo-treatment|siteFrame/);

  assert.deepEqual(listFiles(), [...normalFiles, ...previewFiles,
    path.join("opioidcalculator", "site", "index.html"),
    ...logoFiles.map(file => path.join("logo-preview", "assets", file))].sort());
  for (const file of ["calculator-core.js", "calculator-provenance.js", "script.js", "styles.css", "OpioidConversionSite.png"]) {
    assert.deepEqual(fs.readFileSync(path.join(artifact, file)), fs.readFileSync(path.join(repositoryRoot, "public", file)), `${file} remains byte-identical`);
  }
  const vm = require("node:vm");
  const context = {window: {}};
  vm.runInNewContext(readArtifact("logo-preview/logos.js"), context);
  const logos = JSON.parse(JSON.stringify(context.window.logoPreviewCatalog));
  const sourceCatalog = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "logos.json"), "utf8"));
  assert.equal(logos.length, 11);
  assert.deepEqual(logos.map(logo => logo.file), logoFiles);
  assert.deepEqual(logos.map(logo => [logo.id, logo.originalId, logo.title, logo.file,
    [logo.bounds.x, logo.bounds.y, logo.bounds.width, logo.bounds.height]]), selectedDesigns);
  assert.deepEqual(logos.map(({src, ...metadata}) => metadata), sourceCatalog, "all selected metadata survives publication");
  assert.equal(logos[0].kind, "Original · unchanged");
  assert.equal(logos[0].reference, true);
  for (const logo of logos) {
    assert.equal(logo.width, logo.id === "01" ? 1254 : 1536);
    assert.equal(logo.height, logo.id === "01" ? 1254 : 1024);
    assert.ok(Object.values(logo.bounds).every(Number.isFinite), `${logo.id} finite artwork bounds`);
    assert.ok(logo.bounds.x >= 0 && logo.bounds.y >= 0 && logo.bounds.width > 0 && logo.bounds.height > 0,
      `${logo.id} positive artwork bounds`);
    assert.ok(logo.bounds.x + logo.bounds.width <= logo.width && logo.bounds.y + logo.bounds.height <= logo.height,
      `${logo.id} artwork fits its source image`);
    assert.equal(logo.src, `${base}logo-preview/assets/${logo.file}?v=${release.logoPreviewVersion}`);
    assert.deepEqual(fs.readFileSync(path.join(artifact, "logo-preview", "assets", logo.file)),
      fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "assets", logo.file)), `${logo.id} artwork is unchanged`);
  }
  assert.deepEqual(fs.readFileSync(path.join(artifact, "logo-preview", "assets", "01-current.png")),
    fs.readFileSync(path.join(repositoryRoot, "public", "OpioidConversionSite.png")), "original 01 artwork remains byte-identical to the production source");
  const gallery = readArtifact("logo-preview/index.html");
  assert.doesNotMatch(gallery, /06-refinements|Separate from staging|earlier alternative|Six new concepts|\beight\b/i);
  const sitePreviewLink = gallery.match(/<a\b[^>]*href="([^"]+)"[^>]*>\s*Try these logos on the site/i);
  assert.ok(sitePreviewLink, "gallery links back to the working site preview");
  const galleryPreviewUrl = new URL(sitePreviewLink[1], `https://example.test${base}logo-preview/`);
  assert.equal(galleryPreviewUrl.pathname, `${base}opioidcalculator/`);
  assert.equal(galleryPreviewUrl.searchParams.get("logo"), "03", "gallery returns to the selected conversion-grid default");
  const notFound = readArtifact("404.html");
  const redirectScript = notFound.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const route of ["UDS", "UDS/", "UDS.html", "uds", "uds/", "uds.html", "opioidcalculator", "unknown", "uds-tool.js"]) {
    let destination = null;
    vm.runInNewContext(redirectScript, {location: {pathname: base + route, search: "?test=1", hash: "#top", replace: url => {destination = url;}}});
    assert.equal(destination, ["unknown", "uds-tool.js"].includes(route) ? null : `${base}opioidcalculator/?test=1#top`, route);
  }
  assert.match(fs.readFileSync(path.join(artifact, "robots.txt"), "utf8"), /Disallow: \//);
  // Keep the two builds serialized: both clear the same artifact directory.
  const disabledBuild = spawnSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
    cwd: repositoryRoot, encoding: "utf8", env: {...process.env, GITHUB_PAGES_LOGO_PREVIEW: "0"},
  });
  assert.equal(disabledBuild.status, 0, disabledBuild.stderr || disabledBuild.stdout);
  assert.deepEqual(listFiles(), normalFiles.sort(), "disabling the experiment removes every preview file");
  const restoredCalculator = readArtifact("opioidcalculator/index.html");
  assert.equal(restoredCalculator, generatedCalculator.replace(treatmentLink[0], ""), "disabling restores the same calculator without the logo treatment");
  assert.doesNotMatch(restoredCalculator, /logo-preview|logo-treatment|siteFrame/);
  assert.match(restoredCalculator, /<meta name="robots" content="noindex, nofollow"/);
  const wrongRepository = spawnSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
    cwd: repositoryRoot, encoding: "utf8", env: {...process.env, GITHUB_REPOSITORY: "rb666/calc-med"},
  });
  assert.notEqual(wrongRepository.status, 0);
  assert.match(wrongRepository.stderr, /targets .*Staging only/);
});

test("logo preview rejects unselected assets and invalid geometry before publishing artwork", async t => {
  const os = require("node:os");
  const {pathToFileURL} = require("node:url");
  const {prepareLogoPreview} = await import(pathToFileURL(path.join(repositoryRoot, "scripts", "prepare-logo-preview.mjs")).href);
  const sourceCatalog = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "logos.json"), "utf8"));
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "calc-med-logo-allowlist-"));
  t.after(() => {
    // Delete only the exact temporary directory created by this test.
    const resolved = fs.realpathSync(temporaryRoot);
    assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith("calc-med-logo-allowlist-"));
    fs.rmSync(resolved, {recursive: true, force: true});
  });
  const source = path.join(temporaryRoot, "staging", "logo-preview");
  fs.mkdirSync(source, {recursive: true});
  const invalidCatalogs = [
    ["unknown asset", logos => {logos[1].file = "unselected-logo.png";}, /allowlist|catalog|designs/i],
    ["retired SVG", logos => {logos[1].file = "02-conversion-arrows.svg";}, /allowlist|catalog|designs/i],
    ["asset path traversal", logos => {logos[1].file = "../unselected-logo.png";}, /allowlist|catalog|designs/i],
    ["duplicate selection ID", logos => {logos[1].id = "01";}, /allowlist|catalog|designs/i],
    ["extra unselected design", logos => {logos.push({...logos[0], id: "12"});}, /allowlist|catalog|designs/i],
    ["out-of-image bounds", logos => {logos[1].bounds.width = logos[1].width + 1;}, /Invalid artwork bounds/i],
    ["zero wordmark height", logos => {logos[1].wordmarkHeight = 0;}, /Invalid wordmark height/i],
    ["oversized compact scale", logos => {logos[10].compactScale = 2;}, /Invalid compact scale/i],
  ];
  for (const [label, mutate, expectedError] of invalidCatalogs) {
    const logos = structuredClone(sourceCatalog);
    mutate(logos);
    fs.writeFileSync(path.join(source, "logos.json"), JSON.stringify(logos));
    const outputDir = path.join(temporaryRoot, label.replaceAll(" ", "-"));
    await assert.rejects(prepareLogoPreview({root: temporaryRoot, outputDir,
      basePath: "/Equianalgesic_Dosing_Calculator_Staging/", calculatorHtml: "<head></head>", version: "test"}), expectedError, label);
    const assets = path.join(outputDir, "logo-preview", "assets");
    assert.deepEqual(fs.existsSync(assets) ? fs.readdirSync(assets) : [], [], `${label} publishes no artwork`);
  }
});

test("logo preview restores shared tool state without navigating to a focusable fragment", () => {
  const vm = require("node:vm");
  const previewScript = fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "preview.js"), "utf8");
  const logos = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "logos.json"), "utf8"));
  const rootUrl = "https://example.test/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/";
  const cases = [
    ["", "03", null, ""],
    ["#calculatorTabMme", "03", "mme", ""],
    ["?logo=02#calculatorTabConvert", "02", "convert", ""],
    ["?logo=99#calculatorTabMethadone", "03", "methadone", ""],
    ["?logo=05&view=mobile&source=review%20link#calculatorTabBuprenorphine", "05", "buprenorphine", ""],
    ["?logo=08&tool=mme#calculatorTabBenzo", "08", "benzo", ""],
    ["?logo=03&tool=methadone", "03", "methadone", ""],
    ["?logo=04&tool=benzo#conversionReference", "04", "benzo", "#conversionReference"],
    ["?logo=07#unknown", "07", null, "#unknown"],
    ["?logo=06#calculatorTabMme?dose=100", "06", null, "#calculatorTabMme?dose=100"],
    ["?logo=11&tool=convert", "11", "convert", ""],
  ];
  for (const [suffix, expectedLogo, expectedTool, expectedHash] of cases) {
    const location = new URL(`${rootUrl}${suffix}`);
    const state = Object.freeze({entryId: "current-preview"});
    const elements = new Map();
    const select = {replaceChildren() {}, addEventListener() {}, value: ""};
    const frame = {
      src: new URL("site/", rootUrl).href,
      getAttribute: () => "./site/",
      contentDocument: null,
      addEventListener() {},
    };
    elements.set("#logoSelect", select);
    elements.set("#siteFrame", frame);
    const context = {
      window: {logoPreviewCatalog: logos, addEventListener() {}},
      document: {querySelector(selector) {
        if (!elements.has(selector)) elements.set(selector, {addEventListener() {}});
        return elements.get(selector);
      }},
      location, URL, URLSearchParams,
      history: {state, replaceState(nextState, _title, url) {
        assert.equal(nextState, state, "preview navigation retains the existing history state");
        location.href = String(url);
      }},
      Option: function(text, value) {this.text = text; this.value = value;},
    };
    vm.runInNewContext(previewScript, context);
    assert.equal(select.value, expectedLogo, suffix);
    assert.equal(location.searchParams.get("logo"), expectedLogo, suffix);
    assert.equal(location.searchParams.has("view"), false, "removed width toggle does not persist");
    assert.equal(location.searchParams.get("tool"), expectedTool, suffix);
    assert.equal(location.hash, expectedHash, suffix);
    const child = new URL(frame.src);
    assert.equal(child.pathname, new URL("site/", rootUrl).pathname);
    assert.equal(child.hash, expectedHash, "only intentional section links reach the iframe as fragments");
    assert.equal(child.searchParams.get("tool"), expectedTool, "selected tool reaches the iframe as state");
    assert.equal(child.searchParams.has("logo"), false, "logo selection remains a wrapper setting");
    assert.equal(child.searchParams.has("view"), false);
    assert.equal(child.searchParams.get("source"), location.searchParams.get("source"), "other URL context is retained");
  }
});

test("logo preview immediately mirrors a ready calculator and later tool changes without reloading it", () => {
  const vm = require("node:vm");
  const previewScript = fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "preview.js"), "utf8");
  const logos = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "logos.json"), "utf8"));
  const rootUrl = "https://example.test/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/";
  const location = new URL(`${rootUrl}?logo=02&view=mobile`);
  const childLocation = new URL(`${rootUrl}site/?tool=benzo`);
  const state = Object.freeze({entryId: "ready-frame"});
  const parentListeners = new Map();
  const childListeners = new Map();
  const observers = [];
  const tabs = {};
  const doc = {
    URL: childLocation.href,
    readyState: "complete",
    querySelector(selector) {
      if (selector === ".brand-logo-card img") return {};
      if (selector === "#calculatorTabs") return tabs;
      assert.fail(`unexpected DOM access: ${selector}`);
    },
    querySelectorAll(selector) {
      assert.equal(selector, "a[href]");
      return [];
    },
  };
  const frame = {
    // iframe.src retains its attribute even after its document replaces history.
    get src() {return new URL("site/", rootUrl).href;},
    set src(_url) {assert.fail("an already-ready calculator must not reload to synchronize selection");},
    getAttribute: () => "./site/",
    contentDocument: doc,
    contentWindow: {location: childLocation, addEventListener(name, callback) {childListeners.set(name, callback);}},
    addEventListener() {},
  };
  const elements = new Map([["#siteFrame", frame]]);
  const context = {
    window: {logoPreviewCatalog: logos, addEventListener(name, callback) {parentListeners.set(name, callback);}},
    document: {querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {replaceChildren() {}, addEventListener() {}});
      return elements.get(selector);
    }},
    location, URL, URLSearchParams,
    history: {state, replaceState(nextState, _title, url) {
      assert.equal(nextState, state);
      location.href = String(url);
    }},
    Option: function(text, value) {this.text = text; this.value = value;},
    // Image decoding is independent of restoring tool state. Keep it pending to
    // exercise initialization while artwork is still loading.
    Image: class {decode() {return new Promise(() => {});}},
    MutationObserver: class {
      constructor(callback) {this.callback = callback; observers.push(this);}
      observe(element, options) {
        assert.equal(element, tabs);
        assert.equal(options.attributeFilter[0], "aria-selected");
      }
      disconnect() {}
    },
  };
  vm.runInNewContext(previewScript, context);
  assert.equal(location.searchParams.get("logo"), "02");
  assert.equal(location.searchParams.get("tool"), "benzo", "ready child selection is mirrored before image decoding finishes");
  assert.equal(location.hash, "");
  assert.equal(observers.length, 1);
  childLocation.searchParams.set("tool", "methadone");
  observers[0].callback();
  assert.equal(location.searchParams.get("tool"), "methadone", "replaceState tab changes reach the shareable preview URL");
  assert.equal(location.hash, "");
  location.hash = "#conversionReference";
  parentListeners.get("hashchange")();
  assert.equal(childLocation.hash, "#conversionReference", "explicit section navigation still reaches the calculator");
  childListeners.get("hashchange")();
  assert.equal(location.hash, "#conversionReference");
  childLocation.hash = "#calculatorTabMme";
  childListeners.get("hashchange")();
  assert.equal(location.searchParams.get("tool"), "mme");
  assert.equal(location.hash, "", "an explicitly followed tab link becomes refresh-safe shareable state");
  assert.equal(childLocation.hash, "#calculatorTabMme", "the preview leaves the child's explicit anchor action intact");
});
