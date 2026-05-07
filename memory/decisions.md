# Entscheidungslog

---

## [2026-04-16] Entscheidung: OpenRouter statt lokalem Ollama

Kontext:
Zunächst wurde Ollama (lokal) als KI-Backend genutzt, um ohne API-Key auszukommen. Dieser Ansatz scheiterte in Deployment-Umgebungen (Vercel), da kein lokaler Ollama-Prozess verfügbar ist.

Entscheidung:
Wechsel zu OpenRouter als KI-Backend via Vercel Serverless Function. API-Key wird als Umgebungsvariable gesetzt (`OPENROUTER_API_KEY`). Free-Tier-Modell `openrouter/free` wird verwendet.

Alternativen:
- Ollama lokal (verworfen: kein Cloud-Deployment möglich)
- Direkte OpenAI API (verworfen: Kosten, kein kostenloser Tier)
- Anthropic Claude API (verworfen: Kosten, über Scope des Prototyps)

Konsequenzen:
- Frontend ist vom Ollama-Prozess unabhängig; Deployment auf Vercel funktioniert.
- Rate-Limiting durch OpenRouter Free Tier — kein Produktionseinsatz ohne Upgrade.
- API-Key muss in Vercel als Env-Variable gesetzt sein (Risiko: fehlende Konfiguration).

---

## [2026-04-16] Entscheidung: Single-File Frontend (kein Framework)

Kontext:
Projektfokus liegt auf Prompt-Engineering und Demonstration. Schnelle Iteration und einfaches Hosting (GitHub Pages) sind wichtiger als Skalierbarkeit des Frontends.

Entscheidung:
Vanilla HTML/CSS/JS in einer einzigen `index.html`. Kein React, kein Build-Step, kein npm.

Alternativen:
- React/Next.js (verworfen: Overhead zu hoch für Prototyp)
- Svelte/SvelteKit (verworfen: gleiche Begründung)

Konsequenzen:
- Sehr einfaches Deployment (GitHub Pages, statisch).
- Kein TypeScript, kein automatisches Testing, keine Komponenten-Wiederverwendung.
- Skalierung auf komplexere UI würde Refactor zu Framework erfordern.

---

## [2026-04-16] Entscheidung: Prompt-Versionierung mit v1/v2-Archiv

Kontext:
Für ein akademisches Projekt (Wirtschaftsinformatik) ist Nachvollziehbarkeit der Prompt-Entwicklung wichtig. Einfaches Überschreiben würde Iterationsverlauf vernichten.

Entscheidung:
v1-Prompts werden archiviert unter `prompts/stages/archive/`, v2 ist aktiv. Scorecards dokumentieren Qualitätssprung. `ARCHIVE_TABLE.md` verlinkt alt und neu.

Alternativen:
- Git-History als einzige Versionsquelle (verworfen: zu unübersichtlich für Präsentation)
- Prompts in Datenbank (verworfen: Over-Engineering für Prototyp)

Konsequenzen:
- Klare Reproduzierbarkeit der Experimente.
- Erhöhter Pflegeaufwand bei weiteren Iterationen (v3 müsste ebenfalls archiviert werden).

---

## [2026-04-23] Entscheidung: Markdown-Rendering für KI-Antworten

Kontext:
OpenRouter-Antworten enthalten häufig Markdown-Formatierung (Listen, Fettdruck, Überschriften). Ohne Parsing wurden rohe Asterisks und Hashes angezeigt.

Entscheidung:
Markdown-Parsing im Frontend implementiert, sodass KI-Antworten formatiert gerendert werden.

Alternativen:
- KI per Prompt zu Plain-Text zwingen (verworfen: unzuverlässig, schlechtere Lesbarkeit)
- Externe Markdown-Bibliothek (marked.js) laden (mögliche Alternative, nicht gewählt)

Konsequenzen:
- Bessere Lesbarkeit der KI-Empfehlungen.
- Leicht erhöhte Komplexität im Frontend-JS.
