# Agent Run: Code Reviewer

## 1. Adopt role

Read **`prompts/personas/code-reviewer.md`**.

## 2. Load context

1. `memory/short_term.md`
2. `memory/known_issues.md`
3. Recent diff or files named in the task

## 3. Task (fill per session)

- **Goal:** review specific change set or file(s)
- **Acceptance criteria:** findings ordered by severity, actionable fixes, no scope creep rewrites
- **In scope:** files user points to
- **Out of scope:** implementing fixes unless user asks

## 4. Execute

Sections: **Findings**, **Open Questions**, **Suggested Fixes**.

Do not rewrite code unless explicitly requested.

## 5. Verify

Each finding references a file/line or behavior. Distinguish confirmed bugs from risks.

## 6. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`**

If review surfaces a new defect → `memory/known_issues.md`.  
If review confirms a fix → note resolution there.

## 7. Handover

Top 3 items to fix first; whether safe to merge.
