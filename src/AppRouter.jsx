import { createBrowserRouter } from "react-router-dom";

// App
import { MainLayout } from "./modules/app/appLayout.jsx";
import { DashboardPage } from "./modules/app/features/dashboard/pages/DashboardPage.jsx";
import { WalletsPage } from "./modules/app/features/wallets/pages/WalletsPage.jsx";
import { WalletDetailsPage } from "./modules/app/features/wallets/pages/WalletDetailsPage.jsx";
import { IncomesPage } from "./modules/app/features/incomes/pages/IncomesPage.jsx";
import { ExpensesPage } from "./modules/app/features/expenses/pages/ExpensesPage.jsx";
import { SettingsPage } from "./modules/app/features/settings/pages/SettingsPage.jsx";
import { BudgetsPage } from "./modules/app/features/budgets/pages/BudgetsPage.jsx";
import { TransfersPage } from "./modules/app/features/transfers/pages/TransfersPage.jsx";
import { LoginPage } from "./modules/auth/features/login/pages/LoginPage.jsx";
// Auth
import { AuthLayout } from "./modules/auth/AuthLayout.jsx";
// Landing
import { LandingLayout } from "./modules/home/LandingLayout.jsx";
import { LandingPage } from "./modules/home/features/landing/LandingPage.jsx";
import { TermsPage } from "./modules/home/features/terms/TermsPage.jsx";
import { PrivacyPage } from "./modules/home/features/privacy/PrivacyPage.jsx";

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