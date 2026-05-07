# Logs

Dieses Verzeichnis enthält **lokale** Log-Artefakte und Dokumentation.

## Prompt-Logging (Serverless)

Der KI-Proxy `api/ki-consulting.js` erzeugt strukturierte Prompt-Logs.

- **Immer**: JSON-Logs nach `stdout` (in Vercel über “Function Logs” sichtbar)
- **Optional**: NDJSON-Datei (best-effort)
  - lokal: `logs/prompt-log.ndjson`
  - auf Vercel: `/tmp/prompt-log.ndjson` (ephemeral, nicht dauerhaft)

### Konfiguration (Environment Variables)

- `PROMPT_LOGGING`
  - `off`: kein Prompt-Logging
  - `metadata` (default): nur Metadaten + Hashes (empfohlen)
  - `full`: zusätzlich gekürzte Previews von Prompt/Response (Vorsicht: PII!)
- `PROMPT_LOG_MAX_CHARS` (default `800`)
  - maximale Länge der Previews bei `PROMPT_LOGGING=full`
- `PROMPT_LOG_SALT` (optional)
  - Salt für Hashing, damit Hashes nicht per Rainbow-Table “erraten” werden können
- `PROMPT_LOG_DEST`
  - `console` (default): nur stdout
  - `file`: stdout + NDJSON-Datei (lokal/`/tmp`)
  - `kv`: stdout + persistente Speicherung in Vercel KV (empfohlen)
  - `off`/`none`: wie `PROMPT_LOGGING=off`

- `PROMPT_LOG_KV_NAMESPACE` (default `promptlog`)
  - Key-Namespace in KV, z.B. `promptlog:events`
- `PROMPT_LOG_TTL_SECONDS` (default `2592000` = 30 Tage)
  - TTL für KV-Keys/Streams
- `PROMPT_LOG_MAX_EVENTS` (default `5000`)
  - Maximalzahl Events im globalen Stream (ältere werden getrimmt)

- `PROMPT_LOG_READ_TOKEN` (optional, aber empfohlen)
  - Bearer-Token, um Logs über `api/prompt-logs.js` lesen zu dürfen

### Was wird geloggt?

- `requestId`, `ts`, `model`, `latencyMs`, `status`, `ok`
- Prompt/Response: `*Length`, `*Hash`
- Optional: `*Preview` (nur bei `PROMPT_LOGGING=full`)
- Fehlerfälle: `errorType`, `errorDetailsPreview`, ggf. `debug`

## Hinweis zu Persistenz

Datei-Logging ist in Serverless-Umgebungen **nicht dauerhaft**. Wenn du Logs langfristig speichern/auswerten willst, ist der nächste Schritt typischerweise:

- Vercel Postgres / KV
- Log Drain (z.B. Datadog)
- eigenes Logging-Backend (HTTP Endpoint)

## Logs lesen (KV)

Wenn `PROMPT_LOG_DEST=kv` aktiv ist, kannst du Logs über den Read-Endpoint abrufen:

- **Letzte Events (global)**: `GET /api/prompt-logs?limit=50`
- **Events pro Request**: `GET /api/prompt-logs?requestId=<id>&limit=50`

Auth:

- Header: `Authorization: Bearer <PROMPT_LOG_READ_TOKEN>`
  - alternativ als Query: `?token=<PROMPT_LOG_READ_TOKEN>` (weniger sicher)

## Schnelltest (End-to-End)

1) Sicherstellen, dass in Vercel (Production) gesetzt ist:

- `OPENROUTER_API_KEY`
- `PROMPT_LOG_DEST=kv`
- `PROMPT_LOG_READ_TOKEN`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

2) Nach Env-Änderungen immer neu deployen (Vercel lädt Env-Werte pro Deployment-Snapshot).

3) Schreibtest:

```bash
curl -sS -X POST "https://<deine-domain>/api/ki-consulting" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Bitte antworte exakt mit: LOG_TEST"}'
```

4) Lesetest:

```bash
curl -sS -H "Authorization: Bearer <PROMPT_LOG_READ_TOKEN>" \
  "https://<deine-domain>/api/prompt-logs?limit=5"
```

Erwartung: JSON mit `key`, `count`, `events` und mindestens einem `type: "prompt_log"` Event.

## Troubleshooting

- `{"error":"Unauthorized"}`
  - falscher/alter `PROMPT_LOG_READ_TOKEN`, Platzhalter statt echtem Token, oder fehlender Redeploy.
- `Missing required environment variables KV_REST_API_URL and KV_REST_API_TOKEN`
  - Variablenname/Scope falsch oder im falschen Projekt gesetzt.
- `Upstash Redis client was passed an invalid URL`
  - in `KV_REST_API_URL` steht nicht nur die URL, sondern z.B. `NAME="https://..."`.
  - Der Wert muss nur die reine URL sein (z.B. `https://...upstash.io`).
- `count: 0` bei erfolgreichem Read
  - `PROMPT_LOG_DEST` ist nicht `kv` oder seit dem letzten Redeploy wurde noch kein neuer Prompt geschrieben.

