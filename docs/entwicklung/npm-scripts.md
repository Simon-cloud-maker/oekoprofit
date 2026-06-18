# npm-Scripts

**Quelle:** `package.json`

| Script | Befehl | Zweck |
|--------|--------|--------|
| `check:transparency` | `node scripts/check-agent-transparency.js --base HEAD~1 --head HEAD` | CI: Logs bei Trigger-Dateien |
| `check:transparency:working` | `node scripts/check-agent-transparency.js --working` | Prüfung im Working Tree |
| `agent:finish` | `bash scripts/agent-finish.sh` | Agent-Lauf: Commit + Push (Feature-Branch) |
| `docs:serve` | `mkdocs serve` | MkDocs lokal |
| `docs:build` | `mkdocs build` | Statische Doku nach `site/` |

## Dependencies

Laut `package.json`:

- `@vercel/kv` ^3.0.0 — für optionales Prompt-Logging in KV

Keine Frontend-Build-Dependencies.

## Agent-Finish

Details: `prompts/templates/git-automation-policy.md`, `AGENTS.md`

- Push auf `main` standardmäßig blockiert
- Staged werden alle Dateien außer `.env*`, `node_modules`, `.vercel`
