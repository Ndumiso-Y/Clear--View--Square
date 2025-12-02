
export default function About() {
  const baseUrl = import.meta.env.BASE_URL

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-top"
        style={{ backgroundImage: `url(${baseUrl}assets/hero/clearview-hero-about-groceries-01.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70"></div>
        <div className="relative h-full container flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About Clearview Square</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Your premier shopping destination in the heart of Rustenburg Central
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <img
              src={`${baseUrl}assets/brand/Clearviewsquare-photo.jpg`}
              alt="Clearview Square Shopping Centre"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="bg-brand-accent/10 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-brand-dark mb-3">Location Highlights</h3>
              <ul className="space-y-2 text-brand-mid">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prime location in Rustenburg Central</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Near Engen filling station</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>High-street retail surroundings</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-brand-accent mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Family-friendly neighbourhood</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Our Story</h2>
              <div className="space-y-4 text-brand-mid leading-relaxed">
                <p>
                  Clearview Square is a newly proposed development located in Rustenburg Central,
                  a family neighbourhood in the south of Rustenburg, North-West. This convenience
                  shopping centre is expected to service an affluent, local market as well as the
                  surrounding areas.
                </p>
                <p>
                  The beautiful design and generous basement parking promote a safe and comfortable
                  shopping environment. Complementary facilities near the site include an Engen filling
                  station, high-street retail and various businesses.
                </p>
                <p>
                  Rustenburg is a large town in the North West and is also the most populated in the
                  province. It is well known for its mining and tourism industries. The town is also
                  a major contributor to the province's economy, establishing itself as a strong
                  economic node.
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <strong className="text-brand-dark">Address</strong>
                </div>
                <p className="text-brand-mid">166 Kock St, Rustenburg Central</p>
              </div>

              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <strong className="text-brand-dark">Contact</strong>
                </div>
                <p className="text-brand-mid">+27 xx xxx xxxx</p>
              </div>

              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong className="text-brand-dark">Status</strong>
                </div>
                <p className="text-brand-accent font-semibold">Now Open!</p>
              </div>

              <div className="card hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong className="text-brand-dark">Hours</strong>
                </div>
                <p className="text-brand-mid">7 Days a Week<br/>Extended Hours</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gradient-to-br from-brand-dark to-brand-accent rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Centre Amenities</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Generous Parking</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Outdoor Seating</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Backup Generator</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Anchor Supermarket</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-bg py-16">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Ready to Visit?
          </h2>
          <p className="text-xl text-brand-mid mb-8 max-w-2xl mx-auto">
            Explore our stores, enjoy our facilities, and experience shopping the way it should be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#/stores" className="btn text-lg">Browse Stores</a>
            <a href="#/contact" className="btn-alt text-lg">Get in Touch</a>
          </div>
        </div>
      </section>
    </div>
  )
}
