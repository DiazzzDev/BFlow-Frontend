import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, User } from "lucide-react";

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

// Helper to strictly validate image URLs for rendering
const sanitizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) { return null };
    try {
        const parsed = new URL(url, window.location.origin);
        if (["http:", "https:", "blob:"].includes(parsed.protocol)) {
            return parsed.href;
        }
    } catch {
        // Invalid URL structure
    }
    return null;
};

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        control,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        const f = () => {
            if (!isOpen) { return };

            reset({
                name: user?.name ?? "",
                email: user?.email ?? "",
            });
            setPhotoFile(null);
            setPreviewUrl(sanitizeImageUrl(user?.pictureUrl));
        }
        f();
    }, [isOpen, user, reset]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        // Revoke previous blob URL if exists
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file && file.type.startsWith("image/")) {
            setPhotoFile(file);
            const generatedUrl = URL.createObjectURL(file);
            setPreviewUrl(sanitizeImageUrl(generatedUrl));
        } else {
            setPhotoFile(null);
            setPreviewUrl(sanitizeImageUrl(user?.pictureUrl));
        }
    };

    const handleClose = () => {
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPhotoFile(null);
        setPreviewUrl(null);
        onClose();
    };

    const validatedSrc = sanitizeImageUrl(previewUrl);

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) { handleClose() };
            }}
            title="Editar perfil"
            maxWidth="max-w-md"
        >
            <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                    event.preventDefault();
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
                        onChange={handleFileChange}
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

                <div className="flex flex-col gap-1.5">
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
                    <button
                        type="button"
                        onClick={handleClose}
                        className="cursor-pointer rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-light-5"
                    >
                        Cancelar
                    </button>
                    <Button type="submit" text="Actualizar" className="w-full sm:w-auto" />
                </div>
            </form>
        </CustomModal>
    );
};