'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Gift, DollarSign, GraduationCap, Music, Coffee, ShoppingBag } from 'lucide-react';
import { useRewardsWithStatus, useRedeemReward } from './useRewards';
import { RewardsGridProps } from './types';

const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
        case 'shopping': return ShoppingBag;
        case 'food & drink': return Coffee;
        case 'finance': return DollarSign;
        case 'education': return GraduationCap;
        case 'entertainment': return Music;
        default: return Gift;
    }
};

const getStatusButton = (status: string, onRedeem: () => void, isRedeeming: boolean) => {
    switch (status) {
        case 'redeemable':
            return (
                <Button
                    onClick={onRedeem}
                    disabled={isRedeeming}
                    className="w-full bg-primary hover:bg-primary/90"
                >
                    {isRedeeming ? 'Redeeming...' : 'Redeem'}
                </Button>
            );
        case 'locked':
            return (
                <Button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed">
                    Locked
                </Button>
            );
        case 'redeemed':
            return (
                <Button disabled className="w-full bg-green-100 text-green-700 cursor-not-allowed">
                    Redeemed
                </Button>
            );
        case 'coming_soon':
            return (
                <Button disabled className="w-full bg-blue-100 text-blue-700 cursor-not-allowed">
                    Coming Soon
                </Button>
            );
        default:
            return (
                <Button disabled className="w-full bg-gray-200 text-gray-500">
                    Unavailable
                </Button>
            );
    }
};


export default function RewardsGrid({ activeFilter }: RewardsGridProps) {
    const { data: rewards = [], isLoading } = useRewardsWithStatus();
    const redeemMutation = useRedeemReward();

    const handleRedeem = async (rewardId: string) => {
        try {
            await redeemMutation.mutateAsync(rewardId);
            console.log('Reward redeemed successfully!');
        } catch (error) {
            console.error('Failed to redeem reward:', error);
        }
    };

    const filteredRewards = rewards.filter(reward => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unlocked') return reward.status === 'redeemed';
        if (activeFilter === 'locked') return reward.status === 'locked' || reward.status === 'redeemable';
        if (activeFilter === 'coming_soon') return reward.status === 'coming_soon';
        return true;
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-8 bg-gray-200 rounded w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!filteredRewards.length) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Gift className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                    {activeFilter === 'all' ? 'No rewards available' : `No ${activeFilter} rewards found`}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map(reward => {
                const IconComponent = getCategoryIcon(reward.category);

                return (
                    <Card key={reward.id} className="overflow-hidden pt-0 gap-0 card-hover">
                        <CardHeader>
                            {/* Icon Section */}
                            <div className="p-0 text-center">
                                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
                                    <IconComponent className="h-8 w-8 text-purple-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 h-full">
                            {/* Content Section */}
                            <div className="p-6 pt-0 space-y-4">
                                <div className="text-center space-y-2 w-[70%] mx-auto">
                                    <h3 className="font-semibold text-lg">{reward.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {reward.description}
                                    </p>
                                </div>

                                {/* Points Display */}
                                <div className="flex items-center justify-center gap-1 text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="font-semibold text-primary">{reward.points_required?.toLocaleString()} pts</span>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    {getStatusButton(
                                        reward.status,
                                        () => handleRedeem(reward.id),
                                        redeemMutation.isPending && redeemMutation.variables === reward.id
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}


