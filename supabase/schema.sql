-- =============================================================================
-- Clearview Square — Supabase Database Schema
-- Phase 4A: Foundation
--
-- Apply this file in the Supabase SQL editor (Project → SQL Editor → New query).
-- Run once against a fresh project. Re-running on an existing project will fail
-- on "already exists" errors unless you drop tables first.
--
-- Order matters: profiles, stores, trading_hours, promotions, centre_settings.
-- Triggers at the bottom depend on all tables being present.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- profiles
-- Linked to Supabase auth.users. Created automatically by trigger below.
-- New profiles default to active = false; an existing admin must activate them.
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text        not null check (role in ('admin', 'editor')) default 'admin',
  active      boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table  profiles           is 'Admin user profiles linked to Supabase auth.users.';
comment on column profiles.active    is 'Must be set to true by an existing admin before the user can write data.';
comment on column profiles.role      is 'admin: full access. editor: create/update only (no delete or profile management).';


-- ---------------------------------------------------------------------------
-- stores
-- Using category text (not a foreign key) for Phase 4.
-- A separate store_categories table can be introduced later if needed.
-- ---------------------------------------------------------------------------
create table if not exists stores (
  id                uuid        primary key default gen_random_uuid(),
  slug              text        unique not null,
  name              text        not null,
  category          text        not null,
  short_description text,
  description       text,
  tags              text[]      not null default '{}',
  status            text        not null check (status in ('published', 'draft', 'hidden', 'opening_soon')) default 'draft',
  is_anchor         boolean     not null default false,
  is_featured       boolean     not null default false,
  is_visible        boolean     not null default true,
  unit_number       text,
  phone             text,
  email             text,
  website           text,
  logo_url          text,
  image_url         text,
  sort_order        integer     not null default 99,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table  stores             is 'Tenant/store records for Clearview Square shopping centre.';
comment on column stores.status      is 'published: live on public site. draft: hidden from public, visible in admin. hidden: internal record, never public. opening_soon: visible with badge.';
comment on column stores.is_visible  is 'Hard visibility switch. false means the record never reaches the public frontend regardless of status.';
comment on column stores.logo_url    is 'Supabase Storage public URL. Null renders the store name initial fallback.';
comment on column stores.image_url   is 'Supabase Storage public URL for the store hero photo.';
comment on column stores.tags        is 'Freeform string tags displayed as badges. e.g. {Anchor, Supermarket}';

create index if not exists stores_status_idx     on stores (status);
create index if not exists stores_slug_idx       on stores (slug);
create index if not exists stores_sort_order_idx on stores (sort_order);


-- ---------------------------------------------------------------------------
-- trading_hours
-- One row per store per day. Normalised from the flat tradingHours object in JSON.
-- open_time and close_time are intentionally nullable during Phase 4 migration.
-- The notes column carries the freeform string from the JSON (e.g. "08:00 - 20:00",
-- "Closed", "24 Hours", "Opening Soon", "N/A") until structured times are confirmed.
-- ---------------------------------------------------------------------------
create table if not exists trading_hours (
  id            uuid        primary key default gen_random_uuid(),
  store_id      uuid        not null references stores(id) on delete cascade,
  day_key       text        not null,
  display_label text        not null,
  open_time     time,
  close_time    time,
  is_closed     boolean     not null default false,
  notes         text,
  sort_order    integer     not null default 0,

  unique (store_id, day_key)
);

comment on table  trading_hours             is 'Trading hours per store per day. Normalised from JSON tradingHours object.';
comment on column trading_hours.day_key     is 'Machine key: monday, tuesday, wednesday, thursday, friday, saturday, sunday, publicHolidays.';
comment on column trading_hours.display_label is 'Human label shown in UI: Monday, Tuesday, ..., Public Holidays.';
comment on column trading_hours.open_time   is 'Structured open time (HH:MM). Nullable during migration; backfill when confirmed.';
comment on column trading_hours.close_time  is 'Structured close time (HH:MM). Nullable during migration; backfill when confirmed.';
comment on column trading_hours.notes       is 'Freeform display string migrated from JSON (e.g. "08:00 - 20:00", "24 Hours", "Closed"). Primary display value during Phase 4.';
comment on column trading_hours.sort_order  is '0=Monday through 7=Public Holidays.';

create index if not exists trading_hours_store_id_idx on trading_hours (store_id);


-- ---------------------------------------------------------------------------
-- promotions
-- type column is required: PromotionCard.jsx displays different badge colours
-- for 'Promotion' vs 'Event'. All existing JSON promotions have this field.
-- store_id is ON DELETE SET NULL so promotions survive store removal.
-- ---------------------------------------------------------------------------
create table if not exists promotions (
  id            uuid        primary key default gen_random_uuid(),
  store_id      uuid        references stores(id) on delete set null,
  slug          text        unique not null,
  type          text        not null check (type in ('Promotion', 'Event')) default 'Promotion',
  title         text        not null,
  description   text,
  image_url     text,
  start_date    date,
  end_date      date,
  status        text        not null check (status in ('published', 'draft', 'hidden')) default 'draft',
  is_featured   boolean     not null default false,
  highlight_tag text,
  cta_label     text,
  cta_href      text,
  sort_order    integer     not null default 99,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table  promotions          is 'Promotions and events for Clearview Square. Linked to stores via store_id.';
comment on column promotions.type     is 'Promotion: retail deal. Event: centre-wide or in-store event. Drives badge colour in PromotionCard.';
comment on column promotions.store_id is 'Optional store link. NULL = centre-wide promotion. ON DELETE SET NULL preserves promotions if a store is deleted.';
comment on column promotions.status   is 'published: live on public site. draft: admin-only. hidden: never public.';
comment on column promotions.cta_href is 'Hash-prefixed URL for HashRouter compatibility, e.g. #/store/checkers or #/about.';

create index if not exists promotions_status_idx     on promotions (status);
create index if not exists promotions_dates_idx      on promotions (start_date, end_date);
create index if not exists promotions_store_id_idx   on promotions (store_id);


-- ---------------------------------------------------------------------------
-- centre_settings
-- Key/value store for centre-level configuration (opening hours, contact
-- details, social links, etc.). Optional in Phase 4 but useful to have.
-- ---------------------------------------------------------------------------
create table if not exists centre_settings (
  id         uuid        primary key default gen_random_uuid(),
  key        text        unique not null,
  value      jsonb,
  updated_at timestamptz not null default now()
);

comment on table  centre_settings       is 'Centre-wide key/value configuration store. Accessible to public (read) and admins (write).';
comment on column centre_settings.key   is 'Unique setting identifier, e.g. centre_hours, contact_email, social_links.';
comment on column centre_settings.value is 'JSONB value; can be a string, number, array, or object depending on the setting.';


-- ---------------------------------------------------------------------------
-- updated_at trigger
-- Automatically updates updated_at on any row change for tables that have it.
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger stores_updated_at
  before update on stores
  for each row execute procedure set_updated_at();

create trigger promotions_updated_at
  before update on promotions
  for each row execute procedure set_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger centre_settings_updated_at
  before update on centre_settings
  for each row execute procedure set_updated_at();


-- ---------------------------------------------------------------------------
-- Auth trigger: create profile on new user sign-up
-- New profiles default to active = false. An existing admin must set
-- active = true in the profiles table before the new user can write data.
-- This prevents self-signup attacks on the admin panel.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, role, active)
  values (
    new.id,
    new.email,
    'admin',
    false
  );
  return new;
end;
$$;

-- Drop and recreate to avoid duplicate trigger errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
