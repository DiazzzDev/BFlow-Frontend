import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { usePostIncome, usePutIncome } from "../hooks/useMutateIncomes";
import { getCategory } from "../utils/getCategory";
import { useGetCategories } from "../../settings/hooks/useGetCategories";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Textarea } from "@/components/controls/Textarea";
import { ToggleSwitch } from "@/components/controls/ToggleSwitch";
import { Button } from "@/components/controls/Button";
import type { Category } from "@/modules/app/interfaces/Category";
import {
    PERIODICITY_FORM_OPTIONS,
    PERIODICITY_VALUES,
    type Periodicity,
} from "@/modules/app/interfaces/Periodicity";
import { formatTodayDateInputValue } from "@/utils/formatters/formatDateInputValue";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { useAutoSelect } from "@/hooks/useAutoSelect";

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
        recurrencePattern: z.enum(PERIODICITY_VALUES).nullable(),
        categoryId: z.string().uuid("Selecciona una categoría"),
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

const defaultFormValues: IncomeFormValues = {
    title: "",
    description: "",
    amount: "",
    date: formatTodayDateInputValue(),
    recurring: false,
    recurrencePattern: null,
    categoryId: "",
};

interface IncomeFormProps {
    walletId: string;
    onSuccess?: () => void;
    readOnly?: boolean;
    transactionId?: string;
    source?: string;
    initialValues?: Partial<IncomeFormValues> & { categoryName?: string };
}

export const IncomeForm = ({
    walletId,
    onSuccess,
    readOnly = false,
    transactionId,
    source = "manual",
    initialValues,
}: IncomeFormProps) => {
    // Create / update mutations
    const createIncome = usePostIncome();
    const updateIncome = usePutIncome();

    // Form mode and disabled state
    const isEditing = Boolean(transactionId);
    const isSaving = createIncome.isPending || updateIncome.isPending;
    const isDisabled = readOnly || isSaving;

    // Category search and income category list
    const [categoryQuery, setCategoryQuery] = useState("");
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const incomeCategories = categoriesResponse?.data.filter((category) => category.type === "INCOME");

    // RHF form + watched fields
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            ...defaultFormValues,
            ...initialValues,
        },
    });
    const recurring = useWatch({ control, name: "recurring" });

    // UI selection: "auto" = first item; manual pick leaves auto mode
    const { selectedItem: selectedCategory, setSelection: setSelectedCategory, selection } = useAutoSelect(incomeCategories ?? [])

    // Seed categoryId: edit uses initialValues once; create uses auto default
    useEffect(() => {
        if (isEditing && selection === "auto" && initialValues?.categoryId) {
            const category = getCategory(incomeCategories ?? [], initialValues.categoryId);
            if (category) {
                setSelectedCategory(category);
                setValue("categoryId", category.id);
            }
        } else if (!isEditing && selection === "auto" && selectedCategory) {
            setValue("categoryId", selectedCategory.id);
        }
    }, [selectedCategory, setValue, setSelectedCategory, initialValues, isEditing, incomeCategories, selection]);

    // Build payload, create or update, then reset only on create
    const onSubmit = async (formData: IncomeFormValues) => {
        const payload = {
            title: formData.title,
            description: formData.description,
            amount: Number(formData.amount),
            date: formData.date,
            walletId,
            source,
            recurring: formData.recurring,
            recurrencePattern: formData.recurring ? formData.recurrencePattern : null,
            categoryId: formData.categoryId,
        };

        const promise = isEditing
            ? updateIncome.mutateAsync({ id: transactionId!, data: payload })
            : createIncome.mutateAsync(payload);

        toast.promise(promise, {
            loading: isEditing ? "Actualizando ingreso..." : "Creando ingreso...",
            success: isEditing ? "Ingreso actualizado" : "Ingreso creado",
            error: (err) =>
                err instanceof Error
                    ? err.message
                    : isEditing
                        ? "Error al actualizar el ingreso"
                        : "Error al crear el ingreso",
        });

        await promise;
        if (!isEditing) {
            reset({ ...defaultFormValues, date: formatTodayDateInputValue() });
            setSelectedCategory("auto");
            setCategoryQuery("");
        }
        onSuccess?.();
    };

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
                e.preventDefault();
                if (readOnly) {
                    return;
                }
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
                            disabled={isDisabled}
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
                            disabled={isDisabled}
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
                                disabled={isDisabled}
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
                                disabled={isDisabled}
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
                            setSelectedItem={(category) => {
                                setSelectedCategory(category);
                                field.onChange(category?.id ?? "");
                            }}
                            query={categoryQuery}
                            setQuery={setCategoryQuery}
                            data={incomeCategories ?? []}
                            getKey={(category) => category.id}
                            getLabel={(category) => category.name}
                            disabled={isDisabled || isCategoriesLoading}
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
                            disabled={isDisabled}
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
                                    disabled={isDisabled}
                                    onChange={(event) =>
                                        field.onChange(
                                            event.target.value
                                                ? (event.target.value as Periodicity)
                                                : null,
                                        )
                                    }
                                    onBlur={field.onBlur}
                                >
                                    <option value="">Selecciona un patrón</option>
                                    {PERIODICITY_FORM_OPTIONS.map(({ value, label }) => (
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
            </div>

            {!readOnly && (
                <Button
                    type="submit"
                    disabled={isSaving}
                    text={
                        isSaving
                            ? "Guardando..."
                            : isEditing
                                ? "Guardar cambios"
                                : "Crear ingreso"
                    }
                    className="self-end"
                />
            )}
        </form>
    );
};
