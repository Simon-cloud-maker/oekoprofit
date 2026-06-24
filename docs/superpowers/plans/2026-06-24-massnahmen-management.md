# Maßnahmen-Management (ROI) Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Executed inline in this session.

**Goal:** Tab „Maßnahmen" mit ROI/Amortisation und Status-Pipeline; Aufgaben+Empfehlungen zusammenlegen, Produkte+Lernkarten ausblenden.

**Architecture:** Neue Neon-Tabelle `massnahme`; serverlose Function `api/massnahmen.js` (GET/POST/PATCH); ein neuer Tab in der Single-File `index.html`. Verifikation end-to-end via `vercel dev` + curl (kein Unit-Test-Framework im Projekt).

**Tech Stack:** Vanilla HTML/CSS/JS (kein Build), Vercel Serverless Functions (CommonJS), `@neondatabase/serverless`, Neon Postgres.

## Global Constraints

- DATABASE_URL aus Umgebung; lokal via `node --env-file=.env.local …` bzw. `vercel dev`.
- Parametrisierte Queries (tagged templates) — kein String-Concat in SQL.
- Frontend: `textContent` statt innerHTML (XSS), Theme-Variablen (`var(--…)`) für Dark Mode.
- Status-Pipeline exakt: `idee`, `geplant`, `in_umsetzung`, `umgesetzt`, `verifiziert`.
- `user_id`-Platzhalter `demo`.
- Migrationen idempotent (`create table if not exists`).

---

### Task 1: DB-Migration `massnahme`

**Files:**
- Create: `db/0002_massnahme.sql`

**Interfaces:**
- Produces: Tabelle `massnahme(id, title, ressource, einsparung_eur, invest_eur, status, verantwortlich, termin, standort, user_id, created_at)`.

- [ ] **Step 1: Migration schreiben** (`db/0002_massnahme.sql`)

```sql
-- 0002_massnahme.sql — Effizienz-Maßnahmen mit ROI
create table if not exists massnahme (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  ressource      text,
  einsparung_eur numeric,
  invest_eur     numeric,
  status         text        not null default 'idee',
  verantwortlich text,
  termin         date,
  standort       text,
  user_id        text        not null,
  created_at     timestamptz not null default now()
);
create index if not exists idx_massnahme_user on massnahme(user_id);
```

- [ ] **Step 2: Einspielen**

Run: `node --env-file=.env.local scripts/db-migrate.js` — *Achtung:* `db-migrate.js` liest nur `0001_init.sql`. Stattdessen direkt einspielen:
Run: `node --env-file=.env.local -e "const{neon}=require('@neondatabase/serverless');const fs=require('fs');const sql=neon(process.env.DATABASE_URL);const t=fs.readFileSync('db/0002_massnahme.sql','utf8').split('\n').filter(l=>!l.trim().startsWith('--')).join('\n').split(';').map(s=>s.trim()).filter(Boolean);(async()=>{for(const s of t)await sql.query(s);const r=await sql.query(\"select 1 from information_schema.tables where table_name='massnahme'\");console.log('massnahme exists:',r.length>0)})()"`
Expected: `massnahme exists: true`

- [ ] **Step 3: Commit**

```bash
git add db/0002_massnahme.sql
git commit -m "feat(db): massnahme-Tabelle (Effizienzmaßnahmen mit ROI)"
```

---

### Task 2: API `api/massnahmen.js`

**Files:**
- Create: `api/massnahmen.js`

**Interfaces:**
- Consumes: Tabelle `massnahme`.
- Produces: `GET /api/massnahmen?user_id=` → `{count, massnahmen[]}`; `POST` → `{massnahme}` (201); `PATCH` → `{massnahme}` (200).

- [ ] **Step 1: Implementieren** (`api/massnahmen.js`) — Muster wie `api/tasks.js` (json, readJsonBody, neon). GET/POST/PATCH; erlaubte Status-Werte als Konstante; PATCH baut Updates feldweise; unbekannte id → 404; ungültiger Status → 400.

- [ ] **Step 2: e2e-Test** (vercel dev + curl)

```
vercel dev --listen 3030 --yes & (warten bis :3030 antwortet)
U=__m_smoke__
POST /api/massnahmen {title:"Druckluft-Leckagen",ressource:"Druckluft",einsparung_eur:8000,invest_eur:2500,user_id:U}  -> 201, id merken
POST /api/massnahmen {user_id:U}                 -> 400 (title fehlt)
GET  /api/massnahmen?user_id=U                   -> 200, count=1
PATCH /api/massnahmen {id, status:"geplant"}     -> 200, status=geplant
PATCH /api/massnahmen {id, status:"quatsch"}     -> 400
PATCH /api/massnahmen {id:"<random-uuid>", status:"geplant"} -> 404
cleanup: delete from massnahme where user_id=U
```
Expected: alle Codes wie angegeben.

- [ ] **Step 3: Commit**

```bash
git add api/massnahmen.js
git commit -m "feat(api): massnahmen-Endpoint (GET/POST/PATCH, ROI, Status-Pipeline)"
```

---

### Task 3: UI-Tab „Maßnahmen"

**Files:**
- Modify: `index.html` (Tab-Button, Tab-Inhalt, showTab, JS-Funktionen)

**Interfaces:**
- Consumes: `/api/massnahmen`.
- Produces: `renderMassnahmen()`, `addMassnahme()`, `updateMassnahmeStatus(id, status)`; Helfer `amortisationLabel(einsparung, invest)`.

- [ ] **Step 1: Tab-Button** hinzufügen (Tab-Leiste): `<button class="tab" onclick="showTab('massnahmen', this)">Maßnahmen</button>`.

- [ ] **Step 2: Tab-Inhalt** `id="tab-massnahmen"` mit: Kennzahlen-Leiste (`#m-stats`), Formular (Titel `#m-title`, Ressource `#m-ressource` select, Einsparung `#m-einsparung`, Invest `#m-invest`, Verantwortlich `#m-verantwortlich`, Termin `#m-termin` date, Standort `#m-standort`), `#m-status` Meldung, `#m-list`.

- [ ] **Step 3: showTab** — `'massnahmen'` ins Array, `if (name === 'massnahmen') renderMassnahmen();`.

- [ ] **Step 4: JS-Funktionen** — `amortisationLabel`, `renderMassnahmen` (Liste sortiert nach Amortisation aufsteigend, NULL ans Ende; Status als `<select>` mit onchange→`updateMassnahmeStatus`; Kennzahlen berechnen), `addMassnahme` (POST, numerische Felder leer→weglassen), `updateMassnahmeStatus` (PATCH, danach `renderMassnahmen`).

- [ ] **Step 5: e2e-Test** (vercel dev + curl): HTML enthält `tab-massnahmen`, `renderMassnahmen`, `showTab('massnahmen'`; je 1×.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(ui): Maßnahmen-Tab (ROI, Kennzahlen, Status-Pipeline)"
```

---

### Task 4: Aufräumen — Aufgaben/Empfehlungen entfernen, Produkte/Lernkarten ausblenden

**Files:**
- Modify: `index.html`
- Delete: `api/tasks.js`, `api/empfehlungen.js`

**Interfaces:**
- Produces: keine Tab-Buttons mehr für `aufgaben`, `empfdb`, `produkte`, `lernkarten`; showTab-Array ohne diese.

- [ ] **Step 1:** Tab-Buttons entfernen: `aufgaben`, `lernkarten`, `produkte`, `empfdb`.

- [ ] **Step 2:** `showTab`-Array bereinigen (`aufgaben`,`lernkarten`,`produkte`,`empfdb` raus) und die zugehörigen `if (name === …)`-Render-Aufrufe entfernen.

- [ ] **Step 3:** Tab-Inhalte + JS-Funktionen von **Aufgaben** (`tab-aufgaben`, `renderTasks`, `addTask`, `TASK_USER_ID` — Achtung: `TASK_USER_ID` wird von anderen genutzt → in eine neutrale Konstante `APP_USER_ID` umbenennen oder behalten) und **Empfehlungen** (`tab-empfdb`, `renderEmpfehlungenDb`, `loadEmpfehlungen`, `addEmpfehlung`) entfernen.
  - **Hinweis:** `TASK_USER_ID` bleibt als gemeinsame Konstante erhalten (von Lernkarten/Produkte/Maßnahmen referenziert), nur die Task-Render-/Add-Funktionen + Tab gehen weg.

- [ ] **Step 4:** Produkte/Lernkarten: **nur** Tab-Buttons schon in Step 1 entfernt; Tab-Inhalte (`tab-produkte`, `tab-lernkarten`) und JS-Funktionen bleiben unverändert (ausgeblendet, reversibel).

- [ ] **Step 5:** `api/tasks.js` und `api/empfehlungen.js` löschen.

- [ ] **Step 6: e2e-Test:** `grep` zeigt 0 Tab-Buttons für aufgaben/empfdb/produkte/lernkarten; keine verwaisten `renderTasks(`/`renderEmpfehlungenDb(`-Aufrufe in `showTab`; Seite lädt unter `vercel dev` (HTTP 200) und Tab „Maßnahmen" funktioniert (POST/GET via curl).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(ui): Aufgaben+Empfehlungen entfernt (->Maßnahmen), Produkte+Lernkarten ausgeblendet"
```

---

### Task 5: Gesamt-Abnahme

- [ ] **Step 1:** `vercel dev` starten, voller Durchlauf: Maßnahme anlegen → in Liste mit korrekter Amortisation → Status weiterschalten → Kennzahlen aktualisieren sich. Testdaten löschen.
- [ ] **Step 2:** `node --check`-Äquivalent: Seite lädt ohne JS-Fehler (curl HTML + Sichtprüfung der Marker). API-Files `node --check api/massnahmen.js`.
- [ ] **Step 3:** `memory/short_term.md` aktualisieren (Maßnahmen-Tab live, Aufgaben/Empfehlungen weg, Produkte/Lernkarten ausgeblendet).
- [ ] **Step 4: Commit** der Doku-Aktualisierung.

## Self-Review

- **Spec coverage:** Tabelle (T1), API GET/POST/PATCH + Fehlerfälle (T2), UI Tab/Kennzahlen/ROI/Status (T3), Zusammenlegen+Ausblenden (T4), Abnahme+Doku (T5). ✓
- **Placeholder scan:** keine TBD/TODO; Verifikation konkret (curl/Codes). ✓
- **Type/Namens-Konsistenz:** `renderMassnahmen`, `addMassnahme`, `updateMassnahmeStatus`, `amortisationLabel`, Tab-Key `massnahmen`, IDs `m-*` durchgängig. Hinweis zu `TASK_USER_ID` als gemeinsamer Konstante in T4 berücksichtigt. ✓
