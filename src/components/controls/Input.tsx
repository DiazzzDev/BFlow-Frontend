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
                className={`w-full rounded-lg border border-light-10 bg-surface-hard/40 px-3 py-2 text-sm text-light shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-placeholder hover:border-light-25 focus:border-primary-75 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-15 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                {...props}
            />
        );
    },
);

Input.displayName = "Input";
