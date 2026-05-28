# Agent Run: Domain Expert (ÖKOPROFIT)

## 1. Adopt role

Read **`prompts/personas/domain-expert-oekoprofit.md`**.

## 2. Load context

1. `memory/long_term.md`
2. `benchmarks.js`
3. `known-issues.md` (repo root — benchmark limitations)
4. `memory/known_issues.md` (technical issues)

## 3. Task (fill per session)

- **Goal:** validate metrics, benchmarks, UI labels, or KI prompt plausibility for ÖKOPROFIT/KMU context
- **Acceptance criteria:**
- **In scope:** domain review, suggested corrections to `benchmarks.js` or copy in `index.html` / prompts
- **Out of scope:** legal/compliance claims without sources

## 4. Execute

Sections: **Domain Check**, **Metric Logic**, **Risks**, **Recommendations**.

Label weak assumptions explicitly.

## 5. Verify

Recommendations tie to concrete fields in `benchmarks.js` or visible UI metrics.

## 6. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`**

Stable domain facts → `memory/long_term.md`.  
Questionable benchmarks → `known-issues.md` or `memory/known_issues.md`.

## 7. Handover

Priority list for domain validation before demo or submission.
