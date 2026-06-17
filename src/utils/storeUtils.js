/**
 * Filters stores that are public-facing.
 * Public stores are visible (isVisible !== false) and status is either 'published' or 'opening_soon'.
 */
export function getPublicStores(stores) {
  if (!Array.isArray(stores)) return []
  return stores
    .filter(s => s.isVisible !== false && (s.status === 'published' || s.status === 'opening_soon'))
    .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99))
}

/**
 * Resolves a single store by its slug or ID.
 */
export function getStoreBySlug(stores, slug) {
  if (!Array.isArray(stores) || !slug) return null
  const slugLower = slug.toLowerCase()
  return stores.find(s => (s.slug || s.id || '').toLowerCase() === slugLower) || null
}

/**
 * Extracts unique categories from public stores.
 */
export function getStoreCategories(stores) {
  const publicStores = getPublicStores(stores)
  const categories = publicStores.map(s => s.category).filter(Boolean)
  const uniqueCategories = [...new Set(categories)]
  // Sort alphabetically
  return uniqueCategories.sort()
}

/**
 * Filters stores based on case-insensitive query (matches name, category, tags, shortDescription, description) and category.
 */
export function filterStores(stores, query = '', category = 'All') {
  const publicStores = getPublicStores(stores)
  const cleanQuery = query.trim().toLowerCase()

  return publicStores.filter(s => {
    // Category match
    const matchesCategory = category === 'All' ? true : s.category === category

    // Search query match
    if (!cleanQuery) return matchesCategory

    const nameMatch = (s.name || '').toLowerCase().includes(cleanQuery)
    const catMatch = (s.category || '').toLowerCase().includes(cleanQuery)
    const shortDescMatch = (s.shortDescription || '').toLowerCase().includes(cleanQuery)
    const descMatch = (s.description || '').toLowerCase().includes(cleanQuery)
    const tagMatch = Array.isArray(s.tags) && s.tags.some(tag => tag.toLowerCase().includes(cleanQuery))

    const matchesQuery = nameMatch || catMatch || shortDescMatch || descMatch || tagMatch

    return matchesCategory && matchesQuery
  })
}
