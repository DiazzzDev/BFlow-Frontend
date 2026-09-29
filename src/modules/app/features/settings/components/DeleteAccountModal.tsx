import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useDeleteAccount } from "../hooks/useDeleteAccount";

import { useLogout } from "@/auth/hooks/useLogout";
import { useAuthStore } from "@/auth/authStore";
import { CustomModal } from "@/components/custom/CustomModal";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
    const { t, i18n } = useTranslation();
    const [confirmation, setConfirmation] = useState("");
    const deleteAccountMutation = useDeleteAccount();
    const { mutateAsync: logout } = useLogout();
    const subscriptionStatus = useAuthStore((state) => state.user?.subscription.status);
    const hasActiveSubscription = ["ACTIVE", "PENDING_ACTIVATION", "PAST_DUE"].includes(
        subscriptionStatus ?? "",
    );
    const confirmationWord = i18n.language.startsWith("es") ? "ELIMINAR" : "DELETE";

    const handleConfirm = async () => {
        const promise = deleteAccountMutation.mutateAsync();

        toast.promise(promise, {
            loading: t("settings.deleteAccountLoading"),
            success: (response) => response.message || t("settings.deleteAccountSuccess"),
            error: (error) =>
                error instanceof Error ? error.message : t("settings.deleteAccountError"),
        });

        try {
            await promise;
            try {
                await logout();
            } catch {
                toast.error(t("settings.logoutError"));
            }
        } catch {
            // toast.promise already surfaces the error.
        }
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={t("settings.deleteAccountTitle")}
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-6">
                <p className="text-sm text-helper">
                    {t("settings.deleteAccountDescription")}
                </p>
                {hasActiveSubscription ? (
                    <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                        {t("settings.deleteAccountSubscriptionWarning")}
                    </p>
                ) : null}
                <div className="flex flex-col gap-2">
                    <label htmlFor="delete-account-confirmation" className="text-sm text-helper">
                        {t("settings.deleteAccountConfirmation", { word: confirmationWord })}
                    </label>
                    <input
                        id="delete-account-confirmation"
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        autoComplete="off"
                        className="rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light outline-none transition-colors focus:border-danger"
                    />
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={deleteAccountMutation.isPending}
                        onClick={() => {
                            setConfirmation("");
                            onClose();
                        }}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="button"
                        disabled={
                            deleteAccountMutation.isPending || confirmation !== confirmationWord
                        }
                        onClick={() => {
                            void handleConfirm();
                        }}
                        className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-danger-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleteAccountMutation.isPending
                            ? t("settings.deleteAccountLoading")
                            : t("settings.deleteAccount")}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
