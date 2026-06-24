// Vercel Serverless Function — Handlungsempfehlungen je Aufgabe.
// Persistenz: Neon Postgres, Tabelle `empfehlung` (FK task_id -> task).
// GET  /api/empfehlungen?task_id=UUID  -> Empfehlungen einer Aufgabe
// POST /api/empfehlungen {task_id, text} -> Empfehlung anlegen

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
      const taskId = req.query?.task_id;
      if (!taskId) {
        return json(res, 400, { error: 'Query-Parameter "task_id" ist erforderlich' });
      }
      const rows = await sql`
        select id, task_id, text, created_at
          from empfehlung where task_id = ${taskId}
         order by created_at desc limit 200`;
      return json(res, 200, { count: rows.length, empfehlungen: rows });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const taskId = typeof body.task_id === 'string' ? body.task_id.trim() : '';
      const text = typeof body.text === 'string' ? body.text.trim() : '';
      if (!taskId) {
        return json(res, 400, { error: 'Feld "task_id" ist erforderlich' });
      }
      if (!text) {
        return json(res, 400, { error: 'Feld "text" ist erforderlich' });
      }

      const rows = await sql`
        insert into empfehlung (task_id, text)
        values (${taskId}, ${text})
        returning id, task_id, text, created_at`;
      return json(res, 201, { empfehlung: rows[0] });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Foreign-Key-Verletzung (task_id zeigt auf keine existierende Aufgabe)
    // bzw. ungueltiges UUID-Format -> Client-Fehler statt 500.
    if (/foreign key|violates foreign key|invalid input syntax for type uuid/i.test(message)) {
      return json(res, 400, { error: 'Ungültige oder nicht existierende task_id' });
    }
    console.error(JSON.stringify({ type: 'empfehlungen_error', message }));
    return json(res, 500, { error: 'Datenbankfehler', details: message });
  }
};
