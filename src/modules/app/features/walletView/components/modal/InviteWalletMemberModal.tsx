import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import type { WalletCollaborator } from "../../../wallets/interfaces/WalletCollaborator";
import { useMutateWalletInvitations } from "../../../wallets/hooks/useMutateWalletInvitations";
import { useSearchWalletCollaborators } from "../../hooks/useSearchWalletCollaborators";
import { collaboratorStatusLabel } from "../../utils/collaboratorStatus";

import { Button } from "@/components/controls/Button";
import { SelectAutoComplete } from "@/components/controls/SelectAutocomplete";
import { CustomModal } from "@/components/custom/CustomModal";
import { useDebounce } from "@/hooks/useDebounce";
import { getInitials } from "@/utils/getInitials";
import { getApiErrorMessage, getApiMessage } from "@/utils/api/apiMessage";

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

export const InviteWalletMemberModal = ({
    isOpen,
    walletId,
    walletName,
    onClose,
}: InviteWalletMemberModalProps) => {
    const { t } = useTranslation();
    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={t("wallets.inviteTitle")}
            maxWidth="max-w-md"
        >
            {/* Remount form/search state whenever the modal opens */}
            <InviteWalletMemberModalContent
                key={isOpen ? "open" : "closed"}
                walletId={walletId}
                walletName={walletName}
                onClose={onClose}
            />
        </CustomModal>
    );
};

interface InviteWalletMemberModalContentProps {
    walletId: string;
    walletName?: string;
    onClose: () => void;
}

const InviteWalletMemberModalContent = ({
    walletId,
    walletName,
    onClose,
}: InviteWalletMemberModalContentProps) => {
    const { t } = useTranslation();
    // Invite mutation
    const { inviteMember } = useMutateWalletInvitations();

    // Collaborator search (remote; needs at least 2 chars)
    const [collaboratorQuery, setCollaboratorQuery] = useState("");
    const [selectedCollaborator, setSelectedCollaborator] =
        useState<WalletCollaborator | null>(null);
    const debouncedCollaboratorQuery = useDebounce(collaboratorQuery, 400);
    const { data: collaboratorsResponse, isFetching: isCollaboratorsLoading } =
        useSearchWalletCollaborators(walletId, debouncedCollaboratorQuery);
    const collaborators = collaboratorsResponse?.data ?? [];

    // RHF form — invitedEmail is the value that actually gets submitted
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invitedEmail: "",
        },
    });

    // Send invite by email then close the modal
    const onSubmit = async (formData: InviteFormValues) => {
        const promise = inviteMember.mutateAsync({
            walletId,
            data: {
                invitedEmail: formData.invitedEmail.trim().toLowerCase(),
            },
        });

        toast.promise(promise, {
            loading: t("wallets.inviteLoading"),
            success: (response) => getApiMessage(response, t("wallets.inviteFallback")),
            error: (error) => getApiErrorMessage(error, t("common.operationError")),
        });

        await promise;
        onClose();
    };

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
            }}
        >
            <p className="text-sm text-helper">
                La invitación se envía por correo electrónico. Puedes buscar por
                nombre, pero al seleccionar se usará el correo de esa persona
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
                            label={t("auth.email")}
                            placeholder={
                                isCollaboratorsLoading
                                    ? t("common.loading")
                                    : t("wallets.searchCollaborator")
                            }
                            selectedItem={selectedCollaborator}
                            setSelectedItem={(collaborator) => {
                                setSelectedCollaborator(collaborator);
                                if (collaborator) {
                                    const email = collaborator.email
                                        .trim()
                                        .toLowerCase();
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
                                    collaborator.name.trim() ||
                                    collaborator.email;
                                const isInvitable =
                                    collaborator.status.toUpperCase() ===
                                    "INVITABLE";

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
                        {t("wallets.minSearchChars")}
                    </span>
                ) : null}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="submit"
                    text={inviteMember.isPending ? t("wallets.inviteLoading") : t("walletView.invite")}
                    disabled={inviteMember.isPending}
                    className="w-full sm:w-auto"
                />
            </div>
        </form>
    );
};
