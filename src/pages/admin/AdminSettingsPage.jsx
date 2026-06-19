import { useState, useEffect } from 'react'
import { useCentreSettings } from '../../hooks/useCentreSettings.js'
import { updateAllCentreSettings, DEFAULT_SETTINGS } from '../../services/centreSettingsService.js'

function FormSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

const INPUT     = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50'
const INPUT_ERR = 'w-full px-3 py-2 rounded-lg border border-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errs = {}
  if (form.contact.email && !EMAIL_RE.test(form.contact.email)) {
    errs['contact.email'] = 'Must be a valid email address.'
  }
  if (form.leasing.email && !EMAIL_RE.test(form.leasing.email)) {
    errs['leasing.email'] = 'Must be a valid email address.'
  }
  if (form.announcement.enabled) {
    if (!form.announcement.title.trim())  errs['announcement.title'] = 'Title is required when announcement is enabled.'
    if (!form.announcement.body.trim())   errs['announcement.body']  = 'Message is required when announcement is enabled.'
  }
  if (form.announcement.ctaHref.trim()) {
    if (!/^(https?:\/\/|\/|#)/.test(form.announcement.ctaHref.trim())) {
      errs['announcement.ctaHref'] = 'Must start with http://, https://, /, or #'
    }
  }
  return errs
}

const HOUR_DAYS = [
  ['monday',            'Monday'],
  ['tuesday',           'Tuesday'],
  ['wednesday',         'Wednesday'],
  ['thursday',          'Thursday'],
  ['friday',            'Friday'],
  ['saturday',          'Saturday'],
  ['sunday',            'Sunday'],
  ['publicHolidayNote', 'Public Holidays'],
]

export default function AdminSettingsPage() {
  const { settings, loading, error: loadError, refreshSettings } = useCentreSettings()

  const [form, setForm]           = useState(DEFAULT_SETTINGS)
  const [formReady, setFormReady] = useState(false)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!loading) {
      setForm(settings)
      setFormReady(true)
    }
  }, [loading, settings])

  function setField(section, field, value) {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
    const key = `${section}.${field}`
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
    setSaveSuccess(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError(null)
    setSaveSuccess(false)
    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setSaving(true)
    try {
      await updateAllCentreSettings(form)
      setSaveSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSaveError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[200, 260, 180].map((w, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-100 rounded mb-4" style={{ width: w }} />
            <div className="h-9 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center justify-between">
          <span>Failed to load settings: {loadError}</span>
          <button onClick={refreshSettings} className="text-red-600 hover:text-red-800 underline text-xs ml-4">Retry</button>
        </div>
      </div>
    )
  }

  if (!formReady) return null

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Centre Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage centre-level information shown across the public website.</p>
      </div>

      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
          Settings saved successfully.
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Centre Details */}
        <FormSection title="Centre Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Centre Name" htmlFor="cName">
              <input id="cName" type="text" value={form.contact.name}
                onChange={e => setField('contact', 'name', e.target.value)}
                disabled={saving} className={INPUT} />
            </Field>
            <Field label="Tagline" htmlFor="cTagline" hint="Shown under the centre name on some pages.">
              <input id="cTagline" type="text" value={form.contact.tagline}
                onChange={e => setField('contact', 'tagline', e.target.value)}
                disabled={saving} placeholder="e.g. Convenience at its best" className={INPUT} />
            </Field>
          </div>
          <Field label="Physical Address" htmlFor="cAddress">
            <input id="cAddress" type="text" value={form.contact.address}
              onChange={e => setField('contact', 'address', e.target.value)}
              disabled={saving} className={INPUT} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" htmlFor="cPhone">
              <input id="cPhone" type="text" value={form.contact.phone}
                onChange={e => setField('contact', 'phone', e.target.value)}
                disabled={saving} placeholder="071 363 2116" className={INPUT} />
            </Field>
            <Field label="WhatsApp" htmlFor="cWhatsapp" hint="Optional. Leave blank if not available.">
              <input id="cWhatsapp" type="text" value={form.contact.whatsapp}
                onChange={e => setField('contact', 'whatsapp', e.target.value)}
                disabled={saving} placeholder="071 363 2116" className={INPUT} />
            </Field>
          </div>
          <Field label="Email" htmlFor="cEmail" error={errors['contact.email']}>
            <input id="cEmail" type="email" value={form.contact.email}
              onChange={e => setField('contact', 'email', e.target.value)}
              disabled={saving} className={errors['contact.email'] ? INPUT_ERR : INPUT} />
          </Field>
        </FormSection>

        {/* Trading Hours */}
        <FormSection title="Centre Trading Hours">
          <p className="text-xs text-gray-500">
            Enter hours for each day (e.g. 08:00 – 20:00, Closed, 24 Hours). Leave blank to omit a day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOUR_DAYS.map(([key, label]) => (
              <Field key={key} label={label} htmlFor={`h-${key}`}>
                <input id={`h-${key}`} type="text"
                  value={form.tradingHours[key]}
                  onChange={e => setField('tradingHours', key, e.target.value)}
                  disabled={saving}
                  placeholder="e.g. 08:00 – 20:00"
                  className={INPUT} />
              </Field>
            ))}
          </div>
        </FormSection>

        {/* Leasing */}
        <FormSection title="Leasing Details">
          <Field label="Leasing Contact Name" htmlFor="lName">
            <input id="lName" type="text" value={form.leasing.contactName}
              onChange={e => setField('leasing', 'contactName', e.target.value)}
              disabled={saving} placeholder="e.g. Leasing Manager" className={INPUT} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Leasing Phone" htmlFor="lPhone">
              <input id="lPhone" type="text" value={form.leasing.phone}
                onChange={e => setField('leasing', 'phone', e.target.value)}
                disabled={saving} className={INPUT} />
            </Field>
            <Field label="Leasing Email" htmlFor="lEmail" error={errors['leasing.email']}>
              <input id="lEmail" type="email" value={form.leasing.email}
                onChange={e => setField('leasing', 'email', e.target.value)}
                disabled={saving} className={errors['leasing.email'] ? INPUT_ERR : INPUT} />
            </Field>
          </div>
          <Field label="Leasing Intro / Message" htmlFor="lIntro" hint="Optional. Shown on the contact page under leasing enquiries.">
            <textarea id="lIntro" rows={3} value={form.leasing.intro}
              onChange={e => setField('leasing', 'intro', e.target.value)}
              disabled={saving}
              placeholder="Brief description shown above the leasing contact details."
              className={`${INPUT} resize-y`} />
          </Field>
        </FormSection>

        {/* Announcement */}
        <FormSection title="Announcement / Notice">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input type="checkbox" checked={form.announcement.enabled}
              onChange={e => setField('announcement', 'enabled', e.target.checked)}
              disabled={saving} className="rounded border-gray-300" />
            Show announcement banner on the homepage
          </label>
          <Field label="Title" htmlFor="aTitle" error={errors['announcement.title']}>
            <input id="aTitle" type="text" value={form.announcement.title}
              onChange={e => setField('announcement', 'title', e.target.value)}
              disabled={saving}
              placeholder="e.g. Extended Holiday Hours"
              className={errors['announcement.title'] ? INPUT_ERR : INPUT} />
          </Field>
          <Field label="Message" htmlFor="aBody" error={errors['announcement.body']}>
            <textarea id="aBody" rows={3} value={form.announcement.body}
              onChange={e => setField('announcement', 'body', e.target.value)}
              disabled={saving}
              placeholder="Brief notice shown to visitors on the homepage."
              className={`${errors['announcement.body'] ? INPUT_ERR : INPUT} resize-y`} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CTA Button Label" htmlFor="aCtaLabel" hint="e.g. View Stores, Learn More">
              <input id="aCtaLabel" type="text" value={form.announcement.ctaLabel}
                onChange={e => setField('announcement', 'ctaLabel', e.target.value)}
                disabled={saving} placeholder="Learn More" className={INPUT} />
            </Field>
            <Field label="CTA Link" htmlFor="aCtaHref" error={errors['announcement.ctaHref']} hint="e.g. #/stores or https://">
              <input id="aCtaHref" type="text" value={form.announcement.ctaHref}
                onChange={e => setField('announcement', 'ctaHref', e.target.value)}
                disabled={saving} placeholder="#/stores" className={errors['announcement.ctaHref'] ? INPUT_ERR : INPUT} />
            </Field>
          </div>
        </FormSection>

        {/* Social Links */}
        <FormSection title="Social Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook" htmlFor="sFacebook" hint="Full URL">
              <input id="sFacebook" type="url" value={form.socialLinks.facebook}
                onChange={e => setField('socialLinks', 'facebook', e.target.value)}
                disabled={saving} placeholder="https://facebook.com/clearviewsquare" className={INPUT} />
            </Field>
            <Field label="Instagram" htmlFor="sInstagram" hint="Full URL">
              <input id="sInstagram" type="url" value={form.socialLinks.instagram}
                onChange={e => setField('socialLinks', 'instagram', e.target.value)}
                disabled={saving} placeholder="https://instagram.com/clearviewsquare" className={INPUT} />
            </Field>
            <Field label="LinkedIn" htmlFor="sLinkedin" hint="Full URL (optional)">
              <input id="sLinkedin" type="url" value={form.socialLinks.linkedin}
                onChange={e => setField('socialLinks', 'linkedin', e.target.value)}
                disabled={saving} placeholder="https://linkedin.com/company/..." className={INPUT} />
            </Field>
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2 pb-8">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
