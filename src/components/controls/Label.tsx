interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: string;
    children: React.ReactNode;
}

export const Label = ({ htmlFor, children, className, ...props }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-sm font-medium text-light ${className ?? ''}`}
            {...props}
        >
            {children}
        </label>
    )
}