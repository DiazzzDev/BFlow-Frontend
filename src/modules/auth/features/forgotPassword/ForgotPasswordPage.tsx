import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { useForgotPassword } from "./hooks/useForgotPassword";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthSwitchLink } from "@/modules/auth/components/AuthSwitchLink";

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const planId = searchParams.get("plan");
    const loginParams = new URLSearchParams();
    const email = searchParams.get("email");
    if (email) {
        loginParams.set("email", email);
    }
    if (planId) {
        loginParams.set("plan", planId);
    }
    const loginQuery = loginParams.toString();
    const loginPath = loginQuery ? `/auth/login?${loginQuery}` : "/auth/login";
    const { mutateAsync: onSubmit, isPending: isLoading } = useForgotPassword();

    return (
        <AuthCard
            title={t("auth.forgotTitle")}
            subtitle={t("auth.forgotDescription")}
            back={{ to: loginPath, label: t("auth.backToLogin"), disabled: isLoading }}
            footer={
                <AuthSwitchLink
                    text={t("auth.rememberPassword")}
                    linkLabel={t("auth.signIn")}
                    to={loginPath}
                    disabled={isLoading}
                />
            }
        >
            <ForgotPasswordForm onSubmit={onSubmit} isLoading={isLoading} />
        </AuthCard>
    );
};
