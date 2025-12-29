'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SidebarContextType } from './types';

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(false); // Don't collapse on mobile, use overlay instead
                setIsOpen(false); // Close by default on mobile
            } else {
                setIsOpen(true); // Always open on desktop
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggle = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const collapse = () => setIsCollapsed(true);
    const expand = () => setIsCollapsed(false);
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    const value: SidebarContextType = {
        isCollapsed,
        isMobile,
        isOpen,
        toggle,
        collapse,
        expand,
        close,
        open,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}