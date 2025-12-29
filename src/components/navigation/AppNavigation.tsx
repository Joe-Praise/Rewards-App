'use client';

import { SidebarLayout } from './SidebarLayout';
import { useNavigationAuth } from './useNavigationAuth';
import { ReactNode } from 'react';

interface AppNavigationProps {
    children: ReactNode;
}

export function AppNavigation({ children }: AppNavigationProps) {
    const {
        navigationItems,
        brandConfig,
        userProfile,
        isLoading,
        isLoggedIn,
        handleNavigate,
        handleLogout,
    } = useNavigationAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // For non-authenticated users, just show the content (auth pages)
    if (!isLoggedIn) {
        return <>{children}</>;
    }

    // For authenticated users, show the full navigation layout
    return (
        <SidebarLayout
            navigationItems={navigationItems}
            userProfile={userProfile}
            brandConfig={brandConfig}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        >
            {children}
        </SidebarLayout>
    );
}