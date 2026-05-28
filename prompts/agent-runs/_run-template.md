# Agent Run: {{PERSONA_NAME}}

## 1. Adopt role

Read and follow **`prompts/personas/{{PERSONA_FILE}}`**.

## 2. Load context (in order)

1. `memory/short_term.md`
2. `memory/long_term.md` (architecture skim)
3. `memory/known_issues.md` (if relevant)
4. `memory/decisions.md` (if relevant)

## 3. Task (fill per session)

- **Goal:**
- **Acceptance criteria:**
- **In scope (files):**
- **Out of scope:**
- **Stage reference (optional):** `prompts/stages/{{STAGE_FILE}}`

## 4. Execute

- Plan before large edits.
- Minimal diff; preserve unrelated behavior.
- Document assumptions in the response if needed.

## 5. Verify

- List concrete verification steps (browser, API, file checks).
- Self-check against the stage **Quality Gate** when a stage is linked.

## 6. Document (mandatory)

Apply **`prompts/templates/agent-transparency-contract.md`**.

## 7. Handover

Reply with: summary, files changed, how to verify, open risks, next step.

## 8. Finish (mandatory)

```bash
npm run agent:finish -- "<type>(scope): message>"
```

See **`prompts/templates/git-automation-policy.md`**. Update memory/logs before this step.
