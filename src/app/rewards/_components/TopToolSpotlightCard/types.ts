export interface ToolSpotlight {
  id: string;
  name: string;
  description: string;
  points_reward: number;
  category: string;
  signup_url?: string;
  icon_name?: string;
  is_active: boolean;
}

export interface ToolSpotlightCardProps {
  tool?: ToolSpotlight;
  onSignup?: () => void;
  onClaim?: () => void;
}
