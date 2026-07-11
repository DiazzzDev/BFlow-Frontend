import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    placeholder: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, placeholder, type = "text", className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                {...props}
            />
        )
    }
)

Input.displayName = "Input"
