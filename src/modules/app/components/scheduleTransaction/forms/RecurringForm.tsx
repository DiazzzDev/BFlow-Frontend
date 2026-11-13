import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { useGetCategories } from "../../../features/settings/hooks/useGetCategories";
import { usePostRecurring } from "../hooks/useMutateRecurring";
import {
    RECURRING_INTERVAL_UNIT_LABELS,
    RECURRING_TYPE_TABS,
} from "../utils/tabs/recurringTabs";

import { Input } from "@/components/controls/Input";
import { DatePicker } from "@/components/controls/DatePicker";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { Textarea } from "@/components/controls/Textarea";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { Button } from "@/components/controls/Button";
import { CATEGORY_TYPE_VALUES } from "@/modules/app/interfaces/Category";
import {
    PERIODICITY_FORM_OPTIONS,
    PERIODICITY_VALUES,
} from "@/modules/app/interfaces/Periodicity";
import { formatTodayDateInputValue } from "@/utils/formatters/formatDateInputValue";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";
import { setApiValidationErrors } from "@/utils/api";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";

const recurringSchema = z
    .object({
        type: z.enum(CATEGORY_TYPE_VALUES),
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string(),
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        categoryId: z.string(),
        frequency: z.enum(PERIODICITY_VALUES),
        intervalValue: z
            .string()
            .min(1, "El intervalo es obligatorio")
            .refine(
                (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
                "Debe ser un entero mayor a 0",
            ),
        startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
        endDate: z.string(),
    })
    .superRefine((values, ctx) => {
        if (values.startDate && values.endDate && values.endDate < values.startDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "La fecha de fin debe ser posterior o igual al inicio",
            });
        }
    });

type RecurringFormValues = z.infer<typeof recurringSchema>;

const defaultFormValues: RecurringFormValues = {
    type: "EXPENSE",
    title: "",
    description: "",
    amount: "",
    categoryId: "",
    frequency: "MONTHLY",
    intervalValue: "1",
    startDate: formatTodayDateInputValue(),
    endDate: "",
};

interface RecurringFormProps {
    walletId: string;
    onSuccess?: () => void;
}

export const RecurringForm = ({ walletId, onSuccess }: RecurringFormProps) => {
    const { t } = useTranslation();
    const [areAdvancedOptionsVisible, setAreAdvancedOptionsVisible] = useState(false);

    // Create mutation
    const createRecurring = usePostRecurring();

    // Category list filtered by EXPENSE/INCOME type
    const { data: categoriesResponse, isLoading: isCategoriesLoading } =
        useGetCategories();

    // RHF form + watched fields for frequency helper / type filter
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<RecurringFormValues>({
        resolver: zodResolver(recurringSchema),
        defaultValues: defaultFormValues,
    });
    const type = useWatch({ control, name: "type" });
    const frequency = useWatch({ control, name: "frequency" });
    const intervalValue = useWatch({ control, name: "intervalValue" });
    const startDate = useWatch({ control, name: "startDate" });

    const categories =
        categoriesResponse?.data.filter((category) => category.type === type) ??
        [];

    // Create recurring then reset form
    const onSubmit = async (formData: RecurringFormValues) => {
        const promise = createRecurring.mutateAsync({
            title: formData.title,
            ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
            amount: Number(formData.amount),
            walletId,
            ...(formData.categoryId ? { categoryId: formData.categoryId } : {}),
            type: formData.type,
            frequency: formData.frequency,
            intervalValue: Number(formData.intervalValue),
            startDate: formData.startDate,
            ...(formData.endDate ? { endDate: formData.endDate } : {}),
        });

        toast.promise(promise, {
            loading: t("transactions.recurringLoading"),
            success: (response) =>
                getApiMessage(response, t("transactions.recurringFallback")),
            error: (error) =>
                getApiErrorMessage(error, t("common.operationError")),
        });

        try {
            await promise;
        } catch (error) {
            setApiValidationErrors(error, setError);
            return;
        }

        reset({ ...defaultFormValues, startDate: formatTodayDateInputValue() });
        setAreAdvancedOptionsVisible(false);
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
                        tabs={RECURRING_TYPE_TABS}
                        selected={field.value}
                        onChange={(nextType) => {
                            field.onChange(nextType);
                            setValue("categoryId", "");
                        }}
                        ariaLabel="Tipo de transacción"
                    />
                )}
            />

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringTitle">
                        {t("transactions.recurringTitle")}
                    </Label>
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
                        <span className="text-xs text-danger">
                            {errors.title.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringAmount">
                        {t("transactions.recurringAmount")}
                    </Label>
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
                        <span className="text-xs text-danger">
                            {errors.amount.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="recurringStartDate">
                    {t("transactions.startDate")}
                </Label>
                <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            id="recurringStartDate"
                            disabled={createRecurring.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.startDate && (
                    <span className="text-xs text-danger">
                        {errors.startDate.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringFrequency">
                        {t("transactions.frequency")}
                    </Label>
                    <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="recurringFrequency"
                                value={field.value}
                                disabled={createRecurring.isPending}
                                onChange={(event) =>
                                    field.onChange(event.target.value)
                                }
                                onBlur={field.onBlur}
                            >
                                {PERIODICITY_FORM_OPTIONS.map(
                                    ({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </Select>
                        )}
                    />
                    {errors.frequency && (
                        <span className="text-xs text-danger">
                            {errors.frequency.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <Label htmlFor="recurringInterval">
                        {t("transactions.every")}
                    </Label>
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
                                    const nextValue = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
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
                        Se repetirá cada {intervalValue || "1"}{" "}
                        {RECURRING_INTERVAL_UNIT_LABELS[frequency]}
                    </span>
                </div>
            </div>

            <div className="border-t border-light-10 pt-4">
                <button
                    type="button"
                    aria-expanded={areAdvancedOptionsVisible}
                    onClick={() => setAreAdvancedOptionsVisible((visible) => !visible)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left transition-colors hover:text-light"
                >
                    <span className="flex items-center gap-2 text-sm font-medium text-light-75 transition-colors group-hover:text-light">
                        <SlidersHorizontal className="h-4 w-4 text-helper transition-colors group-hover:text-primary" />
                        Opciones avanzadas
                    </span>
                    <motion.span
                        animate={{ rotate: areAdvancedOptionsVisible ? 180 : 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="text-helper"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.span>
                </button>

                <AnimatePresence initial={false}>
                    {areAdvancedOptionsVisible && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                        >
                            <div className="flex flex-col gap-4 pt-4">
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <div className="flex flex-1 flex-col gap-1">
                                        <Label htmlFor="recurringEndDate">
                                            {t("transactions.endDate")}
                                        </Label>
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    id="recurringEndDate"
                                                    minDate={startDate}
                                                    disabled={createRecurring.isPending}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.endDate && (
                                            <span className="text-xs text-danger">
                                                {errors.endDate.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col gap-1">
                                        <Label htmlFor="recurringCategoryId">
                                            {t("transactions.category")}
                                        </Label>
                                        <Controller
                                            name="categoryId"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    id="recurringCategoryId"
                                                    value={field.value}
                                                    disabled={createRecurring.isPending || isCategoriesLoading}
                                                    onChange={(event) => field.onChange(event.target.value)}
                                                    onBlur={field.onBlur}
                                                >
                                                    <option value="">Sin categoría</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        {errors.categoryId && (
                                            <span className="text-xs text-danger">
                                                {errors.categoryId.message}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="recurringDescription">
                                        {t("transactions.recurringDescription")}
                                    </Label>
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
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ModalActionFooter>
                <Button
                    type="submit"
                    disabled={createRecurring.isPending}
                    text={
                        createRecurring.isPending
                            ? "Programando..."
                            : t("walletView.schedule")
                    }
                />
            </ModalActionFooter>
        </form>
    );
};
