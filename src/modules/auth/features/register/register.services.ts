import { config } from "../../../../api/config.ts";
import { apiRequest, APIError } from "../../../../utils/api.ts";

const API_URL = `${config.API_BASE_URL}/api/auth`;

const defaultApiOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' }
};

interface RegisterResponse {
    success: boolean,
    message: string,
    timestamp: string,
    path: string
}

export const register = async (email: string, password: string, fullName: string) => {
    try {
        const body = JSON.stringify({ email, password, fullName });
        return await apiRequest<RegisterResponse>(
            `${API_URL}/register`,
            { ...defaultApiOptions, method: 'POST', body },
            'Error crear cuenta'
        );
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Error crear cuenta', 0, error, `${API_URL}/register`);
    }
};