import { useCallback, useEffect, useState } from "react";

// Starts running on mount because Cognito already sends a code at sign up
export const useResendCooldown = (duration: number) => {
    const [seconds, setSeconds] = useState(duration);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }
        const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    const restart = useCallback(() => setSeconds(duration), [duration]);

    return { seconds, restart };
};
