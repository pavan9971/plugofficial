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
      const { data, err } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
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
