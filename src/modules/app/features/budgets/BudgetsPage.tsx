import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Plus, WalletCards } from "lucide-react";

import { BudgetOverview } from "./components/BudgetOverview";
import { BudgetItem } from "./components/BudgetItem";
import { BudgetItemSkeleton } from "./components/BudgetItemSkeleton";
import { BudgetForm } from "./components/BudgetForm";
import { BUDGET_PERIOD_TABS, BUDGET_SORT_OPTIONS } from "./utils/filters";
import { useBudgetsPage } from "./hooks/useBudgetsPage";

import { SearchInput } from "@/components/controls/SearchInput";
import { Select } from "@/components/controls/Select";
import { TabFilter } from "@/components/controls/TabFilter";
import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { CustomModal } from "@/components/custom/CustomModal";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

export const BudgetsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updateSearchParams } = useUpdateSearchParams();
    const { budgets, isLoading, totalBudgets, totalPages, numberOfElements, totalLimit, hasActiveFilters, isModalOpen, setIsModalOpen, sort, periodParam } = useBudgetsPage();
    const periodTabs = BUDGET_PERIOD_TABS.map((tab) => ({ ...tab, label: t(`budgets.periods.${tab.value === "ALL" ? "all" : tab.value.toLowerCase()}`, { defaultValue: tab.label }) }));
    const sortOptions = BUDGET_SORT_OPTIONS.map((option) => ({ ...option, label: t(`budgets.sort.${option.value === "amount,desc" ? "amountDesc" : option.value === "amount,asc" ? "amountAsc" : option.value === "updatedAt,desc" ? "updated" : "start"}`, { defaultValue: option.label }) }));

    return (
        <div className="flex flex-col px-4 py-5 sm:px-6 pb-10 min-h-full">
            <BudgetOverview
                totalBudgets={totalBudgets}
                totalLimit={totalLimit}
                isLoading={isLoading}
            />

            <section className="flex h-fit @xl:flex-1 flex-col">
                <div className="mb-5 flex flex-col gap-3 @3xl:flex-row @xl:justify-between">
                    <SearchInput
                        id="txtSearchBudgets"
                        placeholder={t("budgets.search")}
                        className="w-full max-w-none min-w-0 @xl:max-w-xl"
                        syncToParams
                    />

                    <div className="flex min-w-0 flex-col gap-3 @lg:flex-row @md:items-center justify-between">
                        <TabFilter
                            options={periodTabs}
                            selected={periodParam}
                            keyFilter="period"
                            layoutId="budgetPeriodTab"
                            responsive="stretch"
                        />

                        <Button
                            type="button"
                            text={t("budgets.create")}
                            icon={<Plus className="h-4 w-4" />}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full shrink-0 @lg:w-auto"
                        />
                    </div>
                </div>

                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-base font-semibold text-light sm:text-lg">
                        {t("budgets.active")} {isLoading ? "" : `(${totalBudgets})`}
                    </h2>

                    <Select
                        id="budgetSort"
                        value={sort}
                        aria-label={t("budgets.sortLabel")}
                        className="w-full sm:min-w-44 sm:max-w-52"
                        onChange={(event) =>
                            updateSearchParams(
                                { sort: event.target.value || null },
                                { resetPage: true },
                            )
                        }
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="h-fit @xl:flex-1">
                    {renderList()}
                </div>

            </section>
            {!isLoading && totalBudgets > 0 && (
                <div className="mt-4 flex flex-col items-center gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <PaginationSelect
                        totalItems={totalBudgets}
                        numberOfElements={numberOfElements}
                    />
                    <Pagination totalPages={totalPages} />
                </div>
            )}

            <CustomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title={t("budgets.newTitle")}
                maxWidth="max-w-xl"
            >
                <BudgetForm
                    key={isModalOpen ? "open" : "closed"}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </CustomModal>
        </div>
    );

    function renderList() {
        if (isLoading) {
            return (
                <div className="flex flex-col">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <BudgetItemSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (budgets.length > 0) {
            return (
                <div className="flex flex-col">
                    {budgets.map((budget) => (
                        <BudgetItem
                            key={budget.id}
                            budget={budget}
                            onClick={() => {
                                void navigate(`/app/budgets/${budget.id}`);
                            }}
                        />
                    ))}
                </div>
            );
        }

        return (
            <CustomEmptyState
                title={hasActiveFilters ? t("budgets.noResults") : t("budgets.empty")}
                description={
                    hasActiveFilters
                        ? t("budgets.noResultsHint")
                        : t("budgets.emptyHint")
                }
                Icon={WalletCards}
            />
        );
    }
};
