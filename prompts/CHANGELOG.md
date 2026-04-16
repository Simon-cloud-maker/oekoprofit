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
