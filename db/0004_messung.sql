-- 0004_messung.sql — Zeitreihen-Messungen je Standort (Verbrauchs-Monitoring)
-- Eine Messung = datierter Satz der normalisierten Kennzahlen für einen Standort.
-- FK auf standort mit Cascade: Löschen eines Standorts entfernt seine Messungen.

create table if not exists messung (
  id               uuid        primary key default gen_random_uuid(),
  standort_id      uuid        not null references standort(id) on delete cascade,
  datum            date        not null,
  strom            numeric,
  gas              numeric,
  wasser           numeric,
  abfall           numeric,
  reinigungsmittel numeric,
  user_id          text        not null,
  created_at       timestamptz not null default now()
);

create index if not exists idx_messung_standort_datum on messung(standort_id, datum);
