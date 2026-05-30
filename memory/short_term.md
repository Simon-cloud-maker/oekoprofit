# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-05-30_

## Aktueller Stand

- **Verlauf:** Score-Trend (Chart.js) + Snapshot-Vergleich A/B; localStorage-Snapshots.
- **Recycling-Benchmark:** `recyclingquote_pct` in allen Branchen; Öko-Score nutzt dynamisches Scoring.
- **Dark Mode:** Toggle im Header (`data-theme`, `localStorage`, System-Präferenz-Fallback).
- **Agentic Coding:** `AGENTS.md` + `prompts/agent-runs/` (6 Persona-Runs + Template).
- **KI-Backend:** Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier.
- **Frontend:** Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step).

## Refokus-Entscheidung (2026-05-30, nach Professorenbesprechung)

Das Tool fokussiert sich jetzt auf **zwei Fallbeispiele**:
- **Gasthaus** (Gastronomie) — bereits vorhanden, verfeinert
- **Bäckerei (Produktion)** — neu hinzugefügt

## Feature-Branches (lokal, noch nicht gepusht)

| Branch | Status | Was geändert wurde |
|--------|--------|--------------------|
| `feat/bakery-benchmarks` | ✅ committed | Bäckerei-Kennzahlen, Quick Wins, Hauptverbraucher + massnahmen-Array in `benchmarks.js` |
| `feat/ui-focus-two-cases` | ✅ committed | Dropdown auf 2 Optionen (inkl. Label „Bäckerei (Produktion)"), Bäckerei-Mediane in UI |
| `feat/branch-specific-inputs` | ✅ committed | Betriebsprofil-Felder, Jahreswert-Inputs (kWh/Jahr), Slider als versteckte State-Holder, `buildClaudePrompt()` mit Profil angereichert |
| `feat/gemini-document-reader` | ✅ committed | Neue `api/document-reader.js` (Gemini 2.0 Flash), Multi-file PDF/Foto-Upload, Browser-Fallback mit User-Key, autofill-Badge |
| `feat/deterministic-recommendations` | ✅ committed | `buildDeterministicRecs()` ersetzt generische Empfehlungslogik; Template-Variablen inkl. Betriebsgröße |
| `feat/sharper-ai-recommendations` | ⬜ offen | Task 6 — nächste Session |

## Kein Merge-Konflikt erwartet

`feat/bakery-benchmarks` enthält den vollständigen `baeckerei`-Eintrag (kennzahlen + quick_wins + massnahmen).
`feat/deterministic-recommendations` hat den Bäckerei-Stub entfernt → beim Merge kein Konflikt.

## Lokales Testen (Integrations-Branch)

```powershell
git checkout main
git checkout -b test/integration
git merge feat/bakery-benchmarks
git merge feat/ui-focus-two-cases
git merge feat/branch-specific-inputs
git merge feat/gemini-document-reader
git merge feat/deterministic-recommendations
python -m http.server 8080
# Gemini API-Key im UI eingeben für Document-Upload-Test
```

## Nächster Schritt

Task 6 (`feat/sharper-ai-recommendations`) implementieren:
- Branch von `main` erstellen
- `api/ki-consulting.js` System-Prompt um Bäckerei-Benchmarks ergänzen
- `buildClaudePrompt()`: alle 6 Quick Wins übergeben (nicht nur 3), neuen Pflicht-Abschnitt `## Warum das für Ihren Betrieb gilt` erzwingen, Bedingungslogik für `kueche: 'nein'`
- After-Task-Protokoll vollständig ausführen
