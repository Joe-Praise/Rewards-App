'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BrandConfig } from './types';
import { useSidebar } from './SidebarContext';

interface SidebarBrandProps {
    brand: BrandConfig;
    className?: string;
}

export function SidebarBrand({ brand, className }: SidebarBrandProps) {
    const { isCollapsed, isMobile } = useSidebar();

    const content = (
        <div className={cn(
            'flex items-center gap-3 px-3 py-4',
            isCollapsed && !isMobile && 'justify-center px-2'
        )}>
            {brand.logo && (
                <div className="shrink-0">
                    {brand.logo}
                </div>
            )}

            {(!isCollapsed || isMobile) && (
                <h1 className="text-xl font-bold text-gray-900 truncate">
                    {brand.name}
                </h1>
            )}
        </div>
    );

    if (brand.href) {
        return (
            <Link
                href={brand.href}
                className={cn('block hover:bg-gray-50 transition-colors duration-200 rounded-lg mx-2', className)}
            >
                {content}
            </Link>
        );
    }

    return (
        <div className={cn('mx-2', className)}>
            {content}
        </div>
    );
}