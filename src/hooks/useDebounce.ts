import { useEffect, useState } from "react";

// Returns `value` only after it has stayed unchanged for `delay` ms
export const useDebounce = <T>(value: T, delay = 400): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
