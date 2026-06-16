import React from 'react'

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-light/20 text-brand-mid',
    accent: 'bg-black/10 text-brand-accentStrong font-semibold',
    success: 'bg-green-100 text-green-700 font-semibold',
    purple: 'bg-purple-100 text-purple-700 font-semibold',
    blue: 'bg-blue-100 text-blue-700 font-semibold'
  }

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full transition-colors ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
