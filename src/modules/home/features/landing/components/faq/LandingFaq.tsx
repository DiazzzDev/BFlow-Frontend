import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LANDING_FAQS } from "../../utils/landingContent";

import { FaqItem } from "./FaqItem";

export const LandingFaq = () => {
    const { t } = useTranslation();

    // One question open at a time
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    return (
        <section id="faq" className="w-full bg-surface-hard" aria-labelledby="faq-title">
            <div className="mx-auto grid w-full max-w-7xl gap-7 px-4 py-14 sm:px-8 md:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
                <div className="lg:sticky lg:top-28 lg:h-fit">
                    <h2 id="faq-title" className="text-3xl font-bold tracking-tight md:text-5xl">
                        {t("home.faqTitle")}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-helper md:text-base">
                        {t("home.faqDescription")}{" "}
                        <Link
                            to="/contact"
                            className="font-medium text-primary transition-colors hover:text-primary-dark"
                        >
                            {t("home.faqContact")}
                        </Link>
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {LANDING_FAQS.map((faq, index) => (
                        <FaqItem
                            key={faq.question}
                            question={t(`home.faq.${index}.question`, { defaultValue: faq.question })}
                            answer={t(`home.faq.${index}.answer`, { defaultValue: faq.answer })}
                            reference={faq.reference}
                            referenceLabel={faq.reference ? t("home.wompiReference") : undefined}
                            open={openFaq === index}
                            onToggle={() => toggleFaq(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
