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
            <h1 className="max-w-4xl text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                El control financiero que{" "}
                <span className="text-primary">siempre quisiste</span>
            </h1>

            <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                Gestiona tus ingresos, gastos y billeteras compartidas en un
                solo lugar. Simple, potente y diseñado para tu día a día.
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
                            <Link to="/auth/login">
                                <button
                                    type="button"
                                    className="border border-light-25 text-light text-sm font-medium px-7 py-3 rounded-xl hover:border-light hover:bg-light-10 transition-colors cursor-pointer"
                                >
                                    Iniciar sesión
                                </button>
                            </Link>
                            <Link to="/auth/register">
                                <button
                                    type="button"
                                    className="bg-primary text-light text-sm font-medium px-7 py-3 rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
                                >
                                    Registrarse
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </section>
    );
};
