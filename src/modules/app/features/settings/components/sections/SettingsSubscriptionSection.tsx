import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

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
    } = useSettingsSubscription();

    return (
        <SettingsContentCard
            title={t("settings.subscription")}
        >
            {!subscription ? (
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
                                className="w-full sm:w-auto"
                            />
                        </div>

                        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-light">
                                    {t("settings.subscriptionHistory")}
                                </h3>
                                <p className="mt-1 text-sm text-helper">
                                    {t("settings.subscriptionHistoryDescription")}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                text={t("settings.subscriptionViewHistory")}
                                icon={<ChevronRight className="h-4 w-4" />}
                                iconPosition="end"
                                className="w-full sm:w-auto"
                            />
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
