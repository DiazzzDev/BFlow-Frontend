import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router";

import { WalletsPage } from "@/modules/app/features/wallets/WalletsPage";
import { WalletViewPage } from "@/modules/app/features/walletView/WalletViewPage";
import type { WalletDetails } from "@/modules/app/features/walletView/interfaces/WalletDetails";
import type { WalletMember } from "@/modules/app/features/walletView/interfaces/WalletMember";
import type { WalletInvitation, CreateWalletInvitationData } from "@/modules/app/features/wallets/interfaces/WalletInvitation";
import type { WalletSentInvitation } from "@/modules/app/features/wallets/interfaces/WalletSentInvitation";
import type { WalletCollaborator } from "@/modules/app/features/wallets/interfaces/WalletCollaborator";
import type { GetWalletsParams } from "@/modules/app/features/wallets/wallets.service";
import type { CreateWalletData, UpdateWalletData, Wallet } from "@/modules/app/interfaces/Wallet";
import type { Transaction } from "@/modules/app/interfaces/Transaction";
import type { ApiResponse, PaginatedListResponse } from "@/utils/api";
import { useAuthStore } from "@/auth/authStore";
import i18n from "@/i18n/i18n";
import {
    apiResponse,
    invitation,
    ownerUser,
    paginated,
    sharedWallet,
    transaction,
    wallet,
} from "./fixtures";
import { createTestQueryClient } from "../../testUtils";

const services = vi.hoisted(() => ({
    getWallets: vi.fn<(params: GetWalletsParams) => Promise<PaginatedListResponse<Wallet>>>(),
    postWallet: vi.fn<(data: CreateWalletData) => Promise<Wallet>>(),
    patchWallet: vi.fn<(id: string, data: UpdateWalletData) => Promise<Wallet>>(),
    deleteWallet: vi.fn<(id: string) => Promise<unknown>>(),
    getWalletInvitations: vi.fn<() => Promise<ApiResponse<WalletInvitation[]>>>(),
    getSentWalletInvitations: vi.fn<(id: string) => Promise<ApiResponse<WalletSentInvitation[]>>>(),
    acceptWalletInvitation: vi.fn<(id: string) => Promise<ApiResponse<WalletInvitation>>>(),
    declineWalletInvitation: vi.fn<(id: string) => Promise<ApiResponse<WalletInvitation>>>(),
    cancelWalletInvitation: vi.fn<(id: string) => Promise<ApiResponse<string>>>(),
    postWalletInvitation: vi.fn<(id: string, data: CreateWalletInvitationData) => Promise<ApiResponse<WalletInvitation>>>(),
    searchWalletCollaborators: vi.fn<(id: string, query: string) => Promise<ApiResponse<WalletCollaborator[]>>>(),
    getHistory: vi.fn<() => Promise<PaginatedListResponse<Transaction>>>(),
    getWalletById: vi.fn<(id: string) => Promise<ApiResponse<Wallet>>>(),
    getWalletDetails: vi.fn<(id: string) => Promise<ApiResponse<WalletDetails>>>(),
    getWalletTransactions: vi.fn<(id: string, params: { type?: string }) => Promise<PaginatedListResponse<Transaction>>>(),
    getWalletMembers: vi.fn<(id: string) => Promise<ApiResponse<WalletMember[]>>>(),
    removeWalletMember: vi.fn<(walletId: string, memberId: string) => Promise<ApiResponse<string>>>(),
}));

vi.mock("@/modules/app/features/wallets/wallets.service", () => ({
    getWallets: services.getWallets,
    postWallet: services.postWallet,
    patchWallet: services.patchWallet,
    deleteWallet: services.deleteWallet,
    getWalletInvitations: services.getWalletInvitations,
    getSentWalletInvitations: services.getSentWalletInvitations,
    acceptWalletInvitation: services.acceptWalletInvitation,
    declineWalletInvitation: services.declineWalletInvitation,
    cancelWalletInvitation: services.cancelWalletInvitation,
    postWalletInvitation: services.postWalletInvitation,
    searchWalletCollaborators: services.searchWalletCollaborators,
}));

vi.mock("@/modules/app/features/walletView/walletView.service", () => ({
    getWalletById: services.getWalletById,
    getWalletDetails: services.getWalletDetails,
    getWalletTransactions: services.getWalletTransactions,
    getWalletMembers: services.getWalletMembers,
    removeWalletMember: services.removeWalletMember,
}));

vi.mock("@/modules/app/features/history/history.service", () => ({
    getHistory: services.getHistory,
}));

vi.mock("@/modules/app/features/wallets/hooks/useDuplicateTransaction", () => ({
    useDuplicateTransaction: () => ({
        duplicateTransaction: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("sonner", () => ({
    toast: { promise: vi.fn(), error: vi.fn() },
}));

let wallets: Wallet[];
let invitations = [invitation];
let members: WalletMember[];
let sentInvitations: WalletSentInvitation[];

const renderWalletRoutes = (initialEntry = "/app/wallets") => {
    const queryClient = createTestQueryClient();

    return {
        queryClient,
        ...render(
            <I18nextProvider i18n={i18n}>
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={[initialEntry]}>
                        <Routes>
                            <Route path="/app/wallets" element={<WalletsPage />} />
                            <Route path="/app/wallets/:id" element={<WalletViewPage />} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </I18nextProvider>,
        ),
    };
};

describe("wallets feature flow", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("es");
        useAuthStore.setState({ user: ownerUser, authStatus: "authenticated" });
        wallets = [wallet];
        invitations = [invitation];
        members = [
            {
                id: "member-owner",
                email: ownerUser.email,
                role: "OWNER",
                name: "Wallet Owner",
                pictureUrl: null,
                joinedAt: "2025-01-15T12:00:00Z",
            },
            {
                id: "member-collaborator",
                email: "collaborator@example.test",
                role: "MEMBER",
                name: "Collaborator",
                pictureUrl: null,
                joinedAt: "2025-02-01T12:00:00Z",
            },
        ];
        sentInvitations = [];

        Object.values(services).forEach((service) => service.mockReset());
        services.getWallets.mockImplementation(({ scope }: { scope: string }) =>
            Promise.resolve(paginated(scope === "SHARED" ? [sharedWallet] : wallets)),
        );
        services.postWallet.mockImplementation((data) => {
            const created = {
                ...wallet,
                ...data,
                id: "wallet-created",
                balance: data.initialValue,
            };
            wallets = [...wallets, created];
            return Promise.resolve(created);
        });
        services.patchWallet.mockImplementation((id, data) => {
            const updated = { ...wallets.find((item) => item.id === id)!, ...data };
            wallets = wallets.map((item) => item.id === id ? updated : item);
            return Promise.resolve(updated);
        });
        services.deleteWallet.mockImplementation((id) => {
            wallets = wallets.filter((item) => item.id !== id);
            return Promise.resolve(undefined);
        });
        services.getWalletInvitations.mockImplementation(() => Promise.resolve(apiResponse(invitations)));
        services.acceptWalletInvitation.mockImplementation((id) => {
            invitations = invitations.filter((item) => item.id !== id);
            return Promise.resolve(apiResponse(invitation));
        });
        services.declineWalletInvitation.mockResolvedValue(apiResponse(invitation));
        services.getSentWalletInvitations.mockImplementation(() => Promise.resolve(apiResponse(sentInvitations)));
        services.postWalletInvitation.mockImplementation((_walletId, data) => {
            sentInvitations = [...sentInvitations, {
                id: "sent-invitation",
                walletId: wallet.id,
                walletName: wallet.name,
                invitedEmail: data.invitedEmail,
                invitedUserId: null,
                invitedUserName: null,
                status: "PENDING",
                createdAt: "2026-11-13T12:00:00Z",
                expiresAt: "2099-01-01T00:00:00Z",
                respondedAt: null,
            }];
            return Promise.resolve(apiResponse(invitation));
        });
        services.cancelWalletInvitation.mockImplementation((id) => {
            sentInvitations = sentInvitations.filter((item) => item.id !== id);
            return Promise.resolve(apiResponse("canceled"));
        });
        services.searchWalletCollaborators.mockResolvedValue(apiResponse([]));
        services.getHistory.mockResolvedValue(paginated([]));
        services.getWalletById.mockImplementation((id) =>
            Promise.resolve(apiResponse(wallets.find((item) => item.id === id) ?? wallet)),
        );
        services.getWalletDetails.mockResolvedValue(apiResponse({
            lastActivity: "2025-01-15",
            highestExpense: "$45.00",
            transactions: 1,
            initialValue: 500,
            upcoming: [],
        }));
        services.getWalletTransactions.mockResolvedValue(paginated([transaction]));
        services.getWalletMembers.mockImplementation(() => Promise.resolve(apiResponse(members)));
        services.removeWalletMember.mockImplementation((_walletId, memberId) => {
            members = members.filter((item) => item.id !== memberId);
            return Promise.resolve(apiResponse("removed"));
        });
    });

    it("searches wallets and switches between owned and shared scopes", async () => {
        const user = userEvent.setup();
        renderWalletRoutes();

        expect(await screen.findByText("Personal wallet")).toBeInTheDocument();
        await user.type(screen.getByPlaceholderText("Buscar billetera..."), "Travel");

        await waitFor(() => {
            expect(services.getWallets).toHaveBeenCalledWith(expect.objectContaining({
                scope: "MINE",
                query: "Travel",
            }));
        }, { timeout: 2500 });

        await user.click(screen.getByRole("button", { name: "Compartidas" }));
        expect(await screen.findByText("Shared household")).toBeInTheDocument();
        expect(services.getWallets).toHaveBeenCalledWith(expect.objectContaining({
            scope: "SHARED",
            query: "Travel",
        }));
    });

    it("creates a wallet from the list and refreshes the rendered results", async () => {
        const user = userEvent.setup();
        renderWalletRoutes();

        await screen.findByText("Personal wallet");
        await user.click(screen.getByRole("button", { name: "Crear billetera" }));
        await user.type(screen.getByLabelText("Nombre de la billetera"), "Travel wallet");
        await user.type(screen.getByLabelText("Descripción"), "Trip savings");
        await user.clear(screen.getByLabelText("Balance inicial"));
        await user.type(screen.getByLabelText("Balance inicial"), "300");
        await user.click(screen.getAllByRole("button", { name: "Crear billetera" })[1]);

        expect(await screen.findByText("Travel wallet")).toBeInTheDocument();
        expect(services.postWallet).toHaveBeenCalledWith({
            name: "Travel wallet",
            description: "Trip savings",
            currency: "USD",
            initialValue: 300,
        });
    });

    it("accepts a received wallet invitation", async () => {
        const user = userEvent.setup();
        renderWalletRoutes();

        await screen.findByText("Personal wallet");
        await user.click(screen.getByRole("button", { name: /Invitaciones/ }));
        expect(await screen.findByText("Shared household")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Unirme" }));

        await waitFor(() => {
            expect(services.acceptWalletInvitation).toHaveBeenCalledWith("invitation-1");
        });
        await waitFor(() => {
            expect(screen.queryByText("Alex Collaborator")).not.toBeInTheDocument();
        });
    });

    it("invites a collaborator and removes a wallet member", async () => {
        const user = userEvent.setup();
        renderWalletRoutes("/app/wallets/wallet-personal");

        await user.click(await screen.findByRole("button", { name: "Miembros" }));
        expect(await screen.findByText("Collaborator")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Invitar" }));
        await user.type(screen.getByLabelText("Correo electrónico"), "New.Member@Example.com");
        const inviteButtons = screen.getAllByRole("button", { name: "Invitar" });
        await user.click(inviteButtons[inviteButtons.length - 1]);

        await waitFor(() => {
            expect(services.postWalletInvitation).toHaveBeenCalledWith("wallet-personal", {
                invitedEmail: "new.member@example.com",
            });
        });

        await user.click(await screen.findByRole("button", { name: "Cancelar" }));
        await waitFor(() => {
            expect(services.cancelWalletInvitation).toHaveBeenCalledWith("sent-invitation");
        });

        await user.click(screen.getByRole("button", { name: "Eliminar miembro Collaborator" }));
        await user.click(screen.getByRole("button", { name: "Eliminar miembro" }));
        await waitFor(() => {
            expect(services.removeWalletMember).toHaveBeenCalledWith(
                "wallet-personal",
                "member-collaborator",
            );
        });
        await waitFor(() => {
            expect(screen.queryByText("Collaborator")).not.toBeInTheDocument();
        });
    });

    it("opens a wallet, filters transactions, saves settings, and deletes it", async () => {
        const user = userEvent.setup();
        renderWalletRoutes();

        await user.click(await screen.findByRole("link", { name: /Personal wallet/ }));
        expect(await screen.findByText("Personal wallet", { selector: "h1" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Gastos" }));
        await waitFor(() => {
            expect(services.getWalletTransactions).toHaveBeenCalledWith(
                "wallet-personal",
                expect.objectContaining({ type: "EXPENSE" }),
            );
        });

        await user.click(screen.getByRole("button", { name: "Ajustes" }));
        const nameInput = screen.getByLabelText("Nombre");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated wallet");
        await user.click(screen.getByRole("button", { name: "Guardar cambios" }));
        await waitFor(() => {
            expect(services.patchWallet).toHaveBeenCalledWith("wallet-personal", {
                name: "Updated wallet",
                description: "Daily spending",
            });
        });

        await user.click(screen.getByRole("button", { name: "Eliminar billetera" }));
        await user.click(screen.getByRole("button", { name: /^Eliminar$/ }));
        await waitFor(() => {
            expect(services.deleteWallet).toHaveBeenCalledWith("wallet-personal");
        });
        expect(await screen.findByText("No tienes billeteras aún")).toBeInTheDocument();
    });
});
