import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Copy, Eye, MoreVertical } from "lucide-react";

import type { Transaction } from "../../walletView/interfaces/Transaction";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

interface HistoryItemProps {
    transaction: Transaction;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
    actionsDisabled?: boolean;
}

const amountClassName = (type: Transaction["type"], amount: number) => {
    if (type === "EXPENSE" || amount < 0) {
        return "text-danger";
    }
    if (type === "INCOME" || amount > 0) {
        return "text-info";
    }
    return "text-light";
};

export const HistoryItem = ({
    transaction,
    onViewDetails,
    onDuplicate,
    actionsDisabled = false,
}: HistoryItemProps) => {
    return (
        <li className="flex items-start justify-between gap-3 border-b border-light-10 pr-3 py-4 last:border-b-0">
            <div className="flex min-w-0 items-start gap-3">
                <div className="min-w-0 flex items-center gap-3">
                    <div>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-10" style={{
                            backgroundColor: `${transaction.categoryColor || "#64748B"}22`,
                            color: transaction.categoryColor || "#64748B",
                        }}>
                            <CategoryIcon icon={transaction.categoryIcon} className="h-4 w-4" />
                        </span>
                    </div>
                    <div>
                        <p className="truncate text-sm font-medium text-light">
                            {transaction.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-helper">
                            {transaction.categoryName}
                            {transaction.walletName ? ` · ${transaction.walletName}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-label">
                            {formatterDynamicDate(transaction.date) || "—"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-start gap-1">
                <p
                    className={`pt-0.5 text-sm font-semibold tabular-nums ${amountClassName(
                        transaction.type,
                        transaction.amount,
                    )}`}
                >
                    {formatCurrency(transaction.amount)}
                </p>

                <Menu as="div" className="relative">
                    <MenuButton
                        type="button"
                        disabled={actionsDisabled}
                        aria-label="Acciones de la transacción"
                        className="rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </MenuButton>

                    <MenuItems
                        anchor="bottom end"
                        className="z-50 w-48 rounded-xl border border-light-10 bg-surface p-1 shadow-custom focus:outline-none"
                    >
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    type="button"
                                    onClick={() => onViewDetails(transaction)}
                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${focus ? "bg-light-5" : ""
                                        }`}
                                >
                                    <Eye className="h-4 w-4 text-helper" />
                                    Ver detalles
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    type="button"
                                    onClick={() => onDuplicate(transaction)}
                                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-light ${focus ? "bg-light-5" : ""
                                        }`}
                                >
                                    <Copy className="h-4 w-4 text-helper" />
                                    Duplicar
                                </button>
                            )}
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
        </li>
    );
};
