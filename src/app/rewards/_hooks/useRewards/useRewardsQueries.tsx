import { useQuery } from '@tanstack/react-query';
import { getRewards } from './useRewardsRepository';

export function useRewards() {
    return useQuery({
        queryKey: ['rewards'],
        queryFn: getRewards,
    });
}
