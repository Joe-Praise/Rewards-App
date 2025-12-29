'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/_hooks/useUser/useUser';

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/rewards');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );
}
