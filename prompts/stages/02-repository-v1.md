# Stage 2 Prompt: Generate Repository Scaffold

## Persona

Use the "Repository Scaffolder" persona from `prompts/personas/repository-scaffolder.md`.

## Project Context

- Project name: OekoProfit
- Product type: web application
- Initial scope: MVP focused on ecological action tracking and simple value estimation
- Preferred setup: lightweight frontend-first project with room for backend expansion
- Constraints: avoid unnecessary complexity and excessive dependencies

## Task

Generate a complete repository scaffold for OekoProfit.

The scaffold should include:

1. Folder structure
2. Core configuration files
3. Scripts for development and build
4. Minimal documentation
5. Optional placeholders for future backend and tests

## Output Requirements

- First output a file tree
- Then output file contents grouped by purpose
- Mark each file as Required or Optional
- For each file, include one-line rationale
- End with exact commands to initialize and run locally

## Guardrails

- Use stable, commonly adopted tooling
- Do not add files with no clear MVP value
- Keep defaults sensible for a small team

## Version Metadata

- Prompt ID: stage-02-repository
- Version: v1
- Date: 2026-04-16
- Change note: Initial repository scaffolding prompt
