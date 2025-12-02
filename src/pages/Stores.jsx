import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

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
  const [data,setData] = useState([])
  useEffect(()=> {
    const baseUrl = import.meta.env.BASE_URL
    fetch(`${baseUrl}data/stores.json`).then(r=>r.json()).then(setData).catch(()=>setData([]))
  }, [])
  return data
}

export default function Stores() {
  const stores = useStores()
  const [searchParams] = useSearchParams()
  const [q,setQ] = useState('')
  const [cat,setCat] = useState('All')
  const [openOnly,setOpenOnly] = useState(false)
  const baseUrl = import.meta.env.BASE_URL

  // Handle group parameter from URL
  useEffect(() => {
    const group = searchParams.get('group')
    if (group && GROUP_TO_CATEGORIES[group]) {
      // For now, just set the first matching category
      // This is a simple implementation - could be enhanced later
      setCat(GROUP_TO_CATEGORIES[group][0])
    }
  }, [searchParams])

  const filtered = useMemo(()=> {
    return stores.filter(s => {
      // Filter out stores with isVisible: false
      if (s.isVisible === false) return false

      const matchesQ = (s.name||'').toLowerCase().includes(q.toLowerCase()) ||
                       (s.description||'').toLowerCase().includes(q.toLowerCase())
      const matchesCat = cat==="All" ? true : s.category===cat
      // Open now toggle is visual-only for now (not wired to actual hours)
      return matchesQ && matchesCat
    })
  }, [stores,q,cat])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${baseUrl}assets/hero/clearview-hero-stores-fashion-01.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70"></div>
        <div className="relative h-full container flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Our Stores</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Search, filter, and discover our diverse selection of tenants at Clearview Square
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-brand-bg">
        <div className="container py-12 md:py-16">

        {/* FILTERS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative flex-1 lg:max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="border border-brand-light rounded-xl pl-12 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                placeholder="Search stores..."
                value={q}
                onChange={e=>setQ(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap flex-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`pill ${cat===c?'pill-active':''}`}
                  onClick={()=>setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-brand-dark cursor-pointer hover:text-brand-accent transition-colors">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={e=>setOpenOnly(e.target.checked)}
                className="w-4 h-4 rounded border-brand-light text-brand-accent focus:ring-brand-accent cursor-pointer"
              />
              Open now
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
              <div
                key={s.id}
                className="card flex flex-col hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Logo/Image */}
                <div className="h-20 flex items-center justify-center mb-4">
                  {s.logo ? (
                    <img
                      src={`${baseUrl}${s.logo.startsWith('/') ? s.logo.slice(1) : s.logo}`}
                      onError={(e)=> {
                        e.currentTarget.style.display = 'none'
                        const fallback = document.createElement('div')
                        fallback.className = 'w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-2xl font-bold'
                        fallback.textContent = s.name.charAt(0)
                        e.currentTarget.parentNode.appendChild(fallback)
                      }}
                      alt={s.name}
                      className="max-h-20 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-2xl font-bold">
                      {s.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="font-bold text-lg text-brand-dark group-hover:text-brand-accent transition-colors mb-1">
                    {s.name}
                  </div>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs px-2 py-0.5 bg-brand-light/20 text-brand-mid rounded">
                      {s.category}
                    </span>
                    {s.tags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-brand-accent/20 text-brand-accent rounded font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  {s.description && (
                    <p className="text-sm text-brand-mid leading-snug">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">No stores matched your search</h3>
            <p className="text-brand-mid">Try a different name or category</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
