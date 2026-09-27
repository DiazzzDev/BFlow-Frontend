import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SolutionScreen } from "./SolutionScreen";
import { SolutionStep } from "./SolutionStep";

import { SOLUTION_STEPS } from "../../utils/landingContent";

export const LandingSolutions = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const activeStep = SOLUTION_STEPS[activeIndex] ?? SOLUTION_STEPS[0];

    return (
        <section id="modules" className="px-8 pb-28 md:pb-36 w-full max-w-360">
            <div className="max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {t("home.solutions.eyebrow")}
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                    {t("home.solutions.title")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-helper md:text-base">
                    {t("home.solutions.description")}
                </p>
            </div>

            <div className="mt-6 grid gap-12 lg:mt-0 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                    {SOLUTION_STEPS.map((step, index) => (
                        <SolutionStep
                            key={step.id}
                            step={step}
                            index={index}
                            isActive={index === activeIndex}
                            onActivate={setActiveIndex}
                        />
                    ))}
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-[calc(50vh-17rem)]">
                        {activeStep && <SolutionScreen step={activeStep} />}

                        <div className="mt-5 flex justify-center gap-2">
                            {SOLUTION_STEPS.map(({ id }, index) => (
                                <span
                                    key={id}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index === activeIndex ? "w-8 bg-primary" : "w-1.5 bg-light-25"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
