# Agent instructions (ÖKOPROFIT KI-Dashboard)

This repository uses **persona-based agent runs** on top of the versioned prompt system in `prompts/`.

## Start here

1. Read **`memory/short_term.md`** (current stand, open TODOs).
2. Pick a run file from **`prompts/agent-runs/`** (see `prompts/agent-runs/README.md`).
3. Read the linked **persona** and **stage** from that run file.
4. Execute the task (code/docs changes in repo).
5. Before finishing, apply **`prompts/templates/agent-transparency-contract.md`** (update `logs/actions.md`, `memory/short_term.md`, and optional memory files).

## Project constraints (always)

- Frontend: single **`index.html`** (vanilla HTML/CSS/JS, no build step).
- Benchmark data: **`benchmarks.js`**.
- KI backend: **`api/ki-consulting.js`** (OpenRouter key only in Vercel env, never in browser).
- Prefer **minimal diffs**; match existing style.
- **Git (agent runs):** After completing a run from `prompts/agent-runs/`, always run **`npm run agent:finish -- "<message>"`** — see **`prompts/templates/git-automation-policy.md`**. No need to wait for the user to ask for commit/push (feature branches only; `main` is protected).

## Persona → run file

| Persona | Agent run |
|---------|-----------|
| Feature Implementer | `prompts/agent-runs/feature-implementer-run.md` |
| System Architect | `prompts/agent-runs/system-architect-run.md` |
| Repository Scaffolder | `prompts/agent-runs/repository-scaffolder-run.md` |
| Code Reviewer | `prompts/agent-runs/code-reviewer-run.md` |
| Technical Writer | `prompts/agent-runs/technical-writer-run.md` |
| Domain Expert (ÖKOPROFIT) | `prompts/agent-runs/domain-expert-run.md` |

## Prompt system vs agent runs

- **`prompts/stages/`** — task definition, acceptance criteria, quality gates (what to build).
- **`prompts/personas/`** — role, tone, constraints (how to work).
- **`prompts/agent-runs/`** — orchestration for an IDE agent (what to read, in what order, when to stop).
- **`memory/` + `logs/`** — human-readable trace for handover and coursework transparency.

## Verification hints

- Static UI: open `index.html` locally or use deployed Vercel URL.
- KI-Beratung: requires Vercel `/api/ki-consulting` (not available on plain static hosting without API).
- Benchmark tab: slider changes should update ampel-colored bars and Öko-Score.

## CI (GitHub Actions)

On push/PR to `main`, if `index.html`, `benchmarks.js`, `api/`, or stage/persona prompts change, the same commit must also update **`logs/actions.md`** and **`memory/short_term.md`**.

Local check: `npm run check:transparency`  
Workflow: `.github/workflows/agent-transparency.yml`
