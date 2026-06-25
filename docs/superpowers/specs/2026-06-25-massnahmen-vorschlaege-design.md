# Maßnahmen-Vorschläge (Katalog + KI) — Design

_Datum: 2026-06-25 · Status: genehmigt_

## Kontext & Ziel

Erweiterung des Maßnahmen-Tabs (Baustein 1) um **Vorschläge**, die der Nutzer per Klick als
Maßnahme übernimmt. Zwei Quellen: **Katalog** (regelbasiert aus `benchmarks.js`) und **KI**
(dynamisch über das bestehende `/api/ki-consulting`). Kein DB-/API-Umbau — nur `index.html`.

## Bestehende Bausteine, an die angedockt wird

- `OEKOPROFIT_BENCHMARKS.branchen[<key>].quick_wins` (Array) und teils `.massnahmen` (Array).
  Einträge: `{ massnahme, invest_eur?, einsparung_pct?, einsparung_eur_pa?, einsparung_kwh_pa?,
  einsparung_wasser_pct?, amort_jahre?, bereich?, quelle?, co2_* }`.
- `BRANCH_BENCHMARK_MAP` (Select-Wert → benchmarks-Key), `document.getElementById('branche').value`.
- `callOpenRouterDirect(prompt)` → KI-Text (Ollama → OpenRouter/Proxy), wirft bei Fehler.
- `getVals()` (Verbrauchswerte), `calcScore()`.
- `POST /api/massnahmen {title, ressource?, einsparung_eur?, invest_eur?, status?, user_id}`.

## UI — Bereich „💡 Vorschläge" (oben im Maßnahmen-Tab)

- Aufklappbarer Block über dem bestehenden Formular/Liste.
- **Branche-Select** `#vs-branche`: Optionen = Branchen aus `OEKOPROFIT_BENCHMARKS.branchen`
  mit nicht-leerem `quick_wins`. Default = aktuelle Dateneingabe-Branche (`#branche`), falls
  dort vorhanden, sonst erste. `onchange` → `renderVorschlaege()`.
- **Katalog-Liste** `#vs-katalog`: je Eintrag eine Karte mit Name, Invest, Einsparung
  (% oder €/Jahr), Amortisation, Quelle (falls vorhanden) + Button **„+ Übernehmen"**.
- **KI**: Button `#vs-ki-btn` „🤖 KI-Vorschläge generieren" + `#vs-ki-list` + Status `#vs-status`.

## Katalog-Logik

- `renderVorschlaege()`: liest `quick_wins` (+ `massnahmen`, falls Array) der gewählten Branche,
  rendert Karten (`textContent`, XSS-sicher).
- **„+ Übernehmen"** → `uebernehmeMassnahme({...})` mit:
  - `title` ← `massnahme`
  - `invest_eur` ← `invest_eur` (sonst null)
  - `einsparung_eur` ← `einsparung_eur_pa` (sonst **null** — reine %-Angaben lassen sich ohne
    Betriebs-Basiswert nicht in € umrechnen; der %-Wert wird in der Karte angezeigt, nicht gespeichert)
  - `status` ← `idee`, `user_id` ← `TASK_USER_ID`
- Nach Erfolg: `renderMassnahmen()` (Liste/Kennzahlen aktualisieren) + kurze Statusmeldung.

## KI-Logik

- `generateKIVorschlaege()`:
  - Prompt baut auf `getVals()` + Branche + Bitte um **3–5 Maßnahmen als reines JSON-Array**
    `[{"title":"…","ressource":"Strom|Gas|Wasser|Wärme|Druckluft|Sonstige","einsparung_eur":<Zahl|null>,"invest_eur":<Zahl|null>}]`,
    ohne Fließtext.
  - `const text = await callOpenRouterDirect(prompt);`
  - Parsen: ersten `[`…`]`-Block aus `text` extrahieren, `JSON.parse`. Bei Erfolg Karten in
    `#vs-ki-list` mit **„+ Übernehmen"**. Bei Parse-/Aufruf-Fehler: Fallback — Hinweis in
    `#vs-status` + (falls Text vorhanden) Rohtext anzeigen; **kein Absturz**.
  - Button währenddessen disabled + „generiert…".
- „+ Übernehmen" nutzt dieselbe `uebernehmeMassnahme(...)`.

## Kein DB-/Schema-/API-Umbau

`massnahme`-Tabelle und `api/massnahmen.js` bleiben unverändert.

## Test (e2e gegen vercel dev + manuell)

1. Seite lädt (200); Marker `vs-katalog`, `renderVorschlaege`, `generateKIVorschlaege`, `vs-ki-btn` je 1×.
2. Katalog rendert für gastro + baeckerei (Karten-Anzahl > 0).
3. „Übernehmen" eines Katalog-Eintrags → `POST /api/massnahmen` 201; GET zeigt die Maßnahme
   (title/invest korrekt; einsparung_eur gesetzt nur bei `einsparung_eur_pa`-Eintrag).
4. KI-Parsing-Helfer mit Beispiel-JSON (gültig → Array; kaputt → Fallback) — als kleiner
   Node-Check der reinen Parse-Funktion bzw. manuell.
5. Keine Doppel-Funktionen. Cleanup der Testzeilen.

## Offen / später

- Auth statt `user_id='demo'`.
- `ressource`-Ableitung aus `bereich` (derzeit für Katalog null) ggf. später verfeinern.
- KI-Strukturausgabe könnte später ein dedizierter Endpoint mit erzwungenem JSON werden.
