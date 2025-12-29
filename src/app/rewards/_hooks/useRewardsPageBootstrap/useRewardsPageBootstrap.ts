'use client';

import { useEffect } from 'react';
import { useUser } from '@/app/_hooks';
// import { ensureProfile } from '@/lib/profile/ensureProfile';

export default function useRewardsPageBootstrap() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      // Don't manually ensure profile - let the trigger handle it
      // ensureProfile(user.id);
    }
  }, [user, isLoading]);

  return { user, isLoading };
}
