import { useTranslation } from "react-i18next";
import { SiClaude } from "@icons-pack/react-simple-icons";

import { BalanceCard } from "./components/BalanceCard";
import { BudgetsHealthCard } from "./components/BudgetsHealthCard";
import { QuickRegisterCard } from "./components/QuickRegisterCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { useDashboardPage } from "./hooks/useDashboardPage";

import { Button } from "@/components/controls/Button";
import { getClaudeConnectorUrl } from "@/utils/claudeConnector";

export const DashboardPage = () => {
    const { t } = useTranslation();
    const page = useDashboardPage();
    const claudeConnectorUrl = getClaudeConnectorUrl();

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
                {claudeConnectorUrl ? (
                    <Button
                        type="button"
                        variant="outline"
                        text={t("settings.connectClaude")}
                        icon={<SiClaude className="h-4 w-4 text-orange-600" aria-hidden="true" />}
                        href={claudeConnectorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit"
                    />
                ) : null}
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:items-start">
                <div className="contents lg:order-1 lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
                    <div className="order-2 min-w-0">
                        <BalanceCard
                            isLoading={page.isLoadingBalance}
                            total={page.balanceTotal}
                            currency={page.currency}
                            averageIncome={page.averageIncome}
                            averageExpenses={page.averageExpenses}
                        />
                    </div>
                    <div className="order-4 min-w-0">
                        <RecentActivityCard
                            isLoading={page.isLoadingActivity}
                            activities={page.activities}
                            activityType={page.activityType}
                            activityQuery={page.activityQuery}
                            onActivityQueryChange={page.setActivityQuery}
                        />
                    </div>
                </div>
                <div className="contents lg:order-2 lg:flex lg:min-w-0 lg:flex-col lg:gap-5">
                    <div className="order-1 min-w-0">
                        <QuickRegisterCard />
                    </div>
                    <div className="order-3 min-w-0">
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
