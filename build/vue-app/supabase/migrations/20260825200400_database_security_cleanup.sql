create or replace function public.fn_is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and is_admin = true
  );
$$;

revoke all on function public.fn_is_admin() from public;
grant execute on function public.fn_is_admin() to authenticated, service_role;

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
set search_path = public
as $$
  select id, ip_address, user_agent, logged_in_at
  from public.user_login_logs
  where user_id = (select auth.uid())
  order by logged_in_at desc
  limit 20;
$$;

revoke all on function public.fn_get_my_login_logs() from public;
grant execute on function public.fn_get_my_login_logs() to authenticated, service_role;

create or replace function public.fn_is_rate_limited(p_email text, p_ip text)
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.login_attempts
  where (email = lower(trim(p_email)) or ip_address = p_ip)
    and success = false
    and attempted_at > now() - interval '15 minutes';
  return v_count >= 5;
end;
$$;

revoke all on function public.fn_is_rate_limited(text, text) from public;

revoke all on function public.fn_record_login_attempt(text, text, boolean) from public;
grant execute on function public.fn_record_login_attempt(text, text, boolean) to service_role;
alter function public.fn_record_login_attempt(text, text, boolean) set search_path = public;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, full_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    now(),
    now()
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to service_role;

drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
create policy "Admins can update all profiles"
on public.profiles for update
to authenticated
using ((select public.fn_is_admin()))
with check ((select public.fn_is_admin()));

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (select auth.uid()) = old.id and not (select public.fn_is_admin()) then
    if new.is_admin is distinct from old.is_admin
       or new.role is distinct from old.role
       or new.banned is distinct from old.banned then
      raise exception 'insufficient privilege to modify protected profile fields';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privilege_fields on public.profiles;
create trigger protect_profile_privilege_fields
before update on public.profiles
for each row execute function public.prevent_profile_privilege_escalation();

revoke all on function public.prevent_profile_privilege_escalation() from public;

drop policy if exists "Users can update their own comments" on public.comments;
create policy "Users can update their own comments"
on public.comments for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own comments" on public.comments;
create policy "Users can insert their own comments"
on public.comments for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
on public.comments for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own posts" on public.user_posts;
create policy "Users can update their own posts"
on public.user_posts for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

drop policy if exists "Users can insert their own posts" on public.user_posts;
create policy "Users can insert their own posts"
on public.user_posts for insert
to authenticated
with check ((select auth.uid()) = author_id);

drop policy if exists "Users can delete their own posts" on public.user_posts;
create policy "Users can delete their own posts"
on public.user_posts for delete
to authenticated
using ((select auth.uid()) = author_id);

drop policy if exists "Users can view their own drafts" on public.user_posts;
create policy "Users can view their own drafts"
on public.user_posts for select
to authenticated
using ((select auth.uid()) = author_id);

drop policy if exists "Users can update own cloud data" on public.cloud_data;
create policy "Users can update own cloud data"
on public.cloud_data for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own cloud data" on public.cloud_data;
create policy "Users can insert own cloud data"
on public.cloud_data for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own cloud data" on public.cloud_data;
create policy "Users can delete own cloud data"
on public.cloud_data for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view own cloud data" on public.cloud_data;
create policy "Users can view own cloud data"
on public.cloud_data for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can view their own favorites" on public.user_favorites;
drop policy if exists "Users can delete their own favorites" on public.user_favorites;
drop policy if exists "Users can insert their own favorites" on public.user_favorites;
drop policy if exists "Admins can view all favorites" on public.user_favorites;
drop policy if exists "Admins can delete all favorites" on public.user_favorites;
create policy "Users can view own favorites"
on public.user_favorites for select
to authenticated
using ((select auth.uid()) = user_id or (select public.fn_is_admin()));
create policy "Users can insert own favorites"
on public.user_favorites for insert
to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can delete own favorites"
on public.user_favorites for delete
to authenticated
using ((select auth.uid()) = user_id or (select public.fn_is_admin()));
create policy "Admins can view all favorites"
on public.user_favorites for select
to authenticated
using ((select public.fn_is_admin()));
create policy "Admins can delete all favorites"
on public.user_favorites for delete
to authenticated
using ((select public.fn_is_admin()));

drop policy if exists "Users can view their own test history" on public.user_test_history;
drop policy if exists "Users can insert their own test history" on public.user_test_history;
drop policy if exists "Users can delete their own test history" on public.user_test_history;
drop policy if exists "Admins can view all test history" on public.user_test_history;
drop policy if exists "Admins can delete all test history" on public.user_test_history;
create policy "Users can view own test history"
on public.user_test_history for select
to authenticated
using ((select auth.uid()) = user_id or (select public.fn_is_admin()));
create policy "Users can insert own test history"
on public.user_test_history for insert
to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can delete own test history"
on public.user_test_history for delete
to authenticated
using ((select auth.uid()) = user_id or (select public.fn_is_admin()));
create policy "Admins can view all test history"
on public.user_test_history for select
to authenticated
using ((select public.fn_is_admin()));
create policy "Admins can delete all test history"
on public.user_test_history for delete
to authenticated
using ((select public.fn_is_admin()));

DROP POLICY IF EXISTS "Admins can manage all post tags" ON public.post_tags;
CREATE POLICY "Admins can manage all post tags"
ON public.post_tags FOR ALL TO authenticated
USING ((SELECT public.fn_is_admin()))
WITH CHECK ((SELECT public.fn_is_admin()));
DROP POLICY IF EXISTS "Users can insert tags for their own posts" ON public.post_tags;
CREATE POLICY "Users can insert tags for their own posts"
ON public.post_tags FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_posts p WHERE p.id = post_tags.post_id AND p.author_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Users can delete tags from their own posts" ON public.post_tags;
CREATE POLICY "Users can delete tags from their own posts"
ON public.post_tags FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_posts p WHERE p.id = post_tags.post_id AND p.author_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Admins can manage all tags" ON public.tags;
CREATE POLICY "Admins can manage all tags"
ON public.tags FOR ALL TO authenticated
USING ((SELECT public.fn_is_admin()))
WITH CHECK ((SELECT public.fn_is_admin()));
DROP POLICY IF EXISTS "Authenticated users can create tags" ON public.tags;
CREATE POLICY "Authenticated users can create tags"
ON public.tags FOR INSERT TO authenticated
WITH CHECK (true);

create or replace function public.update_search_vector()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.content, '')), 'C');
  return new;
end;
$$;
revoke all on function public.update_search_vector() from public;

grant execute on function public.search_posts(text) to anon, authenticated, service_role;
alter function public.search_posts(text) set search_path = public;

create index if not exists idx_post_tags_post_id on public.post_tags(post_id);
create index if not exists idx_comments_post_slug_created_at on public.comments(post_slug, created_at desc);
create index if not exists idx_login_attempts_time on public.login_attempts(attempted_at desc);
