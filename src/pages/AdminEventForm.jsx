import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Music',
  'Tech',
  'Live Music',
  'Workshop',
  'Education',
  'Cinema',
  'Concerts',
  'Hackathons',
  'Jamming Sessions',
  'Art Gallery',
]

export default function AdminEventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Music',
    date: '',
    location: '',
    image_url: '',
    payment_link: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error('Event not found')
            navigate('/admin')
            return
          }
          if (data) {
            const d = new Date(data.date)
            const localDate = d.toISOString().slice(0, 16)
            setForm({
              title: data.title ?? '',
              category: data.category ?? 'Music',
              date: localDate,
              location: data.location ?? '',
              image_url: data.image_url ?? '',
              payment_link: data.payment_link ?? '',
              description: data.description ?? '',
            })
          }
        })
    }
  }, [isEdit, id, navigate])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const payload = {
        title: form.title.trim(),
        category: form.category,
        date: new Date(form.date).toISOString(),
        location: form.location.trim(),
        image_url: form.image_url.trim() || null,
        payment_link: form.payment_link.trim(),
        description: form.description.trim() || null,
        created_by: user?.id,
      }
      if (!payload.payment_link) {
        toast.error('Payment link is required')
        setLoading(false)
        return
      }
      if (isEdit) {
        const { error } = await supabase.from('events').update(payload).eq('id', id)
        if (error) throw error
        toast.success('Event updated')
      } else {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
        toast.success('Event created')
      }
      navigate('/admin')
    } catch (err) {
      toast.error(err.message ?? 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Event' : 'Create Event'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
            placeholder="Event title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
            placeholder="Venue or address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            name="image_url"
            type="url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Link *</label>
          <input
            name="payment_link"
            type="url"
            value={form.payment_link}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
            placeholder="https://payment.example.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">Users will be redirected here when they click View Details</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
            placeholder="Optional description"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#135bec] hover:bg-[#0f4bc5] text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
