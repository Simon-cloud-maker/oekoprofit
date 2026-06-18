# ÖKOPROFIT KI-Dashboard

Prototyp für betriebliches Umweltmanagement im ÖKOPROFIT-Kontext: Kennzahlen erfassen, mit Branchen-Benchmarks vergleichen, Maßnahmen ableiten und optional per KI vertiefen.

**Live:** [https://oekoprofit-ki.vercel.app](https://oekoprofit-ki.vercel.app)

---

## Funktionen

| Tab | Inhalt |
|-----|--------|
| **Dateneingabe** | Betriebsprofil, Jahreswerte (Strom, Gas, Wasser, Abfall, Reinigungsmittel), Rechnungs-Upload (Gemini), Excel-Import, Snapshots |
| **Benchmark** | Ampel-Balken, Öko-Score, Hauptverbraucher, Quick Wins, Quellen |
| **KI-Empfehlungen** | Deterministische Vorschläge + optionale KI-Beratung (OpenRouter) |
| **Verlauf** | Gespeicherte Snapshots, Score-Trend, Vergleich zweier Stände |

**Fallbeispiele:** Gastronomie (Gasthaus) und Bäckerei (Produktion).

**Dark Mode:** Toggle oben rechts (Einstellung bleibt im Browser gespeichert).

---

## Technik

- **Frontend:** eine Datei — `index.html` (Vanilla HTML/CSS/JS, kein Build-Step)
- **Benchmarks:** `benchmarks.js`
- **API (Vercel Serverless):**
  - `api/ki-consulting.js` — KI-Beratung via OpenRouter
  - `api/document-reader.js` — Rechnungs-Extraktion via Gemini
  - `api/config.js` — meldet, welche Server-Keys gesetzt sind
  - `api/prompt-logs.js` — optional Prompt-Logs aus Vercel KV

---

## Lokal starten

### Nur UI (ohne API)

```bash
# Beliebiger Static Server, z. B.:
python3 -m http.server 8080
# → http://localhost:8080/index.html
```

Ohne Vercel-API funktionieren **nicht:** Rechnungs-Upload über Server, KI-Beratung über Server-Proxy. Dafür kannst du API-Keys direkt in der UI eintragen (siehe unten).

### Mit API (empfohlen)

```bash
npm install
cp .env.example .env
# .env bearbeiten (mindestens OPENROUTER_API_KEY und/oder GEMINI_API_KEY)

npx vercel dev
```

---

## Deployment (Vercel)

1. Repo mit Vercel verbinden (GitHub → `main` deployt automatisch)
2. Environment Variables setzen (siehe Tabelle)
3. Nach Änderungen an Env-Variablen: **Redeploy** auslösen

**Prüfen, ob Keys ankommen:**

```text
GET https://oekoprofit-ki.vercel.app/api/config
```

Erwartung:

```json
{ "hasGeminiKey": true, "hasOpenrouterKey": true }
```

Wenn `hasGeminiKey: false` → Variablenname oder Redeploy prüfen.

---

## Environment Variables

| Variable | Pflicht | Zweck |
|----------|---------|--------|
| `OPENROUTER_API_KEY` | für KI-Beratung (Server) | OpenRouter-Proxy in `api/ki-consulting.js` |
| `GEMINI_API_KEY` | für Rechnungs-Upload (Server) | Gemini in `api/document-reader.js` |
| `OPENROUTER_MAX_OUTPUT_TOKENS` | optional | Längere KI-Antworten (Default: 2048) |
| `OPENROUTER_CONTINUATION_MAX_TOKENS` | optional | Fortsetzung bei abgeschnittenen Antworten |
| `PROMPT_LOG_*`, `KV_*` | optional | Prompt-Logging / KV (siehe `.env.example`) |

### API-Keys beschaffen

| Dienst | Wo | Verwendung |
|--------|-----|------------|
| **Gemini** | [Google AI Studio](https://aistudio.google.com/apikey) | Rechnungen einlesen (PDF/Foto) |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | KI-Beratung im Tab Empfehlungen |

### Häufiger Fehler: Gemini-Key wird nicht erkannt

Der Code liest **exakt** `GEMINI_API_KEY` (alles groß, Unterstriche).

- ❌ `Gemini_API_Key`, `GEMINI-API-KEY`, `GOOGLE_API_KEY`
- ✅ `GEMINI_API_KEY`

Nach dem Anlegen in Vercel: Environment **Production** wählen und neu deployen.

---

## Kurzanleitung App

### 1. Kennzahlen eingeben

1. Branche wählen (Gastronomie oder Bäckerei)
2. **Betriebsprofil** ausfüllen (Fläche, Mitarbeiter, …)
3. **Jahreswerte** eintragen (kWh, m³, kg, Liter pro Jahr)
4. Der Öko-Score und die Benchmark-Balken aktualisieren sich automatisch

### 2. Rechnungen einlesen (optional)

1. Tab **Dateneingabe** → **Daten importieren**
2. Falls kein Server-Key: **Gemini API-Key** einfügen (`AIza…`)
3. **Rechnungen einlesen** → PDF oder Foto wählen (Strom, Gas, Wasser, Abfall, Reinigungsmittel)
4. Erkannte Werte werden in die Jahreswert-Felder übernommen

### 3. KI-Beratung (optional)

1. Tab **KI-Empfehlungen**
2. Lokal ohne Server-Key: **OpenRouter API-Key** eintragen
3. **KI-Beratung starten**

Auf Vercel mit gesetztem `OPENROUTER_API_KEY` ist kein Key in der UI nötig.

### 4. Verlauf / Snapshots

- **Snapshot speichern** in der Dateneingabe
- Tab **Verlauf**: Trend, Vergleich, Wiederherstellen, Löschen
- Daten liegen nur im **localStorage** des Browsers — regelmäßig exportieren, wenn du Backups brauchst

---

## Projektstruktur

```text
index.html              # Gesamte UI + Client-Logik
benchmarks.js           # Branchen-Benchmarks (P25/Median/P75)
benchmark_context.md    # KI-Kontext für Empfehlungen
api/                    # Vercel Serverless Functions
known-issues.md         # Datenlücken, Schätzwerte
AGENTS.md               # Anleitung für IDE-Agenten
memory/                 # Projektstand, Entscheidungen
logs/                   # Session-Protokoll
prompts/                # Prompt-Engineering (Stages, Personas)
```

---

## Vollständige Dokumentation (MkDocs)

```bash
pip install -r requirements-docs.txt
npm run docs:serve    # → http://127.0.0.1:8000
npm run docs:build    # statische Site in site/
```

**Online (GitHub Pages):** Nach Push auf `main` baut der Workflow `.github/workflows/mkdocs.yml` die Doku.  
URL: [https://simon-cloud-maker.github.io/oekoprofit/](https://simon-cloud-maker.github.io/oekoprofit/)  
Voraussetzung: Repository **Settings → Pages → Source: GitHub Actions** (einmalig aktivieren).

Quellen liegen unter `docs/`; Inhalte sind aus README, Code und Konfiguration abgeleitet (unsichere Punkte mit `TODO: fachlich klären` markiert).

## Weitere Dokumentation

| Datei | Inhalt |
|-------|--------|
| [docs/index.md](docs/index.md) | MkDocs-Startseite |
| [AGENTS.md](AGENTS.md) | Agent-Workflow, CI, Constraints |
| [memory/short_term.md](memory/short_term.md) | Aktueller Stand |
| [memory/long_term.md](memory/long_term.md) | Architektur |
| [memory/decisions.md](memory/decisions.md) | Entscheidungslog |
| [known-issues.md](known-issues.md) | Benchmark-Einschränkungen |
| [prompts/README.md](prompts/README.md) | Prompt-System |

---

## Scripts

```bash
npm run check:transparency          # CI: Logs bei Code-Änderungen
npm run check:transparency:working  # Prüfung im Working Tree
npm run agent:finish -- "message"   # Agent-Lauf: Commit + Push (Feature-Branch)
```

---

## Lizenz / Kontext

Wirtschaftsinformatik-Projekt (Proof of Concept). Benchmark-Daten basieren auf ÖKOPROFIT-Netzwerk und öffentlichen Quellen — siehe `benchmarks.js` und `known-issues.md`.
