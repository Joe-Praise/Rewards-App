'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

import { PointsBalanceCardProps } from './types';
import { usePointsBalance } from './usePointsBalance';

export default function PointsBalanceCard({ data }: PointsBalanceCardProps) {
    const coinRef = useRef<HTMLDivElement | null>(null);

    const {
        data: fetchedData,
        isLoading,
        isError,
    } = usePointsBalance(!data);

    const resolvedData = data ?? fetchedData;

    useEffect(() => {
        if (!coinRef.current) return;

        gsap.to(coinRef.current, {
            y: -6,
            rotate: 10,
            duration: 1.6,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
        });
    }, []);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">Loading points…</CardContent>
            </Card>
        );
    }

    if (isError || !resolvedData) {
        return (
            <Card>
                <CardContent className="p-6 text-red-500">
                    Failed to load points
                </CardContent>
            </Card>
        );
    }

    const { points, activeReward } = resolvedData;
    const progress = Math.min(
        (points / activeReward.pointsRequired) * 100,
        100
    );

    return (
        <Card className="relative overflow-hidden pt-0 flex flex-col gap-6 card-hover">
            <CardHeader className="flex flex-row items-center gap-2 bg-[#EEF2FF] py-4">
                <Award className="h-5 w-5 text-[#9013fe]" />
                <CardTitle>Points Balance</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-4xl font-bold text-[#9013fe]">{points}</p>
                    </div>

                    <div
                        ref={coinRef}
                        className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
                    >
                        <span className="text-xl">⭐</span>
                        {/* <Star style={{ fill: 'gold', stroke: 'gold' }} /> */}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            Progress to <span className='font-bold'>
                                {activeReward.title}
                            </span>
                        </p>

                        <div className="text-sm font-bold text-black">
                            <span>{points}</span>/
                            <span>{activeReward.pointsRequired}</span>
                        </div>
                    </div>
                    <Progress value={progress} />
                </div>

                <p className="text-sm text-muted-foreground">
                    {points >= activeReward.pointsRequired
                        ? '🎉 You can redeem this reward now!'
                        : '🚀 Just getting started — keep earning points!'}
                </p>
            </CardContent>
        </Card>
    );
}
