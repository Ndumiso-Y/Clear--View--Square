export const STORE_STATUSES = ['published', 'draft', 'hidden', 'opening_soon']

export const STATUS_LABELS = {
  published:    'Published',
  draft:        'Draft',
  hidden:       'Hidden',
  opening_soon: 'Opening Soon',
}

export const DAY_KEYS = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday', 'publicHolidays',
]

export const DAY_LABELS = {
  monday:        'Monday',
  tuesday:       'Tuesday',
  wednesday:     'Wednesday',
  thursday:      'Thursday',
  friday:        'Friday',
  saturday:      'Saturday',
  sunday:        'Sunday',
  publicHolidays:'Public Holidays',
}

export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function tagsFromString(str) {
  return str.split(',').map(t => t.trim()).filter(Boolean)
}

export function tagsToString(tags) {
  return Array.isArray(tags) ? tags.join(', ') : ''
}

export function getDefaultTradingHours() {
  const hours = {}
  for (const key of DAY_KEYS) {
    hours[key] = { notes: '', isClosed: false, openTime: null, closeTime: null }
  }
  return hours
}

// Merges an existing tradingHours map with defaults, ensuring all 8 days are present.
export function mergeTradingHours(existing) {
  const defaults = getDefaultTradingHours()
  const merged = {}
  for (const key of DAY_KEYS) {
    merged[key] = existing[key]
      ? { notes: existing[key].notes ?? '', isClosed: existing[key].isClosed ?? false, openTime: existing[key].openTime ?? null, closeTime: existing[key].closeTime ?? null }
      : defaults[key]
  }
  return merged
}

export function validateStoreForm(values) {
  const errors = {}

  if (!values.name?.trim()) {
    errors.name = 'Name is required.'
  }

  if (!values.slug?.trim()) {
    errors.slug = 'Slug is required.'
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug.trim())) {
    errors.slug = 'Slug must use lowercase letters, numbers, and hyphens only (e.g. my-store).'
  }

  if (!values.category?.trim()) {
    errors.category = 'Category is required.'
  }

  if (!STORE_STATUSES.includes(values.status)) {
    errors.status = 'Status must be one of: published, draft, hidden, opening_soon.'
  }

  if (values.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.website?.trim() && !/^https?:\/\//i.test(values.website.trim())) {
    errors.website = 'Website must start with http:// or https://'
  }

  if (values.sortOrder !== '' && values.sortOrder !== undefined && isNaN(Number(values.sortOrder))) {
    errors.sortOrder = 'Sort order must be a number.'
  }

  return errors
}
