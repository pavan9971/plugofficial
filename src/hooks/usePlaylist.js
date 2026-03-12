import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePlaylist(sessionId) {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    if (!sessionId) return

    // Initial fetch
    supabase
      .from('songs')
      .select('*')
      .eq('session_id', sessionId)
      .order('position')
      .then(({ data }) => setSongs(data || []))

    // Realtime: any song insert/update/delete
    const channel = supabase
      .channel('playlist-' + sessionId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'songs',
        filter: `session_id=eq.${sessionId}`
      }, () => {
        // Refetch full playlist on any change
        supabase
          .from('songs')
          .select('*')
          .eq('session_id', sessionId)
          .order('position')
          .then(({ data }) => setSongs(data || []))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [sessionId])

  return { songs }
}
