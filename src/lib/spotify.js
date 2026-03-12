import { supabase } from './supabase'

export async function fetchPlaylistFromUrl(spotifyUrl) {
  const { data, error } = await supabase.functions.invoke('spotify-token', {
    body: { url: spotifyUrl }
  })

  if (error) throw new Error('Could not fetch playlist')
  if (data?.error) throw new Error(data.error)

  return data
}
