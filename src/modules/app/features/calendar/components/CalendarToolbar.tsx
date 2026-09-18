import { ChevronLeft, ChevronRight } from "lucide-react";

import { CALENDAR_LAYOUT_TABS, CALENDAR_VIEW_FILTER_TABS } from "../utils/filters";
import type { CalendarLayout, CalendarViewFilter } from "../interfaces/Calendar";

import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { TabFilter } from "@/components/controls/TabFilter";
import { Select } from "@/components/controls/Select";
import type { Category } from "@/modules/app/interfaces/Category";
import type { Wallet } from "@/modules/app/interfaces/Wallet";

interface CalendarToolbarProps {
    monthLabel: string;
    layout: CalendarLayout;
    onLayoutChange: (layout: CalendarLayout) => void;
    onPrevious: () => void;
    onNext: () => void;
    view: CalendarViewFilter;
    onWalletChange: (value: string | null) => void;
    onCategoryChange: (value: string | null) => void;
    walletId: string | null;
    categoryId: string | null;
    wallets: Wallet[];
    categories: Category[];
}

/** Everything that controls what the calendar shows lives in one elevated
 * surface: date navigation, the Mes/Lista toggle and the type/wallet/
 * category filters. They all act on the same grid, so they read as one
 * connected toolbar instead of a page header plus a separate filter rail. */
export const CalendarToolbar = ({
    monthLabel,
    layout,
    onLayoutChange,
    onPrevious,
    onNext,
    view,
    onWalletChange,
    onCategoryChange,
    walletId,
    categoryId,
    wallets,
    categories,
}: CalendarToolbarProps) => {
    return (
        <div className="rounded-2xl border border-light-10 bg-surface p-4 shadow-custom sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onPrevious}
                        aria-label="Mes anterior"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-light transition-colors hover:bg-light-5"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <h2 className="min-w-36 text-center text-xl font-semibold capitalize tracking-tight text-light sm:min-w-44">
                        {monthLabel}
                    </h2>

                    <button
                        type="button"
                        onClick={onNext}
                        aria-label="Mes siguiente"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-light transition-colors hover:bg-light-5"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <SegmentedTabs
                    tabs={CALENDAR_LAYOUT_TABS}
                    selected={layout}
                    onChange={onLayoutChange}
                    ariaLabel="Vista de calendario"
                    className="grid-cols-2"
                />
            </div>

            <div className="my-4 h-px bg-light-10" />

            <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
                <TabFilter
                    options={CALENDAR_VIEW_FILTER_TABS}
                    selected={view}
                    keyFilter="view"
                    layoutId="calendarViewTab"
                    responsive="scroll"
                />

                {(wallets.length > 0 || categories.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                        {wallets.length > 0 && (
                            <Select
                                id="calendarWalletFilter"
                                value={walletId ?? ""}
                                onChange={(event) => onWalletChange(event.target.value || null)}
                                className="min-w-36"
                            >
                                <option value="">Todas las billeteras</option>
                                {wallets.map((wallet) => (
                                    <option key={wallet.id} value={wallet.id}>
                                        {wallet.name}
                                    </option>
                                ))}
                            </Select>
                        )}

                        {categories.length > 0 && (
                            <Select
                                id="calendarCategoryFilter"
                                value={categoryId ?? ""}
                                onChange={(event) => onCategoryChange(event.target.value || null)}
                                className="min-w-36"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
