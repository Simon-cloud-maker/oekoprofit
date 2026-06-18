# API (Vercel Serverless)

**Quellen:** `api/*.js`, `README.md`

Alle Handler nutzen `module.exports` (CommonJS).

## GET `/api/config`

**Datei:** `api/config.js`

Response:

```json
{
  "hasGeminiKey": boolean,
  "hasOpenrouterKey": boolean
}
```

Prüft nur, ob Env-Variablen gesetzt sind — keine Key-Inhalte.

## POST `/api/ki-consulting`

**Datei:** `api/ki-consulting.js`

- Proxy zu OpenRouter
- Modell: `openrouter/free`
- Env: `OPENROUTER_API_KEY`
- System-Prompt: ÖKOPROFIT-Benchmark-Kontext (`BENCHMARK_SYSTEM_PROMPT`)
- Optional: Prompt-Logging (`PROMPT_LOGGING`, `PROMPT_LOG_DEST`, KV)

```text
TODO: fachlich klären — exaktes Request/Response-JSON-Schema für API-Clients dokumentieren (aus Handler-Code extrahieren).
```

## POST `/api/document-reader`

**Datei:** `api/document-reader.js`

**Request (laut Dateikopf):**

```json
{
  "files": [{ "base64": "string", "mimeType": "string" }],
  "branche": "string"
}
```

**Response (Felder laut Kommentar):**

`strom_kwh`, `gas_kwh`, `wasser_m3`, `reinigungsmittel_liter`, `abfall_kg`, `zeitraum_monate`, `zeitraum_beschreibung`, `konfidenz`, `nicht_gefunden`

- Env: `GEMINI_API_KEY`
- Modell: `gemini-3.1-flash-lite`
- Upload über Gemini Files API

Fehler ohne Key: HTTP 500, Body `{ "error": "GEMINI_API_KEY nicht konfiguriert" }` (laut Code).

## GET `/api/prompt-logs`

**Datei:** `api/prompt-logs.js`

- Auth: `Authorization: Bearer <PROMPT_LOG_READ_TOKEN>` oder `?token=`
- Liest aus Vercel KV (`@vercel/kv`)
- Query: `limit` (1–500), optional `requestId`

## Client-Fallbacks (index.html)

Wenn Server-Route fehlschlägt (lokal/static):

- **Gemini:** direkter Browser-Call mit User-Key (`gemini-api-key`)
- **OpenRouter:** direkter Browser-Call mit `openrouter-api-key` oder Ollama
