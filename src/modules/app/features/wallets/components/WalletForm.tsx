import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutateWallets } from "../hooks/useMutateWallets";
import { currencies } from "../currencies";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { Textarea } from "@/components/controls/Textarea";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { Button } from "@/components/controls/Button";

const walletSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    currency: z.enum(currencies.map((c) => c.code) as [string, ...string[]]),
    initialValue: z
        .string()
        .min(1, "El balance inicial es obligatorio")
        .refine((value) => Number(value) >= 0, "El balance inicial debe ser 0 o mayor"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

const defaultFormValues: WalletFormValues = {
    name: "",
    description: "",
    currency: "USD",
    initialValue: "0",
};

interface WalletFormProps {
    onSuccess?: () => void;
}

export const WalletForm = ({ onSuccess }: WalletFormProps) => {
    const { createWallet } = useMutateWallets();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<WalletFormValues>({
        resolver: zodResolver(walletSchema),
        defaultValues: defaultFormValues,
    });

    const onSubmit = async (formData: WalletFormValues) => {
        const promise = createWallet.mutateAsync({
            name: formData.name,
            description: formData.description || undefined,
            currency: formData.currency,
            initialValue: Number(formData.initialValue),
        });

        toast.promise(promise, {
            loading: "Creando billetera...",
            success: "Billetera creada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear la billetera",
        });

        await promise; // await de la mutation, no del toast
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
                <Label htmlFor="name">Nombre de la billetera</Label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="name"
                            placeholder="Ej. Ahorros personales"
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
                <Label htmlFor="description">Descripción</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="description"
                            placeholder="Descripción"
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

            <div className="flex gap-4 flex-col">
                <div className="flex flex-col gap-1 flex-1 min-w-35">
                    <Label htmlFor="currency">Moneda</Label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="currency"
                                value={field.value}
                                disabled={createWallet.isPending}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                            >
                                {currencies.map(({ code, name }) => (
                                    <option key={code} value={code}>
                                        {code} — {name}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.currency && (
                        <span className="text-danger text-xs">{errors.currency.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-35">
                    <Label htmlFor="initialValue">Balance inicial</Label>
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
            </div>

            <Button
                type="submit"
                disabled={createWallet.isPending}
                text={createWallet.isPending ? "Guardando..." : "Crear billetera"}
                className="self-end"
            />
        </form>
    );
};
