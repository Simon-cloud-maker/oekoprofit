// Vercel Serverless Function
// Read prompt logs from Vercel KV (requires PROMPT_LOG_READ_TOKEN).

function json(res, status, body) {
  const payload = JSON.stringify(body);
  if (typeof res.status === 'function') {
    res.status(status);
  } else {
    res.statusCode = status;
  }
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
  }
  res.end(payload);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return json(res, 405, { error: 'Method not allowed' });
    }

    const authHeader = req.headers?.authorization;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : req.query?.token;

    const expected = process.env.PROMPT_LOG_READ_TOKEN;
    if (!expected || token !== expected) {
      return json(res, 401, { error: 'Unauthorized' });
    }

    // Lazy-load so deploys without KV enabled can still build (endpoint will fail at runtime).
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { kv } = require('@vercel/kv');

    const namespace = process.env.PROMPT_LOG_KV_NAMESPACE || 'promptlog';

    const limitRaw = req.query?.limit;
    const limit = Math.max(1, Math.min(500, Number.parseInt(limitRaw || '50', 10)));

    const requestId = req.query?.requestId;
    const key = requestId ? `${namespace}:request:${requestId}` : `${namespace}:events`;

    // We store newest-first (LPUSH). Return newest-first.
    const raw = await kv.lrange(key, 0, limit - 1);
    const events = Array.isArray(raw)
      ? raw.map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return { type: 'prompt_log_parse_error', raw: String(line) };
          }
        })
      : [];

    return json(res, 200, { key, count: events.length, events });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ type: 'prompt_logs_error', message }));
    return json(res, 503, {
      error: 'Prompt log storage unavailable',
      details: message,
    });
  }
};

