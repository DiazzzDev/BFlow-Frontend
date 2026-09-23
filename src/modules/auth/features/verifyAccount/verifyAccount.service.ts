import { authService } from "@/auth/services/authService";

interface VerifyAccountArgs {
    email: string;
    code: string;
}

export const verifyAccount = ({ email, code }: VerifyAccountArgs) =>
    authService.confirmRegister(email, code);

export const resendVerificationCode = (email: string) =>
    authService.resendCode(email);
