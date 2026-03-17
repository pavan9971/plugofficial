import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function getAdminEmails() {
  const raw = (import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.VITE_ADMIN_EMAILS || '').trim()
  if (raw.toLowerCase() === '*') return ['*']
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdmin(user) {
  if (!user?.email) return false
  const adminEmails = getAdminEmails()
  if (adminEmails.includes('*') || adminEmails.length === 0) return true
  return adminEmails.includes(user.email.toLowerCase().trim())
}

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
    return () => subscription?.unsubscribe()
  }, [])

  const user = session?.user ?? null
  const admin = user && isAdmin(user)

  return { session, user, admin, loading }
}
