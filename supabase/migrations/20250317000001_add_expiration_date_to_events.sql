-- Add expiration_date to events (nullable: null = never expires)
alter table events add column if not exists expiration_date timestamptz;
