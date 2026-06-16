import React from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'

export default function StoreCard({ store, index }) {
  const baseUrl = import.meta.env.BASE_URL
  const logoPath = store.logo ? `${baseUrl}${store.logo.startsWith('/') ? store.logo.slice(1) : store.logo}` : null

  return (
    <Link
      to={`/store/${store.slug || store.id}`}
      className="card flex flex-col hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
      style={{ animationDelay: index !== undefined ? `${index * 50}ms` : undefined }}
    >
      {/* Logo/Image container of fixed height */}
      <div className={`h-24 flex items-center justify-center mb-4 bg-brand-bg rounded-xl p-4 overflow-hidden border border-black/5 ${store.name === 'Brands SA' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : ''}`}>
        {logoPath ? (
          <img
            src={logoPath}
            alt={`${store.name} logo`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent && !parent.querySelector('.fallback-logo')) {
                const fallback = document.createElement('div')
                fallback.className = 'fallback-logo w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-brand-accentStrong text-xl font-bold'
                fallback.textContent = store.name.charAt(0).toUpperCase()
                parent.appendChild(fallback)
              }
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-brand-accentStrong text-xl font-bold">
            {store.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-accentStrong transition-colors mb-1">
          {store.name}
        </h3>

        {/* Category & Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="default">{store.category}</Badge>
          {store.tags?.map(tag => (
            <Badge key={tag} variant="accent">{tag}</Badge>
          ))}
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-sm text-brand-mid leading-snug line-clamp-3 mt-auto">
            {store.description}
          </p>
        )}
      </div>
    </Link>
  )
}
