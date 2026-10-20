import type {
    BudgetHealth,
    DashboardAverages,
    DashboardBalance,
    RecentActivityItem,
    RecentActivityType,
} from "./interfaces/dashboard";

import { apiRequest, idempotentPost, type ApiResponse } from "@/utils/api";
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

export const getBudgetsHealth = async () => {
    return await apiRequest<ApiResponse<BudgetHealth[]>>(
        `${dashboardUrl}/budgets-health`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la salud de los presupuestos",
    );
};

export interface GetRecentActivityParams {
    type?: RecentActivityType;
    query?: string;
    limit?: number;
}

export const getRecentActivity = async ({
    type = "ALL",
    query,
    limit = 5,
}: GetRecentActivityParams = {}) => {
    const params = new URLSearchParams({
        type,
        limit: String(Math.min(Math.max(limit, 1), 50)),
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<ApiResponse<RecentActivityItem[]>>(
        `${dashboardUrl}/recent-activity?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener la actividad reciente",
    );
};

export const registerQuickTransaction = async (amount: number) => {
    return await idempotentPost<number>(`${config.API_BASE_URL}/api/v1/expenses/quick`, { amount }, {
        friendlyMessage: "Error al crear el gasto",
    });
};

export const RECEIPT_TERMINAL_STATUSES = [
    "EXTRACTED",
    "FAILED",
    "CONFIRMED",
    "DISCARDED",
] as const;

export type ReceiptStatus =
    | "RECEIVED"
    | "PROCESSING"
    | (typeof RECEIPT_TERMINAL_STATUSES)[number];

export interface Receipt {
    id: string;
    fileId: string;
    walletId: string;
    status: ReceiptStatus;
    suggestedType: string | null;
    suggestedTitle: string | null;
    suggestedAmount: number | null;
    suggestedDate: string | null;
    suggestedCategoryId: string | null;
    confidenceScore: number | null;
    failureReason: string | null;
    resultingExpenseId: string | null;
    createdAt: string;
}

export const uploadReceipt = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest<ApiResponse<Receipt>>(
        `${config.API_BASE_URL}/api/v1/receipts/upload`,
        { method: "POST", body: formData },
        "Error al subir el recibo",
    );
};

export const getReceipt = async (receiptId: string) => {
    return await apiRequest<ApiResponse<Receipt>>(
        `${config.API_BASE_URL}/api/v1/receipts/${receiptId}`,
        { method: "GET" },
        "Error al consultar el recibo",
    );
};

export interface ConfirmReceiptPayload {
    type: "INCOME" | "EXPENSE";
    title: string;
    description: string;
    amount: number;
    categoryId: string;
    date: string;
}

export const confirmReceipt = async (
    receiptId: string,
    payload: ConfirmReceiptPayload,
) => {
    return await apiRequest<ApiResponse<Receipt>>(
        `${config.API_BASE_URL}/api/v1/receipts/${receiptId}/confirm`,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(payload),
        },
        "Error al confirmar el recibo",
    );
};

const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });

export const waitForReceipt = async (
    receiptId: string,
    options: { initialDelay?: number; interval?: number; timeout?: number } = {},
) => {
    const {
        initialDelay = 1_000,
        interval = 2_000,
        timeout = 180_000,
    } = options;
    const timeoutAt = Date.now() + timeout;

    await wait(initialDelay);

    while (Date.now() < timeoutAt) {
        const response = await getReceipt(receiptId);
        const receipt = response.data;

        if ((RECEIPT_TERMINAL_STATUSES as readonly string[]).includes(receipt.status)) {
            if (receipt.status === "FAILED" || receipt.status === "DISCARDED") {
                throw new Error(receipt.failureReason || "El recibo no pudo procesarse");
            }

            return response;
        }

        await wait(interval);
    }

    throw new Error("El procesamiento del recibo tardó demasiado");
};
