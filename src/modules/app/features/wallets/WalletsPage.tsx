import { Link } from "react-router";
import { X } from "lucide-react";

import { NewTransactionModal } from "../newTransaction/NewTransactionModal";

import { WalletForm } from "./components/WalletForm";
import { WalletInvitationsButton } from "./components/WalletInvitationsButton";
import { WalletInvitationsSidebar } from "./components/WalletInvitationsSidebar";
import { WalletList } from "./components/WalletList";
import { WalletsHistoryList } from "./components/WalletsHistoryList";
import { WalletsHistoryPanel } from "./components/WalletsHistoryPanel";
import { useWalletsPage } from "./hooks/useWalletsPage";
import { WALLETS_TYPE_TABS } from "./utils/filters";

import { CustomModal } from "@/components/custom/CustomModal";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { TabFilter } from "@/components/controls/TabFilter";

export const WalletsPage = () => {
    const page = useWalletsPage();

    return (
        <div className="flex h-full min-h-0 flex-col @3xl:flex-row">
            <section className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-6">
                <div className="mb-5 flex flex-col justify-between gap-3 @6xl:flex-row">
                    <div className="flex flex-1 flex-wrap items-center gap-5">
                        <SearchInput
                            id="txtSearch"
                            placeholder="Buscar billetera..."
                            syncToParams
                        />
                        <TabFilter
                            options={WALLETS_TYPE_TABS}
                            selected={page.walletType}
                            keyFilter="walletType"
                            responsive="stretch"
                        />
                    </div>

                    <div className="flex flex-col gap-3 @md:flex-row @md:flex-wrap @md:items-center">
                        <WalletInvitationsButton
                            count={page.pendingInvitationsCount}
                            onClick={page.openInvitations}
                            className="w-full @md:w-auto"
                        />

                        <div className="grid w-full grid-cols-1 gap-2 @[22rem]:grid-cols-2 @3xl:flex @3xl:w-auto">
                            <button
                                type="button"
                                onClick={page.openHistory}
                                className="w-full cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 @3xl:hidden"
                            >
                                Ver historial
                            </button>

                            <Button
                                type="button"
                                onClick={page.openCreateModal}
                                text="Crear billetera"
                                className="w-full @3xl:w-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <WalletList
                        wallets={page.wallets}
                        isLoading={page.isLoadingWallets}
                        query={page.query}
                        walletType={page.walletType}
                        ownerLabel={page.ownerLabel}
                        showCreateButton={page.showCreateButton}
                        onCreate={page.openCreateModal}
                    />
                </div>

                {!page.isLoadingWallets && page.totalWallets > 0 && (
                    <div className="mt-4 flex flex-col items-center gap-3 border-t border-light-10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <PaginationSelect
                            totalItems={page.totalWallets}
                            numberOfElements={page.numberOfElements}
                        />
                        <Pagination totalPages={page.totalPages} />
                    </div>
                )}
            </section>

            <aside className="hidden min-h-0 w-80 shrink-0 flex-col border-l border-light-10 @3xl:flex @5xl:w-96">
                <WalletsHistoryPanel
                    history={page.history}
                    isLoading={page.isLoadingHistory}
                    actionsDisabled={page.isDuplicating}
                    onViewDetails={page.handleViewDetails}
                    onDuplicate={page.handleDuplicate}
                />
            </aside>

            <button
                type="button"
                aria-label="Cerrar historial"
                onClick={page.closeHistory}
                className={`fixed inset-0 z-40 bg-surface-hard/70 transition-opacity @3xl:hidden ${
                    page.isHistoryOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            />
            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-light-10 bg-surface transition-transform duration-300 ease-out @3xl:hidden ${
                    page.isHistoryOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-light-10 px-4 py-4">
                    <h2 className="text-lg font-semibold text-light">Historial</h2>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/app/history"
                            className="text-sm font-medium text-primary transition-colors hover:opacity-80"
                        >
                            Ver más
                        </Link>
                        <button
                            type="button"
                            onClick={page.closeHistory}
                            aria-label="Cerrar historial"
                            className="cursor-pointer rounded-lg p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    <WalletsHistoryList
                        history={page.history}
                        isLoading={page.isLoadingHistory}
                        actionsDisabled={page.isDuplicating}
                        onViewDetails={page.handleViewDetails}
                        onDuplicate={page.handleDuplicate}
                    />
                </div>
            </aside>

            <CustomModal
                isModalOpen={page.isModalOpen}
                setIsModalOpen={page.setIsModalOpen}
                title="Nueva billetera"
                maxWidth="max-w-md"
            >
                <WalletForm
                    key={page.isModalOpen ? "open" : "closed"}
                    onSuccess={page.closeCreateModal}
                />
            </CustomModal>

            <WalletInvitationsSidebar
                isOpen={page.isInvitationsOpen}
                onClose={page.closeInvitations}
            />

            <NewTransactionModal
                isModalOpen={Boolean(page.viewTransaction)}
                setIsModalOpen={(open) => {
                    if (!open) {
                        page.closeViewTransaction();
                    }
                }}
                mode="view"
                transaction={page.viewTransaction}
            />
        </div>
    );
};
