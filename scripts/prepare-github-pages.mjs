import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "public");
const outputDir = path.join(root, "dist", "github-pages");

const repositoryName = (process.env.GITHUB_REPOSITORY || "")
  .split("/")
  .filter(Boolean)
  .pop() || path.basename(root);

const basePath = normalizeBasePath(
  process.env.GITHUB_PAGES_BASE_PATH || `/${repositoryName}/`,
);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

await writeFile(
  path.join(outputDir, "index.html"),
  redirectPage(pageUrl("opioidcalculator/"), "Equianalgesic Dose Calculator"),
);

await writeRoutePage("opioidcalculator", "opioidcalculator.html");
await writeRoutePage("UDS", "UDS.html");

await writeFile(
  path.join(outputDir, "opioidcalculator.html"),
  redirectPage(pageUrl("opioidcalculator/"), "Equianalgesic Dose Calculator"),
);

await writeFile(
  path.join(outputDir, "UDS.html"),
  redirectPage(pageUrl("UDS/"), "Urine Drug Screen Tool"),
);

await rewriteGeneratedScript("uds-tool.js");
await writeFile(path.join(outputDir, "404.html"), notFoundRedirectPage());

async function writeRoutePage(routeName, sourceFile) {
  const routeDir = path.join(outputDir, routeName);
  await mkdir(routeDir, { recursive: true });

  const html = await readFile(path.join(sourceDir, sourceFile), "utf8");
  await writeFile(path.join(routeDir, "index.html"), rewriteHtmlForRoute(html));
}

async function rewriteGeneratedScript(fileName) {
  const filePath = path.join(outputDir, fileName);
  const source = await readFile(filePath, "utf8");
  const rewritten = source.replace(
    /href="\/opioidcalculator"/g,
    `href="${pageUrl("opioidcalculator/")}"`,
  );
  await writeFile(filePath, rewritten);
}

function rewriteHtmlForRoute(html) {
  return html
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/>/,
      '<meta name="robots" content="noindex, nofollow" />',
    )
    .replace(
      /<body>/,
      `<body>\n    <aside class="staging-environment-notice" data-staging-environment role="note"><strong>Staging environment</strong><span>For verification only; not the production clinical site.</span></aside>`,
    )
    .replace(/href="\/favicon\.svg/g, 'href="../favicon.svg')
    .replace(/href="\/styles\.css/g, 'href="../styles.css')
    .replace(/href="\/uds-tool\.css/g, 'href="../uds-tool.css')
    .replace(/href="\/uds-workflow-guide\.css/g, 'href="../uds-workflow-guide.css')
    .replace(/src="\/script\.js/g, 'src="../script.js')
    .replace(/src="\/calculator-core\.js/g, 'src="../calculator-core.js')
    .replace(/src="\/calculator-provenance\.js/g, 'src="../calculator-provenance.js')
    .replace(/src="\/uds-tool\.js/g, 'src="../uds-tool.js')
    .replace(/src="\/uds-workflow-guide\.js/g, 'src="../uds-workflow-guide.js')
    .replace(/src="\/OpioidConversionSite\.png/g, 'src="../OpioidConversionSite.png')
    .replace(/href="\/UDS"/g, `href="${pageUrl("UDS/")}"`)
    .replace(/href="\/opioidcalculator"/g, `href="${pageUrl("opioidcalculator/")}"`);
}

function normalizeBasePath(value) {
  const trimmed = String(value || "/").trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

function pageUrl(route) {
  return `${basePath}${String(route).replace(/^\/+/, "")}`;
}

function redirectPage(target, title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
    <meta name="robots" content="noindex" />
    <title>${escapeHtml(title)}</title>
    <script>window.location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <p><a href="${escapeHtml(target)}">Continue to ${escapeHtml(title)}</a></p>
  </body>
</html>
`;
}

function notFoundRedirectPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Redirecting</title>
  </head>
  <body>
    <p>Redirecting to the calculator.</p>
    <script>
      (() => {
        const basePath = ${JSON.stringify(basePath)};
        const routes = {
          "": "opioidcalculator/",
          "index.html": "opioidcalculator/",
          "opioidcalculator": "opioidcalculator/",
          "opioidcalculator.html": "opioidcalculator/",
          "uds": "UDS/",
          "uds.html": "UDS/"
        };
        const path = window.location.pathname;
        const relative = path.startsWith(basePath)
          ? path.slice(basePath.length)
          : path.replace(/^\\/+/, "");
        const key = relative.replace(/\\/+$/g, "").toLowerCase();
        const route = routes[key] || "opioidcalculator/";
        window.location.replace(basePath + route + window.location.search + window.location.hash);
      })();
    </script>
  </body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
