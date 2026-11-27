import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowDownLeft, ArrowUpRight, CalendarClock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { UpcomingTransaction } from "../interfaces/WalletDetails";
import type { Recurring } from "@/modules/app/components/scheduleTransaction/interfaces/Recurring";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";

export interface WalletViewSidebarProps {
    lastActivity: string;
    highestExpense: string;
    transactionsCount: number;
    initialValue: number;
    currency: string;
    upcoming: UpcomingTransaction[];
    onSchedule?: () => void;
    recurring?: Recurring[];
    onEditRecurring?: (recurring: Recurring) => void;
    onDeleteRecurring?: (recurring: Recurring) => void;
    isLoading?: boolean;
    className?: string;
}

const infoSkeletonRows = [
    { labelClassName: "h-3.5 w-20", valueClassName: "h-3.5 w-24" },
    { labelClassName: "h-3.5 w-28", valueClassName: "h-3.5 w-16" },
    { labelClassName: "h-3.5 w-24", valueClassName: "h-3.5 w-10" },
    { labelClassName: "h-3.5 w-20", valueClassName: "h-3.5 w-20" },
];

const upcomingSkeletonRows = [
    { titleClassName: "h-3.5 w-32", dateClassName: "h-3.5 w-14" },
    { titleClassName: "h-3.5 w-24", dateClassName: "h-3.5 w-20" },
    { titleClassName: "h-3.5 w-36", dateClassName: "h-3.5 w-16" },
];

export const WalletViewSidebar = ({
    lastActivity,
    highestExpense,
    transactionsCount,
    initialValue,
    currency,
    upcoming,
    onSchedule,
    recurring = [],
    onEditRecurring,
    onDeleteRecurring,
    isLoading = false,
    className = "",
}: WalletViewSidebarProps) => {
    const { t } = useTranslation();
    return (
        <aside
            className={`flex flex-col gap-8 px-6 py-5 ${className}`}
        >
            <section>
                <h2 className="mb-5 text-xl font-semibold text-light">{t("walletView.information")}</h2>
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {infoSkeletonRows.map((row) => (
                            <div
                                key={`${row.labelClassName}-${row.valueClassName}`}
                                className="flex items-center justify-between gap-3"
                            >
                                <SkeletonText className={row.labelClassName} />
                                <SkeletonText className={row.valueClassName} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <dl className="flex flex-col gap-4">
                        <InfoRow label={t("walletView.lastActivity")} value={formatterDynamicDate(lastActivity) || "—"} />
                        <InfoRow label={t("walletView.highestExpense")} value={highestExpense} />
                        <InfoRow label={t("walletView.transactions")} value={String(transactionsCount)} />
                        <InfoRow
                            label={t("walletView.initialValue")}
                            value={formatCurrency(initialValue, currency)}
                        />
                    </dl>
                )}
            </section>

            <section className="flex flex-1 flex-col">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-light">{t("walletView.upcoming")}</h2>
                </div>

                {isLoading ? (
                    <ul className="mb-6 flex flex-col gap-4">
                        {upcomingSkeletonRows.map((row) => (
                            <li
                                key={row.titleClassName}
                                className="flex items-center justify-between gap-3"
                            >
                                <SkeletonText className={row.titleClassName} />
                                <SkeletonText className={row.dateClassName} />
                            </li>
                        ))}
                    </ul>
                ) : upcoming.length === 0 ? (
                    <CustomEmptyState
                        title={t("walletView.noScheduled")}
                        description={t("walletView.noUpcoming")}
                        Icon={CalendarClock}
                        className="m-0! mb-6! p-4!"
                    />
                ) : (
                    <ul className="mb-6 flex flex-col">
                        {upcoming.map((item) => (
                            <UpcomingRow
                                key={item.id ?? `${item.title}-${item.nextExecutionDate}`}
                                item={item}
                                currency={currency}
                                recurring={recurring.find((recurrence) =>
                                    item.id
                                        ? recurrence.id === item.id
                                        : recurrence.title === item.title &&
                                            recurrence.nextExecutionDate === item.nextExecutionDate,
                                )}
                                onEdit={onEditRecurring}
                                onDelete={onDeleteRecurring}
                            />
                        ))}
                    </ul>
                )}

                {isLoading ? (
                    <SkeletonText className="mt-auto h-11 w-full" />
                ) : (
                    <button
                        type="button"
                        onClick={() => onSchedule?.()}
                        className="mt-auto h-11 w-full cursor-pointer rounded-lg border border-light-10 bg-transparent text-sm font-medium text-light transition-colors hover:bg-secondary"
                    >
                        {t("walletView.schedule")}
                    </button>
                )}
            </section>
        </aside>
    );
};

const UpcomingRow = ({
    item,
    currency,
    recurring,
    onEdit,
    onDelete,
}: {
    item: UpcomingTransaction;
    currency: string;
    recurring?: Recurring;
    onEdit?: (recurring: Recurring) => void;
    onDelete?: (recurring: Recurring) => void;
}) => {
    const isIncome = item.type === "INCOME";
    const { t } = useTranslation();

    return (
        <li className={`flex items-center gap-3 border-b border-light-10 py-3 last:border-b-0 ${item.active === false ? "opacity-60" : ""}`}>
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isIncome ? "bg-info-25 text-info" : "bg-danger-sweet text-danger"
                }`}
            >
                {isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-light">{item.title}</p>
                <p className="mt-0.5 truncate text-xs text-helper">
                    {formatterDynamicDate(item.nextExecutionDate) || "—"}
                </p>
            </div>

            <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${getTransactionAmountClassName(
                    item.type,
                    item.amount,
                )}`}
            >
                {isIncome ? "+" : "-"}
                {formatCurrency(Math.abs(item.amount), currency)}
            </p>
            {recurring ? (
                <Menu as="div" className="relative">
                    <MenuButton
                        type="button"
                        aria-label={t("transactions.actions")}
                        className="cursor-pointer rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </MenuButton>
                    <MenuItems
                        anchor="bottom end"
                        className="z-50 w-40 rounded-xl border border-light-10 bg-surface p-1 shadow-custom focus:outline-none"
                    >
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    type="button"
                                    onClick={() => onEdit?.(recurring)}
                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-light ${
                                        focus ? "bg-light-5" : ""
                                    }`}
                                >
                                    <Pencil className="h-4 w-4" />
                                    {t("transactions.update")}
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    type="button"
                                    onClick={() => onDelete?.(recurring)}
                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger ${
                                        focus ? "bg-danger/10" : ""
                                    }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {t("transactions.delete")}
                                </button>
                            )}
                        </MenuItem>
                    </MenuItems>
                </Menu>
            ) : null}
        </li>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-helper">{label}</dt>
        <dd className="text-right font-medium text-light">{value}</dd>
    </div>
);
