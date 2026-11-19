import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, FileCheck2, FileUp, ScanLine } from "lucide-react";
import { SiClaude } from "@icons-pack/react-simple-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import OptionWheel from "@/components/OptionWheel";
import { BudgetProgress } from "@/modules/app/features/budgetView/components/BudgetProgress";
import { QuickRegisterCard } from "@/modules/app/features/dashboard/components/QuickRegisterCard";
import { useGetBudgetsHealth } from "@/modules/app/features/dashboard/hooks/useGetBudgetsHealth";
import { useAuth } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { useTheme } from "@/theme/ThemeProvider";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { HERO_PREVIEW } from "../../utils/landingContent";
import { useStartProCheckout } from "../../hooks/useStartProCheckout";

/* eslint-disable @typescript-eslint/no-unnecessary-condition -- API payloads may omit nested budget fields. */

const OPTION_KEYS = [
  "home.productTour.options.expense",
  "home.productTour.options.receipt",
  "home.productTour.options.budgets",
  "home.productTour.options.claude",
  "home.productTour.options.sharedWallet",
  "home.productTour.options.scheduled",
] as const;

const BUDGET_EXAMPLE = {
  spent: 72,
  limit: 100,
  remaining: 28,
  currency: "USD",
};

const ReceiptFlowPreview = () => {
  const { t } = useTranslation();
  const stages = [
    { key: "received", Icon: FileUp },
    { key: "processing", Icon: ScanLine },
    { key: "extracted", Icon: FileCheck2 },
    { key: "confirmed", Icon: CheckCircle2 },
  ] as const;

  return (
    <div className="rounded-3xl border border-light-10 bg-surface/50 p-6 backdrop-blur-3xl sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
        {t("home.productTour.receiptTitle")}
      </h2>
      <div
        className="mt-7 space-y-4"
        role="list"
        aria-label={t("home.productTour.receiptLabel")}
      >
        {stages.map(({ key, Icon }, index) => (
          <div key={key} className="flex items-center gap-4" role="listitem">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${index === 1 ? "border-primary/45 bg-primary/10 text-primary" : "border-light-10 bg-surface-hard/60 text-helper"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-medium text-light">
                {t(`home.productTour.receiptStages.${key}`)}
              </p>
              {index === 1 ? (
                <p className="mt-0.5 text-xs text-helper">
                  {t("home.productTour.receiptDetail")}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BudgetPreview = ({
  budget,
}: {
  budget?: { name: string; spent: number; limit: number; currency: string };
}) => {
  const { t } = useTranslation();
  const spent = budget?.spent ?? BUDGET_EXAMPLE.spent;
  const budgetLimit = budget?.limit ?? BUDGET_EXAMPLE.limit;
  const currency = budget?.currency ?? BUDGET_EXAMPLE.currency;
  const remaining = formatCurrency(Math.max(0, budgetLimit - spent), currency);
  const limit = formatCurrency(budgetLimit, currency);

  return (
    <div className="rounded-3xl border border-light-10 bg-surface/50 p-6 backdrop-blur-3xl sm:p-8">
      <p className="mb-4 text-lg font-semibold text-light">
        {budget?.name ?? t("home.productTour.exampleBudget")}
      </p>
      <div>
        <BudgetProgress
          percent={budgetLimit > 0 ? (spent / budgetLimit) * 100 : 0}
          spent={spent}
          budgetLimit={budgetLimit}
          currency={currency}
          animateProgress={false}
        />
      </div>
      <p className="mt-4 text-sm font-medium text-light">
        {t("home.productTour.remaining", { remaining, limit })}
      </p>
    </div>
  );
};

const ClaudePreview = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-light-10 bg-surface/50 p-6 backdrop-blur-3xl sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
          {t("settings.claudeTitle")}
        </h2>
        <SiClaude className="h-6 w-6 shrink-0 text-[#d97757]" aria-hidden="true" />
      </div>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-helper">
        {t("home.productTour.claudeProductDescription")}
      </p>
    </div>
  );
};

const SharedWalletPreview = () => {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-light-10 bg-surface/50 p-6 backdrop-blur-3xl sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
        {t("home.productTour.sharedWalletTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-helper">
        {t("home.productTour.sharedWalletDescription")}
      </p>
      <div className="mt-6 flex gap-2">
        {HERO_PREVIEW.members.map(({ name }, index) => (
          <span
            key={name}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-light-10 text-sm font-semibold text-light ${index === 0 ? "bg-primary/35" : "bg-light-10"}`}
          >
            {name.slice(0, 1)}
          </span>
        ))}
      </div>
    </div>
  );
};

const ScheduledPreview = () => {
  const { t } = useTranslation();
  const items = [
    {
      title: t("home.productTour.scheduledNameValue"),
      type: t("home.productTour.scheduledExpense"),
      frequency: t("home.productTour.scheduledMonthly"),
    },
    {
      title: t("home.productTour.scheduledSecondValue"),
      type: t("home.productTour.scheduledIncome"),
      frequency: t("home.productTour.scheduledMonthly"),
    },
    {
      title: t("home.productTour.scheduledThirdValue"),
      type: t("home.productTour.scheduledExpense"),
      frequency: t("home.productTour.scheduledMonthly"),
    },
  ];

  return (
    <div className="rounded-3xl border border-light-10 bg-surface/50 p-6 backdrop-blur-3xl sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-light sm:text-3xl">
        {t("home.productTour.scheduledTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-helper">
        {t("home.productTour.scheduledDescription")}
      </p>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-2xl border border-light-10 bg-surface-hard/55 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-light">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-helper">{item.type}</p>
            </div>
            <span className="shrink-0 text-xs text-helper">
              {item.frequency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductMoment = ({
  index,
  isAuthenticated,
  budget,
}: {
  index: number;
  isAuthenticated: boolean;
  budget?: { name: string; spent: number; limit: number; currency: string };
}) => {
  if (index === 0) {
    return <QuickRegisterCard preview allowPreviewActions={isAuthenticated} />;
  }

  if (index === 1) {
    return <ReceiptFlowPreview />;
  }

  if (index === 2) {
    return <BudgetPreview budget={budget} />;
  }

  if (index === 3) {
    return <ClaudePreview />;
  }

  if (index === 4) {
    return <SharedWalletPreview />;
  }

  return <ScheduledPreview />;
};

const ProductTourContent = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthenticated, isChecking } = useAuth();
  const handleProClick = useStartProCheckout();
  const walletCurrency = useAuthStore(
    (state) =>
      state.user?.wallets?.find((wallet) => wallet.defaultWallet)?.currency ??
      state.user?.wallets?.[0]?.currency,
  );
  const { data: budgetsResponse } = useGetBudgetsHealth(isAuthenticated);
  const reduceMotion = useReducedMotion() ?? false;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wheelPosition, setWheelPosition] = useState(0);
  const [isProductTourEngaged, setIsProductTourEngaged] = useState(false);
  const options = useMemo(() => OPTION_KEYS.map((key) => t(key)), [t]);
  const firstBudget = budgetsResponse?.data?.[0];
  const liveBudget =
    firstBudget && (firstBudget.budgetLimit ?? 0) > 0
      ? {
          name: firstBudget.displayName,
          spent: firstBudget.spent ?? 0,
          limit: firstBudget.budgetLimit ?? 0,
          currency: walletCurrency ?? BUDGET_EXAMPLE.currency,
        }
      : undefined;

  useEffect(() => {
    if (reduceMotion || isProductTourEngaged) {
      return;
    }

    const rotation = window.setInterval(() => {
      setWheelPosition((current) => current + 1);
    }, 4200);

    return () => window.clearInterval(rotation);
  }, [isProductTourEngaged, options.length, reduceMotion]);

  return (
    <section
      id="product-tour"
      aria-labelledby="product-tour-title"
      className="relative isolate w-full overflow-hidden bg-[linear-gradient(180deg,transparent_0%,var(--color-surface-hard)_100%)] px-4 pb-14 pt-10 sm:px-8 md:pb-20 md:pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+12rem)] bg-[radial-gradient(ellipse_at_68%_26%,rgba(100,89,255,0.18),transparent_52%),radial-gradient(ellipse_at_8%_72%,rgba(46,184,153,0.11),transparent_42%),linear-gradient(180deg,transparent_72%,var(--color-surface-hard)_100%)]"
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.66fr_1.34fr] lg:gap-12">
          <div className="max-w-xl lg:-translate-y-5 lg:-translate-x-3">
          <h1
            id="product-tour-title"
            className="text-4xl font-bold leading-[1.04] tracking-tight text-light sm:text-5xl lg:text-[3.25rem]"
          >
            <span className="block">{t("home.heroTitle")}</span>
            <span className="block whitespace-nowrap text-[0.92em]">{t("home.heroFocus")}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-helper md:text-lg">
            {t("home.heroDescription")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!isChecking ? (
              <Button
                to={isAuthenticated ? "/app/dashboard" : "/auth/login"}
                text={
                  isAuthenticated
                    ? t("home.goDashboard")
                    : t("home.heroStartFree")
                }
                className="rounded-xl px-6 py-3"
              />
            ) : null}
            <Button
              type="button"
              onClick={() => {
                void handleProClick();
              }}
              text={t("home.heroExplorePro")}
              variant="secondary"
              className="rounded-xl px-6 py-3"
            />
          </div>
        </div>

        <div
          id="product-tour-display"
          onFocusCapture={() => setIsProductTourEngaged(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsProductTourEngaged(false);
            }
          }}
          onPointerEnter={() => setIsProductTourEngaged(true)}
          onPointerLeave={() => setIsProductTourEngaged(false)}
          className="relative min-w-0 pb-48 pt-6 lg:translate-x-8 sm:pb-52"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-[100px]"
          />
          <div className="relative grid items-center gap-12 md:grid-cols-[0.78fr_1.22fr] md:gap-14">
            <div className="h-[25rem] min-w-0 px-3 md:h-[31rem]">
              <OptionWheel
                items={options}
                defaultSelected={0}
                selected={wheelPosition}
                onChange={(index, _item, position) => {
                  setSelectedIndex(index);
                  setWheelPosition(position);
                }}
                ariaLabel={t("home.productTour.wheelLabel")}
                textColor={theme === "light" ? "rgba(23,34,53,0.42)" : "rgba(255,255,255,0.42)"}
                activeColor={theme === "light" ? "#172235" : "#ffffff"}
                fontSize={1.5}
                spacing={2.55}
                curve={0.55}
                tilt={5}
                blur={0.8}
                fade={0.46}
                minOpacity={0.08}
                smoothing={180}
                inset={8}
                loop
                draggable
                className="h-full"
              />
            </div>
            <div className="min-w-0" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedIndex}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.18, ease: "easeOut" }
                  }
                >
                  <ProductMoment
                    index={selectedIndex}
                    isAuthenticated={isAuthenticated}
                    budget={liveBudget}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute -bottom-4 right-0 z-10 flex translate-x-3 flex-col items-end gap-4 sm:-bottom-5 sm:translate-x-5 lg:translate-x-12">
            <div className="flex translate-x-2 -rotate-2 items-center gap-3 rounded-2xl border border-light-10 bg-surface-75 py-3 pl-3 pr-5 shadow-custom backdrop-blur-xl">
              <div className="flex -space-x-2">
                {HERO_PREVIEW.members.map(({ name, avatar }) => (
                  <img
                    key={name}
                    src={avatar}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-full border-2 border-surface object-cover"
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
            <div className="mr-8 w-56 rotate-2 rounded-2xl border border-light-10 bg-surface-75 px-5 py-4 shadow-custom backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-helper">
                  {t("home.heroPreview.monthBalance")}
                </span>
                <span className="font-medium text-success">
                  {HERO_PREVIEW.balanceChange}
                </span>
              </div>
              <p className="mt-1 text-base font-semibold text-light">
                {formatCurrency(HERO_PREVIEW.monthBalance)}
              </p>
              <svg
                aria-hidden="true"
                viewBox="0 0 112 30"
                className="mt-1 h-6 w-full"
              >
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTourContent;
