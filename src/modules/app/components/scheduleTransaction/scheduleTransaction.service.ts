import type { CreateRecurringData, Recurring } from "./interfaces/Recurring";

import { apiRequest, idempotentPost } from "@/utils/api";
import { config } from "@/config/config";

const recurringUrl = `${config.API_BASE_URL}/api/v1/recurring`;

export const postRecurring = async (recurringData: CreateRecurringData) => {
    return await idempotentPost<Recurring>(recurringUrl, recurringData, {
        friendlyMessage: "Error al programar la transacción",
    });
};

export const getWalletRecurring = async (walletId: string) =>
    await apiRequest<Recurring[]>(
        `${recurringUrl}/wallet/${walletId}`,
        { method: "GET" },
        "Error al obtener los cargos automáticos",
    );

export const updateRecurring = async (id: string, recurringData: CreateRecurringData) =>
    await apiRequest<Recurring>(
        `${recurringUrl}/${id}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recurringData),
        },
        "Error al actualizar el cargo automático",
    );

export const deleteRecurring = async (id: string) =>
    await apiRequest<void>(
        `${recurringUrl}/${id}`,
        { method: "DELETE" },
        "Error al eliminar el cargo automático",
    );
