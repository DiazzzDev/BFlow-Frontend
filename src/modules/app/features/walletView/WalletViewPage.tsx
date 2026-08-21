import { useState } from "react";
import { useParams } from "react-router";
import { Receipt } from "lucide-react";

import { NewTransactionModal } from "../../components/newTransaction/NewTransactionModal";

import { useWalletViewPage } from "./hooks/useWalletViewPage";
import { useWalletTransactionActions } from "./hooks/useWalletTransactionActions";
import { WalletViewHeader } from "./components/WalletViewHeader";
import { WalletViewTabs } from "./components/WalletViewTabs";
import { WalletTransactionsPanel } from "./components/WalletTransactionsPanel";
import { WalletSettingsPanel } from "./components/WalletSettingsPanel";
import { WalletInfoPanel } from "./components/WalletInfoPanel";
import { ScheduleTransactionModal } from "./components/ScheduleTransactionModal";
import { DeleteTransactionModal } from "./components/DeleteTransactionModal";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";

export const WalletViewPage = () => {
    const { id = "" } = useParams<{ id: string }>();
    const view = useWalletViewPage(id);
    const actions = useWalletTransactionActions();
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

    if (view.isNotFound) {
        return (
            <CustomEmptyState
                title="Billetera no encontrada"
                description="La billetera que buscas no existe o ya no tienes acceso."
                Icon={Receipt}
            />
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col @3xl:flex-row">
            <section className="flex min-h-0 min-w-0 flex-1 flex-col pt-5">
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
                    activeTab={view.activeTab}
                    onChange={view.setTab}
                    className={view.activeTab === "settings" ? "" : "mb-5"}
                />

                {view.activeTab === "settings" ? (
                    <WalletSettingsPanel
                        wallet={view.wallet}
                        isLoading={view.isWalletLoading}
                        initialValue={view.sidebar.initialValue}
                    />
                ) : (
                    <WalletTransactionsPanel
                        query={view.query}
                        transactions={view.transactions}
                        isLoading={view.isLoadingList}
                        currency={view.wallet?.currency}
                        showCategory={view.activeTab !== "transfers"}
                        totalTransactions={view.totalTransactions}
                        numberOfElements={view.numberOfElements}
                        totalPages={view.totalPages}
                        actionsDisabled={actions.isDuplicating || actions.isDeleting}
                        onNewTransaction={() => actions.setIsNewTransactionOpen(true)}
                        onEdit={actions.setEditTransaction}
                        onDelete={actions.setDeleteTransaction}
                        onDuplicate={(transaction) => {
                            void actions.duplicateTransaction(transaction);
                        }}
                    />
                )}
            </section>

            <WalletInfoPanel
                isDesktopOpen={isInfoPanelOpen}
                isMobileOpen={isInfoDrawerOpen}
                onCloseMobile={() => setIsInfoDrawerOpen(false)}
                sidebarProps={{
                    ...view.sidebar,
                    onSchedule: () => {
                        setIsInfoDrawerOpen(false);
                        actions.setIsScheduleOpen(true);
                    },
                }}
            />

            <NewTransactionModal
                isModalOpen={actions.isNewTransactionOpen}
                setIsModalOpen={actions.setIsNewTransactionOpen}
                walletId={id}
                initialType={view.transactionType}
            />

            <ScheduleTransactionModal
                isModalOpen={actions.isScheduleOpen}
                setIsModalOpen={actions.setIsScheduleOpen}
                walletId={id}
            />

            <NewTransactionModal
                isModalOpen={Boolean(actions.editTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        actions.setEditTransaction(null);
                    }
                }}
                mode="edit"
                transaction={actions.editTransaction}
            />

            <DeleteTransactionModal
                transaction={actions.deleteTransaction}
                isDeleting={actions.isDeleting}
                onClose={() => actions.setDeleteTransaction(null)}
                onConfirm={() => actions.handleConfirmDelete}
            />
        </div>
    );
};
