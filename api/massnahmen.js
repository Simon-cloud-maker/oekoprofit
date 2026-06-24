// Vercel Serverless Function — Effizienz-Maßnahmen mit ROI/Status-Pipeline.
// Persistenz: Neon Postgres, Tabelle `massnahme` (siehe db/0002_massnahme.sql).
// GET  /api/massnahmen?user_id=        -> Liste
// POST /api/massnahmen {title, ...}     -> anlegen (Status default 'idee')
// PATCH /api/massnahmen {id, ...}       -> Felder ändern (insb. status)

const { neon } = require('@neondatabase/serverless');

const STATUS = ['idee', 'geplant', 'in_umsetzung', 'umgesetzt', 'verifiziert'];
const PATCH_FIELDS = ['title', 'ressource', 'einsparung_eur', 'invest_eur', 'status', 'verantwortlich', 'termin', 'standort'];

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

// Leere/ungültige Zahl -> null, sonst Number.
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
        ? await sql`select id, title, ressource, einsparung_eur, invest_eur, status,
                           verantwortlich, termin, standort, user_id, created_at
                      from massnahme where user_id = ${userId}
                     order by created_at desc limit 200`
        : await sql`select id, title, ressource, einsparung_eur, invest_eur, status,
                           verantwortlich, termin, standort, user_id, created_at
                      from massnahme order by created_at desc limit 200`;
      return json(res, 200, { count: rows.length, massnahmen: rows });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const title = str(body.title);
      if (!title) {
        return json(res, 400, { error: 'Feld "title" ist erforderlich' });
      }
      const status = str(body.status) || 'idee';
      if (!STATUS.includes(status)) {
        return json(res, 400, { error: `Ungültiger status. Erlaubt: ${STATUS.join(', ')}` });
      }
      const userId = str(body.user_id) || 'demo';
      const rows = await sql`
        insert into massnahme (title, ressource, einsparung_eur, invest_eur, status,
                               verantwortlich, termin, standort, user_id)
        values (${title}, ${str(body.ressource)}, ${num(body.einsparung_eur)},
                ${num(body.invest_eur)}, ${status}, ${str(body.verantwortlich)},
                ${str(body.termin)}, ${str(body.standort)}, ${userId})
        returning id, title, ressource, einsparung_eur, invest_eur, status,
                  verantwortlich, termin, standort, user_id, created_at`;
      return json(res, 201, { massnahme: rows[0] });
    }

    if (req.method === 'PATCH') {
      const body = await readJsonBody(req);
      const id = str(body.id);
      if (!id) {
        return json(res, 400, { error: 'Feld "id" ist erforderlich' });
      }
      if ('status' in body && !STATUS.includes(str(body.status))) {
        return json(res, 400, { error: `Ungültiger status. Erlaubt: ${STATUS.join(', ')}` });
      }
      const sets = [];
      const vals = [];
      let i = 1;
      for (const f of PATCH_FIELDS) {
        if (f in body) {
          const v = (f === 'einsparung_eur' || f === 'invest_eur') ? num(body[f]) : str(body[f]);
          sets.push(`${f} = $${i++}`);
          vals.push(v);
        }
      }
      if (!sets.length) {
        return json(res, 400, { error: 'Keine aktualisierbaren Felder übergeben' });
      }
      vals.push(id);
      const q = `update massnahme set ${sets.join(', ')} where id = $${i}
                 returning id, title, ressource, einsparung_eur, invest_eur, status,
                           verantwortlich, termin, standort, user_id, created_at`;
      const rows = await sql.query(q, vals);
      if (!rows.length) {
        return json(res, 404, { error: 'Maßnahme nicht gefunden' });
      }
      return json(res, 200, { massnahme: rows[0] });
    }

    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/invalid input syntax for type uuid/i.test(message)) {
      return json(res, 400, { error: 'Ungültige id' });
    }
    console.error(JSON.stringify({ type: 'massnahmen_error', message }));
    return json(res, 500, { error: 'Datenbankfehler', details: message });
  }
};
