import { Link } from "react-router";

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
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

interface PricingCardProps {
    name: string;
    price: string;
    period: string;
    features: string[];
    btnText: string;
    btnStyle: "outline" | "filled";
    featured?: boolean;
    to?: string;
}

export const PricingCard = ({
    name,
    price,
    period,
    features,
    btnText,
    btnStyle,
    to = "/auth/register",
}: PricingCardProps) => {
    return (
        <div
            className="relative h-full rounded-2xl p-px bg-linear-to-br from-light-25 to-transparent min-h-125!">
            <div
                className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-surface p-8 md:p-9"
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent from-light-5"
                />

                <div className="relative z-10 flex h-full flex-col">
                    <p className="mb-4 text-base font-semibold text-light">{name}</p>
                    <p className="mb-8 text-5xl font-bold tracking-tight">
                        {price}
                        <span className="text-lg font-normal text-helper"> /{period}</span>
                    </p>

                    <hr className="mb-8 border-light-10" />

                    <div className="mb-10 flex flex-1 flex-col gap-4">
                        {features.map((text) => (
                            <div
                                key={text}
                                className="flex items-start gap-3 text-sm leading-snug text-helper md:text-[15px]"
                            >
                                <CheckIcon />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    <Link to={to} className="mt-auto block">
                        <button
                            type="button"
                            className={`w-full cursor-pointer rounded-xl py-3 text-sm font-medium transition-all ${
                                btnStyle === "filled"
                                    ? "bg-primary text-light hover:bg-primary-dark"
                                    : "border border-light-25 bg-transparent text-light hover:border-light hover:bg-light-10"
                            }`}
                        >
                            {btnText}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
