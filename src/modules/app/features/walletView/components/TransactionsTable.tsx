import { Receipt } from "lucide-react";

import type { Transaction } from "../interfaces/Transaction";
import { WalletItem } from "../../wallets/components/WalletItem";
import { WalletItemSkeleton } from "../../wallets/components/WalletItemSkeleton";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
    query: string;
    currency?: string;
}

const displayAmount = (tx: Transaction) => {
    const abs = Math.abs(tx.amount);

    if (tx.type === "EXPENSE") { return -abs; }
    if (tx.type === "INCOME") { return abs; }
    return tx.amount;
};

export const TransactionsTable = ({
    transactions,
    isLoading,
    query,
    currency = "USD",
}: TransactionsTableProps) => {
    if (isLoading) {
        return (
            <section className="flex flex-col">
                {Array.from({ length: 6 }).map((_, index) => (
                    <WalletItemSkeleton key={index} className="px-7" />
                ))}
            </section>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="h-full p-7">
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
            {transactions.map((tx) => (
                <WalletItem
                    key={tx.id}
                    title={tx.title}
                    subtitle={tx.contributorName || tx.description || "—"}
                    meta={tx.categoryName || "—"}
                    dateLabel={formatMonthYear(tx.date)}
                    amount={displayAmount(tx)}
                    currency={currency}
                    showChevron={false}
                    positiveAmountClassName="text-info"
                    className="px-7"
                />
            ))}
        </section>
    );
};
