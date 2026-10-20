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
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Button } from "@/components/controls/Button";
import { RangeSlider } from "@/components/controls/RangeSlider";
import type { BudgetScope } from "@/modules/app/interfaces/Budget";
import type { Category } from "@/modules/app/interfaces/Category";
import {
    PERIODICITY_FORM_OPTIONS,
    PERIODICITY_VALUES,
} from "@/modules/app/interfaces/Periodicity";
import type { Wallet } from "@/modules/app/interfaces/Wallet";
import { formatTodayDateInputValue } from "@/utils/formatters/formatDateInputValue";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSelect } from "@/hooks/useAutoSelect";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const MIN_WARNING = 1;
const MIN_CRITICAL = 2;
const MAX_THRESHOLD = 100;

const budgetSchema = z
    .object({
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        period: z.enum(PERIODICITY_VALUES),
        startDate: z.string().min(1, "La fecha es obligatoria"),
        thresholdWarning: z
            .number()
            .min(MIN_WARNING, `El mínimo es ${MIN_WARNING}%`)
            .max(MAX_THRESHOLD - 1, "La alerta debe ser menor a 100%"),
        thresholdCritical: z
            .number()
            .min(MIN_CRITICAL, `El mínimo es ${MIN_CRITICAL}%`)
            .max(MAX_THRESHOLD, "El máximo es 100%"),
        walletId: z.string(),
        categoryId: z.string(),
    })
    .superRefine((values, ctx) => {
        if (values.thresholdCritical <= values.thresholdWarning) {
            ctx.addIssue({
                code: "custom",
                path: ["thresholdCritical"],
                message: "El crítico debe ser mayor que la alerta",
            });
        }
    });

type BudgetFormValues = z.infer<typeof budgetSchema>;

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

    // Budget scope and which fields apply
    const [scope, setScope] = useState<BudgetScope>("WALLET");
    const needsWallet = scope === "WALLET" || scope === "WALLET_CATEGORY";
    const needsCategory = scope === "CATEGORY_GLOBAL" || scope === "WALLET_CATEGORY";

    // Wallet search (debounced) and list loading
    const [walletQuery, setWalletQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);
    const { data: walletsResponse, isLoading: isWalletsLoading } = useGetWallets("MINE", debouncedWalletQuery,);
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const wallets = walletsResponse?.data.content ?? [];
    const categories = categoriesResponse?.data.filter((category) => category.type === "EXPENSE") ?? [];

    // UI selection: "auto" = first item; manual pick leaves auto mode
    const { selectedItem: selectedWallet, setSelection: setSelectedWallet, selection: walletSelection } = useAutoSelect(wallets);
    const { selectedItem: selectedCategory, setSelection: setSelectedCategory, selection: categorySelection } = useAutoSelect(categories);

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

    // Sync form ids: clear if field does not apply; seed default only while in "auto"
    useEffect(() => {
        if (!needsWallet) {
            setValue("walletId", "");
        } else if (walletSelection === "auto" && selectedWallet) {
            setValue("walletId", selectedWallet.id);
        }

        if (!needsCategory) {
            setValue("categoryId", "");
        } else if (categorySelection === "auto" && selectedCategory) {
            setValue("categoryId", selectedCategory.id);
        }
    }, [selectedCategory, selectedWallet, setValue, needsCategory, needsWallet, walletSelection, categorySelection]);

    // On tab change: clear form, queries, and return to auto mode
    const handleScopeChange = (nextScope: BudgetScope) => {
        setScope(nextScope);
        setValue("walletId", "");
        setValue("categoryId", "");
        setSelectedWallet("auto");
        setSelectedCategory("auto");
        setWalletQuery("");
        setCategoryQuery("");
    };

    // Validate ids by scope, create budget, then reset the form
    const onSubmit = async (formData: BudgetFormValues) => {
        if (needsWallet && !formData.walletId) {
            setError("walletId", {
                message: "Debes seleccionar una cartera",
            });
            return;
        }
        if (needsCategory && !formData.categoryId) {
            setError("categoryId", {
                message: "Debes seleccionar una categoria",
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
        setSelectedWallet("auto");
        setSelectedCategory("auto");
        setWalletQuery("");
        setCategoryQuery("");
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
                tabs={BUDGET_SCOPE_TABS}
                selected={scope}
                onChange={handleScopeChange}
                ariaLabel={t("budgets.scopeLabel")}
            />

            {needsWallet && (
                <div className="flex flex-col gap-1">
                    <Controller
                        name="walletId"
                        control={control}
                        render={({ field }) => (
                            <SelectAutoComplete<Wallet>
                                idSelect="budgetWalletId"
                                label={t("budgets.wallet")}
                                placeholder={
                                    isWalletsLoading
                                        ? t("budgets.loadingWallets")
                                        : t("budgets.searchWallet")
                                }
                                selectedItem={selectedWallet}
                                setSelectedItem={(wallet) => {
                                    setSelectedWallet(wallet);
                                    field.onChange(wallet?.id ?? "");
                                }}
                                query={walletQuery}
                                setQuery={setWalletQuery}
                                data={wallets}
                                getKey={(wallet) => wallet.id}
                                getLabel={(wallet) => wallet.name}
                                disabled={createBudget.isPending}
                            />
                        )}
                    />
                    {errors.walletId && (
                        <span className="text-xs text-danger">{errors.walletId.message}</span>
                    )}
                </div>
            )}

            {needsCategory && (
                <div className="flex flex-col gap-1">
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <SelectAutoComplete<Category>
                                idSelect="budgetCategoryId"
                                label={t("budgets.category")}
                                placeholder={
                                    isCategoriesLoading
                                        ? t("budgets.loadingCategories")
                                        : t("budgets.searchCategory")
                                }
                                selectedItem={selectedCategory}
                                setSelectedItem={(category) => {
                                    setSelectedCategory(category);
                                    field.onChange(category?.id ?? "");
                                }}
                                query={categoryQuery}
                                setQuery={setCategoryQuery}
                                data={categories}
                                getKey={(category) => category.id}
                                getLabel={(category) => category.name}
                                disabled={createBudget.isPending}
                            />
                        )}
                    />
                    {errors.categoryId && (
                        <span className="text-xs text-danger">{errors.categoryId.message}</span>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
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
                                onChange={(e) => {
                                    const formatted = formatterDecimal(e.target.value);
                                    if (formatted !== null) { field.onChange(formatted) };
                                }}
                            />
                        )}
                    />
                    {errors.amount && (
                        <span className="text-xs text-danger">{errors.amount.message}</span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="period">{t("budgets.period")}</Label>
                    <Controller
                        name="period"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="period"
                                value={field.value}
                                disabled={createBudget.isPending}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                            >
                                {PERIODICITY_FORM_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {t(`budgets.periods.${option.value.toLowerCase()}`, { defaultValue: option.label })}
                                    </option>
                                ))}
                            </Select>
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
                        <Input
                            id="startDate"
                            type="date"
                            placeholder=""
                            disabled={createBudget.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.startDate && (
                    <span className="text-xs text-danger">{errors.startDate.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <Controller
                    name="thresholdWarning"
                    control={control}
                    render={({ field }) => (
                        <RangeSlider
                            id="thresholdWarning"
                            label={t("budgets.alert")}
                            tone="warning"
                            min={MIN_WARNING}
                            max={MAX_THRESHOLD - 1}
                            value={field.value}
                            disabled={createBudget.isPending}
                            onChange={(nextWarning) => {
                                field.onChange(nextWarning);
                                if (thresholdCritical <= nextWarning) {
                                    setValue(
                                        "thresholdCritical",
                                        Math.min(MAX_THRESHOLD, nextWarning + 1),
                                    );
                                }
                            }}
                        />
                    )}
                />
                {errors.thresholdWarning && (
                    <span className="-mt-3 text-xs text-danger">
                        {errors.thresholdWarning.message}
                    </span>
                )}

                <Controller
                    name="thresholdCritical"
                    control={control}
                    render={({ field }) => (
                        <RangeSlider
                            id="thresholdCritical"
                            label={t("budgets.critical")}
                            tone="danger"
                            min={Math.max(MIN_CRITICAL, thresholdWarning + 1)}
                            max={MAX_THRESHOLD}
                            value={field.value}
                            disabled={createBudget.isPending}
                            onChange={field.onChange}
                        />
                    )}
                />
                {errors.thresholdCritical && (
                    <span className="-mt-3 text-xs text-danger">
                        {errors.thresholdCritical.message}
                    </span>
                )}
            </div>

            <Button
                type="submit"
                disabled={createBudget.isPending}
                text={createBudget.isPending ? t("budgets.saving") : t("budgets.create")}
                className="self-end"
            />
        </form>
    );
};
