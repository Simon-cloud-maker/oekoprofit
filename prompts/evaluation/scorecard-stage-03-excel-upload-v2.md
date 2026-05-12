# Scorecard: Stage 03 Excel-Upload Prompt (v2)

Score each criterion from 0-3.

| Criterion | Score (0-3) | Notes |
|---|---:|---|
| Feature scope is specific and testable | 3 | Scope klar: Normierungslogik mit konkreten Formeln, Keyword-Matching, Fehlerfälle definiert. |
| Implementation plan avoids unrelated refactors | 3 | Nur `handleExcelUpload()` ersetzt; keine anderen Funktionen berührt. |
| Validation and edge cases are addressed | 3 | Fehlende Normierungsspalten, dezimale Recyclingquote, Tonnage vs. kg, fehlende Spalten abgedeckt. |
| File-level changes are explicit and reviewable | 3 | Vollständige Funktion als Drop-in-Ersatz; Einfügepunkt eindeutig. |
| Testing and verification steps are complete | 3 | Münchner_Rück_Umweltkennzahlen.xlsx als konkrete Testdatei mit erwarteten Ausgabewerten referenziert. |
| Explanation of logic/formulas is understandable | 3 | Alle Umrechnungen (MWh→kWh/m², t→kg/MA, Dezimal→%) explizit dokumentiert. |
| Limitations and next steps are clearly stated | 3 | Limitierungen (nur erste Datenzeile, feste Spaltennamen) und Next Steps explizit benannt. |

## Totals

- Points earned: 21
- Max points: 21
- Percent: 100 %

## Verdict

- Keep
- Main improvement target for v3: Mehrere Datenzeilen unterstützen (z.B. Jahresvergleich als Durchschnitt); Spaltenname-Aliase konfigurierbar machen.
