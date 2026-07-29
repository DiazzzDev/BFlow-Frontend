interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
}

export const ToggleSwitch = ({ checked, onChange, disabled = false, label = "" }: ToggleSwitchProps) => {
    return (
        <label className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => !disabled && onChange(e.target.checked)}
                disabled={disabled}
                className="peer sr-only"
            />

            <div className="relative h-7 w-13 rounded-full bg-secondary transition-colors peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary">
                <div className="absolute top-[4px] left-[2px] h-5 w-5 rounded-full border border-light-10 bg-surface transition-transform peer-checked:translate-x-6" />
            </div>

            {label && (
                <span className="select-none text-sm font-medium text-light">
                    {label}
                </span>
            )}
        </label>
    )
}