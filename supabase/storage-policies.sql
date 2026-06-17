-- =============================================================================
-- Clearview Square — Supabase Storage Policies
-- Phase 4A: Foundation
--
-- Apply AFTER schema.sql and rls-policies.sql.
-- Run in Supabase SQL editor.
--
-- Before running:
-- 1. Create the three buckets manually in the Supabase dashboard:
--    Storage → New bucket → name as below → Public bucket: ON
--    - store-assets
--    - promotion-assets
--    - centre-assets
--
-- 2. Confirm the is_active_admin() function exists (defined in rls-policies.sql).
--
-- Bucket naming: lowercase, hyphens only (Supabase requirement).
-- =============================================================================


-- =============================================================================
-- BUCKET: store-assets
-- Holds store logos and hero photos.
--
-- Folder convention:
--   store-assets/{store-slug}/logo/      e.g. store-assets/checkers/logo/logo.webp
--   store-assets/{store-slug}/photo/     e.g. store-assets/checkers/photo/hero.webp
--
-- Allowed MIME types: image/webp, image/jpeg, image/png
-- Maximum file size: 2 MB (enforced in admin UI upload component)
-- Disallowed:  application/pdf, image/svg+xml
--
-- NOTE: Two existing stores have PDF logo paths in the JSON data:
--   - man-cave-barber: assets/logos/MANCAVE LOGO.pdf
--   - london-petal:    assets/logos/london patel logo.pdf
-- These will render as broken images. Replacement PNG/WebP files must be
-- obtained before or during the storage migration in Phase 4F.
-- =============================================================================

-- Public: anyone can read files from store-assets
create policy "store_assets_public_read"
  on storage.objects
  for select
  using (bucket_id = 'store-assets');

-- Admin: active admins/editors can upload to store-assets
create policy "store_assets_admin_insert"
  on storage.objects
  for insert
  with check (
    bucket_id = 'store-assets'
    and is_active_admin()
  );

-- Admin: active admins/editors can update files in store-assets
create policy "store_assets_admin_update"
  on storage.objects
  for update
  using (
    bucket_id = 'store-assets'
    and is_active_admin()
  );

-- Admin: active admins/editors can delete files from store-assets
create policy "store_assets_admin_delete"
  on storage.objects
  for delete
  using (
    bucket_id = 'store-assets'
    and is_active_admin()
  );


-- =============================================================================
-- BUCKET: promotion-assets
-- Holds promotion and event banner images.
--
-- Folder convention:
--   promotion-assets/{promotion-slug}/   e.g. promotion-assets/festive-season-sale/banner.webp
--
-- Allowed MIME types: image/webp, image/jpeg, image/png
-- Maximum file size: 2 MB (enforced in admin UI upload component)
-- Disallowed: application/pdf, image/svg+xml
-- =============================================================================

create policy "promotion_assets_public_read"
  on storage.objects
  for select
  using (bucket_id = 'promotion-assets');

create policy "promotion_assets_admin_insert"
  on storage.objects
  for insert
  with check (
    bucket_id = 'promotion-assets'
    and is_active_admin()
  );

create policy "promotion_assets_admin_update"
  on storage.objects
  for update
  using (
    bucket_id = 'promotion-assets'
    and is_active_admin()
  );

create policy "promotion_assets_admin_delete"
  on storage.objects
  for delete
  using (
    bucket_id = 'promotion-assets'
    and is_active_admin()
  );


-- =============================================================================
-- BUCKET: centre-assets
-- Holds centre-wide images: hero banners, gallery, brand assets.
--
-- Folder convention:
--   centre-assets/hero/      e.g. centre-assets/hero/clearview-hero-01.webp
--   centre-assets/gallery/
--   centre-assets/brand/     e.g. centre-assets/brand/og-image.png
--
-- Allowed MIME types: image/webp, image/jpeg, image/png
-- Maximum file size: 4 MB (hero images may be larger)
-- Disallowed: application/pdf, image/svg+xml
-- =============================================================================

create policy "centre_assets_public_read"
  on storage.objects
  for select
  using (bucket_id = 'centre-assets');

create policy "centre_assets_admin_insert"
  on storage.objects
  for insert
  with check (
    bucket_id = 'centre-assets'
    and is_active_admin()
  );

create policy "centre_assets_admin_update"
  on storage.objects
  for update
  using (
    bucket_id = 'centre-assets'
    and is_active_admin()
  );

create policy "centre_assets_admin_delete"
  on storage.objects
  for delete
  using (
    bucket_id = 'centre-assets'
    and is_active_admin()
  );


-- =============================================================================
-- Public URL pattern (for reference, not SQL)
-- =============================================================================
-- After uploading a file, the public URL follows this pattern:
--
--   https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
--
-- Examples:
--   https://xyz.supabase.co/storage/v1/object/public/store-assets/checkers/logo/logo.webp
--   https://xyz.supabase.co/storage/v1/object/public/promotion-assets/festive-season-sale/banner.webp
--
-- This URL goes directly into the logo_url or image_url column on the store or
-- promotion record. The frontend renders it with a plain <img src={store.logo_url}>.
-- No base path resolution logic is needed (unlike the current assets/ path system).
-- =============================================================================
