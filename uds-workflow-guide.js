(() => {
  "use strict";

  const ROOT_SELECTOR = "#udsModal";
  const GUIDE_ID = "udsWorkflowGuide";
  const BUTTON_ID = "udsWorkflowGuideButton";

  const WORKFLOWS = [
    {
      mode: "interpret",
      label: "Interpret",
      summary:
        "Use this for an actual UDS result. Enter context, expected medications, detected findings, verified absent findings, and specimen validity.",
      action: "Open Interpret",
    },
    {
      mode: "test",
      label: "Choose test",
      summary:
        "Use this before ordering when the clinical question is what test or analyte set is needed.",
      action: "Open Choose test",
    },
    {
      mode: "lookup",
      label: "Lookup",
      summary:
        "Use this for a focused question about one drug, metabolite, class screen, detection window, or assay limitation.",
      action: "Open Lookup",
    },
    {
      mode: "panels",
      label: "Panels",
      summary:
        "Use this to create non-identifying local panel profiles so absent findings are interpreted against the actual reportable analytes.",
      action: "Open Panels",
    },
  ];

  const EXAMPLES = {
    hydrocodoneHydromorphone: {
      label: "Hydrocodone expected; hydromorphone detected",
      summary:
        "Shows source-ambiguous compatibility: hydromorphone can fit hydrocodone metabolism, but is not source-specific alone.",
      fields: {
        context: "chronic_opioid",
        consequence: "moderate",
        resultSource: "lab_definitive",
        method: "definitive",
        panelId: "targeted_definitive",
        validityFlag: "normal",
      },
      expected: ["Hydrocodone"],
      detected: ["Hydromorphone"],
      absent: [],
      absentVerified: false,
    },
    fentanylGenericOpiate: {
      label: "Fentanyl question on a generic opiate screen",
      summary:
        "Shows why a negative generic opiate screen should not be treated as excluding fentanyl or norfentanyl.",
      fields: {
        context: "chronic_opioid",
        consequence: "moderate",
        resultSource: "lab_screen",
        method: "immunoassay",
        panelId: "generic_opiate_screen",
        validityFlag: "normal",
      },
      expected: ["Fentanyl"],
      detected: [],
      absent: ["Norfentanyl"],
      absentVerified: true,
    },
    clonazepamMetabolite: {
      label: "Clonazepam expected; 7-aminoclonazepam detected",
      summary:
        "Shows supportive metabolite logic for a benzodiazepine that may be under-detected by some immunoassays.",
      fields: {
        context: "benzo",
        consequence: "moderate",
        resultSource: "lab_definitive",
        method: "definitive",
        panelId: "targeted_definitive",
        validityFlag: "normal",
      },
      expected: ["Clonazepam"],
      detected: ["7-aminoclonazepam"],
      absent: [],
      absentVerified: false,
    },
  };

  let lastFocusedBeforeGuide = null;
  let installScheduled = false;

  function getRoot() {
    return document.querySelector(ROOT_SELECTOR);
  }

  function getGuideOverlay() {
    return document.querySelector(`#${GUIDE_ID}`);
  }

  function getGuideButton() {
    return document.querySelector(`#${BUTTON_ID}`);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function waitForFrame() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });
  }

  function installWorkflowGuide() {
    const root = getRoot();

    if (!root || !root.querySelector(".uds-shell")) {
      return;
    }

    if (!root.querySelector(`#${BUTTON_ID}`)) {
      injectGuideButton(root);
    }

    if (!root.querySelector(`#${GUIDE_ID}`)) {
      injectGuideDrawer(root);
    }

    if (root.dataset.workflowGuideEvents !== "true") {
      root.addEventListener("click", handleRootClick);
      document.addEventListener("keydown", handleDocumentKeydown, true);
      root.dataset.workflowGuideEvents = "true";
    }
  }

  function scheduleInstall() {
    if (installScheduled) {
      return;
    }

    installScheduled = true;
    window.requestAnimationFrame(() => {
      installScheduled = false;
      installWorkflowGuide();
    });
  }

  function injectGuideButton(root) {
    const header = root.querySelector(".uds-header");
    if (!header) {
      return;
    }

    const existingVersion = header.querySelector(".uds-version");
    const slot = document.createElement("div");
    slot.className = "uds-header-guide-slot";

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.className = "uds-secondary-button uds-guide-button";
    button.type = "button";
    button.setAttribute("aria-controls", GUIDE_ID);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute(
      "aria-label",
      "Open UDS workflow guide for feature orientation and normal workflow usage",
    );
    button.innerHTML = `
      <span class="uds-guide-button-mark" aria-hidden="true">?</span>
      <span>Workflow guide</span>
    `;

    slot.appendChild(button);

    if (existingVersion) {
      header.insertBefore(slot, existingVersion);
      slot.appendChild(existingVersion);
    } else {
      header.appendChild(slot);
    }
  }

  function injectGuideDrawer(root) {
    const template = document.createElement("template");
    template.innerHTML = renderGuideMarkup().trim();
    root.appendChild(template.content.firstElementChild);
  }

  function renderGuideMarkup() {
    return `
      <div class="uds-guide-overlay is-hidden" id="${GUIDE_ID}" aria-hidden="true">
        <aside
          class="uds-guide-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="udsWorkflowGuideTitle"
          aria-describedby="udsWorkflowGuideDescription"
          tabindex="-1"
        >
          <header class="uds-guide-header">
            <div>
              <p class="uds-eyebrow">Orientation</p>
              <h3 id="udsWorkflowGuideTitle">UDS workflow guide</h3>
              <p id="udsWorkflowGuideDescription">
                Use this guide to orient new users without adding permanent clutter to the UDS workspace.
              </p>
            </div>
            <button class="uds-text-button uds-guide-close" data-uds-guide-close type="button">
              Close
            </button>
          </header>

          <div class="uds-guide-body">
            <section class="uds-guide-section">
              <h4>Start with the right workflow</h4>
              <p>
                The UDS page is split by task. Pick the workflow that matches what the reviewer is trying to do right now.
              </p>
              <div class="uds-guide-card-grid">
                ${WORKFLOWS.map(renderWorkflowCard).join("")}
              </div>
            </section>

            <section class="uds-guide-section">
              <h4>Normal result-review workflow</h4>
              <ol class="uds-guide-step-list">
                ${renderWorkflowStep(
                  "0",
                  "Confirm report context first",
                  "Set clinical setting, decision impact, result source, method, and panel profile before relying on interpretation.",
                )}
                ${renderWorkflowStep(
                  "1",
                  "Enter expected medications or substances",
                  "Add what is prescribed, reported, administered, or otherwise expected. This gives the tool a comparison set.",
                )}
                ${renderWorkflowStep(
                  "2",
                  "Enter detected or positive findings",
                  "Add what the report lists as present, positive, or detected. Include metabolites when the report provides them.",
                )}
                ${renderWorkflowStep(
                  "3",
                  "Use tested-but-absent only when verified",
                  "Only add negative or absent analytes when the report actually included them and reported them as absent or negative.",
                )}
                ${renderWorkflowStep(
                  "4",
                  "Check specimen validity",
                  "Use the validity flag or optional validity details when the report provides them. This matters most for negative or absent findings.",
                )}
                ${renderWorkflowStep(
                  "5",
                  "Review the output and copy only what fits",
                  "Use the output as reconciliation support. It should not be treated as proof of dose, timing, impairment, intent, misuse, or diversion.",
                )}
              </ol>
            </section>

            <section class="uds-guide-section">
              <h4>How to read the output</h4>
              <div class="uds-guide-key-grid">
                ${renderKeyCard(
                  "Consistent / expected",
                  "Entered findings can be explained by the expected medication or supportive metabolite pattern.",
                )}
                ${renderKeyCard(
                  "Source-ambiguous",
                  "A finding may be compatible but not source-specific by itself. Timing, cutoff, quantitative pattern, and full report context matter.",
                )}
                ${renderKeyCard(
                  "Unexpected positive",
                  "A detected finding is not explained by the entered expected list and should be clarified or confirmed when consequential.",
                )}
                ${renderKeyCard(
                  "Unexpected negative",
                  "An expected parent or supportive finding is absent on a verified panel. Interpret with timing, cutoff, and validity.",
                )}
                ${renderKeyCard(
                  "Panel / method limitation",
                  "The selected screen or profile may not answer the question. Generic class screens are not definitive analyte lists.",
                )}
                ${renderKeyCard(
                  "Specimen-limited",
                  "Validity issues can make negative or absent findings unreliable, and severe validity problems may require repeat testing or lab input.",
                )}
              </div>
            </section>

            <section class="uds-guide-section">
              <h4>Try safe examples</h4>
              <p>
                These examples use non-identifying demonstration inputs and load directly into Interpret mode.
              </p>
              <div class="uds-guide-card-grid">
                ${Object.entries(EXAMPLES).map(([key, example]) => renderExampleCard(key, example)).join("")}
              </div>
            </section>

            <section class="uds-guide-section">
              <div class="uds-guide-safety-card">
                <strong>Clinical-use boundaries</strong>
                <ul>
                  <li>Do not enter patient names, DOBs, MRNs, accession numbers, order numbers, or other identifiers.</li>
                  <li>Immunoassay results are presumptive and may need definitive confirmation.</li>
                  <li>Absent findings are only meaningful when the analyte was included and reportable.</li>
                  <li>UDS review does not independently prove dose, exact timing, impairment, diversion, misuse, intent, or forensic conclusions.</li>
                </ul>
              </div>
            </section>
          </div>
        </aside>
      </div>
    `;
  }

  function renderWorkflowCard(workflow) {
    return `
      <article class="uds-guide-workflow-card">
        <div>
          <strong>${escapeHtml(workflow.label)}</strong>
          <span>${escapeHtml(workflow.summary)}</span>
        </div>
        <button
          class="uds-text-button"
          data-uds-guide-go="${escapeHtml(workflow.mode)}"
          type="button"
        >
          ${escapeHtml(workflow.action)}
        </button>
      </article>
    `;
  }

  function renderWorkflowStep(number, title, body) {
    return `
      <li class="uds-guide-step">
        <span class="uds-guide-step-number">${escapeHtml(number)}</span>
        <span>
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(body)}</span>
        </span>
      </li>
    `;
  }

  function renderKeyCard(title, body) {
    return `
      <article class="uds-guide-key-card">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(body)}</span>
      </article>
    `;
  }

  function renderExampleCard(key, example) {
    return `
      <article class="uds-guide-example-card">
        <div>
          <strong>${escapeHtml(example.label)}</strong>
          <span>${escapeHtml(example.summary)}</span>
        </div>
        <button
          class="uds-secondary-button"
          data-uds-guide-example="${escapeHtml(key)}"
          type="button"
        >
          Load example
        </button>
      </article>
    `;
  }

  function openGuide() {
    const overlay = getGuideOverlay();
    const button = getGuideButton();
    const root = getRoot();

    if (!overlay || !root) {
      return;
    }

    lastFocusedBeforeGuide =
      document.activeElement instanceof HTMLElement ? document.activeElement : button;

    overlay.classList.remove("is-hidden");
    overlay.setAttribute("aria-hidden", "false");
    root.classList.add("uds-guide-is-open");
    button?.setAttribute("aria-expanded", "true");

    const closeButton = overlay.querySelector("[data-uds-guide-close]");
    const drawer = overlay.querySelector(".uds-guide-drawer");

    window.setTimeout(() => {
      if (closeButton instanceof HTMLElement) {
        closeButton.focus();
      } else if (drawer instanceof HTMLElement) {
        drawer.focus();
      }
    }, 0);
  }

  function closeGuide(options = {}) {
    const { restoreFocus = true } = options;
    const overlay = getGuideOverlay();
    const button = getGuideButton();
    const root = getRoot();

    if (!overlay) {
      return;
    }

    overlay.classList.add("is-hidden");
    overlay.setAttribute("aria-hidden", "true");
    root?.classList.remove("uds-guide-is-open");
    button?.setAttribute("aria-expanded", "false");

    if (restoreFocus) {
      const focusTarget =
        lastFocusedBeforeGuide instanceof HTMLElement
          ? lastFocusedBeforeGuide
          : button;

      window.setTimeout(() => focusTarget?.focus?.(), 0);
    }
  }

  function isGuideOpen() {
    const overlay = getGuideOverlay();
    return Boolean(overlay && !overlay.classList.contains("is-hidden"));
  }

  function focusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      ),
    ).filter((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return Boolean(
        element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length,
      );
    });
  }

  function handleDocumentKeydown(event) {
    if (!isGuideOpen()) {
      return;
    }

    const overlay = getGuideOverlay();
    const drawer = overlay?.querySelector(".uds-guide-drawer");

    if (!drawer) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeGuide();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = focusableElements(drawer);
    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleRootClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest(`#${BUTTON_ID}`)) {
      openGuide();
      return;
    }

    if (target.closest("[data-uds-guide-close]")) {
      closeGuide();
      return;
    }

    const overlay = target.closest(".uds-guide-overlay");
    if (overlay && target === overlay) {
      closeGuide();
      return;
    }

    const workflowButton = target.closest("[data-uds-guide-go]");
    if (workflowButton instanceof HTMLElement) {
      goToWorkflow(workflowButton.dataset.udsGuideGo);
      return;
    }

    const exampleButton = target.closest("[data-uds-guide-example]");
    if (exampleButton instanceof HTMLElement) {
      loadExample(exampleButton.dataset.udsGuideExample);
    }
  }

  function goToWorkflow(mode) {
    const root = getRoot();
    if (!root || !mode) {
      return;
    }

    const navButton = root.querySelector(`[data-mode="${mode}"]`);
    if (navButton instanceof HTMLButtonElement) {
      navButton.click();
    }

    closeGuide({ restoreFocus: false });
    focusUdsMain();
  }

  function focusUdsMain() {
    const root = getRoot();
    const main = root?.querySelector("#udsMain");

    if (main instanceof HTMLElement) {
      main.setAttribute("tabindex", "-1");
      window.setTimeout(() => main.focus({ preventScroll: true }), 0);
      return;
    }

    root?.querySelector(".uds-nav-button.is-active")?.focus?.();
  }

  function dispatchChange(control) {
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function dispatchInput(control) {
    control.dispatchEvent(new Event("input", { bubbles: true }));
  }

  async function setField(fieldName, value) {
    const root = getRoot();
    const control = root?.querySelector(`[data-field="${fieldName}"]`);

    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement)) {
      return false;
    }

    if (control instanceof HTMLInputElement && control.type === "checkbox") {
      control.checked = Boolean(value);
    } else {
      control.value = String(value);
    }

    dispatchChange(control);
    await waitForFrame();
    return true;
  }

  async function setAbsentVerified(verified) {
    const root = getRoot();
    const control = root?.querySelector('input[data-field="absentVerified"]');

    if (!(control instanceof HTMLInputElement)) {
      return false;
    }

    control.checked = Boolean(verified);
    dispatchChange(control);
    await waitForFrame();
    return true;
  }

  async function addChip(key, visibleValue) {
    const root = getRoot();
    const input = root?.querySelector(`[data-chip-input="${key}"]`);

    if (!(input instanceof HTMLInputElement)) {
      return false;
    }

    input.value = visibleValue;
    dispatchInput(input);

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
      }),
    );

    await waitForFrame();
    return true;
  }

  async function clearInterpretEntries() {
    const root = getRoot();
    const clearButton = root?.querySelector('[data-action="clear-interpret"]');

    if (clearButton instanceof HTMLButtonElement) {
      clearButton.click();
      await waitForFrame();
    }
  }

  async function loadExample(exampleKey) {
    const example = EXAMPLES[exampleKey];

    if (!example) {
      return;
    }

    const root = getRoot();
    if (!root) {
      return;
    }

    closeGuide({ restoreFocus: false });

    const interpretButton = root.querySelector('[data-mode="interpret"]');
    if (interpretButton instanceof HTMLButtonElement) {
      interpretButton.click();
      await waitForFrame();
    }

    await clearInterpretEntries();

    await setField("context", example.fields.context);
    await setField("consequence", example.fields.consequence);

    /*
      In uds-tool.js, changing resultSource may auto-set method.
      Set resultSource first, then method, so the example always ends
      in the intended method state.
    */
    await setField("resultSource", example.fields.resultSource);
    await setField("method", example.fields.method);
    await setField("panelId", example.fields.panelId);
    await setField("validityFlag", example.fields.validityFlag);

    for (const expected of example.expected) {
      await addChip("expected", expected);
    }

    for (const detected of example.detected) {
      await addChip("detected", detected);
    }

    await setAbsentVerified(example.absentVerified);

    for (const absent of example.absent) {
      await addChip("absent", absent);
    }

    await setAbsentVerified(example.absentVerified);
    focusUdsMain();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installWorkflowGuide);
  } else {
    installWorkflowGuide();
  }

  const observer = new MutationObserver(scheduleInstall);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
