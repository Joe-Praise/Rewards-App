-- RPC functions for social features (referrals, activities, campaigns)

-- ===== GENERATE REFERRAL CODE =====
create or replace function generate_referral_code()
returns text as $$
declare
  code_length integer := 8;
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..code_length loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- ===== GET OR CREATE REFERRAL CODE =====
create or replace function get_user_referral_code()
returns jsonb as $$
declare
  user_uuid uuid;
  existing_code text;
  new_code text;
begin
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Check if user already has a referral code
  select referral_code into existing_code
  from referrals 
  where referrer_id = user_uuid 
  limit 1;

  if existing_code is not null then
    return jsonb_build_object(
      'success', true,
      'referral_code', existing_code
    );
  end if;

  -- Generate new unique code
  loop
    new_code := generate_referral_code();
    exit when not exists (select 1 from referrals where referral_code = new_code);
  end loop;

  -- Create referral record
  insert into referrals (referrer_id, referral_code)
  values (user_uuid, new_code);

  return jsonb_build_object(
    'success', true,
    'referral_code', new_code
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== COMPLETE ACTIVITY =====
create or replace function complete_activity(activity_type_param text, points_reward integer default 25)
returns jsonb as $$
declare
  user_uuid uuid;
  current_points integer;
  activity_exists boolean;
begin
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Check if activity already completed
  select exists(
    select 1 from user_activities 
    where user_id = user_uuid and activity_type = activity_type_param
  ) into activity_exists;

  if activity_exists then
    return jsonb_build_object('success', false, 'message', 'Activity already completed');
  end if;

  -- Get current points
  select points_balance into current_points from profiles where id = user_uuid;

  if current_points is null then
    return jsonb_build_object('success', false, 'message', 'Profile not found');
  end if;

  -- Insert activity record
  insert into user_activities (user_id, activity_type, points_earned)
  values (user_uuid, activity_type_param, points_reward);

  -- Update profile points
  update profiles 
  set 
    points_balance = current_points + points_reward,
    updated_at = now()
  where id = user_uuid;

  return jsonb_build_object(
    'success', true,
    'points_earned', points_reward,
    'new_total_points', current_points + points_reward,
    'activity_type', activity_type_param
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== GET USER REFERRAL STATS =====
create or replace function get_referral_stats()
returns jsonb as $$
declare
  user_uuid uuid;
  referral_count integer;
  points_earned integer;
  referral_code_result text;
begin
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Get referral count
  select count(*) into referral_count
  from referrals 
  where referrer_id = user_uuid and status = 'completed';

  -- Get points earned from referrals
  select coalesce(sum(referrals.points_earned), 0) into points_earned
  from referrals 
  where referrer_id = user_uuid and status = 'completed';

  -- Get referral code
  select referral_code into referral_code_result
  from referrals 
  where referrer_id = user_uuid 
  limit 1;

  return jsonb_build_object(
    'success', true,
    'referral_count', referral_count,
    'points_earned', points_earned,
    'referral_code', referral_code_result
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== CHECK USER HAS TECH STACK =====
create or replace function user_has_tech_stack()
returns jsonb as $$
declare
  user_uuid uuid;
  stack_count integer;
begin
  user_uuid := auth.uid();
  
  if user_uuid is null then
    return jsonb_build_object('success', false, 'message', 'Not authenticated');
  end if;

  -- Count user's tech stacks
  select count(*) into stack_count
  from user_tech_stacks 
  where user_id = user_uuid;

  return jsonb_build_object(
    'success', true,
    'has_stack', stack_count > 0,
    'stack_count', stack_count
  );
end;
$$ language plpgsql security definer set search_path = public;

-- ===== FUNCTION PERMISSIONS =====
grant execute on function generate_referral_code() to authenticated, service_role;
grant execute on function get_user_referral_code() to authenticated;
grant execute on function complete_activity(text, integer) to authenticated;
grant execute on function get_referral_stats() to authenticated;
grant execute on function user_has_tech_stack() to authenticated;

grant execute on function get_user_referral_code() to service_role;
grant execute on function complete_activity(text, integer) to service_role;
grant execute on function get_referral_stats() to service_role;
grant execute on function user_has_tech_stack() to service_role;