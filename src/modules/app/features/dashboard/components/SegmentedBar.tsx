import { formatPercentValue } from "../utils/formatPercent";

interface Segment {
    label: string;
    percent: number;
}

const SEGMENT_COLORS = ["bg-primary", "bg-info", "bg-success"] as const;

interface SegmentedBarProps {
    segments: Segment[];
    showLegend?: boolean;
    showSegmentLabels?: boolean;
}

export const SegmentedBar = ({
    segments,
    showLegend = true,
    showSegmentLabels = false,
}: SegmentedBarProps) => {
    return (
        <div className="mt-5">
            <div className="flex h-3 w-full gap-1.5">
                {segments.map((segment, index) => (
                    <div
                        key={`${segment.label}-${index}`}
                        className={`h-full min-w-0 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
                        style={{ flex: `${Math.max(segment.percent, 0)} 1 0%` }}
                    />
                ))}
            </div>

            {showSegmentLabels && (
                <div className="mt-2 flex w-full gap-1.5">
                    {segments.map((segment, index) => (
                        <span
                            key={`${segment.label}-label-${index}`}
                            className="min-w-0 text-xs text-helper"
                            style={{ flex: `${Math.max(segment.percent, 0)} 1 0%` }}
                        >
                            {formatPercentValue(segment.percent)}%
                        </span>
                    ))}
                </div>
            )}

            {showLegend && (
                <ul className="mt-4 flex flex-col gap-2.5">
                    {segments.map((segment, index) => (
                        <li
                            key={`${segment.label}-legend-${index}`}
                            className="flex items-center gap-2"
                        >
                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}
                            />
                            <span className="text-sm text-helper">
                                {segment.label} - {formatPercentValue(segment.percent)}%
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
