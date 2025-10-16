import { useEffect, useState } from 'react'

function isActive(p) {
  const now = new Date()
  const s = new Date(p.start)
  const e = new Date(p.end)
  return now >= s && now <= e
}

export default function Promotions() {
  const [items, setItems] = useState([])
  useEffect(()=> {
    fetch('/data/promotions.json').then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }, [])

  const active = items.filter(isActive)
  const upcoming = items.filter(p => new Date(p.start) > new Date())

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold">Promotions & Events</h2>
      <p className="mt-2 text-brand-mid">Time-boxed cards auto-expire based on dates.</p>

      <section className="mt-6">
        <h3 className="text-xl font-semibold">Now On</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {active.length ? active.map(p => (
            <article key={p.id} className="card">
              <img src={p.image} alt="" className="rounded-xl mb-3" />
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-brand-mid mt-1">{p.summary}</p>
              <a className="btn mt-3 w-fit" href={p.ctaUrl}>{p.ctaText || 'Learn more'}</a>
            </article>
          )) : <p className="text-brand-light">No active promotions.</p>}
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-xl font-semibold">Upcoming</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
          {upcoming.length ? upcoming.map(p => (
            <article key={p.id} className="card">
              <img src={p.image} alt="" className="rounded-xl mb-3" />
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-brand-mid mt-1">{p.summary}</p>
              <a className="btn mt-3 w-fit" href={p.ctaUrl}>{p.ctaText || 'Learn more'}</a>
            </article>
          )) : <p className="text-brand-light">No upcoming items yet.</p>}
        </div>
      </section>
    </div>
  )
}
