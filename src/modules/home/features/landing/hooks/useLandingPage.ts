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
    const resumeTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (paused) {
            return;
        }

        const id = window.setInterval(() => {
            setActiveStep((current) => (current + 1) % LANDING_STEPS.length);
        }, LANDING_STEP_INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [paused]);

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
        setPaused,
        isAuthenticated,
        isChecking,
        selectStep,
        toggleFaq,
    };
};
