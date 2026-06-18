# Benchmark-Daten

**Quellen:** `benchmarks.js`, `benchmark_context.md`, `known-issues.md`

## Datenobjekt

Globales Objekt: `OEKOPROFIT_BENCHMARKS` in `benchmarks.js`

Struktur (Auszug):

- `branchen` — pro Branche: `label`, `kennzahlen`, ggf. `strom_aufteilung_pct`, `hauptverbraucher`, `quick_wins`, `massnahmen`
- Globale Hilfswerte (z. B. Reinigungsmittel-Mediane am Dateiende)

## Branchen (keys in benchmarks.js)

| Key | Label |
|-----|--------|
| `gastronomie` | Gastronomie (Restaurant/Café) |
| `baeckerei` | Bäckerei (Handwerksbäckerei) |
| `buero` | Büro / Verwaltung |
| `einzelhandel_food` | Einzelhandel (Lebensmittel) |
| `einzelhandel_nonfood` | Einzelhandel (Nonfood) |
| `produktion` | Produktion / Fertigung (KMU) |

## Kennzahl-Typen (Beispiele)

| Key | Typische Einheit |
|-----|------------------|
| `strom_kwh_per_m2` | kWh/m²·a |
| `waerme_kwh_per_m2` / `heizwaerme_kwh_per_m2` | kWh/m²·a |
| `wasser_liter_per_ma_tag` | l/MA·Tag |
| `abfall_kg_per_ma` | kg/MA·a |
| `reinigungsmittel_l_per_ma` | L/MA·a (Gastronomie/Bäckerei) |
| `recyclingquote_pct` | % (in einigen Branchen noch in Datei) |

Jeder Eintrag enthält oft `p25`, `median`, `p75`, `quelle`.

## KI-Kontext

`benchmark_context.md` — zusätzlicher Textkontext für Empfehlungen (Emissionsfaktoren, Quick Wins, ÖKOPROFIT-Programm).

Separat vom strukturierten `benchmarks.js`-Objekt.

## UI-Fokus vs. Datenbestand

Im Dropdown sichtbar: `gastro`, `baeckerei`  
In `benchmarks.js` existieren mehr Branchen als im UI aktiv angeboten.

## Pflege

Bei neuen Quellen: `benchmarks.js` anpassen und `known-issues.md` aktualisieren (Empfehlung in `known-issues.md`).
