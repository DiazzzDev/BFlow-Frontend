import { SkeletonText } from "@/components/loaders/SkeletonText";

const SKELETON_CARDS = 3;

export const PricingPlansSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
                <div
                    key={index}
                    className="flex min-h-125 flex-col rounded-2xl border border-light-10 bg-surface p-8 md:p-9"
                >
                    <SkeletonText className="mb-4 h-4 w-24" />
                    <SkeletonText className="mb-8 h-10 w-32" />
                    <SkeletonText className="mb-3 h-3 w-full" />
                    <SkeletonText className="mb-3 h-3 w-5/6" />
                    <SkeletonText className="mb-3 h-3 w-4/6" />
                    <SkeletonText className="mt-auto h-11 w-full rounded-xl!" />
                </div>
            ))}
        </div>
    );
};
