import { copyFile, lstat, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepareLogoPreview } from "./prepare-logo-preview.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "public");
const outputDir = path.join(root, "dist", "github-pages");
const stagingRepository = "rb666/Equianalgesic_Dosing_Calculator_Staging";
if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== stagingRepository) {
  throw new Error(`This release targets ${stagingRepository} only.`);
}
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "/Equianalgesic_Dosing_Calculator_Staging/";
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(basePath)) throw new Error("Invalid Pages base path");
const calculatorUrl = `${basePath}opioidcalculator/`;
const release = JSON.parse(await readFile(path.join(root, "staging", "release.json"), "utf8"));
if (typeof release.logoPreview !== "boolean") throw new Error("Invalid staging logo-preview setting");
const previewOverride = process.env.GITHUB_PAGES_LOGO_PREVIEW;
if (previewOverride !== undefined && !["0", "1"].includes(previewOverride)) throw new Error("Invalid logo-preview override");
const logoPreviewEnabled = previewOverride === undefined ? release.logoPreview : previewOverride === "1";

// Never recursively remove an output directory through a symlink/junction.
if (path.relative(root, outputDir) !== path.join("dist", "github-pages")) {
  throw new Error("Output must remain inside this workspace");
}
for (const candidate of [path.join(root, "dist"), outputDir]) {
  const stat = await lstat(candidate).catch(error => {
    if (error.code !== "ENOENT") throw error;
    return null;
  });
  if (stat && (!stat.isDirectory() || stat.isSymbolicLink())) throw new Error(`Unsafe output path: ${candidate}`);
}
await rm(outputDir, { recursive: true, force: true });
await mkdir(path.join(outputDir, "opioidcalculator"), { recursive: true });

// Explicit release contents prevent archives, source routes, or backups from leaking into Pages.
const assets = [".nojekyll", "favicon.svg", "OpioidConversionSite.png", "styles.css",
  "calculator-core.js", "calculator-provenance.js", "script.js"];
for (const asset of assets) await copyFile(path.join(sourceDir, asset), path.join(outputDir, asset));
let html = await readFile(path.join(sourceDir, "opioidcalculator.html"), "utf8");
if (/\bUDS\b|uds-tool|uds-workflow-guide/i.test(html)) throw new Error("UDS must remain outside the active calculator");
const robotsTags = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/gi) || [];
if (robotsTags.length !== 1) throw new Error("Expected exactly one robots meta tag before staging adaptation");
html = html.replace(/<meta name="robots" content="[^"]*"\s*\/>/,
  '<meta name="robots" content="noindex, nofollow" />');
if (!html.includes('<meta name="robots" content="noindex, nofollow" />')) {
  throw new Error("Staging HTML must explicitly exclude search indexing");
}
for (const asset of assets) html = html.replaceAll(`="/${asset}`, `="${basePath}${asset}`);
html = html.replaceAll('href="/opioidcalculator"', `href="${calculatorUrl}"`);
if (logoPreviewEnabled) html = await prepareLogoPreview({ root, outputDir, basePath, calculatorHtml: html, version: release.logoPreviewVersion });
await writeFile(path.join(outputDir, "opioidcalculator", "index.html"), html);
for (const name of ["index.html", "opioidcalculator.html"]) {
  await writeFile(path.join(outputDir, name), redirectPage());
}
await writeFile(path.join(outputDir, "404.html"), notFoundPage());
await writeFile(path.join(outputDir, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log(`Prepared ${logoPreviewEnabled ? "temporary logo-preview" : "calculator-only"} Pages artifact at ${outputDir} (${basePath})`);

function redirectPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${calculatorUrl}">
<title>Equianalgesic Dose Calculator</title>
<script>location.replace(${JSON.stringify(calculatorUrl)} + location.search + location.hash);</script>
</head><body><a href="${calculatorUrl}">Continue to the calculator</a></body></html>`;
}

function notFoundPage() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Page unavailable</title></head><body>
<h1>Page unavailable</h1><p>This page is unavailable. <a href="${calculatorUrl}">Open the calculator</a>.</p>
<script>(() => {
  const base = ${JSON.stringify(basePath)};
  if (!location.pathname.startsWith(base)) return;
  const route = location.pathname.slice(base.length).replace(/\\/+$/, "").toLowerCase();
  if (["", "index.html", "opioidcalculator", "opioidcalculator.html", "uds", "uds.html"].includes(route)) {
    location.replace(${JSON.stringify(calculatorUrl)} + location.search + location.hash);
  }
})();</script></body></html>`;
}
