import { useEffect, useRef, useState } from "react";

import {
    LANDING_STEP_INTERVAL_MS,
    LANDING_STEPS,
} from "../utils/landingContent";

import { useAuth } from "@/auth/hooks/useAuth";

export const useLandingPage = () => {
    // Auth gate for hero CTAs
    const { isAuthenticated, isChecking } = useAuth();

    // FAQ accordion (one open at a time)
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Step carousel: auto-advance unless hovered / manually selected
    const [activeStep, setActiveStep] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const resumeTimeoutRef = useRef<number | null>(null);

    // Reset the fill immediately whenever the active step changes
    useEffect(() => {
        setProgress(0);
    }, [activeStep]);

    // Drive both the progress fill and the auto-advance off one rAF loop,
    // so the bar and the step change always stay in sync
    useEffect(() => {
        if (paused) {
            return;
        }

        let rafId: number;
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const pct = Math.min(100, (elapsed / LANDING_STEP_INTERVAL_MS) * 100);
            setProgress(pct);

            if (elapsed >= LANDING_STEP_INTERVAL_MS) {
                setActiveStep((current) => (current + 1) % LANDING_STEPS.length);
                return;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [paused, activeStep]);

    useEffect(() => {
        return () => {
            if (resumeTimeoutRef.current !== null) {
                window.clearTimeout(resumeTimeoutRef.current);
            }
        };
    }, []);

    // Manual step pick: pause briefly so the user can read, then resume
    const selectStep = (index: number) => {
        setActiveStep(index);
        setPaused(true);

        if (resumeTimeoutRef.current !== null) {
            window.clearTimeout(resumeTimeoutRef.current);
        }

        resumeTimeoutRef.current = window.setTimeout(() => {
            setPaused(false);
            resumeTimeoutRef.current = null;
        }, LANDING_STEP_INTERVAL_MS);
    };

    const toggleFaq = (index: number) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    return {
        openFaq,
        activeStep,
        progress,
        setPaused,
        isAuthenticated,
        isChecking,
        selectStep,
        toggleFaq,
    };
};