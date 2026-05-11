import { config } from "../../../../api/config.ts";
import { apiRequest, APIError } from "../../../../utils/api.ts";

const API_URL = `${config.API_BASE_URL}/api/auth`;

const defaultApiOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' }
};

export const login = async (email: string, password: string) => {
    try {
        const body = JSON.stringify({ email, password });
        return await apiRequest(
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