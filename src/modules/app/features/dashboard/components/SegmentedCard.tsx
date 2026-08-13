interface Segment {
    label: string;
    percent: number; // 0-100
}

const SEGMENT_COLORS = ["bg-primary", "bg-info", "bg-success"] as const;

interface SegmentedBarProps {
    segments: Segment[];
    showLegend?: boolean;
}

export const SegmentedBar = ({ segments, showLegend = true }: SegmentedBarProps) => {
    return (
        <div className="mt-3">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-light-5">
                {segments.map((segment, index) => (
                    <div
                        key={segment.label}
                        className={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                        style={{ width: `${segment.percent}%` }}
                    />
                ))}
            </div>

            {showLegend && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {segments.map((segment, index) => (
                        <div key={segment.label} className="flex items-center gap-1.5">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
                            />
                            <span className="text-xs text-helper">
                                {segment.label} - {segment.percent}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};