-- 0003_standort.sql — Standorte/Werke für Multi-Standort-Benchmarking
-- Speichert die normalisierten Kennzahlen aus getVals() + Branche + Gesamt-Score.
-- Vergleich untereinander und gegen Branchen-Median im Tab "Standorte".

create table if not exists standort (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  branche          text        not null,
  strom            numeric,
  gas              numeric,
  wasser           numeric,
  abfall           numeric,
  reinigungsmittel numeric,
  score            numeric,
  user_id          text        not null,
  created_at       timestamptz not null default now()
);

create index if not exists idx_standort_user on standort(user_id);
