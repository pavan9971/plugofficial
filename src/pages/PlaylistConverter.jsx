import { useState, useEffect } from 'react'
import { fetchPlaylistFromUrl } from '../lib/spotify'
import { loginWithGoogle, getGoogleToken } from '../hooks/useGoogleAuth'
import { findYouTubeVideo, createYouTubePlaylist, addVideoToPlaylist } from '../lib/youtube'
import { Youtube, ArrowRight, CheckCircle, XCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import PageLayout from '../components/PageLayout'
import PosterButton from '../components/PosterButton'

export default function PlaylistConverter() {
  const [googleToken, setGoogleToken] = useState(getGoogleToken())
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [step, setStep] = useState('idle')
  const [tracks, setTracks] = useState([])
  const [progress, setProgress] = useState(0)
  const [currentTrack, setCurrentTrack] = useState('')
  const [youtubePlaylistId, setYoutubePlaylistId] = useState(null)
  const [playlistName, setPlaylistName] = useState('')

  useEffect(() => {
    const gToken = getGoogleToken()
    if (gToken) setGoogleToken(gToken)
  }, [])

  async function handleConvert() {
    if (!googleToken) return toast.error('Connect YouTube first to create the playlist')
    if (!playlistUrl.includes('spotify.com/playlist')) {
      return toast.error('Paste a valid Spotify playlist URL')
    }

    try {
      setStep('fetching')
      setProgress(0)
      const data = await fetchPlaylistFromUrl(playlistUrl)
      setPlaylistName(data.name)
      setTracks(data.tracks.map(t => ({ ...t, found: undefined })))
      toast.success(`Found ${data.tracks.length} tracks in "${data.name}"`)

      setStep('searching')
      const results = []

      for (let i = 0; i < data.tracks.length; i += 3) {
        const batch = data.tracks.slice(i, i + 3)
        setCurrentTrack(batch[0].name)

        const batchResults = await Promise.all(
          batch.map(t => findYouTubeVideo(t))
        )
        results.push(...batchResults)

        setTracks([
          ...results,
          ...data.tracks.slice(i + 3).map(t => ({ ...t, found: undefined }))
        ])
        setProgress(Math.round((results.length / data.tracks.length) * 100))

        if (i + 3 < data.tracks.length) {
          await new Promise(r => setTimeout(r, 300))
        }
      }

      setStep('creating')
      setProgress(0)
      const ytPlaylistId = await createYouTubePlaylist(
        data.name,
        `Converted from Spotify`,
        googleToken
      )

      const found = results.filter(t => t.found)
      for (let i = 0; i < found.length; i++) {
        await addVideoToPlaylist(ytPlaylistId, found[i].videoId, googleToken)
        setProgress(Math.round(((i + 1) / found.length) * 100))
        await new Promise(r => setTimeout(r, 100))
      }

      setYoutubePlaylistId(ytPlaylistId)
      setStep('done')
      toast.success('Done! Playlist ready on YouTube Music')

    } catch (err) {
      toast.error(err.message || 'Something went wrong')
      setStep('idle')
    }
  }

  const foundCount = tracks.filter(t => t.found === true).length
  const notFoundCount = tracks.filter(t => t.found === false).length
  const isProcessing = ['fetching', 'searching', 'creating'].includes(step)

  return (
    <PageLayout>
      <div className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-bold text-text">Playlist Converter</h1>
        <p className="text-text-secondary text-lg mt-1">Paste any Spotify playlist → get YouTube Music link</p>
      </div>

      <button
        onClick={() => !googleToken && loginWithGoogle()}
        className={`w-full flex items-center justify-center gap-2 py-4 px-6 border text-sm font-bold uppercase tracking-wider mb-6 transition-colors duration-300 ${
          googleToken
            ? 'bg-cream border-border text-text-secondary cursor-default'
            : 'bg-accent text-cream border-accent hover:bg-text'
        }`}
      >
        <Youtube size={16} />
        {googleToken ? '✓ YouTube Connected' : 'Connect YouTube (to save playlist)'}
      </button>

      <div className="border border-border p-6 mb-6">
        <label className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-2 block">
          Spotify Playlist URL
        </label>
        <input
          className="w-full bg-cream border border-border px-4 py-3 text-text outline-none focus:border-accent transition-colors duration-300 mb-4 placeholder:text-muted"
          placeholder="https://open.spotify.com/playlist/..."
          value={playlistUrl}
          onChange={e => setPlaylistUrl(e.target.value)}
          disabled={isProcessing}
        />
        <PosterButton
          as="button"
          onClick={handleConvert}
          disabled={isProcessing || !playlistUrl}
          className="w-full flex items-center justify-center gap-2"
        >
          {isProcessing
            ? <><Loader size={15} className="animate-spin" /> Converting...</>
            : <><ArrowRight size={15} /> Convert Playlist</>
          }
        </PosterButton>
      </div>

      {isProcessing && (
        <div className="border border-border p-6 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-secondary truncate pr-4">
              {step === 'fetching' && 'Fetching tracks from Spotify...'}
              {step === 'searching' && `Finding on YouTube: ${currentTrack}`}
              {step === 'creating' && 'Adding songs to YouTube playlist...'}
            </span>
            <span className="font-bold shrink-0">{progress}%</span>
          </div>
          <div className="w-full bg-border h-1">
            <div
              className="bg-accent h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === 'done' && youtubePlaylistId && (
        <div className="border border-border p-6 mb-6">
          <p className="text-accent font-bold mb-1">"{playlistName}" is ready!</p>
          <p className="text-text-secondary text-sm mb-4">
            {foundCount} matched · {notFoundCount} not found on YouTube
          </p>
          <PosterButton
            as="a"
            href={`https://music.youtube.com/playlist?list=${youtubePlaylistId}`}
            target="_blank"
            rel="noreferrer"
            className="block text-center mb-2"
          >
            Open in YouTube Music
          </PosterButton>
          <a
            href={`https://www.youtube.com/playlist?list=${youtubePlaylistId}`}
            target="_blank"
            rel="noreferrer"
            className="block text-center border border-border py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:bg-text hover:text-cream"
          >
            Open in YouTube
          </a>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">
            {tracks.length} tracks
            {foundCount > 0 && <span className="text-accent ml-2">{foundCount} found</span>}
            {notFoundCount > 0 && <span className="text-text ml-2">{notFoundCount} missing</span>}
          </p>
          {tracks.map((track, idx) => (
            <div key={idx} className="flex items-center gap-3 border border-border p-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{track.name}</p>
                <p className="text-xs text-muted truncate">{track.artist}</p>
              </div>
              <div className="shrink-0">
                {track.found === undefined && (
                  <div className="w-3.5 h-3.5 bg-border animate-pulse" />
                )}
                {track.found === true && <CheckCircle size={15} className="text-accent" />}
                {track.found === false && <XCircle size={15} className="text-text" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
