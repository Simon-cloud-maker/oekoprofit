# Projektstruktur

**Quellen:** `README.md`, Repository-Listing

```text
oekoprofit-ki/
├── index.html              # Frontend + Client-Logik
├── benchmarks.js           # Benchmark-Daten
├── benchmark_context.md    # KI-Kontext (Markdown)
├── known-issues.md         # Fachliche Benchmark-Grenzen
├── README.md               # Kurz-Einstieg
├── mkdocs.yml              # MkDocs-Konfiguration
├── requirements-docs.txt   # Python-Deps für MkDocs
├── docs/                   # MkDocs-Quellen (diese Doku)
├── api/                    # Vercel Serverless Functions
│   ├── ki-consulting.js
│   ├── document-reader.js
│   ├── config.js
│   └── prompt-logs.js
├── scripts/
│   ├── check-agent-transparency.js
│   └── agent-finish.sh
├── .github/workflows/
│   └── agent-transparency.yml
├── prompts/                # Prompt-Engineering
├── memory/                 # Agent-Memory
├── logs/                   # Session-Log
├── AGENTS.md
├── package.json
└── .env.example
```

## Nicht versioniert (.gitignore)

- `.env*`, `.vercel/`, `node_modules/`
- `logs/prompt-log.ndjson`
- `Testrechnungen/`
- Lokale Kontext-PDFs/XLSX (siehe `.gitignore`)

## Docker

Keine `Dockerfile` im Repository nachweisbar.

```text
TODO: fachlich klären — ob Container-Setup geplant ist.
```
