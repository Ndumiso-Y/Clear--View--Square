import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-6xl font-bold text-brand-dark">404</h1>
      <p className="mt-4 text-xl text-brand-mid">Page not found</p>
      <p className="mt-2 text-brand-light">The page you're looking for doesn't exist or has been moved.</p>
      <div className="mt-8 flex gap-4 justify-center">
        <Link to="/" className="btn">Go Home</Link>
        <Link to="/stores" className="btn-alt">Browse Stores</Link>
      </div>
    </div>
  )
}
