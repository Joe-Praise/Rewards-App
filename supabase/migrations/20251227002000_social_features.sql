-- Additional reward system tables for campaigns, referrals, and activities
-- Extends the existing reward system with social features

-- ===== USER ACTIVITIES TABLE =====
create table if not exists user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null, -- 'share_stack', 'social_share', etc.
  points_earned integer not null default 0,
  metadata jsonb, -- flexible data storage for activity details
  completed_at timestamp with time zone default now(),
  unique(user_id, activity_type) -- prevent duplicate completions for one-time activities
);

-- ===== USER TECH STACKS TABLE =====
create table if not exists user_tech_stacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stack_name text not null,
  description text,
  technologies text[] not null, -- array of technology names
  is_public boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, stack_name) -- user can have multiple stacks but unique names
);

-- ===== REFERRAL CAMPAIGNS TABLE =====
create table if not exists referral_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  points_reward integer not null,
  required_referrals integer not null default 1,
  max_winners integer,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- ===== CAMPAIGN PARTICIPANTS TABLE =====
create table if not exists campaign_participants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid not null references referral_campaigns(id) on delete cascade,
  referrals_count integer not null default 0,
  qualified boolean not null default false,
  won_points integer default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, campaign_id)
);

-- ===== REFERRALS TABLE =====
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete cascade,
  referral_code text not null unique,
  points_earned integer not null default 25,
  status text not null default 'pending', -- 'pending', 'completed', 'expired'
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ===== ENABLE RLS =====
alter table user_activities enable row level security;
alter table user_tech_stacks enable row level security;
alter table referral_campaigns enable row level security;
alter table campaign_participants enable row level security;
alter table referrals enable row level security;

-- ===== RLS POLICIES =====

-- User activities policies
create policy "Users can read own activities"
  on user_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on user_activities for insert
  with check (auth.uid() = user_id);

-- Tech stacks policies
create policy "Users can read own tech stacks"
  on user_tech_stacks for select
  using (auth.uid() = user_id);

create policy "Users can manage own tech stacks"
  on user_tech_stacks for all
  using (auth.uid() = user_id);

create policy "Anyone can read public tech stacks"
  on user_tech_stacks for select
  using (is_public = true);

-- Referral campaigns policies (public read for active campaigns)
create policy "Anyone can read active campaigns"
  on referral_campaigns for select
  using (is_active = true);

-- Campaign participants policies
create policy "Users can read own participation"
  on campaign_participants for select
  using (auth.uid() = user_id);

create policy "Users can insert own participation"
  on campaign_participants for insert
  with check (auth.uid() = user_id);

-- Referrals policies
create policy "Users can read referrals they're involved in"
  on referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_user_id);

create policy "Users can insert referrals they make"
  on referrals for insert
  with check (auth.uid() = referrer_id);

-- Service role policies
create policy "Service role can manage activities"
  on user_activities for all
  to service_role using (true);

create policy "Service role can manage tech stacks"
  on user_tech_stacks for all
  to service_role using (true);

create policy "Service role can manage campaigns"
  on referral_campaigns for all
  to service_role using (true);

create policy "Service role can manage participants"
  on campaign_participants for all
  to service_role using (true);

create policy "Service role can manage referrals"
  on referrals for all
  to service_role using (true);

-- ===== GRANTS =====
grant select, insert on table user_activities to authenticated;
grant select, insert, update, delete on table user_tech_stacks to authenticated;
grant select on table referral_campaigns to authenticated;
grant select, insert, update on table campaign_participants to authenticated;
grant select, insert, update on table referrals to authenticated;

grant all on table user_activities to service_role;
grant all on table user_tech_stacks to service_role;
grant all on table referral_campaigns to service_role;
grant all on table campaign_participants to service_role;
grant all on table referrals to service_role;

-- ===== SEED DATA =====

-- Sample referral campaign
insert into referral_campaigns (title, description, points_reward, required_referrals, max_winners, start_date, end_date)
values (
  'Refer and win 10,000 points!',
  'Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of 10,000 points. Friends must complete onboarding to qualify.',
  10000,
  3,
  5,
  '2024-11-01 00:00:00+00',
  '2024-11-20 23:59:59+00'
) on conflict do nothing;