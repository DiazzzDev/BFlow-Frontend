import { useTranslation } from "react-i18next";
import { ChevronRight, RefreshCw } from "lucide-react";

import { useSettingsSubscription } from "../../hooks/useSettingsSubscription";

import { SettingsContentCard } from "./SettingsContentCard";

import { Button } from "@/components/controls/Button";

interface SettingsSubscriptionSectionProps {
    onCancelSubscription: () => void;
}

export const SettingsSubscriptionSection = ({
    onCancelSubscription,
}: SettingsSubscriptionSectionProps) => {
    const { t } = useTranslation();
    const {
        subscription,
        statusLabel,
        endDate,
        daysRemaining,
        canCancel,
        history,
        isLoading,
        isError,
        refetch,
    } = useSettingsSubscription();

    return (
        <SettingsContentCard
            title={t("settings.subscription")}
        >
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 w-44 rounded bg-light-10" />
                    <div className="h-20 rounded-xl bg-light-5" />
                </div>
            ) : !subscription ? (
                <p className="rounded-xl border border-light-10 bg-surface-hard/40 px-4 py-3 text-sm text-helper">
                    {t("settings.noSubscription")}
                </p>
            ) : (
                <div className="flex flex-col">
                    <div className="flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-base font-semibold text-light">
                                {subscription.planName}
                                {statusLabel ? (
                                    <span className="ml-2 rounded-full bg-primary-10 px-2 py-0.5 text-xs font-medium text-primary">
                                        {statusLabel}
                                    </span>
                                ) : null}
                            </p>
                            {endDate ? (
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.subscriptionEndsAt", { date: endDate })}
                                </p>
                            ) : null}
                        </div>
                        {daysRemaining !== null ? (
                            <div className="text-left sm:text-right">
                                <p className="text-3xl font-semibold tracking-tight text-light">
                                    {t("settings.subscriptionDays", { count: daysRemaining })}
                                </p>
                                <p className="text-sm text-helper">
                                    {t("settings.subscriptionDaysHint")}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <div className="divide-y divide-light-10 border-t border-light-10">
                        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.subscriptionPlansAndPayments")}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.subscriptionPlansAndPaymentsDescription")}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                text={t("settings.subscriptionViewPlans")}
                                icon={<ChevronRight className="h-4 w-4" />}
                                iconPosition="end"
                                href="/#pricing"
                                className="w-full sm:w-auto"
                            />
                        </div>

                        <div className="flex flex-col gap-4 py-5">
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.subscriptionHistory")}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.subscriptionHistoryDescription")}
                                </p>
                            </div>
                            {isError ? (
                                <Button type="button" variant="outline" text={t("common.retry")} icon={<RefreshCw className="h-4 w-4" />} onClick={() => { void refetch(); }} className="w-full sm:w-auto" />
                            ) : history.length > 0 ? (
                                <div className="overflow-x-auto rounded-xl border border-light-10">
                                    <table className="w-full min-w-170 text-left text-sm">
                                        <thead className="bg-light-5 text-xs uppercase tracking-wide text-helper">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 font-medium">{t("settings.subscriptionHistoryPlan")}</th>
                                                <th scope="col" className="px-4 py-3 font-medium">{t("settings.subscriptionHistoryStatus")}</th>
                                                <th scope="col" className="px-4 py-3 font-medium">{t("settings.subscriptionHistoryAmount")}</th>
                                                <th scope="col" className="px-4 py-3 font-medium">{t("settings.subscriptionHistoryStartedAt")}</th>
                                                <th scope="col" className="px-4 py-3 font-medium">{t("settings.subscriptionHistoryEndedAt")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-light-10">
                                            {history.map((item) => (
                                                <tr key={item.id ?? `${item.planCode}-${item.startsAt}`} className="transition-colors hover:bg-light-5/60">
                                                    <td className="px-4 py-3 font-medium text-light">{item.planName}</td>
                                                    <td className="px-4 py-3">
                                                        {item.status ? (
                                                            <span className="rounded-full bg-primary-10 px-2 py-1 text-xs font-medium text-primary">
                                                                {t(`subscription.status.${item.status}`)}
                                                            </span>
                                                        ) : "—"}
                                                    </td>
                                                    <td className="px-4 py-3 tabular-nums text-light">{item.billingAmount ?? "—"}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-helper">{item.startsAt ?? "—"}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-helper">{item.endsAt ?? t("settings.subscriptionHistoryOngoing")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : null}
                        </div>

                        {canCancel ? (
                            <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-light">
                                        {t("subscription.cancel")}
                                    </h3>
                                    <p className="mt-1 text-sm text-helper">
                                        {t("settings.subscriptionCancelDescription")}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    text={t("subscription.cancel")}
                                    onClick={onCancelSubscription}
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </SettingsContentCard>
    );
};
