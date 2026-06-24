# Datenbank

SQL-Schema für die persistenten Datenobjekte von oekoprofit-ki.

- **DB:** Postgres (Neon via Vercel Marketplace)
- **Entscheidung & Begründung:** siehe `memory/short_term.md` → „Persistenz-Entscheidung"
- **Bewusst nicht persistiert:** AI-Chatverlauf, Prompt-Historie, Fehlerlogs, Session, Cache
- **Benchmarks:** bleiben versionierte Seed-Daten in `benchmarks.js` (keine DB)

## Schema

| Tabelle      | Zweck                                              |
|--------------|----------------------------------------------------|
| `task`       | Aufgaben (`title, status, user_id, created_at`)    |
| `lernkarte`  | Lernkarten inkl. `content`                         |
| `produkt`    | Produkte                                           |
| `empfehlung` | generierte Handlungsempfehlung, FK → `task`        |

`user_id` ist eine **Referenz** (kein PII-Profil).

## Anwenden (nach Neon-Provisioning)

```bash
# DATABASE_URL stammt aus den per Marketplace injizierten Env-Vars
psql "$DATABASE_URL" -f db/0001_init.sql
```

Alternativ den Inhalt von `0001_init.sql` in den **Neon SQL Editor** einfügen.

## Provisioning (Schritt b — noch offen)

Neon wird über den Vercel Marketplace eingerichtet (`vercel integration add neon`
bzw. Vercel-Dashboard). Das injiziert `DATABASE_URL` o. ä. in das verknüpfte
Projekt; danach `vercel env pull .env.local` und obiges `psql`-Kommando.
Voraussetzung: installierte Vercel CLI (`npm i -g vercel`).
