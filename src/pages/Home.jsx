import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import EventCard from '../components/EventCard'

const CATEGORIES = [
  'All Events',
  'Concerts',
  'Hackathons',
  'Jamming Sessions',
  'Art Gallery',
  'Music',
  'Tech',
  'Live Music',
  'Workshop',
  'Education',
  'Cinema',
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') ?? '').toLowerCase().trim()
  const { events, loading, error } = useEvents()
  const [selectedCategory, setSelectedCategory] = useState('All Events')
  const [sortBy, setSortBy] = useState('latest')

  const filteredAndSorted = useMemo(() => {
    let list = [...events]
    if (searchQuery) {
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(searchQuery) ||
          e.category?.toLowerCase().includes(searchQuery) ||
          e.location?.toLowerCase().includes(searchQuery) ||
          e.description?.toLowerCase().includes(searchQuery)
      )
    }
    if (selectedCategory !== 'All Events') {
      list = list.filter((e) => e.category === selectedCategory)
    }
    if (sortBy === 'latest') {
      list.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'soonest') {
      list.sort((a, b) => new Date(a.date) - new Date(b.date))
    }
    return list
  }, [events, selectedCategory, sortBy, searchQuery])

  return (
    <div className="antialiased">
      {/* Hero */}
      <header className="relative overflow-hidden bg-primary-light pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-primary bg-white rounded-full">
                Explore the city
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Find your next <span className="text-primary">urban adventure</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 sm:mt-5">
                Discover underground jamming sessions, high-energy live concerts, and collaborative tech hackathons happening in the heart of your city today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <a
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10 transition-all"
                  href="#events"
                >
                  Explore Events
                </a>
                <a
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all"
                  href="#events"
                >
                  How it works
                </a>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg overflow-hidden">
                <img
                  alt="Urban Lifestyle 3D Illustration"
                  className="w-full h-auto drop-shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqVMKAvDIutn2YeKjmTWP97JT-TCMeZ1Bwfdn1NDYRSk4fUPtme6IlgHUJYftiu51GsNsCfsf5ndxVTiVmWp1p-bwoAs3ZydlYrX7rYi_WsBE6cwuYh91WMYlifjdkmrM43MeasQHUPnrPOXYLk2NaCXzJHZDVhpgEI9PdDNkdVCkmgYdVEukzqytyZYf0DwXnlGyX5k9GfUw1UTNqNRgMJbJhU4Sqd5HPBLRpwWe124ofPesdn2Brt-9PCRXfz17ljL46QrsRcCD_"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 -mb-16 -mr-16 opacity-10">
          <svg fill="none" height="384" viewBox="0 0 404 384" width="404">
            <defs>
              <pattern height="20" id="grid" patternUnits="userSpaceOnUse" width="20" x="0" y="0">
                <rect className="text-primary" fill="currentColor" height="4" width="4" x="0" y="0" />
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="384" width="404" />
          </svg>
        </div>
      </header>

      {/* Filters */}
      <section className="py-12 bg-white" id="events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchParams.get('q') ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val) setSearchParams({ q: val })
                    else setSearchParams({})
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-500">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-gray-50 rounded-lg text-sm font-medium focus:ring-primary"
                >
                  <option value="latest">Latest First</option>
                  <option value="soonest">Soonest First</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 min-h-[44px] flex items-center rounded-lg font-medium ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Grid */}
      <main className="pb-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="pt-12 text-center text-gray-500">Loading events...</div>
          ) : error ? (
            <div className="pt-12 text-center text-red-500">Failed to load events</div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="pt-12 text-center text-gray-500">No events found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
              {filteredAndSorted.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/hapnin-logo.png" alt="Hapnin" className="h-10 w-10 object-contain" />
                <span className="text-white font-extrabold text-2xl tracking-tight">Hapnin</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                Connecting creators, musicians, and innovators with the heartbeat of their city. Never miss what&apos;s happening.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Explore</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#events">Popular Events</a></li>
                <li><a className="hover:text-primary transition-colors" href="#events">Newly Added</a></li>
                <li><a className="hover:text-primary transition-colors" href="#events">Weekend Specials</a></li>
                <li><a className="hover:text-primary transition-colors" href="#events">Free Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Get the weekly digest of best events in your area.</p>
              <div className="flex gap-2">
                <input
                  className="bg-gray-800 border-none rounded-lg text-sm focus:ring-primary w-full px-4 py-2"
                  placeholder="Email address"
                  type="email"
                />
                <button className="bg-primary hover:bg-primary-dark px-4 py-3 min-h-[44px] flex items-center rounded-lg transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} Hapnin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
