# JamSpace

A collaborative music session platform for live jams. Create sessions, share playlists in real time, and convert Spotify playlists to YouTube Music.

![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.98-3ecf8e?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8?logo=tailwindcss)

---

## Features

### Live Sessions
- **Create sessions** with title, studio name, and date
- **Shareable links** — unique slugs (e.g. `/session/abc-xyz123`) for attendees
- **Real-time playlist** — everyone sees the same queue; organizer controls playback
- **Song metadata** — Key, BPM, difficulty (beginner/intermediate/advanced)
- **Attendees** — join with name and instrument (Guitar, Bass, Drums, Keyboard, Vocals, etc.)
- **Suggestions** — attendees can suggest songs; organizer approves or rejects

### Organizer Dashboard
- Manage playlist (add, remove, reorder with drag-and-drop)
- Approve or reject song suggestions
- Mark session as live
- Advance through the queue (now playing indicator)

### Playlist Converter
- **Spotify → YouTube Music** — paste a Spotify playlist URL and convert
- Google OAuth for YouTube API access
- Batch search and match tracks
- Create a new YouTube playlist with matched videos

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL, Realtime) |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Routing | React Router 7 |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **Supabase** account — [supabase.com](https://supabase.com)
- **Google Cloud** project (for Playlist Converter) — OAuth 2.0 + YouTube Data API v3
- **Spotify** (optional) — for fetching playlist data via Supabase Edge Function

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pavan9971/plugofficial.git
cd plugofficial
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_REDIRECT_URI=http://localhost:5173/convert
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID (for YouTube) |
| `VITE_REDIRECT_URI` | OAuth redirect URI (must match Google Console) |

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema in **SQL Editor**:

```bash
# Copy contents of supabase/schema.sql and run in Supabase SQL Editor
```

3. Enable Realtime for `sessions`, `songs`, `attendees`, `suggestions` (included in schema)

### 5. (Optional) Spotify Edge Function

For Playlist Converter to fetch Spotify playlists, deploy the Supabase Edge Function:

```bash
supabase functions deploy spotify-token
```

Configure the function with your Spotify Client ID and Secret via Supabase secrets.

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
jamspace/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── GridSidebarLabel.jsx
│   │   ├── Navigation.jsx
│   │   ├── PageLayout.jsx
│   │   ├── PosterButton.jsx
│   │   ├── SectionGrid.jsx
│   │   └── TypographicListItem.jsx
│   ├── hooks/
│   │   ├── useAttendees.js   # Attendee join/fetch
│   │   ├── useGoogleAuth.js  # Google OAuth
│   │   ├── usePlaylist.js    # Session playlist + realtime
│   │   └── useSession.js     # Session fetch
│   ├── lib/
│   │   ├── spotify.js        # Spotify playlist fetch
│   │   ├── supabase.js       # Supabase client
│   │   └── youtube.js        # YouTube API (search, create playlist)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateSession.jsx
│   │   ├── Session.jsx           # Attendee view
│   │   ├── OrganizerDashboard.jsx # Organizer view
│   │   └── PlaylistConverter.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── schema.sql       # Database schema + RLS
│   └── functions/
│       └── spotify-token/   # Edge function for Spotify API
├── .env.example
├── package.json
├── vite.config.js
└── tsconfig.json
```

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — quick picks, create session, convert playlist |
| `/create` | Create a new jam session |
| `/session/:slug` | Attendee view — join, view playlist, suggest songs |
| `/organizer/:slug` | Organizer dashboard — manage playlist, approve suggestions |
| `/convert` | Spotify → YouTube Music playlist converter |

---

## Database Schema (Summary)

- **sessions** — slug, title, studio_name, date, is_live, current_song_index
- **songs** — session_id, title, artist, key, bpm, difficulty, position, status
- **attendees** — session_id, name, instrument
- **suggestions** — session_id, title, artist, suggested_by, status (pending/approved/rejected)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private. All rights reserved.

---

## Author

**pavan9971** — [GitHub](https://github.com/pavan9971)
