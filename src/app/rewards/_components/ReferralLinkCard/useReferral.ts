'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

async function getReferralStats() {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('get_referral_stats');
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

async function getUserReferralCode() {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('get_user_referral_code');
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

export function useReferralStats(enabled = true) {
  return useQuery({
    queryKey: ['referral-stats'],
    queryFn: getReferralStats,
    enabled,
    staleTime: 30_000, // 30 seconds
    retry: 2,
  });
}

export function useReferralCode(enabled = true) {
  return useQuery({
    queryKey: ['referral-code'],
    queryFn: getUserReferralCode,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - codes don't change often
    retry: 2,
  });
}