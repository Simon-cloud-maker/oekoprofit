-- 0001_init.sql — Initiales Schema fuer oekoprofit-ki
-- Ziel: Neon Postgres (Vercel Marketplace)
-- Anwenden: Neon SQL Editor einfuegen ODER  psql "$DATABASE_URL" -f db/0001_init.sql
--
-- Entscheidung (siehe memory/short_term.md): SQL/Postgres, kleine tabellarische
-- Datensaetze, Konsistenz wichtig. user_id ist eine Referenz (keine PII).
-- Bewusst NICHT persistiert: AI-Chatverlauf, Prompt-Historie, Logs, Session, Cache.
-- Benchmarks bleiben versionierte Seed-Daten in benchmarks.js (keine DB).

create extension if not exists "pgcrypto"; -- liefert gen_random_uuid()

create table if not exists task (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  status      text        not null default 'open',
  user_id     text        not null,
  created_at  timestamptz not null default now()
);

create table if not exists lernkarte (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  status      text        not null default 'open',
  user_id     text        not null,
  content     text,
  created_at  timestamptz not null default now()
);

create table if not exists produkt (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  status      text        not null default 'active',
  user_id     text        not null,
  created_at  timestamptz not null default now()
);

-- Handlungsempfehlung, einem Task zugeordnet (generiertes Ergebnis, nicht das Template).
create table if not exists empfehlung (
  id          uuid        primary key default gen_random_uuid(),
  task_id     uuid        not null references task(id) on delete cascade,
  text        text        not null,
  created_at  timestamptz not null default now()
);

-- Indizes fuer die haeufigsten Zugriffe (pro Nutzer / pro Task).
create index if not exists idx_task_user      on task(user_id);
create index if not exists idx_lernkarte_user on lernkarte(user_id);
create index if not exists idx_produkt_user   on produkt(user_id);
create index if not exists idx_empfehlung_task on empfehlung(task_id);
