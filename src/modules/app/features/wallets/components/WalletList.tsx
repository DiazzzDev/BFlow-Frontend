import { ChevronRight, Users, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WalletTypeFilter } from "../utils/filters";

import { WalletItem } from "./WalletItem";
import { WalletItemSkeleton } from "./WalletItemSkeleton";

import type { Wallet as WalletModel } from "@/modules/app/interfaces/Wallet";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";

interface WalletListProps {
    wallets: WalletModel[];
    isLoading: boolean;
    query: string;
    walletType: WalletTypeFilter;
    ownerLabel: string;
    showCreateButton: boolean;
    onCreate: () => void;
}

export const WalletList = ({
    wallets,
    isLoading,
    query,
    walletType,
    ownerLabel,
    showCreateButton,
    onCreate,
}: WalletListProps) => {
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <section className="flex flex-col gap-3 overflow-x-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                    <WalletItemSkeleton key={index} />
                ))}
            </section>
        );
    }

    if (wallets.length > 0) {
        return (
            <section className="flex flex-col gap-3">
                {wallets.map((wallet) => (
                    <WalletItem key={wallet.id} to={`/app/wallets/${wallet.id}`}>
                        <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                            <div className="min-w-0 flex-1 sm:flex-[1.6]">
                                <p className="truncate text-sm font-semibold text-light">
                                    {wallet.name}
                                </p>
                                <p className="mt-0.5 truncate text-xs text-helper">
                                    {wallet.description || ownerLabel}
                                </p>
                                <p className="mt-2 truncate text-xs text-label sm:hidden">
                                    {wallet.currency}
                                    {" · "}
                                    {formatMonthYear(wallet.createdAt)}
                                </p>
                            </div>

                            <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                {wallet.currency}
                            </p>

                            <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                {formatMonthYear(wallet.createdAt)}
                            </p>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                <p className="text-right text-sm font-semibold tabular-nums text-info">
                                    {formatCurrency(wallet.balance, wallet.currency)}
                                </p>
                                <ChevronRight className="h-5 w-5 text-helper sm:h-7 sm:w-7 sm:text-light" />
                            </div>
                        </div>
                    </WalletItem>
                ))}
            </section>
        );
    }

    const emptyTitle = query.trim()
        ? t("wallets.noResults")
        : t(walletType === "MINE" ? "wallets.noMine" : "wallets.noShared");
    const emptyDescription = query.trim()
        ? t("wallets.searchHint")
        : t(walletType === "MINE" ? "wallets.mineHint" : "wallets.sharedHint");

    return (
        <CustomEmptyState
            title={emptyTitle}
            description={emptyDescription}
            Icon={walletType === "MINE" ? Wallet : Users}
            buttonText={showCreateButton ? t("wallets.create") : undefined}
            onButtonClick={showCreateButton ? onCreate : undefined}
        />
    );
};
