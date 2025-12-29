'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { PointsBalanceData } from './types';

async function fetchPointsBalance(): Promise<PointsBalanceData> {
  // 1. Get user's current points from profiles (single source of truth)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('points_balance')
    .maybeSingle();

  if (profileError) throw profileError;

  const currentPoints = profile?.points_balance || 0;

  // 2. Get all active rewards ordered by points_required
  const { data: allRewards, error: rewardsError } = await supabase
    .from('reward_definitions')
    .select('id, title, points_required, is_active')
    .eq('is_active', true)
    .order('points_required', { ascending: true });

  if (rewardsError) throw rewardsError;

  // 3. Get user's claimed/redeemed rewards (RLS will filter by authenticated user)
  const { data: claimedRewards, error: claimedError } = await supabase
    .from('user_rewards')
    .select('reward_id');

  if (claimedError) throw claimedError;

  const claimedIds = new Set(claimedRewards?.map(r => r.reward_id) || []);

  // 4. Find the first reward that hasn't been claimed yet (active target)
  const activeReward = allRewards?.find(reward => !claimedIds.has(reward.id));

  if (!activeReward) {
    // Fallback: use the last reward if all are claimed
    const lastReward = allRewards?.[allRewards.length - 1];
    return {
      points: currentPoints,
      activeReward: {
        id: lastReward?.id || '',
        title: lastReward?.title || '$5 Gift Card',
        pointsRequired: lastReward?.points_required || 5000,
      }
    };
  }

  return {
    points: currentPoints,
    activeReward: {
      id: activeReward.id,
      title: activeReward.title,
      pointsRequired: activeReward.points_required,
    }
  };
}

export function usePointsBalance(enabled = true) {
  return useQuery({
    queryKey: ['points-balance'],
    queryFn: fetchPointsBalance,
    enabled,
    staleTime: 30_000,
    retry: 2,
  });
}
