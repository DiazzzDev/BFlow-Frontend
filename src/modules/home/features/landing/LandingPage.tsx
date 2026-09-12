import { Link } from "react-router";

import { StepCard } from "./components/StepCard";
import { StepPreview } from "./components/StepPreview";
import { PricingCard } from "./components/PricingCard";
import { FaqItem } from "./components/FaqItem";
import { useLandingPage } from "./hooks/useLandingPage";
import {
    LANDING_FAQS,
    LANDING_PLANS,
    LANDING_STEPS,
} from "./utils/landingContent";

const GitHubFab = () => (
    <a
        href="https://github.com/DiazzzDev/BFlow-Financial-Engine"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-light-10 bg-surface text-light shadow-lg hover:border-light-25 hover:bg-surface-hard transition-colors"
    >
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12 24 5.37 18.627 0 12 0z" />
        </svg>
    </a>
);

export const LandingPage = () => {
    const page = useLandingPage();

    return (
        <>
            <GitHubFab />

            <section className="px-8 md:px-16 xl:px-24 pt-28 md:pt-36 pb-28 md:pb-40 min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h1 className="max-w-4xl text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                    El control financiero que{" "}
                    <span className="text-primary">siempre quisiste</span>
                </h1>

                <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                    Gestiona tus ingresos, gastos y billeteras compartidas en un
                    solo lugar. Simple, potente y diseñado para tu día a día.
                </p>

                {!page.isChecking && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {page.isAuthenticated ? (
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

            <section id="how" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-16 max-w-xl leading-tight">
                    Tres pasos para la paz financiera
                </h2>

                <div
                    id="features"
                    className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 lg:gap-10 items-stretch"
                    onMouseEnter={() => page.setPaused(true)}
                    onMouseLeave={() => page.setPaused(false)}
                >
                    <div className="relative flex flex-col gap-4">
                        <div className="pointer-events-none absolute left-0 top-6 bottom-6 hidden w-px bg-light-10 sm:block" />

                        {LANDING_STEPS.map((step, index) => (
                            <div key={step.number} className="relative sm:pl-8">
                                <span
                                    className={`absolute left-0 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 sm:block ${page.activeStep === index
                                            ? "bg-light"
                                            : "bg-helper"
                                        }`}
                                />
                                <StepCard
                                    number={step.number}
                                    title={step.title}
                                    desc={step.desc}
                                    active={page.activeStep === index}
                                    onSelect={() => page.selectStep(index)}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        id="dashboard-preview"
                        className="relative min-h-90 lg:min-h-135 overflow-hidden rounded-3xl bg-surface border border-light-10 p-3 md:p-4"
                    >
                        {LANDING_STEPS.map((step, index) => (
                            <StepPreview
                                key={step.number}
                                src={step.image}
                                alt={step.alt}
                                label={step.title}
                                active={page.activeStep === index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="pricing"
                className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36"
            >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                    Mira nuestros planes
                </h2>
                <p className="text-sm md:text-base text-helper max-w-2xl mb-14 md:mb-16 leading-relaxed">
                    Todos los precios están expresados en USD. El importe final
                    en moneda local dependerá del tipo de cambio aplicado por su
                    banco o entidad emisora.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch md:pt-2">
                    {LANDING_PLANS.map((plan) => (
                        <PricingCard key={plan.name} {...plan} />
                    ))}
                </div>
            </section>

            <section id="faq" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-14">
                    Preguntas frecuentes
                </h2>

                <div className="flex flex-col gap-4">
                    {LANDING_FAQS.map((faq, index) => (
                        <FaqItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer}
                            open={page.openFaq === index}
                            onToggle={() => page.toggleFaq(index)}
                        />
                    ))}
                </div>
            </section>
        </>
    );
};
