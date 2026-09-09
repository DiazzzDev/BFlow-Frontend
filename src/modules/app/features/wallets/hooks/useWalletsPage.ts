import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import type { Transaction } from "../../walletView/interfaces/Transaction";

import { useDuplicateTransaction } from "./useDuplicateTransaction";
import { useGetHistory } from "./useGetHistory";
import { useGetWalletInvitations } from "./useGetWalletInvitations";
import { useGetWallets } from "./useGetWallets";

import { useAuthStore } from "@/auth/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginationParams } from "@/hooks/usePaginationParams";

export type WalletTypeFilter = "MINE" | "SHARED";

const isWalletTypeFilter = (value: string | null): value is WalletTypeFilter =>
    value === "MINE" || value === "SHARED";

export const useWalletsPage = () => {
    const [params] = useSearchParams();
    const query = params.get("query") || "";
    const debouncedQuery = useDebounce(query, 500);
    const walletTypeParam = params.get("walletType");
    const walletType: WalletTypeFilter = isWalletTypeFilter(walletTypeParam)
        ? walletTypeParam
        : "MINE";
    const { apiPage, limit } = usePaginationParams();

    const { isLoading: isLoadingWallets, data: walletData } = useGetWallets(
        walletType,
        debouncedQuery,
        apiPage,
        limit,
    );
    const { isLoading: isLoadingHistory, data: historyData } = useGetHistory();
    const { data: invitationsResponse } = useGetWalletInvitations();
    const { duplicateTransaction, isPending: isDuplicating } =
        useDuplicateTransaction();
    const user = useAuthStore((state) => state.user);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isInvitationsOpen, setIsInvitationsOpen] = useState(false);
    const [viewTransaction, setViewTransaction] = useState<Transaction | null>(
        null,
    );

    const wallets = walletData?.data.content ?? [];
    const totalWallets = walletData?.data.totalElements ?? 0;
    const totalPages = walletData?.data.totalPages ?? 0;
    const numberOfElements =
        walletData?.data.numberOfElements ?? wallets.length;
    const history = historyData?.data.content ?? [];
    const invitations = invitationsResponse?.data ?? [];
    const pendingInvitationsCount = invitations.filter(
        (invitation) => invitation.status === "PENDING",
    ).length;
    const ownerLabel = user?.email || "—";
    const showCreateButton = walletType === "MINE" && !query.trim();

    const handleViewDetails = (transaction: Transaction) => {
        setViewTransaction(transaction);
    };

    const handleDuplicate = (transaction: Transaction) => {
        void duplicateTransaction(transaction);
    };

    const openCreateModal = () => setIsModalOpen(true);
    const closeCreateModal = () => setIsModalOpen(false);
    const openHistory = () => setIsHistoryOpen(true);
    const closeHistory = () => setIsHistoryOpen(false);
    const openInvitations = () => setIsInvitationsOpen(true);
    const closeInvitations = () => setIsInvitationsOpen(false);
    const closeViewTransaction = () => setViewTransaction(null);

    useEffect(() => {
        if (!isHistoryOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isHistoryOpen]);

    return {
        query,
        walletType,
        wallets,
        totalWallets,
        totalPages,
        numberOfElements,
        isLoadingWallets,
        history,
        isLoadingHistory,
        pendingInvitationsCount,
        ownerLabel,
        showCreateButton,
        isDuplicating,
        isModalOpen,
        setIsModalOpen,
        isHistoryOpen,
        isInvitationsOpen,
        viewTransaction,
        handleViewDetails,
        handleDuplicate,
        openCreateModal,
        closeCreateModal,
        openHistory,
        closeHistory,
        openInvitations,
        closeInvitations,
        closeViewTransaction,
    };
};
