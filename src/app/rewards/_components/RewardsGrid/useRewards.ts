'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface RewardWithStatus {
  id: string;
  title: string;
  description: string;
  points_required: number;
  type: string;
  category: string;
  is_active: boolean;
  status: 'redeemable' | 'locked' | 'redeemed' | 'coming_soon';
}

async function fetchRewardsWithStatus(): Promise<RewardWithStatus[]> {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  // Get user's current points
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('points_balance')
    .maybeSingle();

  if (profileError) throw profileError;
  const userPoints = profile?.points_balance || 0;

  // Get all rewards
  const { data: rewards, error: rewardsError } = await supabase
    .from('reward_definitions')
    .select('*')
    .order('points_required', { ascending: true });

  if (rewardsError) throw rewardsError;

  // Get user's redeemed rewards
  const { data: redeemedRewards, error: redeemedError } = await supabase
    .from('user_rewards')
    .select('reward_id');

  if (redeemedError) throw redeemedError;

  const redeemedIds = new Set(redeemedRewards?.map(r => r.reward_id) || []);

  // Calculate status for each reward
  return rewards?.map(reward => {
    let status: 'redeemable' | 'locked' | 'redeemed' | 'coming_soon';

    if (!reward.is_active) {
      status = 'coming_soon';
    } else if (redeemedIds.has(reward.id)) {
      status = 'redeemed';
    } else if (userPoints >= reward.points_required) {
      status = 'redeemable';
    } else {
      status = 'locked';
    }

    return {
      ...reward,
      status
    };
  }) || [];
}

async function redeemReward(rewardId: string) {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('redeem_reward', {
    reward_uuid: rewardId
  });
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

export function useRewardsWithStatus(enabled = true) {
  return useQuery({
    queryKey: ['rewards-with-status'],
    queryFn: fetchRewardsWithStatus,
    enabled,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      // Refresh all relevant queries after redemption
      queryClient.refetchQueries({ queryKey: ['rewards-with-status'] });
      queryClient.refetchQueries({ queryKey: ['points-balance'] });
      queryClient.refetchQueries({ queryKey: ['profile-points'] });
    },
  });
}