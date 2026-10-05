import { useState } from "react";

import {
    DASHBOARD_DEFAULT_CURRENCY,
} from "../utils/constants";
import { getDashboardGreetingKey, getFirstName } from "../utils/greeting";

import { useGetAverages } from "./useGetAverages";
import { useGetBalance } from "./useGetBalance";
import { useGetBudgetsHealth } from "./useGetBudgetsHealth";
import { useGetRecentActivity } from "./useGetRecentActivity";

import { useAuthStore } from "@/auth/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import type { RecentActivityType } from "../interfaces/dashboard";

export const useDashboardPage = () => {
    // Greeting from the signed-in user (page applies i18n)
    const user = useAuthStore((state) => state.user);
    const firstName = getFirstName(user?.name);
    const greetingKey = getDashboardGreetingKey();

    // Dashboard data fetches
    const { isLoading: isLoadingBalance, data: balanceData } = useGetBalance();
    const { isLoading: isLoadingAverages, data: averagesData } =
        useGetAverages();
    const { isLoading: isLoadingBudgets, data: budgetsData } =
        useGetBudgetsHealth();
    const [activityType, setActivityType] = useState<RecentActivityType>("ALL");
    const [activityQuery, setActivityQuery] = useState("");
    const debouncedActivityQuery = useDebounce(activityQuery);
    const { isLoading: isLoadingActivity, data: activityData } =
        useGetRecentActivity({
            type: activityType,
            query: debouncedActivityQuery,
            limit: 5,
        });

    // Derived card props
    const balance = balanceData?.data;
    const averages = averagesData?.data;
    const budgets = budgetsData?.data ?? [];
    const activities = activityData?.data ?? [];

    return {
        firstName,
        greetingKey,
        currency: DASHBOARD_DEFAULT_CURRENCY,
        isLoadingBalance: isLoadingBalance || isLoadingAverages,
        isLoadingBudgets,
        isLoadingActivity,
        balanceTotal: balance?.total ?? 0,
        percentageChangeLastMonth: balance?.percentageChangeLastMonth ?? 0,
        averageIncome: averages?.averageIncome ?? 0,
        averageExpenses: averages?.averageExpenses ?? 0,
        budgets,
        activities,
        activityType,
        activityQuery,
        setActivityType,
        setActivityQuery,
    };
};
