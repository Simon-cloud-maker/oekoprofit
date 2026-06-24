// Spielt db/0001_init.sql in die verbundene Neon-Datenbank ein.
// Nutzung:  node --env-file=.env.local scripts/db-migrate.js
//
// Liest DATABASE_URL aus der Umgebung (per --env-file aus .env.local),
// teilt die SQL-Datei in einzelne Statements und fuehrt sie nacheinander aus.

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('FEHLER: DATABASE_URL nicht gesetzt. Aufruf mit: node --env-file=.env.local scripts/db-migrate.js');
  process.exit(1);
}

const sqlFile = path.join(__dirname, '..', 'db', '0001_init.sql');
const raw = fs.readFileSync(sqlFile, 'utf8');

// Kommentarzeilen entfernen, dann an ';' in Statements aufteilen.
const statements = raw
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(url);

(async () => {
  for (const stmt of statements) {
    await sql.query(stmt);
    console.log('OK  ', stmt.split('\n')[0].slice(0, 60));
  }

  const rows = await sql.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
  );
  console.log('\nTabellen in der DB:', rows.map((r) => r.table_name).join(', '));
})().catch((err) => {
  console.error('FEHLER beim Einspielen:', err.message);
  process.exit(1);
});
