/**
 * Home — Spotify-inspired music theme. Dark layout, card-based sections.
 */
import { Link } from 'react-router-dom'
import { Music2, Users, ArrowRightCircle, ListMusic } from 'lucide-react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const QUICK_PICKS = [
  {
    title: 'Create Session',
    desc: 'Start a live jam. Share the link.',
    href: '/create',
    icon: Music2,
    gradient: 'from-violet-600 to-indigo-700',
  },
  {
    title: 'Convert Playlist',
    desc: 'Spotify → YouTube Music',
    href: '/convert',
    icon: ArrowRightCircle,
    gradient: 'from-emerald-600 to-green-600',
  },
]

const MADE_FOR_YOU = [
  { title: 'Live Sessions', desc: 'Real-time playlist. Everyone contributes.', icon: Users },
  { title: 'Shared Queue', desc: 'Key, BPM, difficulty. Organizer controls.', icon: ListMusic },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-music-bg text-music-text">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Greeting */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          {getGreeting()}
        </h1>

        {/* Quick Picks — Primary CTAs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Quick picks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_PICKS.map(({ title, desc, href, icon: Icon, gradient }) => (
              <Link
                key={title}
                to={href}
                className="group flex items-center gap-4 p-4 rounded-xl bg-music-card hover:bg-music-card-hover transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-lg block group-hover:text-music-accent transition-colors">
                    {title}
                  </span>
                  <span className="text-music-text-secondary text-sm">{desc}</span>
                </div>
                <ArrowRightCircle className="w-5 h-5 text-music-text-secondary group-hover:text-music-accent shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </section>

        {/* Made for you — Feature cards */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Made for you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MADE_FOR_YOU.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 rounded-xl bg-music-card hover:bg-music-card-hover transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-lg bg-music-surface flex items-center justify-center shrink-0 border border-white/10">
                  <Icon className="w-7 h-7 text-music-accent" />
                </div>
                <div>
                  <span className="font-bold text-lg block">{title}</span>
                  <span className="text-music-text-secondary text-sm">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jump back in — CTA strip */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Jump back in</h2>
          <div className="rounded-xl bg-gradient-to-r from-music-accent/20 to-accent/20 border border-white/10 p-6 md:p-8">
            <p className="text-music-text-secondary text-sm mb-4">
              Have a session link? Open it directly.
            </p>
            <p className="font-mono text-sm text-music-text-secondary mb-2">
              /session/your-slug
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-music-accent text-black font-bold hover:scale-105 transition-transform"
            >
              Create Session
              <ArrowRightCircle className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Browse all — Secondary nav */}
        <section>
          <h2 className="text-xl font-bold mb-4">Browse all</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/create"
              className="px-4 py-2 rounded-full bg-music-card hover:bg-music-card-hover text-sm font-medium transition-colors"
            >
              Create
            </Link>
            <Link
              to="/convert"
              className="px-4 py-2 rounded-full bg-music-card hover:bg-music-card-hover text-sm font-medium transition-colors"
            >
              Convert
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
