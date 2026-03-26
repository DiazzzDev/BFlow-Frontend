import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { DashboardPage } from "./modules/dashboard/pages/DashboardPage.jsx";
import { WalletPage } from "./modules/wallets/pages/WalletPage.jsx";
import { IncomesPage } from "./modules/incomes/pages/IncomesPage.jsx";
import { ExpensesPage } from "./modules/expenses/pages/ExpensesPage.jsx";
import { LoginPage } from "./modules/Login/pages/LoginPage.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

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
            }
        ]
    },
    {
        path: '/auth/',
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <LoginPage />
            }
        ]
    }
]);