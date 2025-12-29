'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { DailyStreakData } from './types';

async function fetchDailyStreak(): Promise<DailyStreakData> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('current_streak, last_checkin_date')
    .maybeSingle();

  if (error) throw error;

  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0 format
  
  const lastCheckin = profile?.last_checkin_date ? new Date(profile.last_checkin_date) : null;
  const todayString = today.toISOString().split('T')[0];
  const checkedInToday = lastCheckin?.toISOString().split('T')[0] === todayString;

  return {
    currentStreak: profile?.current_streak || 0,
    checkedInToday,
    activeDayIndex: currentDayIndex,
    pointsPerCheckIn: 5,
  };
}

async function claimDailyPoints() {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('claim_daily_points');
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

export function useDailyStreak(enabled = true) {
  return useQuery({
    queryKey: ['daily-streak'],
    queryFn: fetchDailyStreak,
    enabled,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useClaimDailyPoints() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: claimDailyPoints,
    onSuccess: () => {
      // Force refetch instead of just invalidating
      queryClient.refetchQueries({ queryKey: ['daily-streak'] });
      queryClient.refetchQueries({ queryKey: ['points-balance'] });
      queryClient.refetchQueries({ queryKey: ['profile-points'] });
    },
  });
}
