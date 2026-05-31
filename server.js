// Local dev server: serves static files + routes /api/* to serverless handlers.
// Usage: node server.js
// Reads .env from project root automatically.

const http = require('http');
const fs = require('fs');
const path = require('path');

// --- Load .env ---
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) process.env[key] = val;
  }
  console.log('[server] .env geladen');
} else {
  console.warn('[server] Keine .env gefunden — bitte aus .env.example erstellen');
}

// --- MIME types for static serving ---
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.pdf':  'application/pdf',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
};

// --- API handlers (loaded lazily so env is set first) ---
const API_HANDLERS = {
  '/api/document-reader': './api/document-reader.js',
  '/api/ki-consulting':   './api/ki-consulting.js',
  '/api/prompt-logs':     './api/prompt-logs.js',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const PORT = process.env.PORT || 3000;

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // --- Route API calls ---
  if (pathname in API_HANDLERS) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }
    try {
      const handler = require(API_HANDLERS[pathname]);
      const bodyStr = await readBody(req);
      req.body = bodyStr ? JSON.parse(bodyStr) : {};
      await handler(req, res);
    } catch (err) {
      console.error('[api]', pathname, err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- Serve static files ---
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
  console.log('[server] API-Routen: /api/document-reader, /api/ki-consulting, /api/prompt-logs');
});
