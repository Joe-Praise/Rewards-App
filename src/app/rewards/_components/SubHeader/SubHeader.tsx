'use client';

import { EarnMoreHeaderProps } from './types';

export default function SubHeaderHeader({ title }: EarnMoreHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-primary" />
            <h2 className="text-xl font-semibold">{title}</h2>
        </div>
    );
}
