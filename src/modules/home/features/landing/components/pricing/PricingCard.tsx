import { useNavigate } from "react-router";

import { useAuthStore } from "@/auth/authStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PlanBenefitDom } from "../../interfaces/Plan";

const CheckIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0 text-primary"
        aria-hidden="true"
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

interface PricingCardProps {
    id: string;
    name: string;
    priceLabel: string;
    periodLabel: string;
    features: PlanBenefitDom[];
    btnText: string;
    btnStyle: "outline" | "filled";
    isFree: boolean;
}

export const PricingCard = ({
    id,
    name,
    priceLabel,
    periodLabel,
    features,
    btnText,
    btnStyle,
    isFree,
}: PricingCardProps) => {
    const { t } = useTranslation()
    const authStatus = useAuthStore((state) => state.authStatus);
    const navigate = useNavigate();

    const handleClick = () => {
        if (isFree) {
            void navigate("/auth/login");
            return;
        }

        if (authStatus !== "authenticated") {
            void navigate(`/auth/login?plan=${encodeURIComponent(id)}`);
            toast.info(t("home.plans.logInToGetMessage"))
            return;
        }

        void navigate(`/plan-details?plan=${encodeURIComponent(id)}`);
    };

    return (
        <div className="relative h-full min-h-125! rounded-2xl bg-linear-to-br from-light-25 to-transparent p-px">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-surface p-8 md:p-9">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-light-5 to-transparent" />

                <div className="relative z-10 flex h-full flex-col">
                    <p className="mb-4 text-base font-semibold text-light">{name}</p>
                    <p className="mb-8 text-5xl font-bold tracking-tight">
                        {priceLabel}
                        <span className="text-lg font-normal text-helper"> /{periodLabel}</span>
                    </p>

                    <hr className="mb-8 border-light-10" />

                    <div className="mb-10 flex flex-1 flex-col gap-4">
                        {features.map((benefit) => (
                            <div
                                key={benefit.defaultValue}
                                className="flex items-start gap-3 text-sm leading-snug text-helper md:text-[15px]"
                            >
                                <CheckIcon />
                                {benefit.limit ?
                                    (
                                        <span>{benefit.defaultValue} ({benefit.limit})</span>
                                    ) : (
                                        <span>{benefit.defaultValue}</span>
                                    )
                                }
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleClick}
                        className={`w-full cursor-pointer rounded-xl py-3 text-sm font-medium transition-all ${btnStyle === "filled"
                            ? "bg-primary text-light hover:bg-primary-dark"
                            : "border border-light-25 bg-transparent text-light hover:border-light hover:bg-light-10"
                            }`}
                    >
                        {btnText}
                    </button>
                </div>
            </div>
        </div>
    );
};
