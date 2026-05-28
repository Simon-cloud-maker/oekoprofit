# Long-Term Memory — Stabile Architektur- und Projektkenntnisse

_Nur stabile, wiederverwendbare Erkenntnisse. Kein ephemerer Zustand._

---

## Projektübersicht

**Name:** ÖKOPROFIT KI-Dashboard
**Domain:** Nachhaltigkeitsberatung / Betriebliches Umweltmanagement
**Zweck:** Unternehmen dabei unterstützen, ökologische Maßnahmen zu quantifizieren und mit Geschäftsergebnissen zu verknüpfen (ÖKOPROFIT-Programm).
**Kontext:** Wirtschaftsinformatik-Projekt; primär Prototyp und Prompt-Engineering-Experiment.

---

## Technische Architektur

### Frontend
- Einzelne HTML-Datei: `index.html`
- Kein Build-System, kein Framework (Vanilla HTML/CSS/JS)
- Hosting: GitHub Pages (Einstiegspunkt `index.html`)
- Design: DM Sans / DM Mono, grüne Designsprache, CSS-Variables-basiert
- Funktionen: Slider-basierte Eingabe, Benchmark-Balken, Score-Ring, KI-Empfehlungen mit Markdown-Rendering

### Backend
- Vercel Serverless Function: `api/ki-consulting.js`
- Sprachrouting: Node.js CommonJS (`module.exports`)
- KI-Provider: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
  - Modell: `openrouter/free` (kostenlos, rate-limited)
  - Temperatur: 0.3, max_tokens: 700
- Authentifizierung: `OPENROUTER_API_KEY` als Vercel Environment Variable
- Fehlerbehandlung: OpenRouter-spezifische Fehlerstrukturen (`data.error`) werden abgefangen

### Prompt-Engineering-System
- Verzeichnis: `prompts/`
- Struktur:
  - `stages/` — Stage-Prompts v2 (aktiv): 01-concept, 02-repository, 03-feature
  - `stages/archive/` — v1-Versionen (archiviert)
  - `personas/` — 6 Rollen: system-architect, repository-scaffolder, feature-implementer, code-reviewer, domain-expert-oekoprofit, technical-writer
  - `evaluation/` — Scorecards pro Stage, Experiment-Log-Template
  - `templates/` — Task-Template, **`agent-transparency-contract.md`**, **`agent-runs/`** (Agentic-Coding-Orchestrierung)
  - `CHANGELOG.md` — Versions-Historie der Prompt-Entwicklung

### Dokumentations-Trennung (Root vs. Memory)

- **`known-issues.md` (Repository-Root):** fachliche Grenzen von Benchmarks/Öko-Score (kein technisches Issue-Log).
- **`memory/known_issues.md`:** technische und Laufzeit-Probleme (API, Deployment, Regressionen) sowie deren Lösung.

---

## Datenfluss

```
Nutzer (Browser) → index.html (Slider-Eingaben)
  → POST /api/ki-consulting (Vercel Function)
    → OpenRouter API (free model)
      → Markdown-Antwort zurück
        → Rendered in index.html
```

---

## Prompt-System: Design-Prinzipien

- Jede Stage hat einen Prompt, eine Persona und eine Scorecard (0–3 pro Kriterium).
- v2-Prompts haben explizite Quality Gates (Self-Check-Sektion am Ende des Prompts).
- Scorecards sind das primäre Qualitätsmessinstrument (kein automatisiertes Testing).
- Personas sind wiederverwendbar und stage-unabhängig; Stages referenzieren Personas by Name.
- v1-Prompts bleiben archiviert für Reproduzierbarkeit und akademische Dokumentation.

---

## Bekannte Einschränkungen

- OpenRouter Free Tier ist rate-limited und nicht für Produktions-Traffic geeignet.
- Kein Backend-State: jede KI-Anfrage ist stateless (keine Session, kein Kontext über Anfragen hinweg).
- Frontend hat keinen Build-Step → kein TypeScript, kein Tree-Shaking, keine automatischen Tests.
