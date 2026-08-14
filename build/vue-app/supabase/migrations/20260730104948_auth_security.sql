-- login_attempts: track failed login attempts for rate limiting
create table if not exists public.login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  ip_address text not null,
  attempted_at timestamptz not null default now(),
  success boolean not null default false
);
create index if not exists idx_login_attempts_email_time on public.login_attempts(email, attempted_at desc);
create index if not exists idx_login_attempts_ip_time on public.login_attempts(ip_address, attempted_at desc);

-- user_login_logs: record successful login events
create table if not exists public.user_login_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_address text,
  user_agent text,
  logged_in_at timestamptz not null default now()
);
create index if not exists idx_user_login_logs_user on public.user_login_logs(user_id, logged_in_at desc);

-- add is_admin to profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- function: check if an email/ip is rate limited (5 attempts in 15 minutes)
create or replace function public.fn_is_rate_limited(p_email text, p_ip text)
returns boolean
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.login_attempts
  where (email = p_email or ip_address = p_ip)
    and success = false
    and attempted_at > now() - interval '15 minutes';
  return v_count >= 5;
end;
$$;

-- function: record a login attempt
create or replace function public.fn_record_login_attempt(
  p_email text,
  p_ip text,
  p_success boolean
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.login_attempts (email, ip_address, success)
  values (p_email, p_ip, p_success);
end;
$$;

-- function: verify user is admin (used by RLS)
create or replace function public.fn_is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- function: get login logs for current user
create or replace function public.fn_get_my_login_logs()
returns table (
  id bigint,
  ip_address text,
  user_agent text,
  logged_in_at timestamptz
)
language sql
security definer
stable
as $$
  select id, ip_address, user_agent, logged_in_at
  from public.user_login_logs
  where user_id = auth.uid()
  order by logged_in_at desc
  limit 20;
$$;

-- RLS: enable row-level security on login_attempts
alter table public.login_attempts enable row level security;
alter table public.user_login_logs enable row level security;

-- RLS: only admins can read login_attempts
create policy "admins can read login_attempts"
  on public.login_attempts for select
  using (public.fn_is_admin());

-- RLS: users can read their own login logs
create policy "users can read own login_logs"
  on public.user_login_logs for select
  using (auth.uid() = user_id);

-- RLS: service_role can insert login logs
create policy "service can insert login_logs"
  on public.user_login_logs for insert
  with check (true);

-- RLS: service_role can insert login_attempts
create policy "service can insert login_attempts"
  on public.login_attempts for insert
  with check (true);
