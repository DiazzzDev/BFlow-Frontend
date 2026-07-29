import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePostWallet } from "../hooks/usePostWallet";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Select } from "@/components/controls/Select";
import { Textarea } from "@/components/controls/Textarea";
import { formatDecimal } from "@/utils/formatters/formatterDecimal";

const walletSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().optional(),
    currency: z.string().min(1, "La moneda es obligatoria"),
    initialValue: z
        .number({ error: "El balance inicial es obligatorio" })
        .min(0, "El balance inicial debe ser 0 o mayor"),
});

type WalletFormValues = z.infer<typeof walletSchema>;

const defaultFormValues: WalletFormValues = {
    name: "",
    description: "",
    currency: "USD",
    initialValue: 0,
};

interface WalletFormProps {
    onSuccess?: () => void;
}

export const WalletForm = ({ onSuccess }: WalletFormProps) => {
    const { mutateAsync: createWallet, isPending: isSubmitting } = usePostWallet();

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
        try {
            await createWallet({
                name: formData.name,
                description: formData.description || undefined,
                currency: formData.currency,
                initialValue: formData.initialValue,
            });
            reset(defaultFormValues);
            onSuccess?.();
        } catch (error) {
            console.error("Error al crear la billetera:", error);
        }
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
                            disabled={isSubmitting}
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
                            placeholder="Descripción opcional"
                            rows={3}
                            disabled={isSubmitting}
                            {...field}
                            value={field.value ?? ""}
                        />
                    )}
                />
                {errors.description && (
                    <span className="text-danger text-xs">{errors.description.message}</span>
                )}
            </div>

            <div className="flex gap-4 flex-wrap">
                <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                    <Label htmlFor="currency">Moneda</Label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="currency"
                                value={field.value}
                                disabled={isSubmitting}
                                onChange={(event) => field.onChange(event.target.value)}
                                onBlur={field.onBlur}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </Select>
                        )}
                    />
                    {errors.currency && (
                        <span className="text-danger text-xs">{errors.currency.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                    <Label htmlFor="initialValue">Balance inicial</Label>
                    <Controller
                        name="initialValue"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="initialValue"
                                type="text"
                                placeholder="0.00"
                                disabled={isSubmitting}
                                name={field.name}
                                value={field.value}
                                onChange={(e) => {
                                    const formatted = formatDecimal(e.target.value);
                                    if (formatted !== null) {
                                        field.onChange(Number(formatted));
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

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-lg bg-primary text-light font-medium hover:bg-primary-dark disabled:opacity-50 cursor-pointer mt-2"
            >
                {isSubmitting ? "Guardando..." : "Crear billetera"}
            </button>
        </form>
    );
};
