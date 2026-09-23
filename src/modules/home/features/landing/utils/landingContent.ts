import { config } from "@/config/config";

// Auto-advance interval for the how-it-works step carousel
export const LANDING_STEP_INTERVAL_MS = 4000;

// Hero-adjacent how-it-works steps + preview images
export const LANDING_STEPS = [
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

export type CheckoutPlanKey = "pro-monthly" | "pro-yearly";

export type LandingPlan = {
    name: string;
    price: string;
    period: string;
    btnText: string;
    btnStyle: "outline" | "filled";
    featured: boolean;
    features: string[];
    checkoutPlanKey?: CheckoutPlanKey;
    planId?: string;
};

// Pricing cards (USD copy; CTA routes to register by default)
export const LANDING_PLANS: LandingPlan[] = [
    {
        name: "Personal",
        price: "$0",
        period: "Mes",
        btnText: "Empezar gratis",
        btnStyle: "outline",
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
        btnStyle: "filled",
        featured: true,
        checkoutPlanKey: "pro-monthly",
        planId: config.WOMPI_PRO_MONTHLY_PLAN_ID,
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
        btnStyle: "outline",
        featured: false,
        checkoutPlanKey: "pro-yearly",
        planId: config.WOMPI_PRO_YEARLY_PLAN_ID,
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

// FAQ accordion copy
export const LANDING_FAQS = [
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
