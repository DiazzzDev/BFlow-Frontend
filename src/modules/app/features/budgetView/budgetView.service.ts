export interface BudgetDetail {
    id: string;
    name: string;
    frequency: string;
    scope: string;
    statusLabel: string;
    remaining: number;
    spent: number;
    budget: number;
    daysLeft: number;
    currency: string;
    trend: number[];
    recentActivity: Array<{
        id: string;
        title: string;
        dateLabel: string;
        amount: number;
    }>;
}

const MOCK_BUDGET_DETAILS: BudgetDetail[] = [
    {
        id: "1",
        name: "Food",
        frequency: "Monthly",
        scope: "Wallet",
        statusLabel: "Active",
        remaining: 0,
        spent: 120,
        budget: 120,
        daysLeft: 12,
        currency: "USD",
        trend: [12, 18, 15, 22, 28, 25, 32, 30, 38, 42, 40, 48, 52, 50, 55, 58, 54, 60, 57, 62],
        recentActivity: [
            {
                id: "a1",
                title: "Grocery store",
                dateLabel: "Oct 23, 2025",
                amount: 24.5,
            },
            {
                id: "a2",
                title: "Coffee shop",
                dateLabel: "Oct 22, 2025",
                amount: 6.2,
            },
        ],
    },
    {
        id: "2",
        name: "Credit card",
        frequency: "Monthly",
        scope: "Wallet",
        statusLabel: "Active",
        remaining: 90,
        spent: 10,
        budget: 100,
        daysLeft: 12,
        currency: "USD",
        trend: [10, 12, 14, 13, 18, 20, 22, 25, 24, 28, 30, 33, 35, 38, 40, 42, 45, 48, 52, 55],
        recentActivity: [
            {
                id: "a1",
                title: "Netflix subscription",
                dateLabel: "Oct 23, 2025",
                amount: 3.99,
            },
            {
                id: "a2",
                title: "Spotify Premium",
                dateLabel: "Oct 22, 2025",
                amount: 8.99,
            },
            {
                id: "a3",
                title: "Amazon Prime",
                dateLabel: "Oct 20, 2025",
                amount: 14.99,
            },
        ],
    },
    {
        id: "3",
        name: "Savings",
        frequency: "Monthly",
        scope: "Wallet",
        statusLabel: "Active",
        remaining: 40,
        spent: 160,
        budget: 200,
        daysLeft: 8,
        currency: "USD",
        trend: [20, 25, 30, 28, 35, 40, 42, 48, 50, 55, 52, 58, 60, 62, 65, 68, 70, 72, 75, 80],
        recentActivity: [
            {
                id: "a1",
                title: "Transfer to savings",
                dateLabel: "Oct 21, 2025",
                amount: 50,
            },
        ],
    },
    {
        id: "4",
        name: "Entertainment",
        frequency: "Monthly",
        scope: "Wallet",
        statusLabel: "Active",
        remaining: 20,
        spent: 60,
        budget: 80,
        daysLeft: 15,
        currency: "USD",
        trend: [8, 10, 12, 15, 14, 18, 20, 22, 25, 24, 28, 30, 32, 35, 34, 38, 40, 42, 45, 48],
        recentActivity: [
            {
                id: "a1",
                title: "Cinema",
                dateLabel: "Oct 19, 2025",
                amount: 18,
            },
        ],
    },
];

export const getBudgetById = async (budgetId: string): Promise<BudgetDetail | null> => {
    // Mock async lookup until the budgets API exists.
    await Promise.resolve();
    return MOCK_BUDGET_DETAILS.find((budget) => budget.id === budgetId) ?? null;
};
