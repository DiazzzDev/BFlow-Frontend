import type { Transaction } from "../../walletView/interfaces/Transaction";

import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

interface HistoryItemProps {
    transaction: Transaction;
}

const amountClassName = (type: Transaction["type"], amount: number) => {
    if (type === "EXPENSE" || amount < 0) { return "text-danger" };
    if (type === "INCOME" || amount > 0) { return "text-info" };
    return "text-light";
};

export const HistoryItem = ({ transaction }: HistoryItemProps) => {
    return (
        <li className="flex items-start justify-between gap-3 border-b border-light-10 py-4 last:border-b-0">
            <div className="min-w-0 flex items-start gap-3">
                <div className="min-w-0">
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

            <p
                className={`shrink-0 text-sm font-semibold tabular-nums ${amountClassName(
                    transaction.type,
                    transaction.amount,
                )}`}
            >
                {formatCurrency(transaction.amount)}
            </p>
        </li>
    );
};
