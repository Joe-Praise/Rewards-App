export type FilterType = 'all' | 'unlocked' | 'locked' | 'coming_soon';

export interface RewardsGridProps {
    activeFilter: FilterType;
}