'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Zap } from 'lucide-react';

import { DailyStreakCardProps } from './types';
import { useDailyStreak, useClaimDailyPoints } from './useDailyStreak';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function DailyStreakCard({
    data,
    onClaim,
}: DailyStreakCardProps) {
    const pulseRef = useRef<HTMLButtonElement | null>(null);

    const { data: fetched, isLoading } = useDailyStreak(!data);
    const claimMutation = useClaimDailyPoints();
    const resolved = data ?? fetched;

    const handleClaim = async () => {
        try {
            await claimMutation.mutateAsync();
            onClaim?.(); // Call optional callback
        } catch (error) {
            console.error('Failed to claim daily points:', error);
        }
    };

    useEffect(() => {
        if (!pulseRef.current || resolved?.checkedInToday) return;

        gsap.fromTo(
            pulseRef.current,
            { scale: 1 },
            {
                scale: 1.05,
                duration: 0.9,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            }
        );
    }, [resolved]);

    if (isLoading || !resolved) {
        return <Card><CardContent className="p-6">Loading…</CardContent></Card>;
    }

    return (
        <Card className="relative overflow-hidden pt-0 flex flex-col gap-6 card-hover">
            <CardHeader className="flex flex-row items-center gap-2 bg-[#EEF2FF] py-4">
                <Calendar className="h-5 w-5 text-sky-500" />
                <CardTitle>Daily Streak</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 h-full">
                <p className="text-4xl font-bold text-primary">
                    {resolved.currentStreak} day
                </p>

                <div className="h-full">
                    <div className="flex justify-between">
                        {DAYS.map((day, index) => {
                            const isActive = index === resolved.activeDayIndex;
                            return (
                                <div
                                    key={`${day}_${index}`}
                                    className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium
                                    ${isActive
                                            ? 'border-2 border-primary text-primary'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-sm text-muted-foreground my-2 text-center">
                        Check in daily to earn +{resolved.pointsPerCheckIn} points
                    </p>

                    <div className="mt-1.5">
                        <Button
                            ref={pulseRef}
                            className="w-full gap-2 h-12 rounded-full"
                            disabled={resolved.checkedInToday || claimMutation.isPending}
                            onClick={handleClaim}
                        >
                            <Zap className="h-4 w-4" />
                            {claimMutation.isPending ? 'Claiming...' :
                                resolved.checkedInToday ? 'Already Claimed' : "Claim Today's Points"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
