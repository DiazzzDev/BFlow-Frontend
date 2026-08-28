import type {
    CreateWalletInvitationData,
    WalletInvitation,
} from "./interfaces/WalletInvitation";

import { APIError, apiRequest } from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const invitationsUrl = `${config.API_BASE_URL}/api/v1/wallets/invitations`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
    path?: string;
};

const emptyInvitationsResponse = (): ApiResponse<WalletInvitation[]> => ({
    success: true,
    message: "OK",
    data: [],
});

/**
 * Path asumido para invitaciones recibidas.
 * Si el endpoint aún no existe (404/501), la UI muestra lista vacía.
 */
export const getWalletInvitations = async (): Promise<ApiResponse<WalletInvitation[]>> => {
    try {
        return await apiRequest<ApiResponse<WalletInvitation[]>>(
            invitationsUrl,
            { ...defaultApiOptions, method: "GET" },
            "Error al obtener las invitaciones",
        );
    } catch (error) {
        if (
            error instanceof APIError &&
            (error.status === 404 || error.status === 501)
        ) {
            return emptyInvitationsResponse();
        }
        throw error;
    }
};

export const postWalletInvitation = async (
    walletId: string,
    data: CreateWalletInvitationData,
) => {
    return await apiRequest<ApiResponse<WalletInvitation>>(
        `${walletsUrl}/${walletId}/invitations`,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(data),
        },
        "Error al enviar la invitación",
    );
};

export const acceptWalletInvitation = async (invitationId: string) => {
    return await apiRequest<ApiResponse<WalletInvitation>>(
        `${invitationsUrl}/${invitationId}/accept`,
        { ...defaultApiOptions, method: "POST" },
        "Error al aceptar la invitación",
    );
};

export const declineWalletInvitation = async (invitationId: string) => {
    return await apiRequest<ApiResponse<WalletInvitation>>(
        `${invitationsUrl}/${invitationId}/decline`,
        { ...defaultApiOptions, method: "POST" },
        "Error al rechazar la invitación",
    );
};
