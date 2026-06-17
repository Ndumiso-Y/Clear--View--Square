import { supabase, hasSupabaseConfig } from '../lib/supabase.js'
import { getPublicPromotions } from '../utils/promotionUtils.js'

const BASE_URL = import.meta.env.BASE_URL

async function fetchPromotionsJson() {
  const res = await fetch(`${BASE_URL}data/promotions.json`)
  if (!res.ok) throw new Error('Failed to load promotions data')
  return res.json()
}

// Transform a Supabase snake_case promotion row into the camelCase shape
// expected by existing components and utility functions.
// storeName is derived from the joined stores.name (null for centre-wide promos).
function transformPromotion(row) {
  return {
    id: row.slug,                              // use slug as id for util compatibility
    slug: row.slug,
    type: row.type,
    title: row.title,
    storeId: row.store_id,
    storeName: row.stores?.name || null,       // derived from join; null = centre-wide
    description: row.description,
    image: row.image_url,                      // null until Phase 4F image migration
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    isFeatured: row.is_featured,
    highlightTag: row.highlight_tag,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    sortOrder: row.sort_order,
  }
}

// Returns only published promotions, ordered by sort_order.
// Supabase path: RLS filters to published only; store name derived via join.
// JSON path: getPublicPromotions filters to published only; storeName is already in JSON.
export async function fetchPublicPromotions() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('promotions')
      .select('*, stores(name)')
      .order('sort_order')
    if (error) throw error
    return data.map(transformPromotion)
  }
  const raw = await fetchPromotionsJson()
  return getPublicPromotions(raw)
}
