//import { useLoginActions } from "../hooks/useLoginActions.ts";
import { LoginHero } from "../components/LoginHero.tsx";
import { LoginForm } from "../components/LoginForm.tsx";
import { useLoginActions } from "../../../../../auth/hooks/useLoginActions.ts";

import { RightPart } from "@/modules/auth/components/RightPart.tsx";
import { LeftPart } from "@/modules/auth/components/LeftPart.tsx";


export const LoginPage = () => {

	const { onSubmitLogin, isLoading, } = useLoginActions();

	return (
		<main className='w-full h-screen flex gap-4'>
			<LeftPart Body={<LoginHero  />} title="Tu dinero bajo tu" focusTitle="control total" subtitle="Gestiona ingresos, gastos y billeteras compartidas desde un solo lugar. Simple, seguro y diseñado para tu día a día." />
			<RightPart Body={<LoginForm onSubmitLogin={onSubmitLogin} isLoading={isLoading} />} isLoading={false} separatorText="O inicia sesión con tu email" title="Bienvenido de vuelta" subtitle="Ingresa tus credenciales para continuar" />
		</main>
	)
}
