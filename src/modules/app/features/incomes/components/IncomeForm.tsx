import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutateIncomes } from "../hooks/useMutateIncomes";
import type { RecurrencePattern } from "../interfaces/Income";
import { useGetCategories } from "../../settings/hooks/useGetCategories";
import type { Category } from "../../settings/interfaces/Category";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Textarea } from "@/components/controls/Textarea";
import { ToggleSwitch } from "@/components/controls/ToggleSwitch";
import { Button } from "@/components/controls/Button";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";

const recurrencePatterns: Array<{ value: RecurrencePattern; label: string }> = [
    { value: "DAILY", label: "Diario" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "MONTHLY", label: "Mensual" },
    { value: "YEARLY", label: "Anual" },
];

const incomeSchema = z
    .object({
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string().min(1, "La descripción es obligatoria"),
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        date: z.string().min(1, "La fecha es obligatoria"),
        recurring: z.boolean(),
        recurrencePattern: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).nullable(),
        categoryId: z.string().uuid("Selecciona una categoría"),
        taxable: z.boolean(),
    })
    .superRefine((values, ctx) => {
        if (values.recurring && !values.recurrencePattern) {
            ctx.addIssue({
                code: "custom",
                path: ["recurrencePattern"],
                message: "Selecciona un patrón de recurrencia",
            });
        }
    });

type IncomeFormValues = z.infer<typeof incomeSchema>;

const today = () => new Date().toISOString().slice(0, 10);

const defaultFormValues: IncomeFormValues = {
    title: "",
    description: "",
    amount: "",
    date: today(),
    recurring: false,
    recurrencePattern: null,
    categoryId: "",
    taxable: false,
};

interface IncomeFormProps {
    walletId: string;
    onSuccess?: () => void;
}

export const IncomeForm = ({ walletId, onSuccess }: IncomeFormProps) => {
    const { createIncome } = useMutateIncomes();
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const [categoryQuery, setCategoryQuery] = useState("");

    const incomeCategories =
        categoriesResponse?.data.filter((category) => category.type === "INCOME") ?? [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeSchema),
        defaultValues: defaultFormValues,
    });

    const recurring = useWatch({ control, name: "recurring" });
    const categoryId = useWatch({ control, name: "categoryId" });
    const selectedCategory =
        incomeCategories.find((category) => category.id === categoryId) ?? null;

    const onSubmit = async (formData: IncomeFormValues) => {
        const promise = createIncome.mutateAsync({
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount),
            date: formData.date,
            walletId,
            source: "manual",
            recurring: formData.recurring,
            recurrencePattern: formData.recurring ? formData.recurrencePattern : null,
            categoryId: formData.categoryId,
            taxable: formData.taxable,
        });

        toast.promise(promise, {
            loading: "Creando ingreso...",
            success: "Ingreso creado",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear el ingreso",
        });

        await promise;
        reset({ ...defaultFormValues, date: today() });
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
            <div className="flex flex-col gap-1">
                <Label htmlFor="title">Título</Label>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="title"
                            placeholder="Ej. Salario"
                            disabled={createIncome.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.title && (
                    <span className="text-danger text-xs">{errors.title.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="description">Descripción</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="description"
                            placeholder="Detalle del ingreso"
                            rows={3}
                            disabled={createIncome.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-danger text-xs">{errors.description.message}</span>
                )}
            </div>

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
                                disabled={createIncome.isPending}
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
                        <span className="text-danger text-xs">{errors.amount.message}</span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="date">Fecha</Label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="date"
                                type="date"
                                placeholder=""
                                disabled={createIncome.isPending}
                                {...field}
                            />
                        )}
                    />
                    {errors.date && (
                        <span className="text-danger text-xs">{errors.date.message}</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <SelectAutoComplete<Category>
                            idSelect="categoryId"
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
                            data={incomeCategories}
                            getKey={(category) => category.id}
                            getLabel={(category) => category.name}
                            disabled={createIncome.isPending || isCategoriesLoading}
                        />
                    )}
                />
                {errors.categoryId && (
                    <span className="text-danger text-xs">{errors.categoryId.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-light-10 bg-surface-hard/40 p-4">
                <Controller
                    name="recurring"
                    control={control}
                    render={({ field }) => (
                        <ToggleSwitch
                            label="Ingreso recurrente"
                            checked={field.value}
                            disabled={createIncome.isPending}
                            onChange={field.onChange}
                        />
                    )}
                />

                {recurring && (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="recurrencePattern">Patrón</Label>
                        <Controller
                            name="recurrencePattern"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="recurrencePattern"
                                    value={field.value ?? ""}
                                    disabled={createIncome.isPending}
                                    onChange={(event) =>
                                        field.onChange(
                                            event.target.value
                                                ? (event.target.value as RecurrencePattern)
                                                : null,
                                        )
                                    }
                                    onBlur={field.onBlur}
                                >
                                    <option value="">Selecciona un patrón</option>
                                    {recurrencePatterns.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.recurrencePattern && (
                            <span className="text-danger text-xs">
                                {errors.recurrencePattern.message}
                            </span>
                        )}
                    </div>
                )}

                <Controller
                    name="taxable"
                    control={control}
                    render={({ field }) => (
                        <ToggleSwitch
                            label="Gravable"
                            checked={field.value}
                            disabled={createIncome.isPending}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>

            <Button
                type="submit"
                disabled={createIncome.isPending}
                text={createIncome.isPending ? "Guardando..." : "Crear ingreso"}
                className="self-end"
            />
        </form>
    );
};
