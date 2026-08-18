import { BUDGET_VIEW_TABS, type BudgetViewTab } from "../budgetView.tabs";

interface BudgetViewTabsProps {
    activeTab: BudgetViewTab;
    onChange: (tab: BudgetViewTab) => void;
    className?: string;
}

export const BudgetViewTabs = ({
    activeTab,
    onChange,
    className = "mb-5",
}: BudgetViewTabsProps) => {
    return (
        <div className={`relative ${className}`}>
            <div className="overflow-x-auto border-b border-light-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-1">
                    {BUDGET_VIEW_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onChange(tab.id)}
                            className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${activeTab === tab.id
                                ? "border-primary font-medium text-light"
                                : "border-transparent text-helper hover:text-light"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
