import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { z } from "zod";

import { useChangePassword } from "../hooks/useChangePassword";

import { Button } from "@/components/controls/Button";
import { Label } from "@/components/controls/Label";
import { PasswordInput } from "@/components/controls/PasswordInput";
import { CustomModal } from "@/components/custom/CustomModal";
import { ModalActionFooter } from "@/components/custom/ModalActionFooter";

const createChangePasswordSchema = (t: TFunction) => z
    .object({
        currentPassword: z.string().min(1, t("validation.passwordRequired")),
        newPassword: z
            .string()
            .min(1, t("validation.passwordRequired"))
            .min(8, t("validation.passwordMin", { min: 8 }))
            .refine((value) => /[A-Z]/.test(value), {
                message: t("validation.passwordUppercase"),
            })
            .refine((value) => /[a-z]/.test(value), {
                message: t("validation.passwordLowercase"),
            })
            .refine((value) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(value), {
                message: t("validation.passwordNumberOrSymbol"),
            }),
        confirmPassword: z.string().min(1, t("validation.passwordRequired")),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: t("validation.passwordMustDiffer"),
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: t("validation.passwordsMatch"),
        path: ["confirmPassword"],
    });

type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const getChangePasswordErrorMessage = (error: unknown, t: TFunction): string => {
    const errorDetails = typeof error === "object" && error !== null
        ? error as { name?: string; code?: string; message?: string }
        : null;
    const code = errorDetails?.name ?? errorDetails?.code;

    if (
        code === "NotAuthorizedException"
        && errorDetails?.message?.includes("required scopes")
    ) {
        return t("settings.account.passwordMissingScope");
    }

    switch (code) {
        case "NotAuthorizedException":
            return t("settings.account.passwordCurrentIncorrect");
        case "InvalidPasswordException":
        case "InvalidParameterException":
            return t("settings.account.passwordPolicyError");
        case "LimitExceededException":
        case "TooManyRequestsException":
            return t("settings.account.passwordTooManyAttempts");
        default:
            return t("settings.account.passwordChangeError");
    }
};

export const ChangePasswordModal = ({
    isOpen,
    onClose,
}: ChangePasswordModalProps) => {
    const { t } = useTranslation();

    return (
        <CustomModal
            isModalOpen={isOpen}
            setIsModalOpen={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={t("settings.account.changePasswordTitle")}
            maxWidth="max-w-md"
        >
            <ChangePasswordForm
                key={isOpen ? "open" : "closed"}
                onClose={onClose}
            />
        </CustomModal>
    );
};

interface ChangePasswordFormProps {
    onClose: () => void;
}

const ChangePasswordForm = ({ onClose }: ChangePasswordFormProps) => {
    const { t } = useTranslation();
    const changePasswordSchema = createChangePasswordSchema(t);
    const { mutateAsync: changePassword, isPending } = useChangePassword();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: ChangePasswordFormValues) => {
        const promise = changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });

        toast.promise(promise, {
            loading: t("settings.account.passwordChangeLoading"),
            success: () => {
                onClose();
                return t("settings.account.passwordChangeSuccess");
            },
            error: (error) => getChangePasswordErrorMessage(error, t),
        });
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
            }}
        >
            <p className="text-sm text-helper">
                {t("settings.account.changePasswordHint")}
            </p>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentPassword">
                    {t("settings.account.currentPassword")}
                </Label>
                <Controller
                    name="currentPassword"
                    control={control}
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            id="currentPassword"
                            autoComplete="current-password"
                            placeholder={t("settings.account.currentPasswordPlaceholder")}
                            disabled={isPending}
                        />
                    )}
                />
                {errors.currentPassword ? (
                    <span className="text-xs text-danger">
                        {errors.currentPassword.message}
                    </span>
                ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">
                    {t("settings.account.newPassword")}
                </Label>
                <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            id="newPassword"
                            autoComplete="new-password"
                            placeholder={t("auth.passwordPlaceholder")}
                            disabled={isPending}
                        />
                    )}
                />
                {errors.newPassword ? (
                    <span className="text-xs text-danger">
                        {errors.newPassword.message}
                    </span>
                ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">
                    {t("settings.account.confirmNewPassword")}
                </Label>
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            id="confirmPassword"
                            autoComplete="new-password"
                            placeholder={t("settings.account.confirmNewPasswordPlaceholder")}
                            disabled={isPending}
                        />
                    )}
                />
                {errors.confirmPassword ? (
                    <span className="text-xs text-danger">
                        {errors.confirmPassword.message}
                    </span>
                ) : null}
            </div>

            <ModalActionFooter>
                <Button
                    type="submit"
                    text={isPending
                        ? t("settings.account.passwordChangeLoading")
                        : t("settings.account.changePassword")}
                    disabled={isPending}
                    className="w-full sm:w-auto"
                />
            </ModalActionFooter>
        </form>
    );
};
