import { toast } from "sonner";
import { Button } from "@/components/controls/Button";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { PlanBenefits } from "./components/PlanBenefits";
import { useCreateWompiCheckout } from "./hooks/useCreateWompiCheckout";
import { getApiErrorMessage } from "@/utils/api/apiMessage";
import { useGetPlan } from "./hooks/useGetPlan";
import { useTranslation } from "react-i18next";
import { billingPeriodKey } from "../landing/utils/planPresentation";
import { SubscriptionDetailsSkeleton } from "./components/SubscriptionDetailsSkeleton";
import { getWompiCheckoutUrl } from "./utils";
import { PlanLoadError } from "./components/PlanLoadError";

export const SubscriptionDetailsPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const planId = params.get("plan");

    const { data, isLoading, isError, refetch } = useGetPlan(planId ?? "");

    const plan = data?.data;

    const { mutateAsync, isPending } = useCreateWompiCheckout();

    if (!planId) {
        return <Navigate to="/" replace />;
    }

    const handleContinue = async () => {
        const promise = mutateAsync(planId);

        toast.promise(promise, {
            loading: "Preparando el pago...",
            success: "Checkout creado correctamente.",
            error: (error) =>
                getApiErrorMessage(error, "No se pudo iniciar el pago."),
        });

        const checkoutResponse = await promise;
        window.location.assign(getWompiCheckoutUrl(checkoutResponse));
    };


    return (
        <main className="min-h-screen bg-surface-hard px-4 py-8 text-light sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl" aria-busy={isLoading}>
                <Button
                    onClick={() => { void navigate("/") }}
                    text="Volver a la página principal"
                    icon={<span className="text-lg">←</span>}
                    variant="ghost"
                    type="button"
                    className="p-0! mb-5"
                />

                {isLoading ? (
                    <SubscriptionDetailsSkeleton />
                ) : isError ? (
                    <PlanLoadError
                        title={t("home.plans.detailsErrorTitle")}
                        actionsTitle={t("home.plans.detailsErrorActionsTitle")}
                        description={t("home.plans.detailsErrorDescription")}
                        retryLabel={t("home.plans.reloadBtnText")}
                        backLabel={t("home.plans.backToPlans")}
                        onRetry={() => { void refetch() }}
                        onBackToPlans={() => { void navigate("/#pricing") }}
                    />
                ) : !plan ? (
                    <PlanLoadError
                        title={t("home.plans.detailsNotFoundTitle")}
                        actionsTitle={t("home.plans.detailsNotFoundActionsTitle")}
                        description={t("home.plans.detailsNotFoundDescription")}
                        retryLabel={t("home.plans.reloadBtnText")}
                        backLabel={t("home.plans.backToPlans")}
                        onRetry={() => { void refetch() }}
                        onBackToPlans={() => { void navigate("/#pricing") }}
                    />
                ) : (
                    <>
                        <section
                            aria-label="Plan seleccionado"
                            className="mb-5 flex flex-col gap-4 rounded-xl border border-light-10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                        >
                            <div>
                                <p className="mb-1 text-sm font-medium text-label">
                                    Plan seleccionado
                                </p>

                                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                                    {plan.name}
                                </h1>
                            </div>

                            <p className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    ${plan.price}
                                </span>

                                <span className="text-sm text-label">
                                    /{t(billingPeriodKey(plan.billingPeriod))}
                                </span>
                            </p>
                        </section>

                        <section className="rounded-xl border border-light-10 bg-surface p-5 sm:p-8">
                            <header>
                                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Completa tu suscripción
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-helper sm:text-base">
                                    Revisa los detalles de tu plan antes de continuar
                                    al pago seguro con Wompi.
                                </p>
                            </header>

                            <div
                                aria-hidden="true"
                                className="my-8 border-t border-light-10"
                            />

                            <div>
                                <h3 className="mb-5 text-base font-semibold">
                                    Incluye
                                </h3>

                                <PlanBenefits benefits={plan.benefits} />
                            </div>

                            <div
                                aria-hidden="true"
                                className="my-8 border-t border-light-10"
                            />

                            <footer className="flex justify-end">
                                <Button
                                    text="Continuar"
                                    className="px-10 py-3 text-md!"
                                    disabled={isPending || isLoading}
                                    onClick={() => void handleContinue()}
                                />
                            </footer>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
};
