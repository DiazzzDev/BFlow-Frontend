import type { CSSProperties, InputHTMLAttributes } from "react";

import { Label } from "@/components/controls/Label";

type RangeSliderTone = "warning" | "danger";

// Custom onChange(number) + composed label UI — native range attrs still pass through
export interface RangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "min" | "max" | "step"> {
    id: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    tone?: RangeSliderTone;
}

const toneColors: Record<RangeSliderTone, string> = {
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
};

export const RangeSlider = ({
    id,
    label,
    value,
    onChange,
    min = 1,
    max = 100,
    step = 1,
    tone = "warning",
    disabled = false,
    className,
    ...props
}: RangeSliderProps) => {
    const color = toneColors[tone];
    const clamped = Math.min(max, Math.max(min, value));
    const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100;

    const style = {
        background: `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, var(--color-light-10) ${percent}%, var(--color-light-10) 100%)`,
        "--thumb-color": color,
    } as CSSProperties;

    return (
        <div className={`flex flex-col gap-2 ${className ?? ""}`}>
            <div className="flex items-center justify-between gap-3">
                <Label htmlFor={id}>{label}</Label>
                <span className="text-sm font-semibold tabular-nums text-light">
                    {clamped}%
                </span>
            </div>

            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={clamped}
                disabled={disabled}
                onChange={(event) => onChange(Number(event.target.value))}
                className="range-slider h-2 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
                // Keep gradient fill after ...props so callers cannot wipe the thumb track
                style={{ ...props.style, ...style }}
            />
        </div>
    );
};
