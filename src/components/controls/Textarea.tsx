import { forwardRef } from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    placeholder: string;
    rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, placeholder, className, rows = 4, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                id={id}
                name={id}
                placeholder={placeholder}
                rows={rows}
                className={`w-full resize-none rounded-lg border border-light-10 bg-surface px-4 py-2 text-sm text-light shadow-sm transition-colors placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-light-50 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                {...props}
            />
        )
    }
)

Textarea.displayName = "Textarea"
