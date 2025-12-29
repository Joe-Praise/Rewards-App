export interface ReferAndWinCardProps {
  pointsReward: number;
  deadlineLabel: string;
  inviteCount: number;
  winnersCount: number;
  onRefer?: () => void;
}