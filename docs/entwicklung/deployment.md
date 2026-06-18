# Deployment (Vercel)

**Quellen:** `README.md`, `.vercel/project.json` (falls vorhanden), `api/`

## Live-URL

Laut `README.md`: **https://oekoprofit-ki.vercel.app**

Projektname laut `.vercel/project.json` (lokal verlinkt): `oekoprofit-ki`

## Ablauf

1. Repository mit Vercel verbinden (README: Push auf `main` deployt automatisch)
2. Environment Variables setzen (siehe [Umgebungsvariablen](umgebungsvariablen.md))
3. Nach Env-Änderungen: **Redeploy**

Manuelles Deploy (README / Vercel CLI):

```bash
npx vercel deploy --prod
```

## Serverless Functions

Dateien unter `api/` werden als Vercel Serverless Functions deployed:

| Datei | Route (konventionell) |
|-------|------------------------|
| `api/ki-consulting.js` | `/api/ki-consulting` |
| `api/document-reader.js` | `/api/document-reader` |
| `api/config.js` | `/api/config` |
| `api/prompt-logs.js` | `/api/prompt-logs` |

## Health-Check für API-Keys

```http
GET https://oekoprofit-ki.vercel.app/api/config
```

Erwartete Felder (`api/config.js`):

```json
{
  "hasGeminiKey": true,
  "hasOpenrouterKey": true
}
```

Wenn `hasGeminiKey: false` trotz gesetztem Key in Vercel:

- Variablenname muss exakt **`GEMINI_API_KEY`** sein (README)
- Environment **Production** aktivieren
- Redeploy auslösen

## MkDocs auf GitHub Pages

Workflow: `.github/workflows/mkdocs.yml`

- Trigger: Push auf `main` bei Änderungen unter `docs/`, `mkdocs.yml`, `requirements-docs.txt`
- Build: `mkdocs build` → Artifact `site/`
- Deploy: GitHub Pages

**URL (laut `mkdocs.yml`):** https://simon-cloud-maker.github.io/oekoprofit/

Einmalig im GitHub-Repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**

## MkDocs lokal
