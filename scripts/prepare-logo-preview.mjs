import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const logoAssetFiles = [
  '01-current.png', '04-transfer-loop.png', '06-conversion-grid.png',
  '12-serif-grid.png', '15-equals-tile.png', '07-typographic-precision.png',
  '07b-equals-badge.png', '09-open-interval.png', '14b-matched-brackets.png',
  '14c-inline-interval.png', '16-bracketed-masthead.png',
];
const uiFiles = ['preview.css', 'preview.js', 'logo-treatment.css', 'studio.css', 'studio.js'];

export async function prepareLogoPreview({ root, outputDir, basePath, calculatorHtml, version }) {
  if (!/^[A-Za-z0-9-]+$/.test(version)) throw new Error('Invalid logo preview asset version');
  const source = path.join(root, 'staging', 'logo-preview');
  const previewBase = `${basePath}logo-preview/`;
  const output = path.join(outputDir, 'logo-preview');
  const child = path.join(outputDir, 'opioidcalculator', 'site');
  await mkdir(path.join(output, 'assets'), { recursive: true });
  await mkdir(child, { recursive: true });
  const logos = JSON.parse(await readFile(path.join(source, 'logos.json'), 'utf8'));
  if (logos.length !== logoAssetFiles.length || logos.some((logo, i) => logo.id !== String(i + 1).padStart(2, '0') || logo.file !== logoAssetFiles[i])) {
    throw new Error('Logo preview must contain exactly the eleven shortlisted designs in their numbered order');
  }
  for (const logo of logos) {
    const b = logo.bounds;
    if (![logo.width, logo.height, b?.x, b?.y, b?.width, b?.height].every(Number.isFinite) ||
        logo.width <= 0 || logo.height <= 0 || b.x < 0 || b.y < 0 || b.width <= 0 || b.height <= 0 ||
        b.x + b.width > logo.width || b.y + b.height > logo.height) throw new Error(`Invalid artwork bounds: ${logo.id}`);
    if (!logo.reference && (!Number.isFinite(logo.wordmarkHeight) || logo.wordmarkHeight <= 0 || logo.wordmarkHeight > b.height)) {
      throw new Error(`Invalid wordmark height: ${logo.id}`);
    }
    if (logo.compactScale !== undefined && (!Number.isFinite(logo.compactScale) || logo.compactScale <= 0 || logo.compactScale > 1)) {
      throw new Error(`Invalid compact scale: ${logo.id}`);
    }
  }
  for (const file of logoAssetFiles) await copyFile(path.join(source, 'assets', file), path.join(output, 'assets', file));
  for (const file of uiFiles) await copyFile(path.join(source, file), path.join(output, file));
  const catalog = logos.map(logo => ({ ...logo, src: `${previewBase}assets/${logo.file}?v=${version}` }));
  await writeFile(path.join(output, 'logos.js'), `window.logoPreviewCatalog = ${JSON.stringify(catalog, null, 2)};\n`);
  const adapt = html => html.replaceAll('__BASE_PATH__', basePath).replaceAll('__PREVIEW_BASE__', previewBase).replaceAll('__PREVIEW_VERSION__', version);
  const gallery = adapt(await readFile(path.join(source, 'gallery.html'), 'utf8'));
  await writeFile(path.join(output, 'index.html'), gallery);
  await writeFile(path.join(child, 'index.html'), calculatorHtml.replace('</head>', `  <link rel="stylesheet" href="${previewBase}logo-treatment.css?v=${version}">\n  </head>`));
  return adapt(await readFile(path.join(source, 'index.html'), 'utf8'));
}
