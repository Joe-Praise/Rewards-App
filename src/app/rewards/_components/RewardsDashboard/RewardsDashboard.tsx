'use client';

import { DailyStreakCard } from '../DailyStreakCard';
// import { useRewards, useUserProfile } from '../../_hooks';
import { PointsBalanceCard } from '../PointsBalanceCard';
import { ReferAndWinCard } from '../ReferAndWinCard';
import ReferralLinkCard from '../ReferralLinkCard';
import { ShareStackCard } from '../ShareStackCard';
import { SubHeader } from '../SubHeader';
import { ToolSpotlightCard } from '../TopToolSpotlightCard';
// import { RewardCard } from '../RewardCard';

export default function RewardsDashboard() {


    // if (isLoading) return <div>Loading rewards...</div>;
    // if (!rewards?.length) return <div>No rewards available</div>;

    return (
        <div className='flex flex-col gap-10 p-4'>
            <div className='space-y-4'>
                <SubHeader title="Your Rewards Journey" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PointsBalanceCard />
                    <DailyStreakCard />
                    <ToolSpotlightCard />
                </div>
            </div>

            <div className='space-y-4'>
                <SubHeader title="Earn More Points" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* <div className="flex gap-6"> */}

                    <ReferAndWinCard
                        pointsReward={10000}
                        inviteCount={3}
                        winnersCount={5}
                        deadlineLabel="Nov 20"
                        onRefer={() => { }}
                    />

                    <ShareStackCard
                        pointsReward={25}
                        onShare={() => { }}
                    />
                </div>
            </div>

            <div className='space-y-4'>
                <SubHeader title="Refer & Earn" />
                <div className="">
                    <ReferralLinkCard
                        pointsPerReferral={25}
                        onShare={(platform) => console.log(`Shared on ${platform}`)}
                    />
                </div>
            </div>
        </div>
    );
}
