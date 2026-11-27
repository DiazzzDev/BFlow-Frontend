import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Recurring } from "@/modules/app/components/scheduleTransaction/interfaces/Recurring";
import type { CategoryType } from "@/modules/app/interfaces/Category";
import type { Periodicity } from "@/modules/app/interfaces/Periodicity";
import { PERIODICITY_FORM_OPTIONS } from "@/modules/app/interfaces/Periodicity";
import { Select } from "@/components/controls/Select";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";

interface WalletRecurringPanelProps {
    recurring: Recurring[];
    isLoading: boolean;
    currency: string;
}

const toDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const isSameMonth = (date: Date, month: Date) =>
    date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();

const occurrencesForMonth = (recurring: Recurring, month: Date) => {
    const start = new Date(`${recurring.startDate}T12:00:00`);
    const end = recurring.endDate ? new Date(`${recurring.endDate}T12:00:00`) : null;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const cursor = new Date(start);
    const interval = Math.max(1, recurring.intervalValue);
    const dates: Date[] = [];

    while (cursor <= lastDay && dates.length < 40) {
        if (cursor >= firstDay && (!end || cursor <= end)) {
            dates.push(new Date(cursor));
        }

        switch (recurring.frequency) {
            case "DAILY":
                cursor.setDate(cursor.getDate() + interval);
                break;
            case "WEEKLY":
                cursor.setDate(cursor.getDate() + interval * 7);
                break;
            case "MONTHLY":
                cursor.setMonth(cursor.getMonth() + interval);
                break;
            case "YEARLY":
                cursor.setFullYear(cursor.getFullYear() + interval);
                break;
        }
    }

    return dates;
};

export const WalletRecurringPanel = ({ recurring, isLoading, currency }: WalletRecurringPanelProps) => {
    const { t, i18n } = useTranslation();
    const [type, setType] = useState<"ALL" | CategoryType>("ALL");
    const [frequency, setFrequency] = useState<"ALL" | Periodicity>("ALL");
    const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());
    const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    const filteredRecurring = useMemo(
        () => recurring.filter((item) =>
            (type === "ALL" || item.type === type) && (frequency === "ALL" || item.frequency === frequency),
        ),
        [frequency, recurring, type],
    );
    const visibleRecurring = useMemo(
        () => filteredRecurring.filter((item) => visibleIds.size === 0 || visibleIds.has(item.id)),
        [filteredRecurring, visibleIds],
    );
    const calendarItems = useMemo(() => {
        const entries = new Map<string, Recurring[]>();
        visibleRecurring.forEach((item) => {
            occurrencesForMonth(item, month).forEach((date) => {
                const dateKey = toDateKey(date);
                entries.set(dateKey, [...(entries.get(dateKey) ?? []), item]);
            });
        });
        return entries;
    }, [month, visibleRecurring]);
    const calendarDays = useMemo(() => {
        const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
        const gridStart = new Date(firstDay);
        gridStart.setDate(firstDay.getDate() - firstDay.getDay());
        return Array.from({ length: 42 }, (_, index) => {
            const day = new Date(gridStart);
            day.setDate(gridStart.getDate() + index);
            return day;
        });
    }, [month]);

    const toggleVisibility = (id: string) => {
        setVisibleIds((current) => {
            const next = new Set(current.size === 0 ? filteredRecurring.map((item) => item.id) : current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (isLoading) return <div className="mx-7 h-96 animate-pulse bg-light-5" />;

    return (
        <div className="grid min-h-[32rem] flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
            <aside className="min-h-0 space-y-5 border-r border-light-10 px-7 py-6 lg:overflow-y-auto">
                <div className="flex items-center gap-2 text-sm font-semibold text-light">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t("walletView.recurringFilters")}
                </div>
                <div className="space-y-3">
                    <Select id="wallet-recurring-type" value={type} onChange={(event) => setType(event.target.value as "ALL" | CategoryType)} aria-label={t("walletView.recurringType")}>
                        <option value="ALL">{t("walletView.recurringAllTypes")}</option>
                        <option value="EXPENSE">{t("walletView.expense")}</option>
                        <option value="INCOME">{t("walletView.income")}</option>
                    </Select>
                    <Select id="wallet-recurring-frequency" value={frequency} onChange={(event) => setFrequency(event.target.value as "ALL" | Periodicity)} aria-label={t("walletView.recurringFrequency")}>
                        <option value="ALL">{t("walletView.recurringAllFrequencies")}</option>
                        {PERIODICITY_FORM_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </Select>
                </div>
                <div className="border-t border-light-10 pt-4">
                    <h2 className="mb-3 text-sm font-semibold text-light">{t("walletView.recurringList")}</h2>
                    {filteredRecurring.length === 0 ? (
                        <CustomEmptyState title={t("walletView.noRecurring")} description={t("walletView.noRecurringHint")} Icon={CalendarDays} className="m-0! p-4!" />
                    ) : (
                        <ul className="space-y-1">
                            {filteredRecurring.map((item) => {
                                const checked = visibleIds.size === 0 || visibleIds.has(item.id);
                                return (
                                    <li key={item.id} className="flex items-center gap-2 py-2">
                                        <input type="checkbox" checked={checked} onChange={() => toggleVisibility(item.id)} aria-label={item.title} className="size-4 cursor-pointer accent-primary" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-light">{item.title}</p>
                                            <p className="text-xs text-helper">{item.frequency.toLowerCase()} · {item.nextExecutionDate}</p>
                                        </div>
                                        <span className={`text-xs font-semibold ${getTransactionAmountClassName(item.type, item.amount)}`}>{formatCurrency(item.amount, currency)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </aside>

            <section className="flex min-h-0 flex-col overflow-hidden">
                <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-light-10 px-1">
                    <button type="button" aria-label={t("walletView.previousMonth")} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="cursor-pointer p-2 text-helper transition-colors hover:text-light">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-base font-semibold capitalize text-light">{new Intl.DateTimeFormat(i18n.language === "es" ? "es-SV" : "en-US", { month: "long", year: "numeric" }).format(month)}</h2>
                    <button type="button" aria-label={t("walletView.nextMonth")} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="cursor-pointer p-2 text-helper transition-colors hover:text-light">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </header>
                <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))]">
                    {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
                        <div key={day} className="border-b border-r border-light-10 py-2 text-center text-sm font-medium text-helper last:border-r-0">{day}</div>
                    ))}
                    {calendarDays.map((day) => {
                        const entries = calendarItems.get(toDateKey(day)) ?? [];
                        return (
                            <div key={toDateKey(day)} className={`min-h-0 overflow-hidden border-b border-r border-light-10 p-1.5 sm:p-2 ${isSameMonth(day, month) ? "" : "opacity-35"}`}>
                                <span className="text-sm text-helper">{day.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-hidden">
                                    {entries.slice(0, 2).map((item) => (
                                        <div key={item.id} className={`truncate border-l-2 px-1 text-xs font-medium ${item.type === "INCOME" ? "border-info text-info" : "border-danger text-danger"}`}>{item.title}</div>
                                    ))}
                                    {entries.length > 2 ? <span className="text-xs text-helper">+{entries.length - 2}</span> : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
