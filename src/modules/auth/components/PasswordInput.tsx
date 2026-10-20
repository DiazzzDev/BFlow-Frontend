import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { authInputClass } from "../utils/authStyles";

type PasswordInputProps = Omit<ComponentProps<"input">, "type" | "className">;

export const PasswordInput = (props: PasswordInputProps) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative">
            <input {...props} type={isVisible ? "text" : "password"} className={`${authInputClass} pr-11`} />

            <button
                type="button"
                onClick={() => setIsVisible((visible) => !visible)}
                aria-label={isVisible ? t("auth.hidePassword") : t("auth.showPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-helper transition-colors hover:text-light"
            >
                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};
