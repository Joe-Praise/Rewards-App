import { useQuery } from '@tanstack/react-query';
import { getRewardHistory } from './useRewardsHistoryRepository';

export function useRewardHistory(userId: string) {
    return useQuery({
        queryKey: ['reward-history', userId],
        queryFn: () => getRewardHistory(userId),
        enabled: !!userId,
    });
}
