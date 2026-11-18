import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useMutateBudgets } from "../hooks/useMutateBudgets";
import { BUDGET_SCOPE_TABS } from "../utils/filters";
import { useGetCategories } from "../../settings/hooks/useGetCategories";
import { useGetWallets } from "../../wallets/hooks/useGetWallets";

import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { DatePicker } from "@/components/controls/DatePicker";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { Button } from "@/components/controls/Button";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";
import type { BudgetScope } from "@/modules/app/interfaces/Budget";
import {
    PERIODICITY_FORM_OPTIONS,
    PERIODICITY_VALUES,
    type Periodicity,
} from "@/modules/app/interfaces/Periodicity";
import { formatTodayDateInputValue } from "@/utils/formatters/formatDateInputValue";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const MIN_WARNING = 0;
const MIN_CRITICAL = 1;
const MAX_THRESHOLD = 100;
const WARNING_RANGE_CLASSES = "absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [accent-color:var(--color-warning)] pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[1.1rem] [&::-webkit-slider-thumb]:w-[1.1rem] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-warning [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-warning)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[0.85rem] [&::-moz-range-thumb]:w-[0.85rem] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-warning [&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--color-warning)]";
const CRITICAL_RANGE_CLASSES = "absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [accent-color:var(--color-danger)] pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[1.1rem] [&::-webkit-slider-thumb]:w-[1.1rem] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-danger [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_var(--color-danger)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[0.85rem] [&::-moz-range-thumb]:w-[0.85rem] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-danger [&::-moz-range-thumb]:shadow-[0_0_0_1px_var(--color-danger)]";

interface BudgetFormValues {
    amount: string;
    period: Periodicity;
    startDate: string;
    thresholdWarning: number;
    thresholdCritical: number;
    walletId: string;
    categoryId: string;
}

const defaultFormValues: BudgetFormValues = {
    amount: "",
    period: "MONTHLY",
    startDate: formatTodayDateInputValue(),
    thresholdWarning: 60,
    thresholdCritical: 90,
    walletId: "",
    categoryId: "",
};

interface BudgetFormProps {
    onSuccess?: () => void;
}

export const BudgetForm = ({ onSuccess }: BudgetFormProps) => {
    const { t } = useTranslation();
    const { createBudget } = useMutateBudgets();
    const budgetSchema = z
        .object({
            amount: z
                .string()
                .min(1, t("budgets.validation.amountRequired"))
                .refine(
                    (value) => Number(value) > 0,
                    t("budgets.validation.amountGreaterThanZero"),
                ),
            period: z.enum(PERIODICITY_VALUES),
            startDate: z.string().min(1, t("budgets.validation.startDateRequired")),
            thresholdWarning: z
                .number()
                .min(MIN_WARNING, t("budgets.validation.warningMinimum", { min: MIN_WARNING }))
                .max(MAX_THRESHOLD - 1, t("budgets.validation.warningMaximum", { max: MAX_THRESHOLD })),
            thresholdCritical: z
                .number()
                .min(MIN_CRITICAL, t("budgets.validation.criticalMinimum", { min: MIN_CRITICAL }))
                .max(MAX_THRESHOLD, t("budgets.validation.criticalMaximum", { max: MAX_THRESHOLD })),
            walletId: z.string(),
            categoryId: z.string(),
        })
        .superRefine((values, ctx) => {
            if (values.thresholdCritical <= values.thresholdWarning) {
                ctx.addIssue({
                    code: "custom",
                    path: ["thresholdCritical"],
                    message: t("budgets.validation.criticalAfterWarning"),
                });
            }
        });

    // Budget scope and which fields apply
    const [scope, setScope] = useState<BudgetScope>("WALLET");
    const needsWallet = scope === "WALLET" || scope === "WALLET_CATEGORY";
    const needsCategory = scope === "CATEGORY_GLOBAL" || scope === "WALLET_CATEGORY";

    const { data: walletsResponse, isLoading: isWalletsLoading } = useGetWallets("MINE", "", 0, 100);
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const wallets = walletsResponse?.data.content ?? [];
    const categories = categoriesResponse?.data.filter((category) => category.type === "EXPENSE") ?? [];

    // RHF form + watched thresholds for the slider
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: defaultFormValues,
    });
    const thresholdWarning = useWatch({ control, name: "thresholdWarning" });
    const thresholdCritical = useWatch({ control, name: "thresholdCritical" });
    const amount = useWatch({ control, name: "amount" });
    const formatThresholdAmount = (baseAmount: number, threshold: number) =>
        (baseAmount * (threshold / 100)).toFixed(2);
    const [warningAmountInput, setWarningAmountInput] = useState(() =>
        formatThresholdAmount(Number(amount) || 0, thresholdWarning),
    );
    const [criticalAmountInput, setCriticalAmountInput] = useState(() =>
        formatThresholdAmount(Number(amount) || 0, thresholdCritical),
    );

    const syncThresholdAmountInputs = (
        baseAmount: number,
        warningThreshold: number,
        criticalThreshold: number,
    ) => {
        setWarningAmountInput(formatThresholdAmount(baseAmount, warningThreshold));
        setCriticalAmountInput(formatThresholdAmount(baseAmount, criticalThreshold));
    };

    const updateWarning = (value: number) => {
        const nextWarning = Math.min(MAX_THRESHOLD - 1, Math.max(MIN_WARNING, value));
        const nextCritical = thresholdCritical <= nextWarning
            ? Math.min(MAX_THRESHOLD, nextWarning + 1)
            : thresholdCritical;
        setValue("thresholdWarning", nextWarning, { shouldValidate: true });
        if (nextCritical !== thresholdCritical) {
            setValue("thresholdCritical", nextCritical, { shouldValidate: true });
        }
        syncThresholdAmountInputs(Number(amount) || 0, nextWarning, nextCritical);
    };

    const updateCritical = (value: number) => {
        const minCritical = Math.max(MIN_CRITICAL, thresholdWarning + 1);
        const nextCritical = Math.min(MAX_THRESHOLD, Math.max(minCritical, value));
        setValue("thresholdCritical", nextCritical, { shouldValidate: true });
        syncThresholdAmountInputs(Number(amount) || 0, thresholdWarning, nextCritical);
    };

    const updateThresholdFromAmount = (
        value: string,
        updateThreshold: (percentage: number) => void,
    ) => {
        const baseAmount = Number(amount);
        const thresholdAmount = Number(value);

        if (!Number.isFinite(thresholdAmount) || baseAmount <= 0) {
            return;
        }

        updateThreshold(Math.round((thresholdAmount / baseAmount) * 100));
    };

    // Clear values that do not apply to the selected budget scope.
    useEffect(() => {
        if (!needsWallet) {
            setValue("walletId", "");
        }

        if (!needsCategory) {
            setValue("categoryId", "");
        }
    }, [setValue, needsCategory, needsWallet]);

    // On tab change: clear values that are not shared between scopes.
    const handleScopeChange = (nextScope: BudgetScope) => {
        setScope(nextScope);
        setValue("walletId", "");
        setValue("categoryId", "");
    };

    // Validate ids by scope, create budget, then reset the form
    const onSubmit = async (formData: BudgetFormValues) => {
        if (needsWallet && !formData.walletId) {
            setError("walletId", {
                message: t("budgets.validation.walletRequired"),
            });
            return;
        }
        if (needsCategory && !formData.categoryId) {
            setError("categoryId", {
                message: t("budgets.validation.categoryRequired"),
            });
            return;
        }

        const promise = createBudget.mutateAsync({
            amount: Number(formData.amount),
            period: formData.period,
            startDate: formData.startDate,
            currency: "USD", // Por el momento esta quemado
            scope,
            thresholdWarning: formData.thresholdWarning,
            thresholdCritical: formData.thresholdCritical,
            ...(needsWallet ? { walletId: formData.walletId } : {}),
            categoryId: needsCategory ? formData.categoryId : null,
        });

        toast.promise(promise, {
            loading: t("budgets.createLoading"),
            success: (response) => getApiMessage(response, t("budgets.createFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
        reset({ ...defaultFormValues, startDate: formatTodayDateInputValue() });
        onSuccess?.();
    };

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}
        >
            <SegmentedTabs
                tabs={BUDGET_SCOPE_TABS.map(({ id, labelKey }) => ({
                    id,
                    label: t(labelKey),
                }))}
                selected={scope}
                onChange={handleScopeChange}
                ariaLabel={t("budgets.scopeLabel")}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                {needsWallet && (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="budgetWalletId">{t("budgets.wallet")}</Label>
                        <Controller
                            name="walletId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="budgetWalletId"
                                    value={field.value}
                                    disabled={createBudget.isPending || isWalletsLoading}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    onBlur={field.onBlur}
                                >
                                    <option value="">
                                        {isWalletsLoading
                                            ? t("budgets.loadingWallets")
                                            : t("budgets.searchWallet")}
                                    </option>
                                    {wallets.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.walletId && (
                            <span className="text-xs text-danger">{errors.walletId.message}</span>
                        )}
                    </div>
                )}

                <div className={`flex flex-col gap-1 ${scope === "WALLET_CATEGORY" ? "sm:order-3 sm:col-span-2" : ""}`}>
                    <Label htmlFor="amount">{t("budgets.amount")}</Label>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="amount"
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                disabled={createBudget.isPending}
                                name={field.name}
                                value={field.value}
                                onChange={(event) => {
                                    const formatted = formatterDecimal(event.target.value);
                                    if (formatted !== null) {
                                        field.onChange(formatted);
                                        syncThresholdAmountInputs(
                                            Number(formatted) || 0,
                                            thresholdWarning,
                                            thresholdCritical,
                                        );
                                    }
                                }}
                            />
                        )}
                    />
                    {errors.amount && (
                        <span className="text-xs text-danger">{errors.amount.message}</span>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {["100", "250", "500", "1000"].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                disabled={createBudget.isPending}
                                onClick={() => {
                                    setValue("amount", preset, { shouldValidate: true });
                                    syncThresholdAmountInputs(
                                        Number(preset),
                                        thresholdWarning,
                                        thresholdCritical,
                                    );
                                }}
                                className="rounded-full border border-light-10 px-3 py-1 text-xs text-light transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                ${Number(preset).toLocaleString("en-US")}
                            </button>
                        ))}
                    </div>
                </div>

                {needsCategory && (
                    <div className={`flex flex-col gap-1 ${scope === "CATEGORY_GLOBAL" ? "sm:order-first" : ""}`}>
                        <Label htmlFor="budgetCategoryId">{t("budgets.category")}</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="budgetCategoryId"
                                    value={field.value}
                                    disabled={createBudget.isPending || isCategoriesLoading}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    onBlur={field.onBlur}
                                >
                                    <option value="">
                                        {isCategoriesLoading
                                            ? t("budgets.loadingCategories")
                                            : t("budgets.searchCategory")}
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.categoryId && (
                            <span className="text-xs text-danger">{errors.categoryId.message}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-light">{t("budgets.period")}</span>
                    <Controller
                        name="period"
                        control={control}
                        render={({ field }) => (
                            <SegmentedTabs
                                tabs={PERIODICITY_FORM_OPTIONS.map((option) => ({
                                    id: option.value,
                                    label: t(`budgets.periods.${option.value.toLowerCase()}`, { defaultValue: option.label }),
                                }))}
                                selected={field.value}
                                onChange={field.onChange}
                                ariaLabel={t("budgets.period")}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="startDate">{t("budgets.startDate")}</Label>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            id="startDate"
                            disabled={createBudget.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.startDate && (
                    <span className="text-xs text-danger">{errors.startDate.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-light">{t("budgets.consumptionAlerts")}</span>
                <div className="relative h-7">
                    <div className="absolute top-1/2 right-2 left-2 h-2 -translate-y-1/2 rounded-full bg-linear-to-r from-success via-success to-danger" />
                    <input
                        aria-label={t("budgets.alert")}
                        type="range"
                        min={MIN_WARNING}
                        max={MAX_THRESHOLD}
                        value={thresholdWarning}
                        disabled={createBudget.isPending}
                        onChange={(event) => updateWarning(Number(event.target.value))}
                        className={WARNING_RANGE_CLASSES}
                    />
                    <input
                        aria-label={t("budgets.critical")}
                        type="range"
                        min={MIN_WARNING}
                        max={MAX_THRESHOLD}
                        value={thresholdCritical}
                        disabled={createBudget.isPending}
                        onChange={(event) => updateCritical(Number(event.target.value))}
                        className={CRITICAL_RANGE_CLASSES}
                    />
                </div>
                <div className="flex justify-between px-2 text-[11px] font-medium tabular-nums text-helper">
                    <span>0%</span>
                    <span>100%</span>
                </div>
                {errors.thresholdWarning && (
                    <span className="text-xs text-danger">
                        {errors.thresholdWarning.message}
                    </span>
                )}
                {errors.thresholdCritical && (
                    <span className="text-xs text-danger">
                        {errors.thresholdCritical.message}
                    </span>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-warning">{t("budgets.alert")}</span>
                            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-warning">
                                {thresholdWarning}%
                            </span>
                        </div>
                        <Label htmlFor="thresholdWarningAmount" className="mt-3 text-xs text-helper">
                            {t("budgets.alertAt")}
                        </Label>
                        <div className="relative mt-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-warning">$</span>
                            <Input
                                id="thresholdWarningAmount"
                                aria-label={`${t("budgets.alert")} amount`}
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={warningAmountInput}
                                disabled={createBudget.isPending}
                                onChange={(event) => {
                                    const formatted = formatterDecimal(event.target.value);
                                    if (formatted !== null) {
                                        setWarningAmountInput(formatted);
                                    }
                                }}
                                onBlur={() => updateThresholdFromAmount(warningAmountInput, updateWarning)}
                                className="h-10 border-warning/30 bg-surface-hard pl-7 font-semibold tabular-nums focus:border-warning"
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-danger">{t("budgets.critical")}</span>
                            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-danger">
                                {thresholdCritical}%
                            </span>
                        </div>
                        <Label htmlFor="thresholdCriticalAmount" className="mt-3 text-xs text-helper">
                            {t("budgets.alertAt")}
                        </Label>
                        <div className="relative mt-1">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-danger">$</span>
                            <Input
                                id="thresholdCriticalAmount"
                                aria-label={`${t("budgets.critical")} amount`}
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={criticalAmountInput}
                                disabled={createBudget.isPending}
                                onChange={(event) => {
                                    const formatted = formatterDecimal(event.target.value);
                                    if (formatted !== null) {
                                        setCriticalAmountInput(formatted);
                                    }
                                }}
                                onBlur={() => updateThresholdFromAmount(criticalAmountInput, updateCritical)}
                                className="h-10 border-danger/30 bg-surface-hard pl-7 font-semibold tabular-nums focus:border-danger"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ModalActionFooter>
                <Button
                    type="submit"
                    disabled={createBudget.isPending}
                    text={createBudget.isPending ? t("budgets.saving") : t("budgets.create")}
                />
            </ModalActionFooter>
        </form>
    );
};
