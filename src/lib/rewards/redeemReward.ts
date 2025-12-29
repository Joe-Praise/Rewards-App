import { supabase } from "@/lib/supabase/client";

export async function redeemReward(
  userId: string,
  rewardId: string,
  cost: number
) {
  await supabase.from("reward_events").insert({
    user_id: userId,
    type: `redeem:${rewardId}`,
    points: -cost,
  });

  await supabase.rpc("increment_points", {
    user_id: userId,
    amount: -cost,
  });
}
