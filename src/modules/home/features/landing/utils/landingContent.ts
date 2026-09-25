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
            "BFlow reúne tus ingresos, gastos, presupuestos y billeteras en un solo lugar para que tengas claridad sobre tu dinero cada día.",
    },
    {
        question: "¿Puedo compartir mis billeteras?",
        answer:
            "Sí. Puedes crear billeteras compartidas e invitar a las personas con las que organizas tus finanzas.",
    },
    {
        question: "¿Cómo se procesan los pagos?",
        answer:
            "Los pagos de los planes premium se procesan con Wompi, una plataforma de pagos en línea.",
        reference: "https://www.wompi.sv/",
    },
    {
        question: "¿Mis datos están seguros?",
        answer:
            "Sí. Protegemos tu información con autenticación segura y buenas prácticas para que tus datos financieros permanezcan privados.",
    },
    {
        question: "¿Puedo cambiar de plan o cancelarlo?",
        answer:
            "Sí. Puedes revisar, cambiar o cancelar tu plan desde la configuración de tu cuenta, según las condiciones vigentes.",
    },
];
