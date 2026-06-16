import React from 'react'

export default function SectionHeading({ title, subtitle, badge, badgeColor = 'bg-black/10 text-brand-accentStrong', className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      {badge && (
        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${badgeColor}`}>
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-brand-mid text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
