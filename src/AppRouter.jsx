import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { DashboardPage } from "./modules/dashboard/pages/DashboardPage.jsx";
import { WalletPage } from "./modules/wallets/pages/WalletPage.jsx";
import { IncomesPage } from "./modules/incomes/pages/IncomesPage.jsx";
import { ExpensesPage } from "./modules/expenses/pages/ExpensesPage.jsx";
import { LoginPage } from "./modules/Login/pages/LoginPage.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import { SettingsPage } from "./modules/settings/pages/SettingsPage.jsx";
import { BudgetsPage } from "./modules/budgets/pages/BudgetsPage.jsx";
import { TransfersPage } from "./modules/transfers/pages/TransfersPage.jsx";

export const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: "wallets",
                element: <WalletPage />
            },
            {
                path: "incomes",
                element: <IncomesPage />
            },
            {
                path: "expenses",
                element: <ExpensesPage />
            },
            {
                path: "settings",
                element: <SettingsPage />
            },
            {
                path: "budgets",
                element: <BudgetsPage />
            },
            {
                path: "transfers",
                element: <TransfersPage />
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            }
        ]
    }
]);