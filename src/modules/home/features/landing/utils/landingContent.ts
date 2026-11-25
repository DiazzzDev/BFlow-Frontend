import {
    ArrowLeftRight,
    ChartPie,
    LayoutDashboard,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";

import budgetsImage from "@/modules/home/assets/Budgets.png";
import dashboardImage from "@/modules/home/assets/Dashboard.png";
import sharedWalletsImage from "@/modules/home/assets/Shared Wallets.png";
import walletsImage from "@/modules/home/assets/Wallets.png";
import {
    DOCS_PAGES,
    getDocsPath,
    type DocsPageId,
} from "@/modules/home/features/docs/utils/docsContent";

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

export const MODULES_PAGE_HREF = getDocsPath("");

export type SolutionId = "wallets" | "sharedWallets" | "budgets";

// Scroll tour steps; `focus` zooms the screenshot into the relevant area
export const SOLUTION_STEPS: Array<{
    id: SolutionId;
    Icon: LucideIcon;
    path: string;
    docsPath: string;
    image: string;
    focus: { origin: string; scale: number };
}> = [
        {
            id: "wallets",
            Icon: Wallet,
            path: "/app/wallets",
            docsPath: getDocsPath("wallets"),
            image: walletsImage,
            focus: { origin: "100% 0%", scale: 1.06 },
        },
        {
            id: "sharedWallets",
            Icon: Users,
            path: "/app/wallets/viewWallet",
            docsPath: getDocsPath("shared-wallets"),
            image: sharedWalletsImage,
            focus: { origin: "30% 55%", scale: 1.15 },
        },
        {
            id: "budgets",
            Icon: ChartPie,
            path: "/app/budgets",
            docsPath: getDocsPath("budgets"),
            image: budgetsImage,
            focus: { origin: "100% 40%", scale: 1.06 },
        },
    ];

// Modules not covered by the scroll tour, teased below it
const MORE_MODULE_IDS: DocsPageId[] = [
    "transactions",
    "scheduledTransactions",
    "history",
    "categories",
    "notifications",
    "claude",
];

export const MORE_MODULES = DOCS_PAGES.filter(({ id }) => MORE_MODULE_IDS.includes(id));

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
        image: "Proximamente contenido animado",
        alt: "Pantalla de registro de BFlow",
    },
    {
        number: "02",
        title: "Agrega tus billeteras",
        desc: "Crea billeteras para cada cuenta bancaria, efectivo o tarjeta e invita miembros si quieres compartirlas.",
        image: "Proximamente contenido animado",
        alt: "Pantalla para agregar una billetera",
    },
    {
        number: "03",
        title: "Controla tus finanzas",
        desc: "Registra movimientos, define presupuestos y visualiza tu situación financiera en tiempo real.",
        image: "Proximamente contenido animado",
        alt: "Dashboard de BFlow",
    },
];

// FAQ accordion copy
export interface LandingFaqContent {
    question: string;
    answer: string;
    reference?: string;
}

export const LANDING_FAQS: LandingFaqContent[] = [
    {
        question: "¿Qué puedo organizar en BFlow?",
        answer: "Puedes registrar ingresos y gastos, ordenarlos por categoría y billetera, revisar movimientos y llevar presupuestos desde el mismo espacio.",
    },
    {
        question: "¿Cómo funciona el registro con recibo?",
        answer: "Sube una imagen o un PDF del recibo. BFlow analiza sus datos y te permite revisar la información antes de confirmar el gasto.",
    },
    {
        question: "¿Puedo compartir una billetera con alguien más?",
        answer: "Sí. Puedes invitar miembros a una billetera compartida y asignarles un rol para organizar gastos en conjunto.",
    },
    {
        question: "¿Cómo me ayudan los presupuestos?",
        answer: "Puedes definir un límite para una billetera o categoría y seguir el avance con una barra y sus indicadores de alerta.",
    },
    {
        question: "¿Qué puedo consultar con Claude?",
        answer: "Puedes conectar BFlow con Claude como conector personalizado para hacer preguntas sobre tus finanzas desde Claude.",
    },
    {
        question: "¿Cómo se procesan los pagos o reembolsos?",
        answer: "Los pagos de los planes se procesan con Wompi. Para consultas relacionadas con pagos o reembolsos, consulta su centro de ayuda.",
        reference: "https://www.wompi.sv/",
    },
    {
        question: "¿Cómo elijo un plan Pro?",
        answer:
            "Revisa los planes y sus beneficios en la sección de precios. Al elegir un plan, BFlow te guía por el inicio de sesión y los siguientes pasos de compra.",
    },
];
