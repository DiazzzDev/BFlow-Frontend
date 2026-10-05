import { Check, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

import { HERO_PREVIEW } from "../../utils/landingContent";

import { formatCurrency } from "@/utils/formatters/formatCurrency";

const floatingCardClass =
    "absolute z-10 hidden rounded-xl border border-light-10 bg-surface-95 px-4 py-3 text-left shadow-custom backdrop-blur-md lg:flex";

const walletCardClass =
    "absolute hidden h-40 w-64 flex-col justify-between rounded-2xl p-5 text-left shadow-custom lg:flex";

const WAVE_PATH = "M0 300 C 360 300, 480 190, 720 180 S 1100 80, 1440 30";

// Parallel strokes offset from WAVE_PATH to form a flowing ribbon
const WAVE_LINES = [
    { offset: -40, strokeWidth: 2, className: "stroke-light-25", dashed: true },
    { offset: 0, strokeWidth: 5, className: "stroke-primary" },
    { offset: 12, strokeWidth: 4, className: "stroke-primary-75" },
    { offset: 24, strokeWidth: 3, className: "stroke-primary-50" },
    { offset: 36, strokeWidth: 3, className: "stroke-primary-25" },
    { offset: 48, strokeWidth: 2, className: "stroke-primary-15" },
    { offset: 72, strokeWidth: 4, className: "stroke-info-50" },
];

export const HeroPreview = () => {
    const { t } = useTranslation();

    return (
        <div className="relative mt-16 w-full max-w-3xl md:mt-20">
            <svg
                aria-hidden="true"
                viewBox="0 0 1440 400"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -top-40 left-1/2 -z-10 hidden h-104 w-[min(100vw,90rem)] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)] lg:block"
            >
                {WAVE_LINES.map(({ offset, strokeWidth, className, dashed }) => (
                    <path
                        key={offset}
                        d={WAVE_PATH}
                        transform={`translate(0 ${offset})`}
                        fill="none"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={dashed ? "8 10" : undefined}
                        vectorEffect="non-scaling-stroke"
                        className={className}
                    />
                ))}
            </svg>

            <div className="overflow-hidden rounded-2xl border border-light-10 bg-surface shadow-custom">
                <div className="relative flex items-center gap-2 border-b border-light-10 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                    <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                    <span className="absolute left-1/2 -translate-x-1/2 rounded-md bg-surface-hard px-3 py-1 font-mono text-[11px] text-helper">
                        bflow-studio.com/app/dashboard
                    </span>
                </div>

                <div className="aspect-[2/1] bg-surface-hard/60">
                    <img
                        src={HERO_PREVIEW.image}
                        alt={t("home.heroPreview.imageAlt")}
                        onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                        }}
                        className="h-full w-full object-cover object-top"
                    />
                </div>
            </div>

            <div className={`${floatingCardClass} -left-24 top-10 items-center gap-3`}>
                <div className="flex -space-x-2">
                    {HERO_PREVIEW.members.map(({ name, avatar }) => (
                        <img
                            key={name}
                            src={avatar}
                            alt=""
                            loading="lazy"
                            className="h-8 w-8 rounded-full border-2 border-surface object-cover"
                        />
                    ))}
                </div>
                <div>
                    <p className="text-sm font-semibold text-light">
                        {t("home.heroPreview.sharedWallet")}
                    </p>
                    <p className="text-xs text-helper">
                        {t("home.heroPreview.members", {
                            count: HERO_PREVIEW.members.length,
                        })}
                    </p>
                </div>
            </div>

            <div className={`${floatingCardClass} -right-20 top-2 items-center gap-3`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success-sweet text-success">
                    <Check className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-light">
                        {t("budgets.status.OK")}
                    </p>
                    <p className="text-xs text-helper">
                        {t("home.heroPreview.budgetPeriod")}
                    </p>
                </div>
            </div>

            <div className={`${floatingCardClass} -left-28 -bottom-6 w-44 flex-col gap-1.5`}>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-helper">{t("home.heroPreview.monthBalance")}</span>
                    <span className="font-medium text-success">{HERO_PREVIEW.balanceChange}</span>
                </div>
                <p className="text-base font-semibold text-light">
                    {formatCurrency(HERO_PREVIEW.monthBalance)}
                </p>
                <svg aria-hidden="true" viewBox="0 0 112 30" className="h-7 w-full">
                    <polyline
                        points={HERO_PREVIEW.sparkline}
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="stroke-success"
                    />
                </svg>
            </div>

            <div className={`${walletCardClass} -right-28 bottom-16 z-10 rotate-6 border border-light-10 bg-secondary-dark`}>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-light">
                            {t("home.heroPreview.personalWallet")}
                        </p>
                        <p className="text-xs text-helper">
                            {t("home.heroPreview.personalWalletDescription")}
                        </p>
                    </div>
                    <Wallet className="h-5 w-5 shrink-0 text-primary" />
                </div>
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-[11px] text-helper">
                            {t("home.heroPreview.availableBalance")}
                        </p>
                        <p className="text-lg font-semibold text-light">
                            {formatCurrency(HERO_PREVIEW.personalWalletBalance)}
                        </p>
                    </div>
                    <span className="rounded-md bg-light-10 px-2 py-0.5 font-mono text-[10px] text-label">
                        {HERO_PREVIEW.currency}
                    </span>
                </div>
            </div>

            <div className={`${walletCardClass} -right-16 -bottom-16 z-20 -rotate-3 bg-primary`}>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-light">
                            {t("home.heroPreview.walletName")}
                        </p>
                        <p className="text-xs text-light-75">
                            {t("home.heroPreview.walletDescription")}
                        </p>
                    </div>
                    <Wallet className="h-5 w-5 shrink-0 text-light" />
                </div>
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-[11px] text-light-75">
                            {t("home.heroPreview.availableBalance")}
                        </p>
                        <p className="text-lg font-semibold text-light">
                            {formatCurrency(HERO_PREVIEW.walletBalance)}
                        </p>
                    </div>
                    <div className="flex -space-x-1.5">
                        {HERO_PREVIEW.members.map(({ name, avatar }) => (
                            <img
                                key={name}
                                src={avatar}
                                alt=""
                                loading="lazy"
                                className="h-7 w-7 rounded-full border-2 border-primary object-cover"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
