import { motion } from "framer-motion";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

type option = {
    label: string,
    value: string
}

interface TabFilterProps {
    options: option[],
    selected: string,
    keyFilter: string,
    fullWidthMobile?: boolean
}

export const TabFilter = ({ options, selected, fullWidthMobile = false, keyFilter }: TabFilterProps) => {
    const { params, updateSearchParams } = useUpdateSearchParams();

    const urlValue = keyFilter ? params.get(keyFilter) : null;
    const selectedOption = urlValue ?? selected ?? options[0]?.value;

    const handelSearch = (value: string) => {
        updateSearchParams(
            { [keyFilter]: value || null },
            { resetPage: true, replace: false },
        );
    };

    return (
        <div className={`flex items-center gap-1 border border-light-25/50 rounded-full p-0.5 relative ${fullWidthMobile ? "w-full sm:w-max" : "w-max"}`}>
            {options.map((option) => {
                const isActive = selectedOption === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        className={`rounded-full font-medium relative z-10 transition-colors duration-300 px-3 py-2 text-xs sm:text-sm ${fullWidthMobile ? "flex-1 sm:flex-none sm:px-4" : "px-4 py-2"} ${isActive ? "text-dark" : "text-dark opacity-text-custom hover:opacity-100"}`}
                        onClick={() => handelSearch(option.value)}
                    >
                        {option.label}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute inset-0 bg-linear-to-b from-surface to-surface-25 border border-surface backdrop-blur-sm rounded-full -z-10"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
