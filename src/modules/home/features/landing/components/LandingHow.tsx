import { LANDING_STEPS } from "../utils/landingContent";

import { StepCard } from "./StepCard";
import { StepPreview } from "./StepPreview";


interface LandingHowProps {
    activeStep: number;
    onSelectStep: (index: number) => void;
    onPauseChange: (paused: boolean) => void;
}

export const LandingHow = ({
    activeStep,
    onSelectStep,
    onPauseChange,
}: LandingHowProps) => {
    return (
        <section id="how" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-16 max-w-xl leading-tight">
                Tres pasos para la paz financiera
            </h2>

            <div
                id="features"
                className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 lg:gap-10 items-stretch"
                onMouseEnter={() => onPauseChange(true)}
                onMouseLeave={() => onPauseChange(false)}
            >
                <div className="relative flex flex-col gap-4">
                    <div className="pointer-events-none absolute left-0 top-6 bottom-6 hidden w-px bg-light-10 sm:block" />

                    {LANDING_STEPS.map((step, index) => (
                        <div key={step.number} className="relative sm:pl-8">
                            <span
                                className={`absolute left-0 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 sm:block ${
                                    activeStep === index
                                        ? "bg-light"
                                        : "bg-helper"
                                }`}
                            />
                            <StepCard
                                number={step.number}
                                title={step.title}
                                desc={step.desc}
                                active={activeStep === index}
                                onSelect={() => onSelectStep(index)}
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
                            alt={step.alt}
                            label={step.title}
                            active={activeStep === index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
