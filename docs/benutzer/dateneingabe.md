# Dateneingabe

**Quellen:** `index.html`, `README.md`, `memory/short_term.md`

## Ablauf (laut README)

1. Branche wählen (sichtbar: Gasthaus oder Bäckerei)
2. **Betriebsprofil** ausfüllen
3. **Jahreswerte** eintragen
4. Öko-Score und Benchmark aktualisieren sich über `update()` / `computeFromJahreswerte()`

## Betriebsprofil

Felder in `index.html` (Auszug):

| Feld-ID | Beschreibung (Label) |
|---------|----------------------|
| `profil-flaeche` | Nutzfläche (m²) |
| `profil-ma` | Mitarbeitende |
| `profil-sitzplaetze` | Sitzplätze (Gastronomie) |
| `profil-oeffnungstage` | Öffnungstage/Jahr |
| `profil-kueche` | Eigene Küche (ja/nein) |
| `profil-oefen` | Anzahl Öfen (Bäckerei) |
| `profil-verkauf` | Verkaufsfläche (Bäckerei) |

## Jahreswerte

| Feld-ID | Einheit (UI) |
|---------|----------------|
| `jw-strom` | kWh / Jahr |
| `jw-gas` | kWh / Jahr |
| `jw-wasser` | m³ / Jahr |
| `jw-abfall` | kg / Jahr |
| `jw-reinigungsmittel` | L / Jahr |

Laut `memory/short_term.md` und `memory/decisions.md`:

- Umrechnung auf normierte Kennzahlen erfolgt in `computeFromJahreswerte()`
- Versteckte Slider (`strom`, `gas`, …) dienen als State-Holder für bestehende Logik

## Daten importieren

### Rechnungen einlesen (Gemini)

- Button: **Rechnungen einlesen**
- Akzeptiert: PDF, Bilder (`accept=".pdf,image/*"`, `multiple`)
- Optional: Gemini API-Key im Feld `gemini-api-key`, wenn Server-Key fehlt
- Server-Route: `POST /api/document-reader`

Extrahierte Felder laut `api/document-reader.js`:

`strom_kwh`, `gas_kwh`, `wasser_m3`, `reinigungsmittel_liter`, `abfall_kg`, Zeitraum, Konfidenz

### Excel importieren

- Button: **Excel importieren**
- Bibliothek: SheetJS (`xlsx.full.min.js` von cdnjs)
- Format: `.xlsx`; erste Datenzeile wird gelesen
- Spalten-Mapping per Keyword (z. B. Branche, Betrieb) — siehe `handleExcelUpload()` in `index.html`

## Snapshot speichern

- Button: **Snapshot speichern**
- Speichert u. a. Branche, Betriebsname, `vals`, Score in `localStorage`

```text
TODO: fachlich klären — ob Snapshots vollständig Betriebsprofil und Jahreswerte (`jw-*`) mitspeichern oder nur Slider-Werte (`getVals()`); aktueller Code in saveSnapshot() prüfen bei Datenmigration.
```
