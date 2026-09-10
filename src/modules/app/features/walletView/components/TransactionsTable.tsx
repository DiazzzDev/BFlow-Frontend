import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
    ArrowLeftRight,
    Copy,
    MoreVertical,
    Pencil,
    Receipt,
    Trash2,
    User,
} from "lucide-react";

import { WalletItem } from "../../wallets/components/WalletItem";
import {
    canEditOrDelete,
    displayAmount,
    getContributorDisplayName,
    hasCategory,
} from "../utils/transactionDisplay";
import { WalletItemSkeleton } from "../../wallets/components/WalletItemSkeleton";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { getInitials } from "@/utils/getInitials";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";

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

const ContributorAvatar = ({
    transaction,
    sizeClassName = "h-8 w-8",
    textClassName = "text-[10px]",
}: {
    transaction: Transaction;
    sizeClassName?: string;
    textClassName?: string;
}) => {
    const displayName = getContributorDisplayName(transaction);
    const pictureUrl = transaction.contributorPictureUrl?.trim() || null;

    if (pictureUrl) {
        return (
            <img
                src={pictureUrl}
                alt={displayName}
                className={`${sizeClassName} shrink-0 rounded-full object-cover`}
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <div
            className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-light ${textClassName}`}
        >
            {displayName !== "—" ? (
                getInitials(displayName)
            ) : (
                <User className="h-3.5 w-3.5 text-helper" />
            )}
        </div>
    );
};

const TransactionCategoryCell = ({ transaction }: { transaction: Transaction }) => {
    if (hasCategory(transaction)) {
        const color = transaction.categoryColor || "#64748B";

        return (
            <span
                className="inline-block max-w-full truncate rounded-full border border-light-10 px-2.5 py-0.5 text-xs"
                style={{
                    backgroundColor: `${color}22`,
                    color,
                }}
                title={transaction.categoryName || undefined}
            >
                {transaction.categoryName || "—"}
            </span>
        );
    }

    return (
        <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-light-10 bg-light-5 text-helper">
                <ArrowLeftRight className="h-3.5 w-3.5" />
            </span>
            <span className="truncate text-sm text-helper">
                {transaction.counterpartWalletName || "Transferencia"}
            </span>
        </div>
    );
};

const TransactionContributorCell = ({
    transaction,
}: {
    transaction: Transaction;
}) => {
    const displayName = getContributorDisplayName(transaction);

    return (
        <div className="flex min-w-0 items-center gap-2.5">
            <ContributorAvatar transaction={transaction} />
            <p className="truncate text-sm text-light" title={displayName}>
                {displayName}
            </p>
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
    const desktopGridClass = showCategory
        ? "@5xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_auto]"
        : "@5xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.75fr)_auto]";

    if (isLoading) {
        return (
            <section className="flex flex-col">
                {Array.from({ length: 6 }).map((_, index) => (
                    <WalletItemSkeleton key={index} className="px-4 sm:px-7">
                        <div
                            className={`flex items-start justify-between gap-3 @5xl:grid @5xl:items-center @5xl:gap-3 ${desktopGridClass}`}
                        >
                            <div className="min-w-0 flex-1 space-y-2">
                                <SkeletonText className="h-4 w-28 sm:w-36" />
                                <div className="flex items-center gap-2 @5xl:hidden">
                                    <SkeletonText className="h-6 w-6 rounded-full" />
                                    <SkeletonText className="h-3 w-28" />
                                </div>
                            </div>
                            <div className="hidden items-center gap-2 @5xl:flex">
                                <SkeletonText className="h-8 w-8 rounded-full" />
                                <SkeletonText className="h-4 w-24" />
                            </div>
                            {showCategory ? (
                                <SkeletonText className="hidden h-4 w-20 @5xl:block" />
                            ) : null}
                            <SkeletonText className="hidden h-4 w-20 @5xl:block" />
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
                const showManageActions = canEditOrDelete(tx.type);
                const contributorName = getContributorDisplayName(tx);
                const categoryLabel = hasCategory(tx)
                    ? tx.categoryName || "—"
                    : tx.counterpartWalletName || "Transferencia";
                const categoryColor = hasCategory(tx)
                    ? tx.categoryColor || "#64748B"
                    : undefined;

                return (
                    <WalletItem key={tx.id} className="px-4 sm:px-7">
                        <div
                            className={`flex items-start justify-between gap-3 @5xl:grid @5xl:items-center @5xl:gap-3 ${desktopGridClass}`}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-light">
                                    {tx.title}
                                </p>

                                <div className="mt-2 flex flex-col gap-1.5 @5xl:hidden">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <ContributorAvatar
                                            transaction={tx}
                                            sizeClassName="h-6 w-6"
                                            textClassName="text-[9px]"
                                        />
                                        <span className="truncate text-xs text-helper">
                                            {contributorName}
                                        </span>
                                        <span className="shrink-0 text-xs text-label">
                                            · {formatMonthYear(tx.date)}
                                        </span>
                                    </div>

                                    {showCategory ? (
                                        hasCategory(tx) ? (
                                            <span
                                                className="w-fit max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-medium"
                                                style={{
                                                    backgroundColor: `${categoryColor}22`,
                                                    color: categoryColor,
                                                }}
                                            >
                                                {categoryLabel}
                                            </span>
                                        ) : (
                                            <span className="inline-flex w-fit items-center gap-1 text-xs text-helper">
                                                <ArrowLeftRight className="h-3 w-3" />
                                                {categoryLabel}
                                            </span>
                                        )
                                    ) : null}
                                </div>
                            </div>

                            <div className="hidden min-w-0 @5xl:block">
                                <TransactionContributorCell transaction={tx} />
                            </div>

                            {showCategory ? (
                                <div className="hidden min-w-0 @5xl:block">
                                    <TransactionCategoryCell transaction={tx} />
                                </div>
                            ) : null}

                            <p className="hidden truncate text-sm text-helper @5xl:block">
                                {formatMonthYear(tx.date)}
                            </p>

                            <div className="flex shrink-0 items-start gap-1 @5xl:contents">
                                <p
                                    className={`pt-0.5 text-right text-sm font-semibold tabular-nums @5xl:pt-0 ${getTransactionAmountClassName(
                                        tx.type,
                                        amount,
                                    )}`}
                                >
                                    {formatCurrency(amount, currency)}
                                </p>

                                <Menu as="div" className="relative @5xl:justify-self-end">
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
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${focus ? "bg-light-5" : ""
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
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${focus ? "bg-light-5" : ""
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
                                                        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger ${focus ? "bg-danger-sweet" : ""
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
