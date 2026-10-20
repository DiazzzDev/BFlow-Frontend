import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { WalletsHistoryList } from "./WalletsHistoryList";

import type { Transaction } from "@/modules/app/interfaces/Transaction";

interface WalletsHistoryPanelProps {
    history: Transaction[];
    isLoading: boolean;
    actionsDisabled: boolean;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
}

// Desktop sidebar history: header + scrollable list
export const WalletsHistoryPanel = ({
    history,
    isLoading,
    actionsDisabled,
    onViewDetails,
    onDuplicate,
}: WalletsHistoryPanelProps) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-3 px-5 pt-6">
                <h2 className="text-2xl font-semibold tracking-tight text-light">
                    {t("wallets.history")}
                </h2>
                <Link
                    to="/app/history"
                    className="text-sm font-medium text-primary transition-colors hover:opacity-80"
                >
                    {t("wallets.viewMore")}
                </Link>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                <WalletsHistoryList
                    history={history}
                    isLoading={isLoading}
                    actionsDisabled={actionsDisabled}
                    onViewDetails={onViewDetails}
                    onDuplicate={onDuplicate}
                />
            </div>
        </>
    );
};
