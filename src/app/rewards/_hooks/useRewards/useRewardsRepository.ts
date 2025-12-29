'use client';

import { supabase } from '@/lib/supabase/client';
import { Reward } from '../../_types';

export async function getRewards() {
  const { data, error } = await supabase
    .from('reward_definitions')
    .select('*')
    .eq('is_active', true)
    .order('points_required');

  if (error) throw error;
  return data as Reward[];
}
