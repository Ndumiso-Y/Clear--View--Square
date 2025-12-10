import { useState, useEffect, useRef } from 'react'
import WeatherWidget from '../components/WeatherWidget'
import ChatBot from '../components/ChatBot'
import PromoPopup from '../components/PromoPopup'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [storeCount, setStoreCount] = useState(16)
  const [animatedStoreCount, setAnimatedStoreCount] = useState(0)
  const [animatedParkingCount, setAnimatedParkingCount] = useState(0)
  const [animatedDaysCount, setAnimatedDaysCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const statsRef = useRef(null)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Fetch stores and count only visible ones
    fetch(`${baseUrl}data/stores.json`)
      .then(r => r.json())
      .then(stores => {
        const visibleStores = stores.filter(s => s.isVisible !== false)
        setStoreCount(visibleStores.length)
      })
      .catch(() => setStoreCount(16)) // fallback
  }, [baseUrl])

  // Counting animation for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          // Animate store count
          const storeInterval = setInterval(() => {
            setAnimatedStoreCount(prev => {
              if (prev >= storeCount) {
                clearInterval(storeInterval)
                return storeCount
              }
              return prev + 1
            })
          }, 50)

          // Animate parking count
          const parkingInterval = setInterval(() => {
            setAnimatedParkingCount(prev => {
              if (prev >= 250) {
                clearInterval(parkingInterval)
                return 250
              }
              return prev + 5
            })
          }, 20)

          // Animate days count
          const daysInterval = setInterval(() => {
            setAnimatedDaysCount(prev => {
              if (prev >= 7) {
                clearInterval(daysInterval)
                return 7
              }
              return prev + 1
            })
          }, 100)
        }
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [storeCount, hasAnimated])

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
      {/* Custom style for mobile video positioning */}
      <style>{`
        @media (max-width: 767px) {
          .hero-video-mobile {
            object-position: 58% center !important;
          }
        }
      `}</style>
      {/* Enhanced Hero Section with Responsive Images */}
      <section className="relative h-screen">
        {/* Background Video with Image Fallback */}
        <div className="absolute inset-0">
          {/* Video Hero - Looping, No Controls */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video-mobile absolute inset-0 w-full h-full object-cover md:object-center"
            poster={`${baseUrl}assets/logos/HeroDeskTop-red.jpg`}
          >
            <source src={`${baseUrl}assets/hero/MovementStar-hq.mp4`} type="video/mp4" />
            {/* Fallback images if video doesn't load */}
            <img
              src={`${baseUrl}assets/logos/HeroDeskTop-red.jpg`}
              alt="Clearview Square Shopping Centre"
              className="hidden md:block absolute inset-0 w-full h-full object-cover"
            />
            <img
              src={`${baseUrl}assets/logos/HeroMobile-red.jpg`}
              alt="Clearview Square Shopping Centre"
              className="block md:hidden absolute inset-0 w-full h-full object-cover object-right"
            />
          </video>
          {/* Balanced overlay for color visibility and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/55"></div>
        </div>

        {/* Content */}
        <div className="relative h-full container flex items-end pb-8 md:pb-12">
          <div className="max-w-full md:max-w-4xl md:-ml-80">
            {/* Subtitle - positioned below the logo in the image */}
            <p className="text-lg sm:text-xl md:text-3xl text-white/95 leading-relaxed mb-8 md:mb-10 max-w-xl md:max-w-2xl">
              Your premier shopping destination — where <span className="font-semibold text-white">convenience</span> meets <span className="font-semibold text-white">comfort</span> with secure parking, modern facilities, and family-friendly spaces.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 md:mb-16">
              <a
                href="#/stores"
                className="group relative btn text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Our Stores
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand-dark opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="#/about"
                className="group btn-alt text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 shadow-2xl backdrop-blur-sm border-2 border-white/20 hover:border-white/40 transition-all"
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
            <div ref={statsRef} className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-xl md:max-w-2xl">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{animatedStoreCount}+</div>
                <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Stores</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{animatedParkingCount}+</div>
                <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Parking Bays</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{animatedDaysCount}</div>
                <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Days Open</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="relative py-16 bg-brand-bg">
        <div className="container">
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Stores Quick Link */}
            <a
              href="#/stores"
              className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-black/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center text-brand-accentStrong group-hover:bg-brand-accentStrong group-hover:text-white transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-accentStrong transition-colors">
                    Stores
                  </h3>
                  <p className="text-brand-mid text-sm">
                    Browse all tenants at Clearview Square
                  </p>
                </div>
                <svg className="w-5 h-5 text-brand-light group-hover:text-brand-accentStrong group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Trading Hours Quick Link */}
            <a
              href="#trading-hours"
              className="group bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-black/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center text-brand-accentStrong group-hover:bg-brand-accentStrong group-hover:text-white transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-accentStrong transition-colors">
                    Trading Hours
                  </h3>
                  <p className="text-brand-mid text-sm">
                    View our daily and weekend trading hours
                  </p>
                </div>
                <svg className="w-5 h-5 text-brand-light group-hover:text-brand-accentStrong group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Design */}
      <section className="relative py-24 md:py-32 bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-black/10 rounded-full text-brand-accentStrong font-semibold text-sm mb-4">
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
                <div className="absolute -top-3 -right-3 bg-brand-accentStrong text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {feature.highlight}
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-black/10 rounded-2xl blur-xl group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative text-brand-accentStrong group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-2xl mb-3 text-brand-dark group-hover:text-brand-accentStrong transition-colors">
                  {feature.title}
                </h3>
                <p className="text-brand-mid leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-black/0 group-hover:border-black/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Tiles Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-brand-bg to-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-black/10 rounded-full text-brand-accentStrong font-semibold text-sm mb-4">
              EXPLORE BY EXPERIENCE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              Find What You're Looking For
            </h2>
            <p className="text-xl text-brand-mid max-w-3xl mx-auto">
              Discover shopping experiences tailored to your needs — in just a few taps
            </p>
          </div>

          {/* 3 Experience Tiles Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tile 1: Food & Coffee */}
            <a
              href="/#/stores?group=food-drink"
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${baseUrl}assets/tiles/tile-food-drink-burger-01.jpg)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">FLAVOUR & COFFEE</h3>
                <p className="text-white/90 mb-4">From quick bites to relaxed catch-ups.</p>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                  EXPLORE FOOD & DRINK
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Tile 2: Style & Everyday */}
            <a
              href="/#/stores?group=fashion-lifestyle"
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${baseUrl}assets/tiles/tile-fashion-lifestyle-01.jpg)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">STYLE & EVERYDAY</h3>
                <p className="text-white/90 mb-4">Fashion and essentials for every day.</p>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                  EXPLORE FASHION & LIFESTYLE
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Tile 3: Services & Essentials */}
            <a
              href="/#/stores?group=services-essentials"
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${baseUrl}assets/tiles/tile-services-essentials-training-01.jpg)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">SERVICES & ESSENTIALS</h3>
                <p className="text-white/90 mb-4">Banks, fitness, grooming, tech & more.</p>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                  EXPLORE SERVICES
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section id="trading-hours" className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark"></div>
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

                <WeatherWidget />
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

      {/* AI Chatbot */}
      <ChatBot />

      {/* Promotional Popup */}
      <PromoPopup />
    </div>
  )
}
