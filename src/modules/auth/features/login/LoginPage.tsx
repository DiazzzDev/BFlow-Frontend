import { LoginHero } from "./components/LoginHero";
import { useTranslation } from "react-i18next";
import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

import { RightPart } from "@/modules/auth/components/RightPart";
import { LeftPart } from "@/modules/auth/components/LeftPart";

export const LoginPage = () => {
    const { t } = useTranslation();
    // Shared so RightPart can disable Google / back while email login is pending
    const { mutateAsync: loginWithEmail, isPending: isEmailLoginPending } = useLogin();

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                Body={<LoginHero />}
                title={t("auth.loginHeroTitle")}
                focusTitle={t("auth.loginHeroFocus")}
                subtitle={t("auth.loginHeroSubtitle")}
            />
            <RightPart
                Body={
                    <LoginForm
                        onSubmitLogin={loginWithEmail}
                        isLoading={isEmailLoginPending}
                    />
                }
                isLoading={isEmailLoginPending}
                separatorText={t("auth.loginSeparator")}
                title={t("auth.loginTitle")}
                subtitle={t("auth.loginSubtitle")}
            />
        </main>
    );
};
