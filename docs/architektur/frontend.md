# Frontend

**Quellen:** `index.html`, `benchmarks.js`, `AGENTS.md`

## Dateien

| Datei | Rolle |
|-------|--------|
| `index.html` | UI, CSS, Client-Logik (~3000 Zeilen) |
| `benchmarks.js` | `OEKOPROFIT_BENCHMARKS` — Branchen, Kennzahlen, Quick Wins, Maßnahmen |

## Externe CDN-Abhängigkeiten (index.html)

| Bibliothek | Version (URL) | Zweck |
|------------|---------------|--------|
| Google Fonts | DM Sans, DM Mono | Typografie |
| SheetJS | 0.18.5 (cdnjs) | Excel-Import |
| Chart.js | 4.4.0 (jsdelivr) | Score-Verlauf |

## Wichtige Client-Funktionen (Auszug)

| Funktion | Zweck |
|----------|--------|
| `update()` | UI-Aktualisierung nach Eingabe |
| `computeFromJahreswerte()` | Jahreswerte → normierte Slider |
| `getVals()` | Liest normierte Kennzahlen von Slidern |
| `getBetriebsProfil()` | Betriebsprofil-Felder |
| `getInputState()` | Ready-Status pro Metrik |
| `calcScore()` / `calcBenchmarkScore()` | Öko-Score |
| `buildDeterministicRecs()` | Regelbasierte Empfehlungen |
| `startAIConsulting()` | KI-Beratung |
| `handleDocumentUpload()` | Gemini-Rechnungs-Upload |
| `handleExcelUpload()` | Excel-Import |
| `saveSnapshot()` / `loadSnapshots()` | Verlauf |

## Branchen-Mapping

`BRANCH_BENCHMARK_MAP` verknüpft Dropdown-Werte mit Keys in `benchmarks.js` (z. B. `gastro` → `gastronomie`, `baeckerei` → `baeckerei`).

## Kein Framework

Laut `AGENTS.md` und `memory/long_term.md`: kein React/Vue/Build-Tool für die App.

## Tests

Im Repository **keine** automatisierten Frontend-Tests (kein `test/`, keine Jest/Vitest-Konfiguration nachweisbar).

```text
TODO: fachlich klären — gewünschte Teststrategie für UI-Logik (manuell vs. zukünftige E2E-Tests).
```
