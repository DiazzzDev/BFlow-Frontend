import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { useRef, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
    useConfirmReceipt,
    useRegisterQuickTransaction,
    useUploadReceipt,
} from "../hooks/useMutateDashboard";
import { dashboardCardClass, dashboardLabelClass } from "../utils/dashboardCard";

import { useAuthStore } from "@/auth/authStore";

import { Input } from "@/components/controls/Input";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { getApiErrorMessage } from "@/utils/api/apiMessage";

const quickRegisterSchema = z.object({
    amount: z
        .string()
        .min(1, "El monto es obligatorio")
        .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
});

type QuickRegisterFormValues = z.infer<typeof quickRegisterSchema>;

const defaultValues: QuickRegisterFormValues = {
    amount: "",
};

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;
const RECEIPT_ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
];

export const QuickRegisterCard = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wallets = useAuthStore((state) => state.user?.wallets ?? []);
    const defaultWallet = wallets.find((wallet) => wallet.defaultWallet) ?? wallets[0] ?? null;
    const {
        mutateAsync: registerQuickTransaction,
        isPending,
    } = useRegisterQuickTransaction();
    const { mutateAsync: uploadReceipt, isPending: isUploadingReceipt } = useUploadReceipt();
    const { mutateAsync: confirmReceipt, isPending: isConfirmingReceipt } = useConfirmReceipt();
    const isBusy = isPending || isUploadingReceipt || isConfirmingReceipt;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<QuickRegisterFormValues>({
        resolver: zodResolver(quickRegisterSchema),
        defaultValues,
    });

    const handleReceiptChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!RECEIPT_ACCEPTED_TYPES.includes(file.type)) {
            toast.error(t("dashboard.receiptInvalidType"));
            event.target.value = "";
            return;
        }

        if (file.size > MAX_RECEIPT_SIZE) {
            toast.error(t("dashboard.receiptTooLarge"));
            event.target.value = "";
            return;
        }

        const promise = uploadReceipt(file);
        toast.promise(promise, {
            loading: t("dashboard.receiptProcessing"),
            success: (response) => {
                return response.data.status === "EXTRACTED"
                    ? t("dashboard.receiptExtracted")
                    : t("dashboard.receiptUploaded");
            },
            error: (error) =>
                getApiErrorMessage(error, t("dashboard.receiptUploadError")),
        });

        try {
            const response = await promise;

            if (response.data.status === "EXTRACTED") {
                const suggestedType =
                    response.data.suggestedType === "INCOME" ? "INCOME" : "EXPENSE";
                const confirmationPromise = confirmReceipt({
                    receiptId: response.data.id,
                    payload: {
                        type: suggestedType,
                        title: response.data.suggestedTitle || t("dashboard.receiptFallbackTitle"),
                        description: "",
                        amount: response.data.suggestedAmount ?? 0,
                        categoryId: response.data.suggestedCategoryId || "",
                        date:
                            response.data.suggestedDate ||
                            new Date().toISOString().slice(0, 10),
                    },
                });

                toast.promise(confirmationPromise, {
                    loading: t("dashboard.receiptConfirming"),
                    success: t("dashboard.receiptConfirmed"),
                    error: (error) =>
                        getApiErrorMessage(error, t("dashboard.receiptConfirmError")),
                });

                await confirmationPromise;
            }
        } catch {
            // The toast already reports the upload or confirmation error.
        } finally {
            event.target.value = "";
        }
    };

    const onSubmit = async (values: QuickRegisterFormValues) => {
        const promise = registerQuickTransaction(Number(values.amount));

        toast.promise(promise, {
            loading: t("dashboard.quickRegisterSaving"),
            success: t("dashboard.quickRegisterSuccess"),
            error: (error) =>
                getApiErrorMessage(error, t("dashboard.quickRegisterError")),
        });

        await promise;
        reset(defaultValues);
    };

    return (
        <section className={dashboardCardClass}>
            <div className="flex items-start justify-between gap-3">
                <p className={dashboardLabelClass}>{t("dashboard.quickRegister")}</p>
                <p className="max-w-[55%] truncate text-xs text-helper">
                    {t("dashboard.walletLabel")}: {defaultWallet?.name ?? t("dashboard.noDefaultWallet")}
                </p>
            </div>
            {defaultWallet ? (
                <div className="mt-2 flex items-baseline justify-between gap-3">
                    <span className="text-xs text-helper">{t("dashboard.currentWalletBalance")}</span>
                    <span className="text-base font-semibold tabular-nums text-light">
                        {formatCurrency(defaultWallet.balance, defaultWallet.currency)}
                    </span>
                </div>
            ) : null}
            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
                <label htmlFor="dashboard-quick-amount" className="mt-4 block text-xs text-helper">
                    {t("dashboard.amount")}
                </label>
                <div className="mt-1.5 flex gap-2">
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="dashboard-quick-amount"
                                type="text"
                                inputMode="decimal"
                                placeholder={t("dashboard.amountPlaceholder")}
                                name={field.name}
                                value={field.value}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                onChange={(event) => {
                                    const formatted = formatterDecimal(event.target.value);

                                    if (formatted !== null) {
                                        field.onChange(formatted);
                                    }
                                }}
                                disabled={isBusy}
                                className="h-11 min-w-0 flex-1 bg-surface-hard"
                            />
                        )}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                        capture="environment"
                        className="hidden"
                        onChange={(event) => {
                            void handleReceiptChange(event);
                        }}
                    />
                    <button
                        type="button"
                        disabled={isBusy}
                        aria-label={t("dashboard.scanReceipt")}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-light-10 text-helper transition-colors hover:border-light-25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Camera className="h-4 w-4" />
                    </button>
                </div>
                {errors.amount ? (
                    <span className="mt-1 block text-xs text-danger">{errors.amount.message}</span>
                ) : (
                    <p className="mt-2 text-xs text-helper">{t("dashboard.quickRegisterHint")}</p>
                )}
                <button
                    type="submit"
                    disabled={isBusy}
                    className="mt-4 h-11 w-full cursor-pointer rounded-lg bg-primary text-sm font-semibold text-light transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? t("dashboard.quickRegisterSaving") : t("dashboard.saveExpense")}
                </button>
            </form>
        </section>
    );
};
