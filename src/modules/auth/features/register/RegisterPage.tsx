import { useTranslation } from "react-i18next";

import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

import { AuthCard } from "@/modules/auth/components/AuthCard";
import { AuthDivider } from "@/modules/auth/components/AuthDivider";
import { AuthSwitchLink } from "@/modules/auth/components/AuthSwitchLink";
import { GoogleButton } from "@/modules/auth/components/GoogleButton";

export const RegisterPage = () => {
    const { t } = useTranslation();
    // Shared so Google and the login link are disabled while register is pending
    const { mutateAsync: registerUser, isPending: isRegisterPending } = useRegister();

    return (
        <AuthCard
            title={t("auth.registerTitle")}
            subtitle={t("auth.registerSubtitle")}
            back={{ to: "/auth/login", label: t("auth.backToLogin"), disabled: isRegisterPending }}
            footer={
                <AuthSwitchLink
                    text={t("auth.hasAccount")}
                    linkLabel={t("auth.signIn")}
                    to="/auth/login"
                    disabled={isRegisterPending}
                />
            }
        >
            <GoogleButton disabled={isRegisterPending} />
            <AuthDivider text={t("auth.registerSeparator")} />
            <RegisterForm onRegisterUser={registerUser} isLoading={isRegisterPending} />
        </AuthCard>
    );
};
