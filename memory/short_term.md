# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-05-13_

## Aktueller Stand

- **Agent-Transparenz (Moodle):** Verbindlicher Ablagevertrag in `prompts/templates/agent-transparency-contract.md`; eingebunden in `prompts/README.md`, `prompts/templates/task-template.md`, Stage v2 (01–03), Excel-Upload v1–v3, und alle Personas (inkl. Repository Scaffolder + Domain Expert).
- Alle drei Stage-Prompts (01 Concept, 02 Repository, 03 Feature) sind als v2 aktiv und abgeschlossen.
- v1-Versionen wurden archiviert unter `prompts/stages/archive/` mit `ARCHIVE_TABLE.md`.
- Personas (alle sechs Rollen) mit einheitlichem After-Task Protocol / Agent-Transparenz-Contract — Branch `feature/persona-after-task-protocol`, PR offen.
- **Excel-Upload v3 implementiert** in `index.html`: Normierungslogik (v2) + Betrieb-Label + Branche-Dropdown per Keyword-Mapping. Branch: `feature/excel-upload` (noch nicht committed).
- Prompts v1 (19/21), v2 (21/21), v3 (21/21) erstellt und bewertet.
- KI-Backend läuft über Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier.
- Frontend: Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step).

## Aktuelle ToDos

- [ ] Nach nächstem Prompt-Lauf prüfen, ob neue Agenten die fünf Dateien (`actions`, `short_term`, optional `decisions` / `known_issues` / `long_term`) konsistent befüllen.
- [ ] Drei untracked Excel-Upload-Altdateien manuell löschen (Sandbox-Rechte fehlen).
- [ ] Branch-Wechsel: erst `feature/persona-after-task-protocol` committen, dann `feature/excel-upload` committen & pushen.
- [ ] Scorecard v2 für Excel-Upload: Beispiel-Testdatei und Next-Steps ergänzen.
- [ ] OpenRouter API-Key in Vercel prüfen/setzen.
- [ ] Deployment auf Vercel verifizieren.

## Nächster Schritt

Offene Commits abschließen: Personas-Branch committen und mergen, dann Excel-Upload-Branch committen und pushen.
