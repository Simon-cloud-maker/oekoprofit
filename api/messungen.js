// Vercel Serverless Function — Zeitreihen-Messungen je Standort (Verbrauchs-Monitoring).
// Persistenz: Neon Postgres, Tabelle `messung` (FK -> standort, siehe db/0004_messung.sql).
// GET    /api/messungen?standort_id=  -> Messungen (datum aufsteigend)
// POST   /api/messungen {standort_id, datum, strom?, ...}  -> anlegen
// DELETE /api/messungen?id=            -> löschen

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
// "JJJJ-MM" -> "JJJJ-MM-01"; volles Datum bleibt; sonst null.
function normDatum(v) {
  const s = str(v);
  if (!s) return null;
  if (/^\d{4}-\d{2}$/.test(s)) return s + '-01';
  return s;
}

module.exports = async function handler(req, res) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return json(res, 503, { error: 'DATABASE_URL nicht konfiguriert' });
  }
  const sql = neon(url);

  try {
    if (req.method === 'GET') {
      const standortId = req.query?.standort_id;
      const rows = standortId
        ? await sql`select id, standort_id, datum, strom, gas, wasser, abfall,
                           reinigungsmittel, user_id, created_at
                      from messung where standort_id = ${standortId}
                     order by datum asc limit 500`
        : await sql`select id, standort_id, datum, strom, gas, wasser, abfall,
                           reinigungsmittel, user_id, created_at
                      from messung order by datum asc limit 500`;
      return json(res, 200, { count: rows.length, messungen: rows });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const standortId = str(body.standort_id);
      if (!standortId) {
        return json(res, 400, { error: 'Feld "standort_id" ist erforderlich' });
      }
      const datum = normDatum(body.datum);
      if (!datum) {
        return json(res, 400, { error: 'Feld "datum" ist erforderlich' });
      }
      const userId = str(body.user_id) || 'demo';
      const rows = await sql`
        insert into messung (standort_id, datum, strom, gas, wasser, abfall,
                             reinigungsmittel, user_id)
        values (${standortId}, ${datum}, ${num(body.strom)}, ${num(body.gas)},
                ${num(body.wasser)}, ${num(body.abfall)}, ${num(body.reinigungsmittel)},
                ${userId})
        returning id, standort_id, datum, strom, gas, wasser, abfall,
                  reinigungsmittel, user_id, created_at`;
      return json(res, 201, { messung: rows[0] });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id;
      if (!id) {
        return json(res, 400, { error: 'Query-Parameter "id" ist erforderlich' });
      }
      const rows = await sql`delete from messung where id = ${id} returning id`;
      if (!rows.length) {
        return json(res, 404, { error: 'Messung nicht gefunden' });
      }
      return json(res, 200, { deleted: true });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/foreign key|violates foreign key|invalid input syntax for type uuid|invalid input syntax for type date/i.test(message)) {
      return json(res, 400, { error: 'Ungültige standort_id oder datum' });
    }
    console.error(JSON.stringify({ type: 'messungen_error', message }));
    return json(res, 500, { error: 'Datenbankfehler', details: message });
  }
};
