interface SegmentedTab<T extends string> {
    id: T;
    label: string;
}

// Composite tablist — custom API on purpose; not a single native element to extend
interface SegmentedTabsProps<T extends string> {
    tabs: Array<SegmentedTab<T>>;
    selected: T;
    onChange: (id: T) => void;
    ariaLabel?: string;
    className?: string;
}

const COLUMN_CLASSES: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
};

export const SegmentedTabs = <T extends string>({
    tabs,
    selected,
    onChange,
    ariaLabel = "Opciones",
    className,
}: SegmentedTabsProps<T>) => {
    const columnsClass = className ?? COLUMN_CLASSES[tabs.length];
    const indicatorId = useId();

    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={`relative grid gap-1 rounded-xl border border-light-10 bg-surface-hard/60 p-1 ${columnsClass}`}
        >
            {tabs.map((tab) => {
                const isActive = selected === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.id)}
                        className={`relative z-10 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? "text-light"
                                : "text-helper hover:text-light"
                            }`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={`segmented-tabs-indicator-${indicatorId}`}
                                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                className="absolute inset-0 -z-10 rounded-lg border border-light-10 bg-surface shadow-sm"
                            />
                        )}
                        <span className="relative">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
import { motion } from "framer-motion";
import { useId } from "react";

