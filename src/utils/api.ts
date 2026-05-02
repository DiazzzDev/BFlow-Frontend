
export class APIError extends Error {
    status: number;
    cause: unknown;
    endpoint: string | null;

    constructor(
        message: string,
        status: number = 500,
        cause: unknown = null,
        endpoint: string | null = null
    ) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.cause = cause;
        this.endpoint = endpoint;
    }
}

export interface PaginatedListResponse<T> {
    success: boolean,
    message: string,
    data: {
        totalElements: bigint,
        totalPages: number,
        numberOfElements: number,
        pageable: {
            unpaged: boolean,
            pageNumber: number,
            paged: boolean,
            pageSize: number,
            offset: bigint,
            sort: {
                unsorted: boolean,
                sorted: boolean,
                empty: boolean
            }
        },
        size: number,
        content: T[],
        number: number,
        sort: {
            unsorted: boolean,
            sorted: boolean,
            empty: boolean
        },
        first: boolean,
        last: boolean,
        empty: boolean
    },
    timestamp: string,
    path: string
}

export const apiRequest = async <T>(
    url: string,
    options: RequestInit = {},
    friendlyMessage: string = 'Error de API',
    requiredPrivileges: string[] = []
): Promise<T> => {

    if (requiredPrivileges.length > 0) {
        throw new APIError('No tienes permiso para esta acción.', 403, null, url);
    }

    try {
        const response = await fetch(url, options);
        let data: unknown = null;

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            let errorMessage = `${friendlyMessage}. Código: ${response.status}`;

            if (data && typeof data === 'object' && data !== null) {
                // Manejo de errores de Spring Boot (DTO errors)
                const dataObj = data as Record<string, unknown>;
                if (dataObj.errors && typeof dataObj.errors === 'object') {
                    // Tipamos Object.values como string[] para poder usar .join
                    const errorsObj = dataObj.errors as Record<string, string>;
                    const validationErrors = Object.values(errorsObj).join('. ');
                    errorMessage = validationErrors || (dataObj.message as string) || 'Errores de validación';
                } else if (dataObj.message || dataObj.error) {
                    errorMessage = (dataObj.message as string) || (dataObj.error as string);
                }
            } else if (typeof data === 'string' && data.trim()) {
                errorMessage = data.trim();
            }

            throw new APIError(errorMessage, response.status, null, url);
        }

        return data as T; // "Casteamos" el resultado al tipo esperado
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        const isNetworkError = error instanceof TypeError || /network|failed/i.test((error as Error)?.message || '');
        const errorMessage = isNetworkError
            ? `${friendlyMessage}. El servicio no está disponible.`
            : `${friendlyMessage}. ${(error as Error)?.message || 'Error inesperado.'}`;

        throw new APIError(errorMessage, isNetworkError ? 0 : 500, error, url);
    }
};