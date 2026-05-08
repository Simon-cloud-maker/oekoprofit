# Prompt Management System

This folder is a lightweight, versioned prompt system for LLM-driven software development.

## Structure

- `personas/`: reusable role definitions
- `templates/`: reusable prompt building blocks
- `stages/`: active prompts for the 3 development stages
- `stages/archive/`: archived prompt versions and archive table
- `evaluation/`: scorecards and experiment logs for prompt quality
- `CHANGELOG.md`: prompt version history and rationale

## How To Use

1. Pick a persona from `personas/`.
2. Pick a template from `templates/`.
3. Add your task-specific data (project name, constraints, acceptance criteria).
4. Run the prompt in your preferred LLM.
5. Save improvements as a new prompt version and log changes in `CHANGELOG.md`.

## Prompt Logging vs. Work Logging

There are two different logging layers in this project:

- **Prompt/API logging** (technical telemetry):
  - handled by `api/ki-consulting.js`
  - stored to console and optionally KV/file (`logs/prompt-log.ndjson`)
  - tracks request metadata, hashes, latency, status
- **Work/process logging** (human-readable run trace):
  - written into repository files (`logs/actions.md`, `memory/decisions.md`)
  - tracks what was changed, why it was changed, and what to do next

Both layers are useful and complementary: API logs help with runtime debugging, work logs help with reproducibility and handover.

## Standard Prompt Workflow (Branch -> Persona -> Stage)

Use this sequence for each change cycle:

1. Create or switch to a task branch (e.g. `feature/<topic>`).
2. Select stage prompt by objective:
   - concept work -> `stages/01-concept-v2.md`
   - repository/setup work -> `stages/02-repository-v2.md`
   - implementation work -> `stages/03-feature-v2.md`
3. Select the matching primary persona from the stage prompt.
4. Add project-specific context and acceptance criteria.
5. Run the prompt and execute the resulting implementation steps.
6. Update logs in the same run:
   - append checkpoint to `logs/actions.md`
   - append architectural or policy decisions to `memory/decisions.md`
7. Validate, commit on branch, and prepare review.

## Mandatory Run Logging Contract

For every stage run, append at least one action log entry to `logs/actions.md` using:

- timestamp
- goal
- actions performed
- result
- next step

If any non-trivial decision is made (architecture, dependency, trade-off, security/privacy, prompt policy), append a decision entry to `memory/decisions.md` in the same run.

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
