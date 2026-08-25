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
    where id = auth.uid()
      and is_admin = true
  );
$$;

revoke all on function public.fn_is_admin() from public;
grant execute on function public.fn_is_admin() to anon, authenticated;

create policy "Admins can update all profiles"
on public.profiles for update
using (public.fn_is_admin())
with check (public.fn_is_admin());

create policy "Admins can delete all profiles"
on public.profiles for delete
using (public.fn_is_admin());

create policy "Admins can view all posts"
on public.user_posts for select
using (public.fn_is_admin());

create policy "Admins can update all posts"
on public.user_posts for update
using (public.fn_is_admin())
with check (public.fn_is_admin());

create policy "Admins can delete all posts"
on public.user_posts for delete
using (public.fn_is_admin());

create policy "Admins can update all comments"
on public.comments for update
using (public.fn_is_admin())
with check (public.fn_is_admin());

create policy "Admins can delete all comments"
on public.comments for delete
using (public.fn_is_admin());

alter table public.comments
  add constraint comments_content_length
  check (char_length(content) between 1 and 500)
  not valid;

alter table public.user_posts
  add constraint user_posts_title_length
  check (char_length(title) between 1 and 100)
  not valid;

alter table public.user_posts
  add constraint user_posts_slug_format
  check (slug ~ '^[a-z0-9-]+$' and char_length(slug) between 1 and 160)
  not valid;

alter table public.user_posts
  add constraint user_posts_excerpt_length
  check (excerpt is null or char_length(excerpt) <= 300)
  not valid;

alter table public.user_posts
  add constraint user_posts_category_length
  check (category is null or char_length(category) <= 50)
  not valid;

alter table storage.objects enable row level security;

drop policy if exists "Blog images are publicly accessible" on storage.objects;
drop policy if exists "Admins can manage all blog images" on storage.objects;
drop policy if exists "Users can upload blog images" on storage.objects;
drop policy if exists "Users can update their own blog images" on storage.objects;
drop policy if exists "Users can delete their own blog images" on storage.objects;

create policy "Blog images are publicly accessible"
on storage.objects for select
using (bucket_id = 'blog-images');

create policy "Admins can manage all blog images"
on storage.objects for all
using (bucket_id = 'blog-images' and public.fn_is_admin())
with check (bucket_id = 'blog-images' and public.fn_is_admin());

create policy "Users can upload own blog images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'blog-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own blog images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'blog-images'
  and owner = auth.uid()
)
with check (
  bucket_id = 'blog-images'
  and owner = auth.uid()
);

create policy "Users can delete own blog images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'blog-images'
  and owner = auth.uid()
);
