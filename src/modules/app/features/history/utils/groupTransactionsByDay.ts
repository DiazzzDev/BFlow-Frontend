import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale/es";

import type { Transaction } from "../../walletView/interfaces/Transaction";

export interface HistoryDayGroup {
    dayKey: string;
    date: Date;
    transactions: Transaction[];
}

export const groupTransactionsByDay = (
    transactions: Transaction[],
): HistoryDayGroup[] => {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
        const dayKey = format(parseISO(transaction.date), "yyyy-MM-dd");

        if (!groups.has(dayKey)) {
            groups.set(dayKey, []);
        }

        groups.get(dayKey)?.push(transaction);
    }

    return Array.from(groups.entries())
        .map(([dayKey, dayTransactions]) => ({
            dayKey,
            date: parseISO(dayKey),
            transactions: dayTransactions.sort(
                (left, right) =>
                    parseISO(right.date).getTime() - parseISO(left.date).getTime(),
            ),
        }))
        .sort((left, right) => right.date.getTime() - left.date.getTime());
};

export const formatHistoryDayLabel = (date: Date) => ({
    day: format(date, "d", { locale: es }),
    monthYear: format(date, "MMM, yyyy", { locale: es }).toUpperCase(),
    weekday: format(date, "EEE", { locale: es }).toUpperCase(),
});
