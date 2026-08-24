import { motion } from "framer-motion";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

type option = {
    label: string;
    value: string;
};

type TabFilterResponsive = "stretch" | "scroll";

interface TabFilterProps {
    options: option[];
    selected: string;
    keyFilter: string;
    /** stretch = full width on mobile; scroll = horizontal scroll + edge fades */
    responsive?: TabFilterResponsive;
    /** @deprecated Use responsive="stretch" */
    fullWidthMobile?: boolean;
    layoutId?: string;
}

export const TabFilter = ({
    options,
    selected,
    keyFilter,
    responsive,
    fullWidthMobile = false,
    layoutId = "activeTabIndicator",
}: TabFilterProps) => {
    const { params, updateSearchParams } = useUpdateSearchParams();

    const urlValue = keyFilter ? params.get(keyFilter) : null;
    const selectedOption = urlValue ?? selected ?? options[0]?.value;
    const mode: TabFilterResponsive | undefined =
        responsive ?? (fullWidthMobile ? "stretch" : undefined);

    const handelSearch = (value: string) => {
        updateSearchParams(
            { [keyFilter]: value || null },
            { resetPage: true, replace: false },
        );
    };

    const tabs = options.map((option) => {
        const isActive = selectedOption === option.value;

        return (
            <button
                key={option.value}
                type="button"
                className={`relative z-10 whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors duration-300 sm:px-4 sm:text-sm ${
                    mode === "stretch" ? "flex-1 sm:flex-none" : ""
                } ${
                    isActive
                        ? "text-dark"
                        : "text-dark opacity-text-custom hover:opacity-100"
                }`}
                onClick={() => handelSearch(option.value)}
            >
                {option.label}
                {isActive && (
                    <motion.div
                        layoutId={layoutId}
                        className="absolute inset-0 -z-10 rounded-full border border-surface bg-linear-to-b from-surface to-surface-25 backdrop-blur-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                )}
            </button>
        );
    });

    if (mode === "scroll") {
        return (
            <div className="relative min-w-0 max-w-full">
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="relative flex w-max items-center gap-1 rounded-full border border-light-25/50 p-0.5">
                        {tabs}
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-7 rounded-l-full bg-linear-to-r from-surface-hard to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-7 rounded-r-full bg-linear-to-l from-surface-hard to-transparent" />
            </div>
        );
    }

    return (
        <div
            className={`relative flex items-center gap-1 rounded-full border border-light-25/50 p-0.5 ${
                mode === "stretch" ? "w-full sm:w-max" : "w-max"
            }`}
        >
            {tabs}
        </div>
    );
};
