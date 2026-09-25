import { authService } from "@/auth/services/authService";

export const forgotPassword = (email: string) =>
    authService.forgotPassword(email);

export const confirmForgotPasswordService = (
    email: string,
    code: string,
    password: string
) => authService.confirmForgotPassword(email, code, password);
