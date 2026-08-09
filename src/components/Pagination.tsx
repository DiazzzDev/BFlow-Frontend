import { ChevronLeft, ChevronRight } from "lucide-react";

import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

interface PaginationProps {
    totalPages?: number;
}

type PageItem = number | "ellipsis";

const getPageItems = (current: number, total: number): PageItem[] => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 3) {
        return [1, 2, 3, 4, "ellipsis", total];
    }

    if (current >= total - 2) {
        return [1, "ellipsis", total - 3, total - 2, total - 1, total];
    }

    return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
};

export const Pagination = ({ totalPages = 1 }: PaginationProps) => {
    const { params, updateSearchParams } = useUpdateSearchParams();

    const queryPage = params.get("page") ?? "1";
    const parsedPage = Number(queryPage);
    const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const safeTotalPages = Math.max(totalPages, 1);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > safeTotalPages) {
            return;
        }

        updateSearchParams(
            { page: newPage === 1 ? null : String(newPage) },
            { replace: false },
        );
    };

    if (safeTotalPages <= 1) {
        return null;
    }

    const pageItems = getPageItems(page, safeTotalPages);

    return (
        <div className="flex w-full items-center justify-center gap-1 sm:w-auto sm:justify-end sm:gap-2">
            <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Página anterior"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {/* Mobile: only current page indicator */}
            <span className="px-2 text-sm font-medium text-helper sm:hidden">
                {page} / {safeTotalPages}
            </span>

            {/* Desktop: numbered pages with ellipsis */}
            <div className="hidden items-center gap-1 sm:flex">
                {pageItems.map((item, index) => {
                    if (item === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-9 w-9 items-center justify-center text-sm text-helper"
                                aria-hidden
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = item === page;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => handlePageChange(item)}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                isActive
                                    ? "bg-primary text-light"
                                    : "border border-light-10 bg-surface text-helper hover:bg-light-5 hover:text-light"
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= safeTotalPages}
                aria-label="Página siguiente"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
        </div>
    );
};
