import { LucideIcon } from 'lucide-react';

// Navigation item interface
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

// User profile interface
export interface UserProfile {
  name: string;
  email: string;
  initials?: string;
}

// Logo/branding interface
export interface BrandConfig {
  name: string;
  logo?: React.ReactNode;
  href?: string;
}

// Main sidebar props
export interface SidebarProps {
  navigationItems: NavigationItem[];
  userProfile?: UserProfile;
  brandConfig?: BrandConfig;
  className?: string;
  defaultCollapsed?: boolean;
  onNavigate?: (item: NavigationItem) => void;
  onLogout?: () => void;
}

// Sidebar context type
export interface SidebarContextType {
  isCollapsed: boolean;
  isMobile: boolean;
  isOpen: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  close: () => void;
  open: () => void;
}