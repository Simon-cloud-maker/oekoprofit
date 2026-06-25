# Verbrauchs-Monitoring (Zeitreihe) — Design

_Datum: 2026-06-25 · Status: genehmigt_

## Kontext & Ziel

Dritter Baustein der Industrie-Neuausrichtung. Standorte (Baustein 2) haben bisher **einen**
Kennzahlen-Stand. Dieser Baustein macht daraus eine **Zeitreihe**: pro Standort dat­ierte
Messungen, dargestellt als Liniendiagramm über die Zeit gegen den Branchen-Median — so werden
Trends und Abweichungen sichtbar.

## Bestehende Bausteine, an die angedockt wird

- `standort`-Tabelle + `api/standorte.js` (Baustein 2).
- `getVals()` → `{strom, gas, wasser, abfall, reinigungsmittel}` (Dateneingabe).
- `benchmarkMedian(branche, key)` (Baustein 2) → Median in eingegebener Einheit.
- `BRANCH_BENCHMARK_MAP`, `STANDORT_BRANCHE_LABEL`, `STANDORT_KPIS` (Baustein 2).
- **Chart.js** (`new Chart(canvas, …)`), Muster wie `renderTrendChart` (Modul-Var + `.destroy()`).

## Datenmodell — `messung`

| Feld | Typ | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| standort_id | uuid | NOT NULL, FK → standort(id) ON DELETE CASCADE |
| datum | date | NOT NULL (Messmonat, gespeichert als `JJJJ-MM-01`) |
| strom, gas, wasser, abfall, reinigungsmittel | numeric | NULL erlaubt |
| user_id | text | NOT NULL (`demo`) |
| created_at | timestamptz | NOT NULL default now() |

- Migration `db/0004_messung.sql` (idempotent), Index auf `(standort_id, datum)`.

## API — `api/messungen.js` (Muster wie `api/standorte.js`)

- `GET /api/messungen?standort_id=` → `{count, messungen:[…]}`, **nach `datum` aufsteigend**, limit 500.
- `POST /api/messungen` `{standort_id, datum, strom?, gas?, wasser?, abfall?, reinigungsmittel?, user_id?}`
  → 201 `{messung}`. `standort_id` Pflicht (400), `datum` Pflicht (400). FK-Verletzung/ungültige UUID → 400.
  Numerik via `num()`. `datum`: akzeptiert `JJJJ-MM` (→ `JJJJ-MM-01`) oder volles Datum.
- `DELETE /api/messungen?id=` → 200 `{deleted:true}`; unbekannt → 404; ungültige UUID → 400.

## „📈 Als Messung speichern" (Dateneingabe-Tab)

- Zeile bei den Speicher-Buttons: `#ms-standort` (select, aus `/api/standorte`), `#ms-datum`
  (`type="month"`, Default = aktueller Monat), Button `#btn-messung` → `saveCurrentAsMessung()`.
- `saveCurrentAsMessung()`: liest `#ms-standort`, `#ms-datum` (→ `+ '-01'`), `getVals()`;
  `POST /api/messungen`; Statusmeldung in `#save-status`. Kein Standort gewählt → Hinweis.
- Befüllung von `#ms-standort`: `populateMessungStandorte()` (GET `/api/standorte`), aufgerufen
  beim Anzeigen des Dateneingabe-Tabs (`showTab('eingabe')`) und beim Init. Leere Liste →
  Option „Erst Standort anlegen".

## Tab „Monitoring"

- Tab-Button + `#tab-monitoring`; in `showTab`-Array + `renderMonitoring()`.
- **Standort-Auswahl** `#mon-standort` (aus `/api/standorte`; Auswahl bewahren) → onchange `renderMonitoring()`.
- **Kennzahl-Auswahl** `#mon-kpi` (STANDORT_KPIS) → onchange `renderMonitoringChart()`.
- **Liniendiagramm** `#mon-chart` (Chart.js): gewählte Kennzahl über `datum` (X) + gestrichelte
  **Median-Linie** (konstant = `benchmarkMedian(standort.branche, key)`). Alte Chart-Instanz
  `monitorChart.destroy()` vor Neuerzeugung.
- **Messwert-Tabelle** `#mon-table`: Datum + 5 Kennzahlen, **Löschen** je Zeile (`confirm` → DELETE → neu rendern).
- Leerzustände: kein Standort → Hinweis „Erst Standort anlegen (Dateneingabe)"; Standort ohne
  Messungen → „Noch keine Messungen — im Dateneingabe-Tab ‚📈 Als Messung speichern'".

## Test (end-to-end gegen vercel dev + echte Neon-DB)

1. Migration → Tabelle `messung` vorhanden.
2. Standort anlegen; 3 Messungen versch. Datum POST → 201.
3. POST ohne standort_id → 400; ohne datum → 400; ungültige standort_id (FK) → 400.
4. GET `?standort_id=` → count=3, nach `datum` aufsteigend.
5. HTML: Tab „Monitoring" + `btn-messung` + `mon-chart` + `renderMonitoring` je 1×; Seite lädt 200.
6. DELETE einer Messung → 200; GET count=2.
7. Cleanup (Standort löschen → Messungen via Cascade weg).

## Offen / später

- Auth statt `user_id='demo'`.
- Ziel-/Sollwerte je Standort (zusätzlich zur Median-Linie) — später.
- Aggregation (z. B. Jahresmittel) — später.
