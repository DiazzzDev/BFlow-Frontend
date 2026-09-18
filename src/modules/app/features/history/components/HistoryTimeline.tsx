import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

import { groupTransactionsByDay } from "../utils/groupTransactionsByDay";

import { HistoryDayGroup } from "./HistoryDayGroup";
import { HistoryTimelineSkeleton } from "./HistoryTimelineSkeleton";

import type { Transaction } from "@/modules/app/interfaces/Transaction";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

interface HistoryTimelineProps {
    transactions: Transaction[];
    isLoading: boolean;
    onViewDetails: (transaction: Transaction) => void;
    onDuplicate: (transaction: Transaction) => void;
    actionsDisabled?: boolean;
}

export const HistoryTimeline = ({
    transactions,
    isLoading,
    onViewDetails,
    onDuplicate,
    actionsDisabled = false,
}: HistoryTimelineProps) => {
    const { t } = useTranslation();
    if (isLoading) {
        return <HistoryTimelineSkeleton />;
    }

    const dayGroups = groupTransactionsByDay(transactions);

    if (dayGroups.length === 0) {
        return (
            <CustomEmptyState
                Icon={Receipt}
                title={t("history.empty")}
                description={t("history.emptyHint")}
                className="my-8"
            />
        );
    }

    return (
        <div className="space-y-2">
            {dayGroups.map((group, index) => (
                <HistoryDayGroup
                    key={group.dayKey}
                    group={group}
                    isLast={index === dayGroups.length - 1}
                    onViewDetails={onViewDetails}
                    onDuplicate={onDuplicate}
                    actionsDisabled={actionsDisabled}
                />
            ))}
        </div>
    );
};
