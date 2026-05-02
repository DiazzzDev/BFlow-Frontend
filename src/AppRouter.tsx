import { createBrowserRouter } from "react-router-dom";

// App
import { MainLayout } from "./modules/app/appLayout.tsx";
import { DashboardPage } from "./modules/app/features/dashboard/pages/DashboardPage.tsx";
import { WalletsPage } from "./modules/app/features/wallets/pages/WalletsPage.tsx";
import { WalletDetailsPage } from "./modules/app/features/wallets/pages/WalletDetailsPage.tsx";
import { IncomesPage } from "./modules/app/features/incomes/pages/IncomesPage.tsx";
import { ExpensesPage } from "./modules/app/features/expenses/pages/ExpensesPage.tsx";
import { SettingsPage } from "./modules/app/features/settings/pages/SettingsPage.tsx";
import { BudgetsPage } from "./modules/app/features/budgets/pages/BudgetsPage.tsx";
import { TransfersPage } from "./modules/app/features/transfers/pages/TransfersPage.tsx";
import { LoginPage } from "./modules/auth/features/login/pages/LoginPage.tsx";
// Auth
import { AuthLayout } from "./modules/auth/AuthLayout.tsx";
// Landing
import { LandingLayout } from "./modules/home/LandingLayout.tsx";
import { LandingPage } from "./modules/home/features/landing/LandingPage.tsx";
import { TermsPage } from "./modules/home/features/terms/TermsPage.tsx";
import { PrivacyPage } from "./modules/home/features/privacy/PrivacyPage.tsx";

export const appRouter = createBrowserRouter([
    // Landing
    {
        path: "/",
        element: <LandingLayout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "terms", element: <TermsPage /> },
            { path: "privacy", element: <PrivacyPage /> }
        ]
    },

    // App
    {
        path: "/app",
        element: <MainLayout />,
        children: [
            { path: "dashboard", element: <DashboardPage /> },
            { path: "wallets", element: <WalletsPage /> },
            { path: "wallets/:id", element: <WalletDetailsPage /> },
            { path: "incomes", element: <IncomesPage /> },
            { path: "expenses", element: <ExpensesPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "budgets", element: <BudgetsPage /> },
            { path: "transfers", element: <TransfersPage /> },
        ]
    },

    // Auth
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
        ]
    }
]);
