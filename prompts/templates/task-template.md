# Reusable Prompt Template

Use this template to compose a versioned prompt from interchangeable parts.

---

## Persona

{{PASTE_PERSONA}}

## Project Context

- Project: {{PROJECT_NAME}}
- Domain: {{DOMAIN}}
- Core users: {{TARGET_USERS}}
- Non-goals: {{NON_GOALS}}
- Existing stack: {{STACK}}
- Constraints: {{CONSTRAINTS}}

## Task

{{TASK_DESCRIPTION}}

## Acceptance Criteria

1. {{CRITERION_1}}
2. {{CRITERION_2}}
3. {{CRITERION_3}}

## Output Requirements

- Output format: {{OUTPUT_FORMAT}}
- Level of detail: {{DETAIL_LEVEL}}
- Include risks and assumptions: yes
- Include next implementation steps: yes

## Quality Guardrails

- Avoid fabricated dependencies or APIs.
- Mark uncertain statements as assumptions.
- Prefer minimal complexity and explain trade-offs.

## Execution Logging Contract (Mandatory)

Follow **`prompts/templates/agent-transparency-contract.md`** before finalizing output.

Summary:

1. **`logs/actions.md`** — one session summary (goal, key actions, outcome, next step; no fine-grained dump).
2. **`memory/short_term.md`** — current stand and TODOs.
3. **`memory/decisions.md`** — if non-trivial decisions (architecture, tooling, privacy, process).
4. **`memory/known_issues.md`** — if errors, regressions, or fixes to listed issues appeared.
5. **`memory/long_term.md`** — only for stable, reusable insights (not ephemeral tasks).

In the final **Verification** section, list which of these files were updated (or state **no change** for optional files with a one-line reason).

**Meta:** If this run defines or extends the logging rules themselves, that change must also be reflected in the same log/memory files.

---

## Prompt Version Metadata

- Prompt ID: {{PROMPT_ID}}
- Version: {{VERSION}}
- Date: {{DATE}}
- Author: {{AUTHOR}}
- Changelog note: {{CHANGE_NOTE}}
