import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { formatCurrency } from "@/utils/formatters/formatCurrency"

export interface WalletItemProps {
    title: string
    subtitle: string
    meta: string
    dateLabel: string
    amount: number
    currency?: string
    to?: string
    showChevron?: boolean
    /** Color for positive amounts. List uses info; detail uses success. */
    positiveAmountClassName?: string
    className?: string
}

export const WalletItem = ({
    title,
    subtitle,
    meta,
    dateLabel,
    amount,
    currency = "USD",
    to,
    showChevron = Boolean(to),
    positiveAmountClassName = "text-success",
    className = ''
}: WalletItemProps) => {
    const isNegative = amount < 0

    const content = (
        <div className={`flex justify-between items-center gap-4 py-6 border-b border-b-2 border-border hover:bg-secondary/40 transition-colors px-2 ${className}`}>
            <div className="min-w-0 w-[28%]">
                <p className="text-sm font-semibold text-foreground truncate">
                    {title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {subtitle}
                </p>
            </div>

            <p className="text-sm text-muted-foreground text-center truncate flex-1">
                {meta}
            </p>

            <p className="text-sm text-muted-foreground text-center truncate flex-1">
                {dateLabel}
            </p>

            <p
                className={`text-sm font-semibold text-right tabular-nums min-w-20 ${
                    isNegative ? "text-danger" : positiveAmountClassName
                }`}
            >
                {formatCurrency(amount, currency)}
            </p>

            {showChevron && (
                <ChevronRight className="h-7 w-7 text-foreground shrink-0" />
            )}
        </div>
    )

    if (to) {
        return (
            <Link to={to} className="block">
                {content}
            </Link>
        )
    }

    return <div>{content}</div>
}
