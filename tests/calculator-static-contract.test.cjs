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
  const logoFiles = ["01-current.png", "02-conversion-arrows.svg", "03-balanced-measures.png",
    "04-transfer-loop.png", "05-clinical-monogram.png", "06-conversion-grid.png",
    "07-typographic-precision.png", "08-shared-baseline.png"];
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
  const logos = Array.from(context.window.logoPreviewCatalog);
  assert.deepEqual(logos.map(logo => logo.file), logoFiles);
  assert.equal(logos[1].kind, "New");
  assert.equal(logos[1].title, "Conversion arrows");
  for (const logo of logos) {
    assert.equal(logo.src, `${base}logo-preview/assets/${logo.file}?v=${release.logoPreviewVersion}`);
    assert.deepEqual(fs.readFileSync(path.join(artifact, "logo-preview", "assets", logo.file)),
      fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "assets", logo.file)), `${logo.id} artwork is unchanged`);
  }
  const gallery = readArtifact("logo-preview/index.html");
  assert.doesNotMatch(gallery, /06-refinements|Separate from staging|earlier alternative|Six new concepts/i);
  const sitePreviewLink = gallery.match(/<a href="([^"]+)">Try all eight on the site/);
  assert.ok(sitePreviewLink, "gallery links back to the working site preview");
  assert.equal(new URL(sitePreviewLink[1], `https://example.test${base}logo-preview/`).pathname, `${base}opioidcalculator/`);
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

test("logo preview preserves shared calculator links and defaults invalid logo choices to original 06", () => {
  const vm = require("node:vm");
  const previewScript = fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "preview.js"), "utf8");
  const logos = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "staging", "logo-preview", "logos.json"), "utf8"));
  const rootUrl = "https://example.test/Equianalgesic_Dosing_Calculator_Staging/opioidcalculator/";
  for (const [search, expectedLogo] of [["", "06"], ["?logo=02", "02"], ["?logo=99", "06"], ["?logo=05&view=mobile&source=review%20link", "05"]]) {
    const location = new URL(`${rootUrl}${search}#calculatorTabMethadone`);
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
      history: {replaceState(_state, _title, url) {location.href = String(url);}},
      Option: function(text, value) {this.text = text; this.value = value;},
    };
    vm.runInNewContext(previewScript, context);
    assert.equal(select.value, expectedLogo, search);
    assert.equal(location.searchParams.get("logo"), expectedLogo, search);
    assert.equal(location.searchParams.has("view"), false, "removed width toggle does not persist");
    assert.equal(location.hash, "#calculatorTabMethadone");
    const child = new URL(frame.src);
    assert.equal(child.pathname, new URL("site/", rootUrl).pathname);
    assert.equal(child.hash, location.hash, "shared calculator link reaches the iframe");
    assert.equal(child.searchParams.has("logo"), false, "logo selection remains a wrapper setting");
    assert.equal(child.searchParams.has("view"), false);
    assert.equal(child.searchParams.get("source"), location.searchParams.get("source"), "other URL context is retained");
  }
});
