import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../components/Badge'

export default function Store() {
  const { slug } = useParams()
  const [store, setStore] = useState(null)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    fetch(`${baseUrl}data/stores.json`)
      .then(r => r.json())
      .then(list => setStore(list.find(s => (s.slug || s.id) === slug) || null))
      .catch(() => setStore(null))
  }, [slug, baseUrl])

  if (!store) {
    return (
      <div className="pt-24 md:pt-28 min-h-screen bg-brand-bg">
        <div className="container py-12">
          <p className="text-brand-mid text-lg">Store not found.</p>
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

  const hours = store.hours || {}
  const hoursIsString = typeof hours === 'string'
  const logoPath = store.logo ? `${baseUrl}${store.logo.startsWith('/') ? store.logo.slice(1) : store.logo}` : null
  const websiteUrl = store.website || store.externalUrl

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-brand-bg">
      <div className="container py-8 md:py-12">
        {/* Back Link */}
        <Link
          className="inline-flex items-center gap-1.5 text-sm text-brand-mid hover:text-brand-dark transition-colors mb-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
          to="/stores"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <img src={logoPath} alt={store.name} className="max-h-full max-w-full object-contain" />
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
                </div>
              </div>
            </div>

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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {store.unit && store.unit !== 'TBD' && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Unit:</strong>
                    <span>{store.unit}</span>
                  </p>
                )}
                {store.location && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Location:</strong>
                    <span>{store.location}</span>
                  </p>
                )}
                {store.phone && store.phone !== 'TBD' && (
                  <p className="flex justify-between">
                    <strong className="text-brand-dark font-semibold">Phone:</strong>
                    <a href={`tel:${store.phone}`} className="hover:text-brand-dark underline">{store.phone}</a>
                  </p>
                )}
                {store.email && store.email !== 'TBD' && (
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
                {hoursIsString ? (
                  <p>{hours}</p>
                ) : Object.keys(hours).length ? (
                  <ul className="space-y-1.5">
                    {Object.entries(hours).map(([day, val]) => (
                      <li key={day} className="flex justify-between">
                        <span className="capitalize font-medium text-brand-dark">{day}:</span>
                        <span>{val}</span>
                      </li>
                    ))}
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
