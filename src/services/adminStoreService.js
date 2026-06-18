import { supabase, hasSupabaseConfig } from '../lib/supabase.js'
import { DAY_KEYS, DAY_LABELS, slugify } from '../utils/adminStoreFormUtils.js'

const DAY_SORT_ORDER = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3,
  friday: 4, saturday: 5, sunday: 6, publicHolidays: 7,
}

// Transform a Supabase snake_case store row into camelCase for the admin UI.
// Unlike the public transform, this keeps the UUID id and all admin fields.
function transformAdminStore(row) {
  return {
    id:               row.id,
    slug:             row.slug,
    name:             row.name,
    category:         row.category,
    shortDescription: row.short_description,
    description:      row.description,
    tags:             row.tags || [],
    status:           row.status,
    isAnchor:         row.is_anchor,
    isFeatured:       row.is_featured,
    isVisible:        row.is_visible,
    unitNumber:       row.unit_number,
    phone:            row.phone,
    email:            row.email,
    website:          row.website,
    logoUrl:          row.logo_url,
    imageUrl:         row.image_url,
    sortOrder:        row.sort_order,
    createdAt:        row.created_at,
    updatedAt:        row.updated_at,
    tradingHours:     buildAdminTradingHours(row.trading_hours || []),
  }
}

// Returns a map of dayKey → { notes, isClosed, openTime, closeTime } for the admin form.
function buildAdminTradingHours(rows) {
  const map = {}
  const sorted = [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  for (const row of sorted) {
    map[row.day_key] = {
      notes:     row.notes ?? '',
      isClosed:  row.is_closed,
      openTime:  row.open_time,
      closeTime: row.close_time,
    }
  }
  return map
}

// Converts camelCase form payload to snake_case DB row (store fields only, no tradingHours).
function toStoreRow(payload) {
  return {
    slug:              payload.slug?.trim(),
    name:              payload.name?.trim(),
    category:          payload.category?.trim(),
    short_description: payload.shortDescription?.trim() || null,
    description:       payload.description?.trim() || null,
    tags:              Array.isArray(payload.tags) ? payload.tags : [],
    status:            payload.status,
    is_anchor:         payload.isAnchor === true,
    is_featured:       payload.isFeatured === true,
    is_visible:        payload.isVisible === true,
    unit_number:       payload.unitNumber?.trim() || null,
    phone:             payload.phone?.trim() || null,
    email:             payload.email?.trim() || null,
    website:           payload.website?.trim() || null,
    logo_url:          payload.logoUrl?.trim() || null,
    image_url:         payload.imageUrl?.trim() || null,
    sort_order:        Number(payload.sortOrder) || 999,
  }
}

// Returns all stores visible to the authenticated admin (all statuses, all visibility).
// RLS: admin_read_all_stores policy allows this for active admin/editor sessions.
export async function fetchAdminStores() {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('stores')
    .select('id, slug, name, category, unit_number, status, is_visible, is_featured, is_anchor, sort_order, updated_at')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw error
  return data.map(row => ({
    id:        row.id,
    slug:      row.slug,
    name:      row.name,
    category:  row.category,
    unitNumber:row.unit_number,
    status:    row.status,
    isVisible: row.is_visible,
    isFeatured:row.is_featured,
    isAnchor:  row.is_anchor,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  }))
}

// Returns one store by slug with full detail including trading hours.
export async function fetchAdminStoreBySlug(slug) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('stores')
    .select('*, trading_hours(id, day_key, display_label, notes, open_time, close_time, is_closed, sort_order)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? transformAdminStore(data) : null
}

// Inserts a new store, then upserts its trading hours.
// Returns { id, slug } of the created store.
export async function createAdminStore(payload) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { tradingHours, ...rest } = payload
  const { data, error } = await supabase
    .from('stores')
    .insert(toStoreRow(rest))
    .select('id, slug')
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('A store with this slug already exists. Choose a different name or edit the slug.')
    throw error
  }
  if (tradingHours) {
    await upsertTradingHours(data.id, tradingHours)
  }
  return data
}

// Updates an existing store by UUID. Does not touch created_at.
// tradingHours are upserted separately.
export async function updateAdminStore(id, payload) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { tradingHours, ...rest } = payload
  const { error } = await supabase
    .from('stores')
    .update(toStoreRow(rest))
    .eq('id', id)
  if (error) {
    if (error.code === '23505') throw new Error('A store with this slug already exists. Choose a different slug.')
    throw error
  }
  if (tradingHours) {
    await upsertTradingHours(id, tradingHours)
  }
}

// Upserts all 8 trading hour rows for a store, using notes as the primary display value.
// open_time and close_time remain structured (null if not provided) for future Phase 4G.
export async function upsertTradingHours(storeId, tradingHoursMap) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const rows = DAY_KEYS.map(dayKey => ({
    store_id:      storeId,
    day_key:       dayKey,
    display_label: DAY_LABELS[dayKey],
    notes:         tradingHoursMap[dayKey]?.notes ?? '',
    is_closed:     tradingHoursMap[dayKey]?.isClosed === true,
    open_time:     tradingHoursMap[dayKey]?.openTime ?? null,
    close_time:    tradingHoursMap[dayKey]?.closeTime ?? null,
    sort_order:    DAY_SORT_ORDER[dayKey],
  }))
  const { error } = await supabase
    .from('trading_hours')
    .upsert(rows, { onConflict: 'store_id,day_key' })
  if (error) throw error
}

// Generates a URL-safe slug from a store name, appending -2, -3, etc. if taken.
// Pass existingSlug when editing so the current store's slug is not treated as a conflict.
export async function generateUniqueSlug(name, existingSlug = null) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const base = slugify(name)
  if (!base) throw new Error('Cannot generate slug: name produced an empty string.')

  let candidate = base
  let attempt = 1

  for (;;) {
    const { data, error } = await supabase
      .from('stores')
      .select('slug')
      .eq('slug', candidate)
      .maybeSingle()
    if (error) throw error
    // No conflict, or the conflict IS the current store being edited.
    if (!data || data.slug === existingSlug) return candidate
    attempt++
    candidate = `${base}-${attempt}`
  }
}
