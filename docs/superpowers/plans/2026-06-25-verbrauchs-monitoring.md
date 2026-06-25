# Verbrauchs-Monitoring (Zeitreihe) Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`). Inline ausgeführt. Kein Unit-Test-Framework → e2e via `vercel dev` + curl.

**Goal:** Datierte Messungen je Standort + Monitoring-Tab mit Liniendiagramm (Kennzahl über Zeit + Median) und Messwert-Tabelle.

**Architecture:** Neue Neon-Tabelle `messung` (FK→standort); `api/messungen.js` (GET/POST/DELETE); „📈 Als Messung speichern" im Dateneingabe-Tab; Tab „Monitoring" mit Chart.js. Reuse `benchmarkMedian`, `STANDORT_KPIS`, `getVals`.

**Tech Stack:** Vanilla HTML/CSS/JS, Chart.js (vorhanden), Vercel Functions, Neon.

## Global Constraints

- Parametrisierte Queries; `textContent` (XSS); Theme-Variablen.
- KPI-Keys: strom, gas, wasser, abfall, reinigungsmittel (aus `getVals()`).
- `datum` als `JJJJ-MM-01` (aus `type="month"` + '-01').
- Median-Linie via `benchmarkMedian(branche, key)` (Baustein 2).
- Chart.js: vor Neuerzeugung alte Instanz `.destroy()`.
- `user_id`-Platzhalter `demo`.
- Migrationen idempotent.

---

### Task 1: DB-Migration `messung`

**Files:** Create `db/0004_messung.sql`

- [ ] **Step 1:** Migration:
```sql
-- 0004_messung.sql — Zeitreihen-Messungen je Standort
create table if not exists messung (
  id               uuid        primary key default gen_random_uuid(),
  standort_id      uuid        not null references standort(id) on delete cascade,
  datum            date        not null,
  strom            numeric,
  gas              numeric,
  wasser           numeric,
  abfall           numeric,
  reinigungsmittel numeric,
  user_id          text        not null,
  created_at       timestamptz not null default now()
);
create index if not exists idx_messung_standort_datum on messung(standort_id, datum);
```

- [ ] **Step 2:** Einspielen + prüfen:
Run: `node --env-file=.env.local -e "const{neon}=require('@neondatabase/serverless');const fs=require('fs');const sql=neon(process.env.DATABASE_URL);const t=fs.readFileSync('db/0004_messung.sql','utf8').split('\n').filter(l=>!l.trim().startsWith('--')).join('\n').split(';').map(s=>s.trim()).filter(Boolean);(async()=>{for(const s of t)await sql.query(s);const r=await sql.query(\"select column_name from information_schema.columns where table_name='messung' order by ordinal_position\");console.log('cols:',r.map(x=>x.column_name).join(', '))})()"`
Expected: `cols: id, standort_id, datum, strom, gas, wasser, abfall, reinigungsmittel, user_id, created_at`

- [ ] **Step 3:** Commit `feat(db): messung-Tabelle (Zeitreihe)`.

---

### Task 2: API `api/messungen.js`

**Files:** Create `api/messungen.js`

**Interfaces:** `GET ?standort_id=` → `{count, messungen[]}` (datum asc); `POST` → `{messung}` (201); `DELETE ?id=` → `{deleted:true}`.

- [ ] **Step 1:** Implementieren — Muster wie `api/standorte.js` (json, readJsonBody, neon, num/str). Besonderheiten:
  - GET: `standort_id` aus query; ohne → trotzdem Liste limit 500 (oder leer). `order by datum asc`.
  - POST: `standort_id` Pflicht (400), `datum` Pflicht (400). `datum` normalisieren: wenn `/^\d{4}-\d{2}$/` → `+ '-01'`. KPIs via `num()`.
  - Fehler `foreign key` / `invalid input syntax` → 400.
  - DELETE: `id` aus query Pflicht (400), unbekannt → 404.

- [ ] **Step 2:** e2e (vercel dev + curl): Standort anlegen (gastro), dann:
```
POST {standort_id:SID, datum:"2024-01", strom:230, ...} -> 201
POST {standort_id:SID} (kein datum) -> 400
POST {datum:"2024-02"} (kein standort_id) -> 400
POST {standort_id:"00000000-0000-0000-0000-000000000000", datum:"2024-03"} -> 400 (FK)
GET ?standort_id=SID -> count=1, datum aufsteigend
DELETE ?id=MID -> 200 ; DELETE ?id=<zufall-uuid> -> 404
cleanup: Standort löschen (cascade)
```

- [ ] **Step 3:** Commit `feat(api): messungen-Endpoint (GET/POST/DELETE, FK->standort)`.

---

### Task 3: „📈 Als Messung speichern" im Dateneingabe-Tab

**Files:** Modify `index.html` (Zeile bei `#btn-standort`; Funktionen `populateMessungStandorte`, `saveCurrentAsMessung`; Hook in `showTab`)

**Interfaces:** Produces `populateMessungStandorte()`, `saveCurrentAsMessung()`.

- [ ] **Step 1:** UI neben den Speicher-Buttons (nach `#btn-standort`):
```html
<span class="messung-row" style="display:inline-flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
  <select id="ms-standort" class="ai-input" style="width:auto;"></select>
  <input type="month" id="ms-datum" class="ai-input" style="width:auto;">
  <button type="button" class="btn-save" id="btn-messung" onclick="saveCurrentAsMessung()">📈 Als Messung speichern</button>
</span>
```

- [ ] **Step 2:** `populateMessungStandorte()` (füllt `#ms-standort` + setzt Default-Monat):
```js
  async function populateMessungStandorte() {
    const sel = document.getElementById('ms-standort');
    const dat = document.getElementById('ms-datum');
    if (!sel) return;
    if (dat && !dat.value) dat.value = new Date().toISOString().slice(0, 7); // JJJJ-MM
    try {
      const res = await fetch('/api/standorte?user_id=' + encodeURIComponent(TASK_USER_ID));
      const list = res.ok ? ((await res.json()).standorte || []) : [];
      const prev = sel.value;
      sel.textContent = '';
      if (!list.length) {
        const o = document.createElement('option'); o.value = ''; o.textContent = 'Erst Standort anlegen';
        sel.appendChild(o); return;
      }
      for (const s of list) { const o = document.createElement('option'); o.value = s.id; o.textContent = s.name; sel.appendChild(o); }
      if (prev) sel.value = prev;
    } catch { /* still: Auswahl bleibt leer */ }
  }
```

- [ ] **Step 3:** `saveCurrentAsMessung()`:
```js
  async function saveCurrentAsMessung() {
    const sid = document.getElementById('ms-standort').value;
    const monat = document.getElementById('ms-datum').value;
    const statusEl = document.getElementById('save-status');
    if (!sid) { if (statusEl) statusEl.textContent = 'Bitte Standort wählen (ggf. erst anlegen).'; return; }
    if (!monat) { if (statusEl) statusEl.textContent = 'Bitte Monat wählen.'; return; }
    const vals = getVals();
    if (statusEl) statusEl.textContent = 'Speichert Messung…';
    try {
      const res = await fetch('/api/messungen', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ standort_id: sid, datum: monat,
          strom: vals.strom, gas: vals.gas, wasser: vals.wasser, abfall: vals.abfall,
          reinigungsmittel: vals.reinigungsmittel, user_id: TASK_USER_ID })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (statusEl) statusEl.textContent = 'Messung gespeichert ✓ (Tab „Monitoring")';
    } catch (err) { if (statusEl) statusEl.textContent = 'Fehler: ' + err.message; }
  }
```

- [ ] **Step 4:** In `showTab`: bei `if (name === 'eingabe') populateMessungStandorte();` ergänzen. (Falls kein eingabe-Branch existiert, Zeile neu hinzufügen.)

- [ ] **Step 5:** e2e: Seite lädt 200; HTML enthält `btn-messung`, `ms-standort`, `saveCurrentAsMessung` je 1×.

- [ ] **Step 6:** Commit `feat(ui): "Als Messung speichern" in Dateneingabe`.

---

### Task 4: Tab „Monitoring"

**Files:** Modify `index.html` (Tab-Button, `#tab-monitoring`, showTab, JS `renderMonitoring`, `renderMonitoringChart`, `deleteMessung`; Modul-Var `monitorChart`)

**Interfaces:** Produces `renderMonitoring()`, `renderMonitoringChart()`, `deleteMessung(id)`.

- [ ] **Step 1:** Tab-Button nach „Standorte": `<button class="tab" onclick="showTab('monitoring', this)">Monitoring</button>`.

- [ ] **Step 2:** Tab-Inhalt `#tab-monitoring`: Überschrift/Hinweis, `#mon-standort` (select, onchange `renderMonitoring()`), `#mon-kpi` (select, onchange `renderMonitoringChart()`), `<div class="trend-chart-wrap"><canvas id="mon-chart"></canvas></div>`, `#mon-status`, `#mon-table`.

- [ ] **Step 3:** showTab: `'monitoring'` ins Array + `if (name === 'monitoring') renderMonitoring();`.

- [ ] **Step 4:** JS:
  - Modul-Var `let monitorChart = null;` und `let monitorData = [];` (zwischengespeicherte Messungen + aktueller Standort).
  - `renderMonitoring()`: GET `/api/standorte` → `#mon-standort` füllen (Auswahl bewahren); KPI-Select `#mon-kpi` aus `STANDORT_KPIS` füllen (einmalig); kein Standort → Hinweis. Dann GET `/api/messungen?standort_id=<sel>` → in `monitorData`; aktuellen Standort (für Branche/Median) merken; `renderMonitoringChart()` + Tabelle.
  - `renderMonitoringChart()`: aus `monitorData` Labels (datum `slice(0,7)`) + Werte der gewählten Kennzahl; Median = `benchmarkMedian(branche, key)`; `monitorChart?.destroy()`; `new Chart(canvas,{type:'line', data:{labels, datasets:[{label:KPI, data}, {label:'Median', data:labels.map(()=>median), borderDash:[6,4], pointRadius:0}]}})`. Keine Messungen → Hinweis statt Chart.
  - Tabelle: Datum + 5 Kennzahlen, Löschen je Zeile → `deleteMessung(id)`.
  - `deleteMessung(id)`: `confirm` → DELETE `/api/messungen?id=` → `renderMonitoring()`.

- [ ] **Step 5:** e2e: Standort + 2 Messungen POST → Tab-HTML-Marker (`tab-monitoring`, `renderMonitoring`, `mon-chart`) je 1×; Seite lädt 200; GET zeigt 2; DELETE → 1; cleanup (Standort cascade).

- [ ] **Step 6:** Commit `feat(ui): Monitoring-Tab (Zeitreihe + Chart.js + Median)`.

---

### Task 5: Abnahme + Doku

- [ ] **Step 1:** `node --check api/messungen.js`; voller e2e via vercel dev (Standort → Messung speichern-Flow per curl; Monitoring lädt; DELETE; cleanup). Keine Doppel-Funktionen.
- [ ] **Step 2:** `memory/short_term.md`: Monitoring-Baustein ergänzen; Baustein 3 als erledigt.
- [ ] **Step 3:** Commit `docs(memory): Verbrauchs-Monitoring`.

## Self-Review

- **Spec coverage:** Tabelle (T1), API (T2), „Als Messung speichern" (T3), Monitoring-Tab+Chart+Tabelle+Löschen (T4), Abnahme+Doku (T5). ✓
- **Placeholder scan:** keine TBD; konkrete Befehle/Codes. ✓
- **Namens-Konsistenz:** `populateMessungStandorte`, `saveCurrentAsMessung`, `renderMonitoring`, `renderMonitoringChart`, `deleteMessung`, IDs `ms-*`/`mon-*`, Tab-Key `monitoring`, `monitorChart`. `benchmarkMedian`/`STANDORT_KPIS` aus Baustein 2 wiederverwendet. ✓
