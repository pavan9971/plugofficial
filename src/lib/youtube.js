// Public Invidious instances — if one fails, falls back to next
const INVIDIOUS_INSTANCES = [
  'https://invidious.snopyta.org',
  'https://vid.puffyan.us',
  'https://invidious.kavin.rocks',
]

async function searchYouTube(query, instanceIndex = 0) {
  if (instanceIndex >= INVIDIOUS_INSTANCES.length) {
    throw new Error(`No results found for: ${query}`)
  }

  try {
    const url = `${INVIDIOUS_INSTANCES[instanceIndex]}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,author`
    const res = await fetch(url)

    if (!res.ok) throw new Error('Instance failed')

    const results = await res.json()
    if (!results || results.length === 0) throw new Error('No results')

    return results[0].videoId
  } catch {
    return searchYouTube(query, instanceIndex + 1)
  }
}

export async function findYouTubeVideo(track) {
  try {
    const videoId = await searchYouTube(`${track.query} official audio`)
    return { ...track, videoId, found: true }
  } catch {
    try {
      const videoId = await searchYouTube(track.query)
      return { ...track, videoId, found: true }
    } catch {
      return { ...track, videoId: null, found: false }
    }
  }
}

export async function createYouTubePlaylist(name, description, googleToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${googleToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      snippet: { title: name, description },
      status: { privacyStatus: 'public' }
    })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'YouTube API error')
  return data.id
}

export async function addVideoToPlaylist(playlistId, videoId, googleToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${googleToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: { kind: 'youtube#video', videoId }
      }
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Failed to add video')
  }
}
