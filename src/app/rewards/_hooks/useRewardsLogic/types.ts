export interface RewardEvent {
  id: string;
  type: string;
  points: number;
  created_at: string;
}

export interface RewardDefinition {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  status: string;
}
