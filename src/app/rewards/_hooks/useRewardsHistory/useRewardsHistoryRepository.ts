'use client';

import { supabase } from '@/lib/supabase/client';
import { RewardHistoryItem } from './types';

export async function getRewardHistory(userId: string) {
  const { data, error } = await supabase
    .from('user_rewards')
    .select(`
      id,
      redeemed_at,
      reward:reward_definitions (
        title,
        points_required
      )
    `)
    .eq('user_id', userId)
    .order('redeemed_at', { ascending: false });

  if (error) throw error;
  return data as RewardHistoryItem[];
}
