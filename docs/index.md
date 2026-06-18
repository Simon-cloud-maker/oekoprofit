# ÖKOPROFIT KI-Dashboard

Prototyp für betriebliches Umweltmanagement im ÖKOPROFIT-Kontext.

**Quellen:** `README.md`, `memory/long_term.md`, `package.json`

## Zweck

Laut `memory/long_term.md`:

- Unternehmen bei der Quantifizierung ökologischer Maßnahmen unterstützen
- Bezug zum ÖKOPROFIT-Programm
- Kontext: Wirtschaftsinformatik-Projekt; primär Prototyp und Prompt-Engineering-Experiment

## Live-Instanz

Laut `README.md`:

**[https://oekoprofit-ki.vercel.app](https://oekoprofit-ki.vercel.app)**

```text
TODO: fachlich klären — ob GitHub Pages parallel genutzt wird (memory/long_term.md erwähnt GitHub Pages; README nennt Vercel als Live-URL).
```

## Kernfunktionen (aus README)

| Tab | Inhalt |
|-----|--------|
| Dateneingabe | Betriebsprofil, Jahreswerte, Rechnungs-Upload, Excel-Import, Snapshots |
| Benchmark | Ampel-Balken, Öko-Score, Hauptverbraucher, Quick Wins |
| KI-Empfehlungen | Deterministische Vorschläge + optionale KI-Beratung |
| Verlauf | Snapshots, Score-Trend, Vergleich |

## Fallbeispiele im UI

Laut `index.html` (sichtbare Dropdown-Optionen):

- **Gasthaus (Gastronomie)** — Wert `gastro`
- **Bäckerei (Produktion)** — Wert `baeckerei`

Weitere Branchen sind im Dropdown als `hidden` hinterlegt (`handel_food`, `handel_nonfood`, `buero`, `produktion`) mit Kommentar „weitere Branchen folgen in späteren Ausbaustufen“.

## Dokumentation bauen

```bash
pip install -r requirements-docs.txt
mkdocs serve    # lokal: http://127.0.0.1:8000
mkdocs build    # Ausgabe in site/
```

Alternativ (wenn npm-Scripts gesetzt): `npm run docs:serve`
