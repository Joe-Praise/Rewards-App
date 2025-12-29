-- Fix existing schema conflicts by working with what's already there

-- Ensure profiles table exists with all needed columns
do $$ 
begin
  -- Add missing columns to profiles if they don't exist
  if not exists (select 1 from information_schema.columns 
                 where table_name = 'profiles' and column_name = 'current_streak') then
    alter table profiles add column current_streak integer not null default 0;
  end if;
  
  if not exists (select 1 from information_schema.columns 
                 where table_name = 'profiles' and column_name = 'last_checkin_date') then
    alter table profiles add column last_checkin_date date;
  end if;
end $$;

-- Ensure all required policies exist (drop and recreate)
drop policy if exists "Anyone can read active tools" on featured_tools;
drop policy if exists "Service role can manage tools" on featured_tools;
drop policy if exists "Users can read own claims" on user_tool_claims;
drop policy if exists "Users can insert own claims" on user_tool_claims;
drop policy if exists "Service role can manage claims" on user_tool_claims;
drop policy if exists "Anyone can read active rewards" on reward_definitions;
drop policy if exists "Service role can manage rewards" on reward_definitions;
drop policy if exists "Users can read own reward history" on user_rewards;
drop policy if exists "Users can insert own redemptions" on user_rewards;
drop policy if exists "Service role can manage user rewards" on user_rewards;

-- Recreate policies
create policy "Anyone can read active tools"
  on featured_tools for select
  using (is_active = true);

create policy "Service role can manage tools"
  on featured_tools for all
  to service_role
  using (true);

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

create policy "Anyone can read active rewards"
  on reward_definitions for select
  using (is_active = true);

create policy "Service role can manage rewards"
  on reward_definitions for all
  to service_role
  using (true);

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
