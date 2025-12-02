
export default function Contact() {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT
  const baseUrl = import.meta.env.BASE_URL

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    if (endpoint) {
      fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
      alert('Thank you! We will get back to you soon.')
    } else {
      const mailtoLink = `mailto:info@clearviewsquare.co.za?subject=General Enquiry&body=Name: ${encodeURIComponent(data.name)}%0D%0AContact: ${encodeURIComponent(data.contact)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(data.message)}`
      window.location.href = mailtoLink
    }
  }

  const handleLeasingClick = () => {
    const mailtoLink = 'mailto:leasing@clearviewsquare.co.za?subject=Leasing Opportunity Enquiry'
    window.location.href = mailtoLink
  }

  return (
    <div className="bg-gradient-to-b from-white to-brand-bg min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${baseUrl}assets/hero/clearview-hero-contact-connections-01.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70"></div>
        <div className="relative h-full container flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-white/90">
              We're here to help with general enquiries or leasing opportunities
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: General Enquiries */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-brand-dark mb-3">General Enquiries</h2>
              <p className="text-brand-mid leading-relaxed">
                Have a question about our stores, facilities, or trading hours? We'd love to hear from you.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="card flex items-start gap-4">
                <div className="bg-brand-accent/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Address</h3>
                  <p className="text-brand-mid">166 Kock St, Rustenburg Central, North West</p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <div className="bg-brand-accent/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Phone</h3>
                  <p className="text-brand-mid">+27 14 592 1234</p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <div className="bg-brand-accent/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Email</h3>
                  <p className="text-brand-mid">info@clearviewsquare.co.za</p>
                </div>
              </div>

              <div className="card flex items-start gap-4">
                <div className="bg-brand-accent/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Trading Hours</h3>
                  <p className="text-brand-mid">Open 7 days • Extended hours</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border border-brand-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Email or Phone</label>
                  <input
                    name="contact"
                    type="text"
                    className="w-full border border-brand-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
                    placeholder="How can we reach you?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    className="w-full border border-brand-light rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                <button type="submit" className="btn w-full">
                  Send Message
                </button>
                <p className="text-xs text-brand-light text-center">
                  {endpoint ? 'Your message will be sent to our team' : 'Please email us at info@clearviewsquare.co.za while our online form is being upgraded'}
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT: Leasing Opportunities */}
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-brand-dark mb-3">Leasing Opportunities</h2>
              <p className="text-brand-mid leading-relaxed">
                Join our thriving community of retailers and service providers at Clearview Square.
              </p>
            </div>

            {/* Why Clearview Card */}
            <div className="card mb-6 bg-gradient-to-br from-brand-dark to-brand-accent text-white">
              <h3 className="text-2xl font-bold mb-4">Why Clearview Square?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prime location in Rustenburg Central with high foot traffic</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Curated tenant mix attracting diverse customer demographics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ample secure parking (500+ bays) and modern facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100% backup power ensuring continuous trading</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional centre management and 24/7 security</span>
                </li>
              </ul>
            </div>

            {/* Leasing Contact */}
            <div className="card">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Speak to our Leasing Team</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-accent/10 rounded-lg p-3">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">Leasing Manager</h4>
                    <p className="text-brand-mid text-sm">Available to discuss opportunities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-accent/10 rounded-lg p-3">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">Email</h4>
                    <p className="text-brand-mid text-sm">leasing@clearviewsquare.co.za</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-accent/10 rounded-lg p-3">
                    <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">Phone</h4>
                    <p className="text-brand-mid text-sm">+27 14 592 5678</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLeasingClick}
                className="btn w-full"
              >
                Email Leasing Team
              </button>
            </div>

            {/* Map */}
            <div className="card mt-6">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Find Us</h3>
              <div className="rounded-xl overflow-hidden">
                <iframe
                  title="Clearview Square Location"
                  className="w-full h-64"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=27.23%2C-25.68%2C27.25%2C-25.66&layer=mapnik&marker=-25.667%2C27.242"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=-25.667,27.242"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-alt w-full mt-4 text-center"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
