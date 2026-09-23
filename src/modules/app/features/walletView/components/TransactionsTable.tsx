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
import { useTranslation } from "react-i18next";

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
    /** Hide "registered by" when the wallet has a single member. */
    showRegisteredBy?: boolean;
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

const TransactionCategoryCell = ({
    transaction,
}: {
    transaction: Transaction;
}) => {
    const { t } = useTranslation();

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
                {transaction.counterpartWalletName || t("walletView.transfer")}
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

interface TransactionActionsMenuProps {
    transaction: Transaction;
    actionsDisabled: boolean;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
    onDuplicate?: (transaction: Transaction) => void;
}

const TransactionActionsMenu = ({
    transaction,
    actionsDisabled,
    onEdit,
    onDelete,
    onDuplicate,
}: TransactionActionsMenuProps) => {
    const { t } = useTranslation();
    const showManageActions = canEditOrDelete(transaction.type);

    return (
        <Menu as="div" className="relative">
            <MenuButton
                type="button"
                disabled={actionsDisabled}
                aria-label={t("transactions.actions")}
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
                                onClick={() => onEdit(transaction)}
                                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${
                                    focus ? "bg-light-5" : ""
                                }`}
                            >
                                <Pencil className="h-4 w-4 text-helper" />
                                {t("transactions.update")}
                            </button>
                        )}
                    </MenuItem>
                )}

                {onDuplicate && (
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                type="button"
                                onClick={() => onDuplicate(transaction)}
                                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${
                                    focus ? "bg-light-5" : ""
                                }`}
                            >
                                <Copy className="h-4 w-4 text-helper" />
                                {t("wallets.duplicate")}
                            </button>
                        )}
                    </MenuItem>
                )}

                {showManageActions && onDelete && (
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                type="button"
                                onClick={() => onDelete(transaction)}
                                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger ${
                                    focus ? "bg-danger-sweet" : ""
                                }`}
                            >
                                <Trash2 className="h-4 w-4" />
                                {t("transactions.delete")}
                            </button>
                        )}
                    </MenuItem>
                )}
            </MenuItems>
        </Menu>
    );
};

const tableHeaderClass =
    "border-b border-light-10 px-3 py-4 text-left text-sm font-medium text-light first:pl-7 last:pr-7";
const tableCellClass =
    "border-b border-light-10 px-3 py-5 align-middle first:pl-7 last:pr-7";

export const TransactionsTable = ({
    transactions,
    isLoading,
    query,
    currency = "USD",
    showCategory = true,
    showRegisteredBy = true,
    onEdit,
    onDelete,
    onDuplicate,
    actionsDisabled = false,
}: TransactionsTableProps) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <>
                <section className="flex flex-col @5xl:hidden">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton
                            key={index}
                            className="px-4 sm:px-7"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonText className="h-4 w-28 sm:w-36" />
                                    {showRegisteredBy ? (
                                        <div className="flex items-center gap-2">
                                            <SkeletonText className="h-6 w-6 rounded-full" />
                                            <SkeletonText className="h-3 w-28" />
                                        </div>
                                    ) : (
                                        <SkeletonText className="h-3 w-20" />
                                    )}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <SkeletonText className="h-4 w-16" />
                                    <SkeletonText className="size-5" />
                                </div>
                            </div>
                        </WalletItemSkeleton>
                    ))}
                </section>

                <div className="hidden @5xl:block">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr>
                                <th className={tableHeaderClass}>
                                    {t("walletView.transaction")}
                                </th>
                                {showRegisteredBy ? (
                                    <th className={tableHeaderClass}>
                                        {t("walletView.registeredBy")}
                                    </th>
                                ) : null}
                                {showCategory ? (
                                    <th className={tableHeaderClass}>
                                        {t("walletView.category")}
                                    </th>
                                ) : null}
                                <th className={tableHeaderClass}>
                                    {t("walletView.date")}
                                </th>
                                <th
                                    className={`${tableHeaderClass} text-right`}
                                >
                                    {t("walletView.amount")}
                                </th>
                                <th className={`${tableHeaderClass} w-12`}>
                                    <span className="sr-only">
                                        {t("transactions.actions")}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index}>
                                    <td className={tableCellClass}>
                                        <SkeletonText className="h-4 w-36" />
                                    </td>
                                    {showRegisteredBy ? (
                                        <td className={tableCellClass}>
                                            <div className="flex items-center gap-2">
                                                <SkeletonText className="h-8 w-8 rounded-full" />
                                                <SkeletonText className="h-4 w-24" />
                                            </div>
                                        </td>
                                    ) : null}
                                    {showCategory ? (
                                        <td className={tableCellClass}>
                                            <SkeletonText className="h-4 w-20" />
                                        </td>
                                    ) : null}
                                    <td className={tableCellClass}>
                                        <SkeletonText className="h-4 w-20" />
                                    </td>
                                    <td className={tableCellClass}>
                                        <SkeletonText className="ml-auto h-4 w-16" />
                                    </td>
                                    <td className={tableCellClass}>
                                        <SkeletonText className="size-5" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="h-full p-4 sm:p-7">
                <CustomEmptyState
                    title={
                        query.trim()
                            ? t("walletView.searchResults")
                            : t("transactions.noTransactions")
                    }
                    description={
                        query.trim()
                            ? t("walletView.searchHint")
                            : t("transactions.walletEmptyHint")
                    }
                    Icon={Receipt}
                />
            </div>
        );
    }

    return (
        <>
            {/* Mobile: stacked card rows */}
            <section className="flex flex-col @5xl:hidden">
                {transactions.map((tx) => {
                    const amount = displayAmount(tx);
                    const categoryLabel = hasCategory(tx)
                        ? tx.categoryName || "—"
                        : tx.counterpartWalletName || t("walletView.transfer");
                    const categoryColor = hasCategory(tx)
                        ? tx.categoryColor || "#64748B"
                        : undefined;

                    return (
                        <WalletItem key={tx.id} className="px-4 sm:px-7">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-light">
                                        {tx.title}
                                    </p>

                                    <div className="mt-2 flex flex-col gap-1.5">
                                        <div className="flex min-w-0 items-center gap-2">
                                            {showRegisteredBy ? (
                                                <>
                                                    <ContributorAvatar
                                                        transaction={tx}
                                                        sizeClassName="h-6 w-6"
                                                        textClassName="text-[9px]"
                                                    />
                                                    <span className="truncate text-xs text-helper">
                                                        {getContributorDisplayName(
                                                            tx,
                                                        )}
                                                    </span>
                                                    <span className="shrink-0 text-xs text-label">
                                                        ·{" "}
                                                        {formatMonthYear(
                                                            tx.date,
                                                        )}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="shrink-0 text-xs text-label">
                                                    {formatMonthYear(tx.date)}
                                                </span>
                                            )}
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

                                <div className="flex shrink-0 items-start gap-1">
                                    <p
                                        className={`pt-0.5 text-right text-sm font-semibold tabular-nums ${getTransactionAmountClassName(
                                            tx.type,
                                            amount,
                                        )}`}
                                    >
                                        {formatCurrency(amount, currency)}
                                    </p>

                                    <TransactionActionsMenu
                                        transaction={tx}
                                        actionsDisabled={actionsDisabled}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onDuplicate={onDuplicate}
                                    />
                                </div>
                            </div>
                        </WalletItem>
                    );
                })}
            </section>

            {/* Desktop: real table so columns hide cleanly */}
            <div className="hidden @5xl:block">
                <table className="w-full table-fixed">
                    <thead>
                        <tr>
                            <th className={tableHeaderClass}>
                                {t("walletView.transaction")}
                            </th>
                            {showRegisteredBy ? (
                                <th className={tableHeaderClass}>
                                    {t("walletView.registeredBy")}
                                </th>
                            ) : null}
                            {showCategory ? (
                                <th className={tableHeaderClass}>
                                    {t("walletView.category")}
                                </th>
                            ) : null}
                            <th className={tableHeaderClass}>
                                {t("walletView.date")}
                            </th>
                            <th className={`${tableHeaderClass} text-right`}>
                                {t("walletView.amount")}
                            </th>
                            <th className={`${tableHeaderClass} w-14`}>
                                <span className="sr-only">
                                    {t("transactions.actions")}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const amount = displayAmount(tx);

                            return (
                                <tr
                                    key={tx.id}
                                    className="transition-colors hover:bg-secondary/40"
                                >
                                    <td className={tableCellClass}>
                                        <p className="truncate text-sm font-semibold text-light">
                                            {tx.title}
                                        </p>
                                    </td>
                                    {showRegisteredBy ? (
                                        <td className={tableCellClass}>
                                            <TransactionContributorCell
                                                transaction={tx}
                                            />
                                        </td>
                                    ) : null}
                                    {showCategory ? (
                                        <td className={tableCellClass}>
                                            <TransactionCategoryCell
                                                transaction={tx}
                                            />
                                        </td>
                                    ) : null}
                                    <td className={tableCellClass}>
                                        <p className="truncate text-sm text-helper">
                                            {formatMonthYear(tx.date)}
                                        </p>
                                    </td>
                                    <td className={tableCellClass}>
                                        <p
                                            className={`text-right text-sm font-semibold tabular-nums ${getTransactionAmountClassName(
                                                tx.type,
                                                amount,
                                            )}`}
                                        >
                                            {formatCurrency(amount, currency)}
                                        </p>
                                    </td>
                                    <td className={tableCellClass}>
                                        <div className="flex justify-end">
                                            <TransactionActionsMenu
                                                transaction={tx}
                                                actionsDisabled={
                                                    actionsDisabled
                                                }
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onDuplicate={onDuplicate}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
