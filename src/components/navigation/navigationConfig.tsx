'use client';

import {
    Home,
    Search,
    Library,
    Layers,
    CreditCard,
    Gift,
    Settings,
} from 'lucide-react';
import { BrandConfig } from './types';
import { NavigationItemType } from '.';
import { User } from '@/types/models';

// Flowwa logo component matching the design
const FlowwaLogo = () => (
    <div className="flex items-center">
        {/* Flowwa logo with purple glasses and sparkles */}
        <div className="relative">
            <div className="w-8 h-8 relative">
                {/* Sparkles */}
                <div className="absolute -top-1 -left-1 w-2 h-2">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full absolute top-0 left-1"></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full absolute top-1 left-0"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full absolute top-0 right-1"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-1 right-0"></div>
                </div>

                {/* Purple glasses */}
                <div className="w-8 h-8 flex items-center justify-center">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="text-purple-600">
                        <path
                            d="M2 8C2 5.79086 3.79086 4 6 4C8.20914 4 10 5.79086 10 8C10 10.2091 8.20914 12 6 12C3.79086 12 2 10.2091 2 8Z"
                            fill="currentColor"
                        />
                        <path
                            d="M14 8C14 5.79086 15.7909 4 18 4C20.2091 4 22 5.79086 22 8C22 10.2091 20.2091 12 18 12C15.7909 12 14 10.2091 14 8Z"
                            fill="currentColor"
                        />
                        <path
                            d="M10 8H14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
);

// Navigation items configuration
export const navigationItems: NavigationItemType[] = [
    {
        id: 'home',
        label: 'Home',
        href: '#', // Non-functional link
        icon: Home,
        disabled: true, // Disabled since not implemented
    },
    {
        id: 'discover',
        label: 'Discover',
        href: '#', // Non-functional link
        icon: Search,
        disabled: true, // Disabled since not implemented
    },
    {
        id: 'library',
        label: 'Library',
        href: '#', // Non-functional link
        icon: Library,
        disabled: true, // Disabled since not implemented
    },
    {
        id: 'tech-stack',
        label: 'Tech Stack',
        href: '#', // Non-functional link
        icon: Layers,
        disabled: true, // Disabled since not implemented
    },
    {
        id: 'subscriptions',
        label: 'Subscriptions',
        href: '#', // Non-functional link
        icon: CreditCard,
        disabled: true, // Disabled since not implemented
    },
    {
        id: 'rewards',
        label: 'Rewards Hub',
        href: '/rewards', // Only functional link
        icon: Gift,
        // Not disabled - this one works
    },
    {
        id: 'settings',
        label: 'Settings',
        href: '#', // Non-functional link
        icon: Settings,
        disabled: true, // Disabled since not implemented
    },
];

// Brand configuration
export const brandConfig: BrandConfig = {
    name: 'Flowwa',
    logo: <FlowwaLogo />,
    href: '/rewards', // Only go to rewards since it's the only functional page
};

// Helper function to get user profile from auth user
export const getUserProfileFromAuth = (user: User | null) => {
    if (!user) return undefined;

    const fullName = user.full_name || user.email?.split('@')[0] || 'User';

    return {
        name: fullName,
        email: user.email,
        initials: user.full_name
            ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
            : user.email?.charAt(0).toUpperCase() || 'U'
    };
};