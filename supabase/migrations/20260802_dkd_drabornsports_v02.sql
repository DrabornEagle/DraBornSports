-- DraBornSports v0.2 future Supabase schema draft.
-- This migration is not connected to the Expo demo yet.

create extension if not exists pgcrypto;

create table if not exists public.dkd_sports_fixtures (
  dkd_fixture_id uuid primary key default gen_random_uuid(),
  dkd_provider_fixture_id text unique,
  dkd_sport text not null default 'football',
  dkd_competition text not null,
  dkd_kickoff_at timestamptz not null,
  dkd_home_team text not null,
  dkd_away_team text not null,
  dkd_venue text,
  dkd_city text,
  dkd_weather jsonb not null default '{}'::jsonb,
  dkd_status text not null default 'scheduled',
  dkd_source_updated_at timestamptz,
  dkd_created_at timestamptz not null default now(),
  dkd_updated_at timestamptz not null default now()
);

create table if not exists public.dkd_sports_team_snapshots (
  dkd_snapshot_id uuid primary key default gen_random_uuid(),
  dkd_fixture_id uuid not null references public.dkd_sports_fixtures(dkd_fixture_id) on delete cascade,
  dkd_side text not null check (dkd_side in ('home', 'away')),
  dkd_team_name text not null,
  dkd_form jsonb not null default '[]'::jsonb,
  dkd_rank integer,
  dkd_xg_for numeric(8,3),
  dkd_xg_against numeric(8,3),
  dkd_average_goals numeric(8,3),
  dkd_win_rate numeric(8,5),
  dkd_injury_count integer not null default 0,
  dkd_rest_days integer,
  dkd_payload jsonb not null default '{}'::jsonb,
  dkd_created_at timestamptz not null default now(),
  unique (dkd_fixture_id, dkd_side)
);

create table if not exists public.dkd_sports_h2h_results (
  dkd_h2h_id uuid primary key default gen_random_uuid(),
  dkd_fixture_id uuid not null references public.dkd_sports_fixtures(dkd_fixture_id) on delete cascade,
  dkd_played_at timestamptz,
  dkd_home_team text not null,
  dkd_away_team text not null,
  dkd_home_score integer,
  dkd_away_score integer,
  dkd_created_at timestamptz not null default now()
);

create table if not exists public.dkd_sports_odds_snapshots (
  dkd_odds_id uuid primary key default gen_random_uuid(),
  dkd_fixture_id uuid not null references public.dkd_sports_fixtures(dkd_fixture_id) on delete cascade,
  dkd_provider text not null,
  dkd_market text not null,
  dkd_selection text not null,
  dkd_decimal_odds numeric(10,4) not null,
  dkd_captured_at timestamptz not null default now()
);

create table if not exists public.dkd_sports_analysis_requests (
  dkd_request_id uuid primary key default gen_random_uuid(),
  dkd_user_id uuid references auth.users(id) on delete cascade,
  dkd_fixture_ids uuid[] not null,
  dkd_simulated_stake numeric(14,2) not null default 0,
  dkd_data_version text,
  dkd_created_at timestamptz not null default now()
);

create table if not exists public.dkd_sports_analysis_results (
  dkd_result_id uuid primary key default gen_random_uuid(),
  dkd_request_id uuid not null references public.dkd_sports_analysis_requests(dkd_request_id) on delete cascade,
  dkd_total_odds numeric(14,4),
  dkd_combined_probability numeric(8,5),
  dkd_data_quality numeric(8,5),
  dkd_theoretical_return numeric(14,2),
  dkd_risk_band text,
  dkd_report jsonb not null default '{}'::jsonb,
  dkd_disclaimer text not null default 'İstatistiksel tahmindir; sonuç veya kazanç garantisi değildir.',
  dkd_created_at timestamptz not null default now()
);

alter table public.dkd_sports_fixtures enable row level security;
alter table public.dkd_sports_team_snapshots enable row level security;
alter table public.dkd_sports_h2h_results enable row level security;
alter table public.dkd_sports_odds_snapshots enable row level security;
alter table public.dkd_sports_analysis_requests enable row level security;
alter table public.dkd_sports_analysis_results enable row level security;

drop policy if exists "dkd_public_read_fixtures" on public.dkd_sports_fixtures;
drop policy if exists "dkd_public_read_team_snapshots" on public.dkd_sports_team_snapshots;
drop policy if exists "dkd_public_read_h2h" on public.dkd_sports_h2h_results;
drop policy if exists "dkd_public_read_odds" on public.dkd_sports_odds_snapshots;
drop policy if exists "dkd_users_insert_own_analysis_requests" on public.dkd_sports_analysis_requests;
drop policy if exists "dkd_users_read_own_analysis_requests" on public.dkd_sports_analysis_requests;
drop policy if exists "dkd_users_read_own_analysis_results" on public.dkd_sports_analysis_results;

create policy "dkd_public_read_fixtures"
on public.dkd_sports_fixtures for select
using (true);

create policy "dkd_public_read_team_snapshots"
on public.dkd_sports_team_snapshots for select
using (true);

create policy "dkd_public_read_h2h"
on public.dkd_sports_h2h_results for select
using (true);

create policy "dkd_public_read_odds"
on public.dkd_sports_odds_snapshots for select
using (true);

create policy "dkd_users_insert_own_analysis_requests"
on public.dkd_sports_analysis_requests for insert
to authenticated
with check (auth.uid() = dkd_user_id);

create policy "dkd_users_read_own_analysis_requests"
on public.dkd_sports_analysis_requests for select
to authenticated
using (auth.uid() = dkd_user_id);

create policy "dkd_users_read_own_analysis_results"
on public.dkd_sports_analysis_results for select
to authenticated
using (
  exists (
    select 1
    from public.dkd_sports_analysis_requests dkd_request
    where dkd_request.dkd_request_id = dkd_sports_analysis_results.dkd_request_id
      and dkd_request.dkd_user_id = auth.uid()
  )
);

create index if not exists dkd_sports_fixtures_kickoff_idx
  on public.dkd_sports_fixtures(dkd_kickoff_at);

create index if not exists dkd_sports_odds_fixture_captured_idx
  on public.dkd_sports_odds_snapshots(dkd_fixture_id, dkd_captured_at desc);

create index if not exists dkd_sports_analysis_user_created_idx
  on public.dkd_sports_analysis_requests(dkd_user_id, dkd_created_at desc);
