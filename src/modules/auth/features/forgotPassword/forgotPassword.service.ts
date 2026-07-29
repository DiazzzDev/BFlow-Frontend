import { authService } from "@/auth/services/authService";

export const forgotPassword = (email: string) =>
    authService.forgotPassword(email);
