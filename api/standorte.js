// Vercel Serverless Function — Standorte/Werke für Multi-Standort-Benchmarking.
// Persistenz: Neon Postgres, Tabelle `standort` (siehe db/0003_standort.sql).
// GET    /api/standorte?user_id=   -> Liste
// POST   /api/standorte {name, branche, strom?, ...}  -> anlegen
// DELETE /api/standorte?id=         -> löschen

const { neon } = require('@neondatabase/serverless');

const BRANCHEN = ['gastro', 'baeckerei'];

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

function num(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function str(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t : null;
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
        ? await sql`select id, name, branche, strom, gas, wasser, abfall,
                           reinigungsmittel, score, user_id, created_at
                      from standort where user_id = ${userId}
                     order by created_at desc limit 200`
        : await sql`select id, name, branche, strom, gas, wasser, abfall,
                           reinigungsmittel, score, user_id, created_at
                      from standort order by created_at desc limit 200`;
      return json(res, 200, { count: rows.length, standorte: rows });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const name = str(body.name);
      if (!name) {
        return json(res, 400, { error: 'Feld "name" ist erforderlich' });
      }
      const branche = str(body.branche);
      if (!branche || !BRANCHEN.includes(branche)) {
        return json(res, 400, { error: `Ungültige branche. Erlaubt: ${BRANCHEN.join(', ')}` });
      }
      const userId = str(body.user_id) || 'demo';
      const rows = await sql`
        insert into standort (name, branche, strom, gas, wasser, abfall,
                              reinigungsmittel, score, user_id)
        values (${name}, ${branche}, ${num(body.strom)}, ${num(body.gas)},
                ${num(body.wasser)}, ${num(body.abfall)}, ${num(body.reinigungsmittel)},
                ${num(body.score)}, ${userId})
        returning id, name, branche, strom, gas, wasser, abfall,
                  reinigungsmittel, score, user_id, created_at`;
      return json(res, 201, { standort: rows[0] });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) {
        return json(res, 400, { error: 'Query-Parameter "id" ist erforderlich' });
      }
      const rows = await sql`delete from standort where id = ${id} returning id`;
      if (!rows.length) {
        return json(res, 404, { error: 'Standort nicht gefunden' });
      }
      return json(res, 200, { deleted: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/invalid input syntax for type uuid/i.test(message)) {
      return json(res, 400, { error: 'Ungültige id' });
    }
    console.error(JSON.stringify({ type: 'standorte_error', message }));
    return json(res, 500, { error: 'Datenbankfehler', details: message });
  }
};
