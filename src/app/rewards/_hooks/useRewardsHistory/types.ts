export interface RewardHistoryItem {
  id: string;
  redeemed_at: string;
  reward: {
    title: string;
    points_required: number;
  }[];
}