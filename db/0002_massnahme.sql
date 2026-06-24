-- 0002_massnahme.sql — Effizienz-Maßnahmen mit ROI
-- Erster Baustein der Industrie-Neuausrichtung (siehe
-- docs/superpowers/specs/2026-06-24-massnahmen-management-design.md).
-- Amortisation = invest_eur / einsparung_eur wird zur Laufzeit berechnet (nicht gespeichert).
-- Status-Pipeline: idee -> geplant -> in_umsetzung -> umgesetzt -> verifiziert.

create table if not exists massnahme (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  ressource      text,
  einsparung_eur numeric,
  invest_eur     numeric,
  status         text        not null default 'idee',
  verantwortlich text,
  termin         date,
  standort       text,
  user_id        text        not null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_massnahme_user on massnahme(user_id);
