import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import PageLayout from '../components/PageLayout'
import PosterButton from '../components/PosterButton'

function generateSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const parts = []
  for (let i = 0; i < 3; i++) {
    parts.push(chars[Math.floor(Math.random() * chars.length)])
  }
  return parts.join('') + '-' + Date.now().toString(36).slice(-6)
}

export default function CreateSession() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    studio_name: '',
    date: '',
    slug: ''
  })
  const [loading, setLoading] = useState(false)

  function handleSlugGenerate() {
    setForm(p => ({ ...p, slug: generateSlug() }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.date) {
      toast.error('Title and date are required')
      return
    }
    const slug = form.slug || generateSlug()
    setLoading(true)
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        slug,
        title: form.title,
        studio_name: form.studio_name || null,
        date: form.date,
        organizer_id: null,
        organizer_name: null
      })
      .select('slug')
      .single()

    setLoading(false)
    if (error) {
      if (error.code === '23505') {
        toast.error('Slug already exists — try generating a new one')
      } else {
        toast.error('Could not create session')
      }
      return
    }
    toast.success('Session created!')
    navigate(`/organizer/${data.slug}`)
  }

  return (
    <PageLayout>
      <div className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-bold text-text">Create Jam Session</h1>
        <p className="text-text-secondary text-lg mt-1">Set up a new session and share the link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-border p-6">
          <label className="text-xs font-bold text-muted uppercase tracking-[0.2em] block mb-2">Session Title *</label>
          <input
            className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
            placeholder="e.g. Hyd Blues Jam Jan 12"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
          />
        </div>

        <div className="border border-border p-6">
          <label className="text-xs font-bold text-muted uppercase tracking-[0.2em] block mb-2">Studio / Venue</label>
          <input
            className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
            placeholder="e.g. Blue Frog"
            value={form.studio_name}
            onChange={e => setForm(p => ({ ...p, studio_name: e.target.value }))}
          />
        </div>

        <div className="border border-border p-6">
          <label className="text-xs font-bold text-muted uppercase tracking-[0.2em] block mb-2">Date & Time *</label>
          <input
            type="datetime-local"
            className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
            value={form.date}
            onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            required
          />
        </div>

        <div className="border border-border p-6">
          <label className="text-xs font-bold text-muted uppercase tracking-[0.2em] block mb-2">URL Slug (optional)</label>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300"
              placeholder="e.g. hyd-blues-jan12"
              value={form.slug}
              onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            />
            <button
              type="button"
              onClick={handleSlugGenerate}
              className="px-6 py-3 bg-text text-cream text-sm font-bold uppercase tracking-wider hover:bg-text/90 transition-colors duration-300"
            >
              Generate
            </button>
          </div>
          <p className="text-muted text-xs mt-2">Used in URL: /session/your-slug</p>
        </div>

        <PosterButton type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Session'}
        </PosterButton>
      </form>
    </PageLayout>
  )
}
