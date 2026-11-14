import type { InternalUser } from "@/auth/InternalUser";
import type { Wallet } from "@/modules/app/interfaces/Wallet";
import type { Transaction } from "@/modules/app/interfaces/Transaction";
import type { WalletInvitation } from "@/modules/app/features/wallets/interfaces/WalletInvitation";

export const ownerUser = {
    id: "user-owner",
    email: "owner@example.test",
    roles: ["USER"],
    isNewUser: false,
    name: "Wallet Owner",
    pictureUrl: null,
    language: "es",
    subscription: {
        id: null,
        planCode: "FREE",
        planName: "Free",
        status: "ACTIVE",
        billingAmount: null,
        startsAt: null,
        endsAt: null,
        nextBillingAt: null,
    },
    plan: null,
    wallets: [],
    profile: null,
    accountPendingDeletion: false,
    deletionDaysRemaining: null,
    status: "ACTIVE",
    deletionScheduledAt: null,
} satisfies InternalUser;

export const wallet: Wallet = {
    id: "wallet-personal",
    name: "Personal wallet",
    description: "Daily spending",
    currency: "USD",
    initialValue: 500,
    balance: 620.5,
    createdAt: "2025-01-15T12:00:00Z",
    updatedAt: "2025-01-15T12:00:00Z",
    role: "OWNER",
    memberCount: 1,
};

export const sharedWallet: Wallet = {
    ...wallet,
    id: "wallet-shared",
    name: "Shared household",
    role: "MEMBER",
    memberCount: 2,
};

export const transaction: Transaction = {
    id: "transaction-1",
    type: "EXPENSE",
    title: "Groceries",
    description: "Weekly groceries",
    amount: -45,
    date: "2025-01-15",
    walletId: wallet.id,
    walletName: wallet.name,
    counterpartWalletId: null,
    counterpartWalletName: null,
    categoryId: "category-food",
    categoryName: "Food",
    categoryIcon: "shopping-cart",
    categoryColor: "#22C55E",
    contributorId: ownerUser.id,
    contributorName: "Wallet Owner",
    contributorEmail: ownerUser.email,
    contributorPictureUrl: null,
    status: "CONFIRMED",
    source: "manual",
};

export const invitation: WalletInvitation = {
    id: "invitation-1",
    walletId: wallet.id,
    walletName: "Shared household",
    invitedEmail: ownerUser.email,
    invitedByName: "Alex Collaborator",
    invitedByEmail: "alex@example.test",
    invitedByPictureUrl: null,
    status: "PENDING",
    expiresAt: "2099-01-01T00:00:00Z",
};

export const paginated = <T,>(content: T[]) => ({
    success: true,
    message: "OK",
    data: {
        totalElements: content.length,
        totalPages: content.length > 0 ? 1 : 0,
        numberOfElements: content.length,
        pageable: {
            unpaged: false,
            pageNumber: 0,
            paged: true,
            pageSize: 5,
            offset: 0,
            sort: { unsorted: true, sorted: false, empty: true },
        },
        size: 5,
        content,
        number: 0,
        sort: { unsorted: true, sorted: false, empty: true },
        first: true,
        last: true,
        empty: content.length === 0,
    },
    timestamp: "2026-11-13T00:00:00Z",
    path: "/test",
});

export const apiResponse = <T,>(data: T) => ({
    success: true,
    message: "OK",
    data,
});
