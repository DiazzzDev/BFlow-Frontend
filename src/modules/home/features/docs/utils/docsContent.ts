import {
    ArrowLeftRight,
    BadgeDollarSign,
    Bell,
    BookOpen,
    CalendarClock,
    ChartPie,
    History,
    LayoutDashboard,
    Settings,
    Sparkles,
    Tags,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";

export const DOCS_BASE_PATH = "/docs";

// Section id of the module cards rendered below the introduction
export const DOCS_HUB_ID = "explore";

export type DocsPageId =
    | "introduction"
    | "plans"
    | "dashboard"
    | "wallets"
    | "sharedWallets"
    | "transactions"
    | "scheduledTransactions"
    | "history"
    | "budgets"
    | "categories"
    | "notifications"
    | "settings"
    | "claude";

export type DocsGroupId = "gettingStarted" | "modules" | "account";

export interface DocsPage {
    id: DocsPageId;
    // Empty slug maps to the docs index route
    slug: string;
    Icon: LucideIcon;
}

export const DOCS_GROUPS: Array<{ id: DocsGroupId; pages: DocsPage[] }> = [
    {
        id: "gettingStarted",
        pages: [
            { id: "introduction", slug: "", Icon: BookOpen },
            { id: "plans", slug: "plans", Icon: BadgeDollarSign },
        ],
    },
    {
        id: "modules",
        pages: [
            { id: "dashboard", slug: "dashboard", Icon: LayoutDashboard },
            { id: "wallets", slug: "wallets", Icon: Wallet },
            { id: "sharedWallets", slug: "shared-wallets", Icon: Users },
            { id: "transactions", slug: "transactions", Icon: ArrowLeftRight },
            { id: "scheduledTransactions", slug: "scheduled-transactions", Icon: CalendarClock },
            { id: "history", slug: "history", Icon: History },
            { id: "budgets", slug: "budgets", Icon: ChartPie },
        ],
    },
    {
        id: "account",
        pages: [
            { id: "categories", slug: "categories", Icon: Tags },
            { id: "notifications", slug: "notifications", Icon: Bell },
            { id: "settings", slug: "settings", Icon: Settings },
            { id: "claude", slug: "claude", Icon: Sparkles },
        ],
    },
];

// Sidebar order; drives previous / next navigation
export const DOCS_PAGES = DOCS_GROUPS.flatMap(({ pages }) => pages);

export const getDocsPath = (slug: string) =>
    slug ? `${DOCS_BASE_PATH}/${slug}` : DOCS_BASE_PATH;
