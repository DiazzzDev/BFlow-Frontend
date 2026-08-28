import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePostRecurring } from "../hooks/useMutateRecurring";
import type { RecurringFrequency, RecurringType } from "../interfaces/Recurring";
import { useGetCategories } from "../../settings/hooks/useGetCategories";
import type { Category } from "../../settings/interfaces/Category";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Textarea } from "@/components/controls/Textarea";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { Button } from "@/components/controls/Button";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";

const typeTabs: Array<{ id: RecurringType; label: string }> = [
    { id: "INCOME", label: "Ingreso" },
    { id: "EXPENSE", label: "Gasto" },
];

const frequencyOptions: Array<{ value: RecurringFrequency; label: string }> = [
    { value: "DAILY", label: "Diario" },
    { value: "WEEKLY", label: "Semanal" },
    { value: "MONTHLY", label: "Mensual" },
    { value: "YEARLY", label: "Anual" },
];

const intervalUnitLabels: Record<RecurringFrequency, string> = {
    DAILY: "días",
    WEEKLY: "semanas",
    MONTHLY: "meses",
    YEARLY: "años",
};

const recurringSchema = z
    .object({
        type: z.enum(["INCOME", "EXPENSE"]),
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string().min(1, "La descripción es obligatoria"),
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        categoryId: z.string().uuid("Selecciona una categoría"),
        frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
        intervalValue: z
            .string()
            .min(1, "El intervalo es obligatorio")
            .refine(
                (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
                "Debe ser un entero mayor a 0",
            ),
        startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
        endDate: z.string().min(1, "La fecha de fin es obligatoria"),
    })
    .superRefine((values, ctx) => {
        if (values.endDate < values.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "La fecha de fin debe ser posterior o igual al inicio",
            });
        }
    });

type RecurringFormValues = z.infer<typeof recurringSchema>;

const today = () => new Date().toISOString().slice(0, 10);

const defaultFormValues: RecurringFormValues = {
    type: "EXPENSE",
    title: "",
    description: "",
    amount: "",
    categoryId: "",
    frequency: "MONTHLY",
    intervalValue: "1",
    startDate: today(),
    endDate: "",
};

interface RecurringFormProps {
    walletId: string;
    onSuccess?: () => void;
}

export const RecurringForm = ({ walletId, onSuccess }: RecurringFormProps) => {
    const createRecurring = usePostRecurring();
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const [categoryQuery, setCategoryQuery] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<RecurringFormValues>({
        resolver: zodResolver(recurringSchema),
        defaultValues: {
            ...defaultFormValues,
            startDate: today(),
        },
    });

    const type = useWatch({ control, name: "type" });
    const frequency = useWatch({ control, name: "frequency" });
    const intervalValue = useWatch({ control, name: "intervalValue" });
    const categoryId = useWatch({ control, name: "categoryId" });

    const categories =
        categoriesResponse?.data.filter((category) => category.type === type) ?? [];
    const selectedCategory = categories.find((category) => category.id === categoryId) ?? null;

    const onSubmit = async (formData: RecurringFormValues) => {
        const promise = createRecurring.mutateAsync({
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount),
            walletId,
            categoryId: formData.categoryId,
            type: formData.type,
            frequency: formData.frequency,
            intervalValue: Number(formData.intervalValue),
            startDate: formData.startDate,
            endDate: formData.endDate,
        });

        toast.promise(promise, {
            loading: "Programando transacción...",
            success: "Transacción programada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al programar la transacción",
        });

        await promise;
        reset({ ...defaultFormValues, startDate: today() });
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
            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <SegmentedTabs
                        tabs={typeTabs}
                        selected={field.value}
                        onChange={(nextType) => {
                            field.onChange(nextType);
                            setValue("categoryId", "");
                            setCategoryQuery("");
                        }}
                        ariaLabel="Tipo de transacción"
                    />
                )}
            />

            <div className="flex flex-col gap-1">
                <Label htmlFor="recurringTitle">Título</Label>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="recurringTitle"
                            placeholder="Ej. Netflix"
                            disabled={createRecurring.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.title && (
                    <span className="text-xs text-danger">{errors.title.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="recurringDescription">Descripción</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="recurringDescription"
                            placeholder="Detalle de la transacción"
                            rows={3}
                            disabled={createRecurring.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-xs text-danger">{errors.description.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="recurringAmount">Monto</Label>
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="recurringAmount"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            disabled={createRecurring.isPending}
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

            <div className="flex flex-col gap-1">
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <SelectAutoComplete<Category>
                            idSelect="recurringCategoryId"
                            label="Categoría"
                            placeholder={
                                isCategoriesLoading
                                    ? "Cargando categorías..."
                                    : "Buscar categoría..."
                            }
                            selectedItem={selectedCategory}
                            setSelectedItem={(category) => field.onChange(category?.id ?? "")}
                            query={categoryQuery}
                            setQuery={setCategoryQuery}
                            data={categories}
                            getKey={(category) => category.id}
                            getLabel={(category) => category.name}
                            disabled={createRecurring.isPending || isCategoriesLoading}
                        />
                    )}
                />
                {errors.categoryId && (
                    <span className="text-xs text-danger">{errors.categoryId.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringFrequency">Frecuencia</Label>
                    <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="recurringFrequency"
                                value={field.value}
                                disabled={createRecurring.isPending}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                            >
                                {frequencyOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.frequency && (
                        <span className="text-xs text-danger">{errors.frequency.message}</span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringInterval">Cada</Label>
                    <Controller
                        name="intervalValue"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="recurringInterval"
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                disabled={createRecurring.isPending}
                                name={field.name}
                                value={field.value}
                                onChange={(e) => {
                                    const nextValue = e.target.value.replace(/\D/g, "");
                                    field.onChange(nextValue);
                                }}
                            />
                        )}
                    />
                    {errors.intervalValue && (
                        <span className="text-xs text-danger">
                            {errors.intervalValue.message}
                        </span>
                    )}
                    <span className="text-xs text-helper">
                        Se repetirá cada {intervalValue || "1"} {intervalUnitLabels[frequency]}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringStartDate">Fecha de inicio</Label>
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="recurringStartDate"
                                type="date"
                                placeholder=""
                                disabled={createRecurring.isPending}
                                {...field}
                            />
                        )}
                    />
                    {errors.startDate && (
                        <span className="text-xs text-danger">{errors.startDate.message}</span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringEndDate">Fecha de fin</Label>
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="recurringEndDate"
                                type="date"
                                placeholder=""
                                disabled={createRecurring.isPending}
                                {...field}
                            />
                        )}
                    />
                    {errors.endDate && (
                        <span className="text-xs text-danger">{errors.endDate.message}</span>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                disabled={createRecurring.isPending}
                text={createRecurring.isPending ? "Programando..." : "Programar transacción"}
                className="self-end"
            />
        </form>
    );
};
