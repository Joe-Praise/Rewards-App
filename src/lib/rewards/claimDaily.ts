import { supabase } from "@/lib/supabase/client";

const DAILY_POINTS = 5;

export async function claimDaily(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: claimed } = await supabase
    .from("reward_events")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "daily")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .maybeSingle();

  if (claimed) {
    throw new Error("Already claimed today");
  }

  await supabase.from("reward_events").insert({
    user_id: userId,
    type: "daily",
    points: DAILY_POINTS,
  });

  await supabase.rpc("increment_points", {
    user_id: userId,
    amount: DAILY_POINTS,
  });
}
