import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useResetPassword } from "./hooks/useResetPassword";

import { AuthCard } from "@/modules/auth/components/AuthCard";

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const email = params.get("email") ?? "";

    const { mutateAsync: resetPassword, isPending: isLoading } = useResetPassword();

    return (
        <AuthCard
            title={t("auth.resetTitle")}
            subtitle={t("auth.resetDescription")}
            back={{ to: "/auth/login", label: t("auth.backToLogin"), disabled: isLoading }}
        >
            <ResetPasswordForm
                isLoading={isLoading}
                onSubmit={async ({ code, password }) => {
                    await resetPassword({ email, code, password });
                }}
            />
        </AuthCard>
    );
};
