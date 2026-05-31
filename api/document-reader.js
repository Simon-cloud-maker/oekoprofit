// Vercel Serverless Function — Gemini Document Reader
// Liest Versorgungsrechnungen (Strom, Gas, Wasser) ODER Reinigungsmittelrechnungen
// als PDF oder Foto und extrahiert Verbrauchskennzahlen via Gemini 2.0 Flash.
//
// Nutzt die Gemini Files API (Upload → URI-Referenz) statt inline Base64,
// um den Input-Token-Verbrauch zu minimieren und Free-Tier-Limits einzuhalten.
//
// Set environment variable on Vercel:
//   GEMINI_API_KEY
//
// POST Body (JSON):
//   { files: [{ base64: string, mimeType: string }], branche: string }
//
// Response (JSON):
//   { strom_kwh, gas_kwh, wasser_m3, reinigungsmittel_liter, zeitraum_monate,
//     zeitraum_beschreibung, konfidenz, nicht_gefunden }

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const EXTRACTION_PROMPT = `Du analysierst Versorgungsrechnungen (Strom, Gas, Wasser) ODER Reinigungsmittelrechnungen eines deutschen Gewerbebetriebs.

Extrahiere aus den beigefügten Dokumenten alle folgenden Werte, falls vorhanden:
- strom_kwh: Gesamter Stromverbrauch im Abrechnungszeitraum in kWh (Zahl, ohne Einheit)
- gas_kwh: Gesamter Gasverbrauch im Abrechnungszeitraum in kWh (Zahl, ohne Einheit). Wenn nur m³ angegeben: multipliziere mit 10 (Schätzung Heizwert).
- wasser_m3: Gesamter Wasserverbrauch im Abrechnungszeitraum in m³ (Zahl, ohne Einheit)
- reinigungsmittel_liter: Gesamtmenge aller gelieferten Reinigungsmittel im Abrechnungszeitraum in Litern (Zahl, ohne Einheit). Summiere alle Einzelpositionen (Kanister × Liter/Gebinde + Flaschen × ml/1000). Steht oft als „Gesamt gelieferte Reinigungsmittel" oder „Summe Reinigungsmittel" in der Tabelle. Null wenn nicht erkennbar.
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
  "reinigungsmittel_liter": null,
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

// Upload one file via Files API, return the file URI.
async function uploadFile(apiKey, base64, mimeType) {
  const bytes = Buffer.from(base64, 'base64');
  const uploadRes = await fetch(
    `${GEMINI_BASE}/files?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: { displayName: 'rechnung' },
        // inline upload via JSON with base64 — avoids multipart complexity
        // but still separates file data from the generateContent call
      }),
    }
  );

  // Use the raw (resumable) upload protocol for simplicity
  const initRes = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'Content-Type': mimeType,
      },
      body: bytes,
    }
  );
  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}));
    throw new Error('Files API Upload fehlgeschlagen: ' + (err?.error?.message || initRes.status));
  }
  const data = await initRes.json();
  return data.file.uri;
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

  // Upload each file via Files API and collect URIs
  const parts = [{ text: EXTRACTION_PROMPT }];
  try {
    for (const f of files) {
      if (!f.base64 || !f.mimeType) continue;
      const uri = await uploadFile(apiKey, f.base64, f.mimeType);
      parts.push({ fileData: { mimeType: f.mimeType, fileUri: uri } });
    }
  } catch (err) {
    res.writeHead(502, corsHeaders());
    res.end(JSON.stringify({ error: err.message }));
    return;
  }

  let geminiData;
  try {
    const geminiRes = await fetch(
      `${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
        }),
      }
    );
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
