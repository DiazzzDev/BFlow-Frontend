import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutateBudgets } from "../hooks/useMutateBudgets";
import type { BudgetPeriod, BudgetScope } from "../interfaces/Budget";
import { useGetCategories } from "../../settings/hooks/useGetCategories";
import type { Category } from "../../settings/interfaces/Category";
import { useGetWallets } from "../../wallets/hooks/useGetWallets";
import type { Wallet } from "../../wallets/interfaces/Wallets";

import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Button } from "@/components/controls/Button";
import { RangeSlider } from "@/components/controls/RangeSlider";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { useDebounce } from "@/hooks/useDebounce";

const scopeTabs: Array<{ id: BudgetScope; label: string }> = [
    { id: "WALLET", label: "Wallet" },
    { id: "CATEGORY_GLOBAL", label: "Categoría" },
    { id: "WALLET_CATEGORY", label: "Wallet + categoría" },
];

const periodOptions: Array<{ value: BudgetPeriod; label: string }> = [
    { value: "MONTHLY", label: "Mensual" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "YEARLY", label: "Anual" },
    { value: "DAILY", label: "Diario" },
];

const MIN_WARNING = 1;
const MIN_CRITICAL = 2;
const MAX_THRESHOLD = 100;

const budgetSchema = z
    .object({
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        period: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
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

const today = () => new Date().toISOString().slice(0, 10);

const defaultFormValues: BudgetFormValues = {
    amount: "",
    period: "MONTHLY",
    startDate: today(),
    thresholdWarning: 60,
    thresholdCritical: 90,
    walletId: "",
    categoryId: "",
};

interface BudgetFormProps {
    onSuccess?: () => void;
}

export const BudgetForm = ({ onSuccess }: BudgetFormProps) => {
    const { createBudget } = useMutateBudgets();
    const [scope, setScope] = useState<BudgetScope>("WALLET");
    const [walletQuery, setWalletQuery] = useState("");
    const [categoryQuery, setCategoryQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);

    const { data: walletsResponse, isLoading: isWalletsLoading } = useGetWallets(
        "MINE",
        debouncedWalletQuery,
    );
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();

    const wallets = walletsResponse?.data.content ?? [];
    const categories =
        categoriesResponse?.data.filter((category) => category.type === "EXPENSE") ?? [];

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: defaultFormValues,
    });

    const walletId = useWatch({ control, name: "walletId" });
    const categoryId = useWatch({ control, name: "categoryId" });
    const thresholdWarning = useWatch({ control, name: "thresholdWarning" });
    const thresholdCritical = useWatch({ control, name: "thresholdCritical" });
    const selectedWallet = wallets.find((wallet) => wallet.id === walletId) ?? null;
    const selectedCategory = categories.find((category) => category.id === categoryId) ?? null;

    const needsWallet = scope === "WALLET" || scope === "WALLET_CATEGORY";
    const needsCategory = scope === "CATEGORY_GLOBAL" || scope === "WALLET_CATEGORY";

    const handleScopeChange = (nextScope: BudgetScope) => {
        setScope(nextScope);
        setValue("walletId", "");
        setValue("categoryId", "");
        setWalletQuery("");
        setCategoryQuery("");
    };

    const onSubmit = async (formData: BudgetFormValues) => {
        if (needsWallet && !formData.walletId) {
            toast.error("Selecciona una billetera");
            return;
        }
        if (needsCategory && !formData.categoryId) {
            toast.error("Selecciona una categoría");
            return;
        }

        const promise = createBudget.mutateAsync({
            amount: Number(formData.amount),
            period: formData.period,
            startDate: formData.startDate,
            scope,
            thresholdWarning: formData.thresholdWarning,
            thresholdCritical: formData.thresholdCritical,
            ...(needsWallet ? { walletId: formData.walletId } : {}),
            categoryId: needsCategory ? formData.categoryId : null,
        });

        toast.promise(promise, {
            loading: "Creando presupuesto...",
            success: "Presupuesto creado",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear el presupuesto",
        });

        await promise;
        reset({ ...defaultFormValues, startDate: today() });
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
                tabs={scopeTabs}
                selected={scope}
                onChange={handleScopeChange}
                ariaLabel="Alcance del presupuesto"
            />

            {needsWallet && (
                <div className="flex flex-col gap-1">
                    <Controller
                        name="walletId"
                        control={control}
                        render={({ field }) => (
                            <SelectAutoComplete<Wallet>
                                idSelect="budgetWalletId"
                                label="Billetera"
                                placeholder={
                                    isWalletsLoading
                                        ? "Cargando billeteras..."
                                        : "Buscar billetera..."
                                }
                                selectedItem={selectedWallet}
                                setSelectedItem={(wallet) => field.onChange(wallet.id)}
                                query={walletQuery}
                                setQuery={setWalletQuery}
                                data={wallets}
                                getKey={(wallet) => wallet.id}
                                getLabel={(wallet) => wallet.name}
                                disabled={createBudget.isPending || isWalletsLoading}
                            />
                        )}
                    />
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
                                label="Categoría"
                                placeholder={
                                    isCategoriesLoading
                                        ? "Cargando categorías..."
                                        : "Buscar categoría..."
                                }
                                selectedItem={selectedCategory}
                                setSelectedItem={(category) => field.onChange(category.id)}
                                query={categoryQuery}
                                setQuery={setCategoryQuery}
                                data={categories}
                                getKey={(category) => category.id}
                                getLabel={(category) => category.name}
                                disabled={createBudget.isPending || isCategoriesLoading}
                            />
                        )}
                    />
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="amount">Monto</Label>
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
                    <Label htmlFor="period">Periodo</Label>
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
                                {periodOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="startDate">Fecha de inicio</Label>
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
                            label="Alerta"
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
                            label="Crítico"
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
                text={createBudget.isPending ? "Guardando..." : "Crear presupuesto"}
                className="self-end"
            />
        </form>
    );
};
