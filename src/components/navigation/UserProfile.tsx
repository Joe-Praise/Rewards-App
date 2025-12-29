'use client';

import { cn } from '@/lib/utils';
import { UserProfile as UserProfileType } from './types';
import { useSidebar } from './SidebarContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
    user: UserProfileType;
    onLogout?: () => void;
    className?: string;
}

export function UserProfile({ user, onLogout, className }: UserProfileProps) {
    const { isCollapsed, isMobile } = useSidebar();

    // Generate initials from name
    const getInitials = (name: string) => {
        if (user.initials) return user.initials;
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    const initials = getInitials(user.name);

    if (isCollapsed && !isMobile) {
        return (
            <div className={cn('px-2 space-y-2', className)}>
                <div className="flex items-center justify-center p-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-semibold flex items-center justify-center">
                        {initials}
                    </div>
                </div>
                {onLogout && (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onLogout}
                            className="w-8 h-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={cn('px-2', className)}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-semibold flex items-center justify-center shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {user.email}
                    </p>
                </div>
                {onLogout && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLogout}
                        className="shrink-0 w-8 h-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}