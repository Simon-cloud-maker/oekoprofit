# Stage 3 Prompt: Excel-Upload zur Slider-Befüllung (v1)

## Persona

Use the "Feature Implementer" persona from `prompts/personas/feature-implementer.md`.

## Project Context

- Project name: OekoProfit
- Environment: Single-file browser app, no build step
- Existing UI file: `index.html`
- New feature: Excel-Datei-Upload zur automatischen Vorausfüllung der Umweltkennzahlen-Schieberegler
- Change policy: incremental edits only, preserve existing behavior
- External library: SheetJS via CDN (`https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`)

## Task

Implement an Excel upload feature that pre-fills the five environmental metric sliders from a user-provided `.xlsx` file.

Feature contract:

1. File input (`.xlsx` only) with upload button, placed above the sliders in the "Dateneingabe" tab.
2. SheetJS parses the first sheet; first row = headers, second row = values.
3. Column mapping (case-insensitive): `Strom` → `#strom`, `Gas` → `#gas`, `Wasser` → `#wasser`, `Abfall` → `#abfall`, `Recycling` → `#recycling`.
4. Slider values and display spans are updated; `update()` is called to refresh all derived metrics.
5. Sliders remain manually editable after upload.
6. A status label below the upload button shows the result: success message with filename, or a clear error if mapping fails.
7. Values are clamped to each slider's existing `min`/`max` range.

## Output Requirements

- Use sections in this exact order:
  1. Goal
  2. Plan
  3. Changes
  4. Tests
  5. Verification
  6. Limitations
  7. Run Log Update
- In "Changes", include file-by-file modifications with concrete code blocks.
- In "Tests", include at least:
  - happy path (all 5 columns present)
  - missing column (e.g. no `Recycling` column)
  - value out of slider range
  - non-xlsx file uploaded
- In "Verification", describe exact manual steps including a sample Excel file structure.
- In "Run Log Update", include **append-ready markdown** per `prompts/templates/agent-transparency-contract.md` for:
  - `logs/actions.md`, `memory/short_term.md`, and any of `memory/decisions.md`, `memory/known_issues.md`, `memory/long_term.md` that apply (else "no change" with reason).

## Quality Gate (self-check before final answer)

Before finishing, verify:

- No unrelated refactor included
- Feature is fully testable from UI without backend
- Column mapping logic handles missing or misnamed columns gracefully
- Sliders remain functional after upload (not disabled or hidden)
- run log blocks are ready to append; optional-file "no change" lines are present where needed

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-03-feature.md`.

## Version Metadata

- Prompt ID: stage-03-excel-upload
- Version: v1
- Date: 2026-05-12
- Change note: Initial version — upload + slider pre-fill + status label + clamp logic
