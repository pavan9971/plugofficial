import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAttendees(sessionId) {
  const [attendees, setAttendees] = useState([])

  useEffect(() => {
    if (!sessionId) return

    supabase
      .from('attendees')
      .select('*')
      .eq('session_id', sessionId)
      .order('joined_at')
      .then(({ data }) => setAttendees(data || []))

    const channel = supabase
      .channel('attendees-' + sessionId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'attendees',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        setAttendees(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [sessionId])

  async function joinSession(name, instrument) {
    const { error } = await supabase
      .from('attendees')
      .insert({ session_id: sessionId, name, instrument })
    return { error }
  }

  return { attendees, joinSession }
}
