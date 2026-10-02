import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import BflowLogo from "@/assets/BFlow logo.svg";

const DOTS = 3;

export const CallbackLoader = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-light-10 bg-surface px-8 py-10 text-center shadow-custom"
        >
            <div className="relative flex h-16 w-16 items-center justify-center">
                <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl border border-primary"
                    animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-light-10 bg-surface-hard"
                >
                    <img src={BflowLogo} alt="" className="h-8 w-auto" />
                </motion.div>
            </div>

            <p className="mt-7 flex items-baseline text-base font-semibold text-light">
                {t("auth.oauthSigningIn")}
                <span aria-hidden="true" className="ml-0.5 inline-flex">
                    {Array.from({ length: DOTS }, (_, index) => (
                        <motion.span
                            key={index}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.2 }}
                        >
                            .
                        </motion.span>
                    ))}
                </span>
            </p>
            <p className="mt-1.5 text-sm text-helper">{t("auth.oauthPreparing")}</p>

            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-light-10">
                <motion.div
                    className="h-full w-1/3 rounded-full bg-primary"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
};
