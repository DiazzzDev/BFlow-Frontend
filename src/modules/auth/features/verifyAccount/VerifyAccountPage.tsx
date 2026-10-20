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
            back={{ to: "/auth/login", label: t("auth.backToLogin"), disabled: isBusy }}
            footer={
                <AuthSwitchLink
                    text={t("auth.verifyWrongEmail")}
                    linkLabel={t("auth.registerAgain")}
                    to="/auth/register"
                    disabled={isBusy}
                />
            }
        >
            <VerifyAccountForm
                email={email}
                onSubmit={onSubmit}
                onResendCode={onResendCode}
                isLoading={isLoading}
                isResending={isResending}
            />
        </AuthCard>
    );
};
