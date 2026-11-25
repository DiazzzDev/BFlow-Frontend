import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    acceptWalletInvitation,
    cancelWalletInvitation,
    declineWalletInvitation,
    deleteWallet,
    getWalletInvitations,
    getWallets,
    patchWallet,
    postWallet,
    postWalletInvitation,
} from "@/modules/app/features/wallets/wallets.service";
import type { CreateWalletData, UpdateWalletData } from "@/modules/app/interfaces/Wallet";

const apiRequestMock = vi.hoisted(() => vi.fn());

vi.mock("@/utils/api", async (importOriginal) => {
    const original = await importOriginal<typeof import("@/utils/api")>();
    return { ...original, apiRequest: apiRequestMock };
});

describe("wallets service requests", () => {
    beforeEach(() => {
        apiRequestMock.mockReset().mockResolvedValue({ success: true, data: [] });
    });

    it("builds list requests with scope, paging, and a trimmed search", async () => {
        await getWallets({ scope: "SHARED", query: "  household  ", page: 2, size: 10 });

        const [url, options] = apiRequestMock.mock.calls[0] as [string, RequestInit];
        expect(url).toContain("/api/v1/wallets?");
        expect(new URL(url).searchParams.get("scope")).toBe("SHARED");
        expect(new URL(url).searchParams.get("query")).toBe("household");
        expect(new URL(url).searchParams.get("page")).toBe("2");
        expect(new URL(url).searchParams.get("size")).toBe("10");
        expect(options.method).toBe("GET");
    });

    it("sends create and update payloads to the selected wallet endpoints", async () => {
        const createData: CreateWalletData = {
            name: "Emergency fund",
            description: "Savings",
            currency: "USD",
            initialValue: 150,
        };
        const updateData: UpdateWalletData = {
            name: "Renamed fund",
            description: "Updated savings",
        };

        await postWallet(createData);
        expect(apiRequestMock.mock.calls[0][0]).toContain("/api/v1/wallets");
        expect((apiRequestMock.mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(createData));

        await patchWallet("wallet-123", updateData);
        expect(apiRequestMock.mock.calls[1][0]).toContain("/api/v1/wallets/wallet-123");
        expect((apiRequestMock.mock.calls[1][1] as RequestInit).method).toBe("PATCH");
        expect((apiRequestMock.mock.calls[1][1] as RequestInit).body).toBe(JSON.stringify(updateData));
    });

    it("uses delete and invitation endpoints for wallet lifecycle actions", async () => {
        await deleteWallet("wallet-123");
        await getWalletInvitations();
        await acceptWalletInvitation("invite-1");
        await declineWalletInvitation("invite-2");
        await cancelWalletInvitation("invite-3");
        await postWalletInvitation("wallet-123", { invitedEmail: "member@example.test" });

        const urls = apiRequestMock.mock.calls.map(([url]) => String(url));
        expect(urls[0]).toContain("/api/v1/wallets/wallet-123");
        expect(urls[1]).toContain("/api/v1/wallets/invitations");
        expect(urls[2]).toContain("/api/v1/wallets/invitations/id/invite-1/accept");
        expect(urls[3]).toContain("/api/v1/wallets/invitations/id/invite-2/reject");
        expect(urls[4]).toContain("/api/v1/wallets/invitations/invite-3");
        expect(urls[5]).toContain("/api/v1/wallets/wallet-123/invitations");
        expect((apiRequestMock.mock.calls[5][1] as RequestInit).method).toBe("POST");
    });
});
