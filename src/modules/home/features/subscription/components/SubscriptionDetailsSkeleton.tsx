import { SkeletonText } from "@/components/loaders/SkeletonText";

const SKELETON_BENEFITS = 6;

export const SubscriptionDetailsSkeleton = () => {
    return (
        <>
            <section
                aria-hidden="true"
                className="mb-5 flex flex-col gap-4 rounded-xl border border-light-10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
                <div className="flex flex-col gap-3">
                    <SkeletonText className="h-4 w-28" />
                    <SkeletonText className="h-7 w-48" />
                </div>

                <div className="flex items-baseline gap-2">
                    <SkeletonText className="h-10 w-28" />
                    <SkeletonText className="h-4 w-16" />
                </div>
            </section>

            <section
                aria-hidden="true"
                className="rounded-xl border border-light-10 bg-surface p-5 sm:p-8"
            >
                <header className="flex flex-col gap-3">
                    <SkeletonText className="h-8 w-3/4" />
                    <SkeletonText className="h-4 w-full" />
                    <SkeletonText className="h-4 w-5/6" />
                </header>

                <div className="my-8 border-t border-light-10" />

                <SkeletonText className="mb-5 h-5 w-24" />
                <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: SKELETON_BENEFITS }, (_, index) => (
                        <li key={index}>
                            <SkeletonText className="h-4 w-full" />
                        </li>
                    ))}
                </ul>

                <div className="my-8 border-t border-light-10" />

                <div className="flex justify-end">
                    <SkeletonText className="h-12 w-36 rounded-lg!" />
                </div>
            </section>
        </>
    );
};
