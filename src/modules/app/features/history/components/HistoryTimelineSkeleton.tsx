import { SkeletonText } from "@/components/loaders/SkeletonText";

export const HistoryTimelineSkeleton = () => {
    return (
        <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, groupIndex) => (
                <div
                    key={groupIndex}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-5"
                >
                    <SkeletonText className="h-16 w-16 rounded-full sm:h-[4.75rem] sm:w-[4.75rem]" />

                    <div className="space-y-3">
                        {Array.from({ length: 2 }).map((__, cardIndex) => (
                            <div
                                key={cardIndex}
                                className="rounded-xl border border-light-10 p-4"
                            >
                                <div className="flex gap-3">
                                    <SkeletonText className="h-11 w-11 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonText className="h-4 w-2/3" />
                                        <SkeletonText className="h-3 w-1/2" />
                                        <SkeletonText className="h-3 w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
