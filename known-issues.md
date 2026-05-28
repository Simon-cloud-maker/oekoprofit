# Bekannte Grenzen der Benchmarks und des Öko-Scores

## Quartile für Gas, Wasser und Abfall pro Branche

Das Dashboard berechnet den **Öko-Score** aus bis zu fünf Teilscores (Strom, Gas/Wärme, Wasser, Abfall, Recycling) mit festen Gewichten. Die zugrunde liegenden **p25 / Median / p75** müssen in `benchmarks.js` unter der jeweiligen Branche als `heizwaerme_kwh_per_m2` oder `waerme_kwh_per_m2`, `wasser_liter_per_ma_tag` und `abfall_kg_per_ma` vorliegen — **sonst** werden diese Kennzahlen beim Scoring **nicht** berücksichtigt, was zu **zu hohen Gesamtscores** führen kann.

### Büro / Verwaltung

Für **Büro** stammen die Quartile überwiegend aus nachvollziehbaren Quellen (siehe `benchmarks.js`, Feld `quelle`).

### Gastronomie

- **`wasser_liter_per_ma_tag`**: Zusätzlich zu DEHOGA-Kennzahlen in **l/Gedeck** liegt diese Kennzahl für das **gleiche UI** (Umrechnung aus m³/MA und 250 Arbeitstagen) absichtlich unter einem eigenen Key vor. Sie ist ein **betrieblicher Proxy**, nicht deckungsgleich mit „Litern pro Gedeck“.
- **`waerme_kwh_per_m2`**, **`abfall_kg_per_ma`**: Quartile sind **Interpolation/Schätzung** für Gaststätten mit Gebäudebezug bzw. Personalbezug, wo keine einheitliche ÖKOPROFIT-Branchentabelle vorlag.

### Einzelhandel (Lebensmittel)

- **`wasser_liter_per_ma_tag`** und **`abfall_kg_per_ma`**: EHI liefert hier vor allem **Strom/Wärme pro m²**. Wasser und Abfall pro Mitarbeitenden sind für das Scoring **geschätzt** (Hygiene/Kühlung bzw. Verpackungs-/Bioabfall LEH).

### Einzelhandel (Nonfood)

- Im UI **eigener Dropdown-Eintrag** (`handel_nonfood` → `einzelhandel_nonfood` in `benchmarks.js`), getrennt von Lebensmittelhandel — sonst würden z. B. Baumarkt/Textil am Food-Strombenchmark (Median ~289 kWh/m²) gemessen.
- **`wasser_liter_per_ma_tag`** und **`abfall_kg_per_ma`**: EHI-Schwerpunkt Strom/Beleuchtung; Wasser/Abfall pro MA sind **geschätzt** (Verpackung, Sanitär).

### Produktion / Fertigung (KMU)

- **`strom_kwh_per_m2`**, **`waerme_kwh_per_m2`**, **`wasser_liter_per_ma_tag`**, **`abfall_kg_per_ma`**: Die Streuung zwischen Branchen (Metall, Chemie, Textil, …) ist extrem groß. Die eingetragenen Quartile sind eine **bewusst konservative Vereinfachung** für ein einheitliches Dashboard — keine Substitute für eine echte Bilanzierung vor Ort.

### Recycling

Die Recyclingquote nutzt weiterhin eine **generische** Ampel (p25/median/p75) aus den Dashboard-Zielen, nicht branchenspezifische Quartile.

---

## Schieberegler-Obergrenzen

Gas-, Wasser- und Abfall-Slider haben erhöhte Maxima (Gas **600** kWh/m²·a, Wasser **200** m³/MA·a, Abfall **1000** kg/MA·a). Liegt ein Betrieb darüber, sind die angezeigten Werte weiterhin nach oben **begrenzt** — bei Erreichen des Maximums bei Strom-, Gas-, Wasser- oder Abfall-Slider erscheint ein **Hinweis** in der Oberfläche.

---

## Pflege-Empfehlung

Wenn belastbarere Quartile (Studien, ÖKOPROFIT-Aggregate, Branchenverbände) verfügbar werden: `benchmarks.js` anpassen und dieses Dokument kurz aktualisieren (Quelle + Datum).
