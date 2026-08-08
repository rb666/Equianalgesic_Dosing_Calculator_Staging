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
  path.join(repositoryRoot, "public", "UDS.html"),
  "utf8",
);
const udsToolText = fs.readFileSync(
  path.join(repositoryRoot, "public", "uds-tool.js"),
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
  assert.match(workflow, /node --test tests\/calculator-\*\.test\.cjs/);
  assert.match(workflow, /needs: verify/);
  assert.match(workflow, /if: github\.event_name != 'pull_request'/);
  assert.doesNotMatch(workflow.slice(0, workflow.indexOf("jobs:")), /pages:\s*write|id-token:\s*write/);
  assert.match(workflow, /deploy:[\s\S]*?permissions:[\s\S]*?pages:\s*write[\s\S]*?id-token:\s*write/);
});

test("GitHub Pages build keeps indexing controls without exposing environment notes", () => {
  const build = spawnSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  assert.equal(build.status, 0, build.stderr || build.stdout);

  for (const route of ["opioidcalculator", "UDS"]) {
    const generated = fs.readFileSync(
      path.join(repositoryRoot, "dist", "github-pages", route, "index.html"),
      "utf8",
    );
    assert.equal((generated.match(/data-staging-environment/g) || []).length, 0, route);
    assert.doesNotMatch(generated, /Staging environment|For verification only/i);
    assert.match(generated, /<meta name="robots" content="noindex, nofollow"/);
  }

  const generatedCalculator = fs.readFileSync(
    path.join(
      repositoryRoot,
      "dist",
      "github-pages",
      "opioidcalculator",
      "index.html",
    ),
    "utf8",
  );
  assert.match(generatedCalculator, /src="\.\.\/calculator-core\.js\?v=/);
  assert.match(generatedCalculator, /src="\.\.\/calculator-provenance\.js\?v=/);
  assert.match(publicHtml, /<meta name="robots" content="index, follow"/);
  assert.doesNotMatch(publicHtml, /data-staging-environment/);
});
