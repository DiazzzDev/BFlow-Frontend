import { SkeletonText } from "@/components/loaders/SkeletonText";

export const BudgetItemSkeleton = () => {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-light-10 px-1 py-4 last:border-b-0 sm:items-center sm:gap-4 sm:py-5">
            <div className="min-w-0 flex-1 space-y-3">
                <SkeletonText className="h-4 w-32 sm:w-40" />
                <SkeletonText className="h-3 w-44 sm:w-56" />
                <div className="flex flex-wrap gap-2">
                    <SkeletonText className="h-5 w-16 rounded-full" />
                    <SkeletonText className="h-5 w-16 rounded-full" />
                    <SkeletonText className="hidden h-5 w-20 rounded-full sm:block" />
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <SkeletonText className="h-6 w-16 rounded-full sm:w-20" />
                <SkeletonText className="hidden size-5 sm:block" />
            </div>
        </div>
    );
};
