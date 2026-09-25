// Auto-advance interval for the how-it-works step carousel
export const LANDING_STEP_INTERVAL_MS = 4000;

// Hero-adjacent how-it-works steps + preview images
export const LANDING_STEPS: Array<{
    number: string;
    title: string;
    desc: string;
    image: string;
    alt: string;
    illustration: "register" | "wallet" | "dashboard";
}> = [
    {
        number: "01",
        title: "Crea tu cuenta",
        desc: "Con tu email o Google. Sin tarjeta, menos de un minuto.",
        image: "/landing/step-register.png",
        alt: "Pantalla de registro de BFlow",
        illustration: "register",
    },
    {
        number: "02",
        title: "Agrega tus billeteras",
        desc: "Una por cada cuenta, tarjeta o efectivo. Invita a otros si la compartís.",
        image: "/landing/step-wallet.png",
        alt: "Pantalla para agregar una billetera",
        illustration: "wallet",
    },
    {
        number: "03",
        title: "Controla tus finanzas",
        desc: "Movimientos, presupuestos y balance, actualizados al momento.",
        image: "/landing/step-dashboard.png",
        alt: "Dashboard de BFlow",
        illustration: "dashboard",
    },
];

// Pricing cards (USD copy; CTA routes to register by default)
export const LANDING_PLANS: Array<{
    name: string;
    price: string;
    period: string;
    btnText: string;
    btnStyle: "outline" | "filled";
    featured: boolean;
    features: string[];
}> = [
    {
        name: "Personal",
        price: "$0",
        period: "Mes",
        btnText: "Empezar gratis",
        btnStyle: "outline",
        featured: false,
        features: [
            "Hasta 2 billeteras",
            "Hasta 2 recurrencias",
            "Hasta 3 presupuestos",
            "Compartir una billetera con hasta 3 personas",
        ],
    },
    {
        name: "BFlow Pro",
        price: "$9.99",
        period: "Mes",
        btnText: "Empezar con Pro",
        btnStyle: "filled",
        featured: true,
        features: [
            "Hasta 100 billeteras",
            "Hasta 25 recurrencias",
            "Hasta 100 presupuestos",
            "Billeteras compartidas con hasta 10 personas",
            "Transacciones entre billeteras",
            "Dashboard personalizable",
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
        features: [
            "Hasta 100 billeteras",
            "Hasta 25 recurrencias",
            "Hasta 100 presupuestos",
            "Billeteras compartidas con hasta 10 personas",
            "Transacciones entre billeteras",
            "Dashboard personalizable",
            "Autocompletado inteligente",
        ],
    },
];

// FAQ accordion copy
export const LANDING_FAQS: Array<{ question: string; answer: string }> = [
    {
        question: "¿Por qué usar BFlow?",
        answer:
            "Junta ingresos, gastos y billeteras compartidas en un solo lugar. Menos apps sueltas, más claridad sobre tu plata.",
    },
    {
        question: "¿Mis datos están seguros?",
        answer:
            "Sí. Usamos autenticación segura y buenas prácticas de protección de datos para resguardar tu información financiera.",
    },
    {
        question: "¿Qué pasarela de pago usa BFlow?",
        answer:
            "Los planes pagos se procesan a través de una pasarela confiable. El detalle se confirma al momento de suscribirte.",
    },
];

// In-page section anchors used by navbar / footer
export const LANDING_NAV_LINKS = [
    { label: "Características", id: "how" },
    { label: "Precios", id: "pricing" },
    { label: "Preguntas frecuentes", id: "faq" },
] as const;