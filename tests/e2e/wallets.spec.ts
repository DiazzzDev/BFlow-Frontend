import { expect, test } from "@playwright/test";

import { hasCredentials, loginForE2E } from "./authenticated";

test.describe("wallets", () => {
    test.skip(!hasCredentials, "Set PLAYWRIGHT_E2E_EMAIL and PLAYWRIGHT_E2E_PASSWORD to run authenticated E2E tests.");

    test.beforeEach(async ({ page }) => {
        await loginForE2E(page);
        await page.goto("/app/wallets");
    });

    test("lists, searches, and switches wallet scopes", async ({ page }) => {
        await expect(page.getByPlaceholder(/search wallets|buscar cartera/i)).toBeVisible();
        await page.getByPlaceholder(/search wallets|buscar cartera/i).fill("test");
        await expect(page).toHaveURL(/query=test/);

        await page.getByRole("button", { name: /shared wallets|compartidas/i }).click();
        await expect(page).toHaveURL(/walletType=SHARED/);
        await expect(page.getByRole("button", { name: /create wallet|crear cartera/i })).toBeVisible();
    });
});
