
import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import OptimizedImage from './OptimizedImage'

function LinkItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-white ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const baseUrl = import.meta.env.BASE_URL
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine navbar background based on page and scroll position
  const getNavbarStyle = () => {
    if (isHomePage) {
      // Home page: transparent at top, black when scrolled
      return isScrolled
        ? 'bg-black backdrop-blur border-b border-white/10'
        : 'bg-transparent'
    } else {
      // Other pages: always black
      return 'bg-black backdrop-blur border-b border-white/10'
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyle()}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <div className="flex items-center -ml-4 md:-ml-8">
            <OptimizedImage
              srcWebp="assets/logos/clearviewlogo_transparent.webp"
              srcFallback="assets/logos/clearviewlogo_transparent.png"
              alt="Clearview Square logo"
              width={400}
              height={158}
              loading="eager"
              className="h-14 md:h-20 w-auto max-w-[280px] md:max-w-[400px] object-contain"
            />
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
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black">
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
