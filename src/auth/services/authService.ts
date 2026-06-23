import {
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    fetchAuthSession,
    getCurrentUser,
    resetPassword,
    confirmResetPassword
} from "aws-amplify/auth";

export const authService = {

    async login(
        email: string,
        password: string
    ) {
        return await signIn({
            username: email,
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

    async forgotPassword(
        email: string
    ) {
        return resetPassword({
            username: email
        });
    },

    async confirmForgotPassword(
        email: string,
        code: string,
        password: string
    ) {

        return confirmResetPassword({
            username: email,
            confirmationCode: code,
            newPassword: password
        });
    },

    async register(
        email: string,
        password: string,
        fullName: string
    ) {

        return await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    email,
                    name: fullName,
                },
            },
        });
    },

    async confirmRegister(
        email: string,
        code: string
    ) {

        return await confirmSignUp({

            username: email,

            confirmationCode: code,
        });
    },
};