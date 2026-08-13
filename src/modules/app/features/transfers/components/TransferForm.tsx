import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useMutateTransfers } from "../hooks/useMutateTransfers";
import type { TransferDirection } from "../interfaces/Transfer";
import { useGetWallets } from "../../wallets/hooks/useGetWallets";
import type { Wallet } from "../../wallets/interfaces/Wallets";
import { useGetWallet } from "../../walletView/hooks/useGetWallet";

import { WalletTransferCard } from "./WalletTransferCard";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Textarea } from "@/components/controls/Textarea";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Button } from "@/components/controls/Button";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { useDebounce } from "@/hooks/useDebounce";
import { SkeletonText } from "@/components/loaders/SkeletonText";

const transferSchema = z.object({
    counterpartWalletId: z.string().uuid("Selecciona una billetera"),
    amount: z
        .string()
        .min(1, "El monto es obligatorio")
        .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0"),
    description: z.string().min(1, "La descripción es obligatoria"),
});

type TransferFormValues = z.infer<typeof transferSchema>;

const defaultFormValues: TransferFormValues = {
    counterpartWalletId: "",
    amount: "",
    description: "",
};

interface TransferFormProps {
    walletId: string;
    onSuccess?: () => void;
    readOnly?: boolean;
    initialValues?: Partial<TransferFormValues> & {
        direction?: TransferDirection;
        counterpartWalletName?: string;
    };
}

export const TransferForm = ({
    walletId,
    onSuccess,
    readOnly = false,
    initialValues,
}: TransferFormProps) => {
    const { createTransfer } = useMutateTransfers();
    const { data: currentWalletResponse, isLoading: isCurrentWalletLoading } =
        useGetWallet(walletId);

    const [direction, setDirection] = useState<TransferDirection>(
        initialValues?.direction ?? "outgoing",
    );
    const [walletQuery, setWalletQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);
    const { data: walletsResponse, isLoading: isWalletsLoading } = useGetWallets(
        "MINE",
        debouncedWalletQuery,
    );

    const currentWallet = currentWalletResponse?.data;
    const availableWallets =
        walletsResponse?.data.content.filter((wallet) => wallet.id !== walletId) ?? [];
    const isDisabled = readOnly || createTransfer.isPending;

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            ...defaultFormValues,
            ...initialValues,
        },
    });

    const counterpartWalletId = watch("counterpartWalletId");
    const selectedWallet =
        availableWallets.find((wallet) => wallet.id === counterpartWalletId) ?? null;

    const counterpartCardWallet =
        selectedWallet ??
        (initialValues?.counterpartWalletId
            ? {
                name: initialValues.counterpartWalletName || "Billetera",
                balance: 0,
                currency: currentWallet?.currency || "USD",
                description: "",
                role: "",
            }
            : null);

    const isOutgoing = direction === "outgoing";

    const toggleDirection = () => {
        if (readOnly) {
            return;
        }
        setDirection(isOutgoing ? "incoming" : "outgoing");
    };

    const onSubmit = async (formData: TransferFormValues) => {
        const fromWalletId = isOutgoing ? walletId : formData.counterpartWalletId;
        const toWalletId = isOutgoing ? formData.counterpartWalletId : walletId;

        const promise = createTransfer.mutateAsync({
            fromWalletId,
            toWalletId,
            amount: Number(formData.amount),
            description: formData.description,
        });

        toast.promise(promise, {
            loading: "Creando transferencia...",
            success: "Transferencia creada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al crear la transferencia",
        });

        await promise;
        reset(defaultFormValues);
        setWalletQuery("");
        onSuccess?.();
    };

    return (
        <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                if (readOnly) {
                    return;
                }
                void handleSubmit(onSubmit)(e);
            }}
        >
            <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="min-w-0">
                    {isCurrentWalletLoading || !currentWallet ? (
                        <div className="flex min-h-36 flex-col justify-between rounded-2xl border border-light-10 bg-surface-hard/50 p-4">
                            <SkeletonText className="h-3 w-20" />
                            <SkeletonText className="mt-3 h-5 w-32" />
                            <SkeletonText className="mt-2 h-4 w-40" />
                            <SkeletonText className="mt-6 h-6 w-24" />
                        </div>
                    ) : (
                        <WalletTransferCard
                            wallet={currentWallet}
                            label="Esta billetera"
                            highlight
                        />
                    )}
                </div>

                <div className="flex items-center justify-center py-1 sm:py-0">
                    <motion.button
                        type="button"
                        onClick={toggleDirection}
                        title="Invertir dirección"
                        disabled={readOnly}
                        whileTap={readOnly ? undefined : { scale: 0.92 }}
                        className={`flex h-12 w-12 items-center justify-center rounded-full border border-light-10 bg-surface text-primary transition-colors ${readOnly
                                ? "cursor-default opacity-70"
                                : "cursor-pointer hover:border-primary-25 hover:bg-primary-15"
                            }`}
                    >
                        <motion.span
                            animate={{ rotate: isOutgoing ? 0 : 180, scale: [1, 1.15, 1] }}
                            transition={{ type: "spring", stiffness: 320, damping: 18 }}
                            className="flex items-center justify-center"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </motion.span>
                    </motion.button>
                </div>

                <div className="min-w-0">
                    {counterpartCardWallet ? (
                        <WalletTransferCard
                            wallet={counterpartCardWallet}
                            label={isOutgoing ? "Destino" : "Origen"}
                        />
                    ) : (
                        <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-light-10 bg-surface-hard/30 px-4 text-center">
                            <p className="text-sm font-medium text-light">
                                {isOutgoing
                                    ? "Elige la billetera destino"
                                    : "Elige la billetera origen"}
                            </p>
                            <p className="mt-1 text-xs text-helper">
                                Busca y selecciona una de tus billeteras
                            </p>
                        </div>
                    )}
                </div>

                {!readOnly && (
                    <div className="min-w-0 sm:col-start-3">
                        <Controller
                            name="counterpartWalletId"
                            control={control}
                            render={({ field }) => (
                                <SelectAutoComplete<Wallet>
                                    idSelect="counterpartWalletId"
                                    label={
                                        isOutgoing
                                            ? "Billetera destino"
                                            : "Billetera origen"
                                    }
                                    placeholder={
                                        isWalletsLoading
                                            ? "Cargando billeteras..."
                                            : "Buscar billetera..."
                                    }
                                    selectedItem={selectedWallet}
                                    setSelectedItem={(wallet) => {
                                        field.onChange(wallet.id);
                                        setValue("counterpartWalletId", wallet.id, {
                                            shouldValidate: true,
                                        });
                                    }}
                                    query={walletQuery}
                                    setQuery={setWalletQuery}
                                    data={availableWallets}
                                    getKey={(wallet) => wallet.id}
                                    getLabel={(wallet) => wallet.name}
                                    disabled={isDisabled || isWalletsLoading}
                                />
                            )}
                        />
                        {errors.counterpartWalletId && (
                            <span className="text-danger text-xs">
                                {errors.counterpartWalletId.message}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {!readOnly && (
                <p className="text-center text-xs text-helper">
                    {isOutgoing
                        ? "El dinero saldrá de esta billetera hacia la seleccionada."
                        : "El dinero entrará a esta billetera desde la seleccionada."}{" "}
                    Toca la flecha para invertir el sentido.
                </p>
            )}

            <div className="flex flex-col gap-1">
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

            <div className="flex flex-col gap-1">
                <Label htmlFor="description">Descripción</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="description"
                            placeholder="Motivo de la transferencia"
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

            {!readOnly && (
                <Button
                    type="submit"
                    disabled={createTransfer.isPending}
                    text={createTransfer.isPending ? "Guardando..." : "Crear transferencia"}
                    className="self-end"
                />
            )}
        </form>
    );
};
