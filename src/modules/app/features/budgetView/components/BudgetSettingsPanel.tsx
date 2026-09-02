import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutateBudgets } from "../../budgets/hooks/useMutateBudgets";
import type { BudgetDetail, BudgetPeriod } from "../../budgets/interfaces/Budget";
import {
    budgetPeriodLabels,
    budgetScopeLabels,
    getBudgetDisplayName,
} from "../../budgets/utils/budgetStatus";

import { DeleteBudgetModal } from "./DeleteBudgetModal";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { RangeSlider } from "@/components/controls/RangeSlider";
import { Button } from "@/components/controls/Button";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";

const MIN_WARNING = 1;
const MIN_CRITICAL = 2;
const MAX_THRESHOLD = 100;

const periodOptions: Array<{ value: BudgetPeriod; label: string }> = [
    { value: "MONTHLY", label: "Mensual" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "YEARLY", label: "Anual" },
    { value: "DAILY", label: "Diario" },
];

const settingsSchema = z
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

type SettingsFormValues = z.infer<typeof settingsSchema>;

const toDateInputValue = (date: string) => date.slice(0, 10);

interface BudgetSettingsPanelProps {
    budget?: BudgetDetail;
    isLoading: boolean;
}

export const BudgetSettingsPanel = ({
    budget,
    isLoading,
}: BudgetSettingsPanelProps) => {
    const navigate = useNavigate();
    const { updateBudget, removeBudget } = useMutateBudgets();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            amount: "",
            period: "MONTHLY",
            startDate: "",
            thresholdWarning: 60,
            thresholdCritical: 90,
        },
    });

    useEffect(() => {
        if (!budget) {
            return;
        }
        reset({
            amount: String(budget.budgetLimit),
            period: budget.period,
            startDate: toDateInputValue(budget.startDate),
            thresholdWarning: budget.thresholdWarning,
            thresholdCritical: budget.thresholdCritical,
        });
    }, [budget, reset]);

    const thresholdWarning = useWatch({ control, name: "thresholdWarning" });
    const thresholdCritical = useWatch({ control, name: "thresholdCritical" });

    const onSubmit = async (formData: SettingsFormValues) => {
        if (!budget) {
            return;
        }

        const promise = updateBudget.mutateAsync({
            id: budget.id,
            data: {
                amount: Number(formData.amount),
                period: formData.period,
                startDate: formData.startDate,
                thresholdWarning: formData.thresholdWarning,
                thresholdCritical: formData.thresholdCritical,
            },
        });

        toast.promise(promise, {
            loading: "Guardando cambios...",
            success: "Presupuesto actualizado",
            error: (err) =>
                err instanceof Error ? err.message : "Error al actualizar el presupuesto",
        });

        await promise;
        reset(formData);
    };

    const handleConfirmDelete = async (): Promise<void> => {
        if (!budget) {
            return;
        }

        const promise = removeBudget.mutateAsync(budget.id);

        toast.promise(promise, {
            loading: "Eliminando presupuesto...",
            success: "Presupuesto eliminado",
            error: (err) =>
                err instanceof Error ? err.message : "Error al eliminar el presupuesto",
        });

        await promise;
        setIsDeleteOpen(false);
        void navigate("/app/budgets", { replace: true });
    };

    if (isLoading || !budget) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden @2xl:flex-row">
                <div className="flex min-h-0 flex-1 flex-col border-b border-light-10 px-0 py-5 @2xl:border-b-0 @2xl:border-r @2xl:pr-7">
                    <SkeletonText className="mb-6 h-5 w-24" />
                    <div className="flex flex-col gap-4">
                        <SkeletonText className="h-10 w-full" />
                        <SkeletonText className="h-10 w-full" />
                    </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col px-0 py-5 @2xl:pl-7">
                    <SkeletonText className="mb-6 h-5 w-28" />
                    <SkeletonText className="h-14 w-full" />
                </div>
            </div>
        );
    }

    const isSaving = updateBudget.isPending || removeBudget.isPending;
    const budgetName = getBudgetDisplayName(budget);

    return (
        <div className="flex flex-1 flex-col @2xl:flex-row">
            <section className="flex min-w-0 flex-1 flex-col border-b border-light-10 @2xl:border-b-0 @2xl:border-r">
                <div className="flex-1 py-5 @2xl:pr-7">
                    <div className="mb-6">
                        <h2 className="text-base font-semibold text-light">General</h2>
                        <p className="mt-1 text-sm text-helper">
                            Monto, periodo y umbrales de este presupuesto.
                        </p>
                    </div>

                    <form
                        className="flex w-full flex-col gap-5"
                        onSubmit={(e) => {
                            void handleSubmit(onSubmit)(e);
                        }}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex flex-1 flex-col gap-1">
                                <Label htmlFor="budgetSettingsAmount">Monto</Label>
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="budgetSettingsAmount"
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            disabled={isSaving}
                                            name={field.name}
                                            value={field.value}
                                            onChange={(e) => {
                                                const formatted = formatterDecimal(e.target.value);
                                                if (formatted !== null) {
                                                    field.onChange(formatted);
                                                }
                                            }}
                                        />
                                    )}
                                />
                                {errors.amount && (
                                    <span className="text-xs text-danger">{errors.amount.message}</span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-1">
                                <Label htmlFor="budgetSettingsPeriod">Periodo</Label>
                                <Controller
                                    name="period"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            id="budgetSettingsPeriod"
                                            value={field.value}
                                            disabled={isSaving}
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
                            <Label htmlFor="budgetSettingsStartDate">Fecha de inicio</Label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="budgetSettingsStartDate"
                                        type="date"
                                        placeholder=""
                                        disabled={isSaving}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.startDate && (
                                <span className="text-xs text-danger">{errors.startDate.message}</span>
                            )}
                        </div>

                        <Controller
                            name="thresholdWarning"
                            control={control}
                            render={({ field }) => (
                                <RangeSlider
                                    id="budgetSettingsWarning"
                                    label="Alerta"
                                    tone="warning"
                                    min={MIN_WARNING}
                                    max={MAX_THRESHOLD - 1}
                                    value={field.value}
                                    disabled={isSaving}
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
                                    id="budgetSettingsCritical"
                                    label="Crítico"
                                    tone="danger"
                                    min={Math.max(MIN_CRITICAL, thresholdWarning + 1)}
                                    max={MAX_THRESHOLD}
                                    value={field.value}
                                    disabled={isSaving}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.thresholdCritical && (
                            <span className="-mt-3 text-xs text-danger">
                                {errors.thresholdCritical.message}
                            </span>
                        )}

                        <Button
                            type="submit"
                            disabled={isSaving || !isDirty}
                            text={updateBudget.isPending ? "Guardando..." : "Guardar cambios"}
                            className="self-end"
                        />
                    </form>
                </div>

                <div className="flex flex-col gap-3 border-t border-light-10 py-4 sm:flex-row sm:items-center sm:justify-between @2xl:pr-7">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-light">Eliminar presupuesto</p>
                        <p className="mt-0.5 text-xs text-helper">
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setIsDeleteOpen(true)}
                        className="cursor-pointer rounded-lg border border-danger-50 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Eliminar
                    </button>
                </div>
            </section>

            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="border-b border-light-10 py-5 @2xl:pl-7">
                    <h2 className="text-base font-semibold text-light">Alcance</h2>
                    <p className="mt-1 text-sm text-helper">
                        Billetera y categoría no se pueden cambiar después de crear.
                    </p>
                </div>

                <dl className="flex flex-col gap-5 py-5 @2xl:pl-7">
                    <div>
                        <dt className="text-xs text-helper">Tipo</dt>
                        <dd className="mt-1 text-sm font-medium text-light">
                            {budgetScopeLabels[budget.scope] ?? budget.scope}
                        </dd>
                    </div>
                    {budget.walletName ? (
                        <div>
                            <dt className="text-xs text-helper">Billetera</dt>
                            <dd className="mt-1 text-sm font-medium text-light">{budget.walletName}</dd>
                        </div>
                    ) : null}
                    {budget.categoryName ? (
                        <div>
                            <dt className="text-xs text-helper">Categoría</dt>
                            <dd className="mt-1 text-sm font-medium text-light">{budget.categoryName}</dd>
                        </div>
                    ) : null}
                    <div>
                        <dt className="text-xs text-helper">Periodo</dt>
                        <dd className="mt-1 text-sm font-medium text-light">
                            {budgetPeriodLabels[budget.period] ?? budget.period}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-helper">Fin</dt>
                        <dd className="mt-1 text-sm font-medium text-light">
                            {toDateInputValue(budget.endDate)}
                        </dd>
                    </div>
                </dl>
            </section>

            <DeleteBudgetModal
                isOpen={isDeleteOpen}
                budgetName={budgetName}
                isDeleting={removeBudget.isPending}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => void handleConfirmDelete()}
            />
        </div>
    );
};
