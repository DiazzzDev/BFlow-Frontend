export const LeftPart = ({ Body, title, focusTitle, subtitle }: { Body: React.ReactElement; title: string; subtitle: string; focusTitle: string }) => {
    return (
        <section className="relative hidden min-h-screen overflow-hidden border-r border-border bg-background lg:flex lg:w-1/2">
            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />
            <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-[120px]" />
            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />

            <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-20 xl:py-14 h-full">
                <div>
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
                                {title} {" "}
                                <br />
                                <span className="text-brand-accent">{focusTitle}</span>
                            </h1>

                            <p className="max-w-lg text-lg leading-relaxed text-text-muted">
                                {subtitle}
                            </p>
                        </div>

                        {Body}
                    </div>
                </div>
                <div>
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

                    <div className="flex items-center gap-6 text-sm text-text-muted mt-10">
                        <span>© 2026 BFlow</span>
                        <span>Privacidad</span>
                        <span>Términos</span>
                    </div>
                </div>
            </div>
        </section>
    )
}