'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Layers } from 'lucide-react';
import { ShareStackModalProps } from './types';

export default function ShareStackModal({
    isOpen,
    onClose,
    onShare,
    userHasStack = false
}: ShareStackModalProps) {
    if (!isOpen) return null;

    const handleShare = () => {
        onShare?.();
        onClose();
    };

    const handleGoToTechStack = () => {
        // Navigate to tech stack page - you can implement this based on your routing
        window.location.href = '/tech-stack'; // or use Next.js router
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Layers className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Share Your Stack</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                    {userHasStack ? (
                        <>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Share your tech stack with the community and earn points!
                                Show others what tools and technologies power your work.
                            </p>

                            {/* <div className="flex gap-2">
                                <Button onClick={handleShare} className="flex-1">
                                    Share Stack
                                </Button>
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Cancel
                                </Button>
                            </div> */}
                        </>
                    ) : (
                        <>
                            <div className="text-center py-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <Layers className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    You have no stack created yet, go to Tech Stack to create one.
                                </p>
                            </div>

                            {/* <div className="flex gap-2">
                                <Button onClick={handleGoToTechStack} className="flex-1">
                                    Go to Tech Stack
                                </Button>
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Cancel
                                </Button>
                            </div> */}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}