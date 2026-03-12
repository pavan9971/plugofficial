/**
 * Navigation — Sticky bar, dark music theme. Matches Spotify-inspired home.
 */
import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 h-16 bg-music-bg/95 backdrop-blur border-b border-white/10">
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-music-text font-bold text-xl tracking-tight">
          JamSpace
        </Link>
        <div className="flex gap-6">
          <Link
            to="/create"
            className="text-sm font-medium text-music-text-secondary hover:text-music-text transition-colors"
          >
            Create
          </Link>
          <Link
            to="/convert"
            className="text-sm font-medium text-music-text-secondary hover:text-music-text transition-colors"
          >
            Convert
          </Link>
        </div>
      </div>
    </nav>
  )
}
