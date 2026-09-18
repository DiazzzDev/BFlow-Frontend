import type { EnrichedRecurring, RecurringOccurrenceSource } from "../interfaces/Calendar";

import type { Category } from "@/modules/app/interfaces/Category";
import type { Wallet } from "@/modules/app/interfaces/Wallet";

export const enrichRecurring = (
    items: RecurringOccurrenceSource[],
    categories: Category[],
    wallets: Wallet[],
): EnrichedRecurring[] => {
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const walletById = new Map(wallets.map((wallet) => [wallet.id, wallet]));

    return items.map((item) => {
        const category = categoryById.get(item.categoryId);
        const wallet = walletById.get(item.walletId);

        return {
            ...item,
            categoryName: category?.name ?? null,
            categoryIcon: category?.icon ?? null,
            categoryColor: category?.color ?? null,
            walletName: wallet?.name ?? null,
        };
    });
};
