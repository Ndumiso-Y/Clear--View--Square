import React from 'react'

export default function EmptyState({ title, description, icon }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-black/5 p-8 max-w-lg mx-auto">
      {icon ? (
        <div className="text-brand-light mb-4 flex justify-center">{icon}</div>
      ) : (
        <svg className="w-16 h-16 mx-auto text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
        </svg>
      )}
      <h3 className="text-xl font-bold text-brand-dark mb-2">{title}</h3>
      {description && <p className="text-brand-mid text-sm leading-relaxed">{description}</p>}
    </div>
  )
}
