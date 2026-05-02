import { config } from "../../../../api/config.ts";
import { apiRequest, APIError } from "../../../../utils/api.ts";

const API_URL = `${config.API_BASE_URL}/auth`;

const defaultApiOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

interface LoginResponse {
    token?: string;
    resetId?: string;
}

interface UserMe {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export const login = async (email: string, password: string) => {
    try {
        const body = JSON.stringify({ email, password });
        return await apiRequest<LoginResponse>(
            `${API_URL}/login`,
            { ...defaultApiOptions, method: 'POST', body },
            'Error al iniciar sesión'
        );
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Error al iniciar sesión', 0, error, `${API_URL}/login`);
    }
};

export const getAuthMe = async () => {
    return await apiRequest<UserMe>(`${API_URL}/me`, {
        ...defaultApiOptions,
        method: 'GET'
    }, 'No se pudo obtener los datos de sesión');
};