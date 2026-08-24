interface SegmentedTab<T extends string> {
    id: T;
    label: string;
}

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
    const columnsClass = className ?? COLUMN_CLASSES[tabs.length] ?? "grid-cols-3";

    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className={`grid gap-1 rounded-xl border border-light-10 bg-surface-hard/60 p-1 ${columnsClass}`}
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
                        className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                                ? "border border-light-10 bg-surface text-light shadow-sm"
                                : "border border-transparent text-helper hover:bg-light-5 hover:text-light"
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
