'use client';

import { useRewardHistory } from "../../_hooks";


export default function RewardsHistory({ userId }: { userId: string }) {
    const { data, isLoading, error } = useRewardHistory(userId);

    if (isLoading) return <div>Loading history...</div>;
    if (error) return <div>Failed to load history</div>;
    if (!data?.length)
        return <div className="text-muted-foreground">No rewards redeemed yet</div>;

    return (
        <div className="space-y-4">
            {data.map(item => {
                const reward = item.reward[0];
                return (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border rounded-lg p-4"
                    >
                        <div>
                            <p className="font-medium">{reward.title}</p>
                            <p className="text-sm text-muted-foreground">
                                Redeemed on {new Date(item.redeemed_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="text-sm font-semibold">
                            -{reward.points_required} pts
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
