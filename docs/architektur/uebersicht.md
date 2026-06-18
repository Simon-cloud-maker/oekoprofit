# Architektur-Übersicht

**Quellen:** `memory/long_term.md`, `AGENTS.md`, `README.md`

## Schichten

```mermaid
flowchart LR
  subgraph Browser
    HTML[index.html]
    BENCH[benchmarks.js]
  end
  subgraph Vercel
    KI[api/ki-consulting.js]
    DOC[api/document-reader.js]
    CFG[api/config.js]
    LOG[api/prompt-logs.js]
  end
  subgraph Extern
    OR[OpenRouter API]
    GM[Gemini API]
    KV[Vercel KV optional]
  end
  HTML --> BENCH
  HTML --> KI
  HTML --> DOC
  HTML --> CFG
  KI --> OR
  DOC --> GM
  KI --> KV
  LOG --> KV
```

## Design-Prinzipien (AGENTS.md)

- Single-File-Frontend: `index.html` (Vanilla HTML/CSS/JS)
- Kein Build-Step für die App
- Benchmark-Daten: `benchmarks.js`
- API-Keys für Produktion nur serverseitig (OpenRouter, Gemini)

## Prompt-Engineering (parallel)

Verzeichnis `prompts/` — Stages, Personas, Agent-Runs, Scorecards.

Siehe [AGENTS.md & Personas](../agentic/agents-workflow.md).

## Dokumentations-Artefakte

| Ort | Rolle |
|-----|--------|
| `README.md` | Einstieg Entwickler |
| `docs/` (MkDocs) | Strukturierte Doku |
| `memory/` | Agent-Handover |
| `logs/` | Session-Protokoll |
| `known-issues.md` | Fachliche Benchmark-Grenzen |
