import type { LabelHTMLAttributes, ReactNode } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: string;
    children: ReactNode;
}

export const Label = ({ htmlFor, children, className, ...props }: LabelProps) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-sm font-medium text-light ${className ?? ""}`}
            {...props}
        >
            {children}
        </label>
    );
};
