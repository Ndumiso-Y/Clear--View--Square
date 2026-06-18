// Verify script: checks that the Supabase seed produced the expected data
// and that public RLS policies are working correctly.
//
// Uses the ANON key (not service role) to simulate what the public frontend sees.
// Uses the service role for internal total-count checks.
//
// Usage:
//   npm run verify:supabase

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const anonKey     = process.env.VITE_SUPABASE_ANON_KEY
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !anonKey || !serviceKey) {
  console.error('ERROR: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must all be set in .env')
  process.exit(1)
}

const anonClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
const svcClient  = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

async function verify() {
  console.log('=== Clearview Square — Supabase Seed Verification ===\n')
  let passed = 0
  let failed = 0

  function check(label, ok, detail, note) {
    const icon = ok ? '✓' : '✗'
    const info = detail && !ok ? ` (${detail})` : ''
    console.log(`  ${icon} ${label}${info}${note ? ' — ' + note : ''}`)
    ok ? passed++ : failed++
  }

  // -------------------------------------------------------------------------
  // Total row counts via service role (bypasses RLS)
  // -------------------------------------------------------------------------
  console.log('Internal counts (service role):')

  const { count: totalStores } = await svcClient
    .from('stores')
    .select('*', { count: 'exact', head: true })
  check('Total stores in DB', totalStores >= 30, `got ${totalStores}, expected ≥ 30`, 'seed baseline + any CMS stores')

  const { count: totalHours } = await svcClient
    .from('trading_hours')
    .select('*', { count: 'exact', head: true })
  check('Total trading_hours rows', totalHours >= 240, `got ${totalHours}, expected ≥ 240`, 'seed baseline × 8 days')

  const { count: totalPromos } = await svcClient
    .from('promotions')
    .select('*', { count: 'exact', head: true })
  check('Total promotions in DB', totalPromos >= 4, `got ${totalPromos}, expected ≥ 4`)

  // -------------------------------------------------------------------------
  // Public read via anon key (tests RLS)
  // -------------------------------------------------------------------------
  console.log('\nPublic read (anon key — tests RLS):')

  const { data: publicStores, error: storeErr } = await anonClient
    .from('stores')
    .select('id, slug, name, status, is_visible')
  if (storeErr) { console.error('  ERROR fetching stores:', storeErr.message); failed++; }
  else {
    check('Public stores count', publicStores.length >= 29, `got ${publicStores.length}, expected ≥ 29`, 'hidden/draft stores excluded')

    const hiddenVisible = publicStores.some(s => s.slug === 'milky-lane-storage')
    check('Hidden store (milky-lane-storage) not visible to anon', !hiddenVisible)

    const cmsTestVisible = publicStores.some(s => s.slug === 'cms-test-store')
    check('CMS Test Store (cms-test-store) not visible to anon', !cmsTestVisible)


    const allPublicStatus = publicStores.every(s =>
      s.is_visible === true && ['published', 'opening_soon'].includes(s.status)
    )
    check('All public stores have valid status + is_visible', allPublicStatus)
  }

  const { data: publicPromos, error: promoErr } = await anonClient
    .from('promotions')
    .select('id, slug, status')
  if (promoErr) { console.error('  ERROR fetching promotions:', promoErr.message); failed++; }
  else {
    check('Public promotions count', publicPromos.length >= 4, `got ${publicPromos.length}, expected ≥ 4`)
    const allPublished = publicPromos.every(p => p.status === 'published')
    check('All public promotions are published', allPublished)

    const cmsPromoVisible = publicPromos.some(p => p.slug === 'cms-test-promotion')
    check('CMS Test Promotion not visible to anon', !cmsPromoVisible)
  }

  // -------------------------------------------------------------------------
  // CMS Test Store integrity (optional — only if it exists)
  // -------------------------------------------------------------------------
  console.log('\nCMS Test Store integrity (optional):')

  const { data: cmsStore } = await svcClient
    .from('stores')
    .select('slug, status, is_visible')
    .eq('slug', 'cms-test-store')
    .maybeSingle()
  if (cmsStore) {
    check('cms-test-store status is draft', cmsStore.status === 'draft', `got ${cmsStore.status}`)
    check('cms-test-store is_visible is false', cmsStore.is_visible === false, `got ${cmsStore.is_visible}`)
  } else {
    console.log('  ⓘ cms-test-store not present — skipped (optional)')
  }

  // -------------------------------------------------------------------------
  // CMS Test Promotion integrity (optional — only if it exists)
  // -------------------------------------------------------------------------
  console.log('\nCMS Test Promotion integrity (optional):')

  const { data: cmsPromo } = await svcClient
    .from('promotions')
    .select('slug, status')
    .eq('slug', 'cms-test-promotion')
    .maybeSingle()
  if (cmsPromo) {
    check('cms-test-promotion status is draft', cmsPromo.status === 'draft', `got ${cmsPromo.status}`)
  } else {
    console.log('  ⓘ cms-test-promotion not present — skipped (optional)')
  }

  // -------------------------------------------------------------------------
  // Anon write blocked (RLS must reject)
  // -------------------------------------------------------------------------
  console.log('\nWrite block checks (anon key — should all be rejected):')

  const { error: insertErr } = await anonClient
    .from('stores')
    .insert({ slug: 'rls-test', name: 'RLS Test', category: 'Test', status: 'published' })
  check('Anon insert stores blocked', !!insertErr, null, insertErr?.code || '')

  // Supabase returns no error on DELETE when RLS silently filters all rows —
  // nothing is deleted, but PostgREST reports success with 0 rows affected.
  // We chain .select() to get the affected rows and confirm none were deleted.
  const { data: deletedRows, error: deleteErr } = await anonClient
    .from('stores')
    .delete()
    .eq('slug', 'checkers')
    .select('id')
  const deleteBlocked = !!deleteErr || (Array.isArray(deletedRows) && deletedRows.length === 0)
  check('Anon delete stores blocked', deleteBlocked, null, deleteErr?.code || '0 rows deleted')

  // -------------------------------------------------------------------------
  // Result
  // -------------------------------------------------------------------------
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Result: ${passed} passed, ${failed} failed`)
  if (failed > 0) {
    console.error('\nVerification failed. Check the errors above before proceeding.')
    process.exit(1)
  } else {
    console.log('\n✅ All checks passed. Supabase seed is verified.')
  }
}

verify().catch(err => {
  console.error('Unexpected error:', err.message)
  process.exit(1)
})
