import { useState } from "react";
import { Plus } from "lucide-react";

import { NewTransactionModal } from "../../components/NewTransactionModal";

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
import { useGetStatistics } from "./hooks/useGetStatistics";
import { useGetBudgetsHealth } from "./hooks/useGetBudgetsHealth";
import { useGetRecentActivity } from "./hooks/useGetTrecentActivity";
import { getFirstName, getTimeGreeting } from "./utils/greeting";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";

const DEFAULT_CURRENCY = "USD";

export const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);
    const firstName = getFirstName(user?.name);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoading: isLoadingBalance, data: balanceData } = useGetBalance();
    const { isLoading: isLoadingAverages, data: averagesData } = useGetAverages();
    const { isLoading: isLoadingSpending, data: spendingData } = useGetSpending();
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
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mb-6 flex flex-col justify-between gap-4 @xl:flex-row @xl:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {getTimeGreeting()}
                        {firstName ? `, ${firstName}` : ""}
                    </h1>
                    <p className="mt-1 text-sm text-helper">
                        Here&apos;s what&apos;s happening with your money.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    text="New transaction"
                    icon={<Plus className="h-4 w-4" />}
                    className="w-fit shrink-0"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">
                <div className="@5xl:col-span-2">
                    <BalanceCard
                        isLoading={isLoadingBalance}
                        total={balance?.total ?? 0}
                        currency={DEFAULT_CURRENCY}
                        percentageChangeLastMonth={balance?.percentageChangeLastMonth ?? 0}
                    />
                </div>
                <ThisMonthCard
                    isLoading={isLoadingSpending}
                    totalActivityPercentage={spending?.totalActivityPercentage ?? 0}
                    topCategories={spending?.topCategories ?? []}
                />

                <div className="@5xl:col-span-2">
                    <SpendingCard
                        isLoading={isLoadingSpending}
                        totalSpent={spending?.totalSpent ?? 0}
                        currency={DEFAULT_CURRENCY}
                        totalActivityPercentage={spending?.totalActivityPercentage ?? 0}
                        topCategories={spending?.topCategories ?? []}
                    />
                </div>
                <BudgetsHealthCard isLoading={isLoadingBudgets} budgets={budgets} />

                <div className="@5xl:col-span-2">
                    <StatisticsCard isLoading={isLoadingStatistics} months={months} />
                </div>
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

                <div className="@5xl:col-span-2">
                    <RecentActivityCard
                        isLoading={isLoadingActivity}
                        activities={activities}
                        currency={DEFAULT_CURRENCY}
                    />
                </div>
                <UpgradeProCard />
            </div>

            <NewTransactionModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                mode="create"
                requireWalletSelect
            />
        </div>
    );
};
