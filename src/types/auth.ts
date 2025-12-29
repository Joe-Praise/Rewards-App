import { User } from "./models";
import { Session } from "@supabase/supabase-js";

export interface UseAuthReturn {
  // State
  user: User | null;
  session: Session | null;
  email: string;
  password: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  isSignUpMode: boolean;
  isLoginLoading: boolean;
  isGoogleLoading: boolean;

  // Operations
  signOut: () => Promise<void>;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleSignup: () => Promise<void>;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsSignUpMode: (mode: boolean) => void;
  clearError: () => void;
}
