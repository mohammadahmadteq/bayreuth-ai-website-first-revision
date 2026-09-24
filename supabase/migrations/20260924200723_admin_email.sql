create schema if not exists private;

create function private.sync_site_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'bayreuth.ai@gmail.com' and new.email_confirmed_at is not null then
    insert into public.admin_users (user_id) values (new.id) on conflict do nothing;
  else
    delete from public.admin_users where user_id = new.id;
  end if;
  return new;
end;
$$;

create trigger sync_site_admin_after_auth_change
after insert or update of email, email_confirmed_at on auth.users
for each row execute function private.sync_site_admin();

insert into public.admin_users (user_id)
select id from auth.users
where lower(email) = 'bayreuth.ai@gmail.com' and email_confirmed_at is not null
on conflict do nothing;
