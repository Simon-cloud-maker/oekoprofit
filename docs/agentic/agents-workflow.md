# AGENTS.md & Personas

**Quellen:** `AGENTS.md`, `prompts/agent-runs/README.md`, `memory/long_term.md`

## Agentic Coding

Das Repo unterstützt **persona-basierte Agent-Läufe** (`AGENTS.md`).

### Ablauf

1. `memory/short_term.md` lesen
2. Run-Datei aus `prompts/agent-runs/` wählen
3. Verlinkte Persona + Stage lesen
4. Task ausführen
5. `prompts/templates/agent-transparency-contract.md` anwenden (Logs/Memory)

### Persona → Run-Datei

| Persona | Run |
|---------|-----|
| Feature Implementer | `feature-implementer-run.md` |
| System Architect | `system-architect-run.md` |
| Repository Scaffolder | `repository-scaffolder-run.md` |
| Code Reviewer | `code-reviewer-run.md` |
| Technical Writer | `technical-writer-run.md` |
| Domain Expert (ÖKOPROFIT) | `domain-expert-run.md` |

## Prompt-System (`prompts/`)

| Verzeichnis | Inhalt |
|-------------|--------|
| `stages/` | Task-Definitionen (v2 aktiv) |
| `stages/archive/` | v1 archiviert |
| `personas/` | Rollenbeschreibungen |
| `agent-runs/` | IDE-Orchestrierung |
| `evaluation/` | Scorecards |
| `templates/` | Task-Template, Git-Policy, Transparenz-Contract |

## Projekt-Constraints (AGENTS.md)

- Frontend: nur `index.html`
- Benchmarks: `benchmarks.js`
- OpenRouter-Key nur serverseitig
- Minimale Diffs
- Nach Agent-Run: `npm run agent:finish -- "message"`

## Memory & Logs

| Pfad | Zweck |
|------|--------|
| `memory/short_term.md` | Aktueller Stand |
| `memory/long_term.md` | Architektur |
| `memory/decisions.md` | Entscheidungen |
| `memory/known_issues.md` | Technische Issues |
| `logs/actions.md` | Session-Protokoll |
