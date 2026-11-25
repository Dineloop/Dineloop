-- DineLoop schema v1. Safe to run more than once.
create table if not exists app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table app_state enable row level security;

drop policy if exists "staff read" on app_state;
drop policy if exists "staff insert" on app_state;
drop policy if exists "staff update" on app_state;
create policy "staff read"   on app_state for select to authenticated using (true);
create policy "staff insert" on app_state for insert to authenticated with check (true);
create policy "staff update" on app_state for update to authenticated using (true);

-- live sync between devices
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and tablename = 'app_state') then
    alter publication supabase_realtime add table app_state;
  end if;
end $$;
-- Later feature batches will ship as 02_*.sql, 03_*.sql ... run each new file once.
