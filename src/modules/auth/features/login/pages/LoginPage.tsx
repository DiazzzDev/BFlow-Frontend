import { ArrowLeft, Eye, Mail, Lock } from "lucide-react";
import React from "react";

import { useLoginActions } from "../hooks/useLoginActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const LoginPage = () => {
	const { onSubmitLogin, isLoading } = useLoginActions();
	const emailRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	return (
		<main className='w-full h-screen flex gap-4'>
			<section className="relative hidden min-h-screen overflow-hidden border-r border-border bg-background lg:flex lg:w-1/2">
				<div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:40px_40px]" />
				<div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />
				<div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-[120px]" />
				<div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />

				<div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-20 xl:py-14">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-accent text-lg font-bold text-white shadow-lg shadow-orange-500/20">B</div>

							<div>
								<h2 className="font-heading text-xl font-semibold tracking-tight">
									BFlow
								</h2>
							</div>
						</div>

						<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
							<span className="h-2 w-2 rounded-full bg-brand-accent" />
							<span className="text-sm text-text-primary">
								Categorización inteligente con IA
							</span>
						</div>

						<div className="max-w-xl space-y-6">
							<h1 className="font-heading text-3xl font-semibold leading-tight xl:text-5xl">
								Tu dinero bajo tu {" "}
								<br />
								<span className="text-brand-accent">control total</span>
							</h1>

							<p className="max-w-lg text-lg leading-relaxed text-text-muted">
								Gestioná ingresos, gastos y billeteras compartidas desde un solo lugar. Simple, seguro y diseñado para tu día a día.
							</p>
						</div>

						<div className="max-w-xl space-y-10">
							<div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-xl">
								<div className="mb-5 flex items-center gap-2">
									<span className="h-2.5 w-2.5 rounded-full bg-red-400" />
									<span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
									<span className="h-2.5 w-2.5 rounded-full bg-green-400" />
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div className="rounded-2xl border border-white/8 bg-black/10 p-4">
										<p className="text-xs uppercase tracking-wide text-text-muted">
											Balance
										</p>
										<h4 className="mt-2 text-2xl font-semibold">$65,660</h4>
									</div>

									<div className="rounded-2xl border border-white/8 bg-black/10 p-4">
										<p className="text-xs uppercase tracking-wide text-text-muted">
											Billeteras
										</p>
										<h4 className="mt-2 text-2xl font-semibold">5</h4>
									</div>

									<div className="rounded-2xl border border-white/8 bg-black/10 p-4">
										<p className="text-xs uppercase tracking-wide text-text-muted">
											Gasto mes
										</p>
										<h4 className="mt-2 text-2xl font-semibold text-red-400">
											-$8,620
										</h4>
									</div>
								</div>

								<div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-4">
									<div className="mb-3 flex items-center justify-between text-sm">
										<span className="text-text-muted">
											Corporate Ops — gasto mensual
										</span>
										<span className="font-medium text-text-primary">70%</span>
									</div>

									<div className="h-2 overflow-hidden rounded-full bg-white/8">
										<div className="h-full w-[70%] rounded-full bg-gradient-to-r from-red-500 to-red-400" />
									</div>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-6">
								<div className="border-l border-white/10 pl-5">
									<h4 className="text-4xl font-semibold text-brand-accent">10K+</h4>
									<p className="mt-1 text-base text-text-muted">
										Usuarios activos
									</p>
								</div>

								<div className="border-l border-white/10 pl-5">
									<h4 className="text-4xl font-semibold text-brand-accent">$2M+</h4>
									<p className="mt-1 text-base text-text-muted">
										Gestionados/mes
									</p>
								</div>

								<div className="border-l border-white/10 pl-5">
									<h4 className="text-4xl font-semibold text-brand-accent">4.9★</h4>
									<p className="mt-1 text-base text-text-muted">
										Valoración
									</p>
								</div>
							</div>

							<div className="flex items-center gap-6 text-sm text-text-muted">
								<span>© 2025 BFlow</span>
								<span>Privacidad</span>
								<span>Términos</span>
							</div>
						</div>
					</div>
				</div>
			</section>
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
		</main>
	)
}
