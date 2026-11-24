import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { WalletForm } from "@/modules/app/features/wallets/components/WalletForm";
import { renderWithAppProviders } from "../../../testUtils";
import i18n from "@/i18n/i18n";

const mutations = vi.hoisted(() => ({
    createWallet: {
        isPending: false,
        mutateAsync: vi.fn(),
    },
}));

vi.mock("@/modules/app/features/wallets/hooks/useMutateWallets", () => ({
    useMutateWallets: () => mutations,
}));

vi.mock("sonner", () => ({
    toast: { promise: vi.fn() },
}));

describe("WalletForm", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("es");
        mutations.createWallet.mutateAsync.mockReset().mockResolvedValue({
            success: true,
            message: "Billetera creada",
            data: { id: "wallet-new" },
        });
    });

    it("requires a name and description before creating a wallet", async () => {
        const user = userEvent.setup();
        renderWithAppProviders(<WalletForm />);

        await user.click(screen.getByRole("button", { name: "Crear billetera" }));

        expect(await screen.findByText("El nombre es obligatorio")).toBeInTheDocument();
        expect(screen.getByText("La descripción es obligatoria")).toBeInTheDocument();
        expect(mutations.createWallet.mutateAsync).not.toHaveBeenCalled();
    });

    it("creates the wallet with a numeric balance and USD currency", async () => {
        const user = userEvent.setup();
        const onSuccess = vi.fn();
        renderWithAppProviders(<WalletForm onSuccess={onSuccess} />);

        await user.type(screen.getByLabelText("Nombre de la billetera"), "Travel fund");
        await user.type(screen.getByLabelText("Descripción"), "Savings for travel");
        await user.clear(screen.getByLabelText("Balance inicial"));
        await user.type(screen.getByLabelText("Balance inicial"), "1250.50");
        await user.click(screen.getByRole("button", { name: "Crear billetera" }));

        await waitFor(() => {
            expect(mutations.createWallet.mutateAsync).toHaveBeenCalledWith({
                name: "Travel fund",
                description: "Savings for travel",
                currency: "USD",
                initialValue: 1250.5,
            });
        });
        expect(onSuccess).toHaveBeenCalledOnce();
    });
});
