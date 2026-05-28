# Agent Run: Feature Implementer

## 1. Adopt role

Read and follow **`prompts/personas/feature-implementer.md`**.

## 2. Load context (in order)

1. `memory/short_term.md`
2. `memory/long_term.md`
3. `memory/known_issues.md` (benchmarks, OpenRouter, Excel upload)
4. `memory/decisions.md` (if touching architecture or deps)

## 3. Pick stage (default by task type)

| Task type | Stage |
|-----------|--------|
| New UI feature in `index.html` | `prompts/stages/03-feature-v2.md` |
| Excel upload | `prompts/stages/03-excel-upload-v3.md` (latest) |

Read the chosen stage fully before editing code.

## 4. Task (fill per session)

- **Goal:**
- **Acceptance criteria:**
- **In scope:** usually `index.html`, sometimes `benchmarks.js`, `api/ki-consulting.js`
- **Out of scope:** unrelated refactors, new frameworks, npm build pipeline

## 5. Execute

Output structure (in chat and in your work):

1. Goal  
2. Plan  
3. Changes (file-by-file)  
4. Tests / manual checks  
5. Verification  
6. Limitations  

Hard rules:

- Incremental edits only in `index.html` unless task says otherwise.
- Keep sliders, score, benchmark bars, and KI flow working.
- API keys stay in Vercel env, not in frontend.

## 6. Verify

Examples:

- Open `index.html`, change sliders → Benchmark tab shows ampel bars + score.
- KI-Beratung on deployed Vercel URL (needs `OPENROUTER_API_KEY`).
- Excel upload: test `.xlsx` with expected columns.

Check stage **Quality Gate** before finishing.

## 7. Document (mandatory)

**`prompts/templates/agent-transparency-contract.md`**

## 8. Handover

State: summary, files touched, verify steps, known limits, suggested next task for `memory/short_term.md`.

## 9. Finish (mandatory — no extra user prompt)

```bash
npm run agent:finish -- "feat(<scope>): <why in one line>"
```

See **`prompts/templates/git-automation-policy.md`**. Update memory/logs **before** running this command.
