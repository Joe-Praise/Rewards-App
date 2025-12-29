'use client';

import { useRedeemReward } from "../../_hooks";
import { RewardcardProps } from "./types";

export default function RewardCard({ reward, userPoints, userId }: RewardcardProps) {
    const canRedeem = userPoints >= reward.points_required;
    const { mutate, isPending } = useRedeemReward(userId);

    const handleRedeem = () => {
        mutate({
            id: reward.id,
            points: reward.points_required,
        });
    };

    return (
        <div className="rounded-lg border p-4 space-y-4">
            <div>
                <h3 className="font-semibold">{reward.title}</h3>
                <p className="text-sm text-muted-foreground">
                    {reward.description}
                </p>
            </div>

            <div className="flex justify-between items-center">
                <span>{reward.points_required} pts</span>

                <button
                    disabled={!canRedeem || isPending}
                    onClick={handleRedeem}
                    className="px-3 py-1 rounded bg-black text-white disabled:opacity-40"
                >
                    {isPending ? 'Redeeming...' : 'Redeem'}
                </button>
            </div>
        </div>
    );
}