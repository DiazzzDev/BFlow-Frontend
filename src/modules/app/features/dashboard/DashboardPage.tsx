import { useTranslation } from "react-i18next";

import { ConnectClaudeButton } from "../settings/components/ConnectClaudeButton";

import { BalanceCard } from "./components/BalanceCard";
import { BudgetsHealthCard } from "./components/BudgetsHealthCard";
import { QuickRegisterCard } from "./components/QuickRegisterCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { useDashboardPage } from "./hooks/useDashboardPage";

export const DashboardPage = () => {
    const { t } = useTranslation();
    const page = useDashboardPage();

    return (
        <div className="mx-auto flex w-full max-w-380 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex shrink-0 flex-col justify-between gap-4 pb-1 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                        {t(page.greetingKey)}
                        {page.firstName ? `, ${page.firstName}` : ""}
                    </h1>
                    <p className="mt-1.5 text-sm text-helper">{t("dashboard.subtitle")}</p>
                </div>
                <ConnectClaudeButton />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="flex min-w-0 flex-col gap-5">
                    <BalanceCard
                        isLoading={page.isLoadingBalance}
                        total={page.balanceTotal}
                        currency={page.currency}
                        averageIncome={page.averageIncome}
                        averageExpenses={page.averageExpenses}
                    />
                    <div className="min-w-0">
                        <RecentActivityCard
                            isLoading={page.isLoadingActivity}
                            activities={page.activities}
                            currency={page.currency}
                            activityType={page.activityType}
                            activityQuery={page.activityQuery}
                            onActivityTypeChange={page.setActivityType}
                            onActivityQueryChange={page.setActivityQuery}
                        />
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-5">
                    <QuickRegisterCard />
                    <div className="min-w-0 flex-1">
                        <BudgetsHealthCard
                            isLoading={page.isLoadingBudgets}
                            budgets={page.budgets}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};
