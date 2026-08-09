import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Plus, WalletCards } from "lucide-react";

import { BudgetOverview } from "./components/BudgetOverview";
import { BudgetItem } from "./components/BudgetItem";
import { BudgetItemSkeleton } from "./components/BudgetItemSkeleton";
import { BudgetForm } from "./components/BudgetForm";
import { useGetBudgets } from "./hooks/useGetBudgets";

import { SearchInput } from "@/components/controls/SearchInput";
import { Select } from "@/components/controls/Select";
import { TabFilter } from "@/components/controls/TabFilter";
import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { CustomModal } from "@/components/custom/CustomModal";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

const sortOptions = [
    { value: "amount,desc", label: "Mayor monto" },
    { value: "amount,asc", label: "Menor monto" },
    { value: "updatedAt,desc", label: "Más recientes" },
    { value: "startDate,desc", label: "Inicio reciente" },
];

const periodOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Mensual", value: "MONTHLY" },
    { label: "Semanal", value: "WEEKLY" },
    { label: "Anual", value: "YEARLY" },
];

export const BudgetsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { updateSearchParams } = useUpdateSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const sort = params.get("sort") || "amount,desc";
    const periodParam = params.get("period") || "ALL";
    const period = periodParam === "ALL" ? undefined : periodParam;
    const { apiPage, limit } = usePaginationParams();

    const { data, isLoading } = useGetBudgets({
        query: debouncedQuery,
        sort,
        period,
        page: apiPage,
        size: limit,
    });

    const budgets = data?.data.content ?? [];
    const totalBudgets = data?.data.totalElements ?? budgets.length;
    const totalPages = data?.data.totalPages ?? 0;
    const numberOfElements = data?.data.numberOfElements ?? budgets.length;
    const totalLimit = budgets.reduce((sum, budget) => sum + (budget.budgetLimit ?? 0), 0);
    const hasActiveFilters = Boolean(query.trim() || period || sort !== "amount,desc");

    return (
        <div className="flex h-fit @xl:h-full min-h-0 flex-col px-4 py-5 sm:px-6">
            <BudgetOverview
                totalBudgets={totalBudgets}
                totalLimit={totalLimit}
                isLoading={isLoading}
            />

            <section className="flex min-h-0 flex-1 flex-col">
                <div className="mb-5 flex flex-col gap-3 @3xl:flex-row @xl:justify-between">
                    <SearchInput
                        id="txtSearchBudgets"
                        placeholder="Search budgets..."
                        className="w-full max-w-none min-w-0 @xl:max-w-xl"
                        syncToParams
                    />

                    <div className="flex min-w-0 flex-col gap-3 @lg:flex-row @md:items-center justify-between">
                        <TabFilter
                            options={periodOptions}
                            selected={periodParam}
                            keyFilter="period"
                            layoutId="budgetPeriodTab"
                            responsive="stretch"
                        />

                        <Button
                            type="button"
                            text="Crear presupuesto"
                            icon={<Plus className="h-4 w-4" />}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full shrink-0 @lg:w-auto"
                        />
                    </div>
                </div>

                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-base font-semibold text-light sm:text-lg">
                        Active budgets {isLoading ? "" : `(${totalBudgets})`}
                    </h2>

                    <Select
                        id="budgetSort"
                        value={sort}
                        aria-label="Ordenar presupuestos"
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

                <div className="min-h-0 flex-1 overflow-y-visible @xl:overflow-y-auto">
                    {renderList()}
                </div>

                {!isLoading && totalBudgets > 0 && (
                    <div className="mt-4 flex flex-col items-center gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <PaginationSelect
                            totalItems={totalBudgets}
                            numberOfElements={numberOfElements}
                        />
                        <Pagination totalPages={totalPages} />
                    </div>
                )}
            </section>

            <CustomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                title="Nuevo presupuesto"
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
                title={hasActiveFilters ? "Sin resultados" : "Sin presupuestos"}
                description={
                    hasActiveFilters
                        ? "Prueba ajustando la búsqueda o los filtros"
                        : "Crea tu primer presupuesto para controlar tus gastos."
                }
                Icon={WalletCards}
            />
        );
    }
};
