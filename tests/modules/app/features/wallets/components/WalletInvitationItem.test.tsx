import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WalletInvitationItem } from "@/modules/app/features/wallets/components/WalletInvitationItem";
import { renderWithAppProviders } from "../../../testUtils";
import { invitation } from "../fixtures";
import i18n from "@/i18n/i18n";

const mutations = vi.hoisted(() => ({
    acceptInvitation: {
        isPending: false,
        variables: undefined as string | undefined,
        mutateAsync: vi.fn(),
    },
    declineInvitation: {
        isPending: false,
        variables: undefined as string | undefined,
        mutateAsync: vi.fn(),
    },
}));

vi.mock("@/modules/app/features/wallets/hooks/useMutateWalletInvitations", () => ({
    useMutateWalletInvitations: () => ({ ...mutations, inviteMember: {}, cancelInvitation: {} }),
}));

vi.mock("sonner", () => ({
    toast: { promise: vi.fn() },
}));

describe("WalletInvitationItem", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("es");
        mutations.acceptInvitation.mutateAsync.mockReset().mockResolvedValue({ success: true });
        mutations.declineInvitation.mutateAsync.mockReset().mockResolvedValue({ success: true });
    });

    it("lets the user accept a valid invitation", async () => {
        const user = userEvent.setup();
        renderWithAppProviders(<WalletInvitationItem invitation={invitation} />);

        await user.click(screen.getByRole("button", { name: "Unirme" }));

        expect(mutations.acceptInvitation.mutateAsync).toHaveBeenCalledWith(invitation.id);
    });

    it("prevents accepting an expired invitation while allowing rejection", async () => {
        const user = userEvent.setup();
        renderWithAppProviders(
            <WalletInvitationItem
                invitation={{ ...invitation, expiresAt: "2000-01-01T00:00:00Z" }}
            />,
        );

        expect(screen.getByRole("button", { name: "Expirada" })).toBeDisabled();
        await user.click(screen.getByRole("button", { name: "Rechazar" }));

        expect(mutations.acceptInvitation.mutateAsync).not.toHaveBeenCalled();
        expect(mutations.declineInvitation.mutateAsync).toHaveBeenCalledWith(invitation.id);
    });
});
