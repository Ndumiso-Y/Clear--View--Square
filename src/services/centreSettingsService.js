import { supabase, hasSupabaseConfig } from '../lib/supabase.js'

const KEYS = {
  CONTACT:       'contact',
  TRADING_HOURS: 'trading_hours',
  LEASING:       'leasing',
  ANNOUNCEMENT:  'announcement',
  SOCIAL_LINKS:  'social_links',
}

export const DEFAULT_SETTINGS = {
  contact: {
    name:     'Clearview Square',
    tagline:  '',
    address:  '166 Kock Street, Rustenburg, 0299',
    phone:    '071 363 2116 / 082 229 3580',
    email:    'clearviewsquare@gmail.com',
    whatsapp: '',
  },
  tradingHours: {
    monday:            '08:00 – 20:00',
    tuesday:           '08:00 – 20:00',
    wednesday:         '08:00 – 20:00',
    thursday:          '08:00 – 20:00',
    friday:            '08:00 – 20:00',
    saturday:          '08:00 – 15:00',
    sunday:            '08:00 – 15:00',
    publicHolidayNote: '08:00 – 15:00',
  },
  leasing: {
    contactName: '',
    email:       'clearviewsquare@gmail.com',
    phone:       '071 363 2116',
    intro:       '',
  },
  announcement: {
    enabled:  false,
    title:    '',
    body:     '',
    ctaLabel: '',
    ctaHref:  '',
  },
  socialLinks: {
    facebook:  '',
    instagram: 'https://www.instagram.com/clearviewsquare',
    linkedin:  '',
  },
}

function normalise(rows) {
  const map = Object.fromEntries((rows || []).map(r => [r.key, r.value || {}]))
  return {
    contact:      { ...DEFAULT_SETTINGS.contact,      ...(map[KEYS.CONTACT]       || {}) },
    tradingHours: { ...DEFAULT_SETTINGS.tradingHours, ...(map[KEYS.TRADING_HOURS] || {}) },
    leasing:      { ...DEFAULT_SETTINGS.leasing,      ...(map[KEYS.LEASING]       || {}) },
    announcement: { ...DEFAULT_SETTINGS.announcement, ...(map[KEYS.ANNOUNCEMENT]  || {}) },
    socialLinks:  { ...DEFAULT_SETTINGS.socialLinks,  ...(map[KEYS.SOCIAL_LINKS]  || {}) },
  }
}

export async function fetchCentreSettings() {
  if (!hasSupabaseConfig) return { ...DEFAULT_SETTINGS }
  const { data, error } = await supabase
    .from('centre_settings')
    .select('key, value')
  if (error) throw error
  return normalise(data)
}

export async function updateAllCentreSettings(settings) {
  if (!hasSupabaseConfig) throw new Error('Supabase is not configured.')
  const rows = [
    { key: KEYS.CONTACT,       value: settings.contact },
    { key: KEYS.TRADING_HOURS, value: settings.tradingHours },
    { key: KEYS.LEASING,       value: settings.leasing },
    { key: KEYS.ANNOUNCEMENT,  value: settings.announcement },
    { key: KEYS.SOCIAL_LINKS,  value: settings.socialLinks },
  ]
  const { error } = await supabase
    .from('centre_settings')
    .upsert(rows, { onConflict: 'key' })
  if (error) throw error
}
