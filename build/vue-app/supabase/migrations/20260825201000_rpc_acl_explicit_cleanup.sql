revoke execute on function public.fn_is_admin() from anon;
revoke execute on function public.fn_get_my_login_logs() from anon;
revoke execute on function public.fn_is_rate_limited(text, text) from anon, authenticated;
revoke execute on function public.fn_record_login_attempt(text, text, boolean) from anon;
revoke execute on function public.handle_new_user() from anon, authenticated;
grant execute on function public.fn_record_login_attempt(text, text, boolean) to authenticated, service_role;
