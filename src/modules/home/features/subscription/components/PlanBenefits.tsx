import { PlanBenefit } from "../../landing/interfaces/Plan";

interface PlanBenefitsProps {
    benefits: PlanBenefit[];
}

export const PlanBenefits = ({ benefits }: PlanBenefitsProps) => {

    return (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
                <li
                    key={benefit.code}
                    className="flex items-start gap-3 text-sm leading-6 text-label"
                >
                    <span
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 font-bold text-primary"
                    >
                        ✓
                    </span>
                    {benefit.limit ?
                        (
                            <span>{benefit.name} ({benefit.limit})</span>
                        ) : (
                            <span>{benefit.name}</span>
                        )
                    }

                </li>
            ))}
        </ul>
    );
};