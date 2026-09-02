import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Copy,
    Eye,
    Wallet,
} from "lucide-react";

import type { Transaction } from "../../walletView/interfaces/Transaction";
import { formatTransactionSource } from "../utils/formatHistoryTransaction";

import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface HistoryTransactionCardProps {
    transaction: Transaction;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
    actionsDisabled?: boolean;
}

const typeConfig: Record<
    Transaction["type"],
    { label: string; icon: typeof ArrowUpRight; className: string }
> = {
    INCOME: {
        label: "Ingreso",
        icon: ArrowDownLeft,
        className: "text-info bg-info/10 border-info/20",
    },
    EXPENSE: {
        label: "Gasto",
        icon: ArrowUpRight,
        className: "text-danger bg-danger/10 border-danger/20",
    },
    TRANSFER: {
        label: "Transferencia",
        icon: ArrowLeftRight,
        className: "text-primary bg-primary/10 border-primary/20",
    },
};

const amountClassName = (type: Transaction["type"], amount: number) => {
    if (type === "EXPENSE" || amount < 0) {
        return "text-danger";
    }
    if (type === "INCOME" || amount > 0) {
        return "text-info";
    }
    return "text-light";
};

const formatHistoryAmount = (
    type: Transaction["type"],
    amount: number,
    currency = "USD",
) => {
    const formatted = formatCurrency(Math.abs(amount), currency);

    if (type === "INCOME") {
        return `+${formatted}`;
    }

    if (type === "EXPENSE") {
        return `-${formatted}`;
    }

    return formatted;
};

export const HistoryTransactionCard = ({
    transaction,
    onViewDetails,
    onDuplicate,
    actionsDisabled = false,
}: HistoryTransactionCardProps) => {
    const accentColor = transaction.categoryColor || "#64748B";
    const sourceLabel = formatTransactionSource(transaction.source);
    const typeStyle = typeConfig[transaction.type];
    const TypeIcon = typeStyle.icon;

    return (
        <article className="relative overflow-hidden rounded-xl border border-light-10 bg-surface transition-colors hover:border-light-25 hover:bg-surface-hard/80">
            <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: accentColor }}
            />

            <div className="flex items-center gap-3 p-4 pl-5">
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                        backgroundColor: `${accentColor}14`,
                        borderColor: `${accentColor}33`,
                        color: accentColor,
                    }}
                >
                    <CategoryIcon icon={transaction.categoryIcon} className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-semibold text-light">
                                    {transaction.title}
                                </h3>

                                {transaction.walletName ? (
                                    <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-light-10 bg-light-5 px-2 py-0.5 text-[11px] font-medium text-light">
                                        <Wallet className="h-3 w-3 shrink-0 text-helper" />
                                        <span className="truncate">
                                            {transaction.walletName}
                                        </span>
                                    </span>
                                ) : null}
                            </div>

                            {transaction.description ? (
                                <p className="line-clamp-2 text-sm leading-relaxed text-helper">
                                    {transaction.description}
                                </p>
                            ) : null}
                        </div>

                        <p
                            className={`shrink-0 text-sm font-semibold tabular-nums ${amountClassName(
                                transaction.type,
                                transaction.amount,
                            )}`}
                        >
                            {formatHistoryAmount(transaction.type, transaction.amount)}
                        </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${typeStyle.className}`}
                            >
                                <TypeIcon className="h-3 w-3" />
                                {typeStyle.label}
                            </span>

                            {transaction.categoryName ? (
                                <span
                                    className="rounded-full border px-2 py-0.5 text-[11px] text-light"
                                    style={{
                                        backgroundColor: `${accentColor}14`,
                                        borderColor: `${accentColor}33`,
                                    }}
                                >
                                    {transaction.categoryName}
                                </span>
                            ) : null}

                            {sourceLabel ? (
                                <span className="rounded-full border border-light-10 px-2 py-0.5 text-[11px] text-helper">
                                    {sourceLabel}
                                </span>
                            ) : null}

                            {transaction.counterpartWalletName ? (
                                <span className="truncate text-xs text-helper">
                                    → {transaction.counterpartWalletName}
                                </span>
                            ) : null}

                            {transaction.status ? (
                                <span className="rounded-full border border-light-10 px-2 py-0.5 text-[11px] uppercase text-helper">
                                    {transaction.status}
                                </span>
                            ) : null}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                disabled={actionsDisabled}
                                onClick={() => onViewDetails(transaction)}
                                title="Ver"
                                aria-label="Ver detalles"
                                className="group/action relative rounded-lg border border-light-10 p-1.5 text-helper transition-colors hover:border-light-25 hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                <Eye className="h-4 w-4" />
                                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-hard px-2 py-1 text-[11px] font-medium text-light opacity-0 shadow-sm transition-opacity group-hover/action:opacity-100">
                                    Ver
                                </span>
                            </button>
                            <button
                                type="button"
                                disabled={actionsDisabled}
                                onClick={() => onDuplicate(transaction)}
                                title="Duplicar"
                                aria-label="Duplicar transacción"
                                className="group/action relative rounded-lg border border-light-10 p-1.5 text-helper transition-colors hover:border-light-25 hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                            >
                                <Copy className="h-4 w-4" />
                                <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-hard px-2 py-1 text-[11px] font-medium text-light opacity-0 shadow-sm transition-opacity group-hover/action:opacity-100">
                                    Duplicar
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
