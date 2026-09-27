import { useTranslation } from "react-i18next";

import {
    getVisibleWalletViewTabs,
    type DetailTab,
} from "../utils/tabs/walletViewTabs";

import { SkeletonText } from "@/components/loaders/SkeletonText";

interface WalletViewTabsProps {
    activeTab: DetailTab;
    onChange: (tab: DetailTab) => void;
    className?: string;
    members: number;
    isLoading: boolean;
}

export const WalletViewTabs = ({
    activeTab,
    onChange,
    isLoading,
    members,
    className = "mb-5",
}: WalletViewTabsProps) => {
    const { t } = useTranslation();

    // Hide transfers until the wallet is known (shared wallets never show it)
    const tabs = getVisibleWalletViewTabs(members, {
        forceHideTransfers: isLoading,
    });

    return (
        <div className={`relative ${className}`}>
            <div className="overflow-x-auto border-b border-light-10 px-4 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-1">
                    {isLoading
                        ? tabs.map((tab) => (
                              <div
                                  key={`skeleton-${tab.id}`}
                                  className="px-3 py-2.5"
                              >
                                  <SkeletonText className="h-5 w-24" />
                              </div>
                          ))
                        : tabs.map((tab) => (
                              <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => onChange(tab.id)}
                                  className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${
                                      activeTab === tab.id
                                          ? "border-primary font-medium text-light"
                                          : "border-transparent text-helper hover:text-light"
                                  }`}
                              >
                                  {t(
                                      `walletView.${
                                          tab.id === "overview"
                                              ? "all"
                                              : tab.id === "incomes"
                                                ? "income"
                                                : tab.id === "expenses"
                                                  ? "expense"
                                                  : tab.id === "transfers"
                                                    ? "transfer"
                                                    : tab.id
                                      }`,
                                      { defaultValue: tab.label },
                                  )}
                              </button>
                          ))}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-surface-hard to-transparent @2xl:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-surface-hard to-transparent @2xl:hidden" />
        </div>
    );
};
