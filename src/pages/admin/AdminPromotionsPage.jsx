import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminPromotions } from '../../hooks/useAdminPromotions.js'
import { fetchAdminStores } from '../../services/adminStoreService.js'
import PromotionStatusBadge from '../../components/admin/PromotionStatusBadge.jsx'
import { PROMOTION_STATUSES, PROMOTION_TYPES, STATUS_LABELS } from '../../utils/adminPromotionFormUtils.js'

export default function AdminPromotionsPage() {
  const { promotions, loading, error, refreshPromotions } = useAdminPromotions()
  const [stores, setStores] = useState([])
  const [storesLoading, setStoresLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterStore, setFilterStore] = useState('')
  const [filterFeatured, setFilterFeatured] = useState('')

  // Load stores to populate the store filter dropdown
  useEffect(() => {
    let active = true
    setStoresLoading(true)
    fetchAdminStores()
      .then(data => {
        if (active) setStores(data)
      })
      .catch(err => {
        console.error('Failed to load stores for filter:', err)
      })
      .finally(() => {
        if (active) setStoresLoading(false)
      })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    let result = promotions
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.store?.name || 'centre-wide').toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.highlightTag.toLowerCase().includes(q)
      )
    }
    if (filterType) {
      result = result.filter(p => p.type === filterType)
    }
    if (filterStatus) {
      result = result.filter(p => p.status === filterStatus)
    }
    if (filterStore) {
      if (filterStore === 'centre-wide') {
        result = result.filter(p => !p.storeId)
      } else {
        result = result.filter(p => p.storeId === filterStore)
      }
    }
    if (filterFeatured === 'featured') {
      result = result.filter(p => p.isFeatured)
    } else if (filterFeatured === 'regular') {
      result = result.filter(p => !p.isFeatured)
    }
    return result
  }, [promotions, search, filterType, filterStatus, filterStore, filterFeatured])

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage Clearview Square promotions and centre announcements.</p>
        </div>
        <Link
          to="/admin/promotions/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <span aria-hidden="true">+</span> Add Promotion
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="search"
          placeholder="Search title, store, tag, status…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All types</option>
          {PROMOTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All statuses</option>
          {PROMOTION_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select
          value={filterStore}
          onChange={e => setFilterStore(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          disabled={storesLoading}
        >
          <option value="">All locations</option>
          <option value="centre-wide">Centre-wide</option>
          {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filterFeatured}
          onChange={e => setFilterFeatured(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All features</option>
          <option value="featured">Featured</option>
          <option value="regular">Regular</option>
        </select>
        {(search || filterType || filterStatus || filterStore || filterFeatured) && (
          <button
            onClick={() => { setSearch(''); setFilterType(''); setFilterStatus(''); setFilterStore(''); setFilterFeatured('') }}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={refreshPromotions} className="text-red-600 hover:text-red-800 underline text-xs ml-4">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-48" />
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-4 bg-gray-100 rounded w-16 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Promotions table */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-sm font-medium text-gray-900">No promotions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {promotions.length === 0 ? 'No promotions in the database yet.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Store / Location</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">End Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(promo => (
                    <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[240px] truncate">
                        {promo.title}
                        <span className="block text-xs text-gray-400 font-normal">{promo.slug}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {promo.store ? promo.store.name : <span className="text-gray-400 font-normal italic">Centre-wide</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{promo.type}</td>
                      <td className="px-4 py-3"><PromotionStatusBadge status={promo.status} /></td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{promo.startDate || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{promo.endDate || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        {promo.isFeatured
                          ? <span className="text-blue-600 text-xs font-medium">Yes</span>
                          : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-center">{promo.sortOrder}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/promotions/${promo.slug}/edit`}
                          className="text-sm text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400">
                {filtered.length} of {promotions.length} promotions
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
