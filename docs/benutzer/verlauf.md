# Verlauf & Snapshots

**Quellen:** `index.html`, `README.md`

## Speicherort

- **localStorage**, Key: `oekoprofit-snapshots` (Konstante `SNAPSHOT_KEY` in `index.html`)
- Daten verlassen das Gerät nicht (Hinweistext im Tab Verlauf)

## Funktionen

| Aktion | Implementierung |
|--------|-----------------|
| Speichern | `saveSnapshot()` — Button in Dateneingabe |
| Liste anzeigen | `renderSnapshots()` |
| Wiederherstellen | `restoreSnapshot(id)` |
| Einzeln löschen | `deleteSnapshot(id)` — mit `confirm()`-Dialog |
| Score-Trend | Chart.js (`#trend-chart`), ab 2 Snapshots |
| Vergleich A/B | `renderComparison()` — Dropdowns `#cmp-a`, `#cmp-b` |

## Export & Import

Buttons im Tab Verlauf (`index.html`):

| Button | Funktion |
|--------|----------|
| CSV-Export | `exportSnapshotsCSV()` — UTF-8, Excel-kompatibel |
| JSON-Backup | `exportSnapshotsJSON()` |
| JSON-Import | `triggerSnapshotImport()` / `handleSnapshotImport()` |

Hinweistext: CSV für Dokumentation, JSON für verlustfreie Sicherung/Wiederherstellung.

## „Alle Daten zurücksetzen“

Im aktuellen `index.html` **keine** dedizierte Funktion „Verlauf leeren“ oder `localStorage.removeItem` für alle Snapshots nachweisbar.

```text
TODO: fachlich klären — ob „Alle zurücksetzen“ noch geplant ist oder bewusst nur Einzellöschung + JSON-Import-Ersetzen vorgesehen ist.
```

## Theme (separat)

Dark-Mode-Einstellung: eigener Key `oekoprofit-theme` — unabhängig von Snapshots.
