import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, admin, loading: authLoading } = useAuth()
  const { events, loading: eventsLoading } = useEvents({ admin: true })

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    window.location.href = '/admin/login'
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Event deleted')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <Link
              to="/admin/events/new"
              className="px-4 py-3 min-h-[44px] flex items-center bg-[#135bec] hover:bg-[#0f4bc5] text-white font-semibold rounded-lg"
            >
              Add Event
            </Link>
            <button
              onClick={handleSignOut}
              className="min-h-[44px] px-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {eventsLoading ? (
          <div className="text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p className="mb-4">No events yet.</p>
            <Link
              to="/admin/events/new"
              className="text-[#135bec] font-medium hover:underline"
            >
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 truncate">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    {event.category} • {new Date(event.date).toLocaleString()} • {event.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/events/${event.id}/edit`}
                    className="px-4 py-3 min-h-[44px] flex items-center text-sm text-[#135bec] hover:bg-[#e7effd] rounded-lg"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-3 min-h-[44px] flex items-center text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
