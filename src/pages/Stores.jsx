import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import StoreCard from '../components/StoreCard'
import EmptyState from '../components/EmptyState'

const CATEGORIES = [
  "All",
  "Anchor",
  "Food & Drink",
  "Groceries",
  "Fashion & Footwear",
  "Health & Beauty",
  "Electronics & Tech",
  "Services",
  "Fitness & Wellness",
  "Pets & Specialty",
  "Financial & ATMs",
  "Other"
]

// Map group param to categories
const GROUP_TO_CATEGORIES = {
  'food-drink': ['Food & Drink', 'Groceries'],
  'fashion-lifestyle': ['Fashion & Footwear', 'Health & Beauty'],
  'services-essentials': ['Services', 'Electronics & Tech', 'Fitness & Wellness', 'Financial & ATMs']
}

function useStores() {
  const [data, setData] = useState([])
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL
    fetch(`${baseUrl}data/stores.json`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData([]))
  }, [])
  return data
}

export default function Stores() {
  const stores = useStores()
  const [searchParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  // Handle group parameter from URL
  useEffect(() => {
    const group = searchParams.get('group')
    if (group && GROUP_TO_CATEGORIES[group]) {
      setCat(GROUP_TO_CATEGORIES[group][0])
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    return stores.filter(s => {
      // Filter out stores with isVisible: false
      if (s.isVisible === false) return false

      const matchesQ = (s.name || '').toLowerCase().includes(q.toLowerCase()) ||
                       (s.description || '').toLowerCase().includes(q.toLowerCase())
      const matchesCat = cat === "All" ? true : s.category === cat
      return matchesQ && matchesCat
    })
  }, [stores, q, cat])

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <PageHero
        title="Our Stores"
        subtitle="Search, filter, and discover our diverse selection of tenants at Clearview Square"
        backgroundImage="assets/hero/clearview-hero-stores-fashion-01.jpg"
      />

      <div className="bg-gradient-to-b from-white to-brand-bg">
        <div className="container py-12 md:py-16">

          {/* FILTERS */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-black/5">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              {/* Search Box */}
              <div className="relative flex-1 lg:max-w-md">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="store-search-input"
                  className="border border-brand-light rounded-xl pl-12 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  placeholder="Search stores..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 flex-wrap flex-1" role="group" aria-label="Filter stores by category">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`pill ${cat === c ? 'pill-active' : ''}`}
                    onClick={() => setCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Disabled "Coming Soon" Open Now Toggle */}
              <label className="flex items-center gap-2 text-sm font-medium text-brand-light cursor-not-allowed select-none">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 rounded border-brand-light text-brand-light focus:ring-0 cursor-not-allowed opacity-50"
                  aria-disabled="true"
                />
                <span>Open now</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/10 text-brand-mid rounded uppercase tracking-wider">
                  Coming Soon
                </span>
              </label>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-brand-mid font-medium">
              Showing <span className="text-brand-dark font-bold">{filtered.length}</span> {filtered.length === 1 ? 'store' : 'stores'}
            </p>
          </div>

          {/* GRID */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((s, index) => (
                <StoreCard key={s.id} store={s} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No stores matched your search"
              description="Try a different name or category filter."
              icon={
                <svg className="w-16 h-16 mx-auto text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
