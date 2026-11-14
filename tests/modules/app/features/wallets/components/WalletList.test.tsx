import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WalletList } from "@/modules/app/features/wallets/components/WalletList";
import { sharedWallet, wallet } from "../fixtures";
import { renderWithAppProviders } from "../../../testUtils";
import i18n from "@/i18n/i18n";

describe("WalletList", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("es");
    });

    it("renders wallets as links to their detail pages", () => {
        renderWithAppProviders(
            <WalletList
                wallets={[wallet, sharedWallet]}
                isLoading={false}
                query=""
                walletType="MINE"
                ownerLabel="owner@example.test"
                showCreateButton
                onCreate={vi.fn()}
            />,
        );

        expect(screen.getByRole("link", { name: /Personal wallet/ }))
            .toHaveAttribute("href", "/app/wallets/wallet-personal");
        expect(screen.getByRole("link", { name: /Shared household/ }))
            .toHaveAttribute("href", "/app/wallets/wallet-shared");
    });

    it("shows a create action only for an empty unfiltered owned-wallet list", async () => {
        const onCreate = vi.fn();
        const user = userEvent.setup();

        renderWithAppProviders(
            <WalletList
                wallets={[]}
                isLoading={false}
                query=""
                walletType="MINE"
                ownerLabel="owner@example.test"
                showCreateButton
                onCreate={onCreate}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Crear billetera" }));
        expect(onCreate).toHaveBeenCalledOnce();
    });

    it("shows search-specific empty feedback without a create action", () => {
        renderWithAppProviders(
            <WalletList
                wallets={[]}
                isLoading={false}
                query="unknown"
                walletType="MINE"
                ownerLabel="owner@example.test"
                showCreateButton={false}
                onCreate={vi.fn()}
            />,
        );

        expect(screen.getByText("Sin resultados")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Crear billetera" })).toBeNull();
    });
});
