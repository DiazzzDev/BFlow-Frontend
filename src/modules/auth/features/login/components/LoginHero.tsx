export const LoginHero = () => {
    return (
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
    )
}