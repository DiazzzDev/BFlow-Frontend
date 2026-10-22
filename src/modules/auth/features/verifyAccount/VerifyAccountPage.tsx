import { Navigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";

import { VerifyAccountForm } from "./components/VerifyAccountForm";
import { useVerifyAccount, useResendCode } from "./hooks/useVerifyAccount";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthSwitchLink } from "@/modules/auth/components/AuthSwitchLink";

export const VerifyAccountPage = () => {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const email = params.get("email")?.trim().toLowerCase() ?? "";
    const planId = params.get("plan");
    const loginPath = planId
        ? `/auth/login?plan=${encodeURIComponent(planId)}`
        : "/auth/login";
    const registerPath = planId
        ? `/auth/register?plan=${encodeURIComponent(planId)}`
        : "/auth/register";

    const { mutateAsync: onSubmit, isPending: isLoading } = useVerifyAccount();
    const { mutateAsync: onResendCode, isPending: isResending } = useResendCode();
    const isBusy = isLoading || isResending;

    // Only reachable from register or an unconfirmed login, both of which pass the email
    if (!email) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <AuthCard
            title={t("auth.verifyTitle")}
            subtitle={
                <>
                    {t("auth.verifyDescription")}
                    <span className="mt-1 block break-all font-semibold text-light">{email}</span>
                </>
            }
            back={{ to: loginPath, label: t("auth.backToLogin"), disabled: isBusy }}
            footer={
                <AuthSwitchLink
                    text={t("auth.verifyWrongEmail")}
                    linkLabel={t("auth.registerAgain")}
                    to={registerPath}
                    disabled={isBusy}
                />
            }
        >
            <VerifyAccountForm
                email={email}
                planId={planId}
                onSubmit={onSubmit}
                onResendCode={onResendCode}
                isLoading={isLoading}
                isResending={isResending}
            />
        </AuthCard>
    );
};
