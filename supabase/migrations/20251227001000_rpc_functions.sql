-- RPC functions for points claiming and rewards
-- Separated from table definitions for better organization

-- ===== DAILY POINTS CLAIMING =====
create or replace function claim_daily_points()
returns jsonb as $$
declare
  user_uuid uuid;
  today_date date := current_date;
  last_checkin date;
  current_streak_count integer;
  new_streak integer;
  current_points integer;
  profile_exists boolean;
begin
  -- Get current user
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Check if profile exists and get current profile data
  select 
    last_checkin_date, 
    current_streak, 
    points_balance,
    true
  into last_checkin, current_streak_count, current_points, profile_exists
  from profiles 
  where id = user_uuid;

  -- If no profile found, return error
  if not profile_exists then
    return jsonb_build_object('success', false, 'message', 'Profile not found');
  end if;

  -- Check if already claimed today
  if last_checkin = today_date then
    return jsonb_build_object('success', false, 'message', 'Already claimed today');
  end if;

  -- Calculate new streak
  if last_checkin = today_date - interval '1 day' then
    -- Consecutive day: increment streak
    new_streak := coalesce(current_streak_count, 0) + 1;
  else
    -- Missed days: reset streak to 1
    new_streak := 1;
  end if;

  -- Update profile with new points, streak, and checkin date
  update profiles 
  set 
    points_balance = coalesce(current_points, 0) + 5,
    current_streak = new_streak,
    last_checkin_date = today_date,
    updated_at = now()
  where id = user_uuid;

  return jsonb_build_object(
    'success', true, 
    'points_earned', 5,
    'new_streak', new_streak,
    'new_total_points', coalesce(current_points, 0) + 5
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== TOOL POINTS CLAIMING =====
create or replace function claim_tool_points(tool_uuid uuid)
returns jsonb as $$
declare
  user_uuid uuid;
  tool_points integer;
  current_points integer;
  tool_exists boolean;
  already_claimed boolean;
begin
  -- Get current user
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Check if tool exists and is active
  select points_reward into tool_points
  from featured_tools 
  where id = tool_uuid and is_active = true;

  if tool_points is null then
    return jsonb_build_object('success', false, 'message', 'Tool not found or inactive');
  end if;

  -- Check if already claimed
  select exists(
    select 1 from user_tool_claims 
    where user_id = user_uuid and tool_id = tool_uuid
  ) into already_claimed;

  if already_claimed then
    return jsonb_build_object('success', false, 'message', 'Already claimed this tool');
  end if;

  -- Get current points
  select points_balance into current_points from profiles where id = user_uuid;

  if current_points is null then
    return jsonb_build_object('success', false, 'message', 'Profile not found');
  end if;

  -- Insert claim record
  insert into user_tool_claims (user_id, tool_id, points_earned)
  values (user_uuid, tool_uuid, tool_points);

  -- Update profile points
  update profiles 
  set 
    points_balance = current_points + tool_points,
    updated_at = now()
  where id = user_uuid;

  return jsonb_build_object(
    'success', true,
    'points_earned', tool_points,
    'new_total_points', current_points + tool_points
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== FUNCTION PERMISSIONS =====
grant execute on function claim_daily_points() to authenticated;
grant execute on function claim_tool_points(uuid) to authenticated;

grant execute on function claim_daily_points() to service_role;
grant execute on function claim_tool_points(uuid) to service_role;

-- ===== REDEEM REWARD FUNCTION =====
create or replace function redeem_reward(reward_uuid uuid)
returns jsonb as $$
declare
  user_uuid uuid;
  reward_points integer;
  current_points integer;
  already_redeemed boolean;
begin
  -- Get current user
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Check if reward exists and is active
  select points_required into reward_points
  from reward_definitions 
  where id = reward_uuid and is_active = true;

  if reward_points is null then
    return jsonb_build_object('success', false, 'message', 'Reward not found or inactive');
  end if;

  -- Check if already redeemed
  select exists(
    select 1 from user_rewards 
    where user_id = user_uuid and reward_id = reward_uuid
  ) into already_redeemed;

  if already_redeemed then
    return jsonb_build_object('success', false, 'message', 'Reward already redeemed');
  end if;

  -- Get current points
  select points_balance into current_points from profiles where id = user_uuid;

  if current_points is null then
    return jsonb_build_object('success', false, 'message', 'Profile not found');
  end if;

  -- Check if user has enough points
  if current_points < reward_points then
    return jsonb_build_object('success', false, 'message', 'Insufficient points');
  end if;

  -- Insert redemption record
  insert into user_rewards (user_id, reward_id)
  values (user_uuid, reward_uuid);

  -- Deduct points from profile
  update profiles 
  set 
    points_balance = current_points - reward_points,
    updated_at = now()
  where id = user_uuid;

  return jsonb_build_object(
    'success', true,
    'points_deducted', reward_points,
    'remaining_points', current_points - reward_points
  );
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function redeem_reward(uuid) to authenticated;
grant execute on function redeem_reward(uuid) to service_role;