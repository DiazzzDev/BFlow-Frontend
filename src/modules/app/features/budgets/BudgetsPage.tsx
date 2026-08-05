import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ListFilter, Plus, WalletCards } from "lucide-react";

import { BudgetOverview } from "./components/BudgetOverview";
import { BudgetItem, type BudgetItemData } from "./components/BudgetItem";

import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

const MOCK_BUDGETS: BudgetItemData[] = [
    {
        id: "1",
        name: "Food",
        amountLabel: "$120.00",
        updatedLabel: "Updated a minute ago",
        tags: ["Monthly", "Category", "Expense", "Wallet"],
        status: "exceeded",
    },
    {
        id: "2",
        name: "Credit card",
        amountLabel: "$500.00",
        updatedLabel: "Updated 2 hours ago",
        tags: ["Monthly", "Category", "Expense", "Wallet"],
        status: "healthy",
    },
    {
        id: "3",
        name: "Savings",
        amountLabel: "$200.00",
        updatedLabel: "Updated yesterday",
        tags: ["Monthly", "Category", "Expense", "Wallet"],
        status: "critical",
    },
    {
        id: "4",
        name: "Entertainment",
        amountLabel: "$80.00",
        updatedLabel: "Updated 3 days ago",
        tags: ["Monthly", "Category", "Expense", "Wallet"],
        status: "warning",
    },
];

export const BudgetsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filteredBudgets = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return MOCK_BUDGETS;
        }

        return MOCK_BUDGETS.filter((budget) => {
            const inName = budget.name.toLowerCase().includes(query);
            const inTags = budget.tags.some((tag) =>
                tag.toLowerCase().includes(query),
            );
            return inName || inTags;
        });
    }, [search]);

    return (
        <div className="flex flex-col h-full min-h-0 px-6 py-5">
            <BudgetOverview
                improvementPercent={50}
                fromAmount="$500"
                toAmount="$250"
            />

            <section className="flex flex-col flex-1 min-h-0">
                <h2 className="text-lg font-semibold text-light mb-4">
                    Active budgets ({filteredBudgets.length})
                </h2>

                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <div className="flex gap-3 flex-1   ">
                        <SearchInput
                            id="txtSearchBudgets"
                            placeholder="Search budgets..."
                            className="max-w-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            type="button"
                            aria-label="Filter budgets"
                            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-light-10 bg-surface text-helper hover:text-light hover:bg-secondary transition-colors cursor-pointer"
                        >
                            <ListFilter className="h-4 w-4" />
                        </button>
                    </div>

                    <Button
                        type="button"
                        text="Crear presupuesto"
                        icon={<Plus className="h-4 w-4" />}
                        onClick={() => undefined}
                    />
                </div>

                <div className="flex-1">
                    {filteredBudgets.length > 0 ? (
                        <div className="flex flex-col">
                            {filteredBudgets.map((budget) => (
                                <BudgetItem
                                    key={budget.id}
                                    budget={budget}
                                    onClick={() => {
                                        void navigate(`/app/budgets/${budget.id}`);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <CustomEmptyState
                            title={search.trim() ? "Sin resultados" : "Sin presupuestos"}
                            description={
                                search.trim()
                                    ? "Prueba con otro término de búsqueda"
                                    : "Crea tu primer presupuesto para controlar tus gastos."
                            }
                            Icon={WalletCards}
                        />
                    )}
                </div>

                {filteredBudgets.length > 0 && (
                    <button
                        type="button"
                        className="mt-6 inline-flex items-center justify-center gap-1.5 text-sm text-helper hover:text-light transition-colors cursor-pointer self-center"
                    >
                        Show more budgets
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}
            </section>
        </div>
    );
};
