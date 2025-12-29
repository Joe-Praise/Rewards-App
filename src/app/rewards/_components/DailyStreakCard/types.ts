export interface DailyStreakData {
  currentStreak: number;
  checkedInToday: boolean;
  activeDayIndex: number; // 0 = Mon ... 6 = Sun
  pointsPerCheckIn: number;
}

export interface DailyStreakCardProps {
  data?: DailyStreakData;
  onClaim?: () => void;
}
