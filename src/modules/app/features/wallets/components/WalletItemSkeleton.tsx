import { SkeletonText } from "@/components/loaders/SkeletonText";

export const WalletItemSkeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div
            className={`flex justify-between items-center gap-4 py-6 border-b border-b-2 border-light-10 -mx-2 px-2 ${className}`}
        >
            <div className="min-w-0 w-[28%] space-y-2">
                <SkeletonText className="h-4 w-32" />
                <SkeletonText className="h-3 w-20" />
            </div>

            <SkeletonText className="h-4 w-28 max-w-28 flex-1 mx-auto" />
            <SkeletonText className="h-4 w-20 max-w-28 flex-1 mx-auto" />
            <SkeletonText className="h-4 w-14" />
            <SkeletonText className="size-7 shrink-0" />
        </div>
    );
};
