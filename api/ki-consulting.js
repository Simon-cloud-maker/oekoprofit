// Vercel Serverless Function
// Proxies AI requests to OpenRouter so the frontend never needs an API key.
//
// Set environment variable on Vercel:
// - OPENROUTER_API_KEY

const BENCHMARK_SYSTEM_PROMPT = `Du bist ein Umweltberater für kleine und mittlere Unternehmen (KMU) in Deutschland im Rahmen des ÖKOPROFIT-Programms.

Emissionsfaktoren Deutschland 2024:
- Strom DE-Mix: 380 g CO₂/kWh (UBA 2023)
- Erdgas: 201 g CO₂/kWh (BAFA 2024)
- Anteil Erneuerbarer am Strommix 2024: 54,4 %

Branchen-Benchmarks (P25 = gut | Median | P75 = schlecht):
- Gastronomie Strom: P25 < 180 | Median 230 | P75 > 280 kWh/m²·a (DEHOGA)
- Büro Strom: P25 < 37 | Median 65 | P75 > 101 kWh/m²·a (Energieinstitut der Wirtschaft)
- Büro Heizwärme: P25 < 75 | Median 110 | P75 > 150 kWh/m²·a
- Büro Wasser: P25 < 15 | Median 22 | P75 > 35 l/MA·Tag (BNB)
- Büro Abfall: P25 < 30 | Median 60 | P75 > 100 kg/MA·a
- Gastronomie Abfall: P25 < 95 | Median 185 | P75 > 310 kg/MA·a
- Bäckerei Abfall: P25 < 80 | Median 160 | P75 > 280 kg/MA·a
- Einzelhandel Food Strom: P25 < 230 | Median 289 | P75 > 350 kWh/m²·a (EHI 2024)
- Einzelhandel Nonfood Strom: P25 < 50 | Median 75 | P75 > 110 kWh/m²·a (EHI)
- Bäckerei Strom: P25 < 200 | Median 290 | P75 > 390 kWh/m²·a (Energieagentur NRW 2022)
- Bäckerei Gas/Wärme: P25 < 380 | Median 530 | P75 > 720 kWh/m²·a (Bäcker-Innung Bayern)
- Abfall Emissionsfaktor Restmüll: 0,15 kg CO₂/kg (UBA 2023, Verbrennung+Deponie)

Reinigungsmittel-Benchmarks (Liter/Mitarbeiter/Jahr):
- Gastronomie: P25 ≤ 30 L/MA (gut) | Median 45 L/MA | P75 ≥ 70 L/MA (schlecht)
- Bäckerei: P25 ≤ 20 L/MA (gut) | Median 35 L/MA | P75 ≥ 55 L/MA (schlecht)
- Reduktionspotenziale: Dosierhilfen (−20–30 %), Konzentrate statt Fertiglösungen (−30–40 %), Schulung

Quick Wins mit bewährten Kennzahlen:
- LED-Beleuchtung: –50 % Beleuchtungsenergie, Amortisation 2–3 Jahre
- Druckluft-Leckageortung: bis –30 %, Amortisation < 1 Jahr
- Heizung 1 °C absenken: –6 % Heizkosten, Invest: 0 €
- Standby-Abschaltung Büro: –3–5 % Strom, Invest < 500 €
- Spülmaschinen-Austausch (Gastro): –50 % Wasser, –30 % Energie, Amortisation 3 Jahre
- Nachtabdeckungen Kühlregale: –30 % Kälteverbrauch, Amortisation 2 Jahre
- Bäckerei Ofentür-Dichtungen: –5 % Gas, Invest 200 €, Amortisation < 1 Jahr
- Bäckerei Teigmaschinen-Timer (Nachtabschaltung): 540 €/Jahr Einsparung, Invest 150 €
- Bäckerei LED Produktion + Verkauf: –50 % Beleuchtungsenergie, Invest 2.500 €

ÖKOPROFIT-Programmergebnisse:
- München 25 Jahre: 730 Mio. kWh, 470.000 t CO₂, 123 Mio. € Einsparung (500 Betriebe)
- Hamburg: 82 % aller Maßnahmen amortisieren sich < 3 Jahre; 40 % ohne Investition
- München 2023/24 Schnitt: ~68.000 kWh, ~11 t CO₂, ~20.000 € Einsparung/Jahr

Antworte auf Deutsch. Gib konkrete Zahlen (kWh, t CO₂, €) und Amortisationsdauern an.
Verweise auf reale ÖKOPROFIT-Beispiele wo relevant.

Die Nutzer:in liefert ein festes Markdown-Gerüst: vier ##-Abschnitte. Die Kennzahlentabelle MUSS echtes GitHub-Markdown sein: erste Zeile | Köpfe |, zweite Zeile nur | --- | --- | …
Verbietet: Pseudo-Tabellen als Fließtext mit „1. Tabelle:“; wiederholtes „1.“ für jeden Abschnitt; Klammern mit Wortzahl.

Ziel-Länge etwa 250–380 Wörter, ohne diese Zahl auszuschreiben.`;


const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

function nowIso() {
  return new Date().toISOString();
}

function redactText(text, maxChars) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  if (maxChars <= 0) return '';
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars)}…[+${trimmed.length - maxChars} chars]`;
}

function sha256Hex(value, salt) {
  return crypto
    .createHash('sha256')
    .update(String(salt || ''))
    .update(String(value || ''))
    .digest('hex');
}

function extractChoiceText(data) {
  const choice = data?.choices?.[0];
  const rawContent =
    choice?.message?.content ??
    choice?.text ??
    choice?.delta?.content ??
    '';

  if (typeof rawContent === 'string') return rawContent.trim();

  // Some providers return message content as an array of typed chunks.
  if (Array.isArray(rawContent)) {
    const joined = rawContent
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part.text === 'string') return part.text;
        return '';
      })
      .join('')
      .trim();
    return joined;
  }

  return '';
}

const CONTINUATION_USER_PROMPT =
  'Fortsetzung: Abbruch beim Ausgabelimit. Ergänzen ohne den schon geschriebenen Text zu wiederholen. ' +
  'Nutze echte Markdown-Tabelle mit Kopfzeile und | --- | --- | Trennzeile unter ## Kennzahlentabelle. Kein "1. Tabelle"-Stil. ' +
  'Abschnitte Top-3 nur mit **Massnahme 1:** / **Massnahme 2:** / **Massnahme 3:**. Keine Wortzahl in Klammern.';

async function callOpenRouterWithMessages(openrouterKey, messages, maxTokens) {
  const model = 'openrouter/free';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openrouterKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: maxTokens,
      messages,
    }),
  });

  const text = await response.text();
  return { model, response, text };
}

async function callOpenRouter(openrouterKey, prompt, maxTokens) {
  return callOpenRouterWithMessages(openrouterKey, [{ role: 'system', content: BENCHMARK_SYSTEM_PROMPT }, { role: 'user', content: prompt }], maxTokens);
}

async function appendNdjsonLine(filePath, obj) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(obj)}\n`, 'utf8');
}

async function persistPromptLogToKv(event) {
  // Lazy-load so local usage without deps still works unless enabled.
  // VERALTET: @vercel/kv zielt auf das abgekuendigte Vercel-KV-Produkt. Vercel bietet
  // KV nicht mehr an (Ersatz: Upstash Redis via Marketplace). Dieser kv-Modus ist opt-in
  // (PROMPT_LOG_DEST=kv) und laeuft nur mit einem Legacy-/alternativen Redis-Store.
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { kv } = require('@vercel/kv');

  const namespace = process.env.PROMPT_LOG_KV_NAMESPACE || 'promptlog';
  const ttlSeconds = Number.parseInt(process.env.PROMPT_LOG_TTL_SECONDS || '2592000', 10); // 30d
  const maxEvents = Number.parseInt(process.env.PROMPT_LOG_MAX_EVENTS || '5000', 10);

  const eventKey = `${namespace}:event:${event.requestId}:${event.ts}`;
  const streamKey = `${namespace}:events`;
  const requestStreamKey = `${namespace}:request:${event.requestId}`;

  const payload = JSON.stringify({ type: 'prompt_log', ...event });

  // Store:
  // - an immutable event record (keyed by requestId+ts)
  // - append to global stream
  // - append to per-request stream
  //
  // Then apply TTLs and trim the global stream.
  await Promise.all([
    kv.set(eventKey, payload, ttlSeconds ? { ex: ttlSeconds } : undefined),
    kv.lpush(streamKey, payload),
    kv.lpush(requestStreamKey, payload),
  ]);

  await Promise.all([
    ttlSeconds ? kv.expire(streamKey, ttlSeconds) : Promise.resolve(),
    ttlSeconds ? kv.expire(requestStreamKey, ttlSeconds) : Promise.resolve(),
    maxEvents > 0 ? kv.ltrim(streamKey, 0, maxEvents - 1) : Promise.resolve(),
  ]);
}

async function persistPromptLog(event) {
  const dest = (process.env.PROMPT_LOG_DEST || 'console').toLowerCase();
  if (dest === 'none' || dest === 'off') return;

  // Always emit structured logs to console (Vercel captures these).
  // Persist to file is best-effort and mostly useful locally.
  console.log(JSON.stringify({ type: 'prompt_log', ...event }));

  if (dest === 'kv') {
    try {
      await persistPromptLogToKv(event);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(JSON.stringify({ type: 'prompt_log_kv_error', message: msg }));
    }
    return;
  }

  if (dest !== 'file') return;

  const isVercel = Boolean(process.env.VERCEL);
  const filePath = isVercel
    ? '/tmp/prompt-log.ndjson'
    : path.join(process.cwd(), 'logs', 'prompt-log.ndjson');

  try {
    await appendNdjsonLine(filePath, { type: 'prompt_log', ...event });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(JSON.stringify({ type: 'prompt_log_persist_error', message: msg }));
  }
}

module.exports = async function handler(req, res) {
  const startMs = Date.now();
  const requestId =
    req.headers['x-request-id'] ||
    req.headers['x-vercel-id'] ||
    crypto.randomUUID();

  res.setHeader('x-request-id', requestId);

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vercel parses JSON bodies automatically for common runtimes.
    const { prompt } = req.body || {};

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Missing "prompt" string in request body.' });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      return res.status(500).json({ error: 'Server misconfiguration: OPENROUTER_API_KEY is not set.' });
    }

    const logMode = (process.env.PROMPT_LOGGING || 'metadata').toLowerCase(); // off | metadata | full
    const logMaxChars = Number.parseInt(process.env.PROMPT_LOG_MAX_CHARS || '800', 10);
    const logSalt = process.env.PROMPT_LOG_SALT || '';

    // Use OpenRouter free models router to keep costs at (often) $0.
    // Notes: Free-tier is rate-limited and not meant for heavy production traffic.
    const model = 'openrouter/free';

    const initialMaxTok = Math.min(
      Math.max(Number.parseInt(process.env.OPENROUTER_MAX_OUTPUT_TOKENS || '2048', 10), 256),
      8192,
    );
    const continuationMaxTok = Math.min(
      Math.max(Number.parseInt(process.env.OPENROUTER_CONTINUATION_MAX_TOKENS || '1536', 10), 256),
      4096,
    );

    const baseEvent = {
      requestId,
      ts: nowIso(),
      model,
      promptLength: prompt.length,
      promptHash: sha256Hex(prompt, logSalt),
      promptPreview: logMode === 'full' ? redactText(prompt, logMaxChars) : undefined,
    };

    let call = await callOpenRouter(openrouterKey, prompt, initialMaxTok);
    let { response, text } = call;

    if (!response.ok) {
      await persistPromptLog({
        ...baseEvent,
        ok: false,
        status: response.status,
        latencyMs: Date.now() - startMs,
        errorType: 'openrouter_http_error',
        errorDetailsPreview: redactText(text, 1200),
      });
      return res.status(response.status).json({ error: 'OpenRouter API error', details: text });
    }

    let data = JSON.parse(text);

    if (data?.error) {
      // OpenRouter sometimes returns an error object with details instead of choices.
      await persistPromptLog({
        ...baseEvent,
        ok: false,
        status: 502,
        latencyMs: Date.now() - startMs,
        errorType: 'openrouter_body_error',
        errorDetailsPreview: redactText(JSON.stringify(data.error), 1200),
      });
      return res.status(502).json({
        error: 'OpenRouter returned an error.',
        details: data.error,
      });
    }

    // OpenRouter generally follows the OpenAI chat-completions shape, but in practice
    // free routers can return slightly different structures. Be robust.
    let contentTrimmed = extractChoiceText(data);
    let finishReason = data?.choices?.[0]?.finish_reason ?? null;
    let continuationUsed = false;

    // Some OpenRouter free providers return empty content with finish_reason=length.
    // Retry once with a smaller max token budget to get a complete short answer.
    if (!contentTrimmed && finishReason === 'length') {
      call = await callOpenRouter(openrouterKey, prompt, 450);
      response = call.response;
      text = call.text;

      if (!response.ok) {
        await persistPromptLog({
          ...baseEvent,
          ok: false,
          status: response.status,
          latencyMs: Date.now() - startMs,
          errorType: 'openrouter_http_error_after_retry',
          errorDetailsPreview: redactText(text, 1200),
        });
        return res.status(response.status).json({ error: 'OpenRouter API error', details: text });
      }

      data = JSON.parse(text);
      contentTrimmed = extractChoiceText(data);
      finishReason = data?.choices?.[0]?.finish_reason ?? null;
    }

    // Non-empty reply but truncated at max_tokens ("length"): one continuation turn.
    if (contentTrimmed && finishReason === 'length') {
      try {
        const contMessages = [
          { role: 'system', content: BENCHMARK_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
          { role: 'assistant', content: contentTrimmed },
          { role: 'user', content: CONTINUATION_USER_PROMPT },
        ];
        const contCall = await callOpenRouterWithMessages(openrouterKey, contMessages, continuationMaxTok);

        if (contCall.response.ok) {
          const contData = JSON.parse(contCall.text);
          if (!contData?.error) {
            const part2 = extractChoiceText(contData);
            if (part2) {
              contentTrimmed = `${contentTrimmed}\n\n${part2}`.trim();
              continuationUsed = true;
            }
          }
        }
      } catch {
        // Keep first partial slice if continuation fails (parse/network).
      }
    }

    if (!contentTrimmed) {
      // Don't leak the API key; only return safe debugging info.
      const debug = {
        model,
        hasChoices: Array.isArray(data?.choices),
        firstChoiceKeys: data?.choices?.[0] ? Object.keys(data.choices[0]) : null,
        finishReason: data?.choices?.[0]?.finish_reason ?? null,
      };
      await persistPromptLog({
        ...baseEvent,
        ok: false,
        status: 502,
        latencyMs: Date.now() - startMs,
        errorType: 'empty_model_response',
        debug,
      });
      return res.status(502).json({ error: 'Empty response from OpenRouter.', debug });
    }

    await persistPromptLog({
      ...baseEvent,
      ok: true,
      status: 200,
      latencyMs: Date.now() - startMs,
      responseLength: contentTrimmed.length,
      continuationUsed,
      priorFinishReason: finishReason,
      responseHash: sha256Hex(contentTrimmed, logSalt),
      responsePreview: logMode === 'full' ? redactText(contentTrimmed, logMaxChars) : undefined,
    });

    return res.status(200).json({ response: contentTrimmed });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    try {
      await persistPromptLog({
        requestId,
        ts: nowIso(),
        ok: false,
        status: 500,
        latencyMs: Date.now() - startMs,
        errorType: 'handler_exception',
        errorMessage: message,
      });
    } catch {
      // ignore logging failures
    }
    return res.status(500).json({ error: message });
  }
};

