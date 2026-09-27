import { RegisterHero } from "./components/RegisterHero";
import { useTranslation } from "react-i18next";
import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

import { LeftPart } from "@/modules/auth/components/LeftPart";
import { RightPart } from "@/modules/auth/components/RightPart";

export const RegisterPage = () => {
    const { t } = useTranslation();
    // Shared so RightPart can disable Google / back while register is pending
    const { mutateAsync: registerUser, isPending: isRegisterPending } =
        useRegister();

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                Body={<RegisterHero />}
                title={t("auth.registerHeroTitle")}
                focusTitle="BFlow"
                subtitle={t("auth.registerHeroSubtitle")}
            />
            <RightPart
                Body={
                    <RegisterForm
                        onRegisterUser={registerUser}
                        isLoading={isRegisterPending}
                    />
                }
                isLoading={isRegisterPending}
                separatorText={t("auth.registerSeparator")}
                title={t("auth.registerTitle")}
                subtitle={t("auth.registerSubtitle")}
            />
        </main>
    );
};
