// Seed script: inserts/upserts store, trading_hours, and promotion data from
// the JSON source files into Supabase.
//
// Prerequisites:
//   - schema.sql and rls-policies.sql applied to Supabase project
//   - .env contains VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
//   - npm run validate:data passes
//
// Usage:
//   npm run seed:supabase
//
// The service role key is used here to bypass RLS during seeding.
// It must never be referenced in src/ files.

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// ---------------------------------------------------------------------------
// Config validation
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('ERROR: VITE_SUPABASE_URL is not set in .env')
  process.exit(1)
}
if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
})

// ---------------------------------------------------------------------------
// Day ordering for trading_hours rows
// ---------------------------------------------------------------------------
const DAY_SORT_ORDER = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3,
  friday: 4, saturday: 5, sunday: 6, publicHolidays: 7,
}

const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
  sunday: 'Sunday', publicHolidays: 'Public Holidays',
}

// ---------------------------------------------------------------------------
// Load JSON source files
// ---------------------------------------------------------------------------
function loadJson(relPath) {
  const absPath = path.resolve(relPath)
  if (!fs.existsSync(absPath)) {
    console.error(`ERROR: File not found: ${absPath}`)
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(absPath, 'utf8'))
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seed() {
  console.log('=== Clearview Square — Supabase Seed ===\n')

  const stores = loadJson('public/data/stores.json')
  const promotions = loadJson('public/data/promotions.json')
  console.log(`Loaded ${stores.length} stores and ${promotions.length} promotions from JSON.\n`)

  // -------------------------------------------------------------------------
  // 1. Upsert stores
  //    logo_url and image_url are omitted (null) — image migration is Phase 4F.
  //    Existing rows with the same slug are updated in place.
  // -------------------------------------------------------------------------
  console.log('Upserting stores...')
  const storeRows = stores.map(s => ({
    slug:              s.slug || s.id,
    name:              s.name,
    category:          s.category,
    short_description: s.shortDescription || null,
    description:       s.description || null,
    tags:              Array.isArray(s.tags) ? s.tags : [],
    status:            s.status,
    is_anchor:         s.isAnchor === true,
    is_featured:       s.isFeatured === true,
    is_visible:        s.isVisible !== false,
    unit_number:       s.unitNumber || null,
    phone:             s.phone || null,
    email:             s.email || null,
    website:           s.website || null,
    logo_url:          null,
    image_url:         null,
    sort_order:        s.sortOrder ?? 99,
  }))

  const { data: upsertedStores, error: storeError } = await supabase
    .from('stores')
    .upsert(storeRows, { onConflict: 'slug' })
    .select('id, slug')

  if (storeError) {
    console.error('ERROR upserting stores:', storeError.message)
    process.exit(1)
  }
  console.log(`  ✓ ${upsertedStores.length} stores upserted.\n`)

  // Build slug → UUID map for trading_hours and promotions foreign keys
  const slugToUuid = {}
  for (const row of upsertedStores) {
    slugToUuid[row.slug] = row.id
  }

  // -------------------------------------------------------------------------
  // 2. Upsert trading_hours
  //    One row per store per day (unique on store_id + day_key).
  //    The freeform string from JSON goes into notes.
  //    open_time and close_time remain null for Phase 4 — backfill later.
  // -------------------------------------------------------------------------
  console.log('Upserting trading hours...')
  const hourRows = []
  for (const store of stores) {
    const storeUuid = slugToUuid[store.slug || store.id]
    if (!storeUuid) {
      console.warn(`  WARN: No UUID found for store slug "${store.slug}" — skipping hours.`)
      continue
    }
    if (!store.tradingHours || typeof store.tradingHours !== 'object') continue

    for (const [dayKey, value] of Object.entries(store.tradingHours)) {
      hourRows.push({
        store_id:      storeUuid,
        day_key:       dayKey,
        display_label: DAY_LABELS[dayKey] || dayKey,
        notes:         value || null,
        is_closed:     value === 'Closed',
        sort_order:    DAY_SORT_ORDER[dayKey] ?? 99,
      })
    }
  }

  const { error: hoursError } = await supabase
    .from('trading_hours')
    .upsert(hourRows, { onConflict: 'store_id,day_key' })

  if (hoursError) {
    console.error('ERROR upserting trading_hours:', hoursError.message)
    process.exit(1)
  }
  console.log(`  ✓ ${hourRows.length} trading hour rows upserted.\n`)

  // -------------------------------------------------------------------------
  // 3. Upsert promotions
  //    store_id resolved from slug lookup.
  //    storeName is NOT stored (derived via join in queries).
  //    image_url omitted — image migration is Phase 4F.
  // -------------------------------------------------------------------------
  console.log('Upserting promotions...')
  const promoRows = promotions.map(p => {
    const storeUuid = p.storeId ? slugToUuid[p.storeId] || null : null
    if (p.storeId && !storeUuid) {
      console.warn(`  WARN: Promotion "${p.slug}" references storeId "${p.storeId}" not found in seeded stores.`)
    }
    return {
      slug:          p.slug || p.id,
      store_id:      storeUuid,
      type:          p.type || 'Promotion',
      title:         p.title,
      description:   p.description || null,
      image_url:     null,
      start_date:    p.startDate || null,
      end_date:      p.endDate || null,
      status:        p.status,
      is_featured:   p.isFeatured === true,
      highlight_tag: p.highlightTag || null,
      cta_label:     p.ctaLabel || null,
      cta_href:      p.ctaHref || null,
      sort_order:    p.sortOrder ?? 99,
    }
  })

  const { data: upsertedPromos, error: promoError } = await supabase
    .from('promotions')
    .upsert(promoRows, { onConflict: 'slug' })
    .select('id, slug')

  if (promoError) {
    console.error('ERROR upserting promotions:', promoError.message)
    process.exit(1)
  }
  console.log(`  ✓ ${upsertedPromos.length} promotions upserted.\n`)

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('=== Seed complete ===')
  console.log(`  Stores:        ${upsertedStores.length}`)
  console.log(`  Trading hours: ${hourRows.length}`)
  console.log(`  Promotions:    ${upsertedPromos.length}`)
  console.log('\nNext: run npm run verify:supabase to confirm public read access.')
}

seed().catch(err => {
  console.error('Unexpected seed error:', err.message)
  process.exit(1)
})
