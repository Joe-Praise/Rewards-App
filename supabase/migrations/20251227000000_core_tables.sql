-- Comprehensive rewards system migration - consolidates table structures
-- This replaces piecemeal column additions with proper table definitions

-- ===== PROFILES TABLE =====
-- Drop and recreate profiles table with all required columns
drop table if exists profiles cascade;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  points_balance integer not null default 0,
  current_streak integer not null default 0,
  last_checkin_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ===== FEATURED TOOLS TABLE =====
create table if not exists featured_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon_name text,
  category text not null,
  points_reward integer not null default 50,
  signup_url text,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ===== USER TOOL CLAIMS TABLE =====
create table if not exists user_tool_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references featured_tools(id) on delete cascade,
  points_earned integer not null,
  claimed_at timestamp with time zone default now(),
  unique(user_id, tool_id) -- prevent duplicate claims
);

-- ===== REWARD DEFINITIONS TABLE =====
create table if not exists reward_definitions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points_required integer not null,
  type text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ===== USER REWARDS TABLE =====
create table if not exists user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id uuid not null references reward_definitions(id) on delete cascade,
  redeemed_at timestamp with time zone default now()
);

-- ===== ENABLE RLS =====
alter table profiles enable row level security;
alter table featured_tools enable row level security;
alter table user_tool_claims enable row level security;
alter table reward_definitions enable row level security;
alter table user_rewards enable row level security;

-- ===== RLS POLICIES =====

-- Profiles policies
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Service role can manage profiles"
  on profiles for all
  to service_role
  using (true);

-- Featured tools policies (public read)
drop policy if exists "Anyone can read active tools" on featured_tools;
create policy "Anyone can read active tools"
  on featured_tools for select
  using (is_active = true);

create policy "Service role can manage tools"
  on featured_tools for all
  to service_role
  using (true);

-- User tool claims policies
create policy "Users can read own claims"
  on user_tool_claims for select
  using (auth.uid() = user_id);

create policy "Users can insert own claims"
  on user_tool_claims for insert
  with check (auth.uid() = user_id);

create policy "Service role can manage claims"
  on user_tool_claims for all
  to service_role
  using (true);

-- Reward definitions policies
create policy "Anyone can read active rewards"
  on reward_definitions for select
  using (is_active = true);

create policy "Service role can manage rewards"
  on reward_definitions for all
  to service_role
  using (true);

-- User rewards policies
create policy "Users can read own reward history"
  on user_rewards for select
  using (auth.uid() = user_id);

create policy "Users can insert own redemptions"
  on user_rewards for insert
  with check (auth.uid() = user_id);

create policy "Service role can manage user rewards"
  on user_rewards for all
  to service_role
  using (true);

-- ===== GRANTS =====
grant select, update on table profiles to authenticated;
grant select on table featured_tools to authenticated;
grant select, insert on table user_tool_claims to authenticated;
grant select on table reward_definitions to authenticated;
grant select, insert on table user_rewards to authenticated;

grant all on table profiles to service_role;
grant all on table featured_tools to service_role;
grant all on table user_tool_claims to service_role;
grant all on table reward_definitions to service_role;
grant all on table user_rewards to service_role;

-- ===== TRIGGERS =====

-- Trigger to create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Update trigger for profiles
create or replace function handle_profile_updated()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on profiles;
create trigger on_profile_updated
  before update on profiles
  for each row execute procedure handle_profile_updated();

-- ===== SEED DATA =====
insert into featured_tools (name, description, category, points_reward, signup_url, icon_name) 
values
  ('Reclaim.ai', 'AI-powered calendar assistant that automatically schedules your tasks, meetings, and breaks to boost productivity. Free to try — earn Flowva Points when you sign up!', 'Productivity', 50, 'https://reclaim.ai', 'calendar'),
  ('Notion', 'All-in-one workspace for notes, docs, wikis, and project management. Organize your entire workflow in one place.', 'Productivity', 50, 'https://notion.so', 'file-text'),
  ('Figma', 'Collaborative design tool for creating user interfaces, prototypes, and design systems. Perfect for teams and individuals.', 'Design', 50, 'https://figma.com', 'layers'),
  ('Linear', 'Modern issue tracking and project management built for high-performance teams. Streamline your development workflow.', 'Project Management', 50, 'https://linear.app', 'target'),
  ('Vercel', 'Deploy your frontend applications instantly with zero configuration. Perfect for React, Next.js, and static sites.', 'Development', 50, 'https://vercel.com', 'zap')
on conflict do nothing;

insert into reward_definitions (title, description, points_required, type, category, is_active)
values
  ('$5 Amazon Gift Card', 'Redeem your Flowva Points for a $5 Amazon gift card delivered to your email.', 500, 'gift_card', 'Shopping', true),
  ('$10 Starbucks Card', 'Treat yourself to your favorite coffee with a $10 Starbucks gift card.', 1000, 'gift_card', 'Food & Drink', true),
  ('$15 Uber Eats Credit', 'Order your favorite meal with $15 in Uber Eats credit.', 1500, 'credit', 'Food & Drink', true),
  ('$25 Target Gift Card', 'Shop for anything you need with a $25 Target gift card.', 2500, 'gift_card', 'Shopping', true),
  ('$50 PayPal Cash', 'Get $50 in cash delivered directly to your PayPal account.', 5000, 'cash', 'Finance', true),
  ('Premium Course Access', 'Get 3-month access to premium online courses and certifications.', 3000, 'education', 'Education', true),
  ('Netflix Subscription', 'Enjoy 1 month of Netflix premium streaming service.', 1200, 'subscription', 'Entertainment', true),
  ('Spotify Premium', 'Get 3 months of Spotify Premium music streaming.', 800, 'subscription', 'Entertainment', false)
on conflict do nothing;