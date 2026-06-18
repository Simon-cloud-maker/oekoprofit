# Umgebungsvariablen

**Quellen:** `.env.example`, `api/*.js`, `README.md`

## Übersicht

| Variable | Verwendet in | Pflicht für |
|----------|--------------|-------------|
| `OPENROUTER_API_KEY` | `api/ki-consulting.js` | KI-Beratung (Server) |
| `GEMINI_API_KEY` | `api/document-reader.js` | Rechnungs-Upload (Server) |
| `OPENROUTER_MAX_OUTPUT_TOKENS` | `api/ki-consulting.js` | optional |
| `OPENROUTER_CONTINUATION_MAX_TOKENS` | `api/ki-consulting.js` | optional |
| `PROMPT_LOG_READ_TOKEN` | `api/prompt-logs.js` | Lesen der Prompt-Logs |
| `PROMPT_LOGGING` | `api/ki-consulting.js` | optional (`off` \| `metadata` \| `full`) |
| `PROMPT_LOG_DEST` | `api/ki-consulting.js` | optional (`console` \| `kv` \| `file` \| `off`) |
| `PROMPT_LOG_MAX_CHARS` | `api/ki-consulting.js` | optional |
| `PROMPT_LOG_SALT` | `api/ki-consulting.js` | optional (Hashing) |
| `PROMPT_LOG_KV_NAMESPACE` | `api/ki-consulting.js`, `api/prompt-logs.js` | optional |
| `PROMPT_LOG_TTL_SECONDS` | `api/ki-consulting.js` | optional |
| `PROMPT_LOG_MAX_EVENTS` | `api/ki-consulting.js` | optional |
| `KV_REST_API_URL` | `@vercel/kv` | wenn `PROMPT_LOG_DEST=kv` |
| `KV_REST_API_TOKEN` | `@vercel/kv` | wenn `PROMPT_LOG_DEST=kv` |

## API-Keys beschaffen

| Dienst | URL (README) | Zweck |
|--------|--------------|--------|
| Gemini | https://aistudio.google.com/apikey | Rechnungen einlesen |
| OpenRouter | https://openrouter.ai/keys | KI-Beratung |

## Häufiger Fehler: Gemini

Code liest **nur** `process.env.GEMINI_API_KEY` (`api/document-reader.js`).

Nicht erkannt werden z. B.:

- `Gemini_API_Key`
- `GOOGLE_API_KEY`

## Lokale `.env`

`.gitignore` schließt `.env*` aus — **außer** `.env.example`.

Keys nie ins Repository committen (`AGENTS.md`, `README.md`).

## Gemini-Modell (Server)

Laut `api/document-reader.js`:

- `GEMINI_MODEL = 'gemini-3.1-flash-lite'`
- Files API zur Token-Reduktion

Kommentar in Dateikopf erwähnt noch „Gemini 2.0 Flash“ — Code nutzt `gemini-3.1-flash-lite`.

```text
TODO: fachlich klären — Kommentar in document-reader.js an tatsächliches Modell anpassen (Doku/Code-Drift).
```
