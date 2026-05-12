# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-05-12_

## Aktueller Stand

- Alle drei Stage-Prompts (01 Concept, 02 Repository, 03 Feature) sind als v2 aktiv und abgeschlossen.
- v1-Versionen wurden archiviert unter `prompts/stages/archive/` mit `ARCHIVE_TABLE.md`.
- Personas (feature-implementer, technical-writer, code-reviewer, system-architect) um After-Task-Protocol ergänzt — Branch `feature/persona-after-task-protocol`, PR offen.
- **Excel-Upload v3 implementiert** in `index.html`: Normierungslogik (v2) + Betrieb-Label + Branche-Dropdown per Keyword-Mapping. Branch: `feature/excel-upload` (noch nicht committed).
- Prompts v1 (19/21), v2 (21/21), v3 (21/21) erstellt und bewertet.
- KI-Backend läuft über Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier.
- Frontend: Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step).

## Aktuelle ToDos

- [ ] Drei untracked Excel-Upload-Altdateien manuell löschen (Sandbox-Rechte fehlen).
- [ ] Branch-Wechsel: erst `feature/persona-after-task-protocol` committen, dann `feature/excel-upload` committen & pushen.
- [ ] Scorecard v2 für Excel-Upload: Beispiel-Testdatei und Next-Steps ergänzen.
- [ ] OpenRouter API-Key in Vercel prüfen/setzen.
- [ ] Deployment auf Vercel verifizieren.

## Nächster Schritt

Offene Commits abschließen: Personas-Branch committen und mergen, dann Excel-Upload-Branch committen und pushen.
