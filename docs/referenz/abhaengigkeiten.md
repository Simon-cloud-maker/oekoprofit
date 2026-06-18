# Abhängigkeiten

**Quellen:** `package.json`, `index.html`, `api/`

## npm (package.json)

| Paket | Version | Verwendung |
|-------|---------|------------|
| `@vercel/kv` | ^3.0.0 | Prompt-Logs in KV (`api/ki-consulting.js`, `api/prompt-logs.js`) |

Keine Runtime-Dependency für das Frontend in `package.json`.

## CDN (Browser, index.html)

| Paket | Quelle |
|-------|--------|
| SheetJS (xlsx) | cdnjs.cloudflare.com 0.18.5 |
| Chart.js | cdn.jsdelivr.net 4.4.0 |
| Google Fonts | fonts.googleapis.com |

## Externe APIs

| API | Verwendung |
|-----|------------|
| OpenRouter | `api/ki-consulting.js`, Browser-Fallback |
| Google Generative Language (Gemini) | `api/document-reader.js`, Browser-Fallback |
| Ollama (lokal) | `index.html` — optional |

## Python (Dokumentation)

`requirements-docs.txt`:

- `mkdocs` >= 1.6.0
- `mkdocs-material` >= 9.5.0

## Tests im Repo

Keine Test-Runner-Dependencies in `package.json`.

Kein `requirements.txt` für die App selbst.

```text
TODO: fachlich klären — Python-Version für MkDocs im Team (nicht in Repo festgelegt).
```
