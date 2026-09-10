import type { CreateWalletData, UpdateWalletData, Wallet } from "./interfaces/Wallets";
import type {
    CreateWalletInvitationData,
    WalletInvitation,
} from "./interfaces/WalletInvitation";
import type { WalletSentInvitation } from "./interfaces/WalletSentInvitation";
import type { WalletCollaborator } from "./interfaces/WalletCollaborator";

import { APIError, apiRequest, type PaginatedListResponse, type ApiResponse } from "@/utils/api";
import { config } from "@/config/config";

const walletsUrl = `${config.API_BASE_URL}/api/v1/wallets`;
const invitationsUrl = `${config.API_BASE_URL}/api/v1/wallets/invitations`;

const defaultApiOptions: RequestInit = {
    headers: { "Content-Type": "application/json" },
};

export interface GetWalletsParams {
    scope: "MINE" | "SHARED";
    query?: string;
    page?: number;
    size?: number;
}

// --- /api/v1/wallets ---

export const getWallets = async ({
    scope,
    query,
    page = 0,
    size = 5,
}: GetWalletsParams) => {
    const params = new URLSearchParams({
        scope,
        page: String(page),
        size: String(size),
    });

    if (query?.trim()) {
        params.set("query", query.trim());
    }

    return await apiRequest<PaginatedListResponse<Wallet>>(
        `${walletsUrl}?${params.toString()}`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las billeteras",
    );
};

export const postWallet = async (walletData: CreateWalletData) => {
    return await apiRequest<Wallet>(
        walletsUrl,
        {
            ...defaultApiOptions,
            method: "POST",
            body: JSON.stringify(walletData),
        },
        "Error al crear la billetera",
    );
};

export const patchWallet = async (id: string, walletData: UpdateWalletData) => {
    return await apiRequest<Wallet>(
        `${walletsUrl}/${id}`,
        {
            ...defaultApiOptions,
            method: "PATCH",
            body: JSON.stringify(walletData),
        },
        "Error al actualizar la billetera",
    );
};

export const deleteWallet = async (id: string) => {
    return await apiRequest<unknown>(
        `${walletsUrl}/${id}`,
        { method: "DELETE" },
        "Error al eliminar la billetera",
    );
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

export const getSentWalletInvitations = async (walletId: string) => {
    return await apiRequest<ApiResponse<WalletSentInvitation[]>>(
        `${walletsUrl}/${walletId}/invitations/sent`,
        { ...defaultApiOptions, method: "GET" },
        "Error al obtener las invitaciones enviadas",
    );
};

// --- /api/v1/wallets/invitations ---

const emptyInvitationsResponse = (): ApiResponse<WalletInvitation[]> => ({
    success: true,
    message: "OK",
    data: [],
});

/**
 * Path asumido para invitaciones recibidas.
 * Si el endpoint aún no existe (404/501), la UI muestra lista vacía.
 */
export const getWalletInvitations = async (): Promise<
    ApiResponse<WalletInvitation[]>
> => {
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

export const cancelWalletInvitation = async (invitationId: string) => {
    return await apiRequest<ApiResponse<string>>(
        `${invitationsUrl}/${invitationId}`,
        { ...defaultApiOptions, method: "DELETE" },
        "Error al cancelar la invitación",
    );
};
