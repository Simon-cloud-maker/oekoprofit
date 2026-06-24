# Maßnahmen-Management (ROI) — Design

_Datum: 2026-06-24 · Status: genehmigt_

## Kontext & Ziel

Die App (oekoprofit-ki) ist ein Ressourcen-Effizienz-Tool: Verbräuche erfassen → gegen
Benchmarks vergleichen → Maßnahmen ableiten → Verlauf. Die zuvor ergänzten generischen
CRUD-Tabs (Aufgaben, Empfehlungen, Produkte, Lernkarten) liefern Industrienutzern keinen
echten Mehrwert. Erster Baustein einer Neuausrichtung auf **ressourceneffiziente
Mehr-Standort-Industriebetriebe**: **Maßnahmen-Management mit Wirtschaftlichkeit (ROI)**.

Bedient die gewählten Ziele: Effizienz-Maßnahmen managen (dieser Baustein), später
Multi-Standort-Benchmarking und Verbrauchs-Monitoring (eigene Bausteine).

## Umfang

- **Neu:** Tab „Maßnahmen" (Tabelle `massnahme`, API, UI).
- **Zusammengelegt/entfernt:** Tabs „Aufgaben" + „Empfehlungen" → in „Maßnahmen" aufgegangen
  (Tab-Buttons, Tab-Inhalte und JS-Funktionen entfernt).
- **Ausgeblendet:** Tabs „Produkte" + „Lernkarten" — nur Tab-Buttons entfernt; HTML-Inhalte,
  JS-Funktionen und APIs (`api/produkte.js`, `api/lernkarten.js`) bleiben erhalten
  (reversibel, gehören zu späteren Bausteinen Standorte / Maßnahmen-Katalog).
- **Nicht destruktiv:** Tabellen `task`, `empfehlung`, `produkt`, `lernkarte` bleiben in der DB
  (kein DROP). `api/tasks.js`, `api/empfehlungen.js` werden entfernt (waren nur für die
  zusammengelegten Tabs).

## Datenmodell — `massnahme`

| Feld | Typ | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| title | text | NOT NULL |
| ressource | text | NULL erlaubt (Strom/Gas/Wasser/Wärme/Druckluft/Sonstige) |
| einsparung_eur | numeric | NULL erlaubt (jährliche Einsparung €) |
| invest_eur | numeric | NULL erlaubt (Investitionskosten €) |
| status | text | NOT NULL, default `idee` |
| verantwortlich | text | NULL erlaubt |
| termin | date | NULL erlaubt |
| standort | text | NULL erlaubt (Freitext; später FK auf `standort`) |
| user_id | text | NOT NULL (Platzhalter `demo`) |
| created_at | timestamptz | NOT NULL, default now() |

- Status-Pipeline: `idee → geplant → in_umsetzung → umgesetzt → verifiziert`.
- **Amortisation** wird zur Laufzeit berechnet, nicht gespeichert:
  `amortisation_jahre = invest_eur / einsparung_eur` (nur wenn einsparung_eur > 0).
  Anzeige: < 1 Jahr als „~X,X Monate", sonst „~X,X Jahre"; sonst „—".
- Index auf `user_id`.
- Migration: neue Datei `db/0002_massnahme.sql` (idempotent, `create table if not exists`).

## API — `api/massnahmen.js`

Stil wie bestehende Functions (json-Helper, readJsonBody, neon, Fehler → 4xx/5xx).

- `GET /api/massnahmen?user_id=` → `{ count, massnahmen: [...] }`, neueste zuerst, limit 200.
- `POST /api/massnahmen` `{title, ressource?, einsparung_eur?, invest_eur?, verantwortlich?, termin?, standort?, user_id?}`
  → 201 `{ massnahme }`. `title` Pflicht (sonst 400). Status default `idee`.
  Numerische Felder: leere/ungültige Werte → NULL.
- `PATCH /api/massnahmen` `{id, ...}` → aktualisiert übergebene Felder (insb. `status`).
  `id` Pflicht (sonst 400). Status nur aus erlaubter Pipeline (sonst 400).
  → 200 `{ massnahme }`; unbekannte id → 404.
- DELETE: vorerst nicht (YAGNI).

## UI — Tab „Maßnahmen"

- **Kennzahlen-Leiste oben:** Anzahl Maßnahmen · Gesamt-Einsparung €/Jahr · Gesamt-Invest €
  · Ø Amortisation · bereits umgesetzte Einsparung €/Jahr (Summe über Status
  umgesetzt+verifiziert).
- **Formular:** Titel, Ressource (select), Einsparung €, Invest €, Verantwortlich, Termin
  (date), Standort. „Hinzufügen" → POST.
- **Liste:** je Maßnahme Titel · Ressource · Einsparung €/J · Invest € · **berechnete
  Amortisation** · Verantwortlich/Termin · **Status als `<select>`** (onchange → PATCH,
  Liste + Kennzahlen aktualisieren). Sortierung nach Amortisation (aufsteigend, beste zuerst);
  Einträge ohne Amortisation ans Ende.
- Theme-Variablen (Dark Mode), `textContent`-Rendering (XSS-sicher), interner Tab-Key
  `massnahmen` (frei).

## Aufräumen in `index.html`

- Tab-Buttons entfernen: `aufgaben`, `lernkarten`, `produkte`, `empfdb` (Empfehlungen).
- Tab-Button hinzufügen: `massnahmen`.
- `showTab`-Array: `aufgaben`, `lernkarten`, `produkte`, `empfdb` raus; `massnahmen` rein.
  Render-Aufrufe entsprechend (`renderMassnahmen()`); `renderTasks`/`renderLernkarten`/
  `renderProdukte`/`renderEmpfehlungenDb`-Aufrufe in showTab entfernen.
- Tab-Inhalte + JS-Funktionen von Aufgaben und Empfehlungen entfernen.
- Tab-Inhalte + JS-Funktionen von Produkte und Lernkarten **bleiben** (nur Button weg).

## Test (end-to-end gegen vercel dev + echte Neon-DB)

1. Migration einspielen, Tabelle `massnahme` vorhanden.
2. POST anlegen (mit/ohne numerische Felder) → 201; POST ohne title → 400.
3. GET listet, neueste/sortiert.
4. PATCH Status `idee → geplant` → 200; ungültiger Status → 400; unbekannte id → 404.
5. Amortisations-Berechnung stichprobenhaft (Monate vs. Jahre vs. „—").
6. HTML: Tab „Maßnahmen" vorhanden; Buttons Aufgaben/Empfehlungen/Produkte/Lernkarten weg.
7. Cleanup (Testzeilen löschen).

## Offen / später

- `user_id`-Platzhalter `demo` bis Auth-Baustein.
- `standort` als Freitext bis Standort-Baustein (dann FK).
- Reaktivierung/Umbau von Produkte→Standorte und Lernkarten→Maßnahmen-Katalog in eigenen Specs.
