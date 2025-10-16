
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

function LinkItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg ${isActive ? 'bg-brand-bg' : 'hover:bg-brand-bg'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const baseUrl = import.meta.env.BASE_URL
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={`${baseUrl}assets/brand/clearview-logo.png`} alt="Clearview Square logo" className="h-9" />
          <span className="font-extrabold tracking-tight text-brand-dark">Clearview Square</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <LinkItem to="/stores">Stores</LinkItem>
          <LinkItem to="/promotions">Promos</LinkItem>
          <LinkItem to="/contact">Contact</LinkItem>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg hover:bg-brand-bg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container py-4 flex flex-col gap-2">
            <LinkItem to="/" onClick={closeMenu}>Home</LinkItem>
            <LinkItem to="/about" onClick={closeMenu}>About</LinkItem>
            <LinkItem to="/stores" onClick={closeMenu}>Stores</LinkItem>
            <LinkItem to="/promotions" onClick={closeMenu}>Promos</LinkItem>
            <LinkItem to="/contact" onClick={closeMenu}>Contact</LinkItem>
          </nav>
        </div>
      )}
    </header>
  )
}
