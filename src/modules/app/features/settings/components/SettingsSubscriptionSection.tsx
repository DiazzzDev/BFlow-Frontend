import { SubscriptionCancelButton } from "./SubscriptionCancelButton";

import { useSettingsSubscription } from "../hooks/useSettingsSubscription";

export const SettingsSubscriptionSection = () => {
    const {
        subscription,
        statusLabel,
        cancellationDate,
        renewalDate,
        billingAmount,
        canCancel,
        isCancelling,
        cancel,
    } = useSettingsSubscription();

    if (!subscription) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-light-10 bg-surface p-6 shadow-custom">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-base font-semibold text-light">Suscripción</h3>
                    <p className="mt-1 text-sm text-helper">
                        Plan actual: <span className="font-medium text-light">{subscription.planName}</span>
                        {statusLabel ? ` - ${statusLabel}` : ""}
                    </p>
                </div>
                {canCancel ? (
                    <SubscriptionCancelButton
                        isCancelling={isCancelling}
                        onCancel={cancel}
                    />
                ) : null}
            </div>

            {billingAmount || cancellationDate || renewalDate ? (
                <dl className="mt-5 grid gap-3 border-t border-light-10 pt-5 text-sm sm:grid-cols-3">
                    {billingAmount ? (
                        <div>
                            <dt className="text-helper">Precio</dt>
                            <dd className="mt-1 font-medium text-light">{billingAmount}</dd>
                        </div>
                    ) : null}
                    {renewalDate ? (
                        <div>
                            <dt className="text-helper">Próximo cobro</dt>
                            <dd className="mt-1 font-medium text-light">{renewalDate}</dd>
                        </div>
                    ) : null}
                    {cancellationDate ? (
                        <div>
                            <dt className="text-helper">Vigente hasta</dt>
                            <dd className="mt-1 font-medium text-light">{cancellationDate}</dd>
                        </div>
                    ) : null}
                </dl>
            ) : null}
        </section>
    );
};
