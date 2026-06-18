# Benutzer-Übersicht

**Quellen:** `README.md`, `index.html`

## Tabs der Anwendung

| Tab | Zweck |
|-----|--------|
| **Dateneingabe** | Kennzahlen erfassen, importieren, Snapshot speichern |
| **Benchmark** | Vergleich mit Branchen-Benchmarks, Öko-Score |
| **KI-Empfehlungen** | Regelbasierte + optionale KI-gestützte Maßnahmen |
| **Verlauf** | Gespeicherte Snapshots, Trend, Vergleich, Export/Import |

## Dark Mode

Laut `README.md` und `index.html`:

- Toggle oben rechts im Header
- Speicherung unter `localStorage`-Key `oekoprofit-theme`
- System-Präferenz (`prefers-color-scheme`) als Fallback beim ersten Besuch

## Datenhoheit

- Snapshots: **nur lokal** im Browser (`localStorage`, Key `oekoprofit-snapshots`)
- Keine serverseitige Nutzerdatenbank für Snapshots im Repository nachweisbar

```text
TODO: fachlich klären — ob Vercel KV ausschließlich für Prompt-Logs genutzt wird (siehe api/prompt-logs.js) und keine Endnutzer-Snapshots speichert.
```
