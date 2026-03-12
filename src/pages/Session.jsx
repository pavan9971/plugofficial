import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { usePlaylist } from '../hooks/usePlaylist'
import { useAttendees } from '../hooks/useAttendees'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Music, Users, Lightbulb } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import PosterButton from '../components/PosterButton'

const INSTRUMENTS = ['Guitar', 'Bass', 'Drums', 'Keyboard', 'Vocals', 'Violin', 'Flute', 'Other']

export default function Session() {
  const { slug } = useParams()
  const { session, loading } = useSession(slug)
  const { songs } = usePlaylist(session?.id)
  const { attendees, joinSession } = useAttendees(session?.id)

  const [tab, setTab] = useState('playlist')
  const [hasJoined, setHasJoined] = useState(false)
  const [name, setName] = useState('')
  const [instrument, setInstrument] = useState('')
  const [suggestion, setSuggestion] = useState({ title: '', artist: '' })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="text-text text-lg">Loading session...</div>
    </div>
  )

  if (!session) return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="text-text">Session not found</div>
    </div>
  )

  const currentSong = songs[session.current_song_index]

  async function handleJoin() {
    if (!name || !instrument) return toast.error('Enter your name and instrument')
    const { error } = await joinSession(name, instrument)
    if (error) return toast.error('Could not join')
    setHasJoined(true)
    toast.success('You\'re in!')
  }

  async function handleSuggest() {
    if (!suggestion.title) return toast.error('Enter a song title')
    await supabase.from('suggestions').insert({
      session_id: session.id,
      title: suggestion.title,
      artist: suggestion.artist,
      suggested_by: name || 'Anonymous'
    })
    setSuggestion({ title: '', artist: '' })
    toast.success('Suggestion sent to organizer!')
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          {session.is_live && (
            <span className="bg-accent text-cream text-xs px-2 py-0.5 font-bold uppercase tracking-wider">
              LIVE
            </span>
          )}
          <span className="text-muted text-sm">{session.studio_name}</span>
        </div>
        <h1 className="text-2xl font-bold text-text">{session.title}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {new Date(session.date).toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      {/* Now Playing */}
      {session.is_live && currentSong && (
        <div className="mb-6 p-6 border border-accent bg-accent/10">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-1">Now Playing</p>
          <p className="text-lg font-bold text-text">{currentSong.title}</p>
          <p className="text-text-secondary text-sm">{currentSong.artist}</p>
          <div className="flex gap-3 mt-2">
            {currentSong.key && (
              <span className="border border-border px-2 py-1 text-xs text-text">Key: {currentSong.key}</span>
            )}
            {currentSong.bpm && (
              <span className="border border-border px-2 py-1 text-xs text-text">{currentSong.bpm} BPM</span>
            )}
            {currentSong.difficulty && (
              <span className="border border-border px-2 py-1 text-xs text-text capitalize">{currentSong.difficulty}</span>
            )}
          </div>
        </div>
      )}

      {/* Join Card (if not joined) */}
      {!hasJoined && (
        <div className="mb-6 p-6 border border-border">
          <p className="font-bold text-text mb-3">Join this session</p>
          <input
            className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-2"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select
            className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-3"
            value={instrument}
            onChange={e => setInstrument(e.target.value)}
          >
            <option value="">Select instrument</option>
            {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <PosterButton onClick={handleJoin}>
            Join Session
          </PosterButton>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {[
          { id: 'playlist', label: 'Playlist', icon: Music },
          { id: 'attendees', label: `Who's In (${attendees.length})`, icon: Users },
          { id: 'suggest', label: 'Suggest', icon: Lightbulb }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-4 text-sm flex items-center justify-center gap-1.5 border-b-2 transition-colors duration-300 ${
              tab === id ? 'border-accent text-text font-bold' : 'border-transparent text-muted'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === 'playlist' && (
          <div className="space-y-2">
            {songs.length === 0 && (
              <p className="text-muted text-sm text-center py-8">Playlist not set yet</p>
            )}
            {songs.map((song, idx) => (
              <div
                key={song.id}
                className={`p-4 border border-border transition-colors duration-300 ${
                  song.status === 'playing'
                    ? 'border-accent bg-accent/10'
                    : song.status === 'done'
                    ? 'opacity-50'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-text">{song.title}</p>
                    {song.artist && <p className="text-text-secondary text-xs mt-0.5">{song.artist}</p>}
                  </div>
                  <span className="font-mono text-muted text-xs">#{idx + 1}</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {song.key && <span className="border border-border text-xs px-2 py-0.5 text-text">Key: {song.key}</span>}
                  {song.bpm && <span className="border border-border text-xs px-2 py-0.5 text-text">{song.bpm} BPM</span>}
                  {song.difficulty && (
                    <span className="border border-border text-xs px-2 py-0.5 text-text capitalize">{song.difficulty}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'attendees' && (
          <div className="space-y-2">
            {attendees.length === 0 && (
              <p className="text-muted text-sm text-center py-8">No one has joined yet</p>
            )}
            {attendees.map(a => (
              <div key={a.id} className="flex items-center justify-between border border-border p-4">
                <span className="text-sm font-medium text-text">{a.name}</span>
                <span className="text-xs border border-border px-2 py-1 text-text-secondary">{a.instrument}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'suggest' && (
          <div>
            <p className="text-text-secondary text-sm mb-4">Suggest a song — organizer will approve it</p>
            <input
              className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-2"
              placeholder="Song title *"
              value={suggestion.title}
              onChange={e => setSuggestion(p => ({ ...p, title: e.target.value }))}
            />
            <input
              className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-4"
              placeholder="Artist (optional)"
              value={suggestion.artist}
              onChange={e => setSuggestion(p => ({ ...p, artist: e.target.value }))}
            />
            <PosterButton onClick={handleSuggest}>
              Send Suggestion
            </PosterButton>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
