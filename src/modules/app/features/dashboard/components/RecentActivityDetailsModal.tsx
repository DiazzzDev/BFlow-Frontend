import { CalendarDays, PenLine, Repeat2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { RecentActivityItem } from "../interfaces/dashboard";

import { CustomModal } from "@/components/custom/CustomModal";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";
import { getTransactionAmountClassName } from "@/utils/getTransactionAmountClassName";

interface RecentActivityDetailsModalProps {
    activity: RecentActivityItem | null;
    onClose: () => void;
}

export const RecentActivityDetailsModal = ({
    activity,
    onClose,
}: RecentActivityDetailsModalProps) => {
    const { t } = useTranslation();

    const isIncome = activity?.type === "INCOME";
    const isRecurring = activity?.source.toLowerCase() === "recurring";
    const sourceKey = isRecurring
        ? "history.recurring"
        : "history.manual";
    const SourceIcon = isRecurring ? Repeat2 : PenLine;

    return (
        <CustomModal
            isModalOpen={Boolean(activity)}
            setIsModalOpen={(isOpen) => {
                if (!isOpen) {
                    onClose();
                }
            }}
            title={t(isIncome ? "transactions.incomeDetail" : "transactions.expenseDetail")}
            maxWidth="max-w-lg"
        >
            {activity && (
                <>
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${activity.categoryColor}22`,
                                color: activity.categoryColor,
                            }}
                        >
                            <CategoryIcon icon={activity.categoryIcon} className="h-5 w-5" />
                        </div>
                        <div className="mt-4 min-w-0 max-w-full">
                            <p className="truncate text-base font-semibold text-light">
                                {activity.name}
                            </p>
                            <p className="mt-1 text-sm text-helper">
                                {t(isIncome ? "history.income" : "history.expense")}
                            </p>
                            {activity.description ? (
                                <p className="mt-2 text-sm text-helper">
                                    {activity.description}
                                </p>
                            ) : null}
                        </div>
                        <p
                            className={`mt-3 text-3xl font-semibold tabular-nums ${getTransactionAmountClassName(activity.type, activity.amount)}`}
                        >
                            {isIncome ? "+ " : "- "}
                            {formatCurrency(Math.abs(activity.amount), activity.currency)}
                        </p>
                    </div>

                    <dl className="mt-6 divide-y divide-light-10 rounded-xl border border-light-10">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <CalendarDays className="h-4 w-4 shrink-0 text-helper" aria-hidden="true" />
                            <dt className="flex-1 text-sm text-helper">{t("transactions.transactionDate")}</dt>
                            <dd className="text-right text-sm font-medium text-light">
                                {formatterDynamicDate(activity.date || activity.createdAt)}
                            </dd>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3">
                            <Wallet className="h-4 w-4 shrink-0 text-helper" aria-hidden="true" />
                            <dt className="flex-1 text-sm text-helper">{t("transactions.wallet")}</dt>
                            <dd className="text-right text-sm font-medium text-light">
                                {activity.walletName}
                            </dd>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3">
                            <SourceIcon className="h-4 w-4 shrink-0 text-helper" aria-hidden="true" />
                            <dt className="flex-1 text-sm text-helper">{t("history.source")}</dt>
                            <dd className="text-right text-sm font-medium text-light">
                                {t(sourceKey)}
                            </dd>
                        </div>
                    </dl>
                </>
            )}
        </CustomModal>
    );
};
