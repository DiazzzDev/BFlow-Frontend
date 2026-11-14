import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { usePostExpense, usePutExpense } from "../hooks/useMutateExpenses";
import { usePostIncome, usePutIncome } from "../hooks/useMutateIncomes";
import { useGetCategories } from "../../../features/settings/hooks/useGetCategories";

import { Button } from "@/components/controls/Button";
import { DatePicker } from "@/components/controls/DatePicker";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { Textarea } from "@/components/controls/Textarea";
import { ToggleSwitch } from "@/components/controls/ToggleSwitch";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";
import type { TransactionType } from "@/modules/app/interfaces/Transaction";
import {
    PERIODICITY_FORM_OPTIONS,
    PERIODICITY_VALUES,
    type Periodicity,
} from "@/modules/app/interfaces/Periodicity";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { setApiValidationErrors } from "@/utils/api";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const transactionSchema = z
    .object({
        title: z.string().min(1, "El título es obligatorio"),
        description: z.string(),
        amount: z
            .string()
            .min(1, "El monto es obligatorio")
            .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
        date: z.string(),
        recurring: z.boolean(),
        recurrencePattern: z.enum(PERIODICITY_VALUES).nullable(),
        categoryId: z.string(),
    })
    .superRefine((values, context) => {
        if (values.recurring && !values.recurrencePattern) {
            context.addIssue({
                code: "custom",
                path: ["recurrencePattern"],
                message: "Selecciona un patrón de recurrencia",
            });
        }
    });

type TransactionFormValues = z.infer<typeof transactionSchema>;
type DatePreset = "today" | "yesterday" | "custom";

const getDateInputValue = (daysOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().slice(0, 10);
};

const defaultFormValues: TransactionFormValues = {
    title: "",
    description: "",
    amount: "",
    date: getDateInputValue(),
    recurring: false,
    recurrencePattern: null,
    categoryId: "",
};

interface TransactionFormProps {
    type: Extract<TransactionType, "INCOME" | "EXPENSE">;
    walletId: string;
    onSuccess?: () => void;
    readOnly?: boolean;
    transactionId?: string;
    source?: string;
    initialValues?: Partial<TransactionFormValues>;
}

export const TransactionForm = ({
    type,
    walletId,
    onSuccess,
    readOnly = false,
    transactionId,
    source = "manual",
    initialValues,
}: TransactionFormProps) => {
    const { t } = useTranslation();
    const [areAdvancedOptionsVisible, setAreAdvancedOptionsVisible] = useState(readOnly);
    const [datePreset, setDatePreset] = useState<DatePreset>(() => {
        if (initialValues?.date === getDateInputValue(-1)) {
            return "yesterday";
        }

        return initialValues?.date && initialValues.date !== getDateInputValue() ? "custom" : "today";
    });
    const createIncome = usePostIncome();
    const updateIncome = usePutIncome();
    const createExpense = usePostExpense();
    const updateExpense = usePutExpense();
    const isIncome = type === "INCOME";
    const isEditing = Boolean(transactionId);
    const isSaving = createIncome.isPending || updateIncome.isPending || createExpense.isPending || updateExpense.isPending;
    const isDisabled = readOnly || isSaving;
    const typeLabel = isIncome ? t("transactions.recurringIncome") : t("transactions.recurringExpense");
    const idPrefix = isIncome ? "income" : "expense";

    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const categories = categoriesResponse?.data.filter((category) => category.type === type) ?? [];

    const {
        control,
        handleSubmit,
        reset,
        setError,
        setValue,
        formState: { errors },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: { ...defaultFormValues, ...initialValues },
    });
    const recurring = useWatch({ control, name: "recurring" });

    const onSubmit = async (formData: TransactionFormValues) => {
        const payload = {
            title: formData.title,
            amount: Number(formData.amount),
            walletId,
            source,
            ...(areAdvancedOptionsVisible && {
                ...(formData.description.trim() ? { description: formData.description.trim() } : {}),
                ...(formData.date ? { date: formData.date } : {}),
                recurring: formData.recurring,
                recurrencePattern: formData.recurring ? formData.recurrencePattern : null,
                ...(formData.categoryId ? { categoryId: formData.categoryId } : {}),
            }),
        };

        const promise = isIncome
            ? isEditing
                ? updateIncome.mutateAsync({ id: transactionId!, data: payload })
                : createIncome.mutateAsync(payload)
            : isEditing
                ? updateExpense.mutateAsync({ id: transactionId!, data: payload })
                : createExpense.mutateAsync(payload);

        toast.promise(promise, {
            loading: isEditing
                ? isIncome ? t("transactions.updateIncomeLoading") : t("transactions.updateExpenseLoading")
                : isIncome ? t("transactions.createIncomeLoading") : t("transactions.createExpenseLoading"),
            success: (response) => getApiMessage(
                response,
                isEditing
                    ? isIncome ? t("transactions.incomeUpdated") : t("transactions.expenseUpdated")
                    : isIncome ? t("transactions.incomeCreated") : t("transactions.expenseCreated"),
            ),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        try {
            await promise;
        } catch (error) {
            setApiValidationErrors(error, setError);
            return;
        }

        if (!isEditing) {
            reset(defaultFormValues);
            setAreAdvancedOptionsVisible(false);
            setDatePreset("today");
        }
        onSuccess?.();
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); if (!readOnly) { void handleSubmit(onSubmit)(event); } }}>
            <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                    <Label htmlFor={`${idPrefix}-title`}>{t("transactions.title")}</Label>
                    <Controller name="title" control={control} render={({ field }) => (
                        <Input id={`${idPrefix}-title`} placeholder={t(isIncome ? "transactions.incomeTitlePlaceholder" : "transactions.expenseTitlePlaceholder")} disabled={isDisabled} {...field} />
                    )} />
                    {errors.title && <span className="text-xs text-danger">{errors.title.message}</span>}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                    <Label htmlFor={`${idPrefix}-amount`}>{t("transactions.amount")}</Label>
                    <Controller name="amount" control={control} render={({ field }) => (
                        <Input
                            id={`${idPrefix}-amount`}
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            disabled={isDisabled}
                            name={field.name}
                            value={field.value}
                            onChange={(event) => {
                                const value = formatterDecimal(event.target.value);
                                if (value !== null) {
                                    field.onChange(value);
                                }
                            }}
                        />
                    )} />
                    {errors.amount && <span className="text-xs text-danger">{errors.amount.message}</span>}
                </div>
            </div>

            <div className="border-t border-light-10 pt-4">
                <button
                    type="button"
                    aria-expanded={areAdvancedOptionsVisible}
                    onClick={() => {
                        if (areAdvancedOptionsVisible) {
                            setValue("recurring", false);
                            setValue("recurrencePattern", null);
                        }
                        setAreAdvancedOptionsVisible((visible) => !visible);
                    }}
                    className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-1.5 text-left transition-colors hover:text-light"
                >
                    <span className="flex items-center gap-2 text-sm font-medium text-light-75 transition-colors group-hover:text-light">
                        <SlidersHorizontal className="h-4 w-4 text-helper transition-colors group-hover:text-primary" />
                        {t("transactions.advancedOptions")}
                    </span>
                    <motion.span animate={{ rotate: areAdvancedOptionsVisible ? 180 : 0 }} transition={{ duration: 0.18, ease: "easeOut" }} className="text-helper">
                        <ChevronDown className="h-4 w-4" />
                    </motion.span>
                </button>

                <AnimatePresence initial={false}>
                    {areAdvancedOptionsVisible && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="overflow-hidden">
                            <div className="flex flex-col gap-4 pt-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor={`${idPrefix}-date`}>{t("transactions.date")}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        setValue("date", getDateInputValue());
                                                        setDatePreset("today");
                                                    }}
                                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${datePreset === "today" ? "border-primary bg-primary-15 text-primary" : "border-light-10 text-helper hover:border-light-25 hover:text-light"}`}
                                                >
                                                    {t("dates.today")}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        setValue("date", getDateInputValue(-1));
                                                        setDatePreset("yesterday");
                                                    }}
                                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${datePreset === "yesterday" ? "border-primary bg-primary-15 text-primary" : "border-light-10 text-helper hover:border-light-25 hover:text-light"}`}
                                                >
                                                    {t("dates.yesterday")}
                                                </button>
                                            </div>
                                            <div className="min-w-0">
                                                <Controller name="date" control={control} render={({ field }) => (
                                                    <DatePicker
                                                        id={`${idPrefix}-date`}
                                                        disabled={isDisabled}
                                                        {...field}
                                                        onChange={(value) => {
                                                            field.onChange(value);
                                                            setDatePreset("custom");
                                                        }}
                                                    />
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-1">
                                                <Label htmlFor={`${idPrefix}-category`}>{t("transactions.category")}</Label>
                                                <Controller name="categoryId" control={control} render={({ field }) => (
                                                    <Select id={`${idPrefix}-category`} value={field.value} disabled={isDisabled || isCategoriesLoading} onChange={(event) => field.onChange(event.target.value)} onBlur={field.onBlur}>
                                                    <option value="">{t("transactions.noCategory")}</option>
                                                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                                    </Select>
                                                )} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                            <Label htmlFor={`${idPrefix}-recurrence-pattern`} className={`transition-opacity ${recurring ? "" : "opacity-50"}`}>
                                                {typeLabel}
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Controller name="recurrencePattern" control={control} render={({ field }) => (
                                                    <Select
                                                        id={`${idPrefix}-recurrence-pattern`}
                                                        value={field.value ?? ""}
                                                        disabled={isDisabled || !recurring}
                                                        onChange={(event) => field.onChange(event.target.value ? event.target.value as Periodicity : null)}
                                                        onBlur={field.onBlur}
                                                        className="flex-1"
                                                    >
                                                        <option value="">{t("transactions.selectPattern")}</option>
                                                        {PERIODICITY_FORM_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{t(`budgets.periods.${value.toLowerCase()}`, { defaultValue: label })}</option>)}
                                                    </Select>
                                                )} />
                                                <Controller name="recurring" control={control} render={({ field }) => (
                                                    <ToggleSwitch aria-label={typeLabel} checked={field.value} disabled={isDisabled} onChange={field.onChange} />
                                                )} />
                                            </div>
                                            {recurring && <p className="text-xs text-helper">{t("transactions.recurrenceHelper")}</p>}
                                                {errors.recurrencePattern && <span className="text-xs text-danger">{errors.recurrencePattern.message}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor={`${idPrefix}-description`}>{t("transactions.description")}</Label>
                                            <Controller name="description" control={control} render={({ field }) => (
                                            <Textarea id={`${idPrefix}-description`} placeholder={t(isIncome ? "transactions.incomeDetail" : "transactions.expenseDetail")} rows={5} disabled={isDisabled} {...field} />
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!readOnly && (
                <ModalActionFooter>
                    <Button
                        type="submit"
                        disabled={isSaving}
                        text={isSaving ? t("transactions.saving") : isEditing ? t("transactions.saveChanges") : isIncome ? t("transactions.createIncome") : t("transactions.createExpense")}
                    />
                </ModalActionFooter>
            )}
        </form>
    );
};
