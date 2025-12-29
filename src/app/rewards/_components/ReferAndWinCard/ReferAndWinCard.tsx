'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { ReferAndWinCardProps } from './types';

export default function ReferAndWinCard({
    pointsReward,
    deadlineLabel,
    inviteCount,
    winnersCount,
    // onRefer,
}: ReferAndWinCardProps) {
    return (
        <Card className='py-0 gap-0 w-full card-hover hover:border-primary overflow-hidden'>
            <CardHeader className="flex flex-row items-center gap-2 bg-white py-4 rounded-t-lg">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Star className="h-5 w-5 text-primary" />
                    </div>

                    <h3 className="font-semibold">
                        Refer and win {pointsReward.toLocaleString()} points!
                    </h3>
                </div>
            </CardHeader>
            <CardContent className="p-6 bg-[#f9fafb] rounded-lg">

                <p className="text-sm text-black font-medium leading-relaxed">
                    Invite {inviteCount} friends by {deadlineLabel} and earn a chance to be
                    one of {winnersCount} winners of{' '}
                    <span className="font-medium text-primary">
                        {pointsReward.toLocaleString()} points
                    </span>
                    . Friends must complete onboarding to qualify.
                </p>
            </CardContent>
        </Card>
    );
}
