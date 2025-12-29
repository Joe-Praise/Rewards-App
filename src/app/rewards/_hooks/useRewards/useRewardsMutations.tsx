import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { RedeemContext } from './types';

async function redeemReward(userId: string, rewardId: string) {
    const { error } = await supabase.rpc('redeem_reward', {
        p_user_id: userId,
        p_reward_id: rewardId,
    });

    if (error) throw error;
}

export function useRedeemReward(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reward: { id: string; points: number }) =>
            redeemReward(userId, reward.id),

        onMutate: async reward => {
            await queryClient.cancelQueries({
                queryKey: ['user-points', userId],
            });

            const previousPoints = queryClient.getQueryData<{
                total_points: number;
            }>(['user-points', userId]);

            if (previousPoints) {
                queryClient.setQueryData(['user-points', userId], {
                    total_points:
                        previousPoints.total_points - reward.points,
                });
            }

            return { previousPoints } as RedeemContext;
        },

        onError: (_err, _reward, context) => {
            if (context?.previousPoints) {
                queryClient.setQueryData(
                    ['user-points', userId],
                    context.previousPoints
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['user-points', userId],
            });
            queryClient.invalidateQueries({
                queryKey: ['reward-history', userId],
            });
        },
    });
}
