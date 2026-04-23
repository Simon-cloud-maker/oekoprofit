# Stage 3 Prompt: Add Feature To Running Local App

## Persona

Use the "Feature Implementer" persona from `prompts/personas/feature-implementer.md`.

## Project Context

- Project name: OekoProfit
- Environment: local running app
- Existing file: `index.html`
- Feature target: add "Savings Simulator" interaction to estimate ecological and financial impact from user input
- Constraints: preserve existing behavior and keep changes incremental

## Task

Implement a new "Savings Simulator" feature in the local OekoProfit app.

Feature requirements:

1. Add an input form for at least two user-controlled parameters.
2. Compute estimated CO2 reduction and monetary savings from the inputs.
3. Render live results in the UI.
4. Add basic validation and user-friendly error messages.
5. Keep code readable and easy to review.

## Output Requirements

- Use sections: Goal, Plan, Changes, Tests, Verification
- Reference exact files changed
- Include a short explanation of formulas/logic
- Include manual test steps for local verification
- End with limitations and next improvements

## Guardrails

- Do not refactor unrelated areas
- Do not break existing layout and interaction
- State assumptions clearly if app context is incomplete

## Version Metadata

- Prompt ID: stage-03-feature
- Version: v1
- Date: 2026-04-16
- Change note: Initial local feature implementation prompt
