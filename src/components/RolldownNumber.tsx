import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";

interface RolldownNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    /** Numeric value to animate to. */
    value: number;
    /** Animation duration in seconds. */
    duration?: number;
    /** Formats the interpolated number for display (currency, decimals, etc.). */
    formatValue?: (value: number) => string;
    /** Whether the first render should animate from zero. */
    animateOnMount?: boolean;
}

/**
 * Animates a numeric value from its previous value to the next one.
 * Typography, size and colour are inherited from `className` or its parent.
 */
export const RolldownNumber = ({
    value,
    duration = 0.6,
    formatValue = (number) => new Intl.NumberFormat().format(Math.round(number)),
    animateOnMount = true,
    className = "",
    ...props
}: RolldownNumberProps) => {
    const prefersReducedMotion = useReducedMotion();
    const initialValue = animateOnMount ? 0 : value;
    const [displayValue, setDisplayValue] = useState(initialValue);
    const currentValue = useRef(initialValue);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const from = hasAnimated.current || !animateOnMount ? currentValue.current : 0;
        hasAnimated.current = true;

        if (prefersReducedMotion || duration === 0) {
            currentValue.current = value;
            setDisplayValue(value);
            return;
        }

        const controls = animate(from, value, {
            duration,
            ease: "easeOut",
            onUpdate: (latest) => {
                currentValue.current = latest;
                setDisplayValue(latest);
            },
        });

        return controls.stop;
    }, [animateOnMount, duration, prefersReducedMotion, value]);

    return (
        <span {...props} className={`inline-block tabular-nums ${className}`}>
            {formatValue(displayValue)}
        </span>
    );
};
