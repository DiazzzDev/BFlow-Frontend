import { useTranslation } from "react-i18next";

import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthDivider } from "@/modules/auth/components/AuthDivider";
import { AuthSwitchLink } from "@/modules/auth/components/AuthSwitchLink";
import { GoogleButton } from "@/modules/auth/components/GoogleButton";

export const LoginPage = () => {
    const { t } = useTranslation();
    // Shared so Google and the register link are disabled while email login is pending
    const { mutateAsync: loginWithEmail, isPending: isEmailLoginPending } = useLogin();

    return (
        <AuthCard
            title={t("auth.loginTitle")}
            subtitle={t("auth.loginSubtitle")}
            footer={
                <AuthSwitchLink
                    text={t("auth.noAccount")}
                    linkLabel={t("auth.createFree")}
                    to="/auth/register"
                    disabled={isEmailLoginPending}
                />
            }
        >
            <GoogleButton disabled={isEmailLoginPending} />
            <AuthDivider text={t("auth.loginSeparator")} />
            <LoginForm onSubmitLogin={loginWithEmail} isLoading={isEmailLoginPending} />
        </AuthCard>
    );
};
