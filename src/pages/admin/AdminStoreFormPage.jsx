import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminStore } from '../../hooks/useAdminStore.js'
import { createAdminStore, updateAdminStore } from '../../services/adminStoreService.js'
import TradingHoursEditor from '../../components/admin/TradingHoursEditor.jsx'
import {
  STORE_STATUSES,
  STATUS_LABELS,
  slugify,
  tagsFromString,
  tagsToString,
  getDefaultTradingHours,
  mergeTradingHours,
  validateStoreForm,
} from '../../utils/adminStoreFormUtils.js'

const EMPTY_FORM = {
  name:             '',
  slug:             '',
  category:         '',
  unitNumber:       '',
  shortDescription: '',
  description:      '',
  tagsInput:        '',
  status:           'draft',
  isAnchor:         false,
  isFeatured:       false,
  isVisible:        false,
  sortOrder:        '999',
  phone:            '',
  email:            '',
  website:          '',
  logoUrl:          '',
  imageUrl:         '',
  tradingHours:     getDefaultTradingHours(),
}

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

const INPUT = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50'
const INPUT_ERR = 'w-full px-3 py-2 rounded-lg border border-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent'
const SELECT = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white disabled:opacity-50'
const CHECKBOX_ROW = 'flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none'

export default function AdminStoreFormPage() {
  const { slug } = useParams()
  const isEditMode = Boolean(slug)
  const navigate = useNavigate()

  const { store, loading: storeLoading, error: storeError } = useAdminStore(isEditMode ? slug : null)

  const [form, setForm]           = useState(EMPTY_FORM)
  const [formReady, setFormReady] = useState(!isEditMode)
  const [errors, setErrors]       = useState({})
  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Track whether the slug was manually edited (stops auto-sync from name field).
  const slugManuallyEdited = useRef(isEditMode)

  // Populate form when store data arrives (edit mode).
  useEffect(() => {
    if (isEditMode && store) {
      setForm({
        name:             store.name || '',
        slug:             store.slug || '',
        category:         store.category || '',
        unitNumber:       store.unitNumber || '',
        shortDescription: store.shortDescription || '',
        description:      store.description || '',
        tagsInput:        tagsToString(store.tags),
        status:           store.status || 'draft',
        isAnchor:         store.isAnchor === true,
        isFeatured:       store.isFeatured === true,
        isVisible:        store.isVisible === true,
        sortOrder:        String(store.sortOrder ?? 99),
        phone:            store.phone || '',
        email:            store.email || '',
        website:          store.website || '',
        logoUrl:          store.logoUrl || '',
        imageUrl:         store.imageUrl || '',
        tradingHours:     mergeTradingHours(store.tradingHours || {}),
      })
      setFormReady(true)
    }
  }, [isEditMode, store])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    setSaveSuccess(false)
  }

  function handleNameChange(name) {
    set('name', name)
    if (!slugManuallyEdited.current) {
      set('slug', slugify(name))
    }
  }

  function handleSlugChange(value) {
    slugManuallyEdited.current = true
    set('slug', value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError(null)
    setSaveSuccess(false)

    const validation = validateStoreForm({ ...form, slug: form.slug.trim() })
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSaving(true)
    try {
      const payload = {
        name:             form.name.trim(),
        slug:             form.slug.trim(),
        category:         form.category.trim(),
        unitNumber:       form.unitNumber,
        shortDescription: form.shortDescription,
        description:      form.description,
        tags:             tagsFromString(form.tagsInput),
        status:           form.status,
        isAnchor:         form.isAnchor,
        isFeatured:       form.isFeatured,
        isVisible:        form.isVisible,
        sortOrder:        form.sortOrder,
        phone:            form.phone,
        email:            form.email,
        website:          form.website,
        logoUrl:          form.logoUrl,
        imageUrl:         form.imageUrl,
        tradingHours:     form.tradingHours,
      }

      if (isEditMode) {
        await updateAdminStore(store.id, payload)
        setSaveSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const created = await createAdminStore(payload)
        navigate(`/admin/stores/${created.slug}/edit`, {
          state: { message: `"${payload.name}" was created successfully.` },
        })
      }
    } catch (err) {
      setSaveError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  // --- Loading / error states ---

  if (isEditMode && storeLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[160, 200, 140].map((w, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className={`h-4 bg-gray-100 rounded mb-4`} style={{ width: w }} />
            <div className="h-9 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (isEditMode && storeError) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          Failed to load store: {storeError}
        </div>
      </div>
    )
  }

  if (isEditMode && !storeLoading && !store) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm">
          Store "{slug}" was not found.{' '}
          <Link to="/admin/stores" className="underline">Back to stores</Link>
        </div>
      </div>
    )
  }

  if (!formReady) return null

  // --- Form ---

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/stores" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Stores
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditMode ? `Edit: ${store?.name}` : 'Add Store'}
        </h1>
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
          Changes saved successfully.
        </div>
      )}

      {/* Error banner */}
      {saveError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Basic Details */}
        <FormSection title="Basic Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *" htmlFor="name" error={errors.name}>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                disabled={saving}
                className={errors.name ? INPUT_ERR : INPUT}
              />
            </Field>
            <Field
              label="Slug *"
              htmlFor="slug"
              error={errors.slug}
              hint="URL-safe ID used in store links. Lowercase, hyphens only."
            >
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={e => handleSlugChange(e.target.value)}
                disabled={saving}
                className={errors.slug ? INPUT_ERR : INPUT}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category *" htmlFor="category" error={errors.category}>
              <input
                id="category"
                type="text"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                disabled={saving}
                placeholder="e.g. Grocery, Clothing, Food"
                className={errors.category ? INPUT_ERR : INPUT}
              />
            </Field>
            <Field label="Unit Number" htmlFor="unitNumber">
              <input
                id="unitNumber"
                type="text"
                value={form.unitNumber}
                onChange={e => set('unitNumber', e.target.value)}
                disabled={saving}
                placeholder="e.g. A1, G12"
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Short Description" htmlFor="shortDescription">
            <input
              id="shortDescription"
              type="text"
              value={form.shortDescription}
              onChange={e => set('shortDescription', e.target.value)}
              disabled={saving}
              placeholder="One-line summary shown in store cards"
              className={INPUT}
            />
          </Field>

          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              disabled={saving}
              rows={4}
              placeholder="Full store description shown on the store detail page"
              className={`${INPUT} resize-y`}
            />
          </Field>

          <Field
            label="Tags"
            htmlFor="tagsInput"
            hint="Comma-separated. e.g. Anchor, Supermarket, Grocery"
          >
            <input
              id="tagsInput"
              type="text"
              value={form.tagsInput}
              onChange={e => set('tagsInput', e.target.value)}
              disabled={saving}
              placeholder="Tag 1, Tag 2, Tag 3"
              className={INPUT}
            />
          </Field>
        </FormSection>

        {/* Contact Details */}
        <FormSection title="Contact Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" htmlFor="phone">
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                disabled={saving}
                placeholder="+27 14 000 0000"
                className={INPUT}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                disabled={saving}
                className={errors.email ? INPUT_ERR : INPUT}
              />
            </Field>
          </div>
          <Field label="Website" htmlFor="website" error={errors.website}>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={e => set('website', e.target.value)}
              disabled={saving}
              placeholder="https://"
              className={errors.website ? INPUT_ERR : INPUT}
            />
          </Field>
        </FormSection>

        {/* Display Settings */}
        <FormSection title="Display Settings">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status *" htmlFor="status" error={errors.status}>
              <select
                id="status"
                value={form.status}
                onChange={e => set('status', e.target.value)}
                disabled={saving}
                className={errors.status ? INPUT_ERR.replace('border-gray-300', 'border-red-300') : SELECT}
              >
                {STORE_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Sort Order" htmlFor="sortOrder" error={errors.sortOrder} hint="Lower numbers appear first.">
              <input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={e => set('sortOrder', e.target.value)}
                disabled={saving}
                min="0"
                className={errors.sortOrder ? INPUT_ERR : INPUT}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={e => set('isVisible', e.target.checked)}
                disabled={saving}
                className="rounded border-gray-300"
              />
              Visible on public site
            </label>
            <label className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => set('isFeatured', e.target.checked)}
                disabled={saving}
                className="rounded border-gray-300"
              />
              Featured
            </label>
            <label className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={form.isAnchor}
                onChange={e => set('isAnchor', e.target.checked)}
                disabled={saving}
                className="rounded border-gray-300"
              />
              Anchor tenant
            </label>
          </div>
        </FormSection>

        {/* Media Placeholders */}
        <FormSection title="Media">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            Image uploads will be handled in a later phase. For now, keep existing paths or leave blank.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Logo URL" htmlFor="logoUrl" hint="Supabase Storage URL or leave blank.">
              <input
                id="logoUrl"
                type="text"
                value={form.logoUrl}
                onChange={e => set('logoUrl', e.target.value)}
                disabled={saving}
                placeholder="https://…"
                className={INPUT}
              />
            </Field>
            <Field label="Hero Image URL" htmlFor="imageUrl" hint="Supabase Storage URL or leave blank.">
              <input
                id="imageUrl"
                type="text"
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
                disabled={saving}
                placeholder="https://…"
                className={INPUT}
              />
            </Field>
          </div>
        </FormSection>

        {/* Trading Hours */}
        <FormSection title="Trading Hours">
          <p className="text-xs text-gray-500">
            Enter the display text for each day. Check "Closed" to mark a day as closed.
          </p>
          <TradingHoursEditor
            value={form.tradingHours}
            onChange={hours => { setForm(prev => ({ ...prev, tradingHours: hours })); setSaveSuccess(false) }}
          />
        </FormSection>

        {/* Form actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link
            to="/admin/stores"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Store'}
          </button>
        </div>
      </form>
    </div>
  )
}
