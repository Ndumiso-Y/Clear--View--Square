
export default function Contact() {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    if (endpoint) {
      fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
      alert('Submitted! (demo endpoint)')
    } else {
      window.location.href = `mailto:info@example.com?subject=Leasing/Enquiry&body=${encodeURIComponent(JSON.stringify(data, null, 2))}`
    }
  }

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold text-brand-dark">Contact & Location</h2>
      <p className="mt-2 text-brand-mid">Leasing or general enquiries — please reach out.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <form className="card grid gap-3" onSubmit={handleSubmit}>
          <input name="name" className="border rounded-xl p-3" placeholder="Your Name" required />
          <input name="contact" className="border rounded-xl p-3" placeholder="Email or Phone" required />
          <textarea name="message" className="border rounded-xl p-3" rows="5" placeholder="Message" required />
          <button type="submit" className="btn w-fit">Send</button>
          <p className="text-xs text-brand-light">If no endpoint is configured, this opens your mail client.</p>
        </form>
        <div className="card">
          <p><strong>Address:</strong> 166 Kock St, Rustenburg</p>
          <p className="mt-2"><strong>Phone:</strong> xxxx</p>
          <div className="mt-4">
            <iframe
              title="Map"
              className="w-full h-64 rounded-xl"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=27.23%2C-25.68%2C27.25%2C-25.66&layer=mapnik&marker=-25.667%2C27.242">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
