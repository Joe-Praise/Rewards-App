'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RewardsDashboard } from '../RewardsDashboard';
import { RewardsGrid } from '../RewardsGrid';
import { useRewardsWithStatus } from '../RewardsGrid/useRewards';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'unlocked' | 'locked' | 'coming_soon';

export default function RewardsTabs() {
    const [rewardFilter, setRewardFilter] = useState<FilterType>('all');
    const { data: rewards = [] } = useRewardsWithStatus();

    // Calculate counts for each filter
    const counts = {
        all: rewards.length,
        unlocked: rewards.filter(r => r.status === 'redeemed').length,
        locked: rewards.filter(r => r.status === 'locked' || r.status === 'redeemable').length,
        coming_soon: rewards.filter(r => r.status === 'coming_soon').length,
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <Tabs defaultValue="earn-points" className="w-full">
                <TabsList className="grid gap-2 w-full max-w-md grid-cols-2 bg-transparent">
                    <TabsTrigger
                        value="earn-points"
                        className="py-3 data-[state=active]:text-purple-600 data-[state=active]:border-b-3 data-[state=active]:border-b-purple-600 hover:bg-background rounded-t-sm rounded-b-none"
                    >
                        Earn Points
                    </TabsTrigger>
                    <TabsTrigger
                        value="redeem-rewards"
                        className="py-3 data-[state=active]:text-purple-600 data-[state=active]:border-b-3 data-[state=active]:border-b-purple-600 hover:bg-background rounded-t-sm rounded-b-none"
                    >
                        Redeem Rewards
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="earn-points" className="mt-6">
                    <RewardsDashboard />
                </TabsContent>

                <TabsContent value="redeem-rewards" className="mt-6 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold">Redeem Your Points</h1>

                        {/* Sub-tabs for filtering rewards */}
                        <div className="flex gap-1 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setRewardFilter('all')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${rewardFilter === 'all'
                                    ? 'tab_indicator'
                                    : ' hover:border-b-purple-600 hover:border-b-3 rounded-t-sm rounded-b-none'
                                    }`}
                                data-state={rewardFilter === 'all' ? 'active' : 'inactive'}
                            >
                                All Rewards <span className={cn(`bg-[#e5e7eb] ml-1 text-xs px-2 py-1 rounded-full`, {
                                    'bg-background': rewardFilter === 'all'
                                })}>{counts.all}</span>
                            </button>
                            <button
                                onClick={() => setRewardFilter('unlocked')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${rewardFilter === 'unlocked'
                                    ? 'tab_indicator'
                                    : ' hover:border-b-purple-600 hover:border-b-3 rounded-t-sm rounded-b-none'
                                    }`}
                                data-state={rewardFilter === 'unlocked' ? 'active' : 'inactive'}
                            >
                                Unlocked <span className={cn(`bg-[#e5e7eb] ml-1 text-xs px-2 py-1 rounded-full`, {
                                    'bg-background': rewardFilter === 'unlocked'
                                })}>{counts.unlocked}</span>
                            </button>
                            <button
                                onClick={() => setRewardFilter('locked')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${rewardFilter === 'locked'
                                    ? 'tab_indicator'
                                    : ' hover:border-b-purple-600 hover:border-b-3 rounded-t-sm rounded-b-none'
                                    }`}
                                data-state={rewardFilter === 'locked' ? 'active' : 'inactive'}
                            >
                                Locked <span className={cn(`bg-[#e5e7eb] ml-1 text-xs px-2 py-1 rounded-full`, {
                                    'bg-background': rewardFilter === 'locked'
                                })}>{counts.locked}</span>
                            </button>
                            <button
                                onClick={() => setRewardFilter('coming_soon')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${rewardFilter === 'coming_soon'
                                    ? 'tab_indicator'
                                    : ' hover:border-b-purple-600 hover:border-b-3 rounded-t-sm rounded-b-none'
                                    }`}
                                data-state={rewardFilter === 'coming_soon' ? 'active' : 'inactive'}
                            >
                                Coming Soon <span className={cn(`bg-[#e5e7eb] ml-1 text-xs px-2 py-1 rounded-full`, {
                                    'bg-background': rewardFilter === 'coming_soon'
                                })}>{counts.coming_soon}</span>
                            </button>
                        </div>
                    </div>

                    <RewardsGrid activeFilter={rewardFilter} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
