import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SolutionScreen } from "./SolutionScreen";

import { MODULES_PAGE_HREF, SOLUTION_STEPS } from "../../utils/landingContent";

interface SolutionStepProps {
    step: (typeof SOLUTION_STEPS)[number];
    index: number;
    isActive: boolean;
    onActivate: (index: number) => void;
}

export const SolutionStep = ({ step, index, isActive, onActivate }: SolutionStepProps) => {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);
    // Only the step crossing the vertical center of the viewport is "in view"
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            onActivate(index);
        }
    }, [isInView, index, onActivate]);

    const { id, Icon } = step;
    const label = t(`home.solutions.items.${id}.label`);
    const highlights = t(`home.solutions.items.${id}.highlights`, {
        returnObjects: true,
    });

    return (
        <div ref={ref} className="flex flex-col justify-center py-10 lg:min-h-[75vh] lg:py-0">
            <div
                className={`border-l-2 pl-6 transition-all duration-500 lg:pl-8 ${
                    isActive ? "border-primary lg:opacity-100" : "border-light-10 lg:opacity-40"
                }`}
            >
                <div className="flex items-center gap-2.5 text-sm font-medium text-label">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-15 text-primary">
                        <Icon className="h-4 w-4" />
                    </span>
                    {label}
                </div>

                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-light md:text-3xl">
                    {t(`home.solutions.items.${id}.title`)}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-helper md:text-base">
                    {t(`home.solutions.items.${id}.description`)}
                </p>

                <ul className="mt-5 flex flex-col gap-2">
                    {highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm text-label">
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                            {highlight}
                        </li>
                    ))}
                </ul>

                <a
                    href={MODULES_PAGE_HREF}
                    className="group/link mt-7 inline-flex w-fit items-center gap-2 rounded-lg border border-light-10 px-4 py-2 text-sm font-medium text-light transition-colors hover:border-primary hover:bg-primary"
                >
                    {t("home.solutions.learnMore", { module: label })}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </a>
            </div>

            <SolutionScreen step={step} className="mt-8 lg:hidden" />
        </div>
    );
};
