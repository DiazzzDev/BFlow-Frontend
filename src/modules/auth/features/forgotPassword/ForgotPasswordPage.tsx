import { useTranslation } from "react-i18next";

import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { useForgotPassword } from "./hooks/useForgotPassword";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthSwitchLink } from "@/modules/auth/components/AuthSwitchLink";

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const { mutateAsync: onSubmit, isPending: isLoading } = useForgotPassword();

    return (
        <AuthCard
            title={t("auth.forgotTitle")}
            subtitle={t("auth.forgotDescription")}
            back={{ to: "/auth/login", label: t("auth.backToLogin"), disabled: isLoading }}
            footer={
                <AuthSwitchLink
                    text={t("auth.rememberPassword")}
                    linkLabel={t("auth.signIn")}
                    to="/auth/login"
                    disabled={isLoading}
                />
            }
        >
            <ForgotPasswordForm onSubmit={onSubmit} isLoading={isLoading} />
        </AuthCard>
    );
};
