-- Sessions table
create table sessions (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  studio_name text,
  date timestamptz not null,
  organizer_id uuid references auth.users(id),
  organizer_name text,
  is_live boolean default false,
  current_song_index int default 0,
  created_at timestamptz default now()
);

-- Songs in a session playlist
create table songs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  title text not null,
  artist text,
  key text,
  bpm int,
  difficulty text check (difficulty in ('beginner','intermediate','advanced')),
  position int not null,
  status text default 'queued' check (status in ('queued','playing','done')),
  suggested_by text,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- Attendees
create table attendees (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  name text not null,
  instrument text not null,
  joined_at timestamptz default now()
);

-- Song suggestions (pending approval)
create table suggestions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  title text not null,
  artist text,
  suggested_by text not null,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

-- Enable realtime on all tables
alter publication supabase_realtime add table songs;
alter publication supabase_realtime add table attendees;
alter publication supabase_realtime add table suggestions;
alter publication supabase_realtime add table sessions;

-- Row level security
alter table sessions enable row level security;
alter table songs enable row level security;
alter table attendees enable row level security;
alter table suggestions enable row level security;

-- Option B: Allow anyone to create sessions (no auth required for MVP)
create policy "Public read sessions" on sessions for select using (true);
create policy "Anyone can create sessions" on sessions for insert with check (true);
create policy "Anyone can update sessions" on sessions for update using (true);

-- Songs: public read, anyone can manage (organizer controls via UI)
create policy "Public read songs" on songs for select using (true);
create policy "Anyone manages songs" on songs for all using (true);

-- Attendees: public read and insert
create policy "Public read attendees" on attendees for select using (true);
create policy "Anyone can join" on attendees for insert with check (true);

-- Suggestions: public read and insert
create policy "Public read suggestions" on suggestions for select using (true);
create policy "Anyone can suggest" on suggestions for insert with check (true);
create policy "Anyone manages suggestions" on suggestions for update using (true);

-- Events table for event listing website
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  date timestamptz not null,
  location text not null,
  image_url text,
  payment_link text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter publication supabase_realtime add table events;
alter table events enable row level security;

create policy "Public read events" on events for select using (true);
create policy "Authenticated insert events" on events for insert with check (auth.uid() is not null);
create policy "Authenticated update events" on events for update using (auth.uid() is not null);
create policy "Authenticated delete events" on events for delete using (auth.uid() is not null);
