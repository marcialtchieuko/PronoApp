-- Parrainage : le parrain gagne 3 jours de VIP quand un ami parrainé achète un abonnement (maximum 10 amis).

alter table public.profiles
  add column if not exists referral_code text,
  add column if not exists referred_by uuid references public.profiles(id) on delete set null,
  add column if not exists referral_rewarded boolean not null default false;

create or replace function public.gen_referral_code()
returns text
language sql
volatile
as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 10));
$$;

alter table public.profiles alter column referral_code set default public.gen_referral_code();
update public.profiles set referral_code = public.gen_referral_code() where referral_code is null;
create unique index if not exists profiles_referral_code_key on public.profiles (referral_code);

-- Le client ne peut ni choisir son code, ni modifier son parrain, ni marquer une récompense.
create or replace function public.profiles_protect_referral()
returns trigger
language plpgsql
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.referred_by := null;
      new.referral_rewarded := false;
      new.referral_code := public.gen_referral_code();
    else
      new.referral_code := old.referral_code;
      new.referred_by := old.referred_by;
      new.referral_rewarded := old.referral_rewarded;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protect_referral on public.profiles;
create trigger trg_profiles_protect_referral
  before insert or update on public.profiles
  for each row execute function public.profiles_protect_referral();

-- L'ami enregistre le code de son parrain (compte récent, une seule fois).
create or replace function public.apply_referral(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  me uuid := auth.uid();
  v_me record;
  v_ref uuid;
begin
  if me is null then return 'auth'; end if;
  select * into v_me from public.profiles where id = me;
  if not found then return 'no_profile'; end if;
  if v_me.referred_by is not null then return 'already'; end if;
  if v_me.created_at < now() - interval '3 days' then return 'too_late'; end if;
  if coalesce(v_me.vip_plan, '') not in ('', 'trial') then return 'too_late'; end if;
  select id into v_ref from public.profiles where referral_code = upper(trim(p_code));
  if v_ref is null then return 'invalid'; end if;
  if v_ref = me then return 'self'; end if;
  update public.profiles set referred_by = v_ref where id = me;
  return 'ok';
end;
$$;
revoke all on function public.apply_referral(text) from public;
grant execute on function public.apply_referral(text) to authenticated;

-- Statistiques affichées au parrain.
create or replace function public.referral_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'joined', count(*),
    'paid', count(*) filter (where referral_rewarded),
    'cap', 10
  )
  from public.profiles
  where referred_by = auth.uid();
$$;
revoke all on function public.referral_stats() from public;
grant execute on function public.referral_stats() to authenticated;

-- Récompense : quand l'ami paie, le parrain gagne 3 jours de VIP (maximum 10 amis récompensés).
create or replace function public.profiles_referral_reward()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  if pg_trigger_depth() > 1 then return null; end if;
  if new.referred_by is null or new.referral_rewarded then return null; end if;

  update public.profiles set referral_rewarded = true where id = new.id;

  select count(*) into v_count
  from public.profiles
  where referred_by = new.referred_by and referral_rewarded and id <> new.id;

  if v_count < 10 then
    update public.profiles
    set vip_active = true,
        vip_plan = case when vip_plan is null or vip_plan = 'trial' then 'referral' else vip_plan end,
        vip_expires_at = greatest(coalesce(vip_expires_at, now()), now()) + interval '3 days'
    where id = new.referred_by;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_profiles_referral_reward on public.profiles;
create trigger trg_profiles_referral_reward
  after update of vip_plan, vip_expires_at, vip_active on public.profiles
  for each row
  when (
    new.vip_active
    and new.vip_plan is not null
    and new.vip_plan not in ('trial', 'referral')
    and new.vip_expires_at is distinct from old.vip_expires_at
    and new.vip_expires_at > now()
  )
  execute function public.profiles_referral_reward();
