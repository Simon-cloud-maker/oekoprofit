# Short-Term Memory — Aktueller Projektstand

_Zuletzt aktualisiert: 2026-06-18_

## Aktueller Stand

- **Dark Mode:** Toggle im Header (`data-theme`, `localStorage`); CSS-Korrekturen für Buttons, Snapshots, Tabs und Vergleichstabelle.
- **MkDocs:** GitHub Pages unter https://simon-cloud-maker.github.io/oekoprofit/ (inkl. Lessons Learned)
- **Fokus:** Zwei Fallbeispiele — Gasthaus (Gastronomie) und Bäckerei (Handwerksbäckerei)
- **Benchmark-Tab:** Balken pro Metrik individuell befüllt; Score-Ring erst bei vollständigen Daten; Legende modusbewusst
- **Reinigungsmittel:** Eingabe in L/Jahr (Gesamtliter); interne Umrechnung auf L/MA via `computeFromJahreswerte()`
- **Gemini Document Reader:** Extraktion von Strom, Gas, Wasser, Abfall, Reinigungsmittel (Gesamtliter)
- **Deterministisch Empfehlungen:** `buildDeterministicRecs()` mit Template-Variablen und Betriebsprofil
- **Agentic Coding:** `AGENTS.md` + `prompts/agent-runs/` (6 Persona-Runs + Template)
- **KI-Backend:** Vercel Serverless Function (`api/ki-consulting.js`) → OpenRouter Free Tier
- **Frontend:** Single-file `index.html` (vanilla HTML/CSS/JS, kein Framework, kein Build-Step)

## Auf main gemergte Branches (Tasks 1–8 + waste-kpi)

| Branch | Was |
|--------|-----|
| `feat/bakery-benchmarks` | Bäckerei-Kennzahlen, Quick Wins, Hauptverbraucher, massnahmen-Array |
| `feat/ui-focus-two-cases` | Dropdown auf 2 Optionen, Bäckerei-Mediane in UI |
| `feat/branch-specific-inputs` | Betriebsprofil-Felder, Jahreswert-Inputs, Slider als State-Holder |
| `feat/gemini-document-reader` | Gemini 2.0 Flash, Multi-file Upload, Reinigungsmittel + Abfall-Extraktion |
| `feat/deterministic-recommendations` | `buildDeterministicRecs()`, Template-Variablen, Betriebsgröße |
| `feat/sharper-ai-recommendations` | Bäckerei-Benchmarks im System-Prompt, kueche-Bedingung |
| `feat/replace-recycling-metric` | Recyclingquote → Reinigungsmittel (L/MA/Jahr) |
| `feat/benchmark-tab-update` | Hauptverbraucher-Box, Quick-Wins-Card, Quellenzeile |
| `feat/waste-kpi` | Abfall-KPI (Restmüll CO2-Faktor, Score, KI-Prompt) |

## Aktueller Branch

`main` — Dark-Mode-Korrekturen und MkDocs (Lessons Learned) auf main.

## Persistenz-Entscheidung (2026-06-24)

- **Richtung:** Falls DB nötig → **SQL/Postgres** (Neon via Vercel Marketplace). Begründung: kleine, tabellarisch modellierbare Datensätze (`title, status, user_id, created_at`), Konsistenz wichtig. NoSQL-Argumente treffen nicht zu.
- **DB eingerichtet (2026-06-24):** Neon Postgres via Vercel Marketplace provisioniert (Store `neon-byzantium-ribbon`, mit `oekoprofit-ki` verbunden). Env-Vars (u. a. `DATABASE_URL`) liegen in `.env.local` (gitignored). Schema eingespielt via `node --env-file=.env.local scripts/db-migrate.js` → Tabellen `task, lernkarte, produkt, empfehlung` bestätigt. Treiber: `@neondatabase/serverless`.
- **Persistieren (späteres Schema):** Task, Lernkarte, Produkt, Empfehlung (je `id, title, status, user_id, created_at`). `user_id` = FK-Referenz, keine PII.
- **Nicht persistieren:** AI-Chatverlauf, Prompt-Historie, Fehlerlogs, Session, Cache.
- **Benchmarks:** bleiben versionierte Seed-Daten in `benchmarks.js` (keine DB).
- **`@vercel/kv`:** abgekündigt (Vercel KV gibt es nicht mehr; Ersatz Upstash Redis). Nur opt-in für Prompt-Logging (`PROMPT_LOG_DEST=kv`); nicht entfernt, aber als VERALTET markiert in `.env.example`, `api/ki-consulting.js`, `api/prompt-logs.js`.

## Nächster Schritt

Dark Mode auf Vercel prüfen; optional `known-issues.md` mit Reinigungsmittel-Stand abgleichen.
