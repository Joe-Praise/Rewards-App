'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationItem as NavigationItemType } from './types';
import { useSidebar } from './SidebarContext';

interface NavigationItemProps {
    item: NavigationItemType;
    onClick?: (item: NavigationItemType) => void;
}

export function NavigationItem({ item, onClick }: NavigationItemProps) {
    const pathname = usePathname();
    const { isCollapsed, isMobile, close } = useSidebar();
    const isActive = pathname === item.href;

    const handleClick = (e?: React.MouseEvent) => {
        if (item.disabled) {
            e?.preventDefault();
            if (onClick) {
                onClick(item); // This will show "coming soon" message
            }
            return;
        }

        if (onClick) {
            onClick(item);
        }
        // Close sidebar on mobile after navigation
        if (isMobile && !item.disabled) {
            close();
        }
    };

    const content = (
        <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
            'hover:bg-gray-100 hover:text-gray-900',
            isActive && 'bg-purple-100 text-purple-700 hover:bg-purple-100',
            item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
            isCollapsed && !isMobile && 'justify-center px-2'
        )}>
            <item.icon className={cn(
                'h-5 w-5 shrink-0 transition-colors',
                isActive && 'text-purple-700'
            )} />

            {(!isCollapsed || isMobile) && (
                <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                        <span className={cn(
                            'ml-auto min-w-5 h-5 px-1.5 text-xs font-semibold rounded-full flex items-center justify-center',
                            'bg-gray-200 text-gray-700',
                            isActive && 'bg-purple-200 text-purple-800'
                        )}>
                            {item.badge}
                        </span>
                    )}
                </>
            )}
        </div>
    );

    if (item.disabled) {
        return (
            <div className="px-2" onClick={handleClick}>
                {content}
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={handleClick}
            className="block px-2"
        >
            {content}
        </Link>
    );
}