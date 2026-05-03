import { useLoginActions } from "../hooks/useLoginActions.ts";
import { LoginHero } from "../components/LoginHero.tsx";
import { LoginForm } from "../components/LoginForm.tsx";

export const LoginPage = () => {
	const { onSubmitLogin, isLoading } = useLoginActions();

	return (
		<main className='w-full h-screen flex gap-4'>
			<LoginHero />
			<LoginForm onSubmitLogin={onSubmitLogin} isLoading={isLoading} />	
		</main>
	)
}
