import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CalendarClock, LogOut } from "lucide-react";

import BflowLogo from "@/assets/BFlow logo.svg";
import { useAuthStore } from "@/auth/authStore";
import { useLogout } from "@/auth/hooks/useLogout";
import { useRestoreAccount } from "@/auth/hooks/useRestoreAccount";
import { ACCOUNT_DELETION_GRACE_DAYS, getDaysUntilDeletion } from "@/auth/utils/accountDeletion";
import { getActiveLanguage } from "@/i18n/i18n";
import { getApiErrorMessage } from "@/utils/api/apiMessage";

export const AccountPendingDeletion = () => {
    const { t } = useTranslation();
    const deletionScheduledAt = useAuthStore((state) => state.user?.deletionScheduledAt ?? null);
    const deletionDaysRemaining = useAuthStore((state) => state.user?.deletionDaysRemaining ?? null);
    const { mutateAsync: restoreAccount, isPending: isRestoring } = useRestoreAccount();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const isBusy = isRestoring || isLoggingOut;

    const formattedDate = deletionScheduledAt
        ? new Intl.DateTimeFormat(getActiveLanguage(), { dateStyle: "long" }).format(new Date(deletionScheduledAt))
        : null;
    const daysRemaining = deletionDaysRemaining ??
        (deletionScheduledAt ? getDaysUntilDeletion(deletionScheduledAt) : null);

    const handleRestore = async () => {
        try {
            await toast.promise(restoreAccount(), {
                loading: t("auth.restoringAccount"),
                success: t("auth.restoreAccountSuccess"),
                error: (error) => getApiErrorMessage(error, t("auth.restoreAccountError")),
            }).unwrap();
        } catch {
            // Error handled by toast
        }
    };

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-12 text-light fixed inset-0 z-999 bg-light-90/80 backdrop-blur-sm">
            <section className="w-full max-w-md rounded-2xl border border-light-10 bg-surface p-8 text-center shadow-custom">
                <img src={BflowLogo} alt="" className="mx-auto h-8 w-auto" />

                <h1 className="mt-6 text-xl font-bold tracking-tight">{t("auth.pendingDeletionTitle")}</h1>
                <p className="mt-2 text-sm leading-relaxed text-helper">
                    {formattedDate
                        ? daysRemaining !== null
                            ? t("auth.pendingDeletionDescriptionWithDays", {
                                date: formattedDate,
                                days: daysRemaining,
                            })
                            : t("auth.pendingDeletionDescription", { date: formattedDate })
                        : t("auth.pendingDeletionDescriptionNoDate", {
                            days: daysRemaining ?? ACCOUNT_DELETION_GRACE_DAYS,
                        })}
                </p>

                {daysRemaining !== null ? (
                    <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-lg border border-light-10 bg-surface-hard px-3 py-1.5 text-sm font-medium text-light">
                        <CalendarClock className="h-4 w-4 text-helper" aria-hidden="true" />
                        {t("auth.pendingDeletionDaysLeft", { count: daysRemaining })}
                    </p>
                ) : null}

                <div className="mt-7 flex flex-col gap-2">
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleRestore()}
                        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isRestoring ? t("auth.restoringAccount") : t("auth.restoreAccount")}
                    </button>
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => logout()}
                        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-light-10 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? t("settings.loggingOut") : t("settings.logout")}
                    </button>
                </div>
            </section>
        </main>
    );
};
