# Stage 2 Prompt: Generate Repository Scaffold (v2)

## Persona

Use the "Repository Scaffolder" persona from `prompts/personas/repository-scaffolder.md`.

## Project Context

- Project name: OekoProfit
- Product type: web application MVP
- Initial capabilities: ecological action tracking, simple impact estimation, basic reporting view
- Team context: small team, quick onboarding, predictable builds
- Constraints: low dependency footprint, clear extension path for backend

## Task

Generate a repository scaffold that can be cloned and run by a new developer in under 10 minutes.

Required deliverables:

1. File tree
2. Required files with content
3. Optional files/placeholders with purpose
4. Scripts and setup commands
5. Rationale for major structure and tooling choices
6. Run Log Update (see `prompts/templates/agent-transparency-contract.md`)

## Output Requirements

- Present files in this order:
  - foundation/config
  - app code
  - quality/testing
  - docs
- For each file include:
  - Required/Optional tag
  - one-line purpose
  - content or placeholder content
- Include "Day-1 Runbook" with copy-paste commands.
- Include "Day-2 Extension Plan" with 3 concrete next improvements.
- In "Run Log Update", include **append-ready markdown** for each file you change:
  - `logs/actions.md` (one summarized session)
  - `memory/short_term.md`
  - `memory/decisions.md` (or "no change")
  - `memory/known_issues.md` (or "no change")
  - `memory/long_term.md` (or "no change" — only stable insights)

## Quality Gate (self-check before final answer)

Before finishing, verify:

- no contradictory scripts
- setup commands are complete and ordered
- no unnecessary boilerplate
- structure supports future backend addition without reorganization
- run log blocks are ready to append; optional-file "no change" lines are present where needed

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-02-repository.md`.

## Version Metadata

- Prompt ID: stage-02-repository
- Version: v2
- Date: 2026-04-16
- Change note: Added onboarding runtime target, ordered output contract, quality gate, and full agent transparency logging (`agent-transparency-contract.md`)
