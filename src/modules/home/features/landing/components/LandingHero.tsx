import { Link } from "react-router";

interface LandingHeroProps {
    isChecking: boolean;
    isAuthenticated: boolean;
}

export const LandingHero = ({
    isChecking,
    isAuthenticated,
}: LandingHeroProps) => {
    return (
        <section className="relative px-8 md:px-16 xl:px-24 pt-28 md:pt-36 pb-28 md:pb-40 min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/6 blur-[140px]" />
            </div>

            {/* New badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Nuevo: billeteras compartidas y presupuestos inteligentes
            </div>

            <h1 className="max-w-4xl text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                El control financiero que siempre quisiste
            </h1>

            <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                Gestiona tus ingresos, gastos y billeteras compartidas en un
                solo lugar. Simple, potente y diseñado para tu día a día.
            </p>

            {/* Social proof */}
            <div className="mb-10 flex items-center gap-3 text-xs text-helper">
                <div className="flex -space-x-2">
                    {["F", "A", "M", "C"].map((initial) => (
                        <div
                            key={initial}
                            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-hard bg-surface text-[10px] font-semibold text-light"
                        >
                            {initial}
                        </div>
                    ))}
                </div>
                <span>
                    Más de{" "}
                    <span className="text-light font-medium">
                        1,000 usuarios
                    </span>{" "}
                    ya gestionan sus finanzas con BFlow
                </span>
            </div>

            {!isChecking && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {isAuthenticated ? (
                        <Link to="/app/dashboard">
                            <button
                                type="button"
                                className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            >
                                Ir al dashboard
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth/register">
                                <button
                                    type="button"
                                    className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                                >
                                    Empezar gratis
                                </button>
                            </Link>
                            <Link to="/auth/login">
                                <button
                                    type="button"
                                    className="border border-light-25 text-light text-sm font-medium px-7 py-3 rounded-xl hover:border-light hover:bg-light-10 transition-colors cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </section>
    );
};