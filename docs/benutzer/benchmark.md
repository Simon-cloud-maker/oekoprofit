# Benchmark

**Quellen:** `index.html`, `benchmarks.js`, `known-issues.md`

## Anzeige

Laut `memory/short_term.md` und UI-Struktur in `index.html`:

- **Branchenvergleich:** Ampel-Balken pro Metrik (grün / gelb / rot)
- **Hauptverbraucher:** Box `#bench-hauptverbraucher` (wenn Daten in `benchmarks.js` vorhanden)
- **Quick Wins:** Card `#bench-quickwins-card`
- **Quellenzeile:** `#bench-quelle`
- **Öko-Score:** Ring-Diagramm (SVG) mit numerischem Score

## Legende

Element `#bench-legend` (modusbewusst laut `memory/short_term.md`):

- Gut / Mittelfeld / Handlungsbedarf
- Median-Benchmark als vertikaler Strich

## Scoring (aus Code)

Laut `index.html` — Teilscores werden aus `OEKOPROFIT_BENCHMARKS.branchen` gelesen, u. a.:

- `strom_kwh_per_m2`
- `heizwaerme_kwh_per_m2` / `waerme_kwh_per_m2`
- `wasser_liter_per_ma_tag`
- `abfall_kg_per_ma`
- `reinigungsmittel_l_per_ma` (für Gastronomie/Bäckerei im aktiven UI-Fokus)

Score-Ring und Balken erscheinen laut `memory/short_term.md` erst bei vollständigen bzw. „ready“ Kennzahlen.

## Benchmark-Daten

Alle Quartile (p25, median, p75) und Quellen: `benchmarks.js`

Branchen-Labels in `benchmarks.js` (Auszug):

| Key | Label |
|-----|--------|
| `gastronomie` | Gastronomie (Restaurant/Café) |
| `baeckerei` | Bäckerei (Handwerksbäckerei) |
| `buero` | Büro / Verwaltung |
| `einzelhandel_food` | Einzelhandel (Lebensmittel) |
| `einzelhandel_nonfood` | Einzelhandel (Nonfood) |
| `produktion` | Produktion / Fertigung (KMU) |

Siehe auch [Benchmark-Daten](../daten/benchmarks.md) und [Bekannte Einschränkungen](../daten/bekannte-einschraenkungen.md).
