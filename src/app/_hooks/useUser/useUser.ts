'use client';
import { useState, useEffect } from "react";
import { User } from "@/types/models";
import { UseAuthReturn } from "@/types/auth";
import { createBrowserClient } from "@supabase/ssr";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function useUser(): UseAuthReturn {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Helper function to get base URL consistently
  const getBaseUrl = () => {
    // Check for environment variable first
    if (process.env.NEXT_PUBLIC_APP_URL) {
      // console.log('Using NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    
    // Fallback to window.location.origin
    // console.log('Falling back to window.location.origin:', window.location.origin);
    return window.location.origin;
  };

  // State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Helper functions
  const clearError = () => setError(null);

const fetchUserProfile = async (session: Session) => {
  const authUser = session.user;

  if (!authUser.email) return;

  setIsLoading(true);

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, points_balance, created_at")
      .maybeSingle();

    setUser({
      id: profile?.id || authUser.id,
      email: authUser.email,
      user_id: authUser.id,
      full_name: authUser.user_metadata?.full_name,
      avatar_url: authUser.user_metadata?.avatar_url,
      tasks_created: 0,
      points_balance: profile?.points_balance || 0,
      created_at: profile?.created_at,
    });
  } catch (error) {
    console.error("Profile bootstrap failed:", error);
    setError("Failed to initialize user profile");
  } finally {
    setIsLoading(false);
  }
};


const updateSessionState = async (newSession: Session | null) => {
  setSession(newSession);
  setIsLoggedIn(!!newSession);

  if (newSession) {
    await fetchUserProfile(newSession);
  } else {
    setUser(null);
    setIsLoading(false);
  }
};

  // Auth methods
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign out';
      setError(errorMessage);
      console.error("Error signing out:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setError(error.message);
      const baseUrl = getBaseUrl();
      router.push(`${baseUrl}/rewards`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setError(errorMessage);
      console.error("Error logging in:", error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const baseUrl = getBaseUrl();
      
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${baseUrl}/rewards`,
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during Google login';
      setError(errorMessage);
      console.error("Error with Google login:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignup = async () => {
    clearError();
    try {
      const baseUrl = getBaseUrl();
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${baseUrl}/rewards` },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Please check your email to confirm your account");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
      setError(errorMessage);
      console.error("Error signing up:", error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await updateSessionState(session);
      } catch (error: unknown) {
        console.error("Error initializing auth:", error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during initialization';
        setError(errorMessage);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSessionState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    // State
    user,
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    isLoginLoading,
    isGoogleLoading,
    error,
    isSignUpMode,

    // Operations
    signOut,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    setIsSignUpMode,
    clearError,
  };
}

export default useUser;
