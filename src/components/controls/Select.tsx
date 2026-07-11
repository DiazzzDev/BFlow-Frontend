import { forwardRef } from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ id, children, className, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    id={id}
                    name={id}
                    className={`w-full appearance-none rounded-lg border border-border bg-surface px-4 py-2 pr-10 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
                    {...props}
                >
                    {children}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        )
    }
)

Select.displayName = "Select"
