'use client';

import { supabase } from '@/lib/supabase/client';

export async function ensureProfile(userId: string) {
  // With RLS policies, we can query our own profile without manual filtering
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .maybeSingle();

  if (data) return;

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  // Only insert profile - the trigger will automatically create user_points
  await supabase.from('profiles').insert({ id: userId });
}
