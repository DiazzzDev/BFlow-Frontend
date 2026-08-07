import { SkeletonText } from "@/components/loaders/SkeletonText";

export const LegalSkeleton = () => {
    return (
        <div className="space-y-6">
            <SkeletonText className="h-8 w-2/3" />

            <div className="space-y-3">
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-5/6" />
                <SkeletonText className="h-4 w-4/5" />
            </div>

            <SkeletonText className="h-6 w-1/2 mt-8" />

            <div className="space-y-3">
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-3/4" />
                <SkeletonText className="h-4 w-5/6" />
                <SkeletonText className="h-4 w-2/3" />
            </div>

            <SkeletonText className="h-6 w-2/5 mt-8" />

            <div className="space-y-3">
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-11/12" />
                <SkeletonText className="h-4 w-4/5" />
            </div>
        </div>
    );
};
