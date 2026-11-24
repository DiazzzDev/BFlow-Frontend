import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { TFunction } from "i18next";

import type { Receipt } from "../dashboard.service";
import { useConfirmReceipt } from "../hooks/useMutateDashboard";
import { getReceiptConfirmationPayload } from "../utils/receiptConfirmation";
import { useGetCategories } from "../../settings/hooks/useGetCategories";

import { Button } from "@/components/controls/Button";
import { DatePicker } from "@/components/controls/DatePicker";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { SegmentedTabs } from "@/components/controls/SegmentedTabs";
import { Textarea } from "@/components/controls/Textarea";
import { CustomModal } from "@/components/custom/CustomModal";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";
import { setApiValidationErrors } from "@/utils/api/apiValidationErrors";

const createReceiptConfirmationSchema = (t: TFunction) => z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    title: z.string().min(1, t("validation.titleRequired")),
    description: z.string(),
    amount: z
        .string()
        .min(1, t("validation.amountRequired"))
        .refine((value) => Number(value) > 0, t("validation.amountGreaterThanZero")),
    categoryId: z.string(),
    date: z.string().min(1, t("validation.startDateRequired")),
});

type ReceiptConfirmationFormValues = z.infer<ReturnType<typeof createReceiptConfirmationSchema>>;

interface ReceiptConfirmationModalProps {
    receipt: Receipt | null;
    onClose: () => void;
}

export const ReceiptConfirmationModal = ({
    receipt,
    onClose,
}: ReceiptConfirmationModalProps) => {
    const { t } = useTranslation();
    const schema = createReceiptConfirmationSchema(t);
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
    const { mutateAsync: confirmReceipt, isPending } = useConfirmReceipt();
    const initialPayload = receipt
        ? getReceiptConfirmationPayload(receipt, t("dashboard.receiptFallbackTitle"))
        : null;
    const {
        control,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ReceiptConfirmationFormValues>({
        resolver: zodResolver(schema),
        defaultValues: initialPayload
            ? { ...initialPayload, amount: String(initialPayload.amount || "") }
            : undefined,
    });
    const selectedType = watch("type");
    const categories = categoriesResponse?.data.filter(
        (category) => category.type === selectedType,
    ) ?? [];

    const handleConfirm = async (values: ReceiptConfirmationFormValues) => {
        if (!receipt) {
            return;
        }

        const promise = confirmReceipt({
            receiptId: receipt.id,
            payload: {
                ...values,
                description: values.description.trim(),
                amount: Number(values.amount),
            },
        });

        toast.promise(promise, {
            loading: t("dashboard.receiptConfirming"),
            success: (response) => getApiMessage(response, t("dashboard.receiptConfirmed")),
            error: (error) => getApiErrorMessage(error, t("dashboard.receiptConfirmError")),
        });

        try {
            await promise;
        } catch (error) {
            setApiValidationErrors(error, setError);
            return;
        }

        onClose();
    };

    return (
        <CustomModal
            isModalOpen={Boolean(receipt)}
            setIsModalOpen={(open) => {
                if (!open && !isPending) {
                    onClose();
                }
            }}
            title={t("dashboard.receiptReviewTitle")}
            maxWidth="max-w-2xl"
        >
            <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                    void handleSubmit(handleConfirm)(event);
                }}
            >
                <p className="text-sm text-helper">{t("dashboard.receiptReviewDescription")}</p>

                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <SegmentedTabs
                            tabs={[
                                { id: "EXPENSE", label: t("transactions.expenseTab") },
                                { id: "INCOME", label: t("transactions.incomeTab") },
                            ]}
                            selected={field.value}
                            onChange={(type) => {
                                field.onChange(type);
                                setValue("categoryId", "");
                            }}
                            ariaLabel={t("dashboard.receiptTypeLabel")}
                        />
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <ReceiptTextField
                        control={control}
                        error={errors.title?.message}
                        disabled={isPending}
                        label={t("transactions.title")}
                        placeholder={t("dashboard.receiptFallbackTitle")}
                        name="title"
                    />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="receipt-amount">{t("transactions.amount")}</Label>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="receipt-amount"
                                    name={field.name}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    disabled={isPending}
                                    onChange={(event) => {
                                        const value = formatterDecimal(event.target.value);
                                        if (value !== null) {
                                            field.onChange(value);
                                        }
                                    }}
                                />
                            )}
                        />
                        {errors.amount ? <span className="text-xs text-danger">{errors.amount.message}</span> : null}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="receipt-date">{t("transactions.date")}</Label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <DatePicker {...field} id="receipt-date" disabled={isPending} />
                            )}
                        />
                        {errors.date ? <span className="text-xs text-danger">{errors.date.message}</span> : null}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="receipt-category">{t("transactions.category")}</Label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    id="receipt-category"
                                    value={field.value}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    onBlur={field.onBlur}
                                    disabled={isPending || isCategoriesLoading}
                                >
                                    <option value="">{t("transactions.noCategory")}</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="receipt-description">{t("transactions.description")}</Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id="receipt-description"
                                placeholder={t("dashboard.receiptDescriptionPlaceholder")}
                                disabled={isPending}
                                rows={3}
                            />
                        )}
                    />
                </div>

                <ModalActionFooter>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" text={t("common.cancel")} disabled={isPending} onClick={onClose} />
                        <Button type="submit" text={isPending ? t("dashboard.receiptConfirming") : t("dashboard.receiptSave")} disabled={isPending} />
                    </div>
                </ModalActionFooter>
            </form>
        </CustomModal>
    );
};

interface ReceiptTextFieldProps {
    control: ReturnType<typeof useForm<ReceiptConfirmationFormValues>>["control"];
    disabled: boolean;
    error?: string;
    label: string;
    name: "title";
    placeholder: string;
}

const ReceiptTextField = ({
    control,
    disabled,
    error,
    label,
    name,
    placeholder,
}: ReceiptTextFieldProps) => (
    <div className="flex flex-col gap-1">
        <Label htmlFor={`receipt-${name}`}>{label}</Label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input {...field} id={`receipt-${name}`} placeholder={placeholder} disabled={disabled} />
            )}
        />
        {error ? <span className="text-xs text-danger">{error}</span> : null}
    </div>
);
