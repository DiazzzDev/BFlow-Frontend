import { LANDING_FAQS } from "../utils/landingContent";

import { FaqItem } from "./FaqItem";

interface LandingFaqProps {
    openFaq: number | null;
    onToggleFaq: (index: number) => void;
}

export const LandingFaq = ({ openFaq, onToggleFaq }: LandingFaqProps) => {
    return (
        <section id="faq" className="px-8 md:px-16 xl:px-24 pb-28 md:pb-36">
            <p className="mb-3 text-sm font-medium text-primary">FAQ</p>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 md:mb-14">
                Preguntas frecuentes
            </h2>

            <div className="flex flex-col gap-3 max-w-3xl">
                {LANDING_FAQS.map((faq, index) => (
                    <FaqItem
                        key={faq.question}
                        question={faq.question}
                        answer={faq.answer}
                        open={openFaq === index}
                        onToggle={() => onToggleFaq(index)}
                    />
                ))}
            </div>
        </section>
    );
};