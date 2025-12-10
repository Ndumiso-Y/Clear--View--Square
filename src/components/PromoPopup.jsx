import { useState, useEffect } from 'react'

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('clearview-promo-seen')

    // Show popup after 1 second if not seen in this session
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Mark as seen in sessionStorage (clears when browser closes)
    sessionStorage.setItem('clearview-promo-seen', 'true')
  }

  if (!isOpen) return null

  const baseUrl = import.meta.env.BASE_URL || '/'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-2xl hover:bg-gray-100 transition-colors group"
            aria-label="Close popup"
          >
            <svg className="w-6 h-6 text-gray-800 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={`${baseUrl}assets/logos/HeroDeskTop-red.jpg`}
              alt="Clearview Square - Your perfect shopping experience starts here!"
              className="w-full h-auto"
            />
          </div>

          {/* Optional: Don't show again button */}
          <div className="text-center mt-4">
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white text-sm underline transition-colors"
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
