import { authService } from "@/auth/services/authService";

interface ResetPasswordArgs {
    email: string;
    code: string;
    password: string;
}

export const resetPassword = ({ email, code, password }: ResetPasswordArgs) =>
    authService.confirmForgotPassword(email, code, password);
