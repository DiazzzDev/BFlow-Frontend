import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useMutateTransfers } from "../hooks/useMutateTransfers";
import type { TransferDirection } from "../interfaces/Transfer";
import { getWallet } from "../utils/getWallet";
import { useGetWallets } from "../../../features/wallets/hooks/useGetWallets";
import { useGetWallet } from "../../../features/walletView/hooks/useGetWallet";

import { WalletTransferCard } from "./WalletTransferCard";

import type { Wallet } from "@/modules/app/interfaces/Wallet";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Textarea } from "@/components/controls/Textarea";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { Button } from "@/components/controls/Button";
import { formatterDecimal } from "@/utils/formatters/formatterDecimal";
import { useDebounce } from "@/hooks/useDebounce";
import { useAutoSelect } from "@/hooks/useAutoSelect";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";
import { setApiValidationErrors } from "@/utils/api";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

interface TransferFormValues {
    counterpartWalletId: string;
    amount: string;
    description: string;
}

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
    const { t } = useTranslation();
    const transferSchema = z.object({
        counterpartWalletId: z.string().uuid(t("transactions.selectWalletError")),
        amount: z
            .string()
            .min(1, t("transactions.amountRequired"))
            .refine((value) => Number(value) > 0, t("transactions.amountGreaterThanZero")),
        description: z.string(),
    });
    // Create mutation
    const { createTransfer } = useMutateTransfers();

    // Form mode and disabled state
    const isDisabled = readOnly || createTransfer.isPending;

    // Transfer direction (outgoing = current wallet sends)
    const [direction, setDirection] = useState<TransferDirection>(
        initialValues?.direction ?? "outgoing",
    );
    const isOutgoing = direction === "outgoing";

    // Current wallet card + counterpart search (excludes this wallet)
    const { data: currentWalletResponse, isLoading: isCurrentWalletLoading } = useGetWallet(walletId);
    const currentWallet = currentWalletResponse?.data;
    const [walletQuery, setWalletQuery] = useState("");
    const debouncedWalletQuery = useDebounce(walletQuery, 400);
    const { data: walletsResponse, isFetching: isWalletsFetching } = useGetWallets("MINE", debouncedWalletQuery,);
    const availableWallets = walletsResponse?.data.content.filter((wallet) => wallet.id !== walletId);

    // RHF form
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            ...defaultFormValues,
            ...initialValues,
        },
    });

    // UI selection: "auto" = first item; manual pick leaves auto mode
    const { selectedItem: selectedWallet, setSelection: setSelectedWallet, selection, } = useAutoSelect(availableWallets ?? []);

    // Seed counterpartWalletId: readOnly uses initialValues once; create uses auto default
    useEffect(() => {
        if (readOnly && selection === "auto" && initialValues?.counterpartWalletId) {
            const wallet = getWallet(availableWallets ?? [], initialValues.counterpartWalletId);
            if (wallet) {
                setSelectedWallet(wallet);
                setValue("counterpartWalletId", wallet.id);
            }
        } else if (!readOnly && selection === "auto" && selectedWallet) {
            setValue("counterpartWalletId", selectedWallet.id);
        }
    }, [readOnly, selection, initialValues, availableWallets, selectedWallet, setSelectedWallet, setValue]);

    // Card for the counterpart side (list item, or initialValues fallback while loading)
    const counterpartCardWallet = selectedWallet ?? (initialValues?.counterpartWalletId ? {
        name: initialValues.counterpartWalletName || t("transactions.walletFallback"),
        balance: 0,
        currency: currentWallet?.currency || "USD",
        description: "",
        role: "",
    } : null);

    const toggleDirection = () => {
        if (readOnly) {
            return;
        }
        setDirection(isOutgoing ? "incoming" : "outgoing");
    };

    // Build from/to by direction, create transfer, then reset
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
            loading: t("transactions.transferLoading"),
            success: (response) => getApiMessage(response, t("transactions.transferFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        try {
            await promise;
        } catch (error) {
            setApiValidationErrors(error, setError, {
                fromWalletId: "counterpartWalletId",
                toWalletId: "counterpartWalletId",
            });
            return;
        }

        reset(defaultFormValues);
        setSelectedWallet("auto");
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
            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                            label={t("transactions.currentWallet")}
                            highlight
                            showDescription={false}
                        />
                    )}
                </div>

                <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:flex">
                    <motion.button
                        type="button"
                        onClick={toggleDirection}
                        title={t("transactions.invertDirection")}
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

                <div className="min-h-36 min-w-0 rounded-2xl border border-dashed border-light-10 bg-surface-hard/30 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-helper">
                            {isOutgoing ? t("transactions.destination") : t("transactions.origin")}
                        </p>
                        <span className="text-[11px] text-helper">{t("transactions.required")}</span>
                    </div>

                    {readOnly && counterpartCardWallet ? (
                        <div className="rounded-xl bg-surface/60 px-3 py-2.5">
                            <p className="truncate text-sm font-semibold text-light">
                                {counterpartCardWallet.name}
                            </p>
                            <p className="mt-1 text-xs text-helper">
                                {counterpartCardWallet.description || t("transactions.chooseWalletHint")}
                            </p>
                        </div>
                    ) : (
                        <Controller
                            name="counterpartWalletId"
                            control={control}
                            render={({ field }) => (
                                <SelectAutoComplete<Wallet>
                                    idSelect="counterpartWalletId"
                                    label=""
                                    compact
                                    placeholder={
                                        isWalletsFetching
                                            ? t("transactions.searchingWallets")
                                            : t("transactions.searchWallet")
                                    }
                                    selectedItem={selectedWallet}
                                    setSelectedItem={(wallet) => {
                                        setSelectedWallet(wallet);
                                        field.onChange(wallet?.id ?? "");
                                    }}
                                    query={walletQuery}
                                    setQuery={setWalletQuery}
                                    data={availableWallets ?? []}
                                    getKey={(wallet) => wallet.id}
                                    getLabel={(wallet) => wallet.name}
                                    disabled={isDisabled}
                                />
                            )}
                        />
                    )}
                    {!readOnly && (
                        <p className="mt-2 text-xs text-helper">
                            {t("transactions.chooseWalletHint")}
                        </p>
                    )}
                    {!readOnly && selectedWallet && (
                        <div className="mt-3 flex items-center justify-between border-t border-light-10 pt-3">
                            <span className="text-xs text-helper">{t("transactions.availableBalance")}</span>
                            <span className="text-sm font-semibold tabular-nums text-light">
                                {formatCurrency(selectedWallet.balance, selectedWallet.currency)}
                            </span>
                        </div>
                    )}
                    {errors.counterpartWalletId && (
                        <span className="mt-1 block text-xs text-danger">
                            {errors.counterpartWalletId.message}
                        </span>
                    )}
                </div>
            </div>

            {!readOnly && (
                <p className="text-center text-xs text-helper">
                    {isOutgoing ? t("transactions.outgoingHint") : t("transactions.incomingHint")} {t("transactions.invertHint")}
                </p>
            )}

            <div className="flex flex-col gap-1">
                <Label htmlFor="amount">{t("transactions.amount")}</Label>
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
                <Label htmlFor="description">{t("transactions.description")}</Label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="description"
                            placeholder={t("transactions.transferReason")}
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
                <ModalActionFooter>
                    <Button
                        type="submit"
                        disabled={createTransfer.isPending}
                        text={
                            createTransfer.isPending ? t("transactions.saving") : t("transactions.createTransfer")
                        }
                    />
                </ModalActionFooter>
            )}
        </form>
    );
};
