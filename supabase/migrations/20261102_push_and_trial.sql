-- Appareils abonnés aux notifications push
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;

drop policy if exists "push_insert_own" on public.push_subscriptions;
create policy "push_insert_own" on public.push_subscriptions
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "push_update_own" on public.push_subscriptions;
create policy "push_update_own" on public.push_subscriptions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "push_select_own" on public.push_subscriptions;
create policy "push_select_own" on public.push_subscriptions
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "push_delete_own" on public.push_subscriptions;
create policy "push_delete_own" on public.push_subscriptions
  for delete to authenticated using (user_id = auth.uid());

grant select, insert, update, delete on public.push_subscriptions to authenticated;
grant all on public.push_subscriptions to service_role;

-- Offre de lancement : 1 jour de VIP offert à la création du profil (une seule fois par compte)
alter table public.profiles add column if not exists trial_used boolean not null default false;

create or replace function public.grant_welcome_trial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.trial_used, false) = false
     and coalesce(new.vip_active, false) = false
     and new.vip_expires_at is null then
    new.vip_active := true;
    new.vip_plan := 'trial';
    new.vip_expires_at := now() + interval '1 day';
    new.trial_used := true;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_grant_welcome_trial on public.profiles;
create trigger trg_grant_welcome_trial
  before insert on public.profiles
  for each row execute function public.grant_welcome_trial();
