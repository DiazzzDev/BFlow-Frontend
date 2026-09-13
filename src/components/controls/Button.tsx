import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// Uses `text` + optional `icon` instead of `children` for a consistent button API
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    text: string;
    icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            type = "submit",
            hidden = false,
            disabled = false,
            text,
            icon,
            className = "",
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                type={type}
                hidden={hidden}
                disabled={disabled}
                className={`flex items-center justify-center gap-2 font-medium px-6 py-2 rounded-lg transition-all font-sans text-sm ${disabled ? "bg-primary-75 cursor-not-allowed shadow-none" : "bg-primary hover:bg-primary-dark text-light shadow-sm cursor-pointer active:scale-95"} ${className}`}
                {...props}
            >
                {icon && (
                    <span className="text-xl font-light leading-none relative">{icon}</span>
                )}
                {text}
            </button>
        );
    },
);

Button.displayName = "Button";
