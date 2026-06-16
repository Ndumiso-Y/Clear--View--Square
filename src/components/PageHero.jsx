import React from 'react'

export default function PageHero({ title, subtitle, backgroundImage }) {
  const baseUrl = import.meta.env.BASE_URL
  const bgUrl = backgroundImage ? `${baseUrl}${backgroundImage.startsWith('/') ? backgroundImage.slice(1) : backgroundImage}` : ''

  return (
    <section
      className="relative h-[40vh] md:h-[50vh] bg-cover bg-center"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70"></div>
      <div className="relative h-full container flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl lg:text-2xl text-white/90">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
