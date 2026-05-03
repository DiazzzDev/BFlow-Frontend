import React from "react"
import { ArrowLeft, Eye, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export const LoginForm = ({onSubmitLogin, isLoading}: {onSubmitLogin: (email: string, password: string) => void, isLoading: boolean}) => {
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    return (
        <section className="flex flex-1 items-center justify-center bg-background px-6 py-10 lg:px-14">
            <div className="w-full max-w-md">
                <button className="mb-10 flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary">
                    <ArrowLeft size={16} />
                    Volver al inicio
                </button>

                <div className="space-y-2">
                    <h2 className="text-4xl font-semibold tracking-tight">
                        Bienvenido de vuelta
                    </h2>
                    <p className="text-base text-text-muted">
                        Ingresá tus credenciales para continuar
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <Button variant="outline" className="h-12 w-full rounded-xl border-border bg-bg-card text-text-primary hover:bg-bg-hover hover:text-text-primary" disabled={isLoading}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </Button>

                    <div className="relative">
                        <Separator className="bg-border" />
                        <span className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-text-muted">
                            o iniciá sesión con tu email
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-label" htmlFor="txtEmail">
                            Correo electrónico
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                            />
                            <Input
                                disabled={isLoading}
                                ref={emailRef}
                                id="txtEmail"
                                placeholder="tu@correo.com"
                                className="h-12 rounded-xl border-border bg-bg-card pl-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-text-label" htmlFor="txtPassword">
                                Contraseña
                            </label>

                            <button className="text-sm font-medium text-brand-accent hover:opacity-80" disabled={isLoading}>
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                            />

                            <Input
                                disabled={isLoading}
                                ref={passwordRef}
                                id="txtPassword"
                                type="password"
                                placeholder="••••••••••"
                                className="h-12 rounded-xl border-border bg-bg-card px-11 text-text-primary placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand-accent"
                            />

                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                                <Eye size={18} />
                            </button>
                        </div>
                    </div>

                    <Button className="h-12 w-full rounded-xl font-medium text-white hover:brightness-110" onClick={() => onSubmitLogin(emailRef.current?.value || '', passwordRef.current?.value || '')} disabled={isLoading}>
                        Iniciar sesión →
                    </Button>
                </div>

                <p className="mt-8 text-center text-sm text-text-muted">
                    ¿No tenés cuenta?{" "}
                    <button className="font-medium text-brand-accent hover:opacity-80" disabled={isLoading}>
                        Creá una gratis
                    </button>
                </p>
            </div>
        </section>
    )
}