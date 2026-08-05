import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface WalletViewSidebarProps {
    lastActivity: string;
    highestExpense: string;
    transactionsCount: number;
    initialValue: number;
    currency: string;
    upcoming: Array<{ label: string; when: string }>;
    onSchedule?: () => void;
}

export const WalletViewSidebar = ({
    lastActivity,
    highestExpense,
    transactionsCount,
    initialValue,
    currency,
    upcoming,
    onSchedule,
}: WalletViewSidebarProps) => {
    return (
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-light-10 flex flex-col px-6 py-5 gap-8">
            <section>
                <h2 className="text-xl font-semibold text-light mb-5">Information</h2>
                <dl className="flex flex-col gap-4">
                    <InfoRow label="Last activity" value={lastActivity} />
                    <InfoRow label="Highest expense" value={highestExpense} />
                    <InfoRow label="Transactions" value={String(transactionsCount)} />
                    <InfoRow
                        label="Initial value"
                        value={formatCurrency(initialValue, currency)}
                    />
                </dl>
            </section>

            <section className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-light">Upcoming</h2>
                    <button
                        type="button"
                        className="text-sm text-primary hover:text-primary-dark transition-colors cursor-pointer"
                    >
                        See all →
                    </button>
                </div>

                <ul className="flex flex-col gap-4 mb-6">
                    {upcoming.map((item) => (
                        <li
                            key={`${item.label}-${item.when}`}
                            className="flex items-center justify-between gap-3 text-sm"
                        >
                            <span className="text-light truncate">{item.label}</span>
                            <span className="text-helper shrink-0">{item.when}</span>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={() => onSchedule?.()}
                    className="w-full mt-auto h-11 rounded-lg border border-light-10 bg-transparent text-light text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
                >
                    Schedule a transaction
                </button>
            </section>
        </aside>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-helper">{label}</dt>
        <dd className="text-light font-medium text-right">{value}</dd>
    </div>
);
