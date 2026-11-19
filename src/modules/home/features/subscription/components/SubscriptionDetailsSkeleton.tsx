import { SkeletonText } from "@/components/loaders/SkeletonText";

const SKELETON_BENEFITS = 6;

export const SubscriptionDetailsSkeleton = () => (
    <div aria-hidden="true">
        <header className="mb-8 max-w-3xl sm:mb-10">
            <SkeletonText className="mb-3 h-4 w-28" />
            <SkeletonText className="h-10 w-3/4 sm:h-12" />
            <SkeletonText className="mt-4 h-4 w-full max-w-xl" />
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6">
            <section className="rounded-3xl border border-light-10 bg-surface p-6 sm:p-8 lg:p-10">
                <SkeletonText className="h-7 w-48" />
                <SkeletonText className="mt-3 h-4 w-64 max-w-full" />
                <div className="my-7 border-t border-light-10" />
                <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: SKELETON_BENEFITS }, (_, index) => (
                        <li key={index}>
                            <SkeletonText className="h-4 w-full" />
                        </li>
                    ))}
                </ul>
            </section>

            <aside className="rounded-3xl border border-light-10 bg-surface p-6 sm:p-7">
                <SkeletonText className="h-4 w-28" />
                <SkeletonText className="mt-3 h-7 w-40" />
                <SkeletonText className="mt-7 h-12 w-36" />
                <SkeletonText className="mt-6 h-4 w-full" />
                <SkeletonText className="mt-2 h-4 w-4/5" />
                <SkeletonText className="mt-7 h-12 w-full rounded-lg!" />
            </aside>
        </div>
    </div>
);
