import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { DEFAULT_PAGE_SIZE } from "@/hooks/usePaginationParams";

interface PaginationSelectProps {
    totalItems?: number;
    numberOfElements?: number;
}

const baseOptions = [5, 10, 15, 20, 25];

export const PaginationSelect = ({
    totalItems = 0,
    numberOfElements,
}: PaginationSelectProps) => {
    const { t } = useTranslation();
    const { params, updateSearchParams } = useUpdateSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const limit = params.get("limit") || String(DEFAULT_PAGE_SIZE);

    const availableOptions = baseOptions.filter(
        (option) => option <= totalItems || option === DEFAULT_PAGE_SIZE,
    );

    const showing =
        numberOfElements ?? Math.min(Number(limit) || DEFAULT_PAGE_SIZE, totalItems);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (!selectRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, []);

    const handleOptionSelect = (option: number) => {
        updateSearchParams(
            {
                limit: option === DEFAULT_PAGE_SIZE ? null : String(option),
                page: null,
            },
            { replace: false },
        );
        setIsOpen(false);
    };

    return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-helper">
            <span className="min-w-0">
                {t("common.showing", { showing, total: totalItems })}
            </span>

            <div ref={selectRef} className="relative w-auto shrink-0">
                <button
                    id="paginationLimit"
                    type="button"
                    aria-label={t("common.resultsPerPage")}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    onClick={() => setIsOpen((current) => !current)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setIsOpen(false);
                        }
                    }}
                    className="flex min-w-[4.5rem] cursor-pointer items-center justify-between gap-2 rounded-lg border border-light-10 bg-surface px-3 py-1.5 text-sm font-medium text-light shadow-sm transition-all hover:border-light-25 hover:bg-light-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 active:scale-[0.97]"
                >
                    {limit}
                    <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 text-helper transition-transform duration-200 ${
                            isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>

                {isOpen && (
                    <div
                        role="listbox"
                        aria-labelledby="paginationLimit"
                        className="absolute bottom-full z-30 mb-2 min-w-full overflow-hidden rounded-lg border border-light-10 bg-surface p-1 shadow-xl shadow-black/30"
                    >
                        {availableOptions.map((option) => {
                            const isSelected = String(option) === limit;

                            return (
                                <button
                                    key={option}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-all active:scale-[0.98] ${
                                        isSelected
                                            ? "bg-primary text-white"
                                            : "text-helper hover:bg-light-10 hover:text-light"
                                    }`}
                                >
                                    {option}
                                    {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
