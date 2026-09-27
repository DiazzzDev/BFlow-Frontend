import { useState } from "react";
import { useParams } from "react-router";
import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useWalletViewPage } from "./hooks/useWalletViewPage";
import { WalletViewHeader } from "./components/WalletViewHeader";
import { WalletViewTabs } from "./components/WalletViewTabs";
import { WalletTransactionsPanel } from "./components/panel/WalletTransactionsPanel";
import { WalletMembersPanel } from "./components/panel/WalletMembersPanel";
import { WalletSettingsPanel } from "./components/panel/WalletSettingsPanel";
import { WalletInfoPanel } from "./components/panel/WalletInfoPanel";
import { isManagementTab } from "./utils/tabs/walletViewTabs";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

export const WalletViewPage = () => {
    const { t } = useTranslation();
    const { id = "" } = useParams<{ id: string }>();
    const view = useWalletViewPage(id);
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

    if (view.isNotFound) {
        return (
            <CustomEmptyState
                title={t("walletView.notFound")}
                description={t("walletView.notFoundHint")}
                Icon={Receipt}
            />
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col @3xl:flex-row">
            <section className="@container flex min-h-0 min-w-0 flex-1 flex-col pt-5">
                <WalletViewHeader
                    name={view.wallet?.name}
                    balance={view.wallet?.balance}
                    currency={view.wallet?.currency}
                    isLoading={view.isWalletLoading}
                    isInfoPanelOpen={isInfoPanelOpen}
                    onOpenMobileInfo={() => setIsInfoDrawerOpen(true)}
                    onToggleDesktopInfo={() => setIsInfoPanelOpen((open) => !open)}
                />

                <WalletViewTabs
                    isLoading={view.isWalletLoading}
                    members={view.memberCount}
                    activeTab={view.activeTab}
                    onChange={view.setTab}
                    className={isManagementTab(view.activeTab) ? "" : "mb-5"}
                />

                {view.activeTab === "members" ? (
                    <WalletMembersPanel
                        wallet={view.wallet}
                        isLoading={view.isWalletLoading}
                    />
                ) : view.activeTab === "settings" ? (
                    <WalletSettingsPanel
                        wallet={view.wallet}
                        isLoading={view.isWalletLoading}
                    />
                ) : (
                    <WalletTransactionsPanel
                        walletId={id}
                        query={view.query}
                        transactions={view.transactions}
                        isLoading={view.isLoadingList}
                        currency={view.wallet?.currency}
                        showCategory={view.activeTab !== "transfers"}
                        showRegisteredBy={view.memberCount > 1}
                        initialType={view.transactionType}
                        totalTransactions={view.totalTransactions}
                        numberOfElements={view.numberOfElements}
                        totalPages={view.totalPages}
                        members={view.memberCount}
                    />
                )}
            </section>

            <WalletInfoPanel
                walletId={id}
                isDesktopOpen={isInfoPanelOpen}
                isMobileOpen={isInfoDrawerOpen}
                onCloseMobile={() => setIsInfoDrawerOpen(false)}
                sidebarProps={view.sidebar}
            />
        </div>
    );
};
