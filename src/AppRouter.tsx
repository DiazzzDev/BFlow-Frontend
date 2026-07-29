import { createBrowserRouter } from "react-router-dom";

// App
import { DashboardPage } from "./modules/app/features/dashboard/pages/DashboardPage.tsx";
import { WalletsPage } from "./modules/app/features/wallets/WalletsPage.tsx";
import { WalletViewPage } from "./modules/app/features/walletView/WalletViewPage.tsx";
import { IncomesPage } from "./modules/app/features/incomes/pages/IncomesPage.tsx";
import { ExpensesPage } from "./modules/app/features/expenses/pages/ExpensesPage.tsx";
import { SettingsPage } from "./modules/app/features/settings/pages/SettingsPage.tsx";
import { BudgetsPage } from "./modules/app/features/budgets/BudgetsPage.tsx";
import { BudgetViewPage } from "./modules/app/features/budgetView/BudgetViewPage.tsx";
import { TransfersPage } from "./modules/app/features/transfers/pages/TransfersPage.tsx";
import { ProtectedRoute } from "./modules/app/protectedRoute.tsx";
import { AppLayout } from "./modules/app/appLayout.tsx";
// Auth
import { AuthLayout } from "./modules/auth/AuthLayout.tsx";
import { GuestRoute } from "./modules/auth/guestRoute.tsx";
import { LoginPage } from "./modules/auth/features/login/LoginPage.tsx";
import { OAuthCallbackPage } from "./modules/auth/features/oauthCallback/OAuthCallbackPage.tsx";
import { RegisterPage } from "./modules/auth/features/register/RegisterPage.tsx";
import { ForgotPasswordPage } from "./modules/auth/features/forgotPassword/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "./modules/auth/features/resetPassword/ResetPasswordPage.tsx";
import { VerifyAccountPage } from "./modules/auth/features/verifyAccount/VerifyAccountPage.tsx";
// Landing
import { LandingLayout } from "./modules/home/LandingLayout.tsx";
import { LandingPage } from "./modules/home/features/landing/LandingPage.tsx";
import { TermsPage } from "./modules/home/features/terms/TermsPage.tsx";
import { PrivacyPage } from "./modules/home/features/privacy/PrivacyPage.tsx";
import { CookiesPage } from "./modules/home/features/cookies/CookiesPage.tsx";

export const appRouter = createBrowserRouter([
    // Landing
    {
        path: "/",
        element: <LandingLayout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "terms", element: <TermsPage /> },
            { path: "privacy", element: <PrivacyPage /> },
            { path: "cookies", element: <CookiesPage /> },
        ],
    },
    // App
    {
        path: "/app",
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: "dashboard", element: <DashboardPage /> },
                    { path: "wallets", element: <WalletsPage /> },
                    { path: "wallets/:id", element: <WalletViewPage /> },
                    { path: "incomes", element: <IncomesPage /> },
                    { path: "expenses", element: <ExpensesPage /> },
                    { path: "settings", element: <SettingsPage /> },
                    { path: "budgets", element: <BudgetsPage /> },
                    { path: "budgets/:id", element: <BudgetViewPage /> },
                    { path: "transfers", element: <TransfersPage /> },
                ],
            },
        ],
    },

    // Auth
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                element: <GuestRoute />,
                children: [
                    { path: "login", element: <LoginPage /> },
                    { path: "register", element: <RegisterPage /> },
                ],
            },
            { path: "callback", element: <OAuthCallbackPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "reset-password", element: <ResetPasswordPage /> },
            { path: "verify-account", element: <VerifyAccountPage /> },
        ],
    },
]);
