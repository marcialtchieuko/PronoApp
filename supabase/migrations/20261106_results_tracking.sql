-- Suivi des résultats (déjà appliqué sur le projet Supabase Pronoapp le 2026-11-06)

alter table public.combo_matches
  add column if not exists result text not null default 'pending';
alter table public.combo_matches
  drop constraint if exists combo_matches_result_check;
alter table public.combo_matches
  add constraint combo_matches_result_check check (result in ('pending','won','lost','void'));

-- Le statut du combiné se met à jour tout seul quand ses picks sont réglés
create or replace function public.update_combo_status()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_combo uuid := coalesce(new.combo_id, old.combo_id);
  v_pending int; v_lost int; v_won int;
begin
  select count(*) filter (where result = 'pending'),
         count(*) filter (where result = 'lost'),
         count(*) filter (where result = 'won')
    into v_pending, v_lost, v_won
  from public.combo_matches where combo_id = v_combo;

  update public.combos set status = case
      when v_lost > 0 then 'lost'
      when v_pending > 0 then 'pending'
      when v_won > 0 then 'won'
      else 'void' end
  where id = v_combo;
  return null;
end;
$$;

drop trigger if exists trg_combo_matches_status on public.combo_matches;
create trigger trg_combo_matches_status
after insert or update of result or delete on public.combo_matches
for each row execute function public.update_combo_status();

-- Statistiques publiques (agrégats uniquement, aucun détail VIP exposé)
create or replace function public.track_record(p_days int default 30)
returns json
language sql
stable
security definer
set search_path to 'public'
as $$
  with since as (select now() - make_interval(days => greatest(p_days,1)) as t),
  free as (
    select count(*) filter (where result = 'won') w,
           count(*) filter (where result = 'lost') l
    from public.predictions, since where created_at >= since.t
  ),
  vip_picks as (
    select count(*) filter (where m.result = 'won') w,
           count(*) filter (where m.result = 'lost') l
    from public.combo_matches m join public.combos c on c.id = m.combo_id, since
    where c.created_at >= since.t
  ),
  vip_combos as (
    select count(*) filter (where status = 'won') w,
           count(*) filter (where status = 'lost') l
    from public.combos, since where created_at >= since.t
  )
  select json_build_object(
    'days', p_days,
    'free_picks',  json_build_object('won', free.w, 'lost', free.l,
                      'rate', case when free.w + free.l > 0 then round(100.0*free.w/(free.w+free.l),1) end),
    'vip_picks',   json_build_object('won', vip_picks.w, 'lost', vip_picks.l,
                      'rate', case when vip_picks.w + vip_picks.l > 0 then round(100.0*vip_picks.w/(vip_picks.w+vip_picks.l),1) end),
    'vip_combos',  json_build_object('won', vip_combos.w, 'lost', vip_combos.l,
                      'rate', case when vip_combos.w + vip_combos.l > 0 then round(100.0*vip_combos.w/(vip_combos.w+vip_combos.l),1) end)
  )
  from free, vip_picks, vip_combos;
$$;

grant execute on function public.track_record(int) to anon, authenticated;
