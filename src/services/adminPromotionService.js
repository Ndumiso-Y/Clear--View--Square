import { supabase, hasSupabaseConfig } from '../lib/supabase.js'
import { slugify } from '../utils/adminPromotionFormUtils.js'

function transformAdminPromotion(row) {
  return {
    id:           row.id,
    slug:         row.slug,
    type:         row.type,
    title:        row.title,
    storeId:      row.store_id,
    store:        row.stores ? { id: row.stores.id, name: row.stores.name, slug: row.stores.slug } : null,
    description:  row.description || '',
    imageUrl:     row.image_url || '',
    startDate:    row.start_date || '',
    endDate:      row.end_date || '',
    status:       row.status,
    isFeatured:   row.is_featured === true,
    highlightTag: row.highlight_tag || '',
    ctaLabel:     row.cta_label || '',
    ctaHref:      row.cta_href || '',
    sortOrder:    row.sort_order,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
  }
}

function toPromotionRow(payload) {
  return {
    slug:          payload.slug?.trim(),
    title:         payload.title?.trim(),
    type:          payload.type,
    status:        payload.status,
    store_id:      payload.storeId || null,
    description:   payload.description?.trim() || null,
    image_url:     payload.imageUrl?.trim() || null,
    start_date:    payload.startDate || null,
    end_date:      payload.endDate || null,
    is_featured:   payload.isFeatured === true,
    highlight_tag: payload.highlightTag?.trim() || null,
    cta_label:     payload.ctaLabel?.trim() || null,
    cta_href:      payload.ctaHref?.trim() || null,
    sort_order:    payload.sortOrder !== undefined && payload.sortOrder !== '' ? Number(payload.sortOrder) : 999,
  }
}

export async function fetchAdminPromotions() {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('promotions')
    .select('id, slug, type, title, store_id, start_date, end_date, status, is_featured, highlight_tag, sort_order, updated_at, stores(id, name, slug)')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: false })
    .order('title', { ascending: true })
  if (error) throw error
  return data.map(transformAdminPromotion)
}

export async function fetchAdminPromotionBySlug(slug) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('promotions')
    .select('*, stores(id, name, slug)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? transformAdminPromotion(data) : null
}

export async function createAdminPromotion(payload) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('promotions')
    .insert(toPromotionRow(payload))
    .select('id, slug')
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('A promotion with this slug already exists. Choose a different title or edit the slug.')
    throw error
  }
  return data
}

export async function updateAdminPromotion(id, payload) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from('promotions')
    .update(toPromotionRow(payload))
    .eq('id', id)
  if (error) {
    if (error.code === '23505') throw new Error('A promotion with this slug already exists. Choose a different slug.')
    throw error
  }
}

export async function generateUniquePromotionSlug(title, existingSlug = null) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const base = slugify(title)
  if (!base) throw new Error('Cannot generate slug: title produced an empty string.')

  let candidate = base
  let attempt = 1

  for (;;) {
    const { data, error } = await supabase
      .from('promotions')
      .select('slug')
      .eq('slug', candidate)
      .maybeSingle()
    if (error) throw error
    if (!data || data.slug === existingSlug) return candidate
    attempt++
    candidate = `${base}-${attempt}`
  }
}
