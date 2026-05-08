# Prompt Changelog

## 2026-04-16

### Added

- Initial prompt infrastructure under `prompts/`.
- Three reusable personas:
  - `system-architect`
  - `repository-scaffolder`
  - `feature-implementer`
- Generic reusable task template.
- Three assignment stage prompts:
  - core concept explanation
  - repository generation
  - local feature implementation
- Evaluation toolkit under `prompts/evaluation/`:
  - stage-specific scorecards
  - experiment log template
- `v2` stage prompts with measurable quality gates:
  - `stages/01-concept-v2.md`
  - `stages/02-repository-v2.md`
  - `stages/03-feature-v2.md`

### Rationale

Establishes a baseline system for reusable, versioned prompt engineering. This allows measurable iterations rather than one-off prompting.

### Next Iteration Ideas

- Add v2 versions after first run results.
- Add evaluation scorecards per stage.
- Add prompt A/B variants with tighter constraints.

## 2026-04-16 (Iteration 2)

### Changed

- Added explicit self-check quality gates to each `v2` stage prompt.
- Added evaluation hooks in prompts pointing to concrete scorecards.
- Standardized comparison workflow for `v1` vs `v2`.

### Rationale

Moves the prompt system from reusable storage to measurable experimentation. This supports academic reporting on prompt quality improvements, not just prompt collection.

## 2026-04-27

### Added

- Neuer feature-spezifischer Stage-03-Prompt: `stages/03-excel-upload-v1.md`
  - Feature: Excel-Datei-Upload zur automatischen Befüllung der Umweltkennzahlen-Schieberegler
  - Persona: feature-implementer
  - Technologie: SheetJS via CDN, kein Build-Schritt
- Scorecard für dieses Feature: `evaluation/scorecard-stage-03-excel-upload-v1.md`
- Experiment-Log: `evaluation/experiment-log-excel-upload.md`
- Memory/Logs-Struktur für Agenten-Transparenz eingerichtet:
  - `memory/short_term.md`, `memory/long_term.md`, `memory/decisions.md`, `memory/known_issues.md`
  - `logs/actions.md`

### Evaluation Result (v1)

- Score: 18/21 (86 %) – Verdict: Keep
- Stärken: saubere Struktur, kein Scope Creep, gute Validierungslogik
- Schwächen: Testdatei-Erstellung fehlt in Verification; keine Next Steps

### Rationale

Erster feature-spezifischer Prompt nach dem etablierten Stage-03-Muster. Demonstriert den vollständigen Workflow: Prompt → LLM → Scorecard → Log → CHANGELOG.

### Next Iteration Ideas

- v2 mit Testdatei-Anleitung in Verification und Next-Steps-Section erstellen
- Edge-Case „mehrere Datenzeilen" ergänzen

## 2026-05-08

### Changed

- `After-Task Protocol`-Block zu vier Personas hinzugefügt:
  - `personas/feature-implementer.md`
  - `personas/technical-writer.md`
  - `personas/code-reviewer.md`
  - `personas/system-architect.md`

### Rationale

Verankert das Transparenz-Logging im Prompt-System: Agenten, die mit diesen Personas arbeiten, sind jetzt explizit angewiesen, nach jeder Aufgabe `logs/actions.md` und `memory/short_term.md` zu aktualisieren. Damit werden die vorhandenen Memory/Logs-Dateien aktiv gepflegt statt nur einmalig befüllt.

---

## 2026-04-16 (Iteration 3)

### Added

- Three additional personas to better reflect a realistic software project team:
  - `personas/code-reviewer.md`
  - `personas/domain-expert-oekoprofit.md`
  - `personas/technical-writer.md`

### Changed

- Updated `prompts/README.md` to document the broader recommended persona set for a Wirtschaftsinformatik project context.

### Rationale

Expands the prompt system from stage-specific execution roles to a more complete project-role model, including review, domain validation, and documentation support.
