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
        <section className="px-8 md:px-16 xl:px-24 pt-28 md:pt-36 pb-28 md:pb-40 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <h1 className="max-w-3xl text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                El dinero de tu día a día, en un solo lugar.
            </h1>

            <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                BFlow conecta tus ingresos, gastos y billeteras compartidas en
                una sola vista, sin hojas de cálculo ni apps sueltas.
            </p>

            <p className="mb-10 text-xs text-helper">
                Más de <span className="text-light font-medium">1,000 personas</span> ya usan BFlow.
            </p>

            {!isChecking && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {isAuthenticated ? (
                        <Link to="/app/dashboard">
                            <button
                                type="button"
                                className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                            >
                                Ir al dashboard
                            </button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth/register">
                                <button
                                    type="button"
                                    className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
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