# Standorte + Multi-Standort-Benchmarking Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Executed inline in this session. Kein Unit-Test-Framework → Verifikation e2e via `vercel dev` + curl.

**Goal:** Persistente Standorte (aus Dateneingabe gespeichert) und ein Tab, das sie untereinander + gegen Branchen-Median vergleicht.

**Architecture:** Neue Neon-Tabelle `standort`; Function `api/standorte.js` (GET/POST/DELETE); „Als Standort speichern" im Dateneingabe-Tab nutzt `getVals()`/`calcScore()`; neues Tab „Standorte" mit Branche-Filter + Vergleichstabelle (Best/Schlecht + Median-Zeile).

**Tech Stack:** Vanilla HTML/CSS/JS, Vercel Functions (CommonJS), `@neondatabase/serverless`, Neon Postgres.

## Global Constraints

- Parametrisierte Queries (tagged templates / `sql.query` mit Params).
- `textContent` statt innerHTML; Theme-Variablen für Dark Mode.
- `branche` ∈ {gastro, baeckerei} (Select-Werte); Mapping via `BRANCH_BENCHMARK_MAP`.
- KPI-Keys: strom, gas, wasser, abfall, reinigungsmittel (normalisiert, aus `getVals()`).
- Median-Zuordnung wie im Benchmark-Tab: strom→`strom_kwh_per_m2`, gas→`heizwaerme_kwh_per_m2`||`waerme_kwh_per_m2`, wasser→`wasser_liter_per_ma_tag` (Median in m³/MA = `median*250/1000`), abfall→`abfall_kg_per_ma`, reinigungsmittel→`reinigungsmittel_l_per_ma`.
- `user_id`-Platzhalter `demo`.
- Migrationen idempotent.

---

### Task 1: DB-Migration `standort`

**Files:** Create `db/0003_standort.sql`

- [ ] **Step 1:** Migration schreiben:

```sql
-- 0003_standort.sql — Standorte/Werke für Multi-Standort-Benchmarking
create table if not exists standort (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  branche          text        not null,
  strom            numeric,
  gas              numeric,
  wasser           numeric,
  abfall           numeric,
  reinigungsmittel numeric,
  score            numeric,
  user_id          text        not null,
  created_at       timestamptz not null default now()
);
create index if not exists idx_standort_user on standort(user_id);
```

- [ ] **Step 2:** Einspielen + prüfen:
Run: `node --env-file=.env.local -e "const{neon}=require('@neondatabase/serverless');const fs=require('fs');const sql=neon(process.env.DATABASE_URL);const t=fs.readFileSync('db/0003_standort.sql','utf8').split('\n').filter(l=>!l.trim().startsWith('--')).join('\n').split(';').map(s=>s.trim()).filter(Boolean);(async()=>{for(const s of t)await sql.query(s);const r=await sql.query(\"select column_name from information_schema.columns where table_name='standort' order by ordinal_position\");console.log('cols:',r.map(x=>x.column_name).join(', '))})()"`
Expected: `cols: id, name, branche, strom, gas, wasser, abfall, reinigungsmittel, score, user_id, created_at`

- [ ] **Step 3:** Commit `feat(db): standort-Tabelle`.

---

### Task 2: API `api/standorte.js`

**Files:** Create `api/standorte.js`

**Interfaces:** `GET ?user_id=` → `{count, standorte[]}`; `POST` → `{standort}` (201); `DELETE ?id=` → `{deleted:true}` (200).

- [ ] **Step 1:** Implementieren — Muster wie `api/massnahmen.js` (json, readJsonBody, neon, `num`/`str` Helfer). Erlaubte Branchen `['gastro','baeckerei']`. POST: `name` Pflicht (400), `branche` Pflicht ∈ erlaubt (400), numerische Felder via `num()`. DELETE: `id` aus `req.query` Pflicht (400), unbekannt → 404, ungültige UUID → 400.

- [ ] **Step 2:** e2e (vercel dev + curl):
```
POST {name:"Werk M", branche:"gastro", strom:230, gas:185, wasser:55, abfall:60, reinigungsmittel:70, score:72, user_id:U} -> 201
POST {branche:"gastro", user_id:U}          -> 400 (name fehlt)
POST {name:"X", branche:"foo", user_id:U}   -> 400 (branche ungültig)
GET ?user_id=U                              -> 200, count=1
DELETE ?id=<id>                             -> 200 {deleted:true}
DELETE ?id=00000000-0000-0000-0000-000000000000 -> 404
cleanup
```

- [ ] **Step 3:** Commit `feat(api): standorte-Endpoint (GET/POST/DELETE)`.

---

### Task 3: „Als Standort speichern" im Dateneingabe-Tab

**Files:** Modify `index.html` (Button bei `#btn-snapshot` ~Zeile 1150; Funktion `saveCurrentAsStandort` nahe `saveSnapshot`)

**Interfaces:** Produces `saveCurrentAsStandort()`; nutzt `getVals()`, `document.getElementById('branche').value`, `calcScore(getVals())`.

- [ ] **Step 1:** Button neben Snapshot-Button:
```html
<button type="button" class="btn-save" id="btn-standort" onclick="saveCurrentAsStandort()">🏭 Als Standort speichern</button>
```

- [ ] **Step 2:** Funktion `saveCurrentAsStandort()` (nahe `saveSnapshot`):
```js
  async function saveCurrentAsStandort() {
    const name = (prompt('Name des Standorts (z. B. „Werk München"):') || '').trim();
    if (!name) return;
    const vals = getVals();
    const branche = document.getElementById('branche').value;
    let score = null;
    try { score = calcScore(vals, branche); } catch (e) { score = null; }
    try {
      const res = await fetch('/api/standorte', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, branche,
          strom: vals.strom, gas: vals.gas, wasser: vals.wasser,
          abfall: vals.abfall, reinigungsmittel: vals.reinigungsmittel,
          score, user_id: TASK_USER_ID })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      alert('Standort „' + name + '" gespeichert. (Tab „Standorte" zeigt den Vergleich.)');
    } catch (err) { alert('Fehler beim Speichern: ' + err.message); }
  }
```
(`calcScore` Signatur prüfen: nutzt intern `document.getElementById('branche')`, Argumente daher unkritisch.)

- [ ] **Step 3:** e2e: HTML enthält `btn-standort` + `saveCurrentAsStandort` (je 1×); Seite lädt 200.

- [ ] **Step 4:** Commit `feat(ui): "Als Standort speichern" in Dateneingabe`.

---

### Task 4: Tab „Standorte" (Vergleichstabelle)

**Files:** Modify `index.html` (Tab-Button, Tab-Inhalt, showTab, JS)

**Interfaces:** Produces `renderStandorte()`, `deleteStandort(id)`, `benchmarkMedian(branche, key)`.

- [ ] **Step 1:** Tab-Button nach „Maßnahmen": `<button class="tab" onclick="showTab('standorte', this)">Standorte</button>`.

- [ ] **Step 2:** Tab-Inhalt `id="tab-standorte"`: Überschrift, Hinweis, `#st-branche` (select, onchange→renderStandorte), `#st-status`, `#st-table`.

- [ ] **Step 3:** showTab: `'standorte'` ins Array + `if (name === 'standorte') renderStandorte();`.

- [ ] **Step 4:** JS:
  - `benchmarkMedian(branche, key)` → Median in eingegebener Einheit:
    ```js
    function benchmarkMedian(branche, key) {
      const bk = BRANCH_BENCHMARK_MAP[branche];
      const k = OEKOPROFIT_BENCHMARKS.branchen[bk] && OEKOPROFIT_BENCHMARKS.branchen[bk].kennzahlen;
      if (!k) return null;
      if (key === 'strom') return k.strom_kwh_per_m2 ? k.strom_kwh_per_m2.median : null;
      if (key === 'gas') { const g = k.heizwaerme_kwh_per_m2 || k.waerme_kwh_per_m2; return g ? g.median : null; }
      if (key === 'wasser') return k.wasser_liter_per_ma_tag ? Math.round((k.wasser_liter_per_ma_tag.median * 250) / 1000) : null;
      if (key === 'abfall') return k.abfall_kg_per_ma ? k.abfall_kg_per_ma.median : null;
      if (key === 'reinigungsmittel') return k.reinigungsmittel_l_per_ma ? k.reinigungsmittel_l_per_ma.median : null;
      return null;
    }
    ```
  - `renderStandorte()`: GET `/api/standorte?user_id=`; Branche-Filter füllen (nur vorhandene Branchen; Default = häufigste); Tabelle der gefilterten Standorte mit Spalten Name/strom/gas/wasser/abfall/reinigungsmittel/Score/Löschen; pro Verbrauchs-Spalte min=grün/max=rot (bei ≥2 Werten), Score max=grün/min=rot; Median-Zeile via `benchmarkMedian`; Leerzustand.
  - `deleteStandort(id)`: `confirm()` → DELETE → renderStandorte.
  - Branchen-Labels: `{gastro:'Gastronomie', baeckerei:'Bäckerei'}`.

- [ ] **Step 5:** e2e: 2 Standorte (gastro) POST → Tab-HTML-Marker (`tab-standorte`, `renderStandorte`, `showTab('standorte'`) je 1×; Seite lädt 200; GET zeigt beide; DELETE einer → einer übrig; cleanup.

- [ ] **Step 6:** Commit `feat(ui): Standorte-Tab mit Vergleichstabelle`.

---

### Task 5: Abnahme + Doku

- [ ] **Step 1:** `node --check api/standorte.js`; voller Durchlauf via `vercel dev` (Standort speichern aus Dateneingabe-Flow simuliert per curl; Tab lädt; DELETE). Cleanup Testdaten.
- [ ] **Step 2:** `memory/short_term.md` aktualisieren (Standorte-Tab + „Als Standort speichern"; Backlog: Maßnahmen-Vorschläge als nächster Baustein).
- [ ] **Step 3:** Commit `docs(memory): Standorte-Baustein`.

## Self-Review

- **Spec coverage:** Tabelle (T1), API GET/POST/DELETE (T2), „Als Standort speichern" (T3), Tab+Filter+Tabelle+Median+Best/Schlecht+Löschen (T4), Abnahme+Doku (T5). ✓
- **Placeholder scan:** keine TBD; Verifikation konkret. ✓
- **Namens-Konsistenz:** `renderStandorte`, `deleteStandort`, `benchmarkMedian`, `saveCurrentAsStandort`, Tab-Key `standorte`, IDs `st-*`, `btn-standort` durchgängig. ✓
