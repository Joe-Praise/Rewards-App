'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

async function checkUserHasStack() {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('user_has_tech_stack');
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

async function completeShareStackActivity() {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('complete_activity', {
    activity_type_param: 'share_stack',
    points_reward: 25
  });
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

export function useUserHasStack(enabled = true) {
  return useQuery({
    queryKey: ['user-has-stack'],
    queryFn: checkUserHasStack,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useCompleteShareStack() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeShareStackActivity,
    onSuccess: () => {
      // Refresh relevant queries
      queryClient.refetchQueries({ queryKey: ['user-has-stack'] });
      queryClient.refetchQueries({ queryKey: ['points-balance'] });
      queryClient.refetchQueries({ queryKey: ['profile-points'] });
    },
  });
}