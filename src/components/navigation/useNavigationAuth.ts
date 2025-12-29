'use client';

import { useUser } from '@/app/_hooks/useUser/useUser';
import { navigationItems, brandConfig, getUserProfileFromAuth } from './navigationConfig';
import { NavigationItemType } from '.';
import { useRouter } from 'next/navigation';

export function useNavigationAuth() {
  const { user, isLoading, isLoggedIn, signOut } = useUser();
  const router = useRouter();
  
  const userProfile = getUserProfileFromAuth(user);
  
  const handleNavigate = (item: NavigationItemType) => {
    if (item.disabled) {
      // Show a toast or alert for disabled items
      console.log(`${item.label} is coming soon!`);
      return;
    }
    
    // For enabled items, let the Link component handle navigation
    console.log('Navigating to:', item.label, item.href);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return {
    navigationItems,
    brandConfig,
    userProfile,
    isLoading,
    isLoggedIn,
    handleNavigate,
    handleLogout,
  };
}