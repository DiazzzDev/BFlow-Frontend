import { WALLET_VIEW_TABS, type DetailTab } from "../walletView.tabs";

interface WalletViewTabsProps {
    activeTab: DetailTab;
    onChange: (tab: DetailTab) => void;
    className?: string;
}

export const WalletViewTabs = ({ activeTab, onChange, className = "mb-5" }: WalletViewTabsProps) => {
    return (
        <div className={`relative ${className}`}>
            <div className="overflow-x-auto border-b border-light-10 px-4 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-1">
                    {WALLET_VIEW_TABS.map((tab) => (
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
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-surface-hard to-transparent @2xl:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-surface-hard to-transparent @2xl:hidden" />
        </div>
    );
};
