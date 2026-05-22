# UDS Content Governance

The UDS module is clinical decision-support content. Treat changes to analytes, relationships, caveats, panel coverage, and interpretation wording as reviewable clinical content, not ordinary UI copy.

## Change Classes

- Class A: Low-risk wording, formatting, labels, and visual layout changes. Requires developer review.
- Class B: Clinical interpretation wording, including bottom lines, pitfalls, next steps, and copied summaries. Requires developer review and clinical reviewer signoff.
- Class C: Rule or evidence changes, including parent/metabolite relationships, assay caveats, detection windows, panel coverage, and source ambiguity. Requires developer review, clinical reviewer signoff, source verification, and validation scenario updates.
- Class D: Intended-use, regulatory, or production safety language changes. Requires clinical governance and legal/regulatory review before production use.

## Required Data Standards

- Every analyte or finding should have a concise clinical bottom line, common pitfall, next step, detection window, and source reference when available.
- Every relationship should identify the source drug/finding, target drug/finding, clinical tag, interpretive strength, concise clue, and source reference.
- Every assay caveat should specify the affected method, affected item or class, severity, and source reference.
- Every panel definition should clearly distinguish included, not included, class-screen-only, and unknown analyte coverage.

## Review Expectations

- Do not mark a clinical item, relationship, caveat, or panel as production-complete without named clinical reviewer signoff and review date.
- Do not treat absent findings as clinically meaningful unless the analyte was included, reportable, and actually reported absent on the ordered panel.
- Do not use UDS output alone to determine dose, exact timing, impairment, diversion, misuse, or adherence certainty.

