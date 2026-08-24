import type {
    BudgetHealth,
    DashboardActivityBreakdown,
    DashboardAverages,
    DashboardBalance,
    DashboardSpending,
    DashboardStatistics,
    RecentActivityItem,
} from "./interfaces/dashboard";

import { apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const dashboardUrl = `${config.API_BASE_URL}/api/v1/dashboard`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
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

export const getSpending = async () => {
    return await apiRequest<ApiResponse<DashboardSpending>>(
        `${dashboardUrl}/spending`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener el spending",
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
    year?: number;
}

export const getStatistics = async ({ year }: GetStatisticsParams = {}) => {
    const params = new URLSearchParams();

    if (year) {
        params.set("year", String(year));
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
