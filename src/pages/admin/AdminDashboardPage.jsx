import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { fetchPublicStores } from '../../services/storeService.js'
import { fetchPublicPromotions } from '../../services/promotionService.js'

function StatCard({ label, value, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-10 bg-gray-100 rounded animate-pulse mt-1" />
      ) : (
        <p className="text-2xl font-semibold text-gray-900">{value ?? '—'}</p>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { user, profile } = useAuth()
  const [storeCount, setStoreCount] = useState(null)
  const [promoCount, setPromoCount]  = useState(null)
  const [countsLoading, setCountsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchPublicStores(), fetchPublicPromotions()])
      .then(([stores, promos]) => {
        if (cancelled) return
        setStoreCount(stores.length)
        setPromoCount(promos.length)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCountsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const displayName = user?.email ?? 'Admin'
  const roleLabel   = profile?.role ? ` (${profile.role})` : ''

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {displayName}{roleLabel}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Public stores"
          value={storeCount}
          loading={countsLoading}
        />
        <StatCard
          label="Active promotions"
          value={promoCount}
          loading={countsLoading}
        />
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">CMS status</p>
          <p className="text-sm font-medium text-green-600">Connected</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Coming in later phases</h2>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>Phase 4D — Stores management (add, edit, deactivate)</li>
          <li>Phase 4E — Promotions management (create and manage)</li>
          <li>Phase 4F — Image upload and storage migration</li>
          <li>Phase 4G — Trading hours editor</li>
          <li>Phase 4H — Centre settings and admin user management</li>
        </ul>
      </div>
    </div>
  )
}
