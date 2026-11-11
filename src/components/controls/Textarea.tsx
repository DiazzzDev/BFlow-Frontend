import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    placeholder: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, placeholder, className, rows = 4, name, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                id={id}
                name={name ?? id}
                placeholder={placeholder}
                rows={rows}
                className={`w-full resize-none rounded-lg border border-light-10 bg-surface-hard/40 px-3 py-2 text-sm text-light shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-placeholder hover:border-light-25 focus:border-primary-75 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-15 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                {...props}
            />
        );
    },
);

Textarea.displayName = "Textarea";
