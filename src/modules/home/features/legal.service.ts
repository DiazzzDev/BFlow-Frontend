import { config } from "../../../api/config.ts";
import { apiRequest } from "../../../utils/api.ts";

const API_URL = `${config.API_BASE_URL}/api/v1/legal`;

const defaultApiOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' }
};

interface RegisterResponse {
    success: boolean,
    message: string,
    timestamp: string,
    path: string
}

export const getDocument = async (documentType: string) => {
    return await apiRequest<RegisterResponse>(
        `${API_URL}/${documentType}`,
        { ...defaultApiOptions, method: 'GET' },
        'Error al obtener el documento'
    );
};