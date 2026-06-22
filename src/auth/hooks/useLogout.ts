import { useAuthStore } from "../store/authStore";

const CLIENT_ID = "ijaq5ej2a05pjerccifrrscaa";
const COGNITO_DOMAIN = "https://us-east-1m6tn3h360.auth.us-east-1.amazoncognito.com";

export const useLogout = () => {

    const logout = () => {

        // limpiar usuario interno persistido
        useAuthStore
            .getState()
            .clearUser();

        localStorage.clear();
        sessionStorage.clear();    

        const logoutUrl =
            `${COGNITO_DOMAIN}/logout` +
            `?client_id=${CLIENT_ID}` +
            `&logout_uri=${encodeURIComponent(
                `${window.location.origin}/auth/login`
            )}`;

        window.location.assign(logoutUrl);
    };

    return {
        logout
    };

};