# Agent Transparency — Run Documentation Contract

Use after every run that changes code, prompts, or shared project understanding (Moodle: **transparent agent actions**).

## Always update (same session)

1. **`logs/actions.md`** — **Exactly one** summarized session entry (no step-by-step spam): date, persona/stage, goal, main actions, outcome, next step.
2. **`memory/short_term.md`** — Current stand, open TODOs, immediate next step.

## Update when applicable

3. **`memory/decisions.md`** — Non-trivial decisions (architecture, dependencies, security/privacy, prompt/process policy): context, decision, alternatives, rationale, impact.
4. **`memory/known_issues.md`** — New bugs, regressions, deployment/env failures, unclear root causes, or **resolution** of a listed issue (keep entries short and actionable).
5. **`memory/long_term.md`** — **Only** stable, reusable facts (architecture, data flow, naming conventions). **Do not** put ephemeral tasks, one-off errors, or session chatter here.

## Content to capture explicitly

- **Decisions** taken during the run (even small ones, if they affect future work).
- **Actions** performed (high level — details belong in commit messages or PRs).
- **Recognized errors** or risks (what broke, what was unclear, what to watch next time).

## Prompt output: “Run Log Update”

When a stage prompt includes **Run Log Update**, provide **append-ready markdown blocks** for each file you touched. For optional files, write **“no change”** with one line why.

## Not the same as API prompt logging

- **`api/ki-consulting.js`** (optional KV / NDJSON / stdout): technical telemetry for API calls.
- **`/logs` and `/memory`**: human-readable trace for handover, review, and coursework transparency.
