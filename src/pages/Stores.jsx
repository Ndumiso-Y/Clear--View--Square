import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = ["All","Food","Fashion","Services","Health","Electronics","Other"]

function parseHourRange(str) {
  if (!str || typeof str !== 'string' || !str.includes('–')) return null
  const [a,b] = str.split('–')
  const toMin = (s)=> {
    const [h,m] = s.split(':').map(Number)
    return h*60 + (m||0)
  }
  return [toMin(a), toMin(b)]
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
  const [q,setQ] = useState('')
  const [cat,setCat] = useState('All')
  const [openOnly,setOpenOnly] = useState(false)
  const baseUrl = import.meta.env.BASE_URL

  const filtered = useMemo(()=> {
    const now = new Date()
    const day = ["sun","mon","tue","wed","thu","fri","sat"][now.getDay()]
    const mins = now.getHours()*60 + now.getMinutes()

    return stores.filter(s => {
      const matchesQ = (s.name||'').toLowerCase().includes(q.toLowerCase())
      const matchesCat = cat==="All" ? true : s.category===cat
      let matchesOpen = true
      if (openOnly) {
        const hours = s.hours?.[day] || s.hours?.['mon_fri']
        const range = parseHourRange(hours)
        matchesOpen = !!range && (mins >= range[0] && mins <= range[1])
      }
      return matchesQ && matchesCat && matchesOpen
    })
  }, [stores,q,cat,openOnly])

  return (
    <div className="bg-gradient-to-b from-white to-brand-bg min-h-screen">
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">Our Stores</h1>
          <p className="text-lg md:text-xl text-brand-mid max-w-2xl mx-auto">
            Search, filter, and discover our diverse selection of tenants at Clearview Square.
          </p>
        </div>

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
              <Link
                to={`/store/${s.slug}`}
                key={s.slug}
                className="card flex flex-col items-center justify-center text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="h-20 flex items-center justify-center mb-4">
                  <img
                    src={`${baseUrl}${s.logo.startsWith('/') ? s.logo.slice(1) : s.logo}`}
                    onError={(e)=> e.currentTarget.replaceWith(
                      Object.assign(document.createElement('div'),{
                        textContent:'Logo coming soon',
                        className:'text-center text-brand-light text-sm'
                      })
                    )}
                    alt={s.name}
                    className="max-h-20 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-auto">
                  <div className="font-bold text-brand-dark group-hover:text-brand-accent transition-colors">
                    {s.name}
                  </div>
                  <div className="text-xs text-brand-light mt-1 flex items-center justify-center gap-1">
                    <span>{s.category}</span>
                    {s.anchor && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-brand-accent">Anchor</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-brand-dark mb-2">No stores found</h3>
            <p className="text-brand-mid">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
