export const LegalSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 bg-(--card) rounded-xl w-2/3" />

            <div className="space-y-3">
                <div className="h-4 bg-(--card) rounded-lg w-full" />
                <div className="h-4 bg-(--card) rounded-lg w-5/6" />
                <div className="h-4 bg-(--card) rounded-lg w-4/5" />
            </div>

            <div className="h-6 bg-(--card) rounded-xl w-1/2 mt-8" />

            <div className="space-y-3">
                <div className="h-4 bg-(--card) rounded-lg w-full" />
                <div className="h-4 bg-(--card) rounded-lg w-3/4" />
                <div className="h-4 bg-(--card) rounded-lg w-5/6" />
                <div className="h-4 bg-(--card) rounded-lg w-2/3" />
            </div>

            <div className="h-6 bg-(--card) rounded-xl w-2/5 mt-8" />

            <div className="space-y-3">
                <div className="h-4 bg-(--card) rounded-lg w-full" />
                <div className="h-4 bg-(--card) rounded-lg w-11/12" />
                <div className="h-4 bg-(--card) rounded-lg w-4/5" />
            </div>
        </div>
    );
}; 