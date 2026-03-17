-- Add price to events (nullable: null = free or not specified)
alter table events add column if not exists price numeric(10, 2);
