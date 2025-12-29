'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProps } from './types';
import { useSidebar } from './SidebarContext';
import { NavigationItem } from './NavigationItem';
import { UserProfile } from './UserProfile';
import { SidebarBrand } from './SidebarBrand';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar({
    navigationItems,
    userProfile,
    brandConfig,
    className,
    onNavigate,
    onLogout,
}: SidebarProps) {
    const { isCollapsed, isMobile, isOpen, close, toggle } = useSidebar();

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        if (!isMobile || !isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, isOpen, close]);

    // Prevent scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, isOpen]);

    const sidebarWidth = isCollapsed && !isMobile ? 'w-16' : 'w-64';

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar */}
            <aside
                id="sidebar"
                className={cn(
                    'fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
                    sidebarWidth,
                    // Mobile behavior
                    isMobile && (
                        isOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    ),
                    // Desktop behavior
                    !isMobile && 'translate-x-0',
                    className
                )}
            >
                {/* Header with Brand/Logo */}
                {brandConfig && (
                    <div className="border-b border-gray-200 relative">
                        <SidebarBrand brand={brandConfig} />

                        {/* Desktop Collapse Toggle */}
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggle}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="flex-1 p-2 space-y-3 overflow-y-auto">
                    {navigationItems.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            onClick={onNavigate}
                        />
                    ))}
                </nav>

                {/* User Profile */}
                {userProfile && (
                    <div className="border-t border-gray-200 p-2">
                        <UserProfile user={userProfile} onLogout={onLogout} />
                    </div>
                )}
            </aside>
        </>
    );
}