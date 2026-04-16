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

---

## Prompt Version Metadata

- Prompt ID: {{PROMPT_ID}}
- Version: {{VERSION}}
- Date: {{DATE}}
- Author: {{AUTHOR}}
- Changelog note: {{CHANGE_NOTE}}
