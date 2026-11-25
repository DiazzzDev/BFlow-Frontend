import { toast } from "sonner";
import { Button } from "@/components/controls/Button";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { PlanBenefits } from "./components/PlanBenefits";
import { useCreateWompiCheckout } from "./hooks/useCreateWompiCheckout";
import { getApiErrorMessage } from "@/utils/api/apiMessage";
import { useGetPlan } from "./hooks/useGetPlan";
import { useTranslation } from "react-i18next";
import { SubscriptionDetailsSkeleton } from "./components/SubscriptionDetailsSkeleton";
import { getWompiCheckoutUrl } from "./utils";
import { PlanLoadError } from "./components/PlanLoadError";
import { useGetPlans } from "../landing/hooks/useGetPlans";
import { billingPeriodKey, sortPlansForDisplay } from "../landing/utils/planPresentation";
import type { Plan } from "../landing/interfaces/Plan";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

const benefitLabel = (plan: Plan, code: string, includedLabel: string) => {
    const benefit = plan.benefits.find((candidate) => candidate.code === code);

    if (!benefit?.enabled) {
        return null;
    }

    return benefit.limitable && benefit.limit !== null
        ? `${benefit.limit}`
        : includedLabel;
};

export const SubscriptionDetailsPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const planId = params.get("plan");

    const { data, isLoading, isError, refetch } = useGetPlan(planId ?? "");
    const { data: plansResponse } = useGetPlans();

    const plan = data;
    const [selectedPurchasePlanId, setSelectedPurchasePlanId] = useState(planId ?? "");
    const availablePlans = useMemo(
        () => sortPlansForDisplay(plansResponse?.data ?? []),
        [plansResponse?.data],
    );
    const purchasablePlans = useMemo(
        () => availablePlans.filter((availablePlan) => availablePlan.price > 0),
        [availablePlans],
    );
    const benefitCodes = useMemo(
        () => [...new Set(availablePlans.flatMap((availablePlan) =>
            availablePlan.benefits
                .filter((benefit) => benefit.enabled)
                .map((benefit) => benefit.code),
        ))],
        [availablePlans],
    );
    const benefitNames = useMemo(
        () => new Map(
            availablePlans.flatMap((availablePlan) => availablePlan.benefits)
                .map((benefit) => [benefit.code, benefit.name]),
        ),
        [availablePlans],
    );

    const { mutateAsync, isPending } = useCreateWompiCheckout();
    const authStatus = useAuthStore((state) => state.authStatus);

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

    const handlePlanSelect = (selectedPlanId: string) => {
        if (authStatus !== "authenticated") {
            void navigate(`/auth/login?plan=${encodeURIComponent(selectedPlanId)}`);
            toast.info(t("home.plans.logInToGetMessage"));
            return;
        }

        void navigate(`/plan-details?plan=${encodeURIComponent(selectedPlanId)}`);
    };

    const handlePurchaseSelection = () => {
        if (selectedPurchasePlanId === planId) {
            void handleContinue();
            return;
        }

        handlePlanSelect(selectedPurchasePlanId);
    };

    return (
        <main className="min-h-[68vh] bg-surface-hard px-4 py-8 text-light sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="relative mx-auto w-full max-w-6xl" aria-busy={isLoading}>
                <Button
                    onClick={() => { void navigate("/") }}
                    text={t("home.subscription.back")}
                    icon={<span className="text-lg">←</span>}
                    variant="ghost"
                    type="button"
                    className="mb-8 p-0! text-helper hover:text-light"
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
                        <header className="mb-8 max-w-3xl sm:mb-10">
                            <h1 className="text-3xl font-bold tracking-tight text-light sm:text-4xl md:text-5xl">
                                {t("home.subscription.title")}
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-helper sm:text-base">
                                {t("home.subscription.description")}
                            </p>
                        </header>

                        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6">
                            <section
                                aria-labelledby="subscription-benefits-title"
                                className="h-full rounded-3xl border border-light-10 bg-surface p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-8 lg:p-10"
                            >
                                <div className="mb-8 border-b border-light-10 pb-6">
                                    <div>
                                        <h2 id="subscription-benefits-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
                                            {t("home.subscription.includedTitle")}
                                        </h2>
                                        <p className="mt-2 text-sm text-helper">
                                            {t("home.subscription.includedDescription", { plan: plan.name })}
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-surface-hard/60 p-5 sm:p-6">
                                    <PlanBenefits benefits={plan.benefits} />
                                </div>
                            </section>

                            <aside className="flex h-full flex-col rounded-3xl border border-light-10 bg-surface p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-7 lg:sticky lg:top-8">
                                <p className="text-sm font-medium text-helper">{t("home.subscription.selectedPlan")}</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light">
                                    {plan.name}
                                </h2>

                                <div className="mt-7 flex items-end gap-2 border-b border-light-10 pb-7">
                                    <span className="text-4xl font-bold tracking-tight text-light sm:text-5xl">
                                        ${plan.price}
                                    </span>
                                    <span className="pb-1 text-sm text-helper">
                                        /{t(billingPeriodKey(plan.billingPeriod))}
                                    </span>
                                </div>

                                <p className="mt-6 text-sm leading-6 text-helper">
                                    {t("home.subscription.checkoutDescription")}
                                </p>

                                <Button
                                    text={t("home.subscription.continue")}
                                    className="mt-auto w-full px-6 py-3 text-md!"
                                    disabled={isPending || isLoading}
                                    onClick={() => void handleContinue()}
                                />
                            </aside>
                        </div>

                        {availablePlans.length > 0 && benefitCodes.length > 0 ? (
                            <section className="mt-16 sm:mt-20" aria-labelledby="plan-comparison-title">
                                <header className="mb-7 max-w-2xl">
                                    <h2 id="plan-comparison-title" className="text-2xl font-bold tracking-tight text-light sm:text-3xl">
                                        {t("home.subscription.comparisonTitle")}
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-helper sm:text-base">
                                        {t("home.subscription.comparisonDescription")}
                                    </p>
                                </header>

                                <div className="overflow-x-auto rounded-3xl border border-light-10 bg-surface">
                                    <table className="w-full min-w-[45rem] border-collapse text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-light-10 text-helper">
                                                <th scope="col" className="px-6 py-5 font-medium sm:px-8">{t("home.subscription.benefit")}</th>
                                                {availablePlans.map((availablePlan) => {
                                                    const isMonthlyPro = availablePlan.billingPeriod === "MONTHLY" && availablePlan.price > 0;
                                                    return (
                                                        <th
                                                            key={availablePlan.id}
                                                            scope="col"
                                                            className={`min-w-38 px-5 py-5 text-center font-semibold ${isMonthlyPro ? "bg-primary/10 text-light" : "text-light"}`}
                                                        >
                                                            {availablePlan.name}
                                                            {isMonthlyPro ? <span className="mt-1 block text-xs font-medium text-primary">{t("home.subscription.monthlyPro")}</span> : null}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {benefitCodes.map((code) => (
                                                <tr key={code} className="border-b border-light-10 last:border-0">
                                                    <th scope="row" className="px-6 py-4 font-medium text-light sm:px-8">
                                                        {benefitNames.get(code)}
                                                    </th>
                                                    {availablePlans.map((availablePlan) => {
                                                        const value = benefitLabel(availablePlan, code, t("home.subscription.included"));
                                                        const isMonthlyPro = availablePlan.billingPeriod === "MONTHLY" && availablePlan.price > 0;
                                                        return (
                                                            <td
                                                                key={availablePlan.id}
                                                                className={`px-5 py-4 text-center ${isMonthlyPro ? "bg-primary/5" : ""}`}
                                                            >
                                                                {value ? (
                                                                    <span className="inline-flex items-center justify-center gap-1.5 text-helper">
                                                                        <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                                                                        {value}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-label">—</span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        ) : null}

                        {purchasablePlans.length > 0 ? (
                            <section className="mt-16 sm:mt-20" aria-labelledby="more-plans-title">
                                <header className="mb-9 max-w-2xl">
                                    <h2 id="more-plans-title" className="text-2xl font-bold tracking-tight text-light sm:text-3xl">
                                        {t("home.subscription.morePlansTitle")}
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-helper sm:text-base">
                                        {t("home.subscription.morePlansDescription")}
                                    </p>
                                </header>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6" role="radiogroup" aria-label={t("home.subscription.morePlansTitle")}>
                                    {purchasablePlans.map((purchasablePlan) => (
                                        <button
                                            key={purchasablePlan.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={selectedPurchasePlanId === purchasablePlan.id}
                                            onClick={() => setSelectedPurchasePlanId(purchasablePlan.id)}
                                            className={`relative rounded-3xl border bg-surface p-6 text-left shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition-colors sm:p-8 ${selectedPurchasePlanId === purchasablePlan.id ? "border-primary ring-1 ring-primary" : "border-light-10 hover:border-light-25"}`}
                                        >
                                            <span aria-hidden="true" className={`absolute right-6 top-6 h-5 w-5 rounded-full border ${selectedPurchasePlanId === purchasablePlan.id ? "border-primary after:absolute after:inset-1 after:rounded-full after:bg-primary" : "border-light-25"}`} />
                                            <span className="block text-lg font-semibold tracking-tight text-light">
                                                {purchasablePlan.name}
                                            </span>
                                            <span className="mt-5 flex items-baseline gap-2">
                                                <span className="text-4xl font-bold tracking-tight text-light">
                                                    {formatCurrency(purchasablePlan.price)}
                                                </span>
                                                <span className="text-sm text-helper">
                                                    /{t(billingPeriodKey(purchasablePlan.billingPeriod))}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <Button
                                        type="button"
                                        text={t("home.subscription.selectPlan")}
                                        className="min-w-52 px-7 py-3"
                                        disabled={isPending}
                                        onClick={handlePurchaseSelection}
                                    />
                                </div>
                                <p className="mt-4 text-center text-xs text-helper">
                                    {t("home.subscription.checkoutDescription")}
                                </p>
                            </section>
                        ) : null}
                    </>
                )}
            </div>
        </main>
    );
};
