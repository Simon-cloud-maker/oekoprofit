# Session Action Log

## Feature-Übersicht (Task-Mapping)

| Arbeitsbezeichnung | Branch | Beschreibung |
|--------------------|--------|--------------|
| Task 1 | feat/bakery-benchmarks | Bäckerei-Benchmarks |
| Task 2 | feat/ui-focus-two-cases | UI-Fokus (Gastronomie & Büro) |
| Task 3 | feat/branch-specific-inputs | Branchenspezifische Eingabefelder |
| Task 4 | feat/gemini-document-reader | Dokumentenextraktion (Gemini) |
| Task 4b | feat/gemini-document-reader | Reinigungsmittel-Extraktion |
| Task 5 | feat/deterministic-recommendations | Deterministische Empfehlungen |
| Task 6 | feat/sharper-ai-recommendations | Schärfere KI-Empfehlungen |
| Task 7 | feat/replace-recycling-metric | Recyclingquote → Reinigungsmittel |
| Task 8 | feat/benchmark-tab-update | Benchmark-Tab Überarbeitung |
| — | feat/waste-kpi | Abfall-KPI (Gewicht) |
| Task 9 | feat/gastro-data-refresh | Gastro-Quellen-Refresh + UX-Verbesserungen |

_Die Bezeichnungen „Task 1"–„Task 8" wurden nur lokal zur Orientierung verwendet._

---

## [2026-06-18] style(ui): Dark-Mode-Korrekturen für Buttons und Tabellen

**Ziel:** Im Dark Mode lesbare und konsistente Hover-/Aktivzustände für Snapshots, Upload-Buttons, KI-Button, Tabs und Vergleichstabelle.

**Aktionen:**
- `index.html`: CSS unter `[data-theme="dark"]` für `.snap-btn`, `.snapshot-item`, `.upload-row label.btn`, `.ai-btn`, `.tab.active`, Slider, `.cmp-controls select`, `.cmp-table`-Diff-Farben.

**Ergebnis:** Verlauf-, Import- und Aktions-Buttons im Dark Mode mit grünem Akzent statt unreadable gray-on-dark.

**Nächster Schritt:** Auf https://oekoprofit-ki.vercel.app im Dark Mode prüfen (nach Vercel-Deploy).

---

## [2026-06-04] feat/gastro-data-refresh: Gastro-Quellen-Refresh & UX-Verbesserungen

**Branch:** `feat/gastro-data-refresh`
**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:** Reinigungsmittel-Input vereinfachen (Gesamtliter statt L/MA), Benchmark-Balken pro Metrik individuell befüllen, Score-Ring erst bei vollständiger Datenbasis anzeigen, veraltete Gastronomie-Quellen aktualisieren, Quick Wins verbessern, Legende modernisieren.

**Aktionen:**
- `benchmarks.js`: `strom_kwh_per_m2`-Quelle → DEHOGA 2023 / dena 2022; `wasser_liter_per_gedeck`-Quelle → DEHOGA 2021; `energiekosten_anteil_umsatz_pct`-Quelle → DEHOGA Zahlenspiegel 2023
- `benchmarks.js`: Quick Win „Minibar-Abschaltung (Hotel)" ersetzt durch „Speisereste-App (Too Good To Go / ResQ)" + „Außenbeleuchtung: Zeitschalter & LED"
- `index.html`: Reinigungsmittel-Input auf L/Jahr (Gesamtliter) umgestellt; Label, Unit (`L / Jahr`), Placeholder (`z. B. 175`) angepasst; Input-Label „(gesamt)" entfernt
- `index.html`: `applyDocumentResult()` — Gemini schreibt Gesamtliter ins Feld (keine Vor-Division mehr)
- `index.html`: Missing-Hint in `computeFromJahreswerte()` um `jwReinigung` erweitert
- `index.html`: `getInputState()` (Map pro Metrik: `hasVal`, `convOk`, `convLabel`, `ready`) ersetzt `hasUserInput()`
- `index.html`: Balken dreistufig: (1) kein Jahreswert → leer, (2) Jahreswert aber Profilfeld fehlt → leer + Fehlerhinweis, (3) beides vorhanden → befüllt
- `index.html`: Score-Ring leer (grauer Kreis, „—", Öko-Score: —/100) bis alle 5 ready; Fehlerliste mit Umrechnungshinweisen
- `index.html`: Legende als farbige Badges + Median-Strich; Badge-Farben modusbewusst (`--green-50`, `--amber-50`, `--coral-50`); Median-Text in `--gray-900`; Legende + Median-Striche erst sichtbar wenn mind. ein Balken `ready`
- `index.html`: Tab-Name „Benchmark" → „Benchmark-Vergleich"; Score-Ring-Titel „—/100 — —" → „—/100"

**Ergebnis:** Nutzerführung im Benchmark-Tab klarer; pro-Metrik-Feedback ohne Rauschen; Legende in Light- und Dark-Mode gut lesbar; Quellenangaben aktuell; Quick Wins branchenspezifisch korrekt.

**Nächster Schritt:** Lokal testen (`python -m http.server 8080`), dann PR `feat/gastro-data-refresh` → `main`.

---

## [2026-06-04] fix/det-recs-missing-input: Empfehlungen nur bei vorliegender Kennzahl

**Branch:** `fix/det-recs-missing-input`
**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:** Verhindern, dass deterministische Empfehlungen für Kennzahlen angezeigt werden, die der Nutzer noch nicht eingegeben hat.

**Bug:** `buildDeterministicRecs()` filterte `massnahmen` nur per Score-Schwelle. Der Score basiert auf den versteckten Slider-Werten, die immer Default-Werte tragen — auch wenn noch kein Jahreswert im `jw-*`-Input eingegeben wurde. Dadurch erschienen z. B. Wasser-Empfehlungen trotz fehlendem Wasserverbrauch-Input.

**Aktionen:**
- `index.html`: In `buildDeterministicRecs()` wird `getInputState()` aufgerufen; `massnahmen.filter()` prüft als erste Bedingung `inputState[m.metrik]?.ready`
- `index.html`: Fallback-Text wenn `recs.length === 0` unterscheidet: (a) kein einziger Wert ready → Hinweistext, (b) mindestens ein Wert ready, alle Scores gut → „Ausgezeichnete Umweltbilanz"
- `memory/decisions.md`: Architekturentscheidung dokumentiert
- `memory/short_term.md`: Branch und Status aktualisiert

**Ergebnis:** Deterministische Empfehlungen erscheinen nur noch, wenn der Nutzer den entsprechenden Jahreswert (und die nötige Umrechnungsbasis) bereitgestellt hat.

**Nächster Schritt:** Lokal testen, committen, PR → `main`.

---

## [2026-05-31] Bugfix feat/gemini-document-reader: Wasser-Autofill + Slider-Cap

**Branch:** `feat/gemini-document-reader`

**Probleme:**
1. Wasserverbrauch wurde als erkannt gemeldet, aber `jw-wasser`-Textfeld blieb leer,
   weil `applyDocumentResult` bei vorhandenem `ma` direkt `setSlider()` statt
   `setJahreswert()` aufrief — der sichtbare Jahreswert-Input wurde umgangen.
   Gleiches Problem latent für Strom und Gas (wenn `flaeche` bekannt).
2. Irreführende "Obergrenze des Schiebereglers erreicht"-Meldung nach Autofill,
   weil `setSlider` den Wert auf `slider.max` cappte statt das Maximum anzuheben.

**Fixes:**
- `applyDocumentResult`: Strom, Gas, Wasser immer über `setJahreswert(jw-*)` befüllen;
  `computeFromJahreswerte()` übernimmt Umrechnung auf Slider.
- `setSlider`: `slider.max = rounded` wenn Wert das Maximum überschreitet — kein Capping mehr.

**Merge:** `feat/gemini-document-reader` → `test/integration` (konfliktfrei)

---

## [2026-06-01] feat/waste-kpi: Abfall-KPI in Score, CO2 und KI-Prompt integriert

**Branch:** `feat/waste-kpi`  
**Ziel:** Abfallaufkommen (Restmüll in kg) als vollwertigen Umwelt-KPI einbinden.

**Hauptaktionen:**
- `benchmarks.js`: CO2-Emissionsfaktor `restmuell_kg_co2_per_kg = 0.15` ergänzt.
- `index.html`: Abfall-Anteil in die CO2-Berechnung (kg CO2/m²) aufgenommen, sofern MA + Fläche bekannt.
- `api/ki-consulting.js`: Abfall-Benchmarks (Gastronomie, Bäckerei, Büro) in den KI-System-Prompt eingefügt.

**Ergebnis:** Restmüll fließt jetzt in Öko-Score, CO2-Ausweisung und KI-Empfehlungen ein.  
**Nächster Schritt:** Branch in `main` mergen.

---

## [2026-05-31] Bugfixes Document-Reader + feat/waste-kpi: Abfall-KPI

**Branches:** `feat/gemini-document-reader` (Bugfixes + abfall_kg), `feat/waste-kpi` (neu)

**Probleme behoben (feat/gemini-document-reader):**
- 501-Fallback: Browser-Direktaufruf springt jetzt auch bei HTTP 501 an (python -m http.server)
- Browser-Fallback-Prompt fehlte `reinigungsmittel_liter`
- Gemini Free-Tier-Quotafehler: Files API statt inline Base64 (drastisch weniger Token)
- Modell: `gemini-3.1-flash-lite` (kostenlos, von Google empfohlen)
- `applyDocumentResult`: `input`-Event nach Autofill fehlte → Felder sichtbar leer trotz befüllt
- `abfall_kg` in Extraktionsprompt (Server + Browser-Fallback) und `applyDocumentResult` ergänzt

**Neu (feat/waste-kpi):**
- `benchmarks.js`: `restmuell_kg_co2_per_kg: 0.15` in `emissionFactors` (UBA 2023)
- `index.html`: Abfall-Anteil in CO2-Berechnung (kg CO₂/m²) wenn MA + Fläche bekannt
- `api/ki-consulting.js`: Abfall-Benchmarks Gastro/Bäckerei/Büro + Emissionsfaktor im System-Prompt

**Merge:**
- Beide Branches in `test/integration` gemergt; Konflikt in `api/ki-consulting.js` manuell aufgelöst

---

## [2026-05-31] Task 8 — feat/benchmark-tab-update: Hauptverbraucher, Quick Wins, Quellenzeile

**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:**
Benchmark-Tab an Tasks 1–7 angleichen: branchenspezifische Kontextinfos aus
`benchmarks.js` (hauptverbraucher, quick_wins, quelle) im Tab anzeigen.

**Aktionen:**

- `index.html` Benchmark-Tab HTML: Hauptverbraucher-Box (Badges), Quick-Wins-Card
  (nummerierte Liste), Quellenzeile unter Legende — alle mit `display:none` als Default
- `index.html` `renderBenchmarkBars()`: Render-Logik für alle drei neuen Elemente
  aus `OEKOPROFIT_BENCHMARKS.branchen[branch]`; Quick Wins unterstützen String-
  und Objekt-Format; `metrics`-Array: `recycling` → `reinigungsmittel` (Task 7)

**Ergebnis:**
Branch `feat/benchmark-tab-update` committed.

**Nächster Schritt:**
INT-Branch (`test/integration`) aufbauen: alle 8 Branches mergen + Konflikt-Auflösung
für baeckerei.kennzahlen und massnahmen im INT-Branch.

---

## [2026-05-31] Task 7 — feat/replace-recycling-metric: Recyclingquote → Reinigungsmittelverbrauch

**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:**
Recyclingquote als Umweltkennzahl ersetzen durch Reinigungsmittelverbrauch
(L/MA/Jahr), da Unternehmen die Recyclingquote oft nicht kennen und
Reinigungsmittelrechnungen (HACCP) direkt durch Gemini ausgelesen werden können.

**Aktionen:**

- `benchmarks.js`: `recyclingquote_pct` in gastronomie.kennzahlen →
  `reinigungsmittel_l_per_ma` (P25: 30, Median: 45, P75: 70, invertiert: false);
  globale Konstante `recyclingquote_de_2022_pct` durch Reinigungsmittel-Mediane ersetzt
- `index.html` (12 Stellen): Slider, Excel-Parser, getVals(), calcScore(),
  metricBenchmarkScore(), metricMedian(), renderBenchmarkBars(),
  buildClaudePrompt() Text + Tabelle, Snapshot-Keys, Metrik-Definitions-Array,
  Legacy-Empfehlungslogik
- `api/ki-consulting.js`: Reinigungsmittel-Benchmarks (Gastro + Bäckerei)
  in BENCHMARK_SYSTEM_PROMPT ergänzt

**Hinweis:**
`baeckerei.kennzahlen` (feat/bakery-benchmarks) und `massnahmen`-Arrays
(feat/deterministic-recommendations) werden im INT-Branch nachgezogen.

**Ergebnis:**
Branch `feat/replace-recycling-metric` committed.

**Nächster Schritt:**
Task 8 (`feat/benchmark-tab-update`): Benchmark-Tab erweitern.

---

## [2026-05-31] Task 4b — feat/gemini-document-reader: Reinigungsmittel-Extraktion

**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:**
Gemini Document Reader um Reinigungsmittelrechnungen erweitern, damit neben
Energie- auch Reinigungsmittelrechnungen (HACCP) ausgelesen werden können.

**Aktionen:**

- `api/document-reader.js`: `EXTRACTION_PROMPT` auf Reinigungsmittelrechnungen
  geöffnet; neues Feld `reinigungsmittel_liter` im JSON-Schema + Beispiel-Output
- `index.html` `applyDocumentResult()`: Reinigungsmittel-Block nach wasser_m3
  ergänzt (L/Jahr ÷ MA → L/MA/Jahr; defensiver if-Check für Branch-Isolation)

**Ergebnis:**
Branch `feat/gemini-document-reader` committet. Gemini kann jetzt PDFs wie
`05_bakery_reinigung.pdf` (180 L) und `12_gasthaus_reinigung.pdf` (280 L)
auswerten und das Feld `jw-reinigungsmittel` befüllen (sobald Task 7 gemergt).

**Nächster Schritt:**
Task 7 (`feat/replace-recycling-metric`): Recyclingquote durch Reinigungsmittelverbrauch ersetzen.

---

## [2026-05-30] Task 6 — feat/sharper-ai-recommendations

**Persona:** Feature Implementer
**Stage:** 03-feature-v2

**Ziel:**
KI-Empfehlungen schärfen: Bäckerei-Benchmarks im System-Prompt ergänzen, mehr Quick Wins übergeben, küchenlose Betriebe ausfiltern, neuen betriebsspezifischen Begründungsabschnitt erzwingen.

**Aktionen:**

- `api/ki-consulting.js`: `BENCHMARK_SYSTEM_PROMPT` um Bäckerei Strom (P25/Median/P75 NRW 2022) und Bäckerei Gas/Wärme (Bäcker-Innung Bayern) ergänzt; drei Bäckerei-Quick-Wins (Ofentür-Dichtungen, Teigmaschinen-Timer, LED) hinzugefügt
- `index.html` `buildClaudePrompt()`: `slice(0,3)` → `slice(0,6)` für Quick Wins
- `index.html` `buildClaudePrompt()`: Bedingungslogik `profil.kueche === 'nein'` → Hinweis „kein Küchenbereich" in Prompt eingefügt
- `index.html` `buildClaudePrompt()`: Neuer PFLICHT-Abschnitt `## Warum das für Ihren Betrieb gilt` (ein Satz je Top-3-Maßnahme mit Bezug auf Betriebsgröße/-typ) am Ende der Pflicht-Struktur ergänzt; Block-Anzahl von „vier" auf „fünf" korrigiert

**Ergebnis:**
Branch `feat/sharper-ai-recommendations` committed. KI-Empfehlung für Bäckerei enthält backofenspezifische Kennzahlen; Gasthaus ohne Küche erhält Hinweis gegen Spülmaschinen-Empfehlungen; Abschnitt `## Warum das für Ihren Betrieb gilt` im Output erzwungen.

---

## [2026-05-30] Refokus: Gasthaus & Bäckerei — Tasks 1–5

**Persona:** Feature Implementer + Domain Expert (ÖKOPROFIT)
**Stage:** 03-feature-v2

**Ziel:**
Auf Empfehlung des Professors: Tool von 5 Branchen auf 2 Fallbeispiele (Gasthaus + Bäckerei) fokussieren.
Eingaben branchenspezifisch machen, LLM-Dokumentenleser ergänzen, Empfehlungen schärfen.

**Aktionen:**

Task 1 — `feat/bakery-benchmarks`:
- `benchmarks.js`: Bäckerei-Eintrag mit P25/Median/P75 für Strom, Gas, Wasser, Abfall, Recycling, Energiekosten
- Hauptverbraucher (Backöfen, Kühlung, Teigmaschinen) und 6 Quick Wins ergänzt
- massnahmen-Array mit 6 branchenspezifischen Empfehlungsregeln (Template-basiert) hinzugefügt
- Quellen: Energieagentur NRW 2022, Bäcker-Innung Bayern, Zentralverband Bäckerhandwerk 2023

Task 2 — `feat/ui-focus-two-cases`:
- Dropdown auf „Gasthaus (Gastronomie)" + „Bäckerei (Produktion)" reduziert; andere Optionen `hidden`
- Bäckerei-Mediane ins `benchmarks`-Objekt, `BRANCH_BENCHMARK_MAP` und Excel-Branchenerkennung erweitert

Task 3 — `feat/branch-specific-inputs`:
- Generische Slider durch Betriebsprofil-Sektion (Fläche, MA, Sitzplätze/Öfen) + Jahreswert-Inputs ersetzt
- Slider bleiben hidden als State-Holder (Excel-Import und Snapshot-Restore bleiben kompatibel)
- `computeFromJahreswerte()` rechnet kWh/Jahr ÷ m² → kWh/m²; `updateBranchUI()` blendet Felder je Branche
- `buildClaudePrompt()` mit Betriebsprofil inkl. Betriebsgrößenklasse (Kleinst-/Klein-/Mittelbetrieb) angereichert

Task 4 — `feat/gemini-document-reader`:
- `api/document-reader.js`: Vercel Serverless Function, gemini-3.1-flash-lite, JSON-Extraktion (Strom/Gas/Wasser/Zeitraum)
- Client: Multi-file Base64-Encoding, POST an `/api/document-reader`, Fallback auf direkten Browser-Call mit User-Key
- UI: Gemini-Key-Input, Spinner, Status-Zeile, autofill-Badge auf befüllten Feldern
- `applyDocumentResult()` kompatibel mit Task-3-Jahreswert-Inputs und Original-Slidern

Task 5 — `feat/deterministic-recommendations`:
- `benchmarks.js` (`gastronomie`): 7 massnahmen-Regeln mit Score-Schwellwert, Template-Variablen, optionaler Profilbedingung
- `benchmarks.js` (`baeckerei`): 6 massnahmen-Regeln (kanonisch auf `feat/bakery-benchmarks`, Stub aus Task 5 entfernt)
- `index.html`: `buildDeterministicRecs()` ersetzt generische `recs`-Logik; wertet Scores aus, substituiert Templates, passt Tipps an Betriebsgröße an

**Ergebnis:**
5 Feature-Branches committed, lokal nicht gepusht. Keine erwarteten Merge-Konflikte.
`memory/short_term.md`, `memory/decisions.md` und `logs/actions.md` auf `main` aktualisiert (Handover-Commit).

**Learnings:**
- `memory/`- und `logs/`-Dateien sollten direkt auf `main` committed werden, nicht auf Feature-Branches — vermeidet Versionskonfusion in neuen Sessions.
- Temporäre Integrations-Branches (`test/integration`) sind ein sauberer Weg, mehrere Feature-Branches gemeinsam zu testen ohne `main` zu verunreinigen.

**Nächster Schritt:**
Task 6 (`feat/sharper-ai-recommendations`): System-Prompt Bäckerei-Daten, alle 6 Quick Wins, betriebsspezifischer Abschnitt im KI-Output.

---

## [2026-05-30] Refokus: Gasthaus & Bäckerei — Tasks 1–5

**Persona:** Feature Implementer + Domain Expert (ÖKOPROFIT)
**Stage:** 03-feature-v2

**Ziel:**
Auf Empfehlung des Professors: Tool von 5 Branchen auf 2 Fallbeispiele (Gasthaus + Bäckerei) fokussieren.
Eingaben branchenspezifisch machen, LLM-Dokumentenleser ergänzen, Empfehlungen schärfen.

**Aktionen:**

Task 1 — `feat/bakery-benchmarks`:
- `benchmarks.js`: Bäckerei-Eintrag mit P25/Median/P75 für Strom, Gas, Wasser, Abfall, Recycling, Energiekosten
- Hauptverbraucher (Backöfen, Kühlung, Teigmaschinen) und 6 Quick Wins ergänzt
- massnahmen-Array mit 6 branchenspezifischen Empfehlungsregeln (Template-basiert) hinzugefügt
- Quellen: Energieagentur NRW 2022, Bäcker-Innung Bayern, Zentralverband Bäckerhandwerk 2023

Task 2 — `feat/ui-focus-two-cases`:
- Dropdown auf „Gasthaus (Gastronomie)" + „Bäckerei (Produktion)" reduziert; andere Optionen `hidden`
- Bäckerei-Mediane ins `benchmarks`-Objekt, `BRANCH_BENCHMARK_MAP` und Excel-Branchenerkennung erweitert

Task 3 — `feat/branch-specific-inputs`:
- Generische Slider durch Betriebsprofil-Sektion (Fläche, MA, Sitzplätze/Öfen) + Jahreswert-Inputs ersetzt
- Slider bleiben hidden als State-Holder (Excel-Import und Snapshot-Restore bleiben kompatibel)
- `computeFromJahreswerte()` rechnet kWh/Jahr ÷ m² → kWh/m²; `updateBranchUI()` blendet Felder je Branche
- `buildClaudePrompt()` mit Betriebsprofil inkl. Betriebsgrößenklasse (Kleinst-/Klein-/Mittelbetrieb) angereichert

Task 4 — `feat/gemini-document-reader`:
- `api/document-reader.js`: Vercel Serverless Function, Gemini 2.0 Flash, JSON-Extraktion (Strom/Gas/Wasser/Zeitraum)
- Client: Multi-file Base64-Encoding, POST an `/api/document-reader`, Fallback auf direkten Browser-Call mit User-Key
- UI: Gemini-Key-Input, Spinner, Status-Zeile, autofill-Badge auf befüllten Feldern
- `applyDocumentResult()` kompatibel mit Task-3-Jahreswert-Inputs und Original-Slidern

Task 5 — `feat/deterministic-recommendations`:
- `benchmarks.js` (`gastronomie`): 7 massnahmen-Regeln mit Score-Schwellwert, Template-Variablen, optionaler Profilbedingung
- `benchmarks.js` (`baeckerei`): 6 massnahmen-Regeln (kanonisch auf `feat/bakery-benchmarks`, Stub aus Task 5 entfernt)
- `index.html`: `buildDeterministicRecs()` ersetzt generische `recs`-Logik; wertet Scores aus, substituiert Templates, passt Tipps an Betriebsgröße an

**Ergebnis:**
5 Feature-Branches committed, lokal nicht gepusht. Keine erwarteten Merge-Konflikte.
`memory/short_term.md`, `memory/decisions.md` und `logs/actions.md` auf `main` aktualisiert (Handover-Commit).

**Learnings:**
- `memory/`- und `logs/`-Dateien sollten direkt auf `main` committed werden, nicht auf Feature-Branches — vermeidet Versionskonfusion in neuen Sessions.
- Temporäre Integrations-Branches (`test/integration`) sind ein sauberer Weg, mehrere Feature-Branches gemeinsam zu testen ohne `main` zu verunreinigen.

**Nächster Schritt:**
Task 6 (`feat/sharper-ai-recommendations`): System-Prompt Bäckerei-Daten, alle 6 Quick Wins, betriebsspezifischer Abschnitt im KI-Output.

---

## [2026-05-19] Feature: Score-Verlauf und Snapshot-Vergleich

Ziel:
Gespeicherte Snapshots visuell auswerten — Trendlinie und Kennzahlenvergleich zwischen zwei Ständen.

Aktionen:
- `index.html`: Chart.js Score-Verlauf (ab 2 Snapshots), Delta-Anzeige, Vergleichstabelle A/B im Tab „Verlauf".

Ergebnis:
Nutzer sehen Score-Entwicklung und können zwei Snapshots nebeneinander vergleichen (lokal, localStorage).

---

## [2026-05-19] Feature: Snapshot-Verlauf (localStorage)

Ziel:
Kennzahlen-Stände lokal speichern, vergleichen und wiederherstellen — ohne Backend.

Aktionen:
- `index.html`: Tab „Verlauf", Button „Snapshot speichern" in Dateneingabe, localStorage (`oekoprofit-snapshots`), Wiederherstellen/Löschen.

Ergebnis:
Nutzer können Öko-Score-Stände im Browser sichern und später laden; Daten bleiben auf dem Gerät.

---

## [2026-05-19] Fix: Recyclingquote branchenweise aus benchmarks.js

Ziel:
Recycling-Teilscore konsistent zu anderen Kennzahlen aus `benchmarks.js` statt hardcodierter Werte in `index.html`.

Aktionen:
- `benchmarks.js`: `recyclingquote_pct` für alle fünf Branchen (Universalwerte DE-Ziel 2022).
- `index.html`: Öko-Score liest `k.recyclingquote_pct` dynamisch.
- `known-issues.md`: Recycling-Abschnitt aktualisiert.

Ergebnis:
Recycling fließt überall gleich ins Scoring ein; branchenspezifische Quartile können später je Branche überschrieben werden.

---

## [2026-05-19] Feature: optionaler Dark Mode

Ziel:
Darstellung optional auf Dark Mode umschaltbar — ohne Build-Step, im bestehenden Single-File-Frontend.

Aktionen:
- `index.html`: CSS-Variablen unter `[data-theme="dark"]`, Toggle im Header, `localStorage`-Persistenz, System-Präferenz als Fallback, frühes Theme-Script gegen Flackern.

Ergebnis:
Nutzer können per Button „Dark" / „Hell" wechseln; Einstellung bleibt gespeichert.

Nächster Schritt:
Auf Vercel-Deploy prüfen (Toggle, Tabs, Benchmark-Balken, KI-Antwort-Box).

---

## [2026-05-19] Fix: Einzelhandel Food/Nonfood getrennt im UI

Ziel:
Nonfood-Betriebe (Textil, Baumarkt) nicht mehr am Food-Strombenchmark (Median ~289 kWh/m²) messen — künstlich guter Öko-Score.

Aktionen:
- `index.html`: Dropdown in „Einzelhandel (Lebensmittel)" / „Einzelhandel (Nonfood)" aufgeteilt; `BRANCH_BENCHMARK_MAP` mit `handel_food` / `handel_nonfood`; Legacy-`benchmarks` und Excel-Keyword-Mapping angepasst.
- `benchmarks.js`: `einzelhandel_nonfood` um `wasser_liter_per_ma_tag` und `abfall_kg_per_ma` ergänzt.
- `known-issues.md`: Abschnitt Nonfood dokumentiert; `prompts/stages/03-excel-upload-v3.md`: Branche-Keywords aktualisiert.

Ergebnis:
`einzelhandel_nonfood` (Strom Median 75 kWh/m²) ist im UI wählbar und für Scoring/Benchmark-Tabs erreichbar.

Nächster Schritt:
Manuell testen: Nonfood + ~80 kWh/m² Strom → Score nahe Median, nicht ~100.

---

## [2026-05-19] Infra: CI-Hook Agent-Transparenz

Ziel:
Memory-/Log-Pflicht bei Codeänderungen automatisch prüfen (nicht nur konventionell).

Aktionen:
- `scripts/check-agent-transparency.js` — vergleicht Git-Diff, fordert `logs/actions.md` + `memory/short_term.md` bei Trigger-Pfaden.
- `.github/workflows/agent-transparency.yml` — läuft auf PR und Push zu `main`.
- `npm run check:transparency` für lokale Prüfung.
- Doku in `AGENTS.md`, `prompts/agent-runs/README.md`.

Ergebnis:
PR/Push schlägt fehl, wenn z. B. `index.html` geändert wurde ohne Session-Log — erzwingt den Contract technisch (minimal, dateibasiert).

Nächster Schritt:
Agentic-Dateien + CI + Memory-Updates in einem Commit pushen, damit der erste Lauf grün ist.

---

## [2026-05-19] Infra: Agentic Coding Einstieg (AGENTS.md + agent-runs)

Ziel:
Prompt-System so erweitern, dass ein IDE-Agent eine Persona-Aufgabe im Repo ausführen kann (nicht nur Text-Prompts).

Aktionen:
- `AGENTS.md` (Repo-Root): Constraints, Persona→Run-Mapping, Transparenz-Pflicht.
- `prompts/agent-runs/`: README, Template, Runs für alle 6 Personas.
- `prompts/README.md`: Abschnitt Agentic coding + Quick-start-Beispiel.
- `memory/short_term.md` aktualisiert.

Ergebnis:
Agentic Coding ist **nutzbar** über expliziten Chat-Start mit Run-Datei; Enforcement bleibt konventionell (Contract am Ende des Laufs).

Nächster Schritt:
In Cursor testen: `Follow AGENTS.md and prompts/agent-runs/feature-implementer-run.md` + konkrete Task.

---

## [2026-05-13] Prozess: Agent-Transparenz / Moodle-Logging im Prompt-System

Ziel:
Agentenentscheidungen, Aktionen und erkannte Fehler verbindlich in `/logs` und `/memory` dokumentieren; die Einführung dieses Regelwerks selbst mitprotokollieren.

Aktionen:
- Neues Template `prompts/templates/agent-transparency-contract.md` (Pflicht-/Optional-Dateien, Meta-Regel).
- `prompts/README.md`, `prompts/templates/task-template.md`, Stages `01-concept-v2`, `02-repository-v2`, `03-feature-v2`, `03-excel-upload-v1`–`v3` auf vollständigen Run-Log-Output abgestimmt.
- Alle Personas: After-Task Protocol angeglichen; `repository-scaffolder` und `domain-expert-oekoprofit` nachgezogen.
- `memory/decisions.md`, `memory/long_term.md`, `memory/short_term.md` (dieser Lauf) aktualisiert.

Ergebnis:
Einheitlicher Vertrag für coursework-taugliche Transparenz; technisches API-Prompt-Logging (`api/ki-consulting.js`) bleibt davon getrennt dokumentiert.

Nächster Schritt:
Beim nächsten Feature-Lauf die fünf Pfade unter `/logs` und `/memory` wie im Contract befüllen und „no change" nur bei wirklich leeren optionalen Dateien verwenden.

---

## [2026-05-12] Feature: Excel-Upload v3 – Betrieb & Branche (Persona: feature-implementer)

Ziel:
Betrieb-Label und Branche-Dropdown automatisch aus Excel-Spalten befüllen.

Aktionen:
- `prompts/stages/03-excel-upload-v3.md`: v3-Prompt erstellt.
- `index.html`: span#betrieb-name in Header eingebaut; Branche-Keyword-Mapping in handleExcelUpload() ergänzt.
- `prompts/evaluation/scorecard-stage-03-excel-upload-v3.md`: Scorecard ausgefüllt (21/21, 100 %).
- `prompts/CHANGELOG.md`, `logs/actions.md`, `memory/short_term.md`: aktualisiert.

Ergebnis:
Upload setzt Betrieb-Name im Header und wählt passende Branche im Dropdown per Keyword-Matching.

---

## [2026-05-12] Feature: Excel-Upload v2 – Normierungslogik (Persona: feature-implementer)

Ziel:
Excel-Upload um automatische Einheitenumrechnung erweitern (absolute Verbrauchswerte → normierte Kennzahlen).

Aktionen:
- `memory/known_issues.md`: Design-Gap dokumentiert (absolute vs. normierte Werte).
- `prompts/stages/03-excel-upload-v2.md`: v2-Prompt erstellt mit Normierungsanforderungen.
- `index.html`: `handleExcelUpload()` ersetzt durch Keyword-Matching + Normierungslogik (MWh→kWh/m², t→kg/MA, Dezimal-Recyclingquote→%).
- `prompts/evaluation/scorecard-stage-03-excel-upload-v2.md`: Scorecard ausgefüllt (21/21, 100 %).
- `prompts/CHANGELOG.md`: Eintrag für v1+v2 mit Vergleichstabelle ergänzt.

Ergebnis:
Upload erkennt Spalten per Keyword, rechnet Einheiten automatisch um, zeigt übersprungene Felder im Status-Label.

Nächste Schritte:
1. Lokal testen mit Münchner_Rück_Umweltkennzahlen.xlsx (`python -m http.server 8080`).
2. Commiten und pushen auf `feature/excel-upload`.

---

## [2026-05-12] Feature: Excel-Upload (Persona: feature-implementer)

Ziel:
Excel-Upload-Funktion in `index.html` implementieren; Slider werden mit Werten aus der Datei vorbelegt und bleiben editierbar.

Aktionen:
- `prompts/CHANGELOG.md`: 2026-04-27-Block (verfrühter Excel-Upload-Eintrag) entfernt.
- `prompts/personas/` (4 Dateien): After-Task-Protocol-Block ergänzt (feature-implementer, technical-writer, code-reviewer, system-architect).
- `.gitignore`: `kontext-oekoprofit.md` und `Umwelt_und_ESG-Benchmarks.pdf` hinzugefügt.
- `prompts/stages/03-excel-upload-v1.md`: Neuer Feature-Prompt v1 erstellt.
- `index.html`: SheetJS CDN eingebunden, Upload-UI (Button + File-Input + Status-Label) oberhalb der Slider eingefügt, `handleExcelUpload()`-Funktion implementiert.
- `prompts/evaluation/scorecard-stage-03-excel-upload-v1.md`: Scorecard ausgefüllt (19/21, 90 %).

Ergebnis:
Excel-Upload funktionsfähig: Spaltenmapping (Strom/Gas/Wasser/Abfall/Recycling), Clamp auf Slider-Range, Status-Label, Sliders bleiben editierbar.

Nächste Schritte:
1. Git commit & push auf `feature/excel-upload` nach Branch-Wechsel.
2. Scorecard v2: Beispiel-Testdatei und Next-Steps ergänzen.

---

## [2026-04-23T00:00:00] Session Checkpoint

Ziel:
Vollständigen Projektstand dokumentieren und Memory-/Log-System erstellen, damit ein neuer Agent sofort weiterarbeiten kann.

Aktionen:
- Projektstruktur analysiert: `index.html`, `api/ki-consulting.js`, `prompts/`-System.
- Git-Log der letzten 10 Commits ausgewertet.
- Alle drei Stage-Scorecards und das Prompt-CHANGELOG gelesen.
- Verzeichnisse `memory/` und `logs/` erstellt.
- `memory/short_term.md` erstellt (aktueller Stand, ToDos, nächster Schritt).
- `memory/long_term.md` erstellt (Architektur, Datenfluss, Prompt-System-Prinzipien).
- `memory/decisions.md` erstellt (4 Entscheidungen dokumentiert: OpenRouter, Single-File-Frontend, Prompt-Versionierung, Markdown-Rendering).
- `memory/known_issues.md` erstellt (3 Issues: leere OpenRouter-Antwort, Ollama-Fallback, fehlender API-Key).
- `logs/actions.md` erstellt (dieser Eintrag).

Ergebnis:
Vollständiger Checkpoint vorhanden. Projektstand, Architektur, Entscheidungen und bekannte Probleme sind für neue Agenten nachvollziehbar dokumentiert.

Learnings:
- Das Projekt ist ein Proof-of-Concept mit Schwerpunkt Prompt-Engineering, nicht Produktivcode.
- OpenRouter Free Tier ist als Backend fragil (Rate-Limits, variable Response-Strukturen) — sollte für stabilen Betrieb durch ein bezahltes Modell ersetzt werden.
- Prompt-Versionierung (v1/v2 + Archiv + Scorecards) ist gut etabliert und kann direkt für weitere Iterationen genutzt werden.

Nächste Schritte:
1. Experiment-Lauf mit v2-Prompts: Alle drei Stages ausführen, gegen Scorecards bewerten, in `experiment-log-template.md` festhalten.
2. OpenRouter API-Key in Vercel prüfen/setzen.
3. Entscheiden ob v3-Prompts sinnvoll sind (basierend auf Experiment-Ergebnissen).
