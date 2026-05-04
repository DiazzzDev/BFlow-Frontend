import { RegisterHero } from "../components/RegisterHero"
import { RegisterForm } from "../components/RegisterForm"
import { useRegisterActions } from "../hooks/useRegisterActions"

import { LeftPart } from "@/modules/auth/components/LeftPart"
import { RightPart } from "@/modules/auth/components/RightPart"


export const RegisterPage = () => {
    const { onRegisterUser, isLoading } = useRegisterActions();
    return (
        <main className='w-full h-screen flex gap-4'> 
            <LeftPart Body={<RegisterHero />} title="Empezá gratis, crecé con" focusTitle="BFlow" subtitle="Creá tu cuenta en segundos y tomá el control de tus finanzas desde el primer día. Sin tarjeta de crédito requerida." />
            <RightPart Body={<RegisterForm onRegisterUser={onRegisterUser} isLoading={isLoading} />} isLoading={isLoading} separatorText="O completa el formulario" title="Crear cuenta" subtitle="Completá tus datos para empezar" />
        </main>
    )
}   