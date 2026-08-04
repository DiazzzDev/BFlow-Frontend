import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../../auth/hooks/useAuth.ts";

import { StepCard } from "./components/StepCard";
import { StepPreview } from "./components/StepPreview";
import { PricingCard } from "./components/PricingCard";
import { FaqItem } from "./components/FaqItem";

const STEP_INTERVAL_MS = 4000;

const steps = [
    {
        number: "01",
        title: "Crea tu cuenta",
        desc: "Regístrate con tu email o Google en menos de 30 segundos. Sin tarjeta de crédito requerida.",
        image: "/landing/step-register.png",
        alt: "Pantalla de registro de BFlow",
    },
    {
        number: "02",
        title: "Agrega tus billeteras",
        desc: "Crea billeteras para cada cuenta bancaria, efectivo o tarjeta e invita miembros si quieres compartirlas.",
        image: "/landing/step-wallet.png",
        alt: "Pantalla para agregar una billetera",
    },
    {
        number: "03",
        title: "Controla tus finanzas",
        desc: "Registra movimientos, define presupuestos y visualiza tu situación financiera en tiempo real.",
        image: "/landing/step-dashboard.png",
        alt: "Dashboard de BFlow",
    },
];

const plans = [
    {
        name: "Personal",
        price: "$0",
        period: "Mes",
        btnText: "Empezar gratis",
        btnStyle: "outline" as const,
        featured: false,
        features: [
            "Hasta 2 wallets",
            "Hasta 2 Recurrencias",
            "Hasta 3 presupuestos",
            "Participar en una wallet con un máximo de 3 personas",
        ],
    },
    {
        name: "BFlow Pro",
        price: "$9.99",
        period: "Mes",
        btnText: "Empezar con Pro",
        btnStyle: "filled" as const,
        featured: true,
        features: [
            "Hasta un maximo de 100 wallets",
            "Hasta un maximo de 25 Recurrencias",
            "Hasta un maximo de 100 presupuestos",
            "Crear wallets compartidas, invitar e administrar un máximo de 10 personas",
            "Transacciones entre wallets",
            "Personalización de dashboard",
            "Autocompletado inteligente",
        ],
    },
    {
        name: "BFlow Pro anual",
        price: "$99.99",
        period: "Año",
        btnText: "Empezar con Pro anual",
        btnStyle: "outline" as const,
        featured: false,
        features: [
            "Hasta un maximo de 100 wallets",
            "Hasta un maximo de 25 Recurrencias",
            "Hasta un maximo de 100 presupuestos",
            "Crear wallets compartidas, invitar e administrar un máximo de 10 personas",
            "Transacciones entre wallets",
            "Personalización de dashboard",
            "Autocompletado inteligente",
        ],
    },
];

const faqs = [
    {
        question: "¿Por qué usar BFlow?",
        answer:
            "BFlow te ayuda a organizar ingresos, gastos y billeteras compartidas en un solo lugar, con una interfaz simple pensada para el día a día.",
    },
    {
        question: "¿Mis datos están seguros?",
        answer:
            "Sí. Usamos autenticación segura y buenas prácticas de protección de datos para que tu información financiera esté resguardada.",
    },
    {
        question: "¿Qué pasarela de pago es utilizada en Bflow?",
        answer:
            "Los pagos de planes premium se procesan a través de una pasarela de pago confiable. El detalle se confirma al momento de la suscripción.",
    },
];

const GitHubFab = () => (
    <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-light-10 bg-surface text-light shadow-lg hover:border-light-25 hover:bg-surface-hard transition-colors"
    >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12 24 5.37 18.627 0 12 0z" />
        </svg>
    </a>
);

export const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [paused, setPaused] = useState(false);
    const { isAuthenticated, isChecking } = useAuth();

    useEffect(() => {
        if (paused) { return };

        const id = window.setInterval(() => {
            setActiveStep((current) => (current + 1) % steps.length);
        }, STEP_INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [paused]);

    const selectStep = (index: number) => {
        setActiveStep(index);
        setPaused(true);
        window.setTimeout(() => setPaused(false), STEP_INTERVAL_MS);
    };

    return (
        <>
            <GitHubFab />

            {/* Hero */}
            <section className="px-8 md:px-16 xl:px-24 pt-28 md:pt-36 pb-28 md:pb-40 min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h1 className="max-w-4xl text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                    El control financiero que{" "}
                    <span className="text-primary">siempre quisiste</span>
                </h1>

                <p className="text-base md:text-lg text-helper max-w-xl mb-10 leading-relaxed">
                    Gestiona tus ingresos, gastos y billeteras compartidas en un solo lugar.
                    Simple, potente y diseñado para tu día a día.
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

            {/* Tres pasos */}
            <section id="how" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-16 max-w-xl leading-tight">
                    Tres pasos para la paz financiera
                </h2>

                <div
                    id="features"
                    className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 lg:gap-10 items-stretch"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="relative flex flex-col gap-4">
                        <div className="pointer-events-none absolute left-0 top-6 bottom-6 hidden w-px bg-light-10 sm:block" />

                        {steps.map((step, index) => (
                            <div key={step.number} className="relative sm:pl-8">
                                <span
                                    className={`absolute left-0 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 sm:block ${activeStep === index ? "bg-light" : "bg-helper"
                                        }`}
                                />
                                <StepCard
                                    number={step.number}
                                    title={step.title}
                                    desc={step.desc}
                                    active={activeStep === index}
                                    onSelect={() => selectStep(index)}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        id="dashboard-preview"
                        className="relative min-h-90 lg:min-h-135 overflow-hidden rounded-3xl bg-surface border border-light-10 p-3 md:p-4"
                    >
                        {steps.map((step, index) => (
                            <StepPreview
                                key={step.number}
                                src={step.image}
                                alt={step.alt}
                                label={step.title}
                                active={activeStep === index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                    Mira nuestros planes
                </h2>
                <p className="text-sm md:text-base text-helper max-w-2xl mb-14 md:mb-16 leading-relaxed">
                    Todos los precios están expresados en USD. El importe final en moneda local
                    dependerá del tipo de cambio aplicado por su banco o entidad emisora.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch md:pt-2">
                    {plans.map((plan) => (
                        <PricingCard key={plan.name} {...plan} />
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-14">
                    Preguntas frecuentes
                </h2>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <FaqItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer}
                            open={openFaq === index}
                            onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                        />
                    ))}
                </div>
            </section>
        </>
    );
};
