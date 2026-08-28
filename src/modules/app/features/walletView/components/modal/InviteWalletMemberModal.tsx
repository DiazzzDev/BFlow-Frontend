import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useMutateWalletInvitations } from "../../../wallets/hooks/useMutateWalletInvitations";

import { Button } from "@/components/controls/Button";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { CustomModal } from "@/components/custom/CustomModal";

const inviteSchema = z.object({
    invitedEmail: z
        .string()
        .min(1, "El correo es obligatorio")
        .email("Correo inválido"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteWalletMemberModalProps {
    isOpen: boolean;
    walletId: string;
    walletName?: string;
    onClose: () => void;
}

export const InviteWalletMemberModal = ({
    isOpen,
    walletId,
    walletName,
    onClose,
}: InviteWalletMemberModalProps) => {
    const { inviteMember } = useMutateWalletInvitations();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invitedEmail: "",
        },
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        reset({ invitedEmail: "" });
    }, [isOpen, reset]);

    const onSubmit = async (formData: InviteFormValues) => {
        const promise = inviteMember.mutateAsync({
            walletId,
            data: {
                invitedEmail: formData.invitedEmail.trim().toLowerCase(),
            },
        });

        toast.promise(promise, {
            loading: "Enviando invitación...",
            success: `Invitación enviada a ${formData.invitedEmail.trim()}`,
            error: (err) =>
                err instanceof Error ? err.message : "Error al enviar la invitación",
        });

        await promise;
        onClose();
    };

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Invitar a la billetera"
            maxWidth="max-w-md"
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                    void handleSubmit(onSubmit)(event);
                }}
            >
                <p className="text-sm text-helper">
                    Envía una invitación por correo
                    {walletName ? (
                        <>
                            {" "}
                            para unirse a{" "}
                            <span className="font-medium text-light">{walletName}</span>
                        </>
                    ) : null}
                    .
                </p>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="inviteEmail">Correo electrónico</Label>
                    <Controller
                        name="invitedEmail"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="inviteEmail"
                                type="email"
                                autoComplete="email"
                                placeholder="usuario@ejemplo.com"
                                disabled={inviteMember.isPending}
                            />
                        )}
                    />
                    {errors.invitedEmail ? (
                        <span className="text-xs text-danger">
                            {errors.invitedEmail.message}
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={inviteMember.isPending}
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="submit"
                        text={inviteMember.isPending ? "Enviando..." : "Invitar"}
                        disabled={inviteMember.isPending}
                        className="w-full sm:w-auto"
                    />
                </div>
            </form>
        </CustomModal>
    );
};
