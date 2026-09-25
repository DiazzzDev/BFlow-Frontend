import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import {
    useForgotPassword,
    useConfirmForgotPassword,
} from "./hooks/useForgotPassword";

import { LeftPart } from "@/modules/auth/components/LeftPart";
import { RightPart } from "@/modules/auth/components/RightPart";

export const ForgotPasswordPage = () => {
    const { mutateAsync: requestCode, isPending: isRequestingCode } =
        useForgotPassword();
    const { mutateAsync: confirmReset, isPending: isConfirming } =
        useConfirmForgotPassword();

    const isAnyLoading = isRequestingCode || isConfirming;

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                title="Recupera el acceso a"
                focusTitle="tu cuenta"
                subtitle="Ingresa tu correo registrado, recibirás un código para crear una nueva contraseña de forma segura."
                Body={<div />}
            />
            <RightPart
                isLoading={isAnyLoading}
                showGoogleAuth={false}
                separatorText=""
                title="Recuperar contraseña"
                subtitle="Te enviaremos un código de verificación a tu correo"
                Body={
                    <ForgotPasswordForm
                        onRequestCode={(email) => requestCode(email)}
                        onConfirmReset={confirmReset}
                        isRequestingCode={isRequestingCode}
                        isConfirming={isConfirming}
                    />
                }
            />
        </main>
    );
};
