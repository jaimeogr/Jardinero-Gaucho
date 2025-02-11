-- 1) accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id    uuid references auth.accounts
   on delete cascade not null PRIMARY KEY,
  full_name text,
  email      text NOT NULL,
  avatar_url text,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
  );
-- 2) Workgroups
-- Wokgroups must not have on delete cascade to avoid data loss when WG should be transferred instead of deleted
CREATE TABLE IF NOT EXISTS public.workgroups (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
);
-- 3) Enum for account roles
CREATE TYPE account_role AS ENUM (
  'PrimaryOwner',
  'Owner',
  'Manager',
  'Member'
);
-- 4) account_workgroups
--     UNIQUE (account_id, workgroup_id).
CREATE TABLE IF NOT EXISTS public.account_workgroups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id                    uuid NOT NULL REFERENCES public.accounts
   (id)
    ON DELETE CASCADE,
  workgroup_id               uuid NOT NULL REFERENCES public.workgroups (id)
    ON DELETE CASCADE,
  role                       account_role NOT NULL,
  access_to_all_lots         boolean NOT NULL DEFAULT false,
  has_accepted_presence      TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now(),
  UNIQUE (account_id, workgroup_id)
);
-- 5) Neighborhoods
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workgroup_id     uuid NOT NULL REFERENCES public.workgroups (id)
    ON DELETE CASCADE,
  label text NOT NULL,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
);
-- 6) Zones
CREATE TABLE IF NOT EXISTS public.zones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id  uuid NOT NULL REFERENCES public.neighborhoods (id)
    ON DELETE CASCADE,
  label       text NOT NULL,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
);
-- 7) Lots
CREATE TABLE IF NOT EXISTS public.lots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id           uuid NOT NULL REFERENCES public.zones (id)
    ON DELETE CASCADE,
  label         text NOT NULL,
  last_mowing_date  timestamp with time zone,
  extra_notes       text,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
);
-- 8) task_type enum
CREATE TYPE task_type AS ENUM (
  'Garden',
  'Pool',
  'Other'
);
-- 9) Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id       uuid NOT NULL REFERENCES public.lots (id)
    ON DELETE CASCADE,
  account_id      uuid NOT NULL REFERENCES public.accounts
   (id)
    ON DELETE CASCADE,
  type    task_type NOT NULL,
  name    text,
  date         timestamp with time zone NOT NULL DEFAULT now(),
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
);
-- 10) task_interactions
CREATE TABLE IF NOT EXISTS public.task_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             uuid NOT NULL REFERENCES public.tasks (id) ON DELETE CASCADE,
  interaction_by      uuid NOT NULL REFERENCES public.accounts
   (id) ON DELETE CASCADE,
  interacted_at       timestamptz NOT NULL DEFAULT now(),
  completed           boolean NOT NULL,
  comments text,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now()
  -- The lack of deleted_at ensures a permanent audit log
);
-- 11) The Neighborhood assignments for an account in a certain workgroup
CREATE TABLE IF NOT EXISTS public.neighborhood_assignments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_workgroup_id uuid NOT NULL REFERENCES public.account_workgroups (id)
    ON DELETE CASCADE,
  neighborhood_id   uuid NOT NULL REFERENCES public.neighborhoods (id)
    ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now(),
  UNIQUE (account_workgroup_id, neighborhood_id)
);
-- 12) The Zone assignments for an account in a certain workgroup
CREATE TABLE IF NOT EXISTS public.zone_assignments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_workgroup_id uuid NOT NULL REFERENCES public.account_workgroups (id)
    ON DELETE CASCADE,
  zone_id   uuid NOT NULL REFERENCES public.zones (id)
    ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL  DEFAULT now(),
  updated_at TIMESTAMP NOT NULL  DEFAULT now(),
  UNIQUE (account_workgroup_id, zone_id)
);






-- Add policy so that accounts can view teammates, assigned workgroups and tasks.


/*
TRIGGERS
*/



-- Function to Sync Auth with accounts Database
CREATE OR REPLACE FUNCTION public.sync_auth_to_accounts()
RETURNS trigger
set search_path = ''
AS $$
DECLARE
  existing_account public.accounts
  %ROWTYPE;
BEGIN
  -- Try to fetch an existing record from public.accounts

  SELECT * INTO existing_account FROM public.accounts
   WHERE id = NEW.id;

  IF FOUND THEN
    -- For an existing account, update only if at least one key field has changed.
    IF existing_account.email <> NEW.email 
       OR existing_account.full_name <> NEW.raw_user_meta_data->>'full_name'
       OR existing_account.avatar_url <> NEW.raw_user_meta_data->>'avatar_url'
    THEN
      UPDATE public.accounts

  
      SET 
          email      = NEW.email,
          full_name  = NEW.raw_user_meta_data->>'full_name',
          avatar_url = NEW.raw_user_meta_data->>'avatar_url',
          updated_at = now()
      WHERE id = NEW.id;
    END IF;
  ELSE
    -- If no existing record is found, insert a new one.
    INSERT INTO public.accounts
    
 (
      id, email, full_name, avatar_url, created_at, updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url',
      now(),  -- created_at
      now()   -- updated_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



CREATE TRIGGER sync_auth_accounts
  AFTER INSERT OR UPDATE ON auth.accounts

  FOR EACH ROW EXECUTE PROCEDURE public.sync_auth_to_accounts
  ();



CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- For table public.accounts
CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.workgroups
CREATE TRIGGER update_workgroups_updated_at
BEFORE UPDATE ON public.workgroups
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.account_workgroups
CREATE TRIGGER update_account_workgroups_updated_at
BEFORE UPDATE ON public.account_workgroups
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.neighborhoods
CREATE TRIGGER update_neighborhoods_updated_at
BEFORE UPDATE ON public.neighborhoods
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.zones
CREATE TRIGGER update_zones_updated_at
BEFORE UPDATE ON public.zones
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.lots
CREATE TRIGGER update_lots_updated_at
BEFORE UPDATE ON public.lots
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.tasks
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.task_interactions
CREATE TRIGGER update_task_interactions_updated_at
BEFORE UPDATE ON public.task_interactions
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.neighborhood_assignments
CREATE TRIGGER update_neighborhood_assignments_updated_at
BEFORE UPDATE ON public.neighborhood_assignments
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- For table public.zone_assignments
CREATE TRIGGER update_zone_assignments_updated_at
BEFORE UPDATE ON public.zone_assignments
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();


/*
*
*
*
POLICIES
*
*
*
*/

alter table accounts
  enable row level security;


create policy "accounts can insert their own account." on accounts
  for insert with check ((select auth.uid()) = id);


create policy "accounts can update own account." on accounts
  for update using ((select auth.uid()) = id);


-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');


CREATE OR REPLACE FUNCTION public.has_team_access(
  _account_id uuid,
  _workgroup_id uuid
)
RETURNS boolean
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.account_workgroups aw
    WHERE aw.account_id = _account_id
      AND aw.workgroup_id = _workgroup_id
      AND aw.role IN ('PrimaryOwner', 'Owner', 'Manager')
  );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE POLICY "Allowed team view" ON public.account_workgroups
  FOR SELECT
  USING (
    public.has_team_access(auth.uid(), workgroup_id)
  );



/*
*
*
*
MORE
*
*
*/


-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

