'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Reward } from '../../_types';
import { getRewards } from '../useRewards';


export default function useRewardsLogic(userId: string | null) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Get rewards and points from profiles table
      const [rewardsData, profileData] = await Promise.all([
        getRewards(),
        supabase.from('profiles').select('points_balance').maybeSingle(),
      ]);

      setRewards(rewardsData);
      setPoints(profileData.data?.points_balance || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rewards,
    points,
    loading,
    error,
    refetch: load,
  };
}
