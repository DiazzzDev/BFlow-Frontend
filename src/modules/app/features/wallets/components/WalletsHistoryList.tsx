import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

import { HistoryItem } from "./HistoryItem";
import { HistoryItemSkeleton } from "./HistoryItemSkeleton";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface WalletsHistoryListProps {
    history: Transaction[];
    isLoading: boolean;
    actionsDisabled: boolean;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
}

export const WalletsHistoryList = ({
    history,
    isLoading,
    actionsDisabled,
    onViewDetails,
    onDuplicate,
}: WalletsHistoryListProps) => {
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <ul className="flex flex-col">
                {Array.from({ length: 6 }).map((_, index) => (
                    <HistoryItemSkeleton key={index} />
                ))}
            </ul>
        );
    }

    if (history.length > 0) {
        return (
            <ul className="flex flex-col">
                {history.map((transaction) => (
                    <HistoryItem
                        key={transaction.id}
                        transaction={transaction}
                        onViewDetails={onViewDetails}
                        onDuplicate={onDuplicate}
                        actionsDisabled={actionsDisabled}
                    />
                ))}
            </ul>
        );
    }

    return (
        <CustomEmptyState
            title={t("dashboard.noHistory")}
            description={t("dashboard.activityHint")}
            Icon={Receipt}
            className="m-0!"
        />
    );
};
