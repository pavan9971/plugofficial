import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileSearchRef = useRef(null)
  const isAdminRoute = location.pathname.startsWith('/admin')
  const searchQuery = searchParams.get('q') ?? ''

  if (isAdminRoute) return null

  function handleSearchChange(e) {
    const value = e.target.value
    if (value) {
      setSearchParams({ q: value }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') closeMobileMenu()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      const timer = setTimeout(() => mobileSearchRef.current?.focus(), 0)
      return () => clearTimeout(timer)
    }
  }, [mobileMenuOpen])

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 bg-transparent p-0 rounded-lg overflow-hidden focus:outline-none focus:ring-0">
            <img src="/hapnin-logo.png" alt="Hapnin" className="h-10 w-10 object-contain block border-0" />
            <span className="text-white font-extrabold text-2xl tracking-tight">Hapnin</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-gray-300 hover:text-white font-medium" href="/#events">Browse Events</a>
            <a className="text-gray-300 hover:text-white font-medium" href="/#events">Categories</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                className="pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg text-sm focus:ring-primary focus:border-primary w-64"
                placeholder="Search events..."
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link
              to="/admin/login"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 min-h-[44px] flex items-center rounded-lg font-semibold text-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay and drawer - rendered via portal to avoid stacking/overflow issues */}
      {mobileMenuOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-black/50 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <div
              id="mobile-menu"
              className="fixed top-0 right-0 z-[9999] w-full max-w-sm h-full bg-gray-900 shadow-xl md:hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex justify-between items-center h-20 px-4 border-b border-gray-800 shrink-0">
                <span className="text-white font-extrabold text-xl">Menu</span>
                <button
                  type="button"
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                <div>
                  <label htmlFor="mobile-search" className="sr-only">Search events</label>
                  <div className="relative">
                    <input
                      ref={mobileSearchRef}
                      id="mobile-search"
                      className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg text-sm focus:ring-primary focus:border-primary touch-manipulation"
                      placeholder="Search events..."
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoComplete="off"
                      inputMode="search"
                    />
                    <svg className="w-4 h-4 text-gray-500 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  <a
                    className="text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 min-h-[44px] flex items-center"
                    href="/#events"
                    onClick={closeMobileMenu}
                  >
                    Browse Events
                  </a>
                  <a
                    className="text-gray-300 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 min-h-[44px] flex items-center"
                    href="/#events"
                    onClick={closeMobileMenu}
                  >
                    Categories
                  </a>
                  <Link
                    to="/admin/login"
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors min-h-[44px] flex items-center justify-center"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                </nav>
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  )
}
