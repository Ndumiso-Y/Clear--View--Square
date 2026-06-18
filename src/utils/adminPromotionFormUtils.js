export const PROMOTION_STATUSES = ['published', 'draft', 'hidden']

export const STATUS_LABELS = {
  published: 'Published',
  draft:     'Draft',
  hidden:    'Hidden',
}

export const PROMOTION_TYPES = ['Promotion', 'Event']

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validatePromotionForm(values) {
  const errors = {}

  if (!values.title?.trim()) {
    errors.title = 'Title is required.'
  }

  if (!values.slug?.trim()) {
    errors.slug = 'Slug is required.'
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug.trim())) {
    errors.slug = 'Slug must use lowercase letters, numbers, and hyphens only (e.g. holiday-sale).'
  }

  if (!PROMOTION_TYPES.includes(values.type)) {
    errors.type = 'Type must be Promotion or Event.'
  }

  if (!PROMOTION_STATUSES.includes(values.status)) {
    errors.status = 'Status must be published, draft, or hidden.'
  }

  if (!values.startDate) {
    errors.startDate = 'Start date is required.'
  }

  if (!values.endDate) {
    errors.endDate = 'End date is required.'
  }

  if (values.startDate && values.endDate) {
    const start = new Date(values.startDate)
    const end = new Date(values.endDate)
    if (isNaN(start.getTime())) {
      errors.startDate = 'Start date is invalid.'
    }
    if (isNaN(end.getTime())) {
      errors.endDate = 'End date is invalid.'
    }
    if (!errors.startDate && !errors.endDate && end < start) {
      errors.endDate = 'End date must be same as or after start date.'
    }
  }

  if (values.ctaHref?.trim()) {
    const href = values.ctaHref.trim()
    if (!/^https?:\/\//i.test(href) && !/^\//.test(href) && !/^#/.test(href)) {
      errors.ctaHref = 'CTA Link must start with http://, https://, /, or #'
    }
  }

  if (values.sortOrder !== '' && values.sortOrder !== undefined && isNaN(Number(values.sortOrder))) {
    errors.sortOrder = 'Sort order must be a number.'
  }

  return errors
}
