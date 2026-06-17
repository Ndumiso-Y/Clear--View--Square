import { supabase, hasSupabaseConfig } from '../lib/supabase.js'
import { getPublicStores } from '../utils/storeUtils.js'

const BASE_URL = import.meta.env.BASE_URL

async function fetchStoresJson() {
  const res = await fetch(`${BASE_URL}data/stores.json`)
  if (!res.ok) throw new Error('Failed to load stores data')
  return res.json()
}

// Reconstruct the flat tradingHours object from the normalised DB rows.
// notes carries the freeform display string from the seed (e.g. "08:00 - 20:00").
// Falls back to formatted open/close times if notes is absent.
function buildTradingHours(rows) {
  if (!rows || rows.length === 0) return null
  const sorted = [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const obj = {}
  for (const row of sorted) {
    let value = row.notes
    if (!value && row.open_time && row.close_time) {
      value = `${row.open_time.slice(0, 5)} - ${row.close_time.slice(0, 5)}`
    }
    if (!value && row.is_closed) value = 'Closed'
    obj[row.day_key] = value || null
  }
  return Object.keys(obj).length > 0 ? obj : null
}

// Transform a Supabase snake_case store row into the camelCase shape
// expected by existing components and utility functions.
function transformStore(row) {
  return {
    id: row.slug,                             // keep slug as id for util compatibility
    slug: row.slug,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    tags: row.tags || [],
    status: row.status,
    isAnchor: row.is_anchor,
    isFeatured: row.is_featured,
    isVisible: row.is_visible,
    unitNumber: row.unit_number,
    phone: row.phone,
    email: row.email,
    website: row.website,
    logo: row.logo_url,                       // null until Phase 4F image migration
    image: row.image_url,                     // null until Phase 4F image migration
    sortOrder: row.sort_order,
    tradingHours: buildTradingHours(row.trading_hours),
  }
}

// Returns only public stores (published + opening_soon, is_visible = true).
// Supabase path: RLS already filters; result is sorted by sort_order.
// JSON path: getPublicStores applies the same filter and sort.
export async function fetchPublicStores() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('stores')
      .select('*, trading_hours(day_key, notes, open_time, close_time, is_closed, sort_order)')
      .order('sort_order')
    if (error) throw error
    return data.map(transformStore)
  }
  const raw = await fetchStoresJson()
  return getPublicStores(raw)
}

// Returns a single public store by slug, or null if not found / not public.
// Supabase path: RLS prevents hidden stores from being returned.
// JSON path: manually applies the same visibility check.
export async function fetchPublicStoreBySlug(slug) {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('stores')
      .select('*, trading_hours(day_key, notes, open_time, close_time, is_closed, sort_order)')
      .eq('slug', slug)
      .maybeSingle()
    if (error) return null
    return data ? transformStore(data) : null
  }
  const raw = await fetchStoresJson()
  const found = raw.find(s => (s.slug || s.id || '').toLowerCase() === slug.toLowerCase())
  if (!found || found.isVisible === false || found.status === 'hidden') return null
  return found
}
