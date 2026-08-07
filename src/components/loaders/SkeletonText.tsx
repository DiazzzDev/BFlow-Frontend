interface SkeletonTextProps {
    className?: string;
}

export const SkeletonText = ({ className = "" }: SkeletonTextProps) => {
    return (
        <div
            className={`animate-pulse rounded-full bg-secondary ${className}`}
        />
    );
};
