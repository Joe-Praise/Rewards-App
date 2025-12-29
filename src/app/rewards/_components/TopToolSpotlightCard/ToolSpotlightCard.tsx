'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, UserPlus, Calendar, FileText, Layers, Target, Zap } from 'lucide-react';

import { ToolSpotlightCardProps } from './types';
import { useRandomTool, useClaimToolPoints } from './useToolSpotlight';

const ICON_MAP = {
    calendar: Calendar,
    'file-text': FileText,
    layers: Layers,
    target: Target,
    zap: Zap,
};

export default function ToolSpotlightCard({
    tool,
    onSignup,
    onClaim,
}: ToolSpotlightCardProps) {
    const { data: randomTool, isLoading } = useRandomTool(!tool);
    const claimMutation = useClaimToolPoints();
    const resolvedTool = tool || randomTool;

    if (isLoading) {
        return (
            <Card className="overflow-hidden bg-linear-to-br from-violet-600 to-sky-400 text-white">
                <CardContent className="p-6">
                    <p>Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (!resolvedTool) {
        return (
            <Card className="overflow-hidden bg-linear-to-br from-violet-600 to-sky-400 text-white">
                <CardContent className="p-6">
                    <p>🎉 All tools claimed! Check back later for new ones.</p>
                </CardContent>
            </Card>
        );
    }

    const handleClaim = async () => {
        try {
            await claimMutation.mutateAsync(resolvedTool.id);
            onClaim?.();
        } catch (error) {
            console.error('Failed to claim tool points:', error);
        }
    };

    const handleSignup = () => {
        if (resolvedTool.signup_url) {
            window.open(resolvedTool.signup_url, '_blank');
        }
        onSignup?.();
    };

    const IconComponent = resolvedTool.icon_name ? ICON_MAP[resolvedTool.icon_name as keyof typeof ICON_MAP] : Gift;

    return (
        <Card className="overflow-hidden py-0 gap-3 card-hover">
            <CardHeader className="flex justify-between items-center gap-2 text-white bg-linear-to-br from-violet-600 to-sky-400 py-3">
                <div className="">
                    <div className="flex items-center justify-between">
                        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs">
                            Featured
                        </span>
                    </div>

                    <h3 className="text-2xl font-semibold">Top Tool Spotlight</h3>
                    <h4 className="text-xl font-medium">{resolvedTool.name}</h4>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-0 pt-3 flex flex-col justify-between h-full">

                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-8 mt-0.5 text-primary" />
                    <div>
                        <p className="font-medium text-sm">Automate and Optimize Your Schedule</p>
                        <p className="text-sm  mt-1 leading-6">{resolvedTool.description}</p>
                    </div>
                </div>

                <div className="flex justify-between gap-3 py-2 border-t">
                    <Button
                        variant="secondary"
                        className="gap-2 text-white rounded-full"
                        onClick={handleSignup}
                    >
                        <UserPlus className="h-4 w-4" />
                        Sign up
                    </Button>
                    {/* linear-gradient(45deg,#9013fe,#ff8687) */}
                    <Button
                        className="gap-2 bg-linear-to-br from-primary to-[#ff8687] text-white hover:bg-white/90 rounded-full hover:gap-1"
                        disabled={claimMutation.isPending}
                        onClick={handleClaim}
                    >
                        <Gift className="h-4 w-4" />
                        {claimMutation.isPending ? 'Claiming...' : `Claim ${resolvedTool.points_reward} pts`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
