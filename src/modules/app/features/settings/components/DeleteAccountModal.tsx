import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CalendarClock } from "lucide-react";

import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { useSettingsSubscription } from "../hooks/useSettingsSubscription";

import { useLogout } from "@/auth/hooks/useLogout";
import { ACCOUNT_DELETION_GRACE_DAYS } from "@/auth/utils/accountDeletion";
import { CustomModal } from "@/components/custom/CustomModal";
import { getApiErrorMessage } from "@/utils/api/apiMessage";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
    const { t } = useTranslation();
    const [confirmation, setConfirmation] = useState("");
    const { mutateAsync: deleteAccount, isPending: isDeleting } = useDeleteAccount();
    const { mutateAsync: logout } = useLogout();
    const { canCancel: hasActiveSubscription } = useSettingsSubscription();
    const confirmationWord = t("settings.deleteAccountWord");
    const isConfirmed = confirmation.trim().toUpperCase() === confirmationWord;

    const handleClose = () => {
        if (isDeleting) {
            return;
        }
        setConfirmation("");
        onClose();
    };

    const handleConfirm = async () => {
        try {
            await toast.promise(deleteAccount(), {
                loading: t("settings.deleteAccountLoading"),
                success: t("settings.deleteAccountSuccess", { days: ACCOUNT_DELETION_GRACE_DAYS }),
                error: (error) => getApiErrorMessage(error, t("settings.deleteAccountError")),
            }).unwrap();
        } catch {
            return;
        }

        try {
            await logout();
        } catch {
            toast.error(t("settings.logoutError"));
        }
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
            title={t("settings.deleteAccountModalTitle")}
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3 rounded-lg border border-light-10 bg-surface-hard p-3.5">
                    <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-helper" aria-hidden="true" />
                    <p className="text-sm text-light">
                        {t("settings.deleteAccountGracePeriod", { days: ACCOUNT_DELETION_GRACE_DAYS })}
                    </p>
                </div>

                <p className="text-sm text-helper">
                    {t("settings.deleteAccountPermanent", { days: ACCOUNT_DELETION_GRACE_DAYS })}
                </p>

                {hasActiveSubscription ? (
                    <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <p>{t("settings.deleteAccountSubscriptionWarning")}</p>
                    </div>
                ) : null}

                <div className="flex flex-col gap-2">
                    <label htmlFor="delete-account-confirmation" className="text-sm text-helper">
                        {t("settings.deleteAccountConfirmation", { word: confirmationWord })}
                    </label>
                    <input
                        id="delete-account-confirmation"
                        value={confirmation}
                        disabled={isDeleting}
                        onChange={(event) => setConfirmation(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        placeholder={confirmationWord}
                        className="rounded-lg border border-light-10 bg-surface-hard px-3 py-2 text-sm text-light outline-none transition-colors placeholder:text-placeholder focus:border-danger disabled:opacity-50"
                    />
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={handleClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("common.cancel")}
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting || !isConfirmed}
                        onClick={() => void handleConfirm()}
                        className="cursor-pointer rounded-lg bg-danger px-4 py-2 text-sm font-medium text-light transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? t("settings.deleteAccountLoading") : t("settings.deleteAccount")}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};
