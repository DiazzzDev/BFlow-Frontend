import { useState } from "react";
import { Plus } from "lucide-react";

import { NewTransactionModal } from "../../components/newTransaction/NewTransactionModal";

import { BalanceCard } from "./components/Balancecard";
import { ThisMonthCard } from "./components/ThisMonthCard";
import { SpendingCard } from "./components/SpendingCard";
import { BudgetsHealthCard } from "./components/BudgetsHealthCard";
import { StatisticsCard } from "./components/StatisticsCard";
import { AverageStatsCard } from "./components/AverageStatsCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { UpgradeProCard } from "./components/UpgradeproCard";
import { useGetBalance } from "./hooks/useGetBalance";
import { useGetAverages } from "./hooks/useGetAverages";
import { useGetSpending } from "./hooks/useGetSpending";
import { useGetActivityBreakdown } from "./hooks/useGetActivityBreakdown";
import { useGetStatistics } from "./hooks/useGetStatistics";
import { useGetBudgetsHealth } from "./hooks/useGetBudgetsHealth";
import { useGetRecentActivity } from "./hooks/useGetTrecentActivity";
import { getFirstName, getTimeGreeting } from "./utils/greeting";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";

const DEFAULT_CURRENCY = "USD";
const DASHBOARD_TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;

export const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);
    const firstName = getFirstName(user?.name);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoading: isLoadingBalance, data: balanceData } = useGetBalance();
    const { isLoading: isLoadingAverages, data: averagesData } = useGetAverages();
    const { isLoading: isLoadingSpending, data: spendingData } = useGetSpending();
    const { isLoading: isLoadingBreakdown, data: breakdownData } = useGetActivityBreakdown();
    const { isLoading: isLoadingStatistics, data: statisticsData } = useGetStatistics();
    const { isLoading: isLoadingBudgets, data: budgetsData } = useGetBudgetsHealth();
    const { isLoading: isLoadingActivity, data: activityData } = useGetRecentActivity();

    const balance = balanceData?.data;
    const averages = averagesData?.data;
    const spending = spendingData?.data;
    const months = statisticsData?.data.months ?? [];
    const budgets = budgetsData?.data ?? [];
    const activities = activityData?.data ?? [];

    return (
        <div className="flex min-h-0 flex-col overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mb-6 flex shrink-0 flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-light">
                        {getTimeGreeting()}
                        {firstName ? `, ${firstName}` : ""}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper">
                        Así está tu dinero en este momento.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    text="Nueva transacción"
                    icon={<Plus className="h-4 w-4" />}
                    className="w-fit shrink-0"
                />
            </div>

            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-5">
                    <BalanceCard
                        isLoading={isLoadingBalance}
                        total={balance?.total ?? 0}
                        currency={DEFAULT_CURRENCY}
                        percentageChangeLastMonth={balance?.percentageChangeLastMonth ?? 0}
                    />
                    <SpendingCard
                        isLoading={isLoadingSpending}
                        totalSpent={spending?.totalSpent ?? 0}
                        currency={DEFAULT_CURRENCY}
                        totalActivityPercentage={spending?.totalActivityPercentage ?? 0}
                        topCategories={spending?.topCategories ?? []}
                    />
                    <StatisticsCard isLoading={isLoadingStatistics} months={months} />
                    <RecentActivityCard
                        isLoading={isLoadingActivity}
                        activities={activities}
                        currency={DEFAULT_CURRENCY}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-5">
                    <ThisMonthCard
                        isLoading={isLoadingBreakdown}
                        breakdown={breakdownData?.data}
                    />
                    <BudgetsHealthCard isLoading={isLoadingBudgets} budgets={budgets} />
                    <AverageStatsCard
                        isLoading={isLoadingAverages}
                        currency={DEFAULT_CURRENCY}
                        averageIncome={averages?.averageIncome ?? 0}
                        incomePercentageChangeLastMonth={
                            averages?.incomePercentageChangeLastMonth ?? 0
                        }
                        averageExpenses={averages?.averageExpenses ?? 0}
                        expensesPercentageChangeLastMonth={
                            averages?.expensesPercentageChangeLastMonth ?? 0
                        }
                    />
                    <UpgradeProCard />
                </div>
            </div>

            <NewTransactionModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                mode="create"
                requireWalletSelect
                allowedTypes={DASHBOARD_TRANSACTION_TYPES}
            />
        </div>
    );
};
