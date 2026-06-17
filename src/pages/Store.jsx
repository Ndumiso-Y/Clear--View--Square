import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/Badge'
import SectionHeading from '../components/SectionHeading'
import { getStoreBySlug } from '../utils/storeUtils'

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  publicHolidays: 'Public Holidays'
}

export default function Store() {
  const { slug } = useParams()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    setLoading(true)
    fetch(`${baseUrl}data/stores.json`)
      .then(r => r.json())
      .then(list => {
        const found = getStoreBySlug(list, slug)
        // Block public access to hidden or non-visible stores
        if (found && found.isVisible !== false && found.status !== 'hidden') {
          setStore(found)
        } else {
          setStore(null)
        }
        setLoading(false)
      })
      .catch(() => {
        setStore(null)
        setLoading(false)
      })
  }, [slug, baseUrl])

  if (loading) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-brand-mid text-lg">Loading store details...</div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen bg-brand-bg">
        <div className="container py-12">
          <SectionHeading title="Store Not Found" subtitle="The store you are looking for does not exist or is currently unavailable." />
          <Link
            className="btn mt-6 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
            to="/stores"
          >
            Back to Stores
          </Link>
        </div>
      </div>
    )
  }

  const logoPath = store.logo ? `${baseUrl}${store.logo.startsWith('/') ? store.logo.slice(1) : store.logo}` : null
  const imagePath = store.image ? `${baseUrl}${store.image.startsWith('/') ? store.image.slice(1) : store.image}` : null
  const websiteUrl = store.website

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-brand-bg">
      <div className="container py-8 md:py-12">
        {/* Back Link */}
        <Link
          className="inline-flex items-center gap-1.5 text-sm text-brand-mid hover:text-brand-dark transition-colors mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
          to="/stores"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Stores
        </Link>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="card md:col-span-2 border border-black/5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {logoPath ? (
                <div className="h-16 w-16 bg-brand-bg rounded-xl p-2 flex items-center justify-center border border-black/5 overflow-hidden">
                  <img src={logoPath} alt={`${store.name} logo`} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-black/10 flex items-center justify-center text-brand-accentStrong text-2xl font-bold">
                  {store.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-extrabold text-brand-dark">{store.name}</h1>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <Badge variant="default">{store.category}</Badge>
                  {store.isAnchor && <Badge variant="accent">Anchor Tenant</Badge>}
                  {store.status === 'opening_soon' && <Badge variant="blue">Opening Soon</Badge>}
                </div>
              </div>
            </div>

            {/* Store Hero Image */}
            {imagePath && (
              <div className="mt-6 rounded-xl overflow-hidden max-h-[300px] border border-black/5">
                <img src={imagePath} alt={store.name} className="w-full h-full object-cover" />
              </div>
            )}

            {store.description && (
              <p className="mt-6 text-brand-mid text-lg leading-relaxed">
                {store.description}
              </p>
            )}

            {websiteUrl && (
              <div className="mt-8">
                <a
                  className="btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="card border border-black/5 shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-bold text-brand-dark pb-3 border-b border-black/5">Store Details</h2>
              <div className="mt-4 space-y-3 text-sm text-brand-mid">
                {store.unitNumber && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Unit:</strong>
                    <span>{store.unitNumber}</span>
                  </p>
                )}
                {store.location && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Location:</strong>
                    <span>{store.location}</span>
                  </p>
                )}
                {store.phone && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Phone:</strong>
                    <a href={`tel:${store.phone}`} className="hover:text-brand-dark underline">{store.phone}</a>
                  </p>
                )}
                {store.email && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Email:</strong>
                    <a href={`mailto:${store.email}`} className="hover:text-brand-dark underline">{store.email}</a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-brand-dark pb-2 border-b border-black/5">Trading Hours</h3>
              <div className="mt-3 text-sm text-brand-mid">
                {store.tradingHours ? (
                  <ul className="space-y-1.5">
                    {Object.entries(store.tradingHours).map(([dayKey, val]) => {
                      const displayLabel = DAY_LABELS[dayKey] || dayKey
                      return (
                        <li key={dayKey} className="flex justify-between">
                          <span className="capitalize font-medium text-brand-dark">{displayLabel}:</span>
                          <span>{val || 'Closed'}</span>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-brand-light italic">Hours to be confirmed</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
