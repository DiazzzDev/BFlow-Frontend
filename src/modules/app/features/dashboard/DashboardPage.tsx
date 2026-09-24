import { Clock, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NewTransactionModal } from "../newTransaction/NewTransactionModal";
import { ScheduleTransactionModal } from "../scheduleTransaction/ScheduleTransactionModal";

import { BalanceCard } from "./components/BalanceCard";
import { ThisMonthCard } from "./components/ThisMonthCard";
import { BudgetsHealthCard } from "./components/BudgetsHealthCard";
import { StatisticsCard } from "./components/StatisticsCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { useDashboardPage } from "./hooks/useDashboardPage";

import { Button } from "@/components/controls/Button";

export const DashboardPage = () => {
    const { t } = useTranslation();
    const page = useDashboardPage();

    return (
        <div className="mx-auto flex w-full max-w-380 flex-col gap-5 px-4 py-5 sm:px-6">
            <div className="flex shrink-0 flex-col justify-between gap-4 pb-1 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-light">
                        {t(page.greetingKey)}
                        {page.firstName ? `, ${page.firstName}` : ""}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper">
                        {t("dashboard.subtitle")}
                    </p>
                </div>
                <div className="flex gap-4 self-end">
                    <Button
                        type="button"
                        onClick={() => page.setIsScheduleOpen(true)}
                        text={t("dashboard.scheduleTransaction")}
                        icon={<Clock className="h-4 w-4" />}
                        variant="secondary"
                        className="px-3!"
                    />
                    <Button
                        type="button"
                        onClick={() => page.setIsNewTransactionOpen(true)}
                        text={t("dashboard.newTransaction")}
                        icon={<Plus className="h-4 w-4" />}
                        className="w-fit shrink-0"
                    />
                </div>
            </div>

            <div className="flex gap-5">
                <div className="flex min-w-0 flex-4 flex-col gap-5">
                    <BalanceCard
                        isLoading={page.isLoadingBalance}
                        total={page.balanceTotal}
                        currency={page.currency}
                        percentageChangeLastMonth={
                            page.percentageChangeLastMonth
                        }
                        averageIncome={page.averageIncome}
                        averageExpenses={page.averageExpenses}
                    />
                    <StatisticsCard
                        isLoading={page.isLoadingStatistics}
                        months={page.months}
                        currency={page.currency}
                    />
                </div>

                <div className="flex min-w-0 flex-2 flex-col gap-5">
                    <BudgetsHealthCard
                        isLoading={page.isLoadingBudgets}
                        budgets={page.budgets}
                    />
                    <ThisMonthCard
                        isLoading={page.isLoadingBreakdown}
                        breakdown={page.breakdown}
                    />
                </div>
            </div>

            <RecentActivityCard
                isLoading={page.isLoadingActivity}
                activities={page.activities}
                currency={page.currency}
            />

            <NewTransactionModal
                isModalOpen={page.isNewTransactionOpen}
                setIsModalOpen={page.setIsNewTransactionOpen}
                mode="create"
                requireWalletSelect
                allowedTypes={page.allowedTransactionTypes}
            />

            <ScheduleTransactionModal
                isModalOpen={page.isScheduleOpen}
                setIsModalOpen={page.setIsScheduleOpen}
                requireWalletSelect
            />
        </div>
    );
};
