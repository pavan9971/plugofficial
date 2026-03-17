# Hapnin

An event listing website. Admins log in to create and manage events with payment links. End users browse events and are redirected to the payment link when they click View Details.

![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.98-3ecf8e?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8?logo=tailwindcss)

---

## Features

### Admin
- **Login** — Sign in with email/password (admin email must match `VITE_ADMIN_EMAIL`)
- **List events** — View all events in the dashboard
- **Create/Edit events** — Title, category, date, location, image URL, **payment link**, description
- **Delete events** — Remove events from the listing

### End Users
- **Browse events** — Event grid with hero, filters, and categories
- **Filter by category** — All Events, Concerts, Hackathons, etc.
- **Sort** — Latest first or soonest first
- **View Details** — Clicking redirects to the payment link provided by the admin

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL, Realtime) |
| Auth | Supabase Auth |
| Toasts | react-hot-toast |
| Routing | React Router 7 |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **Supabase** account — [supabase.com](https://supabase.com)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL=admin@example.com
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `VITE_ADMIN_EMAIL` | Email address allowed to access admin routes |

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable **Email** auth in Authentication → Providers
3. Run the schema in **SQL Editor**:
   - For a fresh project: run `supabase/schema.sql`
   - Or run only the events section from `supabase/migrations/20250317000000_create_events.sql`
4. Create an admin user in Authentication → Users (or sign up via the app, then add to Supabase)

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home — event listing with hero, filters, grid |
| `/admin/login` | Public | Admin login |
| `/admin` | Admin only | Dashboard — list events, add/edit/delete |
| `/admin/events/new` | Admin only | Create event |
| `/admin/events/:id/edit` | Admin only | Edit event |

---

## Database Schema (Events)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | Event name |
| category | text | e.g. Music, Tech, Workshop |
| date | timestamptz | Event date/time |
| location | text | Venue/address |
| image_url | text | Cover image URL |
| payment_link | text | **Required** — redirect URL for users |
| description | text | Optional |
| created_by | uuid | FK to auth.users |
| created_at | timestamptz | |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
