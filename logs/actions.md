# Session Action Log

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
- `benchmarks.js` (`baeckerei`): 6 massnahmen-Regeln (kanonisch auf `feat/bakery-benchmarks`)
- `index.html`: `buildDeterministicRecs()` ersetzt generische `recs`-Logik; wertet Scores aus, substituiert Templates, passt Tipps an Betriebsgröße an

Zusätzlich: Merge-Konflikt-Prävention (Bäckerei-Stub auf `feat/deterministic-recommendations` entfernt), Dropdown-Label-Fix auf `feat/ui-focus-two-cases`.

**Ergebnis:**
5 Feature-Branches committed, lokal nicht gepusht. Keine erwarteten Merge-Konflikte.
Gemini API-Key noch ausstehend (aistudio.google.com → kostenfrei).

**Learnings:**
- `memory/short_term.md` sollte bei Multi-Branch-Arbeit auf `main` gepflegt werden, nicht auf Feature-Branches — vermeidet Verwirrung über welche Version aktuell ist.
- Temporäre Integrations-Branches (`test/integration`) sind ein sauberer Weg, mehrere Feature-Branches gemeinsam zu testen ohne main zu verunreinigen.

**Nächster Schritt:**
Task 6 (`feat/sharper-ai-recommendations`): System-Prompt Bäckerei-Daten, alle 6 Quick Wins, betriebsspezifischer Abschnitt im KI-Output.

---

## [2026-05-19] Feature: Score-Verlauf und Snapshot-Vergleich

Ziel:
Gespeicherte Snapshots visuell auswerten — Trendlinie und Kennzahlenvergleich zwischen zwei Ständen.

Aktionen:
- Chart.js Score-Trend im Tab „Verlauf" implementiert (Zeitachse, Tooltip mit Branchenname).
- Snapshot-Vergleich A/B als Tabelle (Kennzahlen + Score-Diff) umgesetzt.
- localStorage-Snapshots: Speichern, Wiederherstellen, Löschen.

Ergebnis:
Verlauf-Tab funktionsfähig. Branches `feature/excel-upload` und `feature/persona-after-task-protocol` noch offen.

Nächste Schritte:
Branch-Wechsel: erst `feature/persona-after-task-protocol` committen, dann `feature/excel-upload` committen & pushen.

---

## [2026-05-13] Feature: Recycling-Benchmark, Dark Mode, Einzelhandel-Fix

Ziel:
Recyclingquote-Benchmarks je Branche ergänzen, Dark Mode Toggle hinzufügen, Einzelhandel-Trennung fixen.

Aktionen:
- `recyclingquote_pct` mit P25/Median/P75 in alle Branchen in `benchmarks.js` eingefügt.
- Öko-Score-Berechnung nutzt jetzt dynamisches `k.recyclingquote_pct` statt Hardcode.
- Dark Mode: `data-theme`-Attribut, localStorage, System-Präferenz-Fallback.
- `handel_food` / `handel_nonfood` korrekt auf `einzelhandel_food` / `einzelhandel_nonfood` gemappt.

Ergebnis: Alle vier Features committed auf main.

---

## [2026-05-08] Repository-Setup und Memory-Initialisierung

Ziel:
Basis-Infrastruktur für agentic Coding: AGENTS.md, Persona-Runs, Memory-Dateien.

Aktionen:
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
