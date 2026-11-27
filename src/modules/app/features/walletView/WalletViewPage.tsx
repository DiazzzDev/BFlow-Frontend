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
import { WalletRecurringPanel } from "./components/panel/WalletRecurringPanel";
import { isManagementTab, getWalletAllowedTransactionTypes } from "./utils/tabs/walletViewTabs";
import { NewTransactionModal } from "../../components/newTransaction/NewTransactionModal";
import { ScheduleTransactionModal } from "../../components/scheduleTransaction/ScheduleTransactionModal";
import { DeleteTransactionModal } from "./components/modal/DeleteTransactionModal";
import { DeleteWalletModal } from "./components/modal/DeleteWalletModal";
import { InviteWalletMemberModal } from "./components/modal/InviteWalletMemberModal";
import { RemoveWalletMemberModal } from "./components/modal/RemoveWalletMemberModal";
import { useDeleteRecurring } from "../../components/scheduleTransaction/hooks/useMutateRecurring";
import type { Recurring } from "../../components/scheduleTransaction/interfaces/Recurring";
import { CustomModal } from "@/components/custom/CustomModal";
import { Button } from "@/components/controls/Button";
import { toast } from "sonner";

import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import type { Transaction } from "@/modules/app/interfaces/Transaction";
import type { WalletMember } from "./interfaces/WalletMember";

export const WalletViewPage = () => {
    const { t } = useTranslation();
    const { id = "" } = useParams<{ id: string }>();
    const view = useWalletViewPage(id);
    const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<WalletMember | null>(null);
    const [isDeleteWalletOpen, setIsDeleteWalletOpen] = useState(false);
    const [editRecurring, setEditRecurring] = useState<Recurring | null>(null);
    const [deleteRecurring, setDeleteRecurring] = useState<Recurring | null>(null);
    const deleteRecurringMutation = useDeleteRecurring();
    const allowedTypes = getWalletAllowedTransactionTypes(view.memberCount);

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
                        onInviteMember={() => setIsInviteOpen(true)}
                        onRemoveMember={setMemberToRemove}
                    />
                ) : view.activeTab === "settings" ? (
                    <WalletSettingsPanel
                        wallet={view.wallet}
                        isLoading={view.isWalletLoading}
                        onDeleteWallet={() => setIsDeleteWalletOpen(true)}
                    />
                ) : view.activeTab === "recurring" ? (
                    <WalletRecurringPanel
                        recurring={view.recurring}
                        isLoading={view.isLoadingRecurring}
                        currency={view.wallet?.currency ?? "USD"}
                    />
                ) : (
                    <WalletTransactionsPanel
                        query={view.query}
                        transactions={view.transactions}
                        isLoading={view.isLoadingList}
                        currency={view.wallet?.currency}
                        showCategory={view.activeTab !== "transfers"}
                        showRegisteredBy={view.memberCount > 1}
                        totalTransactions={view.totalTransactions}
                        numberOfElements={view.numberOfElements}
                        totalPages={view.totalPages}
                        onCreateTransaction={() => setIsNewTransactionOpen(true)}
                        onEditTransaction={setEditTransaction}
                        onDeleteTransaction={setDeleteTransaction}
                    />
                )}
            </section>

            <WalletInfoPanel
                isDesktopOpen={isInfoPanelOpen}
                isMobileOpen={isInfoDrawerOpen}
                onCloseMobile={() => setIsInfoDrawerOpen(false)}
                onSchedule={() => setIsScheduleOpen(true)}
                sidebarProps={{
                    ...view.sidebar,
                    onEditRecurring: setEditRecurring,
                    onDeleteRecurring: setDeleteRecurring,
                }}
            />

            <NewTransactionModal isModalOpen={isNewTransactionOpen} setIsModalOpen={setIsNewTransactionOpen} walletId={id} initialType={view.transactionType} allowedTypes={allowedTypes} />

            <NewTransactionModal isModalOpen={Boolean(editTransaction)} setIsModalOpen={(open) => { if (!open) { setEditTransaction(null); } }} mode="edit" transaction={editTransaction} />

            <DeleteTransactionModal transaction={deleteTransaction} onClose={() => setDeleteTransaction(null)} />
            <ScheduleTransactionModal isModalOpen={isScheduleOpen} setIsModalOpen={setIsScheduleOpen} walletId={id} />
            <ScheduleTransactionModal isModalOpen={Boolean(editRecurring)} setIsModalOpen={(open) => { if (!open) setEditRecurring(null); }} walletId={id} recurring={editRecurring} />
            <InviteWalletMemberModal isOpen={isInviteOpen} walletId={id} walletName={view.wallet?.name} onClose={() => setIsInviteOpen(false)} />
            <RemoveWalletMemberModal isOpen={Boolean(memberToRemove)} walletId={id} member={memberToRemove} onClose={() => setMemberToRemove(null)} />
            <DeleteWalletModal isOpen={isDeleteWalletOpen} walletId={id} walletName={view.wallet?.name ?? ""} onClose={() => setIsDeleteWalletOpen(false)} />
            <CustomModal isModalOpen={Boolean(deleteRecurring)} setIsModalOpen={(open) => { if (!open) setDeleteRecurring(null); }} title={t("transactions.delete")}>
                <div className="space-y-5"><p className="text-sm text-helper">{t("walletView.deleteRecurringHint", { title: deleteRecurring?.title ?? "" })}</p><div className="flex justify-end gap-3"><Button type="button" variant="outline" text={t("common.cancel")} onClick={() => setDeleteRecurring(null)} /><Button type="button" variant="danger" text={t("transactions.delete")} disabled={deleteRecurringMutation.isPending} onClick={() => { if (!deleteRecurring) return; const promise = deleteRecurringMutation.mutateAsync({ id: deleteRecurring.id, walletId: id }); toast.promise(promise, { loading: t("common.loading"), success: t("transactions.deleteFallback"), error: (error: Error) => error.message }); void promise.then(() => setDeleteRecurring(null)); }} /></div></div>
            </CustomModal>
        </div>
    );
};
