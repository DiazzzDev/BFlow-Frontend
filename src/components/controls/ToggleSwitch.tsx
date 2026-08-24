interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
}

export const ToggleSwitch = ({
    checked,
    onChange,
    disabled = false,
    label = "",
}: ToggleSwitchProps) => {
    return (
        <label
            className={`inline-flex items-center gap-3 select-none ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    if (!disabled) { onChange(e.target.checked) };
                }}
                disabled={disabled}
                className="peer sr-only"
            />

            <span
                aria-hidden="true"
                className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border transition-colors duration-200 ${checked
                        ? "border-primary bg-primary"
                        : "border-light-10 bg-secondary-dark"
                    } peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface`}
            >
                <span
                    className={`absolute top-0.7 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform duration-200 ease-out ${checked
                            ? "translate-x-6.5 bg-light"
                            : "translate-x-0 bg-light-50"
                        }`}
                />
            </span>

            {label && (
                <span className="text-sm font-medium text-light">
                    {label}
                </span>
            )}
        </label>
    );
};
