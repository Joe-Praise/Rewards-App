'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { Sidebar } from './Sidebar';
import { SidebarToggle } from './SidebarToggle';
import { SidebarProps } from './types';

interface SidebarLayoutProps extends SidebarProps {
    children: ReactNode;
    header?: ReactNode;
    topBarClassName?: string;
}

function SidebarLayoutContent({
    children,
    header,
    topBarClassName,
    ...sidebarProps
}: SidebarLayoutProps) {
    const { isCollapsed, isMobile } = useSidebar();

    // Calculate main content margin based on sidebar state
    const getMainContentClass = () => {
        if (isMobile) {
            return 'ml-0'; // No margin on mobile (overlay)
        }
        return isCollapsed ? 'ml-16' : 'ml-64'; // Desktop margins
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar {...sidebarProps} />

            <div className={cn(
                'transition-all duration-300 ease-in-out',
                getMainContentClass()
            )}>
                {/* Top Bar with Mobile Toggle */}
                {(header || isMobile) && (
                    <header className={cn(
                        'sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4',
                        topBarClassName
                    )}>
                        <SidebarToggle />
                        {header}
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

export function SidebarLayout(props: SidebarLayoutProps) {
    return (
        <SidebarProvider>
            <SidebarLayoutContent {...props} />
        </SidebarProvider>
    );
}