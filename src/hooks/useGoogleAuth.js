const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/youtube'

export function loginWithGoogle() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    response_type: 'token',
    scope: GOOGLE_SCOPES,
    include_granted_scopes: 'true'
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export function getGoogleToken() {
  const hash = window.location.hash
  if (hash) {
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    const expiresIn = params.get('expires_in')
    if (token) {
      localStorage.setItem('google_token', token)
      localStorage.setItem('google_token_expiry', Date.now() + parseInt(expiresIn || '3600') * 1000)
      window.location.hash = ''
    }
  }
  const token = localStorage.getItem('google_token')
  const expiry = localStorage.getItem('google_token_expiry')
  if (!token || Date.now() > expiry) return null
  return token
}
