# CI & Agent-Transparenz

**Quellen:** `.github/workflows/agent-transparency.yml`, `scripts/check-agent-transparency.js`, `AGENTS.md`

## GitHub Action

Workflow: **Agent transparency** (`.github/workflows/agent-transparency.yml`)

**Trigger:**

- Pull Request → `main`
- Push → `main`

**Job:** `node scripts/check-agent-transparency.js`

- PR: `--base <base.sha> --head <head.sha>`
- Push: `--base HEAD~1 --head HEAD`

## Regel

Wenn **Trigger-Pfade** geändert werden, müssen im **selben Commit** aktualisiert werden:

- `logs/actions.md`
- `memory/short_term.md`

Trigger-Pfade (laut `AGENTS.md`):

- `index.html`
- `benchmarks.js`
- `api/`
- Stage-/Persona-Prompts unter `prompts/`

## Lokale Prüfung

```bash
npm run check:transparency          # letzter Commit
npm run check:transparency:working  # Working Tree
```

## Agent-Finish

`npm run agent:finish -- "commit message"`

- Siehe `scripts/agent-finish.sh`, `prompts/templates/git-automation-policy.md`
- `main` geschützt (kein Push ohne explizite Freigabe)

## Weitere CI

Im Repository nur dieser Workflow unter `.github/workflows/` nachweisbar.

```text
TODO: fachlich klären — ob zusätzliche Checks (Lint, MkDocs build) in CI gewünscht sind.
```
