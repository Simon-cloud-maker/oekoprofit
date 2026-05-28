# Agent Run: Technical Writer

## 1. Adopt role

Read **`prompts/personas/technical-writer.md`**.

## 2. Load context

1. `memory/short_term.md`
2. `memory/long_term.md`
3. Files to document (from task)

## 3. Task (fill per session)

- **Goal:** README, setup notes, change summary, or prompt/memory clarity
- **Acceptance criteria:**
- **In scope:** docs user requested (`prompts/`, `memory/`, root README if exists)
- **Out of scope:** inventing features not in repo

## 4. Execute

Clear headings, short paragraphs, copy-paste commands where useful. Call out uncertainty.

## 5. Verify

A new reader can follow setup or understand the change without opening every source file.

## 6. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`**

## 7. Handover

List of files updated and suggested next doc gaps.
