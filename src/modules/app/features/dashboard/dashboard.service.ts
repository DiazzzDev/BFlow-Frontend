import type {
    BudgetHealth,
    DashboardActivityBreakdown,
    DashboardAverages,
    DashboardBalance,
    DashboardStatistics,
    RecentActivityItem,
    StatisticsPeriod,
} from "./interfaces/dashboard";

import { apiRequest, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

const dashboardUrl = `${config.API_BASE_URL}/api/v1/dashboard`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export const getBalance = async () => {
    return await apiRequest<ApiResponse<DashboardBalance>>(
        `${dashboardUrl}/balance`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el balance",
    );
};

export const getAverages = async () => {
    return await apiRequest<ApiResponse<DashboardAverages>>(
        `${dashboardUrl}/averages`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener los promedios",
    );
};

export const getActivityBreakdown = async () => {
    return await apiRequest<ApiResponse<DashboardActivityBreakdown>>(
        `${dashboardUrl}/activity-breakdown`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el desglose de actividad",
    );
};

export interface GetStatisticsParams {
    period?: StatisticsPeriod;
    year?: number;
    month?: number;
    week?: number;
    startDate?: string;
    endDate?: string;
}

export const getStatistics = async ({
    period,
    year,
    month,
    week,
    startDate,
    endDate,
}: GetStatisticsParams = {}) => {
    const params = new URLSearchParams();

    if (period) {
        params.set("period", period);
    }

    if (year) {
        params.set("year", String(year));
    }

    if (month) {
        params.set("month", String(month));
    }

    if (week) {
        params.set("week", String(week));
    }

    if (startDate) {
        params.set("startDate", startDate);
    }

    if (endDate) {
        params.set("endDate", endDate);
    }

    const query = params.toString();

    return await apiRequest<ApiResponse<DashboardStatistics>>(
        `${dashboardUrl}/statistics${query ? `?${query}` : ""}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las estadísticas",
    );
};

export const getBudgetsHealth = async () => {
    return await apiRequest<ApiResponse<BudgetHealth[]>>(
        `${dashboardUrl}/budgets-health`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la salud de los presupuestos",
    );
};

export const getRecentActivity = async () => {
    return await apiRequest<ApiResponse<RecentActivityItem[]>>(
        `${dashboardUrl}/recent-activity`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la actividad reciente",
    );
};
