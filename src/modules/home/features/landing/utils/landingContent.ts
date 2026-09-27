import {
    ArrowLeftRight,
    ChartPie,
    LayoutDashboard,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";

import budgetsImage from "@/modules/home/assets/Budgets.png";
import dashboardImage from "@/modules/home/assets/Dashboard.svg";
import sharedWalletsImage from "@/modules/home/assets/Shared Wallets.png";
import walletsImage from "@/modules/home/assets/Wallets.png";

// Auto-advance interval for the how-it-works step carousel
export const LANDING_STEP_INTERVAL_MS = 4000;

export type LandingWalletRole = "OWNER" | "MEMBER" | "VIEWER";

// Sample people shared by the hero cards and the wallets preview
export const LANDING_PEOPLE: Array<{
    name: string;
    avatar: string;
    role: LandingWalletRole;
}> = [
        { name: "Julia", avatar: "https://randomuser.me/api/portraits/women/44.jpg", role: "OWNER" },
        { name: "Marco", avatar: "https://randomuser.me/api/portraits/men/32.jpg", role: "MEMBER" },
        { name: "Ana", avatar: "https://randomuser.me/api/portraits/women/68.jpg", role: "VIEWER" },
    ];

// Sample data for the decorative cards around the hero dashboard preview
export const HERO_PREVIEW = {
    image: dashboardImage,
    members: LANDING_PEOPLE,
    monthBalance: 1250.4,
    balanceChange: "+14.2%",
    sparkline: "0,26 16,22 32,24 48,15 64,17 80,8 96,10 112,3",
    walletBalance: 4810,
    personalWalletBalance: 8420.5,
    currency: "USD",
};

// Placeholder until the modules page exists
export const MODULES_PAGE_HREF = "#";

export type SolutionId = "wallets" | "sharedWallets" | "budgets";

// Scroll tour steps; `focus` zooms the screenshot into the relevant area
export const SOLUTION_STEPS: Array<{
    id: SolutionId;
    Icon: LucideIcon;
    path: string;
    image: string;
    focus: { origin: string; scale: number };
}> = [
        {
            id: "wallets",
            Icon: Wallet,
            path: "/app/wallets",
            image: walletsImage,
            focus: { origin: "100% 0%", scale: 1.06 },
        },
        {
            id: "sharedWallets",
            Icon: Users,
            path: "/app/wallets/viewWallet",
            image: sharedWalletsImage,
            focus: { origin: "30% 55%", scale: 1.15 },
        },
        {
            id: "budgets",
            Icon: ChartPie,
            path: "/app/budgets",
            image: budgetsImage,
            focus: { origin: "100% 40%", scale: 1.06 },
        },
    ];

export type LandingModuleId = "dashboard" | "wallets" | "transactions" | "budgets";

// Featured modules shown right below the hero
export const LANDING_MODULES: Array<{
    id: LandingModuleId;
    Icon: LucideIcon;
}> = [
        { id: "dashboard", Icon: LayoutDashboard },
        { id: "wallets", Icon: Wallet },
        { id: "transactions", Icon: ArrowLeftRight },
        { id: "budgets", Icon: ChartPie },
    ];

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
