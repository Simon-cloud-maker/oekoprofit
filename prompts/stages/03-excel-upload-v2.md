# Stage 3 Prompt: Excel-Upload zur Slider-Befüllung (v2)

## Persona

Use the "Feature Implementer" persona from `prompts/personas/feature-implementer.md`.

## Project Context

- Project name: OekoProfit
- Environment: Single-file browser app, no build step
- Existing UI file: `index.html`
- Feature: Excel-Upload mit automatischer Einheitenumrechnung (absolute → normierte Kennzahlen)
- Change policy: incremental edits only, preserve existing behavior
- External library: SheetJS via CDN (`https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`)
- Base: v1 already implemented basic upload + direct slider fill

## What Changed Since v1

v1 assumed Excel columns map 1:1 to slider values. Real-world files (e.g. corporate sustainability reports) contain absolute totals (MWh, m³, t). Sliders expect normalized metrics (kWh/m², m³/MA, kg/MA). Solution: require `Mitarbeiter` and `Nutzflaeche_m2` columns in Excel for normalization.

## Task

Update the Excel upload feature to handle real-world absolute values by normalizing them using employee count and floor area from the Excel file itself.

Feature contract:

1. Excel file must contain columns: `Mitarbeiter`, `Nutzflaeche_m2` (exact names, case-insensitive).
2. Column detection uses keyword matching (case-insensitive, partial match):
   - contains `strom` → Stromverbrauch; if unit contains `mwh` → multiply by 1000, divide by Nutzflaeche_m2
   - contains `gas` → Gasverbrauch; same MWh → kWh/m² conversion
   - contains `wasser` → Wasserverbrauch; divide by Mitarbeiter (m³ stays m³)
   - contains `abfall` but not `recycl` → Abfallaufkommen; if unit contains `t` (tonnes) → multiply by 1000, divide by Mitarbeiter
   - contains `recyclingquote` or (`recycl` and `%`) → Recyclingquote; if value < 1 → multiply by 100
3. If `Mitarbeiter` or `Nutzflaeche_m2` is missing and normalization is needed → show error in status label.
4. Sliders remain editable after upload; values clamped to slider min/max.
5. Status label shows: filename, how many values were filled, and which (if any) were skipped.
6. A sample Excel file (`Münchner_Rück_Umweltkennzahlen.xlsx`) serves as the reference test file.

## Output Requirements

- Use sections in this exact order:
  1. Goal
  2. Plan
  3. Changes
  4. Tests
  5. Verification (reference `Münchner_Rück_Umweltkennzahlen.xlsx` as test file with expected output values)
  6. Limitations
  7. Next Steps
  8. Run Log Update
- In "Changes", include the complete updated `handleExcelUpload()` function.
- In "Tests", cover: happy path with MWh data, missing Mitarbeiter column, Recyclingquote as decimal vs percentage, non-xlsx file.
- In "Next Steps", list at least 2 concrete follow-up improvements.
- In "Run Log Update", include append-ready blocks for `logs/actions.md` and `memory/short_term.md`.

## Quality Gate (self-check before final answer)

Before finishing, verify:

- No unrelated refactor included
- Normalization formulas are explicitly documented
- Missing normalization columns produce a clear, actionable error message
- Sliders remain functional after upload
- Run log text is ready to append without reformatting

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-03-feature.md`.

## Version Metadata

- Prompt ID: stage-03-excel-upload
- Version: v2
- Date: 2026-05-12
- Change note: Added normalization logic (MWh→kWh/m², t→kg/MA), Mitarbeiter/Nutzflaeche_m2 columns, keyword-based column detection, Next Steps section
