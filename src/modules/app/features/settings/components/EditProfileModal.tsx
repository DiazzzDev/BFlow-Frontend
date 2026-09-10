import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, User } from "lucide-react";

import {
    usePatchProfileData,
    usePatchProfilePhoto,
} from "../hooks/useMutateProfile";
import { sanitizeImageUrl } from "../utils/sanitizeImageUrl";

import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/controls/Button";
import { Input } from "@/components/controls/Input";
import { Label } from "@/components/controls/Label";
import { CustomModal } from "@/components/custom/CustomModal";

const profileSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Correo inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Editar perfil"
            maxWidth="max-w-md"
        >
            <EditProfileModalContent
                key={isOpen ? "open" : "closed"}
                onClose={onClose}
            />
        </CustomModal>
    );
};

interface EditProfileModalContentProps {
    onClose: () => void;
}

const EditProfileModalContent = ({ onClose }: EditProfileModalContentProps) => {
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const { mutateAsync: patchProfilePhoto, isPending: isUpdatingPhoto } =
        usePatchProfilePhoto();
    const { mutateAsync: patchProfileData, isPending: isUpdatingData } =
        usePatchProfileData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
        sanitizeImageUrl(user?.pictureUrl),
    );

    const isSubmitting = isUpdatingPhoto || isUpdatingData;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
        },
    });

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmitData = async (data: ProfileFormValues) => {
        const promise = patchProfileData(data);

        toast.promise(promise, {
            loading: "Actualizando datos...",
            success: (res) => {
                const updated = res.data;
                setSession({
                    ...user!,
                    id: updated.id,
                    email: updated.email,
                    name: updated.name,
                    pictureUrl: updated.pictureUrl,
                    roles: updated.roles ?? user?.roles ?? [],
                });
                onClose();
                return "Datos actualizados correctamente";
            },
            error: "Error al actualizar los datos",
        });

        await promise;
    };

    const handleSubmitImage = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file && file.type.startsWith("image/")) {
            setPhotoFile(file);
            setPreviewUrl(sanitizeImageUrl(URL.createObjectURL(file)));
        } else {
            setPhotoFile(null);
            setPreviewUrl(sanitizeImageUrl(user?.pictureUrl));
        }

        const fd = new FormData();
        if (file) {
            fd.append("file", file);
        }

        const promise = patchProfilePhoto(fd);

        toast.promise(promise, {
            loading: "Actualizando foto de perfil...",
            success: "Foto de perfil actualizada",
            error: "Error al actualizar la foto de perfil",
        });

        await promise;
    };

    const validatedSrc = sanitizeImageUrl(previewUrl);

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                void handleSubmit(handleSubmitData)(event);
            }}
        >
            <div className="flex flex-col items-center gap-3">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer"
                    aria-label="Cambiar foto de perfil"
                >
                    {validatedSrc ? (
                        <img
                            src={validatedSrc}
                            alt="Vista previa"
                            className="h-24 w-24 rounded-full border-2 border-light-10 object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-light-10 bg-secondary">
                            <User className="h-9 w-9 text-helper" />
                        </div>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-surface-hard/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="h-5 w-5 text-light" />
                    </span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={(e) => void handleSubmitImage(e)}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                    {photoFile ? "Cambiar foto" : "Subir foto"}
                </button>
                {photoFile ? (
                    <p className="text-xs text-helper">{photoFile.name}</p>
                ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="profileName">Nombre</Label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="profileName"
                            placeholder="Tu nombre"
                        />
                    )}
                />
                {errors.name ? (
                    <span className="text-xs text-danger">{errors.name.message}</span>
                ) : null}
            </div>

            {/* De momento el correo esta oculto */}
            <div className="flex flex-col gap-1.5 hidden">
                <Label htmlFor="profileEmail">Correo</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="profileEmail"
                            type="email"
                            placeholder="correo@ejemplo.com"
                        />
                    )}
                />
                {errors.email ? (
                    <span className="text-xs text-danger">{errors.email.message}</span>
                ) : null}
            </div>

            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                    type="submit"
                    text="Actualizar"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                />
            </div>
        </form>
    );
};
