# Agent Runs

Use these files to start **agentic coding** in Cursor (or any repo-aware agent). They connect personas, stages, and the transparency contract into one executable workflow.

## How to start

Paste into the agent chat (adjust task line):

```
Follow AGENTS.md and prompts/agent-runs/feature-implementer-run.md.

Task: <one concrete sentence>
Acceptance: <how we know it is done>
In scope: <files>
Out of scope: <files or areas>
```

## Files

| Run | Persona | Typical stage |
|-----|---------|----------------|
| `feature-implementer-run.md` | feature-implementer | `stages/03-feature-v2.md`, Excel-upload v1–v3 |
| `system-architect-run.md` | system-architect | `stages/01-concept-v2.md` |
| `repository-scaffolder-run.md` | repository-scaffolder | `stages/02-repository-v2.md` |
| `code-reviewer-run.md` | code-reviewer | (review only, no stage required) |
| `technical-writer-run.md` | technical-writer | docs/memory updates |
| `domain-expert-run.md` | domain-expert-oekoprofit | domain validation of metrics/UI |

Shared template: `_run-template.md` (copy when adding a new run).

## End of every run

Mandatory: **`prompts/templates/agent-transparency-contract.md`**

Minimum updates:

- `logs/actions.md` — one summarized session
- `memory/short_term.md` — stand + TODOs

Optional when applicable: `memory/decisions.md`, `memory/known_issues.md`, `memory/long_term.md`.

## CI check (GitHub Actions)

Workflow: **`.github/workflows/agent-transparency.yml`**

When these paths change in a PR or push to `main`:

- `index.html`, `benchmarks.js`, `api/**`, `prompts/stages/**`, `prompts/personas/**`

the same change set **must also** include:

- `logs/actions.md`
- `memory/short_term.md`

Local test before push:

```bash
npm run check:transparency
```

Script: `scripts/check-agent-transparency.js` (compare refs with `--base` / `--head` / `--working`).

## Auto commit / push (end of agent run)

Policy: **`prompts/templates/git-automation-policy.md`**

```bash
npm run agent:finish -- "feat(scope): why-focused message"
```

- Runs transparency check on **uncommitted** changes.
- Commits and pushes on **feature branches** by default.
- **Blocks push to `main`** unless `OEKOPROFIT_ALLOW_MAIN_PUSH=1`.
- Skip push: `OEKOPROFIT_AUTO_PUSH=0 npm run agent:finish -- "…"`
