import { useEffect, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    AlertTriangle,
    Building2,
    Calendar,
    Clock,
    Info,
    Save,
    ShieldCheck,
    Trash2,
    Users,
    Wallet,
    ArrowLeftRight,
    CircleDollarSign,
} from "lucide-react";

import { useMutateWallets } from "../../../wallets/hooks/useMutateWallets";
import type { Wallet as WalletType } from "../../../wallets/interfaces/Wallets";
import { useGetWalletDetails } from "../../hooks/useGetWalletDetails";
import { DeleteWalletModal } from "../modal/DeleteWalletModal";

import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { Textarea } from "@/components/controls/Textarea";
import { SkeletonText } from "@/components/loaders/SkeletonText";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formatterDynamicDate } from "@/utils/formatters/formatDynamicDate";

const settingsSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface WalletSettingsPanelProps {
    wallet?: WalletType;
    isLoading: boolean;
}

const isOwnerRole = (role?: string | null) =>
    role?.trim().toUpperCase() === "OWNER";

const roleLabel = (role?: string | null) => {
    const normalized = role?.trim().toUpperCase() ?? "";

    if (normalized === "OWNER") {
        return "Propietario";
    }
    if (normalized === "EDITOR" || normalized === "MEMBER") {
        return "Miembro";
    }
    if (normalized === "VIEWER") {
        return "Solo lectura";
    }

    return role?.trim() || "—";
};

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-center justify-between gap-3 border-b border-light-10 py-3 last:border-b-0">
        <div className="flex min-w-0 items-center gap-2.5 text-helper">
            <span className="shrink-0">{icon}</span>
            <span className="truncate text-sm">{label}</span>
        </div>
        <span className="shrink-0 text-sm font-medium text-light">{value}</span>
    </div>
);

export const WalletSettingsPanel = ({
    wallet,
    isLoading,
}: WalletSettingsPanelProps) => {
    const { updateWallet } = useMutateWallets();
    const { data: walletDetailsResponse } = useGetWalletDetails(wallet?.id ?? "");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const isOwner = isOwnerRole(wallet?.role);
    const transactionsCount = walletDetailsResponse?.data.transactions ?? 0;

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

    const onSubmit = async (formData: SettingsFormValues) => {
        if (!wallet || !isOwner) {
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
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="w-full space-y-5 px-4 py-6 sm:px-7">
                    <div>
                        <SkeletonText className="mb-2 h-6 w-52" />
                        <SkeletonText className="h-4 w-72" />
                    </div>
                    <div className="grid gap-5 @2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                        <SkeletonText className="h-72 w-full rounded-2xl" />
                        <SkeletonText className="h-72 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const isSaving = updateWallet.isPending;
    const fieldsDisabled = !isOwner || isSaving;

    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="w-full space-y-5 px-4 py-6 sm:px-7">
                <header>
                    <h2 className="text-lg font-semibold text-light">
                        Ajustes de la billetera
                    </h2>
                    <p className="mt-1 text-sm text-helper">
                        {wallet.name}
                        {" · "}
                        {isOwner
                            ? "Editá la información general y revisá los detalles de la cuenta"
                            : "Revisá la información general y los detalles de la cuenta"}
                    </p>
                </header>

                <div className="grid items-start gap-5 @2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="flex flex-col gap-5">
                        <section className="overflow-hidden rounded-2xl border border-light-10 bg-surface/40">
                            <div className="flex items-start justify-between gap-3 border-b border-light-10 px-5 py-4">
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-light">
                                        General
                                    </h3>
                                    <p className="mt-0.5 text-sm text-helper">
                                        {isOwner
                                            ? "Editá el nombre y la descripción de esta billetera"
                                            : "Solo el propietario puede editar estos datos"}
                                    </p>
                                </div>
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-light-10 text-helper">
                                    <Wallet className="h-4 w-4" />
                                </span>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    void handleSubmit(onSubmit)(e);
                                }}
                            >
                                <div className="space-y-4 px-5 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="walletSettingsName">Nombre</Label>
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    id="walletSettingsName"
                                                    placeholder="Ej. Personal"
                                                    disabled={fieldsDisabled}
                                                    readOnly={!isOwner}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.name && isOwner ? (
                                            <span className="text-xs text-danger">
                                                {errors.name.message}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="walletSettingsDescription">
                                            Descripción
                                        </Label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    id="walletSettingsDescription"
                                                    placeholder="Para qué usas esta billetera"
                                                    rows={3}
                                                    disabled={fieldsDisabled}
                                                    readOnly={!isOwner}
                                                    {...field}
                                                />
                                            )}
                                        />
                                        {errors.description && isOwner ? (
                                            <span className="text-xs text-danger">
                                                {errors.description.message}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-helper">
                                                Visible solo para los miembros de esta
                                                billetera
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isOwner ? (
                                    <div className="flex items-center justify-between gap-3 border-t border-light-10 px-5 py-3.5">
                                        <p className="text-xs text-helper">
                                            {isSaving
                                                ? "Guardando..."
                                                : isDirty
                                                  ? "Hay cambios sin guardar"
                                                  : "Todo guardado"}
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSaving || !isDirty}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-light-10 bg-surface px-3.5 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            {isSaving ? "Guardando..." : "Guardar cambios"}
                                        </button>
                                    </div>
                                ) : null}
                            </form>
                        </section>

                        {isOwner ? (
                            <section className="rounded-2xl border border-danger-50/50 bg-danger-sweet/30 px-5 py-4">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-danger-50/60 text-danger">
                                        <AlertTriangle className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-light">
                                            Eliminar billetera
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-helper">
                                            Se borra todo el historial de transacciones,
                                            presupuestos y miembros asociados a{" "}
                                            <span className="font-medium text-light">
                                                {wallet.name}
                                            </span>
                                            . Esta acción no se puede deshacer.
                                        </p>
                                        <button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => setIsDeleteOpen(true)}
                                            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-danger-50 px-3.5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-sweet disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar billetera
                                        </button>
                                    </div>
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <aside className="overflow-hidden rounded-2xl border border-light-10 bg-surface/40">
                        <div className="flex items-center gap-2 border-b border-light-10 px-5 py-4">
                            <Info className="h-4 w-4 text-helper" />
                            <h3 className="text-base font-semibold text-light">
                                Información
                            </h3>
                        </div>

                        <div className="space-y-5 px-5 py-4">
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-helper">
                                    Financiero
                                </p>
                                <div>
                                    <InfoRow
                                        icon={<CircleDollarSign className="h-4 w-4" />}
                                        label="Moneda"
                                        value={wallet.currency}
                                    />
                                    <InfoRow
                                        icon={<Building2 className="h-4 w-4" />}
                                        label="Valor inicial"
                                        value={formatCurrency(
                                            wallet.initialValue ?? 0,
                                            wallet.currency,
                                        )}
                                    />
                                    <InfoRow
                                        icon={<Wallet className="h-4 w-4" />}
                                        label="Saldo actual"
                                        value={formatCurrency(
                                            wallet.balance ?? 0,
                                            wallet.currency,
                                        )}
                                    />
                                    <InfoRow
                                        icon={<ArrowLeftRight className="h-4 w-4" />}
                                        label="Transacciones"
                                        value={String(transactionsCount)}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-helper">
                                    Acceso
                                </p>
                                <div>
                                    <InfoRow
                                        icon={<Users className="h-4 w-4" />}
                                        label="Miembros"
                                        value={String(wallet.memberCount ?? 0)}
                                    />
                                    <InfoRow
                                        icon={<ShieldCheck className="h-4 w-4" />}
                                        label="Tu rol"
                                        value={roleLabel(wallet.role)}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-helper">
                                    Actividad
                                </p>
                                <div>
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Creada"
                                        value={
                                            formatterDynamicDate(wallet.createdAt) || "—"
                                        }
                                    />
                                    <InfoRow
                                        icon={<Clock className="h-4 w-4" />}
                                        label="Actualizada"
                                        value={
                                            formatterDynamicDate(wallet.updatedAt) || "—"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {isOwner ? (
                <DeleteWalletModal
                    isOpen={isDeleteOpen}
                    walletId={wallet.id}
                    walletName={wallet.name}
                    onClose={() => setIsDeleteOpen(false)}
                />
            ) : null}
        </div>
    );
};
