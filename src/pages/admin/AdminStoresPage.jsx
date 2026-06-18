import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStores } from '../../hooks/useAdminStores.js'
import StoreStatusBadge from '../../components/admin/StoreStatusBadge.jsx'
import { STORE_STATUSES, STATUS_LABELS } from '../../utils/adminStoreFormUtils.js'

export default function AdminStoresPage() {
  const { stores, loading, error, refreshStores } = useAdminStores()

  const [search, setSearch]               = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus]   = useState('')
  const [filterVisible, setFilterVisible] = useState('')

  const categories = useMemo(() => {
    const cats = new Set(stores.map(s => s.category).filter(Boolean))
    return [...cats].sort()
  }, [stores])

  const filtered = useMemo(() => {
    let result = stores
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.unitNumber || '').toLowerCase().includes(q) ||
        s.status.includes(q)
      )
    }
    if (filterCategory) result = result.filter(s => s.category === filterCategory)
    if (filterStatus)   result = result.filter(s => s.status === filterStatus)
    if (filterVisible === 'visible') result = result.filter(s => s.isVisible)
    if (filterVisible === 'hidden')  result = result.filter(s => !s.isVisible)
    return result
  }, [stores, search, filterCategory, filterStatus, filterVisible])

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage Clearview Square tenant listings.</p>
        </div>
        <Link
          to="/admin/stores/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <span aria-hidden="true">+</span> Add Store
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="search"
          placeholder="Search name, category, unit, status…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All statuses</option>
          {STORE_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select
          value={filterVisible}
          onChange={e => setFilterVisible(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All visibility</option>
          <option value="visible">Visible</option>
          <option value="hidden">Not visible</option>
        </select>
        {(search || filterCategory || filterStatus || filterVisible) && (
          <button
            onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); setFilterVisible('') }}
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
          <button onClick={refreshStores} className="text-red-600 hover:text-red-800 underline text-xs ml-4">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-40" />
              <div className="h-4 bg-gray-100 rounded w-24" />
              <div className="h-4 bg-gray-100 rounded w-16 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Stores table */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-sm font-medium text-gray-900">No stores found</p>
              <p className="text-sm text-gray-500 mt-1">
                {stores.length === 0 ? 'No stores in the database yet.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Visible</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Anchor</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(store => (
                    <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[200px] truncate">
                        {store.name}
                        <span className="block text-xs text-gray-400 font-normal">{store.slug}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{store.category}</td>
                      <td className="px-4 py-3 text-gray-500">{store.unitNumber || '—'}</td>
                      <td className="px-4 py-3"><StoreStatusBadge status={store.status} /></td>
                      <td className="px-4 py-3 text-center">
                        {store.isVisible
                          ? <span className="text-green-600 text-xs font-medium">Yes</span>
                          : <span className="text-gray-400 text-xs">No</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {store.isFeatured
                          ? <span className="text-blue-600 text-xs font-medium">Yes</span>
                          : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {store.isAnchor
                          ? <span className="text-purple-600 text-xs font-medium">Yes</span>
                          : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-center">{store.sortOrder}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/stores/${store.slug}/edit`}
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
                {filtered.length} of {stores.length} stores
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
