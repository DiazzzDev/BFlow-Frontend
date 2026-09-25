import type { ReactElement } from "react";

interface LeftPartProps {
    Body: ReactElement;
    title: string;
    focusTitle: string;
    subtitle: string;
}

export const LeftPart = ({ Body, title, focusTitle, subtitle }: LeftPartProps) => {
    return (
        <section className="relative hidden min-h-screen overflow-hidden border-r border-light-10 bg-surface-hard lg:flex lg:w-1/2">

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:44px_44px]" />

            {/* Glow top-left */}
            <div className="absolute -left-10 top-10 h-80 w-80 rounded-full bg-primary/20 blur-[130px]" />

            {/* Glow bottom-right */}
            <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-primary/10 blur-[140px]" />

            {/* Glow center subtle */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-light-5 blur-[100px]" />

            <div className="relative z-10 flex w-full flex-col justify-between px-12 py-10 xl:px-20 xl:py-14 h-full">
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-10">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="font-heading text-base font-semibold tracking-tight">
                            BFlow <span className="text-helper font-normal">studio</span>
                        </span>
                    </div>

                    <div className="max-w-xl space-y-6">
                        <h1 className="font-heading text-3xl font-semibold leading-tight xl:text-5xl">
                            {title}{" "}
                            <br />
                            <span className="text-primary">{focusTitle}</span>
                        </h1>

                        <p className="max-w-lg text-lg leading-relaxed text-helper">
                            {subtitle}
                        </p>
                    </div>

                    <div className="mt-10">
                        {Body}
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-6 text-sm text-helper mt-10">
                        <span>© 2026 BFlow studio</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
