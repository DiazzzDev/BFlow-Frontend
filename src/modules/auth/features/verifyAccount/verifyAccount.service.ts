import { authService } from "@/auth/services/authService";
import { resolveSession } from "@/auth/services/session.service";

interface VerifyAccountArgs {
    email: string;
    code: string;
}

export const verifyAccount = async ({ email, code }: VerifyAccountArgs) => {
    await authService.confirmRegister(email, code);
    const user = await resolveSession();

    if (!user) {
        throw new Error("No se pudo iniciar la sesión después de verificar la cuenta.");
    }

    return user;
};

export const resendVerificationCode = (email: string) =>
    authService.resendCode(email);
