export const WalletItemSkeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div
            className={`flex justify-between items-center gap-4 py-6 border-b border-b-2 border-light-10 -mx-2 px-2 animate-pulse ${className}`}
        >
            <div className="min-w-0 w-[28%] space-y-2">
                <div className="h-4 w-32 rounded bg-secondary" />
                <div className="h-3 w-24 rounded bg-secondary/70" />
            </div>

            <div className="h-4 w-24 rounded bg-secondary flex-1 mx-auto max-w-28" />
            <div className="h-4 w-24 rounded bg-secondary flex-1 mx-auto max-w-28" />
            <div className="h-4 w-16 rounded bg-secondary" />
            <div className="size-7 rounded bg-secondary shrink-0" />
        </div>
    );
};
