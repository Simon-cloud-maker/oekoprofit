// Vercel Serverless Function — Lernkarten anlegen (POST) und auflisten (GET).
// Persistenz: Neon Postgres, Tabelle `lernkarte` (siehe db/0001_init.sql).
// Analog zu api/tasks.js, zusaetzlich mit Feld `content`.

const { neon } = require('@neondatabase/serverless');

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

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.trim()) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data.trim()) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return json(res, 503, { error: 'DATABASE_URL nicht konfiguriert' });
  }
  const sql = neon(url);

  try {
    if (req.method === 'GET') {
      const userId = req.query?.user_id;
      const rows = userId
        ? await sql`select id, title, status, user_id, content, created_at
                      from lernkarte where user_id = ${userId}
                     order by created_at desc limit 200`
        : await sql`select id, title, status, user_id, content, created_at
                      from lernkarte order by created_at desc limit 200`;
      return json(res, 200, { count: rows.length, lernkarten: rows });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) {
        return json(res, 400, { error: 'Feld "title" ist erforderlich' });
      }
      const content = typeof body.content === 'string' && body.content.trim()
        ? body.content.trim() : null;
      const status = typeof body.status === 'string' && body.status.trim()
        ? body.status.trim() : 'open';
      const userId = typeof body.user_id === 'string' && body.user_id.trim()
        ? body.user_id.trim() : 'demo';

      const rows = await sql`
        insert into lernkarte (title, status, user_id, content)
        values (${title}, ${status}, ${userId}, ${content})
        returning id, title, status, user_id, content, created_at`;
      return json(res, 201, { lernkarte: rows[0] });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ type: 'lernkarten_error', message }));
    return json(res, 500, { error: 'Datenbankfehler', details: message });
  }
};
