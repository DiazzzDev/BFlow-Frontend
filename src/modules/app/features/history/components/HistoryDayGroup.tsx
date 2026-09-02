import type { Transaction } from "../../walletView/interfaces/Transaction";
import {
    formatHistoryDayLabel,
    type HistoryDayGroup as HistoryDayGroupType,
} from "../utils/groupTransactionsByDay";

import { HistoryTransactionCard } from "./HistoryTransactionCard";

interface HistoryDayGroupProps {
    group:  HistoryDayGroupType;
    isLast: boolean;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
    actionsDisabled?: boolean;
}

export const HistoryDayGroup = ({
    group,
    isLast,
    onViewDetails,
    onDuplicate,
    actionsDisabled = false,
}: HistoryDayGroupProps) => {
    const { day, monthYear, weekday } = formatHistoryDayLabel(group.date);

    return (
        <section className="flex gap-4 sm:gap-5">
            <div className="relative w-16 shrink-0 sm:w-20">
                <div
                    aria-hidden="true"
                    className={`absolute left-1/2 w-px -translate-x-1/2 bg-light-10 ${
                        isLast ? "top-8 bottom-0" : "-bottom-8 top-8"
                    }`}
                />

                <div className="relative z-10 mx-auto flex h-16 w-16 flex-col items-center justify-center rounded-full border border-light-10 bg-surface-hard text-center shadow-sm sm:h-[4.75rem] sm:w-[4.75rem]">
                    <span className="text-xl font-bold leading-none text-light sm:text-2xl">
                        {day}
                    </span>
                    <span className="mt-1 text-[9px] font-medium uppercase tracking-wider text-helper sm:text-[10px]">
                        {monthYear}
                    </span>
                    <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]">
                        {weekday}
                    </span>
                </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3 pb-8">
                {group.transactions.map((transaction) => (
                    <div key={transaction.id} className="relative">
                        <span
                            aria-hidden="true"
                            className="absolute top-1/2 -left-12 hidden h-px w-12 -translate-y-1/2 bg-light-10 sm:-left-[3.75rem] sm:block sm:w-[3.75rem]"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute top-1/2 -left-12 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-hard bg-light-25 sm:-left-[3.75rem] sm:block"
                        />

                        <HistoryTransactionCard
                            transaction={transaction}
                            onViewDetails={onViewDetails}
                            onDuplicate={onDuplicate}
                            actionsDisabled={actionsDisabled}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
