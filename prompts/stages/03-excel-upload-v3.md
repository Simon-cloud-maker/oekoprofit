# Stage 3 Prompt: Excel-Upload zur Slider-Befüllung (v3)

## Persona

Use the "Feature Implementer" persona from `prompts/personas/feature-implementer.md`.

## Project Context

- Project name: OekoProfit
- Environment: Single-file browser app, no build step
- Existing UI file: `index.html`
- Feature: Excel-Upload – Betrieb und Branche automatisch aus Excel übernehmen
- Change policy: incremental edits only, preserve existing behavior
- Base: v2 already handles normalization (MWh→kWh/m², t→kg/MA, keyword matching)

## What Changed Since v2

v2 fills sliders from Excel. New requirement: also read company name (`Betrieb`) and sector (`Branche`) from Excel and update the UI accordingly — the header label "Betrieb: Muster GmbH" and the branch dropdown.

## Task

Extend `handleExcelUpload()` to detect and apply `Betrieb` and `Branche` columns from the Excel file.

Feature contract:

1. Column `Betrieb` (case-insensitive) → update the text node in `.sub` that shows "Betrieb: Muster GmbH" to "Betrieb: <value>".
2. Column `Branche` (case-insensitive) → map to dropdown value via keyword matching (case-insensitive):
   - contains `gastro` → `gastro`
   - contains `handel` or `einzel` → `handel`
   - contains `büro` or `buro` or `verwaltung` → `buero`
   - contains `produktion` or `fertigung` or `industrie` → `produktion`
3. If `Branche` maps successfully → set `#branche` select value, update `#branche-badge` text, call `update()`.
4. If no match found for `Branche` → skip silently (do not show error).
5. Status label already updated by v2 logic; no change to its format needed.

## Output Requirements

- Use sections in this exact order:
  1. Goal
  2. Plan
  3. Changes (show only the delta to v2 handleExcelUpload — the Betrieb/Branche block to append)
  4. Tests
  5. Verification (use Münchner_Rück_Umweltkennzahlen.xlsx as test file)
  6. Limitations
  7. Next Steps
  8. Run Log Update
- In "Tests", cover: both columns present, unknown Branche value, missing Betrieb column.

## Quality Gate (self-check before final answer)

Before finishing, verify:

- No unrelated refactor included
- Branche mapping is case-insensitive and keyword-based
- Unknown Branche value fails silently (no error shown)
- `update()` is called after dropdown change so score recalculates

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-03-feature.md`.

## Version Metadata

- Prompt ID: stage-03-excel-upload
- Version: v3
- Date: 2026-05-12
- Change note: Added Betrieb label update and Branche dropdown mapping from Excel columns
