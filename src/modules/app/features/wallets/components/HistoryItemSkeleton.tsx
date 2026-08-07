import { SkeletonText } from "@/components/loaders/SkeletonText";

export const HistoryItemSkeleton = () => {
    return (
        <li className="flex items-start justify-between gap-3 border-b border-light-10 py-4 last:border-b-0">
            <div className="flex min-w-0 items-start gap-3">
                <div className="space-y-2">
                    <SkeletonText className="h-3.5 w-28" />
                    <SkeletonText className="h-3 w-36" />
                    <SkeletonText className="h-3 w-20" />
                </div>
            </div>
            <SkeletonText className="h-3.5 w-14" />
        </li>
    );
};
