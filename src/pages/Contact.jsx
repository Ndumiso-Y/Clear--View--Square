import { useState } from 'react'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import FormField from '../components/FormField'
import { useCentreSettings } from '../hooks/useCentreSettings.js'

function getHoursDisplay(tradingHours) {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  const wdHours = weekdays.map(d => tradingHours[d]).filter(Boolean)
  const allSame = wdHours.length > 0 && wdHours.every(h => h === wdHours[0])
  const lines = []
  if (allSame) {
    lines.push(`Monday – Friday: ${wdHours[0]}`)
  } else {
    const labels = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' }
    weekdays.forEach(d => { if (tradingHours[d]) lines.push(`${labels[d]}: ${tradingHours[d]}`) })
  }
  if (tradingHours.saturday) lines.push(`Saturday: ${tradingHours.saturday}`)
  if (tradingHours.sunday)   lines.push(`Sunday: ${tradingHours.sunday}`)
  if (tradingHours.publicHolidayNote) lines.push(`Public Holidays: ${tradingHours.publicHolidayNote}`)
  return lines
}

export default function Contact() {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT
  const baseUrl = import.meta.env.BASE_URL
  const [formSuccess, setFormSuccess] = useState(false)
  const [tenantFormSuccess, setTenantFormSuccess] = useState(false)
  const { settings } = useCentreSettings()

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    if (endpoint) {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setFormSuccess(true)
    } else {
      const mailtoLink = `mailto:${settings.contact.email}?subject=General Enquiry&body=Name: ${encodeURIComponent(data.name)}%0D%0AContact: ${encodeURIComponent(data.contact)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(data.message)}`
      window.location.href = mailtoLink
    }
  }

  const handleTenantSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const leasingEmail = settings.leasing.email && settings.leasing.email !== settings.contact.email
      ? `,${settings.leasing.email}`
      : ''
    const mailtoLink = `mailto:${settings.contact.email}${leasingEmail}?subject=Tenant Application - ${encodeURIComponent(data.businessName)}&body=TENANT APPLICATION%0D%0A%0D%0AFull Name: ${encodeURIComponent(data.fullName)}%0D%0ABusiness Name: ${encodeURIComponent(data.businessName)}%0D%0AEmail: ${encodeURIComponent(data.email)}%0D%0APhone: ${encodeURIComponent(data.phone)}%0D%0ABusiness Category: ${encodeURIComponent(data.category)}%0D%0ASpace Requirements: ${encodeURIComponent(data.spaceRequirements)}%0D%0APreferred Start Date: ${encodeURIComponent(data.startDate)}%0D%0A%0D%0AAdditional Information:%0D%0A${encodeURIComponent(data.additionalInfo)}`

    window.location.href = mailtoLink
    setTenantFormSuccess(true)
  }

  return (
    <div className="pt-20 md:pt-24 bg-gradient-to-b from-white to-brand-bg min-h-screen">
      <PageHero
        title="Get in Touch"
        subtitle="We're here to help with enquiries, leasing opportunities, and more"
        backgroundImage="assets/hero/clearview-hero-contact-connections-01.jpg"
      />

      {/* About Clearview Square */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto card border border-black/5 shadow-md">
          <SectionHeading
            title="About Clearview Square"
            subtitle="Clearview Square is a modern convenience shopping centre in the heart of Rustenburg, offering a diverse mix of fashion, food, home, and essential services. The centre is designed for everyday convenience, serving local residents, families, professionals, and commuters with easy access, secure parking, and a friendly shopping environment."
            className="mb-0"
          />
        </div>
      </div>

      <div className="container pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: Centre Information & General Enquiries */}
          <div>
            <SectionHeading
              title="Centre Information"
              subtitle="Visit us at Clearview Square Shopping Centre for all your shopping needs."
            />

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="card border border-black/5 flex items-start gap-4 shadow-sm">
                <div className="bg-black/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Address</h3>
                  <p className="text-brand-mid">{settings.contact.address}</p>
                </div>
              </div>

              <div className="card border border-black/5 flex items-start gap-4 shadow-sm">
                <div className="bg-black/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Trading Hours</h3>
                  <div className="text-brand-mid space-y-1">
                    {getHoursDisplay(settings.tradingHours).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <p className="text-brand-light text-sm mt-2">*Individual store hours may vary</p>
                  </div>
                </div>
              </div>

              <div className="card border border-black/5 flex items-start gap-4 shadow-sm">
                <div className="bg-black/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Phone</h3>
                  <p className="text-brand-mid">{settings.contact.phone}</p>
                </div>
              </div>

              <div className="card border border-black/5 flex items-start gap-4 shadow-sm">
                <div className="bg-black/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">Email</h3>
                  <p className="text-brand-mid">
                    <a href={`mailto:${settings.contact.email}`} className="hover:underline">{settings.contact.email}</a>
                  </p>
                </div>
              </div>

              <div className="card border border-black/5 flex items-start gap-4 shadow-sm opacity-75">
                <div className="bg-black/10 rounded-lg p-3">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-1">WhatsApp</h3>
                  <p className="text-brand-light text-sm italic">Currently not available</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card border border-black/5 mb-8 shadow-sm">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Follow Us on Social Media</h3>
              <div className="flex gap-4">
                <a
                  href={settings.socialLinks.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 hover:bg-black/20 text-brand-accentStrong hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  aria-label="Facebook (Opens in new window)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={settings.socialLinks.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-black/10 hover:bg-black/20 text-brand-accentStrong hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  aria-label="Instagram (Opens in new window)"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* General Enquiry Form */}
            <div className="card border border-black/5 shadow-md">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Send us a message</h3>
              {formSuccess ? (
                <div className="bg-black/5 border border-black/20 rounded-xl p-6 text-center animate-fadeIn">
                  <svg className="w-12 h-12 text-brand-accentStrong mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-brand-dark font-semibold">Thank you! We will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    label="Name"
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                  />
                  <FormField
                    label="Email or Phone"
                    id="contact-contact"
                    name="contact"
                    type="text"
                    placeholder="How can we reach you?"
                    required
                  />
                  <FormField
                    label="Message"
                    id="contact-message"
                    name="message"
                    type="textarea"
                    rows="5"
                    placeholder="Tell us how we can help..."
                    required
                  />

                  <p className="text-xs text-brand-mid opacity-75 mt-4 leading-relaxed">
                    * By submitting this form, you consent to Clearview Square processing your personal information in accordance with the Protection of Personal Information Act (POPIA). We will only use your details to respond to your request.
                  </p>

                  <button
                    type="submit"
                    className="btn w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  >
                    Send Message
                  </button>

                  {!endpoint && (
                    <p className="text-[11px] text-brand-mid text-center italic mt-2">
                      Note: Submitting this form will open your default email application to send the details.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* RIGHT: Leasing Opportunities & Tenant Application */}
          <div>
            <SectionHeading
              title="Leasing Opportunities"
              subtitle="Clearview Square welcomes new tenants who align with our vision of convenience, quality, and customer experience. We offer competitive leasing options, high foot traffic, strong anchor tenants, and a supportive management team committed to your business success."
            />

            {/* Why Clearview Card */}
            <div className="card border border-transparent mb-6 bg-gradient-to-br from-brand-dark to-brand-dark text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Why Clearview Square?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Prime location in Rustenburg Central with high foot traffic</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Curated tenant mix attracting diverse customer demographics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Ample secure parking (250+ bays) and modern facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Professional centre management and 24/7 security</span>
                </li>
              </ul>
            </div>

            {/* Leasing Contact */}
            <div className="card border border-black/5 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Leasing Enquiries</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-black/10 rounded-lg p-3">
                    <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">Leasing Office</h4>
                    <p className="text-brand-mid text-sm">{settings.leasing.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-black/10 rounded-lg p-3">
                    <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">Email</h4>
                    <p className="text-brand-mid text-sm">
                      <a href={`mailto:${settings.leasing.email || settings.contact.email}`} className="hover:underline">
                        {settings.leasing.email || settings.contact.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Application Form */}
            <div className="card border border-black/5 shadow-md">
              <h3 className="text-xl font-bold text-brand-dark mb-2">Tenant Application</h3>
              <p className="text-brand-mid text-sm mb-6">Interested in opening a store at Clearview Square? Share your details below and our leasing team will get in touch.</p>

              {tenantFormSuccess ? (
                <div className="bg-black/5 border border-black/20 rounded-xl p-6 text-center animate-fadeIn">
                  <svg className="w-12 h-12 text-brand-accentStrong mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-brand-dark font-semibold">Thank you. Our leasing team will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleTenantSubmit} className="space-y-4">
                  <FormField
                    label="Full Name"
                    id="tenant-fullname"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    required
                  />
                  <FormField
                    label="Business Name"
                    id="tenant-businessname"
                    name="businessName"
                    type="text"
                    placeholder="Name of your business"
                    required
                  />
                  <FormField
                    label="Email Address"
                    id="tenant-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                  <FormField
                    label="Phone Number"
                    id="tenant-phone"
                    name="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                  <FormField
                    label="Business Category"
                    id="tenant-category"
                    name="category"
                    type="select"
                    required
                    options={[
                      { value: '', label: 'Select a category', disabled: true },
                      { value: 'Food & Beverage', label: 'Food & Beverage' },
                      { value: 'Fashion & Footwear', label: 'Fashion & Footwear' },
                      { value: 'Services', label: 'Services' },
                      { value: 'Health & Beauty', label: 'Health & Beauty' },
                      { value: 'Financial Services', label: 'Financial Services' },
                      { value: 'Electronics & Tech', label: 'Electronics & Tech' },
                      { value: 'Other', label: 'Other' }
                    ]}
                  />
                  <FormField
                    label="Space Requirements"
                    id="tenant-space"
                    name="spaceRequirements"
                    type="text"
                    placeholder="e.g. Retail unit, kiosk, approx 50m²"
                  />
                  <FormField
                    label="Preferred Start Date"
                    id="tenant-startdate"
                    name="startDate"
                    type="date"
                  />
                  <FormField
                    label="Additional Information / Business Description"
                    id="tenant-info"
                    name="additionalInfo"
                    type="textarea"
                    rows="4"
                    placeholder="Tell us about your business concept, target market, experience, etc."
                  />

                  <p className="text-xs text-brand-mid opacity-75 mt-4 leading-relaxed">
                    * By submitting this form, you consent to Clearview Square processing your personal information in accordance with the Protection of Personal Information Act (POPIA). We will only use your details for leasing assessment purposes.
                  </p>

                  <button
                    type="submit"
                    className="btn w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
                  >
                    Submit Application
                  </button>

                  <p className="text-[11px] text-brand-mid text-center italic mt-2">
                    Note: Submitting this form will open your default email application to send your application details.
                  </p>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="card border border-black/5 mt-6 shadow-sm">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Find Us</h3>
              <div className="rounded-xl overflow-hidden border border-black/5">
                <iframe
                  title="Clearview Square Location Map"
                  className="w-full h-64 border-0"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=27.23%2C-25.68%2C27.25%2C-25.66&layer=mapnik&marker=-25.667%2C27.242"
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=-25.667,27.242"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-alt w-full mt-4 text-center inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>

        {/* Lost & Found Section - Full Width */}
        <div className="mt-16">
          <div className="card border border-black/5 max-w-5xl mx-auto shadow-md">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
              <div className="flex-shrink-0 w-full md:w-32">
                <img
                  src={`${baseUrl}assets/Lost and found .png`}
                  alt="Lost and Found icon representation"
                  loading="lazy"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">Lost & Found</h2>
                <p className="text-brand-mid leading-relaxed">
                  Lost something at Clearview Square? Our centre management team keeps a central Lost & Found register for items found in common areas and handed in by stores or security.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Lost an item */}
              <div className="bg-black/5 rounded-xl p-6 border border-black/5">
                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Lost an item?
                </h3>
                <p className="text-brand-mid mb-4">If you've lost an item:</p>
                <ul className="space-y-2 text-brand-mid text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong font-bold">•</span>
                    <span>Visit the Centre Management office during trading hours, or</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong font-bold">•</span>
                    <span>Email: <a href={`mailto:${settings.contact.email}`} className="font-semibold hover:underline">{settings.contact.email}</a></span>
                  </li>
                </ul>
                <p className="text-brand-mid text-sm font-semibold mb-2">Please provide:</p>
                <ul className="space-y-1 text-brand-mid text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong">→</span>
                    <span>Your name and contact number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong">→</span>
                    <span>Date and approximate time you were at the centre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong">→</span>
                    <span>A clear description of the item</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong">→</span>
                    <span>Where you think you may have lost it (e.g. "near Checkers", "parking basement")</span>
                  </li>
                </ul>
              </div>

              {/* Right: Found an item */}
              <div className="bg-black/5 rounded-xl p-6 border border-black/5">
                <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-accentStrong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Found an item?
                </h3>
                <p className="text-brand-mid mb-4">Please hand it in at:</p>
                <ul className="space-y-2 text-brand-mid text-sm mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong font-bold">•</span>
                    <span>The Centre Management office, or</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-accentStrong font-bold">•</span>
                    <span>Any store manager, who will pass it on to management</span>
                  </li>
                </ul>
                <p className="text-brand-mid text-sm">Security and management will log the item and keep it safely while we try to contact the owner.</p>
              </div>
            </div>

            <div className="mt-6 bg-black/5 rounded-xl p-4 border-l-4 border-brand-dark text-sm">
              <p className="text-brand-mid">
                <span className="font-semibold text-brand-dark">Note:</span> Items are kept for a limited period before being responsibly disposed of or donated, where appropriate. Proof of ownership may be requested when collecting valuable items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
