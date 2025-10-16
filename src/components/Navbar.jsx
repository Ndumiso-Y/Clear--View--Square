
import { NavLink } from 'react-router-dom'

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg ${isActive ? 'bg-brand-bg' : 'hover:bg-brand-bg'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src="/assets/brand/clearview-logo.png" alt="Clearview Square logo" className="h-9" />
          <span className="font-extrabold tracking-tight text-brand-dark">Clearview Square</span>
        </div>
        <nav className="flex items-center gap-2">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <LinkItem to="/stores">Stores</LinkItem>
          <LinkItem to="/promotions">Promos</LinkItem>
          <LinkItem to="/contact">Contact</LinkItem>
        </nav>
      </div>
    </header>
  )
}
