import {
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    fetchAuthSession,
    getCurrentUser,
    resetPassword,
    confirmResetPassword,
    signInWithRedirect,
    resendSignUpCode,
} from "aws-amplify/auth";

export const authService = {
    async login(email: string, password: string) {
        const cleanEmail = email.trim().toLowerCase();
        return await signIn({
            username: cleanEmail,
            password,
        });
    },

    async logout() {
        await signOut();
    },

    async getSession() {
        return await fetchAuthSession();
    },

    async getCurrentUser() {
        return await getCurrentUser();
    },

    async forgotPassword(email: string) {
        const cleanEmail = email.trim().toLowerCase();
        return resetPassword({
            username: cleanEmail,
        });
    },

    async confirmForgotPassword(email: string, code: string, password: string) {
        const cleanEmail = email.trim().toLowerCase();
        return confirmResetPassword({
            username: cleanEmail,
            confirmationCode: code.trim(),
            newPassword: password,
        });
    },

    async register(email: string, password: string, fullName: string) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = fullName.trim();

        let res;
        try {
            res = await signUp({
                username: cleanEmail,
                password,
                options: {
                    userAttributes: {
                        email: cleanEmail,
                        name: cleanName,
                    },
                },
            });
        } catch (error) {
            // If UserPool schema rejects 'name' attribute, retry with email only
            if (
                typeof error === "object" &&
                error !== null &&
                (error as { name?: string }).name === "InvalidParameterException" &&
                (error as { message?: string }).message?.includes("name")
            ) {
                res = await signUp({
                    username: cleanEmail,
                    password,
                    options: {
                        userAttributes: {
                            email: cleanEmail,
                        },
                    },
                });
            } else {
                throw error;
            }
        }
        console.log("[Cognito Register Success]:", res);
        return res;
    },

    async confirmRegister(email: string, code: string) {
        const cleanEmail = email.trim().toLowerCase();
        return await confirmSignUp({
            username: cleanEmail,
            confirmationCode: code.trim(),
        });
    },

    async resendCode(email: string) {
        const cleanEmail = email.trim().toLowerCase();
        const res = await resendSignUpCode({
            username: cleanEmail,
        });
        console.log("[Cognito ResendCode Success]:", res);
        return res;
    },

    async loginWithGoogle() {
        await signInWithRedirect({
            provider: "Google",
        });
    },
};