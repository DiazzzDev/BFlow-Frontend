import { createBrowserRouter } from "react-router-dom";

// App
import { MainLayout } from "./layouts/app/MainLayout.jsx";
import { DashboardPage } from "./modules/app/dashboard/pages/DashboardPage.jsx";
import { WalletsPage } from "./modules/app/wallets/pages/WalletsPage.jsx";
import { WalletDetailsPage } from "./modules/app/wallets/pages/WalletDetailsPage.jsx";
import { IncomesPage } from "./modules/app/incomes/pages/IncomesPage.jsx";
import { ExpensesPage } from "./modules/app/expenses/pages/ExpensesPage.jsx";
import { SettingsPage } from "./modules/app/settings/pages/SettingsPage.jsx";
import { BudgetsPage } from "./modules/app/budgets/pages/BudgetsPage.jsx";
import { TransfersPage } from "./modules/app/transfers/pages/TransfersPage.jsx";
import { LoginPage } from "./modules/auth/login/pages/LoginPage.jsx";
// Auth
import { AuthLayout } from "./layouts/auth/AuthLayout.jsx";
// Landing
import { LandingLayout } from "./layouts/home/LandingLayout.jsx";
import { LandingPage } from "./modules/home/landing/LandingPage.jsx";

export const appRouter = createBrowserRouter([
    // Landing
    {
        path: "/",
        element: <LandingLayout />,
        children: [
            { index: true,          element: <LandingPage /> }
        ]
    },

    // App
    {
        path: "/app",
        element: <MainLayout />,
        children: [
            { path: "dashboard",        element: <DashboardPage /> },
            { path: "wallets",          element: <WalletsPage /> },
            { path: "wallets/:id",      element: <WalletDetailsPage /> },
            { path: "incomes",          element: <IncomesPage /> },
            { path: "expenses",         element: <ExpensesPage /> },
            { path: "settings",         element: <SettingsPage /> },
            { path: "budgets",          element: <BudgetsPage /> },
            { path: "transfers",        element: <TransfersPage /> },
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