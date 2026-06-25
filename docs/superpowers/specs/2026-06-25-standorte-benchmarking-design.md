# Standorte + Multi-Standort-Benchmarking — Design

_Datum: 2026-06-25 · Status: genehmigt_

## Kontext & Ziel

Zweiter Baustein der Industrie-Neuausrichtung. Bisher vergleicht die App **einen** Betrieb
gegen Branchen-Mediane (`OEKOPROFIT_BENCHMARKS.branchen.*.kennzahlen`, p25/median/p75).
Verbrauchsdaten liegen nur lokal (localStorage-Snapshots). Dieser Baustein führt
**persistente Standorte/Werke** ein und ermöglicht den **Vergleich mehrerer Standorte**
untereinander und gegen den Branchen-Median.

## Bestehende Bausteine, an die angedockt wird

- `getVals()` → `{ strom, gas, wasser, abfall, reinigungsmittel }` (normalisierte Kennzahlen, aus den Slidern).
- `document.getElementById('branche').value` → `gastro` | `baeckerei`.
- `BRANCH_BENCHMARK_MAP` → mappt Select-Wert auf `OEKOPROFIT_BENCHMARKS.branchen`-Key.
- `calcScore(vals, b)` → Gesamt-Score.
- `OEKOPROFIT_BENCHMARKS.branchen[key].kennzahlen.*` → `{ p25, median, p75 }`.

## Datenmodell — `standort`

| Feld | Typ | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| branche | text | NOT NULL (`gastro` | `baeckerei`) |
| strom | numeric | NULL erlaubt (kWh/m²) |
| gas | numeric | NULL erlaubt (kWh/m²) |
| wasser | numeric | NULL erlaubt (L/MA bzw. wie Slider) |
| abfall | numeric | NULL erlaubt (kg/MA) |
| reinigungsmittel | numeric | NULL erlaubt (L/MA) |
| score | numeric | NULL erlaubt (Stand beim Speichern) |
| user_id | text | NOT NULL (Platzhalter `demo`) |
| created_at | timestamptz | NOT NULL default now() |

- Migration `db/0003_standort.sql` (idempotent, `create table if not exists`), Index auf `user_id`.
- Kennzahlen sind die **normalisierten** Werte aus `getVals()` (keine Rohdaten/Bezugsgrößen in v1).

## API — `api/standorte.js`

Stil wie `api/massnahmen.js` (json-Helper, readJsonBody, neon, Fehler → 4xx/5xx).

- `GET /api/standorte?user_id=` → `{ count, standorte: [...] }`, neueste zuerst, limit 200.
- `POST /api/standorte` `{name, branche, strom?, gas?, wasser?, abfall?, reinigungsmittel?, score?, user_id?}`
  → 201 `{ standort }`. `name` Pflicht (sonst 400). `branche` Pflicht und ∈ {gastro, baeckerei} (sonst 400).
  Numerische Felder: leer/ungültig → NULL.
- `DELETE /api/standorte?id=` → 200 `{ deleted: true }`; unbekannte/ungültige id → 404/400.

## „Als Standort speichern" (Dateneingabe-Tab)

- Button im Bereich des Snapshot-Speicherns (z. B. neben „Snapshot speichern").
- Klick → `prompt()` nach Standort-Name (leer/Abbruch → kein Speichern).
- Erfasst `getVals()`, `branche`-Select-Wert, `calcScore(getVals(), …)` und sendet `POST /api/standorte`.
- Rückmeldung über vorhandenes Status-Element bzw. kurze Inline-Meldung.
- Funktion `saveCurrentAsStandort()`.

## Tab „Standorte"

- Tab-Button + `id="tab-standorte"`; in `showTab`-Array + Render-Aufruf `renderStandorte()`.
- **Branche-Filter** (`#st-branche`, select): nur Branchen, zu denen Standorte existieren; Default = Branche mit den meisten Standorten. `onchange` → neu rendern.
- **Vergleichstabelle** (`#st-table`): Spalten `Name | Strom/m² | Gas/m² | Wasser/MA | Abfall/MA | Reinigungsmittel/MA | Score | (Löschen)`.
  - Zeilen: Standorte der gewählten Branche.
  - Pro Verbrauchs-Kennzahl: **niedrigster Wert grün, höchster rot** (nur wenn ≥ 2 Werte vorhanden).
  - Score-Spalte: **höchster grün, niedrigster rot** (höher = besser).
  - **Median-Zeile** je Kennzahl aus `OEKOPROFIT_BENCHMARKS.branchen[map(branche)].kennzahlen.<key>.median`,
    gleiche Kennzahl-Zuordnung wie `calcScore`/Benchmark-Tab:
    strom→`strom_kwh_per_m2`, gas→`heizwaerme_kwh_per_m2` || `waerme_kwh_per_m2`,
    wasser→`wasser_liter_per_ma_tag` (bzw. die im Benchmark-Tab genutzte Wasser-Kennzahl),
    abfall→`abfall_kg_per_ma`, reinigungsmittel→`reinigungsmittel_l_per_ma`. Fehlt eine Kennzahl → „—".
  - **Löschen** je Zeile (`DELETE`, danach neu rendern; mit `confirm()`).
- **Leerzustand:** Hinweis „Noch keine Standorte — im Tab ‚Dateneingabe' Werte erfassen und ‚Als Standort speichern'."
- `textContent`-Rendering (XSS-sicher), Theme-Variablen (Dark Mode).

## Test (end-to-end gegen vercel dev + echte Neon-DB)

1. Migration einspielen, Tabelle `standort` vorhanden.
2. POST 2 Standorte gleiche Branche (gastro) mit unterschiedlichen Werten → 201.
3. POST ohne name → 400; POST mit ungültiger branche → 400.
4. GET listet beide.
5. HTML: Tab „Standorte" + Button „Als Standort speichern" vorhanden; je 1×.
6. DELETE eines Standorts → 200; GET zeigt nur noch einen.
7. Best/Schlecht- und Median-Logik stichprobenhaft (manuell im Browser bzw. über Werte-Plausibilität).
8. Cleanup (Testzeilen löschen).

## Offen / später (nicht in diesem Baustein)

- Maßnahmen-Vorschläge (Katalog aus `benchmarks.js` + KI) — eigener Baustein, vom Nutzer als Nächstes gewünscht.
- `massnahme.standort` (Freitext) später mit `standort`-FK verknüpfen.
- Auth statt `user_id='demo'`.
- Verbrauchs-Monitoring (Zeitreihe) — Baustein 3.
