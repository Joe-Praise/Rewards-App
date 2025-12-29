'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { ShareStackCardProps } from './types';
import ShareStackModal from './ShareStackModal';
import { useUserHasStack, useCompleteShareStack } from './useShareStack';

export default function ShareStackCard({
    pointsReward,
    onShare,
}: ShareStackCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: stackData } = useUserHasStack();
    const shareStackMutation = useCompleteShareStack();

    const userHasStack = stackData?.has_stack || false;

    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    const handleModalShare = async () => {
        try {
            await shareStackMutation.mutateAsync();
            onShare?.();
            console.log('Tech stack shared successfully!');
        } catch (error) {
            console.error('Failed to share tech stack:', error);
        }
    };

    return (
        <>
            <Card className='py-0 gap-0 w-full card-hover hover:border-primary overflow-hidden'>
                <CardHeader className="flex flex-row items-center gap-2 bg-white py-4 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Share2 className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <h3 className="font-semibold">Share Your Stack</h3>
                            <p className="text-xs text-muted-foreground">
                                Earn +{pointsReward} pts
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 bg-[#f9fafb] rounded-lg h-full">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Share your tool stack</p>

                        <Button
                            variant="secondary"
                            className="gap-2 text-primary bg-background"
                            onClick={handleShareClick}
                            disabled={shareStackMutation.isPending}
                        >
                            <Share2 className="h-4 w-4" />
                            {shareStackMutation.isPending ? 'Sharing...' : 'Share'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ShareStackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onShare={handleModalShare}
                userHasStack={userHasStack}
            />
        </>
    );
}

// return (
//     <>
//         <Card className='py-0 gap-0 w-full'>
//             <CardHeader className="flex flex-row items-center gap-2 bg-white py-4 rounded-t-lg">
//                 <div className="flex items-center gap-3">
//                     <div className="rounded-lg bg-primary/10 p-2">
//                         <Share2 className="h-5 w-5 text-primary" />
//                     </div>

//                     <div>
//                         <h3 className="font-semibold">Share Your Stack</h3>
//                         <p className="text-xs text-muted-foreground">
//                             Earn +{pointsReward} pts
//                         </p>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="p-6 bg-[#f9fafb] rounded-lg h-full">
//                 <div className="flex justify-between items-center">
//                     <p className="text-sm font-medium">Share your tool stack</p>

//                     <Button
//                         variant="secondary"
//                         className="gap-2 text-primary bg-background"
//                         onClick={handleShareClick}
//                     >
//                         <Share2 className="h-4 w-4" />
//                         Share
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>

//         <ShareStackModal
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//             onShare={handleModalShare}
//             userHasStack={userHasStack}
//         />
//     </>
// );


// export default function ShareStackCard({
//     pointsReward,
//     onShare,
// }: ShareStackCardProps) {
//     return (
//         <Card className='py-0 gap-0 w-full'>
//             <CardHeader className="flex flex-row items-center gap-2 bg-white py-4 rounded-t-lg">
//                 <div className="flex items-center gap-3">
//                     <div className="rounded-lg bg-primary/10 p-2">
//                         <Share2 className="h-5 w-5 text-primary" />
//                     </div>

//                     <div>
//                         <h3 className="font-semibold">Share Your Stack</h3>
//                         <p className="text-xs text-muted-foreground">
//                             Earn +{pointsReward} pts
//                         </p>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="p-6 bg-[#f9fafb] rounded-lg h-full">
//                 <div className="flex justify-between items-center">
//                     <p className="text-sm font-medium">Share your tool stack</p>

//                     <Button
//                         variant="secondary"
//                         className="gap-2 text-primary bg-background"
//                         onClick={onShare}
//                     >
//                         <Share2 className="h-4 w-4" />
//                         Share
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }
