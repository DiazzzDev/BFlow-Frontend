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
        <div className="mx-auto flex w-full max-w-380 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex shrink-0 flex-col justify-between gap-4 pb-1 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {t(page.greetingKey)}
                        {page.firstName ? `, ${page.firstName}` : ""}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper">
                        {t("dashboard.subtitle")}
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-4 lg:self-end">
                    <Button
                        type="button"
                        onClick={() => page.setIsScheduleOpen(true)}
                        text={t("dashboard.scheduleTransaction")}
                        icon={<Clock className="h-4 w-4" />}
                        variant="secondary"
                        className="w-full px-3! sm:w-auto"
                    />
                    <Button
                        type="button"
                        onClick={() => page.setIsNewTransactionOpen(true)}
                        text={t("dashboard.newTransaction")}
                        icon={<Plus className="h-4 w-4" />}
                        className="w-full shrink-0 sm:w-fit"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex min-w-0 flex-col gap-5 lg:flex-4">
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

                <div className="flex min-w-0 flex-col gap-5 lg:flex-2">
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
