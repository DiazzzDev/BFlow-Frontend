import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    LANDING_STEP_INTERVAL_MS,
    LANDING_STEPS,
} from "../../utils/landingContent";

import { StepCard } from "./StepCard";
import { StepPreview } from "./StepPreview";

export const LandingHow = () => {
    const { t } = useTranslation();

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

    return (
        <section id="how" className="w-full max-w-360 px-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-16 max-w-xl leading-tight">
                {t("home.howTitle")}
            </h2>

            <div
                id="features"
                className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 lg:gap-10 items-stretch"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="relative flex flex-col gap-4">
                    <div className="pointer-events-none absolute left-0 top-6 bottom-6 hidden w-px bg-light-10 sm:block" />

                    {LANDING_STEPS.map((step, index) => (
                        <div key={step.number} className="relative sm:pl-8">
                            <span
                                className={`absolute left-0 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 sm:block ${
                                    activeStep === index ? "bg-light" : "bg-helper"
                                }`}
                            />
                            <StepCard
                                number={step.number}
                                title={t(`home.steps.${index}.title`, { defaultValue: step.title })}
                                desc={t(`home.steps.${index}.description`, { defaultValue: step.desc })}
                                active={activeStep === index}
                                onSelect={() => selectStep(index)}
                            />
                        </div>
                    ))}
                </div>

                <div
                    id="dashboard-preview"
                    className="relative min-h-90 lg:min-h-135 overflow-hidden rounded-3xl bg-surface border border-light-10 p-3 md:p-4"
                >
                    {LANDING_STEPS.map((step, index) => (
                        <StepPreview
                            key={step.number}
                            src={step.image}
                            alt={t(`home.steps.${index}.alt`, { defaultValue: step.alt })}
                            label={t(`home.steps.${index}.title`, { defaultValue: step.title })}
                            active={activeStep === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
