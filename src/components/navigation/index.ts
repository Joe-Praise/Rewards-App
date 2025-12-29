// Main components
export { Sidebar } from './Sidebar';
export { SidebarLayout } from './SidebarLayout';
export { NavigationItem } from './NavigationItem';
export { UserProfile } from './UserProfile';
export { SidebarBrand } from './SidebarBrand';
export { SidebarToggle } from './SidebarToggle';

// Integrated navigation wrapper
export { AppNavigation } from './AppNavigation';

// Context and hooks
export { SidebarProvider, useSidebar } from './SidebarContext';
export { useNavigationAuth } from './useNavigationAuth';

// Configuration
export { navigationItems, brandConfig, getUserProfileFromAuth } from './navigationConfig';

// Types
export type {
  NavigationItem as NavigationItemType,
  UserProfile as UserProfileType,
  BrandConfig,
  SidebarProps,
  SidebarContextType,
} from './types';
