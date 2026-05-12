# Known Issues

---

## Issue: Excel-Upload v1 – absolute Rohdaten nicht direkt als Slider-Werte verwendbar

Problem:
Excel-Dateien realer Unternehmen (z.B. Münchner Rück) enthalten absolute Verbrauchswerte (MWh, m³, t), während die Slider normierte Kennzahlen erwarten (kWh/m², m³/MA, kg/MA).

Ursache:
Prompt v1 hat das Spaltenmapping zu simpel angenommen (direkte 1:1-Übertragung). Normierungsgrundlagen (Mitarbeiterzahl, Nutzfläche) fehlten im Excel-Format.

Lösung (v2):
Excel-Vorlage um Spalten `Mitarbeiter` und `Nutzflaeche_m2` erweitern. Upload-Logik erkennt absolute Einheiten anhand der Spaltenbezeichnung und rechnet automatisch um.

Vermeidung:
Excel-Vorlage als Testdatei beifügen, damit Nutzer das erwartete Format kennen.

---

## Issue: OpenRouter gibt leere Antwort zurück

Problem:
`data.choices[0].message.content` ist manchmal leer oder undefined, obwohl der HTTP-Status 200 ist.

Ursache:
Free-Tier-Modelle auf OpenRouter können strukturell abweichende Responses liefern. `delta.content` statt `message.content` kommt vor (streaming-ähnliche Antworten).

Lösung:
Robuste Fallback-Kette implementiert in `api/ki-consulting.js`:
`data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? data?.choices?.[0]?.delta?.content ?? ''`
Bei leerem Result: Debug-Info (ohne API-Key) wird an Frontend zurückgegeben.

Vermeidung:
Bei Modell-Wechsel oder OpenRouter-Updates Fallback-Kette re-testen.

---

## Issue: Ollama-Fallback schlägt auf Vercel fehl

Problem:
Frühe Implementierung versuchte, bei Fehler auf lokalen Ollama-Prozess zu fallen. Auf Vercel ist kein Ollama verfügbar → immer Fehler.

Ursache:
Ollama läuft nur lokal; Vercel Functions haben keinen Zugriff auf localhost-Prozesse des Entwicklungsrechners.

Lösung:
Ollama-Fallback komplett entfernt. OpenRouter ist jetzt der einzige Provider. Bei fehlendem `OPENROUTER_API_KEY` gibt die Function einen klaren 500-Fehler aus.

Vermeidung:
Keine lokalen Prozesse als Fallback in Serverless Functions einplanen.

---

## Issue: OPENROUTER_API_KEY nicht in Vercel gesetzt

Problem:
Wenn der API-Key nicht als Vercel Environment Variable gesetzt ist, gibt die Function einen 500-Fehler zurück ("Server misconfiguration").

Ursache:
Fehlende Konfiguration nach Deployment.

Lösung:
Key über `vercel env add OPENROUTER_API_KEY` oder Vercel Dashboard setzen.

Vermeidung:
Nach jedem neuen Deployment oder bei neuen Team-Mitgliedern explizit prüfen. Ggf. `vercel env pull` in Onboarding-Doku aufnehmen.
