import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useEvents(options = {}) {
  const { admin = false } = options
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let channel

    const fetchEvents = async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (!admin) {
        const now = new Date().toISOString()
        query = query.or(`expiration_date.is.null,expiration_date.gte.${now}`)
      }

      const { data, err } = await query
      if (err) {
        setError(err)
        setEvents([])
      } else {
        setEvents(data ?? [])
      }
      setLoading(false)
    }

    fetchEvents()

    if (admin) {
      channel = supabase
        .channel('events-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
          fetchEvents()
        })
        .subscribe()
    }

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [admin])

  return { events, loading, error }
}
