import React from 'react'

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', opts)
  }

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', opts)}`
}

export default function PromotionCard({ promo, storeName }) {
  const baseUrl = import.meta.env.BASE_URL
  const imagePath = promo.image ? `${baseUrl}${promo.image.startsWith('/') ? promo.image.slice(1) : promo.image}` : null

  return (
    <article className="card hover:shadow-xl transition-all duration-300 flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2">
      {/* Image */}
      {imagePath && (
        <div className="mb-6 -mt-6 -mx-6 h-48 overflow-hidden rounded-t-xl bg-brand-bg flex items-center justify-center border-b border-black/5">
          <img
            src={imagePath}
            alt={promo.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            promo.type === 'Event'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {promo.type}
          </span>
          {promo.highlightTag && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-black/10 text-brand-accentStrong">
              {promo.highlightTag}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-brand-dark mb-1 leading-snug">{promo.title}</h3>

        {/* Store Name */}
        {storeName && (
          <p className="text-sm text-brand-accentStrong font-semibold mb-3">
            {storeName}
          </p>
        )}

        {/* Description */}
        <p className="text-brand-mid text-sm mb-4 leading-relaxed flex-1">
          {promo.description}
        </p>

        {/* Date Range & CTA */}
        <div className="mt-auto pt-4 border-t border-black/5">
          <p className="text-xs text-brand-light mb-3 flex items-center gap-1.5 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateRange(promo.startDate, promo.endDate)}
          </p>

          {promo.ctaLabel && (promo.ctaHref || promo.ctaUrl) && (
            <a
              href={promo.ctaHref || promo.ctaUrl}
              className="btn w-full text-center py-2 px-4 text-sm"
            >
              {promo.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
