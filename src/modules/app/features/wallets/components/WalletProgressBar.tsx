import { formatCurrency } from "../../../../../utils/formaters.ts";

export const WalletProgressBar = ({ spent, budget }: { spent: number, budget: number }) => {
    if (!budget) { return null };

    const percentage = Math.min((spent / budget) * 100, 100);
    const barClass = percentage > 80 ? "bg-danger" : "bg-warning";

    return (
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Gasto del mes</span>
                <span>{formatCurrency(spent)} / {formatCurrency(budget)}</span>
            </div>
            <div className="h-1 rounded-full bg-info-25">
                <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
