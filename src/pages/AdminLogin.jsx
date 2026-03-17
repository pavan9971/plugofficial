import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/admin'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      const adminEmailsRaw = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAILS || ''
      const adminEmails = adminEmailsRaw
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      const userEmail = data.user?.email?.toLowerCase().trim()
      const allowAll = adminEmailsRaw.trim().toLowerCase() === '*' || adminEmails.length === 0
      const isAllowed = allowAll || (userEmail && adminEmails.includes(userEmail))
      if (!isAllowed) {
        await supabase.auth.signOut()
        console.warn('[Admin] Logged in as:', userEmail, '| Expected one of:', adminEmails.length ? adminEmails : '(set VITE_ADMIN_EMAIL in .env)')
        toast.error(`Access denied. Logged in as "${userEmail}". Update VITE_ADMIN_EMAIL in .env to match, then restart dev server.`)
        return
      }
      toast.success('Signed in')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-500 text-sm mb-6">
            Sign in to manage events
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#135bec] hover:bg-[#0f4bc5] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
