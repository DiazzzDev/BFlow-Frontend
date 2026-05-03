import { config } from "../../api/config.ts";
import { apiRequest, APIError } from "../../utils/api.ts";

import { AuthMeResponse } from "./auth.ts";

const API_URL = `${config.API_BASE_URL}/auth`;

const defaultApiOptions: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
};

export const getAuthMe = async () => {
    try {
        return await apiRequest<AuthMeResponse>(
            `${API_URL}/me`,
            { ...defaultApiOptions, method: 'GET' },
            'Error al obtener los datos de sesión'
        );
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        throw new APIError('Error al obtener los datos de la sesión', 0, error, `${API_URL}/me`);
    }
};

export const logout = async () => {
    try {
        return await apiRequest(
            `${API_URL}/logout`,
            { ...defaultApiOptions, method: 'POST' },
            'Error al cerrar sesión'
        );
    } catch (error) {
        console.warn('Logout endpoint not available, clearing local state only', error);
    }
};