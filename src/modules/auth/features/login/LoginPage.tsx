import { LoginHero } from "./components/LoginHero";
import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

import { RightPart } from "@/modules/auth/components/RightPart";
import { LeftPart } from "@/modules/auth/components/LeftPart";

export const LoginPage = () => {
    const { mutateAsync: onSubmitLogin, isPending } = useLogin();

    return (
        <main className="w-full h-screen flex gap-4">
            <LeftPart
                Body={<LoginHero />}
                title="Tu dinero bajo tu"
                focusTitle="control total"
                subtitle="Gestiona ingresos, gastos y billeteras compartidas desde un solo lugar. Simple, seguro y diseñado para tu día a día."
            />
            <RightPart
                Body={<LoginForm onSubmitLogin={onSubmitLogin} isLoading={isPending} />}
                isLoading={false}
                separatorText="O inicia sesión con tu email"
                title="Bienvenido de vuelta"
                subtitle="Ingresa tus credenciales para continuar"
            />
        </main>
    );
};
