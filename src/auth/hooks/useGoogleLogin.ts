import { authService } from "../services/authService";

export const useGoogleLogin = () => {

    const loginWithGoogle = async () => {
        await authService.loginWithGoogle();
    };

    return {
        loginWithGoogle,
    };
};