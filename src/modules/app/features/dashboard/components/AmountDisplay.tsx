import { formatCurrency } from "@/utils/formaters";

export const AmountDisplay = ({ amount, currency }: { amount: number; currency: string }) => {
    const formatted = formatCurrency(amount, currency);
    const decimalIndex = formatted.lastIndexOf(".");

    if (decimalIndex === -1) {
        return (
            <p className="mt-1.5 text-3xl font-semibold tracking-tight text-light">
                {formatted}
            </p>
        );
    }

    const whole = formatted.slice(0, decimalIndex);
    const cents = formatted.slice(decimalIndex);

    return (
        <p className="mt-1.5 text-3xl font-semibold tracking-tight text-light">
            {whole}
            <span className="font-medium text-light-75">{cents}</span>
        </p>
    );
};
