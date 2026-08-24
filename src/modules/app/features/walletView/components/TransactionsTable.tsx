import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    ArrowLeftRight,
    Copy,
    MoreVertical,
    Pencil,
    Receipt,
    Trash2,
} from "lucide-react";

import type { Transaction } from "../interfaces/Transaction";
import { WalletItem } from "../../wallets/components/WalletItem";
import { WalletItemSkeleton } from "../../wallets/components/WalletItemSkeleton";

import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";

export const getTransactionColumnsClassName = (showCategory: boolean) =>
    showCategory
        ? "grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] gap-4 items-center"
        : "grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] gap-4 items-center";

/** @deprecated Prefer getTransactionColumnsClassName(showCategory) */
export const transactionColumnsClassName = getTransactionColumnsClassName(true);

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    query: string;
    currency?: string;
    showCategory?: boolean;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
    onDuplicate?: (transaction: Transaction) => void;
    actionsDisabled?: boolean;
}

const displayAmount = (tx: Transaction) => {
    const abs = Math.abs(tx.amount);

    if (tx.type === "EXPENSE") {
        return -abs;
    }
    if (tx.type === "INCOME") {
        return abs;
    }
    return tx.amount;
};

const canEditOrDelete = (type: Transaction["type"]) =>
    type === "INCOME" || type === "EXPENSE";

const hasCategory = (tx: Transaction) =>
    tx.type === "INCOME" || tx.type === "EXPENSE";

const TransactionCategoryCell = ({ transaction }: { transaction: Transaction }) => {
    if (hasCategory(transaction)) {
        const color = transaction.categoryColor || "#64748B";

        return (
            <div className="flex min-w-0 items-center gap-2.5">
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-light-10"
                    style={{
                        backgroundColor: `${color}22`,
                        color,
                    }}
                >
                    <CategoryIcon icon={transaction.categoryIcon} className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-sm text-helper">
                    {transaction.categoryName || "—"}
                </span>
            </div>
        );
    }

    return (
        <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-light-10 bg-light-5 text-helper">
                <ArrowLeftRight className="h-3.5 w-3.5" />
            </span>
            <span className="truncate text-sm text-helper">
                {transaction.counterpartWalletName || "Transfer"}
            </span>
        </div>
    );
};

export const TransactionsTable = ({
    transactions,
    isLoading,
    query,
    currency = "USD",
    showCategory = true,
    onEdit,
    onDelete,
    onDuplicate,
    actionsDisabled = false,
}: TransactionsTableProps) => {
    if (isLoading) {
        return (
            <section className="flex flex-col">
                {Array.from({ length: 6 }).map((_, index) => (
                    <WalletItemSkeleton key={index} className="px-4 sm:px-7">
                        <div
                            className={`flex items-start justify-between gap-3 @2xl:grid @2xl:items-center @2xl:gap-4 ${showCategory ? "@2xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto]" : "@2xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto]"}`}
                        >
                            <div className="min-w-0 flex-1 space-y-2">
                                <SkeletonText className="h-4 w-28 sm:w-36" />
                                <SkeletonText className="h-3 w-24" />
                                <SkeletonText className="h-3 w-32 @2xl:hidden" />
                            </div>
                            {showCategory ? (
                                <SkeletonText className="hidden h-4 w-20 @2xl:block" />
                            ) : null}
                            <SkeletonText className="hidden h-4 w-24 @2xl:block" />
                            <div className="flex shrink-0 items-center gap-2">
                                <SkeletonText className="h-4 w-16" />
                                <SkeletonText className="size-5" />
                            </div>
                        </div>
                    </WalletItemSkeleton>
                ))}
            </section>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="h-full p-4 sm:p-7">
                <CustomEmptyState
                    title={query.trim() ? "Sin resultados" : "Sin transacciones"}
                    description={
                        query.trim()
                            ? "Prueba con otro término de búsqueda"
                            : "Aún no hay movimientos en esta billetera."
                    }
                    Icon={Receipt}
                />
            </div>
        );
    }

    return (
        <section className="flex flex-col">
            {transactions.map((tx) => {
                const amount = displayAmount(tx);
                const isNegative = amount < 0;
                const showManageActions = canEditOrDelete(tx.type);
                const mobileMeta = showCategory
                    ? hasCategory(tx)
                        ? `${tx.categoryName || "—"} · ${formatMonthYear(tx.date)}`
                        : `${tx.counterpartWalletName || "Transfer"} · ${formatMonthYear(tx.date)}`
                    : formatMonthYear(tx.date);

                return (
                    <WalletItem key={tx.id} className="px-4 sm:px-7">
                        <div
                            className={`flex items-start justify-between gap-3 @2xl:grid @2xl:items-center @2xl:gap-4 ${showCategory ? "@2xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto]" : "@2xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto]"}`}
                        >
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                {showCategory ? (
                                    hasCategory(tx) ? (
                                        <span
                                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-10 @2xl:hidden"
                                            style={{
                                                backgroundColor: `${tx.categoryColor || "#64748B"}22`,
                                                color: tx.categoryColor || "#64748B",
                                            }}
                                        >
                                            <CategoryIcon
                                                icon={tx.categoryIcon}
                                                className="h-4 w-4"
                                            />
                                        </span>
                                    ) : (
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-10 bg-light-5 text-helper @2xl:hidden">
                                            <ArrowLeftRight className="h-4 w-4" />
                                        </span>
                                    )
                                ) : null}

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-light">
                                        {tx.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-helper">
                                        {tx.contributorName || tx.description || "—"}
                                    </p>
                                    <p className="mt-2 truncate text-xs text-label @2xl:hidden">
                                        {mobileMeta}
                                    </p>
                                </div>
                            </div>

                            {showCategory ? (
                                <div className="hidden min-w-0 @2xl:block">
                                    <TransactionCategoryCell transaction={tx} />
                                </div>
                            ) : null}

                            <p className="hidden truncate text-sm text-helper @2xl:block">
                                {formatMonthYear(tx.date)}
                            </p>

                            <div className="flex shrink-0 items-start gap-1 @2xl:contents">
                                <p
                                    className={`pt-0.5 text-right text-sm font-semibold tabular-nums @2xl:pt-0 ${
                                        isNegative ? "text-danger" : "text-info"
                                    }`}
                                >
                                    {formatCurrency(amount, currency)}
                                </p>

                                <Menu as="div" className="relative @2xl:justify-self-end">
                                    <MenuButton
                                        type="button"
                                        disabled={actionsDisabled}
                                        aria-label="Acciones de la transacción"
                                        className="cursor-pointer rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </MenuButton>

                                    <MenuItems
                                        anchor="bottom end"
                                        className="z-50 w-48 rounded-xl border border-light-10 bg-surface p-1 shadow-custom focus:outline-none"
                                    >
                                        {showManageActions && onEdit && (
                                            <MenuItem>
                                                {({ focus }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(tx)}
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${
                                                            focus ? "bg-light-5" : ""
                                                        }`}
                                                    >
                                                        <Pencil className="h-4 w-4 text-helper" />
                                                        Actualizar
                                                    </button>
                                                )}
                                            </MenuItem>
                                        )}

                                        {onDuplicate && (
                                            <MenuItem>
                                                {({ focus }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDuplicate(tx)}
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${
                                                            focus ? "bg-light-5" : ""
                                                        }`}
                                                    >
                                                        <Copy className="h-4 w-4 text-helper" />
                                                        Duplicar
                                                    </button>
                                                )}
                                            </MenuItem>
                                        )}

                                        {showManageActions && onDelete && (
                                            <MenuItem>
                                                {({ focus }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(tx)}
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger ${
                                                            focus ? "bg-danger-sweet" : ""
                                                        }`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Eliminar
                                                    </button>
                                                )}
                                            </MenuItem>
                                        )}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </WalletItem>
                );
            })}
        </section>
    );
};
