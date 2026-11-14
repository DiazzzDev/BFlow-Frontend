import { expect, test } from "@playwright/test";

import { hasCredentials, loginForE2E } from "./authenticated";

test.describe("dashboard", () => {
    test.skip(!hasCredentials, "Set PLAYWRIGHT_E2E_EMAIL and PLAYWRIGHT_E2E_PASSWORD to run authenticated E2E tests.");

    test.beforeEach(async ({ page }) => {
        await loginForE2E(page);
    });

    test("shows dashboard cards and filters recent activity without another detail request", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByText(/recent activity|actividad reciente/i)).toBeVisible();

        const activityRequest = page.waitForResponse((response) =>
            response.url().includes("/api/v1/dashboard/recent-activity") && response.request().method() === "GET",
        );
        await page.getByRole("searchbox").fill("test");
        await activityRequest;

        const firstActivity = page.getByTestId("recent-activity-row").first();
        const detailRequestCountBefore = await page.evaluate(() => performance.getEntriesByType("resource")
            .filter((entry) => entry.name.includes("/api/v1/dashboard/recent-activity")).length);
        if (await firstActivity.isVisible().catch(() => false)) {
            await firstActivity.click();
            await expect(page.getByText(/transaction date|fecha de transacción/i)).toBeVisible();
            const detailRequestCountAfter = await page.evaluate(() => performance.getEntriesByType("resource")
                .filter((entry) => entry.name.includes("/api/v1/dashboard/recent-activity")).length);
            expect(detailRequestCountAfter).toBe(detailRequestCountBefore);
        }
    });
});
