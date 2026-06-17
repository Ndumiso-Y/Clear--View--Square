-- =============================================================================
-- Clearview Square — Row Level Security Policies
-- Phase 4A: Foundation
--
-- Apply AFTER schema.sql. Run in Supabase SQL editor.
--
-- Security model:
--   - Supabase anon key is safe to expose in the frontend. RLS enforces access.
--   - Public users (anon role) can read published/visible content only.
--   - Active admin and editor profiles can write stores, trading hours, promotions.
--   - No anonymous writes are permitted on any table.
--   - Service role key is used only for seeding (never in frontend code).
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Enable RLS on all tables
-- ---------------------------------------------------------------------------
alter table profiles        enable row level security;
alter table stores          enable row level security;
alter table trading_hours   enable row level security;
alter table promotions      enable row level security;
alter table centre_settings enable row level security;


-- ---------------------------------------------------------------------------
-- Helper function: is_active_admin()
-- Returns true if the calling authenticated user has an active profile with
-- role 'admin' or 'editor'. Used in all write policies.
--
-- SECURITY DEFINER runs as the DB owner, not the calling user. This is
-- intentional so the function can query profiles without a recursive RLS loop.
-- Keep this function minimal.
-- ---------------------------------------------------------------------------
create or replace function is_active_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from profiles
    where id     = auth.uid()
      and role   in ('admin', 'editor')
      and active = true
  );
$$;

comment on function is_active_admin() is
  'Returns true if the current auth.uid() has an active admin or editor profile. Used in all RLS write policies.';


-- =============================================================================
-- STORES
-- =============================================================================

-- Public: read published and opening_soon stores that are visible
create policy "public_read_stores"
  on stores
  for select
  using (
    is_visible = true
    and status in ('published', 'opening_soon')
  );

-- Admin: full read (includes draft, hidden, is_visible = false)
create policy "admin_read_all_stores"
  on stores
  for select
  using (is_active_admin());

-- Admin: insert new stores
create policy "admin_insert_stores"
  on stores
  for insert
  with check (is_active_admin());

-- Admin: update stores
create policy "admin_update_stores"
  on stores
  for update
  using (is_active_admin())
  with check (is_active_admin());

-- Admin: delete stores (admin role only; editor role cannot delete)
-- Note: editors share is_active_admin() in Phase 4. A stricter editor-cannot-delete
-- policy can be added in Phase 4G when editor accounts are provisioned.
create policy "admin_delete_stores"
  on stores
  for delete
  using (is_active_admin());


-- =============================================================================
-- TRADING HOURS
-- =============================================================================

-- Public: read trading hours only for stores that are public-facing
create policy "public_read_trading_hours"
  on trading_hours
  for select
  using (
    exists (
      select 1
      from stores s
      where s.id         = store_id
        and s.is_visible = true
        and s.status     in ('published', 'opening_soon')
    )
  );

-- Admin: full read (includes hours for hidden/draft stores)
create policy "admin_read_all_trading_hours"
  on trading_hours
  for select
  using (is_active_admin());

-- Admin: insert trading hours
create policy "admin_insert_trading_hours"
  on trading_hours
  for insert
  with check (is_active_admin());

-- Admin: update trading hours
create policy "admin_update_trading_hours"
  on trading_hours
  for update
  using (is_active_admin())
  with check (is_active_admin());

-- Admin: delete trading hours
create policy "admin_delete_trading_hours"
  on trading_hours
  for delete
  using (is_active_admin());


-- =============================================================================
-- PROMOTIONS
-- =============================================================================

-- Public: read published promotions only
create policy "public_read_promotions"
  on promotions
  for select
  using (status = 'published');

-- Admin: full read (includes draft, hidden promotions)
create policy "admin_read_all_promotions"
  on promotions
  for select
  using (is_active_admin());

-- Admin: insert promotions
create policy "admin_insert_promotions"
  on promotions
  for insert
  with check (is_active_admin());

-- Admin: update promotions
create policy "admin_update_promotions"
  on promotions
  for update
  using (is_active_admin())
  with check (is_active_admin());

-- Admin: delete promotions
create policy "admin_delete_promotions"
  on promotions
  for delete
  using (is_active_admin());


-- =============================================================================
-- PROFILES
-- =============================================================================

-- Users can read their own profile only (to check role/active status)
create policy "own_profile_read"
  on profiles
  for select
  using (id = auth.uid());

-- Active admins can read all profiles (for user management)
create policy "admin_read_all_profiles"
  on profiles
  for select
  using (is_active_admin());

-- Active admins can update profiles (to activate users, change roles)
-- Editors cannot manage profiles.
create policy "admin_update_profiles"
  on profiles
  for update
  using (
    is_active_admin()
    and exists (
      select 1 from profiles p
      where p.id   = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    is_active_admin()
    and exists (
      select 1 from profiles p
      where p.id   = auth.uid()
        and p.role = 'admin'
    )
  );

-- No public insert on profiles (the handle_new_user trigger handles creation)
-- No public delete on profiles


-- =============================================================================
-- CENTRE SETTINGS
-- =============================================================================

-- Public: read all centre settings (non-sensitive configuration)
create policy "public_read_centre_settings"
  on centre_settings
  for select
  using (true);

-- Admin: insert, update, delete settings
create policy "admin_insert_centre_settings"
  on centre_settings
  for insert
  with check (is_active_admin());

create policy "admin_update_centre_settings"
  on centre_settings
  for update
  using (is_active_admin())
  with check (is_active_admin());

create policy "admin_delete_centre_settings"
  on centre_settings
  for delete
  using (is_active_admin());
