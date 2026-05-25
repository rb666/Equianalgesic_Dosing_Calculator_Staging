(() => {
  "use strict";

  const ROOT_SELECTOR = "#udsModal";
  const GUIDE_ID = "udsWorkflowGuide";
  const BUTTON_ID = "udsWorkflowGuideButton";

  const WORKFLOWS = [
    {
      mode: "interpret",
      label: "Interpret",
      kicker: "Review a result",
      summary: "Reconcile expected medications, detected findings, verified absent findings, panel coverage, and validity.",
      steps: [
        ["Set report context", "Choose clinical setting, decision impact, result source, method, panel profile, and validity first."],
        ["Enter expected and detected findings", "Expected entries are the comparison set; detected entries are what the report says is present."],
        ["Use absent findings only when verified", "Only enter tested-but-absent analytes when the report included and reported them as absent or negative."],
        ["Read the output by severity", "Safety, validity, panel and profile limits, and next step should guide what needs action before charting."],
      ],
      keys: [
        ["Consistent and expected", "Compatible with current entries, assuming timing, cutoff, and validity fit."],
        ["Panel-dependent", "The selected test and profile may not answer the clinical question."],
        ["Unexpected positive or negative", "Clarify context or confirm when the result affects care."],
      ],
    },
    {
      mode: "test",
      label: "Choose test",
      kicker: "Before ordering",
      summary: "Match the test to the clinical question before relying on a class screen or absent result.",
      steps: [
        ["Start with the question", "Identify whether you need a class screen, a specific analyte, a metabolite, or a definitive confirmation."],
        ["Check known blind spots", "Generic opiate and benzodiazepine screens may miss important synthetic or assay-dependent targets."],
        ["Escalate when consequences are high", "Use targeted or definitive testing when the result may change care, safety planning, or prescribing."],
      ],
      keys: [
        ["Screening", "Fast and useful for broad triage, but presumptive."],
        ["Definitive", "Specific but still limited to included and reportable analytes."],
        ["Panel fit", "The right test is the one that answers the specific clinical question."],
      ],
    },
    {
      mode: "lookup",
      label: "Lookup",
      kicker: "Focused reference",
      summary: "Search a drug, metabolite, class, or assay issue when you need a quick interpretation anchor.",
      steps: [
        ["Search one concept", "Use the lookup for a single drug, metabolite, class screen, or finding."],
        ["Check what it supports", "Review metabolism, assay limitations, and detection-window caveats before applying it to a result."],
        ["Return to Interpret for reconciliation", "Lookup is reference context; Interpret is where the full pattern and panel profile are reconciled."],
      ],
      keys: [
        ["Metabolites", "Can support exposure or metabolism, but may not be source-specific."],
        ["Class screens", "May not map to individual analytes."],
        ["Detection windows", "Support rough context only, not exact timing or impairment."],
      ],
    },
    {
      mode: "panels",
      label: "Panels",
      kicker: "Local setup",
      summary: "Create non-identifying local profiles so absent findings are judged against actual reportable analytes.",
      steps: [
        ["Map coverage honestly", "Use included, class screen only, assay-dependent, or known not included for each analyte."],
        ["Prefer local profiles over demos", "Demo profiles are orientation aids, not verified clinical panels."],
      ],
      keys: [
        ["Included", "Reportable analyte."],
        ["Assay-dependent", "Verify exact method, cutoff, and reporting rules."],
        ["Not included", "Do not interpret absence as clinically meaningful."],
      ],
    },
  ];

  const EXAMPLES = {
    hydrocodoneHydromorphone: {
      label: "Hydrocodone expected; hydromorphone detected",
      summary: "Shows source-ambiguous compatibility without treating the finding as proof of source.",
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
      summary: "Shows why a negative generic opiate screen should not be treated as excluding fentanyl.",
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
      summary: "Shows supportive metabolite logic and why benzodiazepine screens can be assay-dependent.",
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

  let guideState = {
    mode: "interpret",
    loadedMessage: "",
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

  function currentUdsMode() {
    const root = getRoot();
    const active = root?.querySelector(".uds-nav-button.is-active");
    return active instanceof HTMLElement ? active.dataset.mode || "interpret" : "interpret";
  }

  function workflowForMode(mode) {
    return WORKFLOWS.find((workflow) => workflow.mode === mode) || WORKFLOWS[0];
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
    button.setAttribute("aria-label", "Open UDS workflow guide");
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
                Pick a workflow below.
              </p>
            </div>
            <button class="uds-text-button uds-guide-close" data-uds-guide-close type="button">
              Close
            </button>
          </header>

          <div class="uds-guide-body">
            ${renderGuideBody()}
          </div>
        </aside>
      </div>
    `;
  }

  function renderGuideBody() {
    return `
      ${renderWorkflowSelector()}
      ${renderFocusedGuide()}
      ${renderGuideSafety()}
    `;
  }

  function renderWorkflowSelector() {
    return `
      <section class="uds-guide-section uds-guide-picker" aria-label="Workflow guide selector">
        <h4>Choose a guide</h4>
        <p>Use these as tutorial selectors, not close-and-navigate links.</p>
        <div class="uds-guide-selector-grid">
          ${WORKFLOWS.map(renderWorkflowCard).join("")}
        </div>
      </section>
    `;
  }

  function renderWorkflowCard(workflow) {
    const active = workflow.mode === guideState.mode;

    return `
      <button
        class="uds-guide-workflow-card${active ? " is-active" : ""}"
        data-uds-guide-go="${escapeHtml(workflow.mode)}"
        type="button"
        aria-pressed="${active ? "true" : "false"}"
      >
        <span class="uds-guide-workflow-label">${escapeHtml(workflow.label)}</span>
        <span class="uds-guide-workflow-kicker">${escapeHtml(workflow.kicker)}</span>
        <span class="uds-guide-workflow-summary">${escapeHtml(workflow.summary)}</span>
      </button>
    `;
  }

  function renderFocusedGuide() {
    const workflow = workflowForMode(guideState.mode);

    return `
      <section class="uds-guide-focus-panel" data-uds-guide-focus-panel tabindex="-1">
        <div class="uds-guide-focus-head">
          <p class="uds-eyebrow">Current tutorial</p>
          <h4>${escapeHtml(workflow.label)}: ${escapeHtml(workflow.kicker)}</h4>
          <p>${escapeHtml(workflow.summary)}</p>
        </div>

        ${guideState.loadedMessage ? `<div class="uds-guide-loaded-note">${escapeHtml(guideState.loadedMessage)}</div>` : ""}

        <div class="uds-guide-section">
          <h4>Do this first</h4>
          <ol class="uds-guide-step-list">
            ${workflow.steps.map(([title, body], index) => renderWorkflowStep(index + 1, title, body)).join("")}
          </ol>
        </div>

        ${renderWorkflowKeys(workflow)}
        ${workflow.mode === "interpret" ? renderExampleSection() : ""}
      </section>
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

  function renderWorkflowKeys(workflow) {
    return `
      <div class="uds-guide-section">
        <h4>What to watch</h4>
        <div class="uds-guide-key-grid">
          ${workflow.keys.map(([title, body]) => renderKeyCard(title, body)).join("")}
        </div>
      </div>
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

  function renderExampleSection() {
    return `
      <div class="uds-guide-section">
        <h4>Load a safe example</h4>
        <p>Examples use non-identifying demonstration inputs and keep this guide open.</p>
        <div class="uds-guide-card-grid">
          ${Object.entries(EXAMPLES).map(([key, example]) => renderExampleCard(key, example)).join("")}
        </div>
      </div>
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

  function renderGuideSafety() {
    return `
      <section class="uds-guide-section">
        <div class="uds-guide-safety-card">
          <strong>Boundaries</strong>
          <ul>
            <li>Absent findings require verified panel coverage.</li>
            <li>UDS review does not prove dose, timing, impairment, intent, misuse, diversion, or forensic conclusions.</li>
          </ul>
        </div>
      </section>
    `;
  }

  function updateGuideBody(options = {}) {
    const { scrollToFocus = false } = options;
    const overlay = getGuideOverlay();
    const body = overlay?.querySelector(".uds-guide-body");

    if (!body) {
      return;
    }

    const template = document.createElement("template");
    template.innerHTML = renderGuideBody().trim();
    body.replaceChildren(...template.content.childNodes);

    if (scrollToFocus) {
      scrollGuideToFocus();
    }
  }

  function scrollGuideToFocus() {
    const overlay = getGuideOverlay();
    const body = overlay?.querySelector(".uds-guide-body");
    const panel = overlay?.querySelector("[data-uds-guide-focus-panel]");

    if (!(body instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    window.requestAnimationFrame(() => {
      const bodyRect = body.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const top = body.scrollTop + panelRect.top - bodyRect.top - 6;
      body.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      panel.focus({ preventScroll: true });
    });
  }

  function syncUnderlyingWorkflow(mode) {
    const root = getRoot();

    if (!root || !mode) {
      return;
    }

    if (currentUdsMode() === mode) {
      return;
    }

    const navButton = root.querySelector(`[data-mode="${mode}"]`);
    if (navButton instanceof HTMLButtonElement) {
      navButton.click();
    }
  }

  function setGuideMode(mode) {
    if (!mode || !WORKFLOWS.some((workflow) => workflow.mode === mode)) {
      return;
    }

    guideState = {
      mode,
      loadedMessage: "",
    };

    syncUnderlyingWorkflow(mode);
    updateGuideBody({ scrollToFocus: true });
  }

  function openGuide() {
    const overlay = getGuideOverlay();
    const button = getGuideButton();
    const root = getRoot();

    if (!overlay || !root) {
      return;
    }

    guideState = {
      mode: currentUdsMode(),
      loadedMessage: "",
    };
    updateGuideBody();

    lastFocusedBeforeGuide =
      document.activeElement instanceof HTMLElement ? document.activeElement : button;

    overlay.classList.remove("is-hidden");
    overlay.setAttribute("aria-hidden", "false");
    root.classList.add("uds-guide-is-open");
    button?.setAttribute("aria-expanded", "true");

    const firstWorkflow = overlay.querySelector("[data-uds-guide-go]");
    const drawer = overlay.querySelector(".uds-guide-drawer");

    window.setTimeout(() => {
      if (firstWorkflow instanceof HTMLElement) {
        firstWorkflow.focus();
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
      event.stopPropagation();
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
      setGuideMode(workflowButton.dataset.udsGuideGo);
      return;
    }

    const exampleButton = target.closest("[data-uds-guide-example]");
    if (exampleButton instanceof HTMLElement) {
      loadExample(exampleButton.dataset.udsGuideExample);
    }
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
    await waitForFrame();

    const options = Array.from(
      root.querySelectorAll(`[data-action="pick-chip"][data-key="${key}"]`),
    );
    const normalizedValue = visibleValue.trim().toLowerCase();
    const exactOption = options.find((option) => {
      const optionName = option.querySelector(".uds-picker-name")?.textContent || "";
      return optionName.trim().toLowerCase() === normalizedValue;
    });
    const pickerOption = exactOption || (options.length === 1 ? options[0] : null);

    if (pickerOption instanceof HTMLButtonElement) {
      pickerOption.click();
      await waitForFrame();
      return true;
    }

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

    if (!example || !getRoot()) {
      return;
    }

    guideState = {
      mode: "interpret",
      loadedMessage: "",
    };

    syncUnderlyingWorkflow("interpret");
    await waitForFrame();
    await clearInterpretEntries();

    await setField("context", example.fields.context);
    await setField("consequence", example.fields.consequence);
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

    guideState = {
      mode: "interpret",
      loadedMessage: `Loaded example: ${example.label}.`,
    };
    updateGuideBody({ scrollToFocus: true });
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
