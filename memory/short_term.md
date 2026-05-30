# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-05-30_

## Aktueller Stand

- **Verlauf erweitert:** Score-Trend (Chart.js) + Snapshot-Vergleich A/B im Tab „Verlauf".
- **Snapshot-Verlauf:** Tab „Verlauf" + localStorage-Snapshots (Speichern/Wiederherstellen/Löschen) in `index.html`.
- **Recycling-Benchmark:** `recyclingquote_pct` in allen Branchen in `benchmarks.js`; Öko-Score nutzt dynamisches `k.recyclingquote_pct` (aktuell Universalwerte).
- **Dark Mode:** Optionaler Toggle im Header (`data-theme`, `localStorage`, System-Präferenz-Fallback).
- **Benchmark Fix:** Einzelhandel im UI getrennt (`handel_food` / `handel_nonfood` → `einzelhandel_food` / `einzelhandel_nonfood`).
- **Agentic Coding:** `AGENTS.md` + `prompts/agent-runs/` (6 Persona-Runs + Template).
- **KI-Backend:** Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier.
- **Frontend:** Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step).

## Refokus-Entscheidung (2026-05-30, nach Professorenbesprechung)

Auf Empfehlung des Professors wird das Tool auf **zwei Fallbeispiele** fokussiert:
- **Gasthaus** (Gastronomie) — bereits vorhanden
- **Bäckerei** (Handwerksbäckerei) — neu hinzugefügt

## Feature-Branches (lokal, noch nicht gepusht)

- ✅ `feat/bakery-benchmarks` — Bäckerei-Benchmarks in `benchmarks.js` (Kennzahlen, Quick Wins, Hauptverbraucher)
- ✅ `feat/ui-focus-two-cases` — Dropdown auf 2 Branchen reduziert, Bäckerei-Mediane in UI
- ✅ `feat/branch-specific-inputs` — Betriebsprofil + Jahreswerte, Slider als State-Holder, buildClaudePrompt angereichert
- ✅ `feat/gemini-document-reader` — Multi-file PDF/Foto-Upload, Browser-Fallback mit User-Key, autofill-Badge; neue `api/document-reader.js`
- ✅ `feat/deterministic-recommendations` — massnahmen-Arrays in benchmarks.js (Gastro + Bäckerei-Stub), Template-Renderer buildDeterministicRecs(), Betriebsgröße-Logik
- ⬜ `feat/sharper-ai-recommendations` — KI-Prompt mit Betriebsprofil anreichern (Task 6, noch offen)

## Hinweis Merge-Konflikt

`feat/deterministic-recommendations` enthält einen Bäckerei-Stub in `benchmarks.js` (nur `massnahmen`, kein `kennzahlen`/`quick_wins`).
Beim Merge mit `feat/bakery-benchmarks` müssen die `massnahmen` manuell in den vollständigen Bäckerei-Eintrag aus Task 1 eingebettet werden.

## Lokales Testen

```powershell
git checkout main
git checkout -b test/integration
git merge feat/bakery-benchmarks
git merge feat/ui-focus-two-cases
git merge feat/branch-specific-inputs
git merge feat/gemini-document-reader
git merge feat/deterministic-recommendations
python -m http.server 8080
```
Gemini-Key im UI eingeben für Document-Upload-Test.

## Nächster Schritt

Task 6 (`feat/sharper-ai-recommendations`) in neuer Session ausführen — Kontext: diese Memory-Datei + Plan-File + `api/ki-consulting.js` + `buildClaudePrompt()` aus index.html lesen lassen.
