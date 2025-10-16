import { useState, useEffect } from 'react'
import Carousel from '../components/Carousel.jsx'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const grandOpeningImages = [
    { src: '/assets/grandopeningphotos/GrandOpeningPhoto1.jpg', alt: 'Grand Opening - Ribbon Cutting', caption: 'Grand Opening Celebration' },
    { src: '/assets/grandopeningphotos/GrandOpeningPhoto2.jpg', alt: 'Grand Opening - Crowd', caption: 'Community Gathering' },
    { src: '/assets/grandopeningphotos/GrandOpeningPhoto3.jpg', alt: 'Grand Opening - Store Interior', caption: 'Welcome to Clearview Square' },
    { src: '/assets/grandopeningphotos/GrandOpeningPhoto4.jpg', alt: 'Grand Opening - Festivities', caption: 'Celebrating Together' },
  ]

  const features = [
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "Ample Parking",
      desc: "Generous basement and shaded surface parking with 24/7 security.",
      highlight: "500+ Bays"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Outdoor Seating",
      desc: "Beautiful outdoor spaces with modern furniture and shade coverage.",
      highlight: "Family Friendly"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Backup Power",
      desc: "100% uptime with our full generator backup system.",
      highlight: "Always On"
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Anchor Supermarket",
      desc: "Premium supermarket with fresh produce and everyday essentials.",
      highlight: "Open Daily"
    }
  ]

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section with Parallax */}
      <section className="relative h-screen">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${baseUrl}assets/brand/Clearviewsquare-photo.jpg)`,
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-transparent animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>

        {/* Content */}
        <div className="relative h-full container flex items-center">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 animate-slide-in-left">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-white font-medium">Now Open in Rustenburg Central</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none mb-6">
              <span className="block text-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Welcome to
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-light animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Clearview Square
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-white/95 leading-relaxed mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Your premier shopping destination — where <span className="font-semibold text-white">convenience</span> meets <span className="font-semibold text-white">comfort</span> with secure parking, modern facilities, and family-friendly spaces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <a
                href="#/stores"
                className="group relative btn text-lg px-10 py-5 shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Our Stores
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-dark opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="#/about"
                className="group btn-alt text-lg px-10 py-5 shadow-2xl backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all"
              >
                <span className="flex items-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl animate-fade-in" style={{ animationDelay: '1s' }}>
              <div>
                <div className="text-4xl font-bold text-white mb-1">16+</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">Stores</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">Parking Bays</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">7</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">Days Open</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white animate-bounce">
          <span className="text-sm uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section with Enhanced Design */}
      <section className="relative py-24 md:py-32 bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-accent/10 rounded-full text-brand-accent font-semibold text-sm mb-4">
              WHAT WE OFFER
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              World-Class Amenities
            </h2>
            <p className="text-xl text-brand-mid max-w-2xl mx-auto">
              Everything you need for a comfortable and convenient shopping experience
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative card hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Highlight Badge */}
                <div className="absolute -top-3 -right-3 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {feature.highlight}
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-brand-accent/10 rounded-2xl blur-xl group-hover:bg-brand-accent/20 transition-colors"></div>
                  <div className="relative text-brand-accent group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-2xl mb-3 text-brand-dark group-hover:text-brand-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-brand-mid leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-brand-accent/0 group-hover:border-brand-accent/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grand Opening Carousel with Enhanced Design */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-brand-bg to-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-accent/10 rounded-full text-brand-accent font-semibold text-sm mb-4">
              GRAND OPENING
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Celebrating Our Launch
            </h2>
            <p className="text-xl text-brand-mid max-w-3xl mx-auto">
              Relive the excitement of our grand opening celebration and discover what makes Clearview Square the heart of Rustenburg Central
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel images={grandOpeningImages} autoPlayInterval={6000} />
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-accent to-brand-dark"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Visit Us Today
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Experience shopping the way it should be — convenient, safe, and enjoyable. We're open 7 days a week with extended hours for your convenience.
              </p>

              {/* Info List */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 rounded-lg p-3 group-hover:bg-white/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Location</div>
                    <div className="text-white/80">166 Kock St, Rustenburg Central, North West</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 rounded-lg p-3 group-hover:bg-white/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Trading Hours</div>
                    <div className="text-white/80">Monday - Sunday • Extended Hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-white/10 rounded-lg p-3 group-hover:bg-white/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Safety First</div>
                    <div className="text-white/80">24/7 Security • CCTV Monitoring</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-2xl hover:shadow-white/20 group"
                >
                  Get Directions
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#/stores"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-brand-dark transition-all"
                >
                  View Stores
                </a>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <img
                src={`${baseUrl}assets/brand/Clearviewsquare-photo.jpg`}
                alt="Clearview Square"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white text-brand-dark p-6 rounded-2xl shadow-2xl">
                <div className="text-3xl font-bold mb-1">Open Now</div>
                <div className="text-sm text-brand-mid">Visit us today!</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
