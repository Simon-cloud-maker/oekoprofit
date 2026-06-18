# KI-Empfehlungen

**Quellen:** `index.html`, `api/ki-consulting.js`, `memory/short_term.md`, `README.md`

## Zwei Ebenen

### 1. Deterministische Empfehlungen

Laut `memory/short_term.md`:

- Funktion `buildDeterministicRecs()` in `index.html`
- Nutzt `massnahmen`-Arrays aus `benchmarks.js` und Betriebsprofil
- Filter: `getInputState()[metrik]?.ready` — nur Kennzahlen mit eingegebenen Jahreswerten

### 2. KI-Beratung (optional)

- Button: **KI-Beratung starten** (`startAIConsulting()`)
- Anzeige: `#ai-response` (Markdown-Rendering)

## Backend-Routing (Client)

Laut `index.html` (Konstanten und Kommentare):

1. **Ollama lokal** — `http://localhost:11434`, Modell `llama3`, Timeout ca. 4,5 s
2. Fallback: **OpenRouter** — direkt im Browser mit User-Key oder über Server-Proxy

Server-Proxy: `POST /api/ki-consulting`

## OpenRouter (Server)

Laut `api/ki-consulting.js`:

- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Modell: `openrouter/free`
- Env: `OPENROUTER_API_KEY`
- System-Prompt: `BENCHMARK_SYSTEM_PROMPT` (ÖKOPROFIT-Kontext, Benchmarks, Quick Wins)

Optional laut `.env.example`:

- `OPENROUTER_MAX_OUTPUT_TOKENS` (Default in Code: 2048)
- `OPENROUTER_CONTINUATION_MAX_TOKENS`

## API-Key in der UI

- Feld `openrouter-api-key` im Tab KI-Empfehlungen (optional, lokal)
- Auf Vercel mit gesetztem `OPENROUTER_API_KEY` laut README kein UI-Key nötig

## Hinweis in der UI

Footer-Text: Empfehlungen basieren auf anonymisierten Benchmarkdaten aus dem ÖKOPROFIT-Netzwerk (n ≈ 4.500 Betriebe).

```text
TODO: fachlich klären — Herleitung und Aktualität der Angabe „n ≈ 4.500 Betriebe“ (nur in index.html, keine separate Quelldatei im Repo).
```

## Prompt-Logging (optional)

`api/ki-consulting.js` kann Prompts loggen (`PROMPT_LOGGING`, `PROMPT_LOG_DEST`). Lesen über `GET /api/prompt-logs` mit `PROMPT_LOG_READ_TOKEN`.

Siehe [Umgebungsvariablen](../entwicklung/umgebungsvariablen.md).
