import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Session from './pages/Session'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CreateSession from './pages/CreateSession'
import PlaylistConverter from './pages/PlaylistConverter'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#282828',
            color: '#ffffff',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/:slug" element={<Session />} />
          <Route path="/organizer/:slug" element={<OrganizerDashboard />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/convert" element={<PlaylistConverter />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
