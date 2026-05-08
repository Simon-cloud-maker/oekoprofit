# Stage 3 Prompt: Add Feature To Running Local App (v2)

## Persona

Use the "Feature Implementer" persona from `prompts/personas/feature-implementer.md`.

## Project Context

- Project name: OekoProfit
- Environment: running local app
- Existing UI file: `index.html`
- New feature: Savings Simulator
- Change policy: incremental edits only, preserve existing behavior

## Task

Implement the Savings Simulator feature end-to-end in the local app.

Feature contract:

1. Input form with at least two parameters (for example usage frequency and unit cost).
2. Deterministic calculation for:
  - estimated CO2 reduction
  - estimated monetary savings
3. Live result rendering after user interaction.
4. Validation rules and clear feedback for invalid input.
5. Manual test checklist for normal and edge cases.

## Output Requirements

- Use sections in this exact order:
  1. Goal
  2. Plan
  3. Changes
  4. Tests
  5. Verification
  6. Limitations
  7. Run Log Update
- In "Changes", include file-by-file modifications.
- In "Tests", include at least:
  - happy path
  - empty input
  - invalid numeric input
  - boundary value
- In "Verification", provide commands or exact local actions.
- In "Run Log Update", include concrete append-ready text blocks for:
  - `logs/actions.md`
  - `memory/decisions.md` (if decisions were made)

## Quality Gate (self-check before final answer)

Before finishing, verify:

- no unrelated refactor included
- feature behavior is testable from UI only
- formula assumptions are explained
- at least one edge-case handling is demonstrated
- run log text is ready to append without reformatting

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-03-feature.md`.

## Version Metadata

- Prompt ID: stage-03-feature
- Version: v2
- Date: 2026-04-16
- Change note: Added strict section contract, test matrix requirements, and quality gate
