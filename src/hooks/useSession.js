import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSession(slug) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    // Initial fetch
    supabase
      .from('sessions')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setSession(data)
        setLoading(false)
      })

    // Realtime: session goes live, current song changes
    const channel = supabase
      .channel('session-' + slug)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions',
        filter: `slug=eq.${slug}`
      }, (payload) => setSession(payload.new))
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [slug])

  return { session, loading }
}
