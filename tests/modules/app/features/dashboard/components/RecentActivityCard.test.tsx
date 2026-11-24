import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecentActivityCard } from "@/modules/app/features/dashboard/components/RecentActivityCard";
import type { RecentActivityItem } from "@/modules/app/features/dashboard/interfaces/dashboard";

import { renderWithAppProviders } from "../../../testUtils";

const activity: RecentActivityItem = {
    id: "activity-1",
    type: "INCOME",
    name: "Salary",
    description: "November payroll",
    amount: 100,
    currency: "USD",
    date: "2026-11-05",
    createdAt: "2026-11-05T10:30:00Z",
    walletName: "Personal",
    source: "recurring",
    categoryColor: "#22C55E",
    categoryIcon: "briefcase",
};

describe("RecentActivityCard", () => {
    it("uses the already-loaded item to show its detail, including description", () => {
        renderWithAppProviders(
            <RecentActivityCard
                isLoading={false}
                activities={[activity]}
                activityType="ALL"
                activityQuery=""
                onActivityTypeChange={vi.fn()}
                onActivityQueryChange={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: /salary/i }));

        expect(screen.getByText("November payroll")).toBeInTheDocument();
        expect(screen.getByText(/transaction date/i)).toBeInTheDocument();
        expect(screen.getByText(/recurring/i)).toBeInTheDocument();
    });

    it("sends search changes to the parent and renders a filtered empty state", () => {
        const onActivityQueryChange = vi.fn();
        renderWithAppProviders(
            <RecentActivityCard
                isLoading={false}
                activities={[]}
                activityType="EXPENSE"
                activityQuery="coffee"
                onActivityTypeChange={vi.fn()}
                onActivityQueryChange={onActivityQueryChange}
            />,
        );

        fireEvent.change(screen.getByRole("searchbox"), { target: { value: "rent" } });

        expect(onActivityQueryChange).toHaveBeenCalledWith("rent");
        expect(screen.getByText(/no matches/i)).toBeInTheDocument();
    });
});
