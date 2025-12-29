'use client';
import { useEffect } from "react";
import { RewardsTabs, PageHeader } from "./_components";
import { useRewardsPageBootstrap } from "./_hooks";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function Reward() {
  const router = useRouter();
  const { user, isLoading } = useRewardsPageBootstrap();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-10">
      <PageHeader
        title='Rewards Hub'
        description='Earn points, unlock rewards, and celebrate your progress!'
        cta={<div className='bg-[#e5e7eb] p-2 rounded-full'>
          < Bell size={18} />
        </div>
        }
      />

      <RewardsTabs />
    </div>
  )
}