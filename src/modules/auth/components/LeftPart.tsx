export const LeftPart = ({ Body, title, focusTitle, subtitle }: { Body: React.ReactElement; title: string; subtitle: string; focusTitle: string }) => {
    return (
        <section className="relative hidden min-h-screen overflow-hidden border-r border-border bg-background lg:flex lg:w-1/2">

            <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:40px_40px]" />

            <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-[120px]" />

            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-white/5 blur-[120px]" />

            <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-20 xl:py-14 h-full">
                <div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="h-5 w-px bg-brand-accent" />
                            <span className="font-heading text-base font-semibold tracking-tight">
                                BFlow <span className="text-text-muted font-normal">studio</span>
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
                    <div className="flex items-center gap-6 text-sm text-text-muted mt-10">
                        <span>© 2026 BFlow studio</span>
                    </div>
                </div>
            </div>
        </section>
    )
} 