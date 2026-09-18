import { RegisterHero } from "./components/RegisterHero";
import { RegisterForm } from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister";

import { LeftPart } from "@/modules/auth/components/LeftPart";
import { RightPart } from "@/modules/auth/components/RightPart";

export const RegisterPage = () => {
    // Shared so RightPart can disable Google / back while register is pending
    const { mutateAsync: registerUser, isPending: isRegisterPending } =
        useRegister();

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                Body={<RegisterHero />}
                title="Comienza gratis, crece con"
                focusTitle="BFlow"
                subtitle="Crea tu cuenta en segundos y toma el control de tus finanzas desde el primer día. Sin tarjeta de crédito requerida."
            />
            <RightPart
                Body={
                    <RegisterForm
                        onRegisterUser={registerUser}
                        isLoading={isRegisterPending}
                    />
                }
                isLoading={isRegisterPending}
                separatorText="O completa el formulario"
                title="Crear cuenta"
                subtitle="Completa tus datos para empezar"
            />
        </main>
    );
};
