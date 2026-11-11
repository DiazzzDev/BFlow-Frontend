import { fetchAuthSession } from "aws-amplify/auth";

import { getActiveLanguage } from "@/i18n/i18n";

export type { ApiResponse, PaginatedListResponse } from "./api.interfaces";

export class APIError extends Error {
    status: number;
    cause: unknown;
    endpoint: string | null;

    constructor(
        message: string,
        status: number = 500,
        cause: unknown = null,
        endpoint: string | null = null,
    ) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.cause = cause;
        this.endpoint = endpoint;
    }
}

async function getAmplifyToken(): Promise<string | undefined> {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.accessToken.toString();
    } catch {
        return undefined;
    }
}

export const apiRequest = async <T>(
    url: string,
    options: RequestInit = {},
    friendlyMessage: string = "Error de API",
    requiredPrivileges: string[] = [],
): Promise<T> => {
    if (requiredPrivileges.length > 0) {
        throw new APIError("No tienes permiso para esta acción.", 403, null, url);
    }

    try {
        const token = await getAmplifyToken();

        const response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                "Accept-Language": getActiveLanguage(),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        let data: unknown = null;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            let errorMessage = `${friendlyMessage}. Código: ${response.status}`;

            if (data !== null && typeof data === "object") {
                const dataObj = data as Record<string, unknown>;
                if (Array.isArray(dataObj.errors)) {
                    const validationMessages = dataObj.errors
                        .filter(
                            (validationError): validationError is Record<string, unknown> =>
                                typeof validationError === "object" && validationError !== null,
                        )
                        .map((validationError) => validationError.message)
                        .filter((message): message is string => typeof message === "string" && message.trim().length > 0);

                    errorMessage =
                        (typeof dataObj.message === "string" && dataObj.message.trim())
                            ? dataObj.message
                            : validationMessages.join(". ") || "Errores de validación";
                } else if (dataObj.message || dataObj.error) {
                    errorMessage =
                        (dataObj.message as string) || (dataObj.error as string);
                }
            } else if (typeof data === "string" && data.trim()) {
                errorMessage = data.trim();
            }

            throw new APIError(errorMessage, response.status, data, url);
        }

        return data as T;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        const isNetworkError =
            error instanceof TypeError ||
            /network|failed/i.test((error as Error).message || "");

        const errorMessage = isNetworkError
            ? `${friendlyMessage}. El servicio no está disponible.`
            : `${friendlyMessage}. ${(error as Error).message || "Error inesperado."}`;

        throw new APIError(errorMessage, isNetworkError ? 0 : 500, error, url);
    }
};
