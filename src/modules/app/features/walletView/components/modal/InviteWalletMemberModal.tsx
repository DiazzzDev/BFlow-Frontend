import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { WalletCollaborator } from "../../../wallets/interfaces/WalletCollaborator";
import { useMutateWalletInvitations } from "../../../wallets/hooks/useMutateWalletInvitations";
import { useSearchWalletCollaborators } from "../../../wallets/hooks/useSearchWalletCollaborators";

import { Button } from "@/components/controls/Button";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { CustomModal } from "@/components/custom/CustomModal";
import { useDebounce } from "@/hooks/useDebounce";

const inviteSchema = z.object({
    invitedEmail: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio")
        .email("Ingresa un correo electrónico válido")
        .transform((value) => value.toLowerCase()),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteWalletMemberModalProps {
    isOpen: boolean;
    walletId: string;
    walletName?: string;
    onClose: () => void;
}

const collaboratorStatusLabel = (status: string) => {
    const normalized = status.trim().toUpperCase();

    if (normalized === "ALREADY_MEMBER") {
        return "Ya es miembro";
    }
    if (normalized === "PENDING") {
        return "Invitación pendiente";
    }
    if (normalized === "INVITABLE") {
        return "Disponible";
    }

    return status;
};

const getInitials = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "?";
    }

    if (trimmed.includes("@")) {
        return trimmed.slice(0, 2).toUpperCase();
    }

    const parts = trimmed.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const InviteWalletMemberModal = ({
    isOpen,
    walletId,
    walletName,
    onClose,
}: InviteWalletMemberModalProps) => {
    const { inviteMember } = useMutateWalletInvitations();
    const [collaboratorQuery, setCollaboratorQuery] = useState("");
    const [selectedCollaborator, setSelectedCollaborator] =
        useState<WalletCollaborator | null>(null);
    const debouncedCollaboratorQuery = useDebounce(collaboratorQuery, 400);

    const {
        data: collaboratorsResponse,
        isFetching: isCollaboratorsLoading,
    } = useSearchWalletCollaborators(walletId, debouncedCollaboratorQuery);

    const collaborators = collaboratorsResponse?.data ?? [];

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invitedEmail: "",
        },
    });

    useEffect(() => {
        const f = () => {
            if (!isOpen) {
                return;
            }
            reset({ invitedEmail: "" });
            setCollaboratorQuery("");
            setSelectedCollaborator(null);
        }
        f()
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
                    La invitación se envía por correo electrónico. Puedes buscar
                    por nombre, pero al seleccionar se usará el correo de esa
                    persona
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
                    <Controller
                        name="invitedEmail"
                        control={control}
                        render={({ field }) => (
                            <SelectAutoComplete<WalletCollaborator>
                                idSelect="inviteCollaborator"
                                label="Correo electrónico"
                                placeholder={
                                    isCollaboratorsLoading
                                        ? "Buscando..."
                                        : "Buscar por nombre o correo..."
                                }
                                selectedItem={selectedCollaborator}
                                setSelectedItem={(collaborator) => {
                                    setSelectedCollaborator(collaborator);
                                    if (collaborator) {
                                        const email = collaborator.email.trim().toLowerCase();
                                        field.onChange(email);
                                        setValue("invitedEmail", email, {
                                            shouldValidate: true,
                                        });
                                    }
                                }}
                                query={collaboratorQuery}
                                setQuery={(value) => {
                                    setCollaboratorQuery(value);
                                    field.onChange(value);
                                }}
                                data={collaborators}
                                getKey={(collaborator) => collaborator.id}
                                getLabel={(collaborator) => collaborator.email}
                                filterLocally={false}
                                portal={false}
                                showSearchIcon={false}
                                isOptionDisabled={(collaborator) =>
                                    collaborator.status.toUpperCase() !== "INVITABLE"
                                }
                                disabled={inviteMember.isPending}
                                renderOption={(collaborator) => {
                                    const displayName =
                                        collaborator.name.trim() || collaborator.email;
                                    const isInvitable =
                                        collaborator.status.toUpperCase() === "INVITABLE";

                                    return (
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            {collaborator.pictureUrl ? (
                                                <img
                                                    src={collaborator.pictureUrl}
                                                    alt={displayName}
                                                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-light">
                                                    {getInitials(displayName)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-light">
                                                    {displayName}
                                                </p>
                                                <p className="truncate text-xs text-helper">
                                                    {collaborator.email}
                                                </p>
                                            </div>
                                            {!isInvitable ? (
                                                <span className="shrink-0 rounded-full border border-light-10 px-2 py-0.5 text-[10px] text-helper">
                                                    {collaboratorStatusLabel(
                                                        collaborator.status,
                                                    )}
                                                </span>
                                            ) : null}
                                        </div>
                                    );
                                }}
                            />
                        )}
                    />
                    {errors.invitedEmail ? (
                        <span className="text-xs text-danger">
                            {errors.invitedEmail.message}
                        </span>
                    ) : null}
                    {collaboratorQuery.trim().length > 0 &&
                    collaboratorQuery.trim().length < 2 ? (
                        <span className="text-xs text-helper">
                            Escribe al menos 2 caracteres para buscar.
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
