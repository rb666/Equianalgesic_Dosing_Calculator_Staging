const logos = window.logoPreviewCatalog;
const frame = document.querySelector('#siteFrame');
const select = document.querySelector('#logoSelect');
const status = document.querySelector('#previewStatus');
const error = document.querySelector('#previewError');
const previous = document.querySelector('#previousLogo');
const next = document.querySelector('#nextLogo');
const params = new URLSearchParams(location.search);
let selected = logos.find(logo => logo.id === params.get('logo')) || logos.find(logo => logo.id === '03');
let frameReady = false;
let requestNumber = 0;
let initializedDocument = null;
let tabObserver = null;

select.replaceChildren(...logos.map(logo => new Option(`${logo.id} · ${logo.title}`, logo.id)));
select.value = selected.id;

function syncUrl(source = location) {
  const url = new URL(location.href);
  const sourceUrl = new URL(source.href);
  const tool = sourceUrl.searchParams.get('tool');
  if (tool) url.searchParams.set('tool', tool);
  else url.searchParams.delete('tool');
  url.searchParams.set('logo', selected.id);
  url.searchParams.delete('view');
  url.hash = sourceUrl.hash;
  const legacyTool = /^#calculatorTab(Mme|Convert|Methadone|Buprenorphine|Benzo)$/.exec(url.hash)?.[1].toLowerCase();
  if (legacyTool) {
    url.searchParams.set('tool', legacyTool);
    url.hash = '';
  }
  history.replaceState(history.state, '', url);
}

function announceError(message) {
  error.textContent = message;
  error.hidden = false;
  status.textContent = message;
}

async function showLogo(logo, { reveal = false } = {}) {
  if (!frameReady) return;
  const thisRequest = ++requestNumber;
  const asset = new Image();
  asset.src = new URL(logo.src, location.href).href;
  try {
    await asset.decode();
    if (thisRequest !== requestNumber) return;
    const card = frame.contentDocument.querySelector('.brand-logo-card');
    const image = card?.querySelector('img');
    if (!image) throw new Error('Missing logo card');
    let viewport = card.querySelector('.logo-artwork');
    if (!viewport) {
      viewport = frame.contentDocument.createElement('div');
      viewport.className = 'logo-artwork';
      card.append(viewport);
      viewport.append(image);
    }
    const bounds = logo.bounds;
    card.style.setProperty('--logo-ratio', String(bounds.width / bounds.height));
    card.style.setProperty('--logo-width-per-letter', String(bounds.width / (logo.wordmarkHeight || bounds.height)));
    card.style.setProperty('--logo-compact-scale', String(logo.compactScale || 1));
    card.setAttribute('data-logo-reference', String(Boolean(logo.reference)));
    card.setAttribute('data-logo-compact', String(Boolean(logo.compact)));
    card.setAttribute('data-logo-transparent', String(Boolean(logo.transparent)));
    viewport.style.setProperty('--art-width', `${100 * logo.width / bounds.width}%`);
    viewport.style.setProperty('--art-height', `${100 * logo.height / bounds.height}%`);
    viewport.style.setProperty('--art-left', `${-100 * bounds.x / bounds.width}%`);
    viewport.style.setProperty('--art-top', `${-100 * bounds.y / bounds.height}%`);
    image.width = logo.width;
    image.height = logo.height;
    image.src = asset.src;
    image.alt = logo.id === '01' ? 'Opioid Conversion' : `calc.med — ${logo.title}`;
    card.setAttribute('aria-label', `${logo.title} logo`);
    selected = logo;
    select.value = logo.id;
    syncUrl();
    error.hidden = true;
    frame.title = `Calculator site preview — ${logo.id}: ${logo.title}`;
    status.textContent = `Showing ${logo.id}: ${logo.title}.`;
    // Keep inputs, tool, theme and open dialogs intact while changing artwork.
    if (reveal && !frame.contentDocument.body.classList.contains('modal-open')) {
      const box = card.getBoundingClientRect();
      if (box.top < 0 || box.bottom > frame.contentWindow.innerHeight) {
        card.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  } catch {
    if (thisRequest !== requestNumber) return;
    select.value = selected.id;
    announceError('This logo could not be loaded. The displayed logo is unchanged; choose another design or reload the page.');
  }
}

select.addEventListener('change', () => showLogo(logos.find(logo => logo.id === select.value), { reveal: true }));
function step(direction) {
  const position = logos.findIndex(logo => logo.id === select.value);
  select.value = logos[(position + direction + logos.length) % logos.length].id;
  showLogo(logos.find(logo => logo.id === select.value), { reveal: true });
}
previous.addEventListener('click', () => step(-1));
next.addEventListener('click', () => step(1));

async function initializeFrame() {
  const doc = frame.contentDocument;
  if (doc?.URL === 'about:blank') return;
  if (doc === initializedDocument) return;
  tabObserver?.disconnect();
  frameReady = Boolean(doc?.querySelector('.brand-logo-card img'));
  select.disabled = previous.disabled = next.disabled = !frameReady;
  if (!frameReady) {
    announceError('The calculator preview could not be loaded. Reload this page to restore it.');
    return;
  }
  initializedDocument = doc;
  // Reference sites may block framing; open citations separately so they remain
  // accessible and do not replace the calculator inside the preview.
  for (const link of doc.querySelectorAll('a[href]')) {
    if (new URL(link.href).origin !== location.origin) {
      link.target = '_blank';
      link.relList.add('noopener', 'noreferrer');
    }
  }
  const mirrorSelection = () => syncUrl(frame.contentWindow.location);
  // Calculator tabs use replaceState, so observe their selected state as well
  // as native anchor navigation. Never patch the calculator's own history API.
  tabObserver = new MutationObserver(mirrorSelection);
  const tabs = doc.querySelector('#calculatorTabs');
  if (tabs) tabObserver.observe(tabs, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  frame.contentWindow.addEventListener('hashchange', mirrorSelection);
  mirrorSelection();
  await showLogo(selected);
}

frame.addEventListener('load', initializeFrame);
window.addEventListener('hashchange', () => {
  if (frameReady && frame.contentWindow.location.hash !== location.hash) {
    frame.contentWindow.location.hash = location.hash;
  }
});

syncUrl();
const childUrl = new URL(frame.getAttribute('src'), location.href);
const childParams = new URLSearchParams(location.search);
childParams.delete('logo');
childParams.delete('view');
childUrl.search = childParams.toString();
childUrl.hash = location.hash;
if (frame.src !== childUrl.href) frame.src = childUrl.href;
else if (frame.contentDocument?.readyState === 'complete') initializeFrame();
