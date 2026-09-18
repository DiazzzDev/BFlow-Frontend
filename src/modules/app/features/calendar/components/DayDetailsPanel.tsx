import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Repeat, Wallet as WalletIcon } from "lucide-react";

import { parseDateKey } from "../utils/calendarGrid";
import type { CalendarDaySummary } from "../interfaces/Calendar";

import { CustomModal } from "@/components/custom/CustomModal";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { Button } from "@/components/controls/Button";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";
import { formatTransactionSource } from "@/modules/app/features/history/utils/formatHistoryTransaction";
import { HISTORY_TRANSACTION_TYPE_CONFIG } from "@/modules/app/features/history/utils/transactionTypeConfig";
import { getBudgetDisplayName } from "@/modules/app/features/budgets/utils/budgetStatus";
import type { Transaction } from "@/modules/app/interfaces/Transaction";

interface DayDetailsPanelProps {
    dateKey: string | null;
    summary: CalendarDaySummary | null;
    onClose: () => void;
    onViewTransaction: (transaction: Transaction) => void;
    onSelectRecurring: (recurringId: string) => void;
    onSelectBudget: (budgetId: string) => void;
    onCreateTransaction: () => void;
    currency?: string;
}

export const DayDetailsPanel = ({
    dateKey,
    summary,
    onClose,
    onViewTransaction,
    onSelectRecurring,
    onSelectBudget,
    onCreateTransaction,
    currency = "USD",
}: DayDetailsPanelProps) => {
    const isOpen = Boolean(dateKey);
    const title = dateKey ? format(parseDateKey(dateKey), "EEEE d 'de' MMMM", { locale: es }) : "";

    return (
        <CustomModal isModalOpen={isOpen} setIsModalOpen={(open) => !open && onClose()} title={title}>
            <div className="flex flex-col gap-6">
                <Button text="Registrar movimiento" icon={<Plus className="h-4 w-4" />} onClick={onCreateTransaction} />

                <section className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-light">Movimientos</h3>
                    {summary && summary.transactions.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {summary.transactions.map((transaction) => {
                                const typeConfig = HISTORY_TRANSACTION_TYPE_CONFIG[transaction.type];
                                const Icon = typeConfig?.icon;

                                return (
                                    <button
                                        key={transaction.id}
                                        type="button"
                                        onClick={() => onViewTransaction(transaction)}
                                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-light-10 bg-surface-hard/40 px-3 py-2.5 text-left transition-colors hover:border-light-25"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                                                style={{
                                                    backgroundColor: `${transaction.categoryColor}14`,
                                                    borderColor: `${transaction.categoryColor}33`,
                                                    color: transaction.categoryColor,
                                                }}
                                            >
                                                <CategoryIcon icon={transaction.categoryIcon} className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-light">
                                                    {transaction.title}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-helper">
                                                    <WalletIcon className="h-3 w-3" />
                                                    {transaction.walletName}
                                                    {" · "}
                                                    {transaction.categoryName}
                                                    {transaction.status ? ` · ${transaction.status}` : ""}
                                                    {formatTransactionSource(transaction.source) === "Recurrente" && (
                                                        <span className="ml-1 flex items-center gap-0.5 text-primary">
                                                            <Repeat className="h-3 w-3" /> Recurrente
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {Icon && <Icon className={`h-4 w-4 ${typeConfig.className.split(" ")[0]}`} />}
                                            <span
                                                className={`text-sm font-semibold tabular-nums ${getTransactionAmountClassName(transaction.type, transaction.amount)}`}
                                            >
                                                {formatCurrency(Math.abs(transaction.amount), currency)}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-helper">No hay movimientos registrados este día.</p>
                    )}
                </section>

                {summary && summary.recurringOccurrences.length > 0 && (
                    <section className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-light">Recurrencias</h3>
                        <div className="flex flex-col gap-2">
                            {summary.recurringOccurrences.map((occurrence) => (
                                <button
                                    key={`${occurrence.recurring.id}-${occurrence.date}`}
                                    type="button"
                                    onClick={() => onSelectRecurring(occurrence.recurring.id)}
                                    className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary-15 px-3 py-2.5 text-left transition-colors hover:border-primary/60"
                                >
                                    <div className="flex items-center gap-2">
                                        <Repeat className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium text-light">
                                            {occurrence.recurring.title}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">
                                        {formatCurrency(Math.abs(occurrence.recurring.amount), currency)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {summary && summary.budgets.length > 0 && (
                    <section className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold text-light">Budgets activos</h3>
                        <div className="flex flex-col gap-2">
                            {summary.budgets.map((budget) => (
                                <button
                                    key={budget.id}
                                    type="button"
                                    onClick={() => onSelectBudget(budget.id)}
                                    className="flex cursor-pointer items-center justify-between rounded-lg border border-light-10 px-3 py-2.5 text-left transition-colors hover:border-light-25"
                                >
                                    <span className="text-sm font-medium text-light">
                                        {getBudgetDisplayName(budget)}
                                    </span>
                                    <span className="text-xs text-helper">
                                        {budget.startDate.slice(0, 10)} → {budget.periodEndDate}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {summary &&
                    summary.transactions.length === 0 &&
                    summary.recurringOccurrences.length === 0 &&
                    summary.budgets.length === 0 && (
                        <CustomEmptyState
                            title="Día sin actividad"
                            description="Registra un movimiento para empezar a llevarle seguimiento."
                        />
                    )}
            </div>
        </CustomModal>
    );
};
