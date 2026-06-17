import React, { useEffect, useState, useMemo } from 'react'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import PromotionCard from '../components/PromotionCard'
import EmptyState from '../components/EmptyState'
import { splitPromotionsByDate } from '../utils/promotionUtils'

export default function Promotions() {
  const [items, setItems] = useState([])
  const [stores, setStores] = useState([])
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${baseUrl}data/promotions.json`).then(r => r.json()).then(setItems).catch(() => setItems([]))
    fetch(`${baseUrl}data/stores.json`).then(r => r.json()).then(setStores).catch(() => setStores([]))
  }, [baseUrl])

  const { nowOn, upcoming } = useMemo(() => {
    return splitPromotionsByDate(items)
  }, [items])

  const getStoreName = (storeId) => {
    if (!storeId) return null
    const store = stores.find(s => s.id === storeId)
    return store?.name || 'Store'
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen">
      <PageHero
        title="Promotions & Events"
        subtitle="Discover the latest deals, special offers, and upcoming events at Clearview Square"
        backgroundImage="assets/hero/clearview-hero-promotions-shopping-01.jpg"
      />

      <div className="bg-gradient-to-b from-white to-brand-bg">
        <div className="container py-12 md:py-16 space-y-16">

          {/* Now On Section */}
          <section aria-labelledby="now-on-heading">
            <SectionHeading
              id="now-on-heading"
              title="Now On"
              badge="Active"
              badgeColor="bg-green-100 text-green-700"
              subtitle="Current promotions and events running at the centre."
            />

            {nowOn.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nowOn.map(p => (
                  <PromotionCard key={p.id} promo={p} storeName={getStoreName(p.storeId)} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No current promotions"
                description="Check back soon for special offers from our stores."
                icon={
                  <svg className="w-16 h-16 mx-auto text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                }
              />
            )}
          </section>

          {/* Upcoming Section */}
          <section aria-labelledby="upcoming-heading">
            <SectionHeading
              id="upcoming-heading"
              title="Upcoming"
              badge="Coming Soon"
              badgeColor="bg-blue-100 text-blue-700"
              subtitle="Events and promotions scheduled for the near future."
            />

            {upcoming.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map(p => (
                  <PromotionCard key={p.id} promo={p} storeName={getStoreName(p.storeId)} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming events"
                description="Stay tuned for exciting promotions and events."
                icon={
                  <svg className="w-16 h-16 mx-auto text-brand-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
