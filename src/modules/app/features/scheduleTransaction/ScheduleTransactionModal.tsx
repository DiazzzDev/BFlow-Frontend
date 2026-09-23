import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useGetWallets } from "../wallets/hooks/useGetWallets";

import { RecurringForm } from "./forms/RecurringForm";

import type { Wallet } from "@/modules/app/interfaces/Wallet";
import { CustomModal } from "@/components/custom/CustomModal";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSelect } from "@/hooks/useAutoSelect";

const EMPTY_WALLETS: Wallet[] = [];

interface ScheduleTransactionModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    walletId?: string;
    /** When true (or when no walletId), show a wallet picker. */
    requireWalletSelect?: boolean;
}

// Shell: optional wallet picker + remount form when the modal opens
export const ScheduleTransactionModal = ({
    isModalOpen,
    setIsModalOpen,
    walletId = "",
    requireWalletSelect,
}: ScheduleTransactionModalProps) => {
    const { t } = useTranslation();

    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title={t("walletView.schedule")}
            maxWidth="max-w-lg"
        >
            <ScheduleTransactionModalContent
                key={isModalOpen ? "open" : "closed"}
                walletId={walletId}
                requireWalletSelect={requireWalletSelect}
                onClose={() => setIsModalOpen(false)}
            />
        </CustomModal>
    );
};

interface ScheduleTransactionModalContentProps {
    walletId: string;
    requireWalletSelect?: boolean;
    onClose: () => void;
}

const ScheduleTransactionModalContent = ({
    walletId,
    requireWalletSelect,
    onClose,
}: ScheduleTransactionModalContentProps) => {
    const { t } = useTranslation();
    const needsWalletSelect = requireWalletSelect ?? !walletId;

    // Wallet search (debounced) for the optional picker
    const [walletQuery, setWalletQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);
    const { data: walletsResponse, isFetching: isWalletsFetching } =
        useGetWallets("MINE", debouncedWalletQuery, 0, 20);
    const wallets = walletsResponse?.data.content ?? EMPTY_WALLETS;

    // UI selection: "auto" = first wallet; manual pick leaves auto mode
    const {
        selectedItem: selectedWallet,
        setSelection: setSelectedWallet,
    } = useAutoSelect(wallets, needsWalletSelect);

    const resolvedWalletId = needsWalletSelect
        ? (selectedWallet?.id ?? "")
        : walletId;

    return (
        <div className="flex flex-col gap-6">
            {needsWalletSelect && (
                <SelectAutoComplete<Wallet>
                    idSelect="scheduleWalletId"
                    label={t("transactions.wallet")}
                    placeholder={
                        isWalletsFetching
                            ? t("transactions.searchingWallets")
                            : t("transactions.searchWallet")
                    }
                    selectedItem={selectedWallet}
                    setSelectedItem={setSelectedWallet}
                    query={walletQuery}
                    setQuery={setWalletQuery}
                    data={wallets}
                    getKey={(wallet) => wallet.id}
                    getLabel={(wallet) => wallet.name}
                />
            )}

            {!resolvedWalletId && needsWalletSelect && (
                <p className="rounded-xl border border-dashed border-light-10 bg-surface-hard/40 px-4 py-6 text-center text-sm text-helper">
                    Seleccioná una cartera para continuar.
                </p>
            )}

            {resolvedWalletId ? (
                <RecurringForm
                    key={resolvedWalletId}
                    walletId={resolvedWalletId}
                    onSuccess={onClose}
                />
            ) : null}
        </div>
    );
};
