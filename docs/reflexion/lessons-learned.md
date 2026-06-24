# Lessons Learned

**Quellen:** `logs/actions.md`, `memory/decisions.md`, `memory/known_issues.md`, `README.md`  
Alle Einträge sind aus Projektdokumentation und Code-Historie abgeleitet — keine nachträglich erfundenen Behauptungen.

---

## Architektur & Technik

### Single-File-Frontend passt zum Prototyp

**Quelle:** `memory/decisions.md` (2026-04-16)

Vanilla `index.html` ohne Build-Step ermöglicht schnelles Hosting und einfache Iteration. Nachteil: wachsende Komplexität (~3000 Zeilen) ohne Komponenten-Struktur.

**Lesson:** Für PoC und Prompt-Experimente sinnvoll; Skalierung der UI würde später ein Framework erfordern.

---

### Versteckte Slider als State-Holder beibehalten

**Quelle:** `memory/decisions.md` (2026-05-30)

Nach Einführung von Betriebsprofil + Jahreswert-Feldern (`jw-*`) blieben Slider im DOM (`display:none`), weil Excel-Import und Snapshot-Restore noch auf Slider-IDs schreiben.

**Lesson:** Bestehende Datenpfade nicht abrupt brechen — neue Eingabe über `computeFromJahreswerte()` an alte `getVals()`-Logik anbinden.

---

### Ollama gehört nicht in Serverless-Fallbacks

**Quelle:** `memory/known_issues.md`

Lokaler Ollama auf Vercel nicht erreichbar. Server-Proxy sollte klar auf Cloud-APIs setzen; Ollama bleibt optional nur im Browser (`index.html`).

**Lesson:** Keine localhost-Abhängigkeiten in Vercel Functions planen.

---

## Daten & Benchmarks

### Fehlende Quartile verfälschen den Öko-Score

**Quelle:** `known-issues.md`

Kennzahlen ohne p25/median/p75 in `benchmarks.js` fließen nicht in den Score ein → Gesamtwert kann **zu optimistisch** wirken.

**Lesson:** Vor Release prüfen, ob alle fünf Teil-KPIs je aktiver Branche vollständige Quartile haben.

---

### Branchen im UI und in `benchmarks.js` trennen

**Quelle:** `logs/actions.md` (Einzelhandel Food/Nonfood), `index.html` (hidden options)

Falscher Branchen-Mapping (z. B. Nonfood am Food-Strombenchmark) führt zu irreführend guten Scores.

**Lesson:** Dropdown-Wert, `BRANCH_BENCHMARK_MAP` und `benchmarks.js`-Key müssen konsistent sein; generische Labels („Einzelhandel“) ohne Unterscheidung vermeiden.

---

### Recyclingquote durch Reinigungsmittel ersetzt

**Quelle:** `memory/decisions.md` (2026-05-31)

Recyclingquote (%) ist in KMU-Praxis oft unbekannt; Reinigungsmittel steht auf HACCP-Rechnungen und ist per Gemini extrahierbar.

**Lesson:** KPIs wählen, die **erhebbar** sind (Rechnung, Jahreswert), nicht nur theoretisch sinnvoll.

```text
TODO: fachlich klären — known-issues.md erwähnt teils noch recyclingquote_pct; mit aktuellem Code (reinigungsmittel_l_per_ma) abgleichen.
```

---

### Reinigungsmittel in L/Jahr, nicht L/MA in der Eingabe

**Quelle:** `memory/decisions.md` (2026-06-04), `logs/actions.md` (gastro-data-refresh)

Rechnungen liefern Gesamtliter; Division durch MA nur einmal in `computeFromJahreswerte()`.

**Lesson:** UI-Einheit an **Quelldaten** (Rechnung) ausrichten, Normierung intern.

---

## KI & APIs

### OpenRouter Free Tier ist fragil

**Quelle:** `logs/actions.md` (Learnings 2026-04-23), `memory/known_issues.md`

Leere Antworten trotz HTTP 200, variable Response-Struktur (`message.content` vs. `delta.content`).

**Lesson:** Robuste Fallback-Kette im Proxy; für stabilen Betrieb kostenpflichtiges Modell einplanen (`memory/decisions.md`).

---

### Gemini: Files API statt inline Base64

**Quelle:** `logs/actions.md` (2026-05-31), `api/document-reader.js`

Free-Tier-Quota bei großen PDFs mit Base64 schnell erschöpft.

**Lesson:** Dateien über Gemini Files API hochladen, dann per URI referenzieren.

---

### Env-Variablennamen sind exakt

**Quelle:** `README.md`, `api/document-reader.js`

Code liest `GEMINI_API_KEY` — nicht `Gemini_API_Key` oder `GOOGLE_API_KEY`. Prüfung: `GET /api/config` → `hasGeminiKey`.

**Lesson:** Nach Env-Änderung in Vercel **Redeploy**; Namen aus `.env.example` / README übernehmen.

---

### Dokumenten-Reader: immer über Jahreswert-Felder

**Quelle:** `logs/actions.md` (2026-05-31)

Autofill direkt auf Slider umging sichtbare `jw-*`-Felder; Wasser wirkte „erkannt“, Feld blieb leer.

**Lesson:** `setJahreswert('jw-*')` + `computeFromJahreswerte()`; nach Autofill `input`-Event dispatchen.

---

## UX & Frontend

### Default-Slider-Werte ≠ Nutzereingabe

**Quelle:** `memory/decisions.md` (2026-06-04), `logs/actions.md` (fix/det-recs-missing-input)

Deterministische Empfehlungen nutzten Slider-Defaults und zeigten Maßnahmen ohne echten Jahreswert.

**Lesson:** `getInputState().ready` (Jahreswert + Umrechnungsbasis) vor jeder empfehlungsrelevanten Logik prüfen.

---

### Benchmark-UI: pro Metrik „ready“

**Quelle:** `logs/actions.md` (feat/gastro-data-refresh)

Dreistufige Balken (leer / Fehlerhinweis / befüllt) und Score-Ring erst bei vollständiger Datenbasis reduzieren Fehlinterpretation.

**Lesson:** Teilweise Daten nicht als vollständigen Score verkaufen; Fehlerliste mit Umrechnungshinweisen.

---

### Slider-Maximum dynamisch erweitern

**Quelle:** `logs/actions.md` (2026-05-31)

Capping auf `slider.max` erzeugte irreführende „Obergrenze erreicht“-Meldungen nach Autofill.

**Lesson:** Bei hohen Ist-Werten `slider.max` anheben statt still zu capen.

---

## Agentic Workflow & Dokumentation

### Transparenz per Contract + CI

**Quelle:** `memory/decisions.md` (2026-05-13), `AGENTS.md`, `.github/workflows/agent-transparency.yml`

Code-Änderungen an Trigger-Pfaden ohne `logs/actions.md` + `memory/short_term.md` → CI rot.

**Lesson:** Session-Log und Short-Term-Memory sind Teil der Definition of Done, nicht optional.

---

### Memory auf `main` pflegen

**Quelle:** `memory/decisions.md` (2026-05-30)

Feature-Branches mit veraltetem `memory/` führten zu falschem Agent-Kontext nach Branch-Wechsel.

**Lesson:** Handover-Commits für `memory/` und `logs/` direkt auf `main`.

---

### Prompt-Versionierung lohnt sich

**Quelle:** `logs/actions.md` (Learnings), `memory/decisions.md` (2026-04-16)

v1 archiviert, v2 aktiv, Scorecards dokumentieren Qualitätssprünge.

**Lesson:** Iterationen nicht überschreiben — archivieren und bewerten.

---

### Englische Prompts, deutsche Memory-Dateien

**Quelle:** `memory/decisions.md` (2026-05-12)

Bewusste Mischung: LLM-Robustheit vs. Lesbarkeit für Prüfer/Team.

**Lesson:** Sprachwahl pro Zielgruppe, nicht alles vereinheitlichen.

---

## Deployment & Betrieb

### Snapshots nur im Browser

**Quelle:** `index.html`, `README.md`

Key `oekoprofit-snapshots` in `localStorage` — kein serverseitiges Backup ohne Export.

**Lesson:** JSON-Backup/CSV-Export für Dokumentation und Gerätewechsel kommunizieren (Buttons im Tab Verlauf).

---

### Zwei Hosting-Pfade dokumentieren

**Quelle:** `README.md`, `memory/long_term.md`, `docs/entwicklung/deployment.md`

App auf Vercel; MkDocs auf GitHub Pages — unterschiedliche URLs und Setup-Schritte.

```text
TODO: fachlich klären — ob long_term.md noch GitHub Pages als Frontend-Hosting nennt; aktuell ist Vercel die Live-App-URL.
```

---

## Offene Punkte (aus Doku-TODOs)

| Thema | Quelle |
|-------|--------|
| Automatisierte UI-Tests | `docs/architektur/frontend.md` |
| MkDocs / known-issues Sync | `docs/daten/bekannte-einschraenkungen.md` |
| Snapshot-Schema (jw + Profil) | `docs/benutzer/verlauf.md` |
| „Alle Snapshots löschen“-Funktion | `docs/benutzer/verlauf.md` |

Diese Punkte sind bewusst **nicht** als Lessons formuliert, bis sie geklärt oder umgesetzt sind.
