export type RewardType = 'voucher' | 'cashback' | 'badge';

export interface Reward {
  id: string;
  title: string;
  description: string | null;
  points_required: number;
  type: RewardType;
  is_active: boolean;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
}

export interface UserPoints {
  user_id: string;
  total_points: number;
  updated_at: string;
}
