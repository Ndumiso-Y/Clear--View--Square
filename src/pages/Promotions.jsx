import { useEffect, useState, useMemo } from 'react'

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', opts)
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', opts)}`
}

export default function Promotions() {
  const [items, setItems] = useState([])
  const [stores, setStores] = useState([])
  const baseUrl = import.meta.env.BASE_URL

  useEffect(()=> {
    fetch(`${baseUrl}data/promotions.json`).then(r=>r.json()).then(setItems).catch(()=>setItems([]))
    fetch(`${baseUrl}data/stores.json`).then(r=>r.json()).then(setStores).catch(()=>setStores([]))
  }, [baseUrl])

  const { nowOn, upcoming } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nowOn = items.filter(p => {
      const start = new Date(p.startDate)
      const end = new Date(p.endDate)
      return today >= start && today <= end
    })

    const upcoming = items.filter(p => {
      const start = new Date(p.startDate)
      return today < start
    })

    return { nowOn, upcoming }
  }, [items])

  const getStoreName = (storeId) => {
    if (!storeId) return null
    const store = stores.find(s => s.id === storeId)
    return store?.name || 'Store'
  }

  const PromotionCard = ({ promo }) => (
    <article className="card hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      {promo.image && (
        <div className="mb-4 -mt-6 -mx-6">
          <img
            src={`${baseUrl}${promo.image.startsWith('/') ? promo.image.slice(1) : promo.image}`}
            alt={promo.title}
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover rounded-t-xl"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        </div>
      )}

      {/* Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          promo.type === 'Event'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {promo.type}
        </span>
        {promo.highlightTag && (
          <span className="text-xs px-3 py-1 rounded-full font-semibold bg-brand-accent/20 text-brand-accent">
            {promo.highlightTag}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-brand-dark mb-2">{promo.title}</h3>

      {/* Store Name */}
      {promo.storeId && (
        <p className="text-sm text-brand-accent font-semibold mb-2">
          {getStoreName(promo.storeId)}
        </p>
      )}

      {/* Description */}
      <p className="text-brand-mid mb-4 leading-relaxed flex-1">
        {promo.description}
      </p>

      {/* Date Range */}
      <p className="text-sm text-brand-light mb-4">
        {formatDateRange(promo.startDate, promo.endDate)}
      </p>

      {/* CTA */}
      {promo.ctaLabel && promo.ctaUrl && (
        <a
          href={promo.ctaUrl}
          className="btn w-full text-center"
        >
          {promo.ctaLabel}
        </a>
      )}
    </article>
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-top"
        style={{ backgroundImage: `url(${baseUrl}assets/hero/clearview-hero-promotions-shopping-01.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70"></div>
        <div className="relative h-full container flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Promotions & Events</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Discover the latest deals, special offers, and upcoming events at Clearview Square
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-white to-brand-bg">
        <div className="container py-12 md:py-16">

        {/* Now On Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-brand-dark">Now On</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Active
            </span>
          </div>

          {nowOn.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nowOn.map(p => <PromotionCard key={p.id} promo={p} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <svg className="w-16 h-16 mx-auto text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">No current promotions</h3>
              <p className="text-brand-mid">Check back soon for special offers from our stores</p>
            </div>
          )}
        </section>

        {/* Upcoming Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-brand-dark">Upcoming</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Coming Soon
            </span>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(p => <PromotionCard key={p.id} promo={p} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <svg className="w-16 h-16 mx-auto text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-brand-dark mb-2">No upcoming events</h3>
              <p className="text-brand-mid">Stay tuned for exciting promotions and events</p>
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  )
}
