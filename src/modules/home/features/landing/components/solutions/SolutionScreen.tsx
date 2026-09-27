import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { SOLUTION_STEPS } from "../../utils/landingContent";

interface SolutionScreenProps {
    step: (typeof SOLUTION_STEPS)[number];
    className?: string;
}

export const SolutionScreen = ({ step, className = "" }: SolutionScreenProps) => {
    const { t } = useTranslation();
    const { id, path, image, focus } = step;

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="w-full rounded-2xl border border-light-10 bg-surface-hard p-2 shadow-custom md:p-2.5">
                <div className="overflow-hidden rounded-lg border border-light-5 bg-surface">
                    <div className="relative flex items-center gap-2 border-b border-light-10 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                        <span className="h-2.5 w-2.5 rounded-full bg-light-10" />
                        <span className="absolute left-1/2 -translate-x-1/2 rounded-md bg-surface-hard px-3 py-1 font-mono text-[11px] text-helper">
                            bflow-studio.com{path}
                        </span>
                    </div>

                    <div className="relative aspect-2/1 overflow-hidden bg-surface-hard">
                        <AnimatePresence initial={false}>
                            <motion.img
                                key={id}
                                src={image}
                                alt={t(`home.solutions.items.${id}.title`)}
                                loading="lazy"
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ opacity: 1, scale: focus.scale }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 1.2, ease: "easeOut", delay: 0.2 },
                                }}
                                style={{ transformOrigin: focus.origin }}
                                onError={(event) => {
                                    event.currentTarget.style.visibility = "hidden";
                                }}
                                className="absolute inset-0 h-full w-full object-cover object-top"
                            />
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-center pt-2 md:pt-2.5">
                    <span className="h-1 w-1 rounded-full bg-light-25" />
                </div>
            </div>

            <div
                aria-hidden="true"
                className="h-10 w-20 bg-light-10 [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)] md:h-14 md:w-28"
            />
            <div
                aria-hidden="true"
                className="h-2 w-40 rounded-t-sm rounded-b-xl border border-light-10 bg-surface-hard md:h-2.5 md:w-56"
            />
        </div>
    );
};
