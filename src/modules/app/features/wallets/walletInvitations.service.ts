import type {
    CreateWalletInvitationData,
    WalletInvitation,
} from "./interfaces/WalletInvitation";
import type { WalletSentInvitation } from "./interfaces/WalletSentInvitation";
import type { WalletCollaborator } from "./interfaces/WalletCollaborator";

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

export const searchWalletCollaborators = async (
    walletId: string,
    query = "",
) => {
    const params = new URLSearchParams();

    if (query.trim()) {
        params.set("query", query.trim());
    }

    const queryString = params.toString();

    return await apiRequest<ApiResponse<WalletCollaborator[]>>(
        `${walletsUrl}/${walletId}/collaborators/search${
            queryString ? `?${queryString}` : ""
        }`,
        { ...defaultApiOptions, method: "GET" },
        "Error al buscar colaboradores",
    );
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
        `${invitationsUrl}/id/${invitationId}/accept`,
        { ...defaultApiOptions, method: "POST" },
        "Error al aceptar la invitación",
    );
};

export const declineWalletInvitation = async (invitationId: string) => {
    return await apiRequest<ApiResponse<WalletInvitation>>(
        `${invitationsUrl}/id/${invitationId}/reject`,
        { ...defaultApiOptions, method: "POST" },
        "Error al rechazar la invitación",
    );
};

export const getSentWalletInvitations = async (walletId: string) => {
    return await apiRequest<ApiResponse<WalletSentInvitation[]>>(
        `${walletsUrl}/${walletId}/invitations/sent`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las invitaciones enviadas",
    );
};

export const cancelWalletInvitation = async (invitationId: string) => {
    return await apiRequest<ApiResponse<string>>(
        `${invitationsUrl}/${invitationId}`,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al cancelar la invitación",
    );
};
