'use client';

import { supabase } from '@/lib/supabase/client';
import { UserProfile } from './types';

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, points_balance, created_at')
    .maybeSingle();

  if (error) throw error;
  return data;
}
