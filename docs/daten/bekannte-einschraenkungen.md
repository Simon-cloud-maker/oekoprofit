# Bekannte Einschränkungen

**Quellen:** `known-issues.md`, `index.html`, `benchmarks.js`

> Hinweis: `known-issues.md` (Repository-Root) beschreibt **fachliche** Benchmark-Grenzen.  
> Technische Laufzeit-Probleme: laut `memory/long_term.md` in `memory/known_issues.md`.

## Öko-Score und fehlende Quartile

Laut `known-issues.md`:

Teilscores (Strom, Gas/Wärme, Wasser, Abfall, fünfte Kennzahl) werden nur berücksichtigt, wenn p25/median/p75 in `benchmarks.js` vorhanden sind — sonst können Gesamtscores **zu hoch** ausfallen.

## Fünfte Kennzahl — Abweichung Doku vs. Code

| Quelle | Bezeichnung |
|--------|-------------|
| `known-issues.md` | „Recycling“ / `recyclingquote_pct` |
| `index.html` (aktuelles Scoring) | `reinigungsmittel` / `reinigungsmittel_l_per_ma` |
| `memory/short_term.md` | Reinigungsmittel statt Recyclingquote |

```text
TODO: fachlich klären — known-issues.md an aktuellen Stand (Reinigungsmittel) anpassen oder dokumentieren, welche Branchen noch recyclingquote_pct nutzen.
```

## Branchenspezifische Hinweise (aus known-issues.md)

- **Gastronomie:** Wasser als Proxy; Wärme/Abfall teils geschätzt
- **Einzelhandel Food/Nonfood:** Wasser/Abfall geschätzt; Nonfood eigener UI-Pfad
- **Produktion:** starke Branchenstreuung — vereinfachte Quartile
- **Recycling/Universalwerte:** wo noch `recyclingquote_pct` — DE-Ziel 2022 als Universalwert

## Slider-Obergrenzen

Laut `known-issues.md`:

- Gas max 600 kWh/m²·a, Wasser 200 m³/MA·a, Abfall 1000 kg/MA·a
- Hinweis in UI bei Erreichen des Slider-Maximums

## Schätzwerte kennzeichnen

In `benchmarks.js` verweisen viele `quelle`-Felder auf `known-issues.md` bei Schätzungen.
