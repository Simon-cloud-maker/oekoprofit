# Agent Run: System Architect

## 1. Adopt role

Read **`prompts/personas/system-architect.md`**.

## 2. Load context

1. `memory/short_term.md`
2. `memory/long_term.md`
3. `memory/decisions.md`

## 3. Stage reference

**`prompts/stages/01-concept-v2.md`**

## 4. Task (fill per session)

- **Goal:** architecture brief, trade-offs, or alignment doc — not large code dumps unless asked.
- **Acceptance criteria:**
- **In scope:** docs, `memory/decisions.md`, optional small ADR-style notes
- **Out of scope:** unrelated feature implementation (use feature-implementer run instead)

## 5. Execute

Deliver: context, options, chosen approach, data flow, risks, sequenced next steps (3–5 concrete tasks).

## 6. Verify

Self-check stage **Quality Gate** (no invented tech, assumptions labeled, decision log).

## 7. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`** — especially `memory/decisions.md` for new architectural choices.

## 8. Handover

Append-ready blocks for memory/logs as required by the stage **Run Log Update**.
