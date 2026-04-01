import { formatCurrency } from "../../../utils/formaters.js";

export const WalletProgressBar = ({ spent, budget }) => {
    if (!budget) { return null };

    const percentage = Math.min((spent / budget) * 100, 100);
    const color = percentage > 80 ? 'var(--danger-color)' : 'var(--warning-color)';

    return (
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
                <span>Gasto del mes</span>
                <span>{formatCurrency(spent)} / {formatCurrency(budget)}</span>
            </div>
            <div className="h-1 rounded-full bg-[var(--progress-bg)]">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}