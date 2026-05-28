# Agent Run: Repository Scaffolder

## 1. Adopt role

Read **`prompts/personas/repository-scaffolder.md`**.

## 2. Load context

1. `memory/short_term.md`
2. `memory/long_term.md`

## 3. Stage reference

**`prompts/stages/02-repository-v2.md`**

## 4. Task (fill per session)

- **Goal:** scaffold, scripts, folder layout, or onboarding doc — keep aligned with current single-file + Vercel setup.
- **Acceptance criteria:**
- **In scope:** new files only when they add clear DX value
- **Out of scope:** replacing vanilla `index.html` with a framework without explicit user request

## 5. Execute

Provide tree, file purposes, setup commands, Day-1 runbook.

## 6. Verify

Self-check stage **Quality Gate** (consistent scripts, no contradictory instructions).

## 7. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`**

## 8. Handover

What was added, how a new developer runs the project in under 10 minutes.
