# Stage 1 Prompt: Explain Core Concept (v2)

## Persona

Use the "System Architect" persona from `prompts/personas/system-architect.md`.

## Project Context

- Project name: OekoProfit
- Domain: sustainability and business optimization
- Goal: quantify ecological actions and connect them to business outcomes
- Current state: pre-implementation architecture alignment
- Constraints: practical MVP scope, low implementation risk, clear assumptions

## Task

Produce an architecture brief for OekoProfit that a small team can implement in 2-4 sprints.

Required sections:

1. Context and problem framing
2. Candidate architecture options (at least 2)
3. Selected architecture and rationale
4. Core data entities and data flow
5. Risks, trade-offs, and mitigations
6. MVP implementation plan by sprint
7. Run Log Update (see `prompts/templates/agent-transparency-contract.md`)

## Output Requirements

- Use concise headings and bullets.
- Explicitly label assumptions and unknowns.
- Include one "Decision Log" table with:
  - decision
  - alternatives considered
  - reason selected
- End with exactly 5 engineering tasks, each with expected output artifact.
- In "Run Log Update", include **append-ready markdown** for each file you change:
  - `logs/actions.md` (one summarized session)
  - `memory/short_term.md`
  - `memory/decisions.md` (or "no change" if nothing new beyond the table above)
  - `memory/known_issues.md` (or "no change")
  - `memory/long_term.md` (or "no change" — only stable insights)

## Quality Gate (self-check before final answer)

Before finishing, verify:

- no invented technologies
- no missing data-flow explanation
- risks include both technical and product risks
- implementation plan includes sequence and dependencies
- run log blocks are ready to append; optional-file "no change" lines are present where needed

## Evaluation Hook

Optimize for high score in `prompts/evaluation/scorecard-stage-01-concept.md`.

## Version Metadata

- Prompt ID: stage-01-concept
- Version: v2
- Date: 2026-04-16
- Change note: Added option analysis, decision logging, measurable quality gate, and full agent transparency logging (`agent-transparency-contract.md`)
