import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

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
      <div className="container py-10">
        <p className="text-brand-mid">Store not found.</p>
        <Link className="btn mt-4 inline-block" to="/stores">Back to Stores</Link>
      </div>
    )
  }

  const hours = store.hours || {}
  const hoursIsString = typeof hours === 'string'
  const logoPath = store.logo ? `${baseUrl}${store.logo.startsWith('/') ? store.logo.slice(1) : store.logo}` : null
  const websiteUrl = store.website || store.externalUrl

  return (
    <div className="container py-10">
      <Link className="text-sm underline" to="/stores">Back to Stores</Link>
      <div className="mt-4 grid md:grid-cols-3 gap-8 items-start">
        <div className="card md:col-span-2">
          <div className="flex items-center gap-4">
            {logoPath ? (
              <img src={logoPath} alt={store.name} className="h-14 object-contain" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center text-brand-accentStrong text-xl font-bold">
                {store.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <p className="text-brand-light">{store.category}{store.isAnchor ? ' - Anchor' : ''}</p>
            </div>
          </div>
          {store.description && <p className="mt-4">{store.description}</p>}
          {websiteUrl && (
            <p className="mt-4"><a className="btn" href={websiteUrl} target="_blank" rel="noreferrer">Visit Website</a></p>
          )}
        </div>
        <aside className="card">
          <h2 className="font-semibold">Store Info</h2>
          {store.unit && store.unit !== 'TBD' && <p className="mt-2"><strong>Unit:</strong> {store.unit}</p>}
          {store.phone && store.phone !== 'TBD' && <p className="mt-2"><strong>Phone:</strong> {store.phone}</p>}
          <div className="mt-4">
            <h3 className="font-semibold">Hours</h3>
            <div className="mt-2 text-sm text-brand-mid">
              {hoursIsString
                ? <p>{hours}</p>
                : Object.keys(hours).length
                  ? <ul>{Object.entries(hours).map(([k, v]) => <li key={k}><span className="uppercase">{k}:</span> {v}</li>)}</ul>
                  : <p>Hours to be confirmed</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
