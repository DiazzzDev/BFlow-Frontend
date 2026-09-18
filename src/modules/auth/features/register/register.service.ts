import { authService } from "@/auth/services/authService";

interface RegisterArgs {
    email: string;
    password: string;
    fullName: string;
}

// Create Cognito user with email + name attributes
export const register = ({ email, password, fullName }: RegisterArgs) =>
    authService.register(email, password, fullName);
