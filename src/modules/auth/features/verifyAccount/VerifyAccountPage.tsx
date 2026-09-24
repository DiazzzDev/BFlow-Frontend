import { useSearchParams } from "react-router";

import { VerifyAccountForm } from "./components/VerifyAccountForm";
import { VerifyAccountHero } from "./components/VerifyAccountHero";
import { useVerifyAccount, useResendCode } from "./hooks/useVerifyAccount";

import { LeftPart } from "@/modules/auth/components/LeftPart";
import { RightPart } from "@/modules/auth/components/RightPart";

export const VerifyAccountPage = () => {
    const [params] = useSearchParams();
    const initialEmail = params.get("email") ?? "";

    const { mutateAsync: onSubmit, isPending: isLoading } = useVerifyAccount();
    const { mutateAsync: onResendCode, isPending: isResending } = useResendCode();

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                Body={<VerifyAccountHero />}
                title="Verifica tu cuenta en"
                focusTitle="BFlow"
                subtitle="Ingresa el código enviado a tu correo electrónico para completar tu registro y activar tu cuenta."
            />
            <RightPart
                Body={
                    <VerifyAccountForm
                        initialEmail={initialEmail}
                        onSubmit={onSubmit}
                        onResendCode={onResendCode}
                        isLoading={isLoading}
                        isResending={isResending}
                    />
                }
                isLoading={isLoading || isResending}
                separatorText="O confirma con tu código"
                title="Verificar correo"
                subtitle="Ingresa el código de 6 dígitos para continuar"
            />
        </main>
    );
};
