# Prompt Management System

This folder is a lightweight, versioned prompt system for LLM-driven software development.

## Structure

- `personas/`: reusable role definitions
- `templates/`: reusable prompt building blocks
- `stages/`: assignment prompts for the 3 development stages
- `evaluation/`: scorecards and experiment logs for prompt quality
- `CHANGELOG.md`: prompt version history and rationale

## How To Use

1. Pick a persona from `personas/`.
2. Pick a template from `templates/`.
3. Add your task-specific data (project name, constraints, acceptance criteria).
4. Run the prompt in your preferred LLM.
5. Save improvements as a new prompt version and log changes in `CHANGELOG.md`.

## Recommended Persona Set

For a Wirtschaftsinformatik-oriented software project, this repository now includes a broader team-style persona set:

- `system-architect`
- `repository-scaffolder`
- `feature-implementer`
- `code-reviewer`
- `domain-expert-oekoprofit`
- `technical-writer`

The first three are task-oriented personas for the assignment stages. The added personas support critique, domain validation, and documentation workflows.

## Comparing Prompt Versions (v1 vs v2)

1. Run `v1` and `v2` for the same stage with identical task context.
2. Score both outputs using the matching file in `evaluation/`.
3. Record findings in `evaluation/experiment-log-template.md`.
4. Promote the winning prompt and document the decision in `CHANGELOG.md`.

## Versioning Rules

- Do not overwrite prompts without reason.
- Copy and version with suffixes, e.g. `concept-v1.md`, `concept-v2.md`.
- For each new version, record:
  - what changed
  - why it changed
  - observed result quality

## Recommended Workflow

- Start with a stable base prompt.
- Iterate one variable at a time (persona, context format, constraints).
- Compare outputs against explicit quality criteria:
  - correctness
  - completeness
  - actionability
  - low hallucination risk

This is prompt engineering as infrastructure: reusable, testable, and maintainable.
