import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "ghost";

const VARIANT_CLASSES: Record<
    ButtonVariant,
    { enabled: string; disabled: string }
> = {
    primary: {
        enabled:
            "bg-primary text-light shadow-sm hover:bg-primary-dark active:scale-95",
        disabled: "bg-primary-75 text-light shadow-none",
    },
    secondary: {
        enabled:
            "bg-surface text-light shadow-sm hover:bg-surface/80 border border-light-5 active:scale-95",
        disabled: "bg-surface-75 text-light shadow-none",
    },
    outline: {
        enabled:
            "border border-light-10 bg-transparent text-light hover:bg-light-5 active:scale-95",
        disabled: "border border-light-10 bg-transparent text-helper opacity-50",
    },
    danger: {
        enabled:
            "bg-danger text-light shadow-sm hover:bg-danger-dark active:scale-95",
        disabled: "bg-danger-75 text-light shadow-none",
    },
    ghost: {
        enabled:
            "bg-transparent text-helper hover:bg-light-5 hover:text-light active:scale-95",
        disabled: "bg-transparent text-helper opacity-50",
    },
};

// Uses `text` + optional `icon` instead of `children` for a consistent button API.
// `variant` styles color/hover; HTML `type` stays submit/button/reset.
export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    text: string;
    icon?: ReactNode;
    variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            type = "submit",
            variant = "primary",
            hidden = false,
            disabled = false,
            text,
            icon,
            className = "",
            ...props
        },
        ref,
    ) => {
        const variantClasses = VARIANT_CLASSES[variant];
        const stateClasses = disabled
            ? `${variantClasses.disabled} cursor-not-allowed`
            : `${variantClasses.enabled} cursor-pointer`;

        return (
            <button
                ref={ref}
                type={type}
                hidden={hidden}
                disabled={disabled}
                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-sans text-sm font-medium transition-all ${stateClasses} ${className}`}
                {...props}
            >
                {icon && (
                    <span className="relative text-xl font-light leading-none">
                        {icon}
                    </span>
                )}
                {text}
            </button>
        );
    },
);

Button.displayName = "Button";
