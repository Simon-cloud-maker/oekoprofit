// Vercel Serverless Function — Gemini Document Reader
// Liest Versorgungsrechnungen (Strom, Gas, Wasser) als PDF oder Foto
// und extrahiert Verbrauchskennzahlen via Gemini 2.0 Flash.
//
// Set environment variable on Vercel:
//   GEMINI_API_KEY
//
// POST Body (JSON):
//   { files: [{ base64: string, mimeType: string }], branche: string }
//
// Response (JSON):
//   { strom_kwh, gas_kwh, wasser_m3, zeitraum, konfidenz, nicht_gefunden }

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const EXTRACTION_PROMPT = `Du analysierst Versorgungsrechnungen (Strom, Gas, Wasser) eines deutschen Gewerbebetriebs.

Extrahiere aus den beigefügten Dokumenten alle folgenden Werte, falls vorhanden:
- strom_kwh: Gesamter Stromverbrauch im Abrechnungszeitraum in kWh (Zahl, ohne Einheit)
- gas_kwh: Gesamter Gasverbrauch im Abrechnungszeitraum in kWh (Zahl, ohne Einheit). Wenn nur m³ angegeben: multipliziere mit 10 (Schätzung Heizwert).
- wasser_m3: Gesamter Wasserverbrauch im Abrechnungszeitraum in m³ (Zahl, ohne Einheit)
- zeitraum_monate: Länge des Abrechnungszeitraums in Monaten (Zahl)
- zeitraum_beschreibung: Beschreibung des Zeitraums, z. B. "01.01.2024–31.12.2024"
- konfidenz: Deine Sicherheit bei der Extraktion: "hoch", "mittel" oder "niedrig"
- nicht_gefunden: Array der Felder, die nicht im Dokument gefunden wurden

Wenn ein Wert nicht im Abrechnungszeitraum eines vollen Jahres ist, rechne auf Jahresbasis hoch
(z. B. 6 Monate Verbrauch × 2 = Jahresverbrauch). Markiere dann konfidenz als "mittel".

Antworte NUR mit einem validen JSON-Objekt, ohne Markdown-Codeblock, ohne Erklärungstext:
{
  "strom_kwh": null,
  "gas_kwh": null,
  "wasser_m3": null,
  "zeitraum_monate": null,
  "zeitraum_beschreibung": null,
  "konfidenz": "hoch",
  "nicht_gefunden": []
}`;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, corsHeaders());
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, corsHeaders());
    res.end(JSON.stringify({ error: 'GEMINI_API_KEY nicht konfiguriert' }));
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.writeHead(400, corsHeaders());
    res.end(JSON.stringify({ error: 'Ungültiger JSON-Body' }));
    return;
  }

  const { files } = body;
  if (!files || !Array.isArray(files) || files.length === 0) {
    res.writeHead(400, corsHeaders());
    res.end(JSON.stringify({ error: 'Keine Dateien übermittelt' }));
    return;
  }

  // Baue Gemini-Request: Text-Prompt + alle Dokumente als inlineData
  const parts = [{ text: EXTRACTION_PROMPT }];
  for (const f of files) {
    if (!f.base64 || !f.mimeType) continue;
    parts.push({ inlineData: { mimeType: f.mimeType, data: f.base64 } });
  }

  let geminiData;
  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
      }),
    });
    geminiData = await geminiRes.json();
  } catch (err) {
    res.writeHead(502, corsHeaders());
    res.end(JSON.stringify({ error: 'Gemini API nicht erreichbar: ' + err.message }));
    return;
  }

  const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  let extracted;
  try {
    const jsonStr = rawText.replace(/```json?\n?|```/g, '').trim();
    extracted = JSON.parse(jsonStr);
  } catch {
    res.writeHead(502, corsHeaders());
    res.end(JSON.stringify({ error: 'Gemini-Antwort kein valides JSON', raw: rawText.slice(0, 200) }));
    return;
  }

  res.writeHead(200, corsHeaders());
  res.end(JSON.stringify(extracted));
};
