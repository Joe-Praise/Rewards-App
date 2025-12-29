export interface RewardTier {
  id: string;
  title: string;
  pointsRequired: number;
}

export interface PointsBalanceData {
  points: number;
  activeReward: RewardTier;
}

export interface PointsBalanceCardProps {
  /** Optional override for data (storybook, tests, previews) */
  data?: PointsBalanceData;
}
