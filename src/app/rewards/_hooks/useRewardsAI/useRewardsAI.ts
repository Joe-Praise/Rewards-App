import { supabase } from "@/lib/supabase/client";

export async function getRewardsInsight(payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke(
    "rewards-assistant",
    { body: payload }
  );

  if (error) throw error;
  return data.message as string;
}
