import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LANDING_FAQS } from "../../utils/landingContent";

import { FaqItem } from "./FaqItem";

export const LandingFaq = () => {
    const { t } = useTranslation();

    // One question open at a time
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq((current) => (current === index ? null : index));
    };

    return (
        <section id="faq" className="w-full bg-surface">
            <div className="mx-auto grid w-full max-w-360 gap-10 px-8 py-20 md:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
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

                <div className="flex flex-col gap-4">
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
