import type { ReactNode } from "react";

import { SkeletonText } from "@/components/loaders/SkeletonText";

interface WalletItemSkeletonProps {
    className?: string;
    children?: ReactNode;
}

export const WalletItemSkeleton = ({
    className = "",
    children,
}: WalletItemSkeletonProps) => {
    return (
        <div
            className={`border-b border-light-10 px-1 py-4 sm:border-b-2 sm:px-2 sm:py-6 ${className}`}
        >
            {children ?? (
                <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1 space-y-2 sm:flex-[1.6]">
                        <SkeletonText className="h-4 w-28 sm:w-32" />
                        <SkeletonText className="h-3 w-36 sm:w-20" />
                        <div className="flex gap-2 pt-1 sm:hidden">
                            <SkeletonText className="h-3 w-12" />
                            <SkeletonText className="h-3 w-16" />
                        </div>
                    </div>
                    <SkeletonText className="mx-auto hidden h-4 w-20 flex-1 sm:block" />
                    <SkeletonText className="mx-auto hidden h-4 w-20 flex-1 sm:block" />
                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <SkeletonText className="h-4 w-16" />
                        <SkeletonText className="hidden size-7 shrink-0 sm:block" />
                    </div>
                </div>
            )}
        </div>
    );
};
