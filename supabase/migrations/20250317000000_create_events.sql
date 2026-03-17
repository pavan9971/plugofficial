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

-- Enable realtime for events
alter publication supabase_realtime add table events;

-- Row level security
alter table events enable row level security;

-- Public can read all events
create policy "Public read events" on events for select using (true);

-- Only authenticated users can insert (admin check done in app)
create policy "Authenticated insert events" on events for insert with check (auth.uid() is not null);

-- Only authenticated users can update (admin check done in app)
create policy "Authenticated update events" on events for update using (auth.uid() is not null);

-- Only authenticated users can delete (admin check done in app)
create policy "Authenticated delete events" on events for delete using (auth.uid() is not null);
