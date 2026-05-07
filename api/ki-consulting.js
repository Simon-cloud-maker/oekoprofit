// Vercel Serverless Function
// Proxies AI requests to OpenRouter so the frontend never needs an API key.
//
// Set environment variable on Vercel:
// - OPENROUTER_API_KEY

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

async function appendNdjsonLine(filePath, obj) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(obj)}\n`, 'utf8');
}

async function persistPromptLogToKv(event) {
  // Lazy-load so local usage without deps still works unless enabled.
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

    const baseEvent = {
      requestId,
      ts: nowIso(),
      model,
      promptLength: prompt.length,
      promptHash: sha256Hex(prompt, logSalt),
      promptPreview: logMode === 'full' ? redactText(prompt, logMaxChars) : undefined,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openrouterKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const text = await response.text();

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

    const data = JSON.parse(text);

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
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.choices?.[0]?.delta?.content ??
      '';

    const contentTrimmed = typeof content === 'string' ? content.trim() : '';
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

