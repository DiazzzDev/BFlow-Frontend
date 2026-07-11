import React from "react";

interface ButtonProps {
    type?: 'submit' | 'reset' | 'button',
    hidden?: boolean,
    disabled?: boolean,
    text: string,
    icon?: React.ReactNode,
    onClick: () => void,
    className?: string
}

export const Button = ({ type = "submit", hidden = false, disabled = false, text, icon, onClick, className = "" }: ButtonProps) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            hidden={hidden}
            className={`
                flex items-center justify-center gap-2 font-medium px-6 py-2 rounded-lg transition-all font-popins text-sm
                ${disabled
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-primary hover:bg-primary-hover text-foreground shadow-sm cursor-pointer active:scale-95'}
                ${className}
            `}
        >
            {icon && <span className="text-xl font-light leading-none relative">{icon}</span>}
            {text}
        </button>
    );
};