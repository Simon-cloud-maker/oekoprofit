# Prompt Changelog

## 2026-05-12

### Added

- `prompts/stages/03-excel-upload-v3.md` – Feature-Prompt: Betrieb-Label und Branche-Dropdown aus Excel-Spalten befüllen
- `prompts/evaluation/scorecard-stage-03-excel-upload-v3.md` – Scorecard v3: 21/21 (100 %)

### Evaluation Result (v3)

- Score: 21/21 (100 %) – Verdict: Keep
- Neue Funktionalität: Keyword-Mapping Branche, Betrieb-Label-Update
- Next Steps für v4: Branche-Keywords konfigurierbar, Mehrjahresauswahl

---

### Added

- `prompts/stages/03-excel-upload-v1.md` – Feature-Prompt: Excel-Upload mit direktem Slider-Mapping
- `prompts/stages/03-excel-upload-v2.md` – Feature-Prompt: Excel-Upload mit Normierungslogik (MWh→kWh/m², t→kg/MA, Keyword-Matching, Mitarbeiter/Nutzflaeche_m2-Spalten)
- `prompts/evaluation/scorecard-stage-03-excel-upload-v1.md` – Scorecard v1: 19/21 (90 %)
- `prompts/evaluation/scorecard-stage-03-excel-upload-v2.md` – Scorecard v2: 21/21 (100 %)

### Evaluation Result (v1 → v2)

| Version | Score | Schwäche | Behoben in v2 |
|---|---|---|---|
| v1 | 19/21 (90 %) | Keine Testdatei, keine Next Steps, kein Normierungskonzept | ✓ |
| v2 | 21/21 (100 %) | — | — |

### Rationale

v1 deckte nur direkte Spaltenmaps ab. Reale Unternehmensdaten (z.B. Münchner Rück) liefern absolute Verbrauchswerte, die normiert werden müssen. v2 löst dies durch Keyword-basiertes Spaltenmatching und automatische Einheitenumrechnung anhand von Mitarbeiterzahl und Nutzfläche aus der Excel-Datei selbst.

---

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
