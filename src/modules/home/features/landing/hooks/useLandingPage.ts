import { useEffect, useState } from "react";

import {
    LANDING_STEP_INTERVAL_MS,
    LANDING_STEPS,
} from "../utils/landingContent";

import { useAuth } from "@/auth/hooks/useAuth";

export const useLandingPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const [paused, setPaused] = useState(false);
    const { isAuthenticated, isChecking } = useAuth();

    useEffect(() => {
        if (paused) {
            return;
        }

        const id = window.setInterval(() => {
            setActiveStep((current) => (current + 1) % LANDING_STEPS.length);
        }, LANDING_STEP_INTERVAL_MS);

        return () => window.clearInterval(id);
    }, [paused]);

    const selectStep = (index: number) => {
        setActiveStep(index);
        setPaused(true);
        window.setTimeout(() => setPaused(false), LANDING_STEP_INTERVAL_MS);
    };

    const toggleFaq = (index: number) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    return {
        openFaq,
        activeStep,
        paused,
        setPaused,
        isAuthenticated,
        isChecking,
        selectStep,
        toggleFaq,
    };
};
