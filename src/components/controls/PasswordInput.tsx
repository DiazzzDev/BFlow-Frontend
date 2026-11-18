import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input, type InputProps } from "./Input";

export interface PasswordInputProps extends Omit<InputProps, "type"> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, disabled, ...props }, ref) => {
        const { t } = useTranslation();
        const [isVisible, setIsVisible] = useState(false);

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    type={isVisible ? "text" : "password"}
                    disabled={disabled}
                    className={`pr-10 ${className ?? ""}`}
                />
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsVisible((visible) => !visible)}
                    aria-label={isVisible ? t("auth.hidePassword") : t("auth.showPassword")}
                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-helper transition-colors hover:bg-light-5 hover:text-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isVisible ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        );
    },
);

PasswordInput.displayName = "PasswordInput";
