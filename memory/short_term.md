# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-04-23_

## Aktueller Stand

- Alle drei Stage-Prompts (01 Concept, 02 Repository, 03 Feature) sind als v2 aktiv und abgeschlossen.
- v1-Versionen wurden archiviert unter `prompts/stages/archive/` mit `ARCHIVE_TABLE.md`.
- Evaluation-Scorecards für alle drei Stages wurden ausgefüllt und committet.
  - Stage 01 Concept: 21/21 (100%) — vollständiges Ergebnis.
  - Stage 02 Repository und Stage 03 Feature: Scorecards existieren, Punkte noch prüfen.
- KI-Backend läuft über Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier.
- Frontend: Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step).
- Markdown-Rendering für KI-Antworten ist implementiert (letzter Commit).

## Aktuelle ToDos

- [ ] Überprüfen ob Stage 02 und Stage 03 Scorecards vollständig ausgefüllt sind.
- [ ] OpenRouter Free Tier evaluieren: Rate-Limits, Zuverlässigkeit, Fallback-Strategie prüfen.
- [ ] Entscheiden ob ein OPENROUTER_API_KEY in Vercel gesetzt ist oder noch fehlt.
- [ ] Ggf. nächste Prompt-Iteration (v3) planen, basierend auf Scorecard-Erkenntnissen.
- [ ] Personas und Stage-Prompts in einem echten Experiment-Lauf testen und auswerten.

## Nächster Schritt

Experiment-Lauf mit v2-Prompts durchführen: Jede Stage mit dem zugehörigen Persona-Prompt ausführen, Output gegen Scorecard bewerten, Ergebnisse im `prompts/evaluation/experiment-log-template.md` festhalten.
