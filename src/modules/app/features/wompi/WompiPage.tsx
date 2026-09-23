import { ArrowLeft, Check } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCreateWompiCheckout } from "./hooks/useCreateWompiCheckout";
import {
    executeWompiCheckout,
    openWompiCheckoutInNewTab,
    type CheckoutPlanKey,
} from "./wompi.checkout";
import { Button } from "@/components/controls/Button";
import { LANDING_PLANS } from "@/modules/home/features/landing/utils/landingContent";
import { getApiErrorMessage } from "@/utils/api/apiMessage";

const isCheckoutPlanKey = (value: string | null): value is CheckoutPlanKey =>
    value === "pro-monthly" || value === "pro-yearly";

export const WompiPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const { mutateAsync: createCheckout, isPending } =
        useCreateWompiCheckout();

    const selectedPlanKey = searchParams.get("plan");

    const plan = isCheckoutPlanKey(selectedPlanKey)
        ? LANDING_PLANS.find(
                (item) => item.checkoutPlanKey === selectedPlanKey,
            )
        : undefined;

    const handleCheckout = async (): Promise<void> => {
        try {
            const result = await executeWompiCheckout(plan, {
                createCheckout,
                openCheckout: (checkoutUrl) =>
                    openWompiCheckoutInNewTab(checkoutUrl),
            });

            if (result !== "redirected") {
                toast.error(t("wompi.planConfigurationError"));
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, t("wompi.checkoutError")),
            );
        }
    };

    if (!plan) {
        return (
            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
                <section className="w-full max-w-lg rounded-2xl border border-light-10 bg-surface p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold text-light">
                        {t("wompi.invalidPlanTitle")}
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-helper">
                        {t("wompi.invalidPlanDescription")}
                    </p>

                    <Link
                        to="/#pricing"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("wompi.backToPlans")}
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="flex flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <section className="mx-auto flex w-full max-w-7xl flex-col gap-7">
                <Link
                    to="/#pricing"
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-helper transition-colors hover:text-light"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("wompi.backToPlans")}
                </Link>

                <div className="flex w-full flex-col gap-7">
                    {/* Plan seleccionado */}
                    <aside className="w-full rounded-2xl border border-light-10 bg-surface p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-base font-medium text-helper">
                                    {t("wompi.selectedPlan")}
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-light sm:text-3xl">
                                    {plan.name}
                                </h2>
                            </div>

                            <p className="text-4xl font-bold tracking-tight text-light sm:text-5xl">
                                {plan.price}
                                <span className="text-lg font-normal text-helper">
                                    {" "}
                                    /{plan.period}
                                </span>
                            </p>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <article className="w-full rounded-2xl border border-light-10 bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
                        <header>
                            <h1 className="text-3xl font-semibold tracking-tight text-light sm:text-4xl">
                                {t("wompi.title")}
                            </h1>

                            <p className="mt-4 max-w-3xl text-base leading-relaxed text-helper sm:text-lg">
                                {t("wompi.description")}
                            </p>
                        </header>

                        <div className="mt-9 border-t border-light-10 pt-7 sm:mt-10 sm:pt-8">
                            <h2 className="text-lg font-semibold text-light sm:text-xl">
                                {t("wompi.included")}
                            </h2>

                            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 text-sm leading-relaxed text-helper sm:text-base"
                                    >
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />

                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-9 flex justify-end border-t border-light-10 pt-6 sm:mt-10 sm:pt-7">
                            <Button
                                type="button"
                                text={
                                    isPending
                                        ? t("wompi.loading")
                                        : t("wompi.continue")
                                }
                                onClick={() => void handleCheckout()}
                                disabled={isPending}
                                className="w-full sm:w-52"
                            />
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
};
