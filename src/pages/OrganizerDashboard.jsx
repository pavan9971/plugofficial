import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../hooks/useSession'
import { usePlaylist } from '../hooks/usePlaylist'
import toast from 'react-hot-toast'
import { ChevronRight, Plus, Check, X } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import PosterButton from '../components/PosterButton'

export default function OrganizerDashboard() {
  const { slug } = useParams()
  const { session } = useSession(slug)
  const { songs } = usePlaylist(session?.id)
  const [suggestions, setSuggestions] = useState([])
  const [newSong, setNewSong] = useState({ title: '', artist: '', key: '', bpm: '', difficulty: 'intermediate' })

  useEffect(() => {
    if (!session?.id) return
    supabase.from('suggestions').select('*')
      .eq('session_id', session.id)
      .eq('status', 'pending')
      .then(({ data }) => setSuggestions(data || []))

    const channel = supabase.channel('suggestions-org')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, () => {
        supabase.from('suggestions').select('*')
          .eq('session_id', session.id).eq('status', 'pending')
          .then(({ data }) => setSuggestions(data || []))
      }).subscribe()

    return () => supabase.removeChannel(channel)
  }, [session?.id])

  async function addSong() {
    if (!newSong.title) return toast.error('Song title required')
    const maxPos = songs.length > 0 ? Math.max(...songs.map(s => s.position)) : 0
    await supabase.from('songs').insert({
      session_id: session.id,
      ...newSong,
      bpm: newSong.bpm ? parseInt(newSong.bpm) : null,
      position: maxPos + 1,
      status: 'queued'
    })
    setNewSong({ title: '', artist: '', key: '', bpm: '', difficulty: 'intermediate' })
    toast.success('Song added')
  }

  async function nextSong() {
    if (songs[session.current_song_index]) {
      await supabase.from('songs')
        .update({ status: 'done' })
        .eq('id', songs[session.current_song_index].id)
    }
    const nextIndex = session.current_song_index + 1
    await supabase.from('sessions').update({ current_song_index: nextIndex }).eq('id', session.id)
    if (songs[nextIndex]) {
      await supabase.from('songs').update({ status: 'playing' }).eq('id', songs[nextIndex].id)
    }
  }

  async function toggleLive() {
    await supabase.from('sessions')
      .update({ is_live: !session.is_live })
      .eq('id', session.id)
    toast.success(session.is_live ? 'Session ended' : 'Session is now LIVE!')
  }

  async function approveSuggestion(s) {
    const maxPos = songs.length > 0 ? Math.max(...songs.map(x => x.position)) : 0
    await supabase.from('songs').insert({
      session_id: session.id,
      title: s.title,
      artist: s.artist,
      position: maxPos + 1,
      status: 'queued',
      suggested_by: s.suggested_by
    })
    await supabase.from('suggestions').update({ status: 'approved' }).eq('id', s.id)
    toast.success('Added to playlist')
  }

  async function rejectSuggestion(id) {
    await supabase.from('suggestions').update({ status: 'rejected' }).eq('id', id)
  }

  if (!session) return null

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
        <h1 className="text-2xl font-bold text-text">{session.title}</h1>
        <button
          onClick={toggleLive}
          className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
            session.is_live ? 'bg-accent text-cream hover:bg-text' : 'bg-text text-cream hover:bg-text/90'
          }`}
        >
          {session.is_live ? 'End Session' : 'Go Live'}
        </button>
      </div>

      {/* Next Song Button */}
      {session.is_live && (
        <PosterButton onClick={nextSong} className="w-full flex items-center justify-center gap-2 mb-6">
          <ChevronRight size={18} /> Next Song
        </PosterButton>
      )}

      {/* Add Song Form */}
      <div className="border border-border p-6 mb-6">
        <p className="font-bold text-sm text-text mb-3">Add Song to Playlist</p>
        <input
          className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-2"
          placeholder="Song title *"
          value={newSong.title}
          onChange={e => setNewSong(p => ({ ...p, title: e.target.value }))}
        />
        <input
          className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-2"
          placeholder="Artist"
          value={newSong.artist}
          onChange={e => setNewSong(p => ({ ...p, artist: e.target.value }))}
        />
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
            placeholder="Key (eg. Am)"
            value={newSong.key}
            onChange={e => setNewSong(p => ({ ...p, key: e.target.value }))}
          />
          <input
            className="flex-1 bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
            placeholder="BPM"
            type="number"
            value={newSong.bpm}
            onChange={e => setNewSong(p => ({ ...p, bpm: e.target.value }))}
          />
        </div>
        <select
          className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-3"
          value={newSong.difficulty}
          onChange={e => setNewSong(p => ({ ...p, difficulty: e.target.value }))}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          onClick={addSong}
          className="w-full py-3 border border-border text-text font-bold uppercase tracking-wider hover:bg-text hover:text-cream transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Song
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="border border-border p-6 mb-6">
          <p className="font-bold text-sm text-text mb-3">Suggestions ({suggestions.length})</p>
          <div className="space-y-2">
            {suggestions.map(s => (
              <div key={s.id} className="flex items-center justify-between border border-border p-4">
                <div>
                  <p className="text-sm font-medium text-text">{s.title}</p>
                  <p className="text-xs text-muted">by {s.suggested_by}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveSuggestion(s)}
                    className="p-2 border border-border hover:bg-accent hover:text-cream hover:border-accent transition-colors duration-300"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => rejectSuggestion(s.id)}
                    className="p-2 border border-border hover:bg-text hover:text-cream hover:border-text transition-colors duration-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playlist */}
      <div className="space-y-2">
        <p className="font-bold text-sm text-text mb-2">Playlist ({songs.length} songs)</p>
        {songs.map((song, idx) => (
          <div
            key={song.id}
            className={`p-4 border border-border ${
              song.status === 'playing' ? 'border-accent bg-accent/10' :
              song.status === 'done' ? 'opacity-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text">{song.title}</p>
                {song.artist && <p className="text-xs text-text-secondary">{song.artist}</p>}
                {song.suggested_by && <p className="text-xs text-accent">💡 {song.suggested_by}</p>}
              </div>
              <span className="font-mono text-muted text-xs">#{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
