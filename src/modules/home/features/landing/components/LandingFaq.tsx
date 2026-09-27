import { LANDING_FAQS } from "../utils/landingContent";
import { useTranslation } from "react-i18next";

import { FaqItem } from "./FaqItem";


interface LandingFaqProps {
    openFaq: number | null;
    onToggleFaq: (index: number) => void;
}

export const LandingFaq = ({ openFaq, onToggleFaq }: LandingFaqProps) => {
    const { t } = useTranslation();
    return (
        <section id="faq" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-14">
                {t("home.faqTitle")}
            </h2>

            <div className="flex flex-col gap-4">
                {LANDING_FAQS.map((faq, index) => (
                    <FaqItem
                        key={faq.question}
                        question={t(`home.faq.${index}.question`, { defaultValue: faq.question })}
                        answer={t(`home.faq.${index}.answer`, { defaultValue: faq.answer })}
                        reference={faq.reference}
                        referenceLabel={faq.reference ? t("home.wompiReference") : undefined}
                        open={openFaq === index}
                        onToggle={() => onToggleFaq(index)}
                    />
                ))}
            </div>
        </section>
    );
};
