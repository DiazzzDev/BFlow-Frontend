import { useState } from "react";

import {
    DASHBOARD_DEFAULT_CURRENCY,
    DASHBOARD_TRANSACTION_TYPES,
} from "../utils/constants";
import { getDashboardGreetingKey, getFirstName } from "../utils/greeting";

import { useGetActivityBreakdown } from "./useGetActivityBreakdown";
import { useGetAverages } from "./useGetAverages";
import { useGetBalance } from "./useGetBalance";
import { useGetBudgetsHealth } from "./useGetBudgetsHealth";
import { useGetRecentActivity } from "./useGetRecentActivity";
import { useGetStatistics } from "./useGetStatistics";

import { useAuthStore } from "@/auth/authStore";

export const useDashboardPage = () => {
    // Greeting from the signed-in user (page applies i18n)
    const user = useAuthStore((state) => state.user);
    const firstName = getFirstName(user?.name);
    const greetingKey = getDashboardGreetingKey();

    // Dashboard data fetches
    const { isLoading: isLoadingBalance, data: balanceData } = useGetBalance();
    const { isLoading: isLoadingAverages, data: averagesData } =
        useGetAverages();
    const { isLoading: isLoadingBreakdown, data: breakdownData } =
        useGetActivityBreakdown();
    const { isLoading: isLoadingStatistics, data: statisticsData } =
        useGetStatistics();
    const { isLoading: isLoadingBudgets, data: budgetsData } =
        useGetBudgetsHealth();
    const { isLoading: isLoadingActivity, data: activityData } =
        useGetRecentActivity();

    // Derived card props
    const balance = balanceData?.data;
    const averages = averagesData?.data;
    const months = statisticsData?.data.months ?? [];
    const budgets = budgetsData?.data ?? [];
    const activities = activityData?.data ?? [];
    const breakdown = breakdownData?.data;

    // Create / schedule transaction modals
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    return {
        firstName,
        greetingKey,
        currency: DASHBOARD_DEFAULT_CURRENCY,
        allowedTransactionTypes: DASHBOARD_TRANSACTION_TYPES,
        isNewTransactionOpen,
        setIsNewTransactionOpen,
        isScheduleOpen,
        setIsScheduleOpen,
        isLoadingBalance: isLoadingBalance || isLoadingAverages,
        isLoadingStatistics,
        isLoadingBudgets,
        isLoadingBreakdown,
        isLoadingActivity,
        balanceTotal: balance?.total ?? 0,
        percentageChangeLastMonth: balance?.percentageChangeLastMonth ?? 0,
        averageIncome: averages?.averageIncome ?? 0,
        averageExpenses: averages?.averageExpenses ?? 0,
        months,
        budgets,
        breakdown,
        activities,
    };
};
