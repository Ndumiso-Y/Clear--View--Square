/**
 * Filters promotions that are published and public-facing.
 */
export function getPublicPromotions(promotions) {
  if (!Array.isArray(promotions)) return []
  return promotions
    .filter(p => p.status === 'published')
    .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99))
}

/**
 * Returns true if the promotion is active on the given date (today).
 */
export function isPromotionActive(promo, today = new Date()) {
  if (!promo.startDate || !promo.endDate) return false
  const t = new Date(today)
  t.setHours(0, 0, 0, 0)
  const start = new Date(promo.startDate)
  const end = new Date(promo.endDate)
  return t >= start && t <= end
}

/**
 * Returns true if the promotion starts in the future relative to the given date (today).
 */
export function isPromotionUpcoming(promo, today = new Date()) {
  if (!promo.startDate) return false
  const t = new Date(today)
  t.setHours(0, 0, 0, 0)
  const start = new Date(promo.startDate)
  return t < start
}

/**
 * Groups and returns public promotions split by date into active (nowOn) and upcoming.
 */
export function splitPromotionsByDate(promotions, today = new Date()) {
  const publicPromos = getPublicPromotions(promotions)
  const nowOn = publicPromos.filter(p => isPromotionActive(p, today))
  const upcoming = publicPromos.filter(p => isPromotionUpcoming(p, today))
  return { nowOn, upcoming }
}
