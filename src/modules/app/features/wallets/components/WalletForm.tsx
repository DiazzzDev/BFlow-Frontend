import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useMutateWallets } from "../hooks/useMutateWallets";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Textarea } from "@/components/controls/Textarea";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { Button } from "@/components/controls/Button";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

const DEFAULT_CURRENCY = "USD";

const walletSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    initialValue: z
        .string()
        .min(1, "El balance inicial es obligatorio")
        .refine((value) => Number(value) >= 0, "El balance inicial debe ser 0 o mayor"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

const defaultFormValues: WalletFormValues = {
    name: "",
    description: "",
    initialValue: "0",
};

interface WalletFormProps {
    onSuccess?: () => void;
}

export const WalletForm = ({ onSuccess }: WalletFormProps) => {
    const { t } = useTranslation();
    // Create mutation
    const { createWallet } = useMutateWallets();

    // RHF form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<WalletFormValues>({
        resolver: zodResolver(walletSchema),
        defaultValues: defaultFormValues,
    });

    // Create wallet then reset the form
    const onSubmit = async (formData: WalletFormValues) => {
        const promise = createWallet.mutateAsync({
            name: formData.name,
            description: formData.description || undefined,
            currency: DEFAULT_CURRENCY,
            initialValue: Number(formData.initialValue),
        });

        toast.promise(promise, {
            loading: t("wallets.createLoading"),
            success: (response) => getApiMessage(response, t("wallets.createFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
        reset(defaultFormValues);
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
                <Label htmlFor="name">{t("wallets.name")}</Label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="name"
                            placeholder={t("wallets.nameExample")}
                            disabled={createWallet.isPending}
                            {...field}
                        />
                    )}
                />
                {errors.name && (
                    <span className="text-danger text-xs">{errors.name.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="description">{t("wallets.description")}</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="description"
                            placeholder={t("wallets.descriptionPlaceholder")}
                            rows={3}
                            disabled={createWallet.isPending}
                            {...field}
                            value={field.value}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-danger text-xs">{errors.description.message}</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="initialValue">{t("wallets.initialBalance")}</Label>
                <Controller
                    name="initialValue"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="initialValue"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            disabled={createWallet.isPending}
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
                {errors.initialValue && (
                    <span className="text-danger text-xs">
                        {errors.initialValue.message}
                    </span>
                )}
            </div>

            <Button
                type="submit"
                disabled={createWallet.isPending}
                text={createWallet.isPending ? t("wallets.updateLoading") : t("wallets.create")}
                className="self-end"
            />
        </form>
    );
};
