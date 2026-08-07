import type { Wallet } from "../../wallets/interfaces/Wallets";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface WalletTransferCardProps {
    wallet: Pick<Wallet, "name" | "balance" | "currency" | "description" | "role">;
    label: string;
    highlight?: boolean;
}

export const WalletTransferCard = ({
    wallet,
    label,
    highlight = false,
}: WalletTransferCardProps) => {
    return (
        <div
            className={`flex min-h-36 w-full flex-col justify-between rounded-2xl border p-4 ${
                highlight
                    ? "border-primary-25 bg-primary-15/30"
                    : "border-light-10 bg-surface-hard/50"
            }`}
        >
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-helper">
                    {label}
                </p>
                <h3 className="mt-2 truncate text-base font-semibold text-light">
                    {wallet.name}
                </h3>
                {wallet.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-helper">
                        {wallet.description}
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
                <p className="text-lg font-semibold text-light">
                    {formatCurrency(wallet.balance, wallet.currency)}
                </p>
                {wallet.role && (
                    <span className="rounded-md border border-light-10 px-2 py-0.5 text-[11px] text-helper">
                        {wallet.role}
                    </span>
                )}
            </div>
        </div>
    );
};
