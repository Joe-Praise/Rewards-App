'use client';

import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
    className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
    const { toggle, isOpen, isMobile } = useSidebar();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn(
                'shrink-0 md:hidden', // Only show on mobile
                className
            )}
            aria-label="Toggle navigation menu"
        >
            {isMobile && isOpen ? (
                <X className="h-5 w-5" />
            ) : (
                <Menu className="h-5 w-5" />
            )}
        </Button>
    );
}