import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useResetPassword } from "./hooks/useResetPassword";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { toast } from "sonner";

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const email = params.get("email");
    const planId = params.get("plan");
    const loginParams = new URLSearchParams();
    if (email) {
        loginParams.set("email", email);
    }
    if (planId) {
        loginParams.set("plan", planId);
    }
    const loginQuery = loginParams.toString();
    const loginPath = loginQuery ? `/auth/login?${loginQuery}` : "/auth/login";
    const { mutateAsync: resetPassword, isPending: isLoading } = useResetPassword();
    if (!email) {
        toast.error("No se proporcionó un correo electrónico para restablecer la contraseña.");
        void navigate("/auth/forgot-password");
        return null;
    }


    return (
        <AuthCard
            title={t("auth.resetTitle")}
            subtitle={t("auth.resetDescription")}
            back={{ to: loginPath, label: t("auth.backToLogin"), disabled: isLoading }}
        >
            <ResetPasswordForm
                isLoading={isLoading}
                onSubmit={async ({ code, password }) => {
                    await resetPassword({ email, code, password });
                }}
                onSuccess={() => {
                    void navigate(loginPath, { replace: true });
                }}
            />
        </AuthCard>
    );
};
