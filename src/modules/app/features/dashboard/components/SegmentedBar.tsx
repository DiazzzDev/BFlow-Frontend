import { formatPercentValue } from "../utils/formatPercent";

interface Segment {
    label: string;
    percent: number;
    colorClass?: string;
}

const SEGMENT_COLORS = ["bg-info", "bg-success", "bg-primary"] as const;

const getSegmentColor = (segment: Segment, index: number) =>
    segment.colorClass ?? SEGMENT_COLORS[index % SEGMENT_COLORS.length];

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
    const visibleSegments = segments
        .map((segment, index) => ({ segment, index }))
        .filter(({ segment }) => segment.percent > 0);

    return (
        <div className="mt-5">
            <div className="flex h-2 w-full items-stretch gap-1.5">
                {visibleSegments.map(({ segment, index }) => (
                    <div
                        key={`${segment.label}-${index}`}
                        className={`min-w-0 rounded-full ${getSegmentColor(segment, index)}`}
                        style={{ flexGrow: segment.percent, flexShrink: 0, flexBasis: 0 }}
                    />
                ))}
            </div>

            {showSegmentLabels && (
                <div className="mt-2 flex w-full gap-1.5">
                    {visibleSegments.map(({ segment, index }) => (
                        <span
                            key={`${segment.label}-label-${index}`}
                            className="min-w-0 text-[11px] leading-none text-helper"
                            style={{ flexGrow: segment.percent, flexShrink: 0, flexBasis: 0 }}
                        >
                            {formatPercentValue(segment.percent)}%
                        </span>
                    ))}
                </div>
            )}

            {showLegend && (
                <ul className="mt-4 flex flex-col gap-2">
                    {segments.map((segment, index) => (
                        <li
                            key={`${segment.label}-legend-${index}`}
                            className="flex items-center gap-2"
                        >
                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${getSegmentColor(segment, index)}`}
                            />
                            <span className="text-xs text-helper">
                                {segment.label} - {formatPercentValue(segment.percent)}%
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
