export interface User {
  id: string;
  email: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  tasks_created: number;
  points_balance?: number;
  created_at?: string;
  updated_at?: string;
}
