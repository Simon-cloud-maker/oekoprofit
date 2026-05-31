# Entscheidungslog

---

## [2026-05-30] Entscheidung: Slider als versteckte State-Holder (nicht entfernen)

Kontext:
Task 3 ersetzt die sichtbaren Slider durch Betriebsprofil + Jahreswert-Inputs. Excel-Import und Snapshot-Restore schreiben aber direkt auf Slider-Elemente per ID.

Entscheidung:
Slider bleiben im DOM mit `style="display:none"`. Neue Inputs schreiben über `computeFromJahreswerte()` in die Slider; `getVals()` liest weiterhin Slider aus. Kein Bruch der bestehenden Logik.

Alternativen verworfen:
- Slider komplett entfernen + Excel/Snapshot-Restore umschreiben → zu viel Änderungsrisiko für einen Feature-Branch.

---

## [2026-05-30] Entscheidung: Gemini 2.0 Flash für Dokumentenextraktion

Kontext:
Task 4 braucht ein LLM, das PDFs und Fotos von Versorgungsrechnungen lesen kann. Kostenfrei und ohne Server-Key testbar.

Entscheidung:
Gemini 2.0 Flash via Google AI Studio (kostenloser API-Key). Browser-Fallback: direkter CORS-fähiger Call mit User-Key. Vercel-Proxy als Produktions-Pfad.

Alternativen verworfen:
- GPT-4o Vision: kostenpflichtig, kein kostenfreier Tier.
- Mistral Pixtral: weniger verbreitet, schlechtere PDF-Unterstützung.

---

## [2026-05-30] Entscheidung: memory/short_term.md auf main pflegen

Kontext:
Memory-Dateien lagen auf Feature-Branches und wurden beim Branch-Wechsel auf alte Stände zurückgesetzt. Neue Sessions branchen von main und lasen veralteten Kontext.

Entscheidung:
`memory/`- und `logs/`-Dateien werden direkt auf `main` committed (als eigener Handover-Commit), nicht auf Feature-Branches. Feature-Branches ändern nur Code-Dateien.

---

## [2026-05-30] Entscheidung: Bäckerei als Produktion/Handwerk (nicht als eigene Hauptbranche)

Kontext:
In benchmarks.js existiert bereits eine `produktion`-Branche (generisch). Bäckerei ist spezifischer und hat eigene Datenlage.

Entscheidung:
Eigener Eintrag `baeckerei` in `OEKOPROFIT_BENCHMARKS.branchen` mit spezifischen Quellen (Energieagentur NRW, Bäcker-Innung). Dropdown-Label: „Bäckerei (Produktion)" zur Einordnung.

---

## [2026-05-19] Entscheidung: Agentic Coding über `AGENTS.md` + `prompts/agent-runs/`

Kontext:
Personas und Stages regelten bisher manuelle LLM-Läufe. Für IDE-Agenten fehlte ein klarer Einstieg, der Kontext laden, Stage zuordnen, implementieren und Memory pflegen bündelt.

Entscheidung:
- **`AGENTS.md`** (Root) = globale Agent-Regeln und Persona→Run-Tabelle.
- **`prompts/agent-runs/<persona>-run.md`** = ausführbarer Ablauf pro Rolle.
- Stages/Personas bleiben unverändert die fachliche Quelle; Runs orchestrieren nur den Agenten.

Alternativen verworfen:
- Nur README erweitern (Agent findet Start nicht zuverlässig).
- Stages in Agent-Prompts umbauen (vermischt Aufgabe und Orchestrierung).

Konsequenzen:
- Agent startet mit expliziter Run-Datei im Chat (oder über AGENTS.md in Cursor).
- Transparenz weiterhin über `agent-transparency-contract.md`, nicht automatisch erzwungen.

---

## [2026-05-13] Entscheidung: Zentraler Agent-Transparenz-Vertrag für alle Prompts/Personas

Kontext:
Die Moodle-Aufgabenstellung verlangt nachvollziehbare Agentenaktionen. Bisher verwiesen README und Personas nur teilweise auf `logs/actions.md` und ausgewählte Memory-Dateien; Excel-Prompts erwähnten nicht einheitlich `decisions` / `known_issues` / `long_term`.

Entscheidung:
Es gibt eine **single source of truth**: `prompts/templates/agent-transparency-contract.md`. Alle Stage-Prompts (01–03 v2, Excel v1–v3), `prompts/README.md`, `task-template.md` und alle sechs Personas verweisen darauf. Pflicht: eine zusammengefasste Session in `logs/actions.md` plus aktualisiertes `memory/short_term.md`; die übrigen Memory-Dateien bei Bedarf. **Meta:** Änderungen am Logging-System selbst müssen im gleichen Lauf in denselben Dateien festgehalten werden.

Alternativen verworfen:
- Nur README ohne Template-Datei (schlechter auffindbar für LLM und Menschen).
- Nur Personas ohne Stage-Prompts (Runs ohne Persona-Wechsel würden den Contract verfehlen).

Konsequenzen:
- Höhere Pflege beim Prompt-Lauf (mehr Dateien), dafür klare Auditierbarkeit für Prüfer und Folge-Agenten.

---

## [2026-05-12] Entscheidung: Gemischte Projektsprache (Englisch/Deutsch)

Kontext:
Das Prompt-System (`/prompts/`) ist auf Englisch, die Memory- und Log-Dateien (`/memory/`, `/logs/`) auf Deutsch. Diese Mischung ist historisch gewachsen, nicht aktiv entschieden worden.

Entscheidung:
Zustand bewusst beibehalten: Prompts bleiben auf Englisch, Memory/Logs bleiben auf Deutsch.

Begründung:
Englische Prompts sind für LLM-Aufrufe robuster und konsistenter. Deutsche Memory/Log-Dateien sind für den menschlichen Leser (Student, Prüfer) leichter zugänglich. Eine Übersetzung würde entweder die Prompt-Qualität riskieren oder keinen echten Mehrwert bringen.

Alternativen verworfen:
- Alles Englisch: Memory/Logs für deutschsprachigen Kontext unpraktisch.
- Alles Deutsch: Prompt-Effektivität bei LLM-Aufrufen potenziell reduziert.

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


---

## [2026-05-31] Recyclingquote → Reinigungsmittelverbrauch

**Kontext:**
Die Recyclingquote (%) wurde als 5. Umweltkennzahl genutzt, ist aber für KMU
in der Praxis schwer zu erheben — Unternehmen kennen diese Zahl oft nicht.

**Entscheidung:**
Ersatz durch **Reinigungsmittelverbrauch (L/MA/Jahr)**.

**Alternativen geprüft:**
- Abfallkosten (€/MA/Jahr): auf Entsorgungsrechnung lesbar, aber eigener Parser nötig
- Recyclingquote beibehalten: bleibt unverändert, da niemand die Zahl kennt

**Begründung:**
- HACCP-Rechnungen (CleanPro etc.) sind Jahresrechnungen mit klarer Summenzeile
- Gemini 2.0 Flash kann diese direkt als `reinigungsmittel_liter` extrahieren
- Relevant für beide Fallbeispiele (Gasthaus: Küche/Sanitär, Bäckerei: HACCP-Pflicht)
- `invertiert: false` (niedriger = besser) → konsistente Scoring-Logik

**Impact:**
- `benchmarks.js`: gastronomie + baeckerei kennzahlen, massnahmen
- `index.html`: 12 Stellen (Slider, Scoring, Prompt, Snapshot)
- `api/document-reader.js`: neues Feld im Extraction-Prompt
- `api/ki-consulting.js`: Benchmark-Werte im System-Prompt
