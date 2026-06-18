import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdminPromotion } from '../../hooks/useAdminPromotion.js'
import { fetchAdminStores } from '../../services/adminStoreService.js'
import { createAdminPromotion, updateAdminPromotion } from '../../services/adminPromotionService.js'
import ImageUploadField from '../../components/admin/ImageUploadField.jsx'
import {
  PROMOTION_STATUSES,
  PROMOTION_TYPES,
  STATUS_LABELS,
  slugify,
  validatePromotionForm,
} from '../../utils/adminPromotionFormUtils.js'

const EMPTY_FORM = {
  title:        '',
  slug:         '',
  type:         'Promotion',
  description:  '',
  highlightTag: '',
  storeId:      '', // Empty string represents "Centre-wide" (null in DB)
  startDate:    '',
  endDate:      '',
  status:       'draft',
  isFeatured:   false,
  sortOrder:    '999',
  ctaLabel:     '',
  ctaHref:      '',
  imageUrl:     '',
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

export default function AdminPromotionFormPage() {
  const { slug } = useParams()
  const isEditMode = Boolean(slug)
  const navigate = useNavigate()

  const { promotion, loading: promoLoading, error: promoError } = useAdminPromotion(isEditMode ? slug : null)
  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [formReady, setFormReady] = useState(!isEditMode)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const slugManuallyEdited = useRef(isEditMode)

  // Load stores list
  useEffect(() => {
    let active = true
    setStoresLoading(true)
    fetchAdminStores()
      .then(data => {
        if (active) setStores(data)
      })
      .catch(err => console.error('Failed to load stores:', err))
      .finally(() => {
        if (active) setStoresLoading(false)
      })
    return () => { active = false }
  }, [])

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && promotion) {
      setForm({
        title:        promotion.title || '',
        slug:         promotion.slug || '',
        type:         promotion.type || 'Promotion',
        description:  promotion.description || '',
        highlightTag: promotion.highlightTag || '',
        storeId:      promotion.storeId || '',
        startDate:    promotion.startDate || '',
        endDate:      promotion.endDate || '',
        status:       promotion.status || 'draft',
        isFeatured:   promotion.isFeatured === true,
        sortOrder:    String(promotion.sortOrder ?? 999),
        ctaLabel:     promotion.ctaLabel || '',
        ctaHref:      promotion.ctaHref || '',
        imageUrl:     promotion.imageUrl || '',
      })
      setFormReady(true)
    }
  }, [isEditMode, promotion])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    setSaveSuccess(false)
  }

  function handleTitleChange(title) {
    set('title', title)
    if (!slugManuallyEdited.current) {
      set('slug', slugify(title))
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

    const validation = validatePromotionForm({ ...form, slug: form.slug.trim() })
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSaving(true)
    try {
      const payload = {
        title:        form.title.trim(),
        slug:         form.slug.trim(),
        type:         form.type,
        description:  form.description,
        highlightTag: form.highlightTag,
        storeId:      form.storeId || null,
        startDate:    form.startDate,
        endDate:      form.endDate,
        status:       form.status,
        isFeatured:   form.isFeatured,
        sortOrder:    form.sortOrder,
        ctaLabel:     form.ctaLabel,
        ctaHref:      form.ctaHref,
        imageUrl:     form.imageUrl,
      }

      if (isEditMode) {
        await updateAdminPromotion(promotion.id, payload)
        setSaveSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const created = await createAdminPromotion(payload)
        navigate(`/admin/promotions/${created.slug}/edit`, {
          state: { message: `"${payload.title}" was created successfully.` },
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

  if (isEditMode && promoLoading) {
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

  if (isEditMode && promoError) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          Failed to load promotion: {promoError}
        </div>
      </div>
    )
  }

  if (isEditMode && !promoLoading && !promotion) {
    return (
      <div className="max-w-3xl">
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm">
          Promotion "{slug}" was not found.{' '}
          <Link to="/admin/promotions" className="underline">Back to promotions</Link>
        </div>
      </div>
    )
  }

  if (!formReady) return null

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/promotions" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Promotions
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditMode ? `Edit: ${promotion?.title}` : 'Add Promotion'}
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
            <Field label="Title *" htmlFor="title" error={errors.title}>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                disabled={saving}
                className={errors.title ? INPUT_ERR : INPUT}
              />
            </Field>
            <Field
              label="Slug *"
              htmlFor="slug"
              error={errors.slug}
              hint="URL-safe ID. Lowercase, hyphens only."
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
            <Field label="Type *" htmlFor="type" error={errors.type}>
              <select
                id="type"
                value={form.type}
                onChange={e => set('type', e.target.value)}
                disabled={saving}
                className={SELECT}
              >
                {PROMOTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Highlight Tag" htmlFor="highlightTag" hint="e.g. Special Offer, 50% Off, Event">
              <input
                id="highlightTag"
                type="text"
                value={form.highlightTag}
                onChange={e => set('highlightTag', e.target.value)}
                disabled={saving}
                className={INPUT}
              />
            </Field>
          </div>

          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              disabled={saving}
              rows={4}
              placeholder="Provide a detailed description of the promotion or event."
              className={`${INPUT} resize-y`}
            />
          </Field>
        </FormSection>

        {/* Store Link */}
        <FormSection title="Location / Store Link">
          <Field
            label="Associated Store"
            htmlFor="storeId"
            hint="Select the tenant store running this promotion, or choose 'Centre-wide' for general centre events."
          >
            <select
              id="storeId"
              value={form.storeId}
              onChange={e => set('storeId', e.target.value)}
              disabled={saving || storesLoading}
              className={SELECT}
            >
              <option value="">Centre-wide</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        </FormSection>

        {/* Schedule */}
        <FormSection title="Schedule">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Start Date *" htmlFor="startDate" error={errors.startDate}>
              <input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={e => set('startDate', e.target.value)}
                disabled={saving}
                className={errors.startDate ? INPUT_ERR : INPUT}
              />
            </Field>
            <Field label="End Date *" htmlFor="endDate" error={errors.endDate}>
              <input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={e => set('endDate', e.target.value)}
                disabled={saving}
                className={errors.endDate ? INPUT_ERR : INPUT}
              />
            </Field>
          </div>
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
                className={SELECT}
              >
                {PROMOTION_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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
          <div className="pt-1">
            <label className={CHECKBOX_ROW}>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => set('isFeatured', e.target.checked)}
                disabled={saving}
                className="rounded border-gray-300"
              />
              Featured promotion (highlighted in public list)
            </label>
          </div>
        </FormSection>

        {/* Call to Action (CTA) */}
        <FormSection title="Call to Action (Optional)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CTA Button Label" htmlFor="ctaLabel" hint="e.g. View Store, Read More">
              <input
                id="ctaLabel"
                type="text"
                value={form.ctaLabel}
                onChange={e => set('ctaLabel', e.target.value)}
                disabled={saving}
                placeholder="Learn More"
                className={INPUT}
              />
            </Field>
            <Field label="CTA Link (URL)" htmlFor="ctaHref" error={errors.ctaHref} hint="e.g. #/store/checkers or https://">
              <input
                id="ctaHref"
                type="text"
                value={form.ctaHref}
                onChange={e => set('ctaHref', e.target.value)}
                disabled={saving}
                placeholder="#/promotions"
                className={errors.ctaHref ? INPUT_ERR : INPUT}
              />
            </Field>
          </div>
        </FormSection>

        {/* Media */}
        <FormSection title="Media">
          <ImageUploadField
            label="Promotion Image"
            value={form.imageUrl}
            onChange={url => set('imageUrl', url)}
            uploadType="promotion-image"
            entitySlug={form.slug}
            disabled={saving}
            helperText="Banner image shown on the promotions list. Accepted formats: JPG, PNG, WebP, SVG. Maximum size: 2 MB."
          />
        </FormSection>

        {/* Form actions */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link
            to="/admin/promotions"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Promotion'}
          </button>
        </div>
      </form>
    </div>
  )
}
