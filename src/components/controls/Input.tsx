import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, placeholder, type = "text", className, name, ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                id={id}
                // Default name to id so RHF/`<label htmlFor>` stay aligned unless overridden
                name={name ?? id}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm text-light shadow-sm transition-colors placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-light-50 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                {...props}
            />
        );
    },
);

Input.displayName = "Input";
