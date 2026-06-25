# Maßnahmen-Vorschläge (Katalog + KI) Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`). Inline ausgeführt. Kein Unit-Test-Framework → e2e via `vercel dev` + curl; reine Parse-Funktion via `node -e`.

**Goal:** Im Maßnahmen-Tab ein „💡 Vorschläge"-Bereich: Katalog (aus benchmarks.js) + KI (über /api/ki-consulting), je „+ Übernehmen" legt eine Maßnahme an.

**Architecture:** Nur `index.html` (UI + JS). Katalog liest `OEKOPROFIT_BENCHMARKS.branchen[<b>].quick_wins`/`.massnahmen`; KI nutzt `callOpenRouterDirect(prompt)` + client-seitiges JSON-Parsing; Übernehmen → `POST /api/massnahmen`. Kein DB/API-Umbau.

**Tech Stack:** Vanilla HTML/CSS/JS, Vercel Functions (vorhanden), Neon (vorhanden).

## Global Constraints

- `textContent` statt innerHTML (XSS); Theme-Variablen (Dark Mode).
- Branchen-Keys via `BRANCH_BENCHMARK_MAP`; KPI/Score wie bestehend.
- Übernehmen-Mapping: title←massnahme, invest_eur←invest_eur||null, einsparung_eur←einsparung_eur_pa||null, status←'idee', user_id←TASK_USER_ID.
- KI: reines JSON-Array erbitten; Parsing mit Fallback (kein Absturz).
- `user_id`-Platzhalter `demo`.

---

### Task 1: „💡 Vorschläge"-Bereich (UI-Gerüst) im Maßnahmen-Tab

**Files:** Modify `index.html` (Tab-Inhalt `#tab-massnahmen` oben; Hook in `renderMassnahmen`)

**Interfaces:** Produces DOM-IDs `vs-branche`, `vs-katalog`, `vs-ki-btn`, `vs-ki-list`, `vs-status`; Funktion `renderVorschlaege()` wird aus `renderMassnahmen()` aufgerufen.

- [ ] **Step 1:** Im `#tab-massnahmen` (vor dem bestehenden Formular) Block einfügen:
```html
<details id="vs-box" open style="margin-bottom:1rem;">
  <summary style="cursor:pointer; font-weight:600;">💡 Vorschläge</summary>
  <div style="margin:0.5rem 0;">
    <label for="vs-branche" style="font-size:13px;">Branche</label>
    <select id="vs-branche" class="ai-input" onchange="renderVorschlaege()"></select>
  </div>
  <div id="vs-katalog"></div>
  <div style="margin:0.75rem 0;">
    <button type="button" class="btn" id="vs-ki-btn" onclick="generateKIVorschlaege()">🤖 KI-Vorschläge generieren</button>
  </div>
  <div id="vs-status" style="font-size:13px; min-height:1.2em;"></div>
  <div id="vs-ki-list"></div>
</details>
```

- [ ] **Step 2:** In `renderMassnahmen()` am Anfang `renderVorschlaege();` aufrufen (so lädt der Katalog beim Öffnen des Tabs). Falls `renderVorschlaege` noch nicht existiert: erst Task 2; für Task 1 reicht eine leere `function renderVorschlaege(){}` als Platzhalter, die in Task 2 ersetzt wird.

- [ ] **Step 3:** e2e: Seite lädt (200); HTML enthält `id="vs-katalog"`, `id="vs-ki-btn"` je 1×.

- [ ] **Step 4:** Commit `feat(ui): Vorschläge-Bereich im Maßnahmen-Tab (Gerüst)`.

---

### Task 2: Katalog-Vorschläge

**Files:** Modify `index.html` (JS: `renderVorschlaege`, `uebernehmeMassnahme`)

**Interfaces:** Consumes `OEKOPROFIT_BENCHMARKS`, `BRANCH_BENCHMARK_MAP`, `POST /api/massnahmen`, `renderMassnahmen`. Produces `uebernehmeMassnahme(obj)` (obj: {title, invest_eur, einsparung_eur, ressource?}).

- [ ] **Step 1:** `uebernehmeMassnahme(obj)`:
```js
  async function uebernehmeMassnahme(obj, statusElId) {
    const statusEl = document.getElementById(statusElId || 'vs-status');
    statusEl.style.color = ''; statusEl.textContent = 'Übernehme…';
    try {
      const res = await fetch('/api/massnahmen', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: obj.title, ressource: obj.ressource || undefined,
          einsparung_eur: (obj.einsparung_eur ?? undefined),
          invest_eur: (obj.invest_eur ?? undefined),
          status: 'idee', user_id: TASK_USER_ID
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      statusEl.textContent = 'Übernommen ✓';
      await renderMassnahmen();
    } catch (err) { statusEl.style.color = '#c0392b'; statusEl.textContent = 'Fehler: ' + err.message; }
  }
```
(Hinweis: `renderMassnahmen` ruft `renderVorschlaege` erneut auf — Endlosrekursion vermeiden, indem `renderVorschlaege` NICHT `renderMassnahmen` aufruft.)

- [ ] **Step 2:** `renderVorschlaege()` (ersetzt Platzhalter):
```js
  const VS_BRANCHE_LABEL = { gastronomie:'Gastronomie', baeckerei:'Bäckerei', buero:'Büro', einzelhandel_food:'Einzelhandel (Food)', einzelhandel_nonfood:'Einzelhandel (Non-Food)', produktion:'Produktion' };
  function vorschlagBranchen() {
    return Object.keys(OEKOPROFIT_BENCHMARKS.branchen)
      .filter(k => Array.isArray(OEKOPROFIT_BENCHMARKS.branchen[k].quick_wins) && OEKOPROFIT_BENCHMARKS.branchen[k].quick_wins.length);
  }
  function einsparungText(e) {
    if (e.einsparung_eur_pa) return e.einsparung_eur_pa.toLocaleString('de-DE') + ' €/Jahr';
    if (e.einsparung_pct) return '−' + e.einsparung_pct + ' %';
    if (e.einsparung_wasser_pct) return '−' + e.einsparung_wasser_pct + ' % Wasser';
    if (e.einsparung_kwh_pa) return e.einsparung_kwh_pa.toLocaleString('de-DE') + ' kWh/Jahr';
    return '—';
  }
  function renderVorschlaege() {
    const sel = document.getElementById('vs-branche');
    const listEl = document.getElementById('vs-katalog');
    if (!sel || !listEl) return;
    // Branche-Select füllen (Default = Dateneingabe-Branche)
    const branchen = vorschlagBranchen();
    if (!sel.options.length) {
      // #branche-Select-Wert (z. B. 'gastro') -> Benchmark-Key (z. B. 'gastronomie')
      const selEl = document.getElementById('branche');
      const def = selEl ? BRANCH_BENCHMARK_MAP[selEl.value] : null;
      for (const b of branchen) {
        const o = document.createElement('option'); o.value = b;
        o.textContent = (VS_BRANCHE_LABEL[b] || b);
        sel.appendChild(o);
      }
      sel.value = branchen.includes(def) ? def : branchen[0];
    }
    const branche = sel.value;
    const data = OEKOPROFIT_BENCHMARKS.branchen[branche] || {};
    const eintraege = [].concat(data.quick_wins || [], Array.isArray(data.massnahmen) ? data.massnahmen : []);
    listEl.textContent = '';
    if (!eintraege.length) { listEl.textContent = 'Keine Katalog-Vorschläge für diese Branche.'; return; }
    for (const e of eintraege) {
      const card = document.createElement('div');
      card.style.cssText = 'display:flex; justify-content:space-between; gap:1rem; align-items:center; padding:0.4rem 0.25rem; border-bottom:1px solid var(--border);';
      const info = document.createElement('div');
      const t = document.createElement('div'); t.style.fontWeight = '600'; t.textContent = e.massnahme; info.appendChild(t);
      const meta = document.createElement('div'); meta.style.cssText = 'font-size:12px; color:var(--gray-600);';
      const parts = [];
      if (e.invest_eur != null) parts.push('Invest ' + e.invest_eur.toLocaleString('de-DE') + ' €');
      parts.push('Einsparung ' + einsparungText(e));
      if (e.amort_jahre != null) parts.push('Amort. ' + e.amort_jahre + ' J');
      if (e.quelle) parts.push('Quelle: ' + e.quelle);
      meta.textContent = parts.join(' · '); info.appendChild(meta);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn'; btn.textContent = '+ Übernehmen';
      btn.onclick = () => uebernehmeMassnahme({ title: e.massnahme, invest_eur: (e.invest_eur != null ? e.invest_eur : null), einsparung_eur: (e.einsparung_eur_pa != null ? e.einsparung_eur_pa : null) });
      card.appendChild(info); card.appendChild(btn); listEl.appendChild(card);
    }
  }
```

- [ ] **Step 3:** e2e (vercel dev + curl):
```
Seite lädt 200; #vs-branche füllt sich (manuell/Marker).
Simuliere „Übernehmen": POST /api/massnahmen {title:"Spülmaschinen-Austausch", invest_eur:5000, user_id:__v__} -> 201
GET /api/massnahmen?user_id=__v__ -> count=1, invest_eur=5000
cleanup
```

- [ ] **Step 4:** Commit `feat(ui): Katalog-Vorschläge mit Übernehmen`.

---

### Task 3: KI-Vorschläge

**Files:** Modify `index.html` (JS: `parseKIVorschlaege`, `generateKIVorschlaege`)

**Interfaces:** Consumes `callOpenRouterDirect`, `getVals`, `uebernehmeMassnahme`. Produces `parseKIVorschlaege(text)` → Array.

- [ ] **Step 1:** Reiner Parser (testbar):
```js
  function parseKIVorschlaege(text) {
    if (typeof text !== 'string') return [];
    const a = text.indexOf('['), b = text.lastIndexOf(']');
    if (a === -1 || b === -1 || b <= a) return [];
    let arr;
    try { arr = JSON.parse(text.slice(a, b + 1)); } catch { return []; }
    if (!Array.isArray(arr)) return [];
    return arr.filter(o => o && typeof o.title === 'string' && o.title.trim())
      .map(o => ({
        title: o.title.trim(),
        ressource: typeof o.ressource === 'string' ? o.ressource : null,
        einsparung_eur: Number.isFinite(Number(o.einsparung_eur)) ? Number(o.einsparung_eur) : null,
        invest_eur: Number.isFinite(Number(o.invest_eur)) ? Number(o.invest_eur) : null,
      }));
  }
```

- [ ] **Step 2:** Parser-Check via node:
Run: `node -e "$(cat <<'EOF'
function parseKIVorschlaege(text){if(typeof text!=='string')return[];const a=text.indexOf('['),b=text.lastIndexOf(']');if(a===-1||b===-1||b<=a)return[];let arr;try{arr=JSON.parse(text.slice(a,b+1))}catch{return[]}if(!Array.isArray(arr))return[];return arr.filter(o=>o&&typeof o.title==='string'&&o.title.trim()).map(o=>({title:o.title.trim(),ressource:typeof o.ressource==='string'?o.ressource:null,einsparung_eur:Number.isFinite(Number(o.einsparung_eur))?Number(o.einsparung_eur):null,invest_eur:Number.isFinite(Number(o.invest_eur))?Number(o.invest_eur):null}))}
const ok=parseKIVorschlaege('Hier: [{\"title\":\"LED\",\"einsparung_eur\":4200,\"invest_eur\":6000,\"ressource\":\"Strom\"}] danke');
const bad=parseKIVorschlaege('kein json');
console.log('ok len', ok.length, ok[0].title, ok[0].einsparung_eur);
console.log('bad len', bad.length);
if(ok.length===1 && ok[0].title==='LED' && bad.length===0) console.log('PARSER OK'); else {console.log('PARSER FAIL'); process.exit(1);}
EOF
)"`
Expected: `PARSER OK`

- [ ] **Step 3:** `generateKIVorschlaege()`:
```js
  async function generateKIVorschlaege() {
    const btn = document.getElementById('vs-ki-btn');
    const statusEl = document.getElementById('vs-status');
    const listEl = document.getElementById('vs-ki-list');
    const vals = getVals();
    const branche = document.getElementById('vs-branche').value;
    const prompt = 'Du bist Energieeffizienz-Berater. Betrieb Branche "' + branche + '". '
      + 'Aktuelle Kennzahlen (normalisiert): Strom ' + vals.strom + ' kWh/m², Gas ' + vals.gas
      + ' kWh/m², Wasser ' + vals.wasser + ' m³/MA, Abfall ' + vals.abfall + ' kg/MA, Reinigungsmittel '
      + vals.reinigungsmittel + ' L/MA. Schlage 3-5 konkrete Effizienzmaßnahmen vor. '
      + 'Antworte AUSSCHLIESSLICH mit einem JSON-Array, ohne Fließtext, Format: '
      + '[{"title":"…","ressource":"Strom|Gas|Wasser|Wärme|Druckluft|Sonstige","einsparung_eur":<Zahl oder null>,"invest_eur":<Zahl oder null>}].';
    btn.disabled = true; statusEl.style.color = ''; statusEl.textContent = 'KI generiert…'; listEl.textContent = '';
    try {
      const text = await callOpenRouterDirect(prompt);
      const items = parseKIVorschlaege(text);
      if (!items.length) {
        statusEl.style.color = '#c0392b';
        statusEl.textContent = 'KI-Antwort konnte nicht als Maßnahmen gelesen werden.';
        const pre = document.createElement('pre'); pre.style.cssText = 'white-space:pre-wrap; font-size:12px; color:var(--gray-600);';
        pre.textContent = text; listEl.appendChild(pre);
        return;
      }
      statusEl.textContent = items.length + ' KI-Vorschläge:';
      for (const it of items) {
        const card = document.createElement('div');
        card.style.cssText = 'display:flex; justify-content:space-between; gap:1rem; align-items:center; padding:0.4rem 0.25rem; border-bottom:1px solid var(--border);';
        const info = document.createElement('div');
        const t = document.createElement('div'); t.style.fontWeight = '600'; t.textContent = it.title; info.appendChild(t);
        const meta = document.createElement('div'); meta.style.cssText = 'font-size:12px; color:var(--gray-600);';
        const parts = [];
        if (it.ressource) parts.push(it.ressource);
        if (it.einsparung_eur != null) parts.push('Einsparung ' + it.einsparung_eur.toLocaleString('de-DE') + ' €/J');
        if (it.invest_eur != null) parts.push('Invest ' + it.invest_eur.toLocaleString('de-DE') + ' €');
        meta.textContent = parts.join(' · '); info.appendChild(meta);
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = '+ Übernehmen';
        b.onclick = () => uebernehmeMassnahme(it);
        card.appendChild(info); card.appendChild(b); listEl.appendChild(card);
      }
    } catch (err) {
      statusEl.style.color = '#c0392b'; statusEl.textContent = 'KI-Fehler: ' + (err && err.message ? err.message : err);
    } finally { btn.disabled = false; }
  }
```

- [ ] **Step 4:** e2e: Seite lädt 200; Marker `generateKIVorschlaege`, `parseKIVorschlaege` je 1×. (KI-Live-Antwort nicht deterministisch — Parser ist via Step 2 abgedeckt.)

- [ ] **Step 5:** Commit `feat(ui): KI-Vorschläge (JSON-Parsing + Fallback)`.

---

### Task 4: Abnahme + Doku

- [ ] **Step 1:** Voller e2e via vercel dev: Seite lädt; Katalog-Übernehmen legt Maßnahme an (POST 201 / GET); keine Doppel-Funktionen (`renderVorschlaege`, `uebernehmeMassnahme`, `generateKIVorschlaege`, `parseKIVorschlaege` je 1×); cleanup.
- [ ] **Step 2:** `memory/short_term.md`: Maßnahmen-Vorschläge (Katalog + KI) ergänzt; Backlog-Eintrag entfernen.
- [ ] **Step 3:** Commit `docs(memory): Maßnahmen-Vorschläge`.

## Self-Review

- **Spec coverage:** Bereich/UI (T1), Katalog + Übernehmen (T2), KI + Parser + Fallback (T3), Abnahme+Doku (T4). ✓
- **Placeholder scan:** keine TBD; konkrete Code/Checks. ✓
- **Namens-Konsistenz:** `renderVorschlaege`, `uebernehmeMassnahme`, `parseKIVorschlaege`, `generateKIVorschlaege`, IDs `vs-*`. `renderVorschlaege` ruft NICHT `renderMassnahmen` (Rekursionsschutz). **Branchen-Koordinaten:** Katalog ist nach Benchmark-Keys (`gastronomie`…) indexiert; `#branche`-Select-Werte (`gastro`…) werden via `BRANCH_BENCHMARK_MAP` gemappt; Labels via eigener `VS_BRANCHE_LABEL`. ✓
