import { Link } from "react-router";
import { ChevronRight, Receipt, Users, Wallet, X } from "lucide-react";

import { NewTransactionModal } from "../newTransaction/NewTransactionModal";

import { WalletItem } from "./components/WalletItem";
import { WalletItemSkeleton } from "./components/WalletItemSkeleton";
import { HistoryItem } from "./components/HistoryItem";
import { HistoryItemSkeleton } from "./components/HistoryItemSkeleton";
import { WalletForm } from "./components/WalletForm";
import { WalletInvitationsButton } from "./components/WalletInvitationsButton";
import { WalletInvitationsSidebar } from "./components/WalletInvitationsSidebar";
import {
    useWalletsPage,
} from "./hooks/useWalletsPage";
import { getEmptyDescription, getEmptyTitle } from "./utils/walletsEmptyState";
import { WALLETS_TYPE_TABS } from "./utils/filters";

import { CustomModal } from "@/components/custom/CustomModal";
import { CustomEmptyState } from "@/components/custom/CustomEmptyState";
import { Pagination } from "@/components/Pagination";
import { PaginationSelect } from "@/components/PaginationSelect";
import { SearchInput } from "@/components/controls/SearchInput";
import { Button } from "@/components/controls/Button";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatMonthYear } from "@/utils/formatters/formatMonthYear";
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
                    {renderWalletList()}
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
                {renderHistoryPanel()}
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
                    {renderHistory()}
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

    function renderHistoryPanel() {
        return (
            <>
                <div className="mb-6 flex items-center justify-between gap-3 px-5 pt-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-light">
                        Historial
                    </h2>
                    <Link
                        to="/app/history"
                        className="text-sm font-medium text-primary transition-colors hover:opacity-80"
                    >
                        Ver más
                    </Link>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                    {renderHistory()}
                </div>
            </>
        );
    }

    function renderHistory() {
        if (page.isLoadingHistory) {
            return (
                <ul className="flex flex-col">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <HistoryItemSkeleton key={index} />
                    ))}
                </ul>
            );
        }

        if (page.history.length > 0) {
            return (
                <ul className="flex flex-col">
                    {page.history.map((transaction) => (
                        <HistoryItem
                            key={transaction.id}
                            transaction={transaction}
                            onViewDetails={page.handleViewDetails}
                            onDuplicate={page.handleDuplicate}
                            actionsDisabled={page.isDuplicating}
                        />
                    ))}
                </ul>
            );
        }

        return (
            <CustomEmptyState
                title="Sin historial"
                description="Cuando registres movimientos, aparecerán aquí."
                Icon={Receipt}
                className="m-0!"
            />
        );
    }

    function renderWalletList() {
        if (page.isLoadingWallets) {
            return (
                <section className="flex flex-col gap-3 overflow-x-hidden">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <WalletItemSkeleton key={index} />
                    ))}
                </section>
            );
        }

        if (page.wallets.length > 0) {
            return (
                <section className="flex flex-col gap-3">
                    {page.wallets.map((wallet) => (
                        <WalletItem key={wallet.id} to={`/app/wallets/${wallet.id}`}>
                            <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                                <div className="min-w-0 flex-1 sm:flex-[1.6]">
                                    <p className="truncate text-sm font-semibold text-light">
                                        {wallet.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-helper">
                                        {wallet.description || page.ownerLabel}
                                    </p>
                                    <p className="mt-2 truncate text-xs text-label sm:hidden">
                                        {wallet.currency}
                                        {" · "}
                                        {formatMonthYear(wallet.createdAt)}
                                    </p>
                                </div>

                                <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                    {wallet.currency}
                                </p>

                                <p className="hidden flex-1 truncate text-center text-sm text-helper sm:block">
                                    {formatMonthYear(wallet.createdAt)}
                                </p>

                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <p className="text-right text-sm font-semibold tabular-nums text-info">
                                        {formatCurrency(wallet.balance, wallet.currency)}
                                    </p>
                                    <ChevronRight className="h-5 w-5 text-helper sm:h-7 sm:w-7 sm:text-light" />
                                </div>
                            </div>
                        </WalletItem>
                    ))}
                </section>
            );
        }

        return (
            <CustomEmptyState
                title={getEmptyTitle(page.query, page.walletType)}
                description={getEmptyDescription(page.query, page.walletType)}
                Icon={page.walletType === "MINE" ? Wallet : Users}
                buttonText={page.showCreateButton ? "Crear billetera" : undefined}
                onButtonClick={
                    page.showCreateButton ? page.openCreateModal : undefined
                }
            />
        );
    }
};
