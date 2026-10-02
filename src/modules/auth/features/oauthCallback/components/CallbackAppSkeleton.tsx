import { SkeletonBlock } from "./SkeletonBlock";

const NAV_ITEMS = 5;
const STAT_CARDS = 3;

export const CallbackAppSkeleton = () => {
    return (
        <div aria-hidden="true" className="absolute inset-0 flex opacity-60">
            <aside className="hidden w-56 shrink-0 flex-col gap-3 border-r border-light-10 bg-surface px-4 py-6 lg:flex">
                <SkeletonBlock order={0} className="mb-5 h-8 w-28" />
                {Array.from({ length: NAV_ITEMS }, (_, index) => (
                    <SkeletonBlock key={index} order={index + 1} className="h-9 w-full" />
                ))}
                <SkeletonBlock order={NAV_ITEMS + 1} className="mt-auto h-9 w-full" />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-light-10 px-6">
                    <SkeletonBlock order={2} className="h-5 w-40" />
                    <div className="flex items-center gap-3">
                        <SkeletonBlock order={3} className="h-9 w-9" />
                        <SkeletonBlock order={4} className="h-9 w-9 rounded-full" />
                    </div>
                </header>

                <div className="grid flex-1 auto-rows-min gap-4 p-6 sm:grid-cols-3">
                    {Array.from({ length: STAT_CARDS }, (_, index) => (
                        <SkeletonBlock key={index} order={index + 5} className="h-28 rounded-2xl" />
                    ))}
                    <SkeletonBlock order={8} className="h-72 rounded-2xl sm:col-span-2" />
                    <SkeletonBlock order={9} className="h-72 rounded-2xl" />
                    <SkeletonBlock order={10} className="h-40 rounded-2xl sm:col-span-3" />
                </div>
            </div>
        </div>
    );
};
