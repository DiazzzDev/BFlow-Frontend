import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { useMutateWallets } from "../../../wallets/hooks/useMutateWallets";
import type { Wallet } from "../../../wallets/interfaces/Wallets";
import { useGetWalletMembers } from "../../hooks/useGetWalletMembers";
import { WalletMembersList } from "../WalletMembersList";
import { DeleteWalletModal } from "../modal/DeleteWalletModal";
import { InviteWalletMemberModal } from "../modal/InviteWalletMemberModal";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Textarea } from "@/components/controls/Textarea";
import { Button } from "@/components/controls/Button";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";

const settingsSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface WalletSettingsPanelProps {
    wallet?: Wallet;
    isLoading: boolean;
    initialValue?: number;
}

export const WalletSettingsPanel = ({
    wallet,
    isLoading,
    initialValue,
}: WalletSettingsPanelProps) => {
    const { updateWallet } = useMutateWallets();
    const { data: membersResponse, isLoading: isMembersLoading } = useGetWalletMembers(
        wallet?.id ?? "",
    );
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (!wallet) {
            return;
        }
        reset({
            name: wallet.name,
            description: wallet.description ?? "",
        });
    }, [wallet, reset]);

    const resolvedInitialValue = wallet?.initialValue ?? initialValue ?? 0;
    const members = membersResponse?.data ?? [];

    const onSubmit = async (formData: SettingsFormValues) => {
        if (!wallet) {
            return;
        }

        const promise = updateWallet.mutateAsync({
            id: wallet.id,
            data: {
                name: formData.name,
                description: formData.description,
            },
        });

        toast.promise(promise, {
            loading: "Guardando cambios...",
            success: "Billetera actualizada",
            error: (err) =>
                err instanceof Error ? err.message : "Error al actualizar la billetera",
        });

        await promise;
        reset(formData);
    };

    if (isLoading || !wallet) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden @2xl:flex-row">
                <div className="flex min-h-0 flex-1 flex-col border-b border-light-10 px-4 py-5 sm:px-7 @2xl:border-b-0 @2xl:border-r">
                    <SkeletonText className="mb-6 h-5 w-24" />
                    <div className="flex flex-col gap-4">
                        <SkeletonText className="h-10 w-full" />
                        <SkeletonText className="h-24 w-full" />
                    </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-7">
                    <SkeletonText className="mb-6 h-5 w-28" />
                    <SkeletonText className="h-14 w-full" />
                </div>
            </div>
        );
    }

    const isSaving = updateWallet.isPending;

    return (
        <div className="flex flex-1 flex-col @2xl:flex-row">
            <section className="flex min-w-0 flex-1 flex-col border-b border-light-10 @2xl:border-b-0 @2xl:border-r">
                <div className="flex-1 px-4 py-5 sm:px-7">
                    <div className="mb-6">
                        <h2 className="text-base font-semibold text-light">General</h2>
                        <p className="mt-1 text-sm text-helper">
                            Nombre y descripción de esta billetera.
                        </p>
                    </div>

                    <form
                        className="flex w-full flex-col gap-5"
                        onSubmit={(e) => {
                            void handleSubmit(onSubmit)(e);
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="walletSettingsName">Nombre</Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="walletSettingsName"
                                        placeholder="Ej. Personal"
                                        disabled={isSaving}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.name && (
                                <span className="text-xs text-danger">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="walletSettingsDescription">Descripción</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        id="walletSettingsDescription"
                                        placeholder="Para qué usas esta billetera"
                                        rows={3}
                                        disabled={isSaving}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.description && (
                                <span className="text-xs text-danger">
                                    {errors.description.message}
                                </span>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 gap-4 border-t border-light-10 pt-4">
                            <div>
                                <dt className="text-xs text-helper">Moneda</dt>
                                <dd className="mt-1 text-sm font-medium text-light">
                                    {wallet.currency}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-helper">Valor inicial</dt>
                                <dd className="mt-1 text-sm font-medium text-light">
                                    {formatCurrency(resolvedInitialValue, wallet.currency)}
                                </dd>
                            </div>
                        </dl>

                        <Button
                            type="submit"
                            disabled={isSaving || !isDirty}
                            text={updateWallet.isPending ? "Guardando..." : "Guardar cambios"}
                            className="self-end"
                        />
                    </form>
                </div>

                <div className="flex flex-col gap-3 border-t border-light-10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-light">Eliminar billetera</p>
                        <p className="mt-0.5 text-xs text-helper">
                            Se borra el historial. Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setIsDeleteOpen(true)}
                        className="cursor-pointer rounded-lg border border-danger-50 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Eliminar
                    </button>
                </div>
            </section>

            <section className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3 border-b border-light-10 px-4 py-5 sm:px-7">
                    <div>
                        <h2 className="text-base font-semibold text-light">Miembros</h2>
                        <p className="mt-1 text-sm text-helper">
                            Quién puede ver y mover dinero en esta billetera.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsInviteOpen(true)}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-light-10 px-3 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5"
                    >
                        <UserPlus className="h-4 w-4" />
                        Invitar
                    </button>
                </div>

                <WalletMembersList members={members} isLoading={isMembersLoading} />
            </section>

            <DeleteWalletModal
                isOpen={isDeleteOpen}
                walletId={wallet.id}
                walletName={wallet.name}
                onClose={() => setIsDeleteOpen(false)}
            />

            <InviteWalletMemberModal
                isOpen={isInviteOpen}
                walletId={wallet.id}
                walletName={wallet.name}
                onClose={() => setIsInviteOpen(false)}
            />
        </div>
    );
};
