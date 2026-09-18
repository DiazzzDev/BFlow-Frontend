import { useState } from "react";

import { NewTransactionModal } from "../newTransaction/NewTransactionModal";

import { useCalendarPage } from "./hooks/useCalendarPage";
import { CalendarToolbar } from "./components/CalendarToolbar";
import { CalendarInsightsPanel } from "./components/CalendarInsightsPanel";
import { CalendarMonthGrid } from "./components/CalendarMonthGrid";
import { CalendarListView } from "./components/CalendarListView";
import { DayDetailsPanel } from "./components/DayDetailsPanel";
import { RecurringDetailsPanel } from "./components/RecurringDetailsPanel";
import { BudgetDetailsPanel } from "./components/BudgetDetailsPanel";

import type { Transaction } from "@/modules/app/interfaces/Transaction";

export const CalendarPage = () => {
    const view = useCalendarPage();
    const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);

    return (
        <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-light">Calendario</h1>
                <p className="mt-1 text-sm text-helper">
                    Qué entra, qué sale y qué presupuestos están activos, de un vistazo.
                </p>
            </div>

            <CalendarToolbar
                monthLabel={view.monthLabel}
                layout={view.layout}
                onLayoutChange={view.setLayout}
                onPrevious={view.goPrevious}
                onNext={view.goNext}
                view={view.view}
                onWalletChange={(value) => view.setFilter("walletId", value)}
                onCategoryChange={(value) => view.setFilter("categoryId", value)}
                walletId={view.walletId}
                categoryId={view.categoryId}
                wallets={view.wallets}
                categories={view.categories}
            />

            {/* items-start keeps the sidebar sized to its own content instead
                of being stretched to match the calendar's height. */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-start">
                <div className="xl:col-span-2">
                    {view.layout === "list" ? (
                        <CalendarListView
                            weeks={view.weeks}
                            daySummaries={view.daySummaries}
                            onSelectDay={view.setSelectedDayKey}
                        />
                    ) : (
                        <CalendarMonthGrid
                            weeks={view.weeks}
                            daySummaries={view.daySummaries}
                            budgets={view.budgets}
                            onSelectDay={view.setSelectedDayKey}
                            onSelectBudget={view.setSelectedBudgetId}
                        />
                    )}
                </div>

                <div className="xl:col-span-1">
                    <CalendarInsightsPanel
                        income={view.monthSummary.income}
                        expense={view.monthSummary.expense}
                        net={view.monthSummary.net}
                        upcomingRecurringCount={view.monthSummary.upcomingRecurring.length}
                        budgets={view.budgets}
                        onSelectBudget={view.setSelectedBudgetId}
                        isLoading={view.isLoading}
                    />
                </div>
            </div>

            <DayDetailsPanel
                dateKey={view.selectedDayKey}
                summary={view.selectedDaySummary}
                onClose={() => view.setSelectedDayKey(null)}
                onViewTransaction={setViewTransaction}
                onSelectRecurring={view.setSelectedRecurringId}
                onSelectBudget={view.setSelectedBudgetId}
                onCreateTransaction={() => view.setIsCreateModalOpen(true)}
            />

            <RecurringDetailsPanel
                recurring={view.selectedRecurring}
                onClose={() => view.setSelectedRecurringId(null)}
            />

            <BudgetDetailsPanel
                budgetId={view.selectedBudgetId}
                onClose={() => view.setSelectedBudgetId(null)}
            />

            <NewTransactionModal
                isModalOpen={Boolean(viewTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        setViewTransaction(null);
                    }
                }}
                mode="view"
                transaction={viewTransaction}
            />

            <NewTransactionModal
                isModalOpen={view.isCreateModalOpen}
                setIsModalOpen={view.setIsCreateModalOpen}
                mode="create"
                requireWalletSelect
            />
        </div>
    );
};
