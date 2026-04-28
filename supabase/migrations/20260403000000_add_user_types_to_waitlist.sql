-- create the user type enum
create type public.user_type_enum as enum ('job_seeker', 'founder', 'investor');

-- add a nullable array column for user types
alter table public.waitlist
  add column user_types user_type_enum[];
