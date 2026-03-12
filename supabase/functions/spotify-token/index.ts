import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID")!
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET")!

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const { url: playlistUrl } = await req.json()

  // 1. Get client credentials token
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
    },
    body: "grant_type=client_credentials"
  })

  const { access_token } = await tokenRes.json()

  // 2. Extract playlist ID from URL
  const match = playlistUrl.match(/playlist[/:]([a-zA-Z0-9]+)/)
  if (!match) {
    return new Response(JSON.stringify({ error: "Invalid Spotify URL" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
  const playlistId = match[1]

  // 3. Fetch playlist metadata
  const metaRes = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,tracks(total)`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  const meta = await metaRes.json()

  // 4. Fetch ALL tracks with pagination
  let tracks: { name: string; artist: string; query: string }[] = []
  let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=next,items(track(name,artists(name)))`

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const data = await res.json()

    const page = data.items
      .filter((item: { track: { name: string } | null }) => item.track && item.track.name)
      .map((item: { track: { name: string; artists: { name: string }[] } }) => ({
        name: item.track.name,
        artist: item.track.artists[0]?.name || "",
        query: `${item.track.name} ${item.track.artists[0]?.name || ""}`
      }))

    tracks = [...tracks, ...page]
    nextUrl = data.next
  }

  return new Response(
    JSON.stringify({ name: meta.name, total: meta.tracks?.total ?? tracks.length, tracks }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
})
