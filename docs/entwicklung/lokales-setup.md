# Lokales Setup

**Quellen:** `README.md`, `package.json`, `.env.example`

## Voraussetzungen

- Node.js/npm (für `npm install`, Vercel CLI, Transparenz-Scripts)
- Optional: Python 3 (für einfachen Static Server)
- Optional: [Vercel CLI](https://vercel.com/docs/cli) (`npx vercel`)

Kein Build-Step für das Frontend (`AGENTS.md`).

## Variante A — nur UI

```bash
python3 -m http.server 8080
# Browser: http://localhost:8080/index.html
```

**Einschränkung (README):** Ohne Vercel-API funktionieren Server-Proxy für KI-Beratung und Rechnungs-Upload nicht. API-Keys können in der UI eingegeben werden (Browser-Fallback).

## Variante B — mit API (empfohlen)

```bash
npm install
cp .env.example .env
# .env bearbeiten

npx vercel dev
```

Mindestens eine der Variablen sinnvoll:

- `OPENROUTER_API_KEY` — KI-Beratung
- `GEMINI_API_KEY` — Rechnungs-Upload

## Ollama (optional, KI lokal)

Laut `index.html`:

- Basis-URL: `http://localhost:11434`
- Modell: `llama3`
- Bei CORS-Problemen: Hinweis im Code auf `OLLAMA_ORIGINS="*"`

```text
TODO: fachlich klären — offizielle Ollama-Installationsanleitung für das Team (nicht im Repo dokumentiert).
```

## MkDocs (Projekt-Doku)

```bash
pip install -r requirements-docs.txt
mkdocs serve
```

Ausgabe lokal: `http://127.0.0.1:8000`  
GitHub Pages: siehe [Deployment (Vercel)](deployment.md#mkdocs-auf-github-pages)
