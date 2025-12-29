'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { ToolSpotlight } from './types';

async function fetchRandomTool(): Promise<ToolSpotlight | null> {
  // Get all active tools
  const { data: allTools, error: toolsError } = await supabase
    .from('featured_tools')
    .select('*')
    .eq('is_active', true);

  if (toolsError) throw toolsError;
  if (!allTools?.length) return null;

  // Get user's claimed tools
  const { data: claimedTools, error: claimedError } = await supabase
    .from('user_tool_claims')
    .select('tool_id');

  if (claimedError) throw claimedError;

  const claimedIds = new Set(claimedTools?.map(c => c.tool_id) || []);
  
  // Filter unclaimed tools
  const unclaimedTools = allTools.filter(tool => !claimedIds.has(tool.id));
  
  if (!unclaimedTools.length) return null;

  // Return random unclaimed tool
  const randomIndex = Math.floor(Math.random() * unclaimedTools.length);
  return unclaimedTools[randomIndex];
}

async function claimToolPoints(toolId: string) {
  // Ensure we have a valid session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error('No active session');

  const { data, error } = await supabase.rpc('claim_tool_points', {
    tool_uuid: toolId
  });
  
  if (error) throw error;
  if (!data.success) throw new Error(data.message);
  
  return data;
}

export function useRandomTool(enabled = true) {
  return useQuery({
    queryKey: ['random-tool'],
    queryFn: fetchRandomTool,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - so it changes occasionally
    retry: 2,
  });
}

export function useClaimToolPoints() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: claimToolPoints,
    onSuccess: () => {
      // Force refetch instead of just invalidating
      queryClient.refetchQueries({ queryKey: ['random-tool'] });
      queryClient.refetchQueries({ queryKey: ['points-balance'] });
      queryClient.refetchQueries({ queryKey: ['profile-points'] });
    },
  });
}